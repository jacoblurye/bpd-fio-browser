import { FieldContactCollection } from "interfaces";

const fioDataURL = process.env.NEXT_PUBLIC_FIO_DATA_URL!;

let COLLECTION: FieldContactCollection;
export const getFieldContactCollection = async (): Promise<
  FieldContactCollection
> => {
  if (COLLECTION === undefined) {
    const response = await fetch(fioDataURL);
    COLLECTION = await response.json();
  }
  return COLLECTION;
};
