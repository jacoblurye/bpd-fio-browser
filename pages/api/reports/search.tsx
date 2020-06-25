import { FieldContact } from "interfaces";
import { NextApiRequest, NextApiResponse } from "next";
import FlexSearch, { CreateOptions, Index, SearchResults } from "flexsearch";
import { addHeaders } from "utils/api-helpers";
import flexSearchConfig from "flexsearch.json";
import loadFieldContactIndex from "__generated__/loadFieldContactIndex";

let INDEX: Index<FieldContact>;
export default async (
  req: NextApiRequest,
  res: NextApiResponse<SearchResults<FieldContact>>
) => {
  const {
    query: { q, page },
  } = req;

  // Build the search index if it doesn't exist
  if (INDEX === undefined) {
    console.log("building new flexsearch index", Date.now());
    INDEX = FlexSearch.create(flexSearchConfig as CreateOptions);
    INDEX.import(loadFieldContactIndex());
    console.log("build complete", Date.now());
  }

  // @ts-ignore
  const result: SearchResults<FieldContact> = INDEX.search({
    query: q as string,
    limit: 25,
    page: (page as string) || true,
  });
  addHeaders(res);
  return res.json(result);
};
