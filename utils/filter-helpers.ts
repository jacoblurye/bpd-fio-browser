import zipToNeighborhood from "json/zip-to-neighborhood.json";
import { SearchField } from "interfaces";

export const getFilterValueDisplay = (
  field: SearchField["field"],
  value: string
): string => {
  let displayValue: string;
  switch (field) {
    case "zip":
      // @ts-ignore
      displayValue = `${zipToNeighborhood[value]}, ${value}`.toLowerCase();
      break;
    case "fcInvolvedFriskOrSearch":
      displayValue = value === "y" ? "yes" : value === "n" ? "no" : value;
      break;
    default:
      displayValue = value;
  }
  return displayValue;
};
