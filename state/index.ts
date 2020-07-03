import axios from "axios";
import { atom, selector, selectorFamily } from "recoil";
import {
  FCSearchResult,
  FieldContact,
  FCSearchResultSummary,
} from "interfaces";
import { SearchResults } from "flexsearch";

export const searchQuery = atom<string>({
  key: "searchQuery",
  default: "",
});

export const searchPage = atom<string | boolean>({
  key: "searchPage",
  default: true,
});

export const searchQueryResults = selectorFamily<
  FCSearchResult | undefined,
  { query: string; page: string | boolean; limit: number }
>({
  key: "searchQueryResults",
  get: (q) => async () => {
    if (q.query) {
      const { data } = await axios.get<FCSearchResult>("/api/reports/search", {
        params: { q },
      });
      return data;
    }
    return undefined;
  },
});

export const searchReports = selector<SearchResults<FieldContact> | undefined>({
  key: "searchResults",
  get: async ({ get }) => {
    const query = get(searchQuery);
    const page = get(searchPage);
    if (query) {
      return get(searchQueryResults({ query, page, limit: 25 }))?.results;
    }
    return undefined;
  },
});

export const searchSummary = selector<FCSearchResultSummary | undefined>({
  key: "searchResultsSummary",
  get: async ({ get }) => {
    const query = get(searchQuery);
    if (query) {
      // Summary is the same no matter the value of `page` or `limit`
      const searchResults = get(
        searchQueryResults({ query, page: true, limit: 1 })
      );
      return searchResults?.summary;
    }
    return undefined;
  },
});
