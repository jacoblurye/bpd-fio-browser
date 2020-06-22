import { FieldContact } from "interfaces";
import { NextApiRequest, NextApiResponse } from "next";
import FlexSearch, { CreateOptions, Index } from "flexsearch";
import { getFieldContactCollection } from "utils/data-pull";

const flexSearchConfig: CreateOptions = {
  async: true,
  doc: {
    id: "fcNum",
    field: ["narrative", "basis", "circumstance"],
  },
};

let INDEX: Index<FieldContact>;
export default async (
  req: NextApiRequest,
  res: NextApiResponse<FieldContact[]>
) => {
  const {
    query: { q },
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

  console.log("starting search");
  console.log(INDEX.info());
  const result = await INDEX.search({ query: q as string, limit: 25 });
  console.log("search complete");
  return res.json(result);
};
