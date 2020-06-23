import { NextApiRequest, NextApiResponse } from "next";
import { FieldContact } from "interfaces";
import { getFieldContactCollection } from "utils/data-pull";
import { addHeaders } from "utils/api-helpers";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<FieldContact>
) => {
  const {
    query: { fcNum },
  } = req;

  if (typeof fcNum !== "string") {
    return res.status(400).end("400: invalid report identifier");
  }

  const collection = await getFieldContactCollection();
  const report = collection[fcNum];

  if (!report) {
    return res.status(404).end("404: report not found");
  }

  addHeaders(res);
  return res.json(report);
};
