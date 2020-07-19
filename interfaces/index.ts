// Shared interfaces used throughout the app.

import { Dictionary } from "lodash";
import { SearchResults, SearchOptions as FSSearchOptions } from "flexsearch";

export type FieldContact = {
  fcNum: string;
  contactDate: number;
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
  summonsissued: "Y";
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

export type SuggestibleField = "basis" | "contactOfficerName" | "zip";

export type SearchField = {
  field: SuggestibleField | "narrative" | "fcInvolvedFriskOrSearch";
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
};

export type SearchResult = SearchResults<FieldContact>;
