import {
  FieldContact,
  Person,
  SearchResultSummary,
  FCSearchResult,
  SearchOptions,
  SearchField,
} from "interfaces";
import { NextApiRequest, NextApiResponse } from "next";
import FlexSearch, { CreateOptions, Index, SearchResults } from "flexsearch";
import { addHeaders } from "utils/api-helpers";
import { countBy, Dictionary, groupBy, flatMap, uniqBy } from "lodash";
import flexSearchConfig from "flexsearch.json";
import loadFieldContactIndex from "__generated__/field-contact-index";
import { addObjectValues } from "utils/collection-helpers";

const LIMIT = 1e10;

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

const makeRequired = (field: SearchField): SearchField => ({
  ...field,
  bool: "and",
});

const getAllQueryResults = async (
  index: Index<FieldContact>,
  query: SearchField[]
) => {
  const queryGroups = Object.values(groupBy(query, "field"));
  const queries = queryGroups.reduce((queries, queryGroup) => {
    return queries.length > 0
      ? flatMap(queryGroup, (q) =>
          queries.map((qs) => [...qs, makeRequired(q)])
        )
      : queryGroup.map((q) => [makeRequired(q)]);
  }, [] as SearchField[][]);

  const allReports = uniqBy(
    // @ts-ignore
    flatMap(queries, (q) => index.search(q, LIMIT)) as FieldContact[],
    "narrative"
  );

  return allReports;
};

const getQueryResult = async (
  index: Index<FieldContact>,
  options: SearchOptions
) => {
  const { query, page, limit } = options;
  const allReports: FieldContact[] = await getAllQueryResults(index, query);

  const loPage = page === true || page === undefined ? 0 : toNumber(page);
  const hiPage = limit ? loPage + toNumber(limit) : undefined;
  const reports = allReports.slice(loPage, hiPage);
  const next =
    hiPage && allReports.slice(hiPage, hiPage + 1).length > 0
      ? hiPage.toString()
      : undefined;

  const results: SearchResults<FieldContact> = {
    result: reports,
    page: loPage.toString(),
    next,
  };

  return results;
};

const countByPersonField = (
  fcs: FieldContact[],
  field: keyof Person
): Dictionary<number> => {
  return fcs.reduce((overallCounts, fc) => {
    let personCounts = countBy(fc.people, field);

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
  const reports: FieldContact[] = await getAllQueryResults(index, query);
  const total = reports.length;
  const totalByFrisked = countBy(reports, "fcInvolvedFriskOrSearch");
  const totalByZip = countBy(reports, "zip");
  const totalByBasis = countBy(reports, "basis");
  const totalByRace = countByPersonField(reports, "race");
  const totalByGender = countByPersonField(reports, "gender");
  const totalByAge = countByPersonField(reports, "age");
  const summary: SearchResultSummary = {
    total,
    totalByFrisked,
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
