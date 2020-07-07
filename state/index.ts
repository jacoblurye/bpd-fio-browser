import axios from "axios";
import {
  atom,
  selector,
  selectorFamily,
  useRecoilCallback,
  useRecoilValue,
  useRecoilValueLoadable,
  atomFamily,
} from "recoil";
import {
  FCSearchResult,
  FieldContact,
  SearchResultSummary,
  SearchField,
} from "interfaces";
import { SearchResults } from "flexsearch";
import { flatMap } from "lodash";

export const searchPage = atom<string | boolean>({
  key: "searchPage",
  default: true,
});

export const searchLoadedReports = atom<FieldContact[]>({
  key: "searchLoadedReports",
  default: [],
});

const _searchFilter = atomFamily<SearchField | undefined, SearchField["field"]>(
  {
    key: "_searchFilter",
    default: undefined,
  }
);

export const searchFilter = selectorFamily<
  string | undefined,
  SearchField["field"]
>({
  key: "searchFilter",
  get: (field) => ({ get }) => get(_searchFilter(field))?.query,
  set: (field) => ({ set }, query) => {
    set(
      _searchFilter(field),
      query ? { field, query: query as string, bool: "and" } : undefined
    );

    // Reset the search page and clear loaded reports
    set(searchPage, true);
    set(searchLoadedReports, []);
  },
});

export const searchFilters = selector<SearchField[] | undefined>({
  key: "searchFilters",
  get: ({ get }) => {
    return flatMap(
      ["narrative", "contactOfficerName", "zip"],
      (field: SearchField["field"]) => {
        const filter = get(_searchFilter(field));
        return filter ? filter : [];
      }
    );
  },
});

export const searchQuery = selectorFamily<
  FCSearchResult | undefined,
  { query: SearchField[]; page: string | boolean; limit: number }
>({
  key: "searchQuery",
  get: (q) => async () => {
    if (q.query) {
      try {
        const { data } = await axios.get<FCSearchResult>(
          "/api/reports/search",
          {
            params: { q },
          }
        );
        return data;
      } catch (e) {
        // TODO: catch this
      }
    }
    return undefined;
  },
});

export const searchNewReports = selector<
  SearchResults<FieldContact> | undefined
>({
  key: "searchNewReports",
  get: async ({ get }) => {
    const filters = get(searchFilters);
    const page = get(searchPage);
    if (filters) {
      return get(searchQuery({ query: filters, page, limit: 25 }))?.results;
    }
    return undefined;
  },
});

export const searchSummary = selector<SearchResultSummary | undefined>({
  key: "searchResultsSummary",
  get: async ({ get }) => {
    const filters = get(searchFilters);
    if (filters) {
      // Summary is the same no matter the value of `page` or `limit`
      const searchResults = get(
        searchQuery({ query: filters, page: true, limit: 1 })
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
