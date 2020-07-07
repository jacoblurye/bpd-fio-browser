import uniqueValues from "__generated__/unique-values.json";
import FlexSearch, { Index } from "flexsearch";
import { mapValues, flatMap } from "lodash";

type UniqueValuesKey = keyof typeof uniqueValues;

const nonNullValues = mapValues(uniqueValues, (values: (string | null)[]) =>
  flatMap(values, (v) => v || [])
);

const createIndex = (field: UniqueValuesKey) => {
  const index = FlexSearch.create<string>();
  nonNullValues[field].forEach((v, i) => {
    if (v) {
      index.add(i, v);
    }
  });
  return index;
};

const indexes: Record<UniqueValuesKey, Index<string>> = {
  contactOfficerName: createIndex("contactOfficerName"),
  zip: createIndex("zip"),
};

const limit = 5;
const searchField = (field: UniqueValuesKey, query: string) => {
  const index = indexes[field];
  // @ts-ignore
  const itemIndexes: number[] = index.search(query, { limit });
  const fieldValues: string[] = nonNullValues[field];
  const items = itemIndexes.map((idx) => fieldValues[idx]);
  return items;
};

const getSuggestions = (query: string): Record<UniqueValuesKey, string[]> => ({
  contactOfficerName: searchField("contactOfficerName", query),
  zip: searchField("zip", query),
});

export default getSuggestions;
