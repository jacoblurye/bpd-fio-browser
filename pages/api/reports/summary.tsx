import { SearchOptions, SearchResultSummary } from "interfaces";
import { NextApiRequest, NextApiResponse } from "next";
import { addHeaders, parseJSONQueryParam } from "utils/api-helpers";
import { getQuerySummary } from "utils/search-helpers";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<SearchResultSummary>
) => {
  const query = parseJSONQueryParam<SearchOptions>(req, "q");
  if (query === null) {
    return res.status(400);
  }

  // @ts-ignore
  const summary = await getQuerySummary(query);

  addHeaders(res);
  return res.json(summary);
};
