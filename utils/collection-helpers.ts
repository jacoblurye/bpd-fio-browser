import { Dictionary } from "lodash";

export const addObjectValues = (
  obj1: Dictionary<number>,
  obj2: Dictionary<number>
): Dictionary<number> => {
  const keySet = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
  const keyArray = Array.from(keySet);
  return keyArray.reduce((prev, key) => {
    const val1 = obj1[key] || 0;
    const val2 = obj2[key] || 0;
    prev[key] = val1 + val2;
    return prev;
  }, {} as Dictionary<number>);
};
