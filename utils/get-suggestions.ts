import uniqueValues from "__generated__/unique-values.json";
import FlexSearch, { Index } from "flexsearch";
import { mapValues, flatMap } from "lodash";
import { SuggestibleField } from "interfaces";

const nonNullValues = mapValues(uniqueValues, (values: (string | null)[]) =>
  flatMap(values, (v) => v || [])
);

const createIndex = (field: SuggestibleField) => {
  const index = FlexSearch.create<string>();
  nonNullValues[field].forEach((v, i) => {
    if (v) {
      index.add(i, v);
    }
  });
  return index;
};

const indexes: Record<SuggestibleField, Index<string>> = {
  contactOfficerName: createIndex("contactOfficerName"),
  zip: createIndex("zip"),
  basis: createIndex("basis"),
};

const limit = 5;
const searchField = (field: SuggestibleField, query: string) => {
  const index = indexes[field];
  // @ts-ignore
  const itemIndexes: number[] = index.search(query, { limit });
  const fieldValues: string[] = nonNullValues[field];
  const items = itemIndexes.map((idx) => fieldValues[idx]);
  return items;
};

const getSuggestions = (query: string): Record<SuggestibleField, string[]> => ({
  contactOfficerName: searchField("contactOfficerName", query),
  zip: searchField("zip", query),
  basis: searchField("basis", query),
});

export default getSuggestions;
