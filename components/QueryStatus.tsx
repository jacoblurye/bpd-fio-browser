import React from "react";
import { Box, Typography } from "@material-ui/core";
import { useRecoilValueLoadable } from "recoil";
import { searchNewReports, useSearchFilters } from "state";
import { isEmpty } from "lodash";

const QueryStatus: React.FC = () => {
  const filters = useSearchFilters();
  const resultsLoadable = useRecoilValueLoadable(searchNewReports);

  return !isEmpty(filters.filters) ? (
    <Box textAlign="center">
      <Typography variant="subtitle2" color="textSecondary">
        {resultsLoadable.state === "loading"
          ? "loading..."
          : resultsLoadable.state === "hasValue" &&
            resultsLoadable.contents?.result.length === 0
          ? "found no results for the provided filters"
          : ""}
      </Typography>
    </Box>
  ) : null;
};

export default QueryStatus;