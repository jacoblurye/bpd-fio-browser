import { FieldContact } from "interfaces";
import { NextApiRequest, NextApiResponse } from "next";
import FlexSearch, { CreateOptions, Index, SearchResults } from "flexsearch";
import { getFieldContactCollection } from "utils/data-pull";

const flexSearchConfig: CreateOptions = {
  tokenize: "strict",
  doc: {
    id: "fcNum",
    field: "narrative",
  },
};

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
    INDEX = FlexSearch.create(flexSearchConfig);
    const collection = await getFieldContactCollection();
    // @ts-ignore
    INDEX.add(Object.values(collection));
    console.log("build complete", Date.now());
  }

  // @ts-ignore
  const result: SearchResults<FieldContact> = INDEX.search({
    query: q as string,
    limit: 25,
    page: (page as string) || true,
  });
  return res.json(result);
};
