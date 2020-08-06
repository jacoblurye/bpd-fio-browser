import React from "react";
import { Box, Typography } from "@material-ui/core";
import { useRecoilValueLoadable } from "recoil";
import { searchNewReports, useSearchFilters, searchSummary } from "state";
import { isEmpty } from "lodash";

const QueryStatus: React.FC = () => {
  const filters = useSearchFilters();
  const summaryLoadable = useRecoilValueLoadable(searchSummary);
  const reportsLoadable = useRecoilValueLoadable(searchNewReports);

  return !isEmpty(filters.filters) ? (
    <Box textAlign="center">
      <Typography variant="subtitle2" color="textSecondary">
        {summaryLoadable.state === "loading" ||
        reportsLoadable.state === "loading"
          ? "loading..."
          : reportsLoadable.state === "hasValue" &&
            reportsLoadable.contents?.result.length === 0
          ? "found no results for the provided filters"
          : ""}
      </Typography>
    </Box>
  ) : null;
};

export default QueryStatus;
