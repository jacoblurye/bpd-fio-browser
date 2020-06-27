import { FieldContact } from "interfaces";
import { NextApiRequest, NextApiResponse } from "next";
import FlexSearch, {
  CreateOptions,
  Index,
  SearchResults,
  SearchOptions,
} from "flexsearch";
import { addHeaders } from "utils/api-helpers";
import countBy from "lodash/countBy";
import flexSearchConfig from "flexsearch.json";
import loadFieldContactIndex from "__generated__/loadFieldContactIndex";

// The provided flexsearch types aren't accurate
type FixedSearchOptions = SearchOptions & {
  page: number;
};

export interface SearchResultsSummary {
  total: number;
  totalWithFrisk: number;
  totalByZip: Record<string, number>;
}

export interface FCSearchResult {
  results: SearchResults<FieldContact>;
  summary: SearchResultsSummary;
}

let INDEX: Index<FieldContact>;
const getIndex = () => {
  // Build the search index if it doesn't exist
  if (INDEX === undefined) {
    console.log("building new flexsearch index", Date.now());
    INDEX = FlexSearch.create(flexSearchConfig as CreateOptions);
    INDEX.import(loadFieldContactIndex());
    console.log("build complete", Date.now());
  }
  return INDEX;
};

const getQueryResult = async (
  index: Index<FieldContact>,
  query: FixedSearchOptions
) => {
  // @ts-ignore
  return index.search(query) as SearchResults<FieldContact>;
};

const getQuerySummary = async (
  index: Index<FieldContact>,
  query: FixedSearchOptions
): Promise<SearchResultsSummary> => {
  const { page, limit, ...queryWithoutLimits } = query;
  // @ts-ignore
  const result: FieldContact[] = index.search(queryWithoutLimits);
  const total = result.length;
  const totalWithFrisk = countBy(result, "fcInvolvedFriskOrSearch")["y"];
  const totalByZip = countBy(result, "zip");
  return { total, totalWithFrisk, totalByZip };
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<FCSearchResult>
) => {
  const {
    query: { q },
  } = req;

  let query;
  try {
    query = JSON.parse(q as string);
  } catch (e) {
    console.error(e);
    return res.status(400);
  }

  const index = getIndex();

  // @ts-ignore
  const [results, summary] = await Promise.all([
    getQueryResult(index, query),
    getQuerySummary(index, query),
  ]);

  addHeaders(res);
  return res.json({ results, summary });
};
