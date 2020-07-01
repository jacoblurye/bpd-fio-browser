import {
  FieldContact,
  Person,
  FCSearchResultSummary,
  FCSearchResult,
} from "interfaces";
import { NextApiRequest, NextApiResponse } from "next";
import FlexSearch, {
  CreateOptions,
  Index,
  SearchResults,
  SearchOptions,
} from "flexsearch";
import { addHeaders } from "utils/api-helpers";
import { countBy, Dictionary } from "lodash";
import flexSearchConfig from "flexsearch.json";
import loadFieldContactIndex from "__generated__/loadFieldContactIndex";
import { addObjectValues } from "utils/collection-helpers";

// The provided flexsearch types aren't accurate
type FixedSearchOptions = SearchOptions & {
  query: string;
  page?: number | true;
};

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

const countByWithoutNull = (...args: Parameters<typeof countBy>) => {
  let counts = countBy(...args);
  // @ts-ignore
  if (counts["null"]) {
    counts.unknown = (counts.unknown || 0) + counts["null"];
    delete counts["null"];
  }
  return counts;
};

const countByPersonField = (
  fcs: FieldContact[],
  field: keyof Person
): Dictionary<number> => {
  return fcs.reduce((overallCounts, fc) => {
    let personCounts = countByWithoutNull(fc.people, field);

    return addObjectValues(overallCounts, personCounts);
  }, {});
};

let SUMMARY_CACHE: Dictionary<FCSearchResultSummary> = {};
const getQuerySummary = async (
  index: Index<FieldContact>,
  query: FixedSearchOptions
): Promise<FCSearchResultSummary> => {
  if (query.query in SUMMARY_CACHE) {
    return SUMMARY_CACHE[query.query];
  }

  const { page, limit, ...queryWithoutLimits } = query;
  // @ts-ignore
  const result: FieldContact[] = index.search(queryWithoutLimits);
  const total = result.length;
  const { y: totalWithFrisk } = countByWithoutNull(
    result,
    "fcInvolvedFriskOrSearch"
  );
  const totalByZip = countByWithoutNull(result, "zip");
  const totalByBasis = countByWithoutNull(result, "basis");
  const totalByRace = countByPersonField(result, "race");
  const totalByGender = countByPersonField(result, "gender");
  const totalByAge = countByPersonField(result, "age");
  const summary = {
    total,
    totalWithFrisk,
    totalByZip,
    totalByRace,
    totalByGender,
    totalByBasis,
    totalByAge,
  };

  // Add summary to the cache
  SUMMARY_CACHE[query.query] = summary;

  return summary;
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
