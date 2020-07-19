import { NextApiResponse, NextApiRequest } from "next";

export const addHeaders = (res: NextApiResponse) => {
  // 'stale-while-revalidate' is a custom Vercel-specific extension of the Cache-Control header
  res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");
};

export const parseJSONQueryParam = <T>(
  req: NextApiRequest,
  paramName: string
): T | null => {
  const {
    query: { [paramName]: param },
  } = req;

  let paramValue: T | null = null;
  try {
    paramValue = JSON.parse(param as string);
  } catch (e) {
    console.error(e);
  }

  return paramValue;
};
