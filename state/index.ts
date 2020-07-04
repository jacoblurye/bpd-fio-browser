import axios from "axios";
import {
  atom,
  selector,
  selectorFamily,
  useRecoilCallback,
  useRecoilValue,
  useRecoilValueLoadable,
} from "recoil";
import {
  FCSearchResult,
  FieldContact,
  FCSearchResultSummary,
} from "interfaces";
import { SearchResults } from "flexsearch";

export const searchPage = atom<string | boolean>({
  key: "searchPage",
  default: true,
});

export const searchLoadedReports = atom<FieldContact[]>({
  key: "searchLoadedReports",
  default: [],
});

const searchQueryInternal = atom<string>({
  key: "searchQueryInternal",
  default: "",
});

export const searchQuery = selector<string>({
  key: "searchQuery",
  get: ({ get }) => get(searchQueryInternal),
  set: ({ set }, query) => {
    set(searchQueryInternal, query);

    // Reset the search page and clear loaded reports
    set(searchPage, true);
    set(searchLoadedReports, []);
  },
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

export const searchNewReports = selector<
  SearchResults<FieldContact> | undefined
>({
  key: "searchNewReports",
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

export const useReports = () => {
  const loadedReports = useRecoilValue(searchLoadedReports);
  const newReports = useRecoilValueLoadable(searchNewReports);
  return newReports.state === "hasValue" && newReports.contents
    ? [...loadedReports, ...newReports.contents.result]
    : loadedReports;
};

export const useLoadMoreReports = () =>
  useRecoilCallback(({ snapshot, set }) => async () => {
    const [loadedReports, newReports] = await Promise.all([
      snapshot.getPromise(searchLoadedReports),
      snapshot.getPromise(searchNewReports),
    ]);
    if (newReports?.result && newReports?.next) {
      set(searchPage, newReports.next);
      set(searchLoadedReports, [
        ...(loadedReports || []),
        ...newReports.result,
      ]);
    }
  });
