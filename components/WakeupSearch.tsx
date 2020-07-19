import React from "react";
import { useRecoilCallback } from "recoil";
import { searchResultQuery } from "state";

const WakeupSearch: React.FC = () => {
  // Issue a random query to the search API to wake up
  // the vercel function if it's gone to sleep.
  const doWakeup = useRecoilCallback(
    ({ snapshot }) => () => {
      snapshot
        .getPromise(
          searchResultQuery({
            query: [{ field: "narrative", query: Math.random().toString() }],
            page: true,
            limit: 1,
          })
        )
        .catch(console.error);
    },
    []
  );

  React.useEffect(() => {
    if (typeof window !== undefined) {
      doWakeup();
    }
  }, []);

  return null;
};

export default WakeupSearch;
