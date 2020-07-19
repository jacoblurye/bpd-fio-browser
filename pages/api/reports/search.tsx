import { FCSearchResult, SearchOptions } from "interfaces";
import { NextApiRequest, NextApiResponse } from "next";
import { addHeaders, parseJSONQueryParam } from "utils/api-helpers";
import { getQueryResult, getQuerySummary } from "utils/search-helpers";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<FCSearchResult>
) => {
  const query = parseJSONQueryParam<SearchOptions>(req, "q");
  if (query === null) {
    return res.status(400);
  }

  // @ts-ignore
  const [results, summary] = await Promise.all([
    getQueryResult(query),
    getQuerySummary(query),
  ]);

  addHeaders(res);
  return res.json({ results, summary });
};
