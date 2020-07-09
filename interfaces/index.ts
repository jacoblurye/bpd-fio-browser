// Shared interfaces used throughout the app.

import { Dictionary } from "lodash";
import { SearchResults, SearchOptions as FSSearchOptions } from "flexsearch";

export type FieldContact = {
  fcNum: string;
  contactDate: number;
  circumstance: "encountered" | "stopped" | "observed";
  contactOfficer: string | null;
  contactOfficerName: string | null;
  basis:
    | "encounter"
    | "probable cause"
    | "reasonable suspicion"
    | "intel"
    | null;
  fcInvolvedFriskOrSearch: "y" | "n" | null;
  narrative: string | null;
  supervisor: string | null;
  supervisorName: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  keySituations: string | null;
  summonsissued: "Y" | null;
  people: Person[];
  // etc...?
};

export type Person = {
  fcNum: string;
  race:
    | null
    | "black"
    | "white"
    | "unknown"
    | "asian"
    | "native american / alaskan native"
    | "native hawaiian / other pacific islander"
    | "other";
  ethnicity: "not of hispanic origin" | "hispanic origin" | "unknown" | null;
  skinTone: string | null;
  age: number | null;
  gender: string | null;
  build: string | null;
  hairStyle: string | null;
  otherclothing: string | null;
};

export type FieldContactCollection = {
  [fcNum: string]: FieldContact;
};

export type Officer = {
  id: string;
  name: string;
  supervisorId: string | null;
  supervisorName: string | null;
  stops: FieldContactCollection;
};

export type SearchField = {
  field: "narrative" | "contactOfficerName" | "zip";
  query: string;
  bool?: "and" | "or" | "not";
};

export type SearchOptions = FSSearchOptions & {
  query: SearchField[];
  page?: number | true;
};

export type SearchResultSummary = {
  total: number;
  totalWithFrisk: number;
  totalByZip: Dictionary<number>;
  totalByRace: Dictionary<number>;
  totalByGender: Dictionary<number>;
  totalByBasis: Dictionary<number>;
  totalByAge: Dictionary<number>;
};

export type FCSearchResult = {
  results: SearchResults<FieldContact>;
  summary: SearchResultSummary;
};
