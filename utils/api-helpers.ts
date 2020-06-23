import { NextApiResponse } from "next";

export const addHeaders = (res: NextApiResponse) => {
  // 'stale-while-revalidate' is a custom Vercel-specific extension of the Cache-Control header
  res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");
};
