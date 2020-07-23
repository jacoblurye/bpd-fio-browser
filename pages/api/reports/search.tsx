import { SearchOptions, SearchResult } from "interfaces";
import { NextApiRequest, NextApiResponse } from "next";
import { addHeaders, parseJSONQueryParam } from "utils/api-helpers";
import { getQueryResult } from "search";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<SearchResult>
) => {
  const query = parseJSONQueryParam<SearchOptions>(req, "q");
  if (query === null) {
    return res.status(400);
  }

  // @ts-ignore
  const results = await getQueryResult(query);

  addHeaders(res);
  return res.json(results);
};
