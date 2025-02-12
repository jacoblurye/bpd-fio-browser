// Shared interfaces used throughout the app.

import { Dictionary } from "lodash";
import { SearchResults, SearchOptions as FSSearchOptions } from "flexsearch";

export type FieldContact = {
  fcNum: string;
  contactDate: number;
  year: string;
  circumstance: "encountered" | "stopped" | "observed";
  contactOfficer: string;
  contactOfficerName: string;
  basis: "encounter" | "probable cause" | "reasonable suspicion" | "intel";
  fcInvolvedFriskOrSearch: "y" | "n";
  narrative: string;
  supervisor: string;
  supervisorName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  keySituations: string;
  summonsissued: string;
  includedGenders: string;
  includedEthnicities: string;
  includedRaces: string;
  people: Person[];
  // etc...?
};

export type Person = {
  fcNum: string;
  race: string;
  ethnicity: string;
  skinTone: string;
  age: number;
  gender: string;
  build: string;
  hairStyle: string;
  otherclothing: string;
};

export type FieldContactCollection = {
  [fcNum: string]: FieldContact;
};

export type Officer = {
  id: string;
  name: string;
  supervisorId: string;
  supervisorName: string;
  stops: FieldContactCollection;
};

export type SuggestibleField =
  | "basis"
  | "contactOfficerName"
  | "supervisorName"
  | "zip"
  | "year";

export type SearchField = {
  field:
    | SuggestibleField
    | "narrative"
    | "fcInvolvedFriskOrSearch"
    | "includedGenders"
    | "includedRaces"
    | "includedEthnicities";
  query: string;
  bool?: "and" | "or" | "not";
};

export type SearchOptions = FSSearchOptions & {
  query: SearchField[];
  page?: number | true;
};

export type SearchResultSummary = {
  total: number;
  totalByFrisked: Dictionary<number>;
  totalByZip: Dictionary<number>;
  totalByRace: Dictionary<number>;
  totalByEthnicity: Dictionary<number>;
  totalByGender: Dictionary<number>;
  totalByBasis: Dictionary<number>;
  totalByAge: Dictionary<number>;
  totalByYear: Dictionary<number>;
};

export type SearchResult = SearchResults<FieldContact>;
