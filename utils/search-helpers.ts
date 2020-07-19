import {
  SearchField,
  FieldContact,
  SearchOptions,
  Person,
  SearchResultSummary,
  SearchResult,
} from "interfaces";
import FlexSearch, { Index, CreateOptions } from "flexsearch";
import { countBy, Dictionary, groupBy, flatMap, uniqBy } from "lodash";
import loadFieldContactIndex from "__generated__/field-contact-index";
import flexSearchConfig from "flexsearch.json";
import { addObjectValues } from "./collection-helpers";

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

const getAllQueryResults = async (query: SearchField[]) => {
  const index = getIndex();

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

export const getQueryResult = async (options: SearchOptions) => {
  const { query, page, limit } = options;
  const allReports: FieldContact[] = await getAllQueryResults(query);

  const loPage = page === true || page === undefined ? 0 : toNumber(page);
  const hiPage = limit ? loPage + toNumber(limit) : undefined;
  const reports = allReports.slice(loPage, hiPage);
  const next =
    hiPage && allReports.slice(hiPage, hiPage + 1).length > 0
      ? hiPage.toString()
      : undefined;

  const results: SearchResult = {
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

export const getQuerySummary = async ({
  query,
}: SearchOptions): Promise<SearchResultSummary> => {
  // @ts-ignore
  const reports: FieldContact[] = await getAllQueryResults(query);
  const total = reports.length;
  const totalByFrisked = countBy(reports, "fcInvolvedFriskOrSearch");
  const totalByZip = countBy(reports, "zip");
  const totalByBasis = countBy(reports, "basis");
  const totalByRace = countByPersonField(reports, "race");
  const totalByEthnicity = countByPersonField(reports, "ethnicity");
  const totalByGender = countByPersonField(reports, "gender");
  const totalByAge = countByPersonField(reports, "age");
  const summary: SearchResultSummary = {
    total,
    totalByFrisked,
    totalByZip,
    totalByRace,
    totalByEthnicity,
    totalByGender,
    totalByBasis,
    totalByAge,
  };

  return summary;
};
