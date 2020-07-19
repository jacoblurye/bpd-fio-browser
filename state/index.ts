import React from "react";
import axios, { AxiosRequestConfig } from "axios";
import {
  atom,
  selector,
  selectorFamily,
  useRecoilCallback,
  useRecoilValue,
  useRecoilValueLoadable,
  useRecoilState,
  useSetRecoilState,
} from "recoil";
import {
  FieldContact,
  SearchResultSummary,
  SearchField,
  SearchResult,
} from "interfaces";
import { isEqual } from "lodash";
import { useRouter } from "next/dist/client/router";

export const searchPage = atom<string | boolean>({
  key: "searchPage",
  default: true,
});

export const searchLoadedReports = atom<FieldContact[]>({
  key: "searchLoadedReports",
  default: [],
});

export const searchFilters = atom<SearchField[]>({
  key: "searchFilters",
  default: [],
});

export const useSearchFilters = () => {
  const filterParam = "filters";

  const router = useRouter();

  const [filters, _setFilters] = useRecoilState(searchFilters);

  // Sync filter state with the URL query param
  React.useEffect(() => {
    const queryFilterString = router.query[filterParam];
    if (queryFilterString) {
      const queryFilters: SearchField[] = Array.isArray(queryFilterString)
        ? queryFilterString.map((v) => JSON.parse(v))
        : JSON.parse(queryFilterString);
      if (!isEqual(queryFilters, filters)) {
        _setFilters(queryFilters);
      }
    }
  }, [router]);

  const setLoadedReports = useSetRecoilState(searchLoadedReports);
  const clearLoadedReports = () => setLoadedReports([]);

  const setFilters = (filters: SearchField[]) => {
    clearLoadedReports();
    // Sync URL query param with filter state
    router.push({
      pathname: router.pathname,
      query: { [filterParam]: JSON.stringify(filters) },
    });
    _setFilters(filters);
  };

  const has = (filter: Omit<SearchField, "bool">) => {
    return (
      filters.filter(
        ({ field, query }) => filter.field === field && filter.query === query
      ).length >= 1
    );
  };
  const add = (filter: Omit<SearchField, "bool">) => {
    if (!has(filter)) {
      setFilters([...filters, filter]);
    }
  };
  const remove = (filter: SearchField) => {
    const newFilters = filters.filter(
      ({ field, query }) => !(filter.field === field && filter.query === query)
    );
    setFilters(newFilters);
  };

  return { filters, has, add, remove, setAll: setFilters };
};

const apiWithErrorHandling = async <T>(config: AxiosRequestConfig) => {
  try {
    const { data } = await axios(config);
    return data as T;
  } catch (e) {
    // TODO: actually handle errors
  }
};

export const searchResultQuery = selectorFamily<
  SearchResult | undefined,
  { query: SearchField[]; page: string | boolean; limit: number }
>({
  key: "searchResultQuery",
  get: (q) => async () => {
    if (q.query) {
      return apiWithErrorHandling<SearchResult>({
        method: "get",
        url: "/api/reports/search",
        params: { q },
      });
    }
  },
});

export const searchResultSummaryQuery = selectorFamily<
  SearchResultSummary | undefined,
  { query: SearchField[]; page: string | boolean; limit: number }
>({
  key: "searchResultSummaryQuery",
  get: (q) => async () => {
    if (q.query) {
      return apiWithErrorHandling<SearchResultSummary>({
        method: "get",
        url: "/api/reports/summary",
        params: { q },
      });
    }
  },
});

export const searchNewReports = selector<SearchResult | undefined>({
  key: "searchNewReports",
  get: async ({ get }) => {
    const filters = get(searchFilters);
    const page = get(searchPage);
    if (filters) {
      return get(searchResultQuery({ query: filters, page, limit: 25 }));
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
      const searchResultSummary = get(
        searchResultSummaryQuery({ query: filters, page: true, limit: 1 })
      );
      return searchResultSummary;
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
