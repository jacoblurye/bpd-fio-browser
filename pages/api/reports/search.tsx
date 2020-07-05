import {
  FieldContact,
  Person,
  SearchResultSummary,
  FCSearchResult,
  SearchOptions,
} from "interfaces";
import { NextApiRequest, NextApiResponse } from "next";
import FlexSearch, { CreateOptions, Index, SearchResults } from "flexsearch";
import { addHeaders } from "utils/api-helpers";
import { countBy, Dictionary } from "lodash";
import flexSearchConfig from "flexsearch.json";
import loadFieldContactIndex from "__generated__/field-contact-index";
import { addObjectValues } from "utils/collection-helpers";

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

const toNumber = (v: string | number) =>
  typeof v === "string" ? parseInt(v, 10) : v;

const getQueryResult = async (
  index: Index<FieldContact>,
  options: SearchOptions
) => {
  const { query, page, limit } = options;
  const loPage = page === true || page === undefined ? 0 : toNumber(page);
  const hiPage = limit ? loPage + toNumber(limit) : undefined;
  // @ts-ignore
  const reports: FieldContact[] = index.search(query).slice(loPage, hiPage);
  const next =
    // @ts-ignore
    hiPage && index.search(query).slice(hiPage, hiPage + 1).length > 0
      ? hiPage.toString()
      : undefined;
  const results: SearchResults<FieldContact> = {
    result: reports,
    page: loPage.toString(),
    next,
  };
  return results;
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

let SUMMARY_CACHE: Dictionary<SearchResultSummary> = {};
const getQuerySummary = async (
  index: Index<FieldContact>,
  { query }: SearchOptions
): Promise<SearchResultSummary> => {
  const queryStr = JSON.stringify(query);
  if (queryStr in SUMMARY_CACHE) {
    return SUMMARY_CACHE[queryStr];
  }

  // @ts-ignore
  const result: FieldContact[] = index.search(query);
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
  SUMMARY_CACHE[queryStr] = summary;

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
