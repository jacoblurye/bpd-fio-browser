import uniqueValues from "__generated__/unique-values.json";
import zipToNeighborhood from "json/zip-to-neighborhood.json";
import FlexSearch, { Index } from "flexsearch";
import { mapValues, flatMap, Dictionary } from "lodash";
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

const indexes: Dictionary<Index<string>> = {
  contactOfficerName: createIndex("contactOfficerName"),
  basis: createIndex("basis"),
  year: createIndex("year"),
  supervisorName: createIndex("supervisorName"),
};

const limit = 5;
const searchField = (field: SuggestibleField, query: string) => {
  if (field === "zip") {
    return Object.entries(zipToNeighborhood)
      .filter(
        ([zip, area]) =>
          query && (area.startsWith(query) || zip.startsWith(query))
      )
      .slice(0, limit)
      .map(([zip]) => zip);
  }

  const index = indexes[field];
  // @ts-ignore
  const itemIndexes: number[] = index.search(query, { limit });
  const fieldValues: string[] = nonNullValues[field];
  const items = itemIndexes.map((idx) => fieldValues[idx]);
  return items;
};

const getSuggestions = (query: string): Record<SuggestibleField, string[]> => ({
  contactOfficerName: searchField("contactOfficerName", query),
  supervisorName: searchField("supervisorName", query),
  zip: searchField("zip", query),
  basis: searchField("basis", query),
  year: searchField("year", query),
});

export default getSuggestions;
