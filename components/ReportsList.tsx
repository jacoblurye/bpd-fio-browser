import React from "react";
import { Grid, Button, Typography, Box } from "@material-ui/core";
import ReportOverviewCard from "./ReportOverviewCard";
import {
  useLoadMoreReports,
  searchNewReports,
  useReports,
  useSearchFilters,
} from "state";
import { useRecoilValueLoadable } from "recoil";
import SimpleCard from "./SimpleCard";
import { FieldContact } from "interfaces";

export interface ReportsListProps {
  initialReports: FieldContact[];
}

const ReportsList: React.FC<ReportsListProps> = ({ initialReports }) => {
  const hasFilters = useSearchFilters().filters.length > 0;
  const resultsLoadable = useRecoilValueLoadable(searchNewReports);
  const loadMoreReports = useLoadMoreReports();
  const hasNextPage =
    resultsLoadable.state === "hasValue" && resultsLoadable.contents?.next;
  const isLoadingMore = resultsLoadable.state === "loading";

  const dynamicReports = useReports();
  const reports =
    dynamicReports.length > 0 || hasFilters ? dynamicReports : initialReports;

  if (reports.length === 0) {
    return null;
  }

  return (
    <>
      {reports.length > 0 && (
        <SimpleCard variant="outlined">
          <Typography variant="subtitle1" color="textSecondary">
            Reports
          </Typography>
          <Box marginY={1}>
            <Grid container direction="column" spacing={2}>
              {reports.map((report) => (
                <Grid item key={report.fcNum}>
                  <ReportOverviewCard report={report} />
                </Grid>
              ))}
            </Grid>
          </Box>
          <Box textAlign="center">
            <Button
              fullWidth
              size="small"
              color="primary"
              variant="outlined"
              disabled={isLoadingMore}
              onClick={() => loadMoreReports()}
            >
              {hasNextPage && "load more reports"}
              {isLoadingMore && "loading..."}
            </Button>
          </Box>
        </SimpleCard>
      )}
    </>
  );
};

export default ReportsList;
