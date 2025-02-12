import React from "react";
import { Grid, Button, Typography, Box } from "@material-ui/core";
import ReportOverviewCard from "./ReportOverviewCard";
import {
  useLoadMoreReports,
  searchNewReports,
  useReports,
  useSearchFilters,
  searchSummary,
} from "state";
import { useRecoilValueLoadable } from "recoil";
import SimpleCard from "./SimpleCard";
import { FieldContact } from "interfaces";

export interface ReportsListProps {
  initialReports: FieldContact[];
}

const ReportsList: React.FC<ReportsListProps> = ({ initialReports }) => {
  const hasFilters = useSearchFilters().filters.length > 0;
  const summaryLoaded =
    useRecoilValueLoadable(searchSummary).state === "hasValue";
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

  const shouldRender = !hasFilters || (summaryLoaded && reports.length > 0);

  return (
    <>
      {shouldRender && (
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
          {hasNextPage && (
            <Button
              fullWidth
              size="small"
              color="primary"
              variant="outlined"
              disabled={isLoadingMore}
              onClick={() => loadMoreReports()}
            >
              {isLoadingMore ? "loading..." : "load more reports"}
            </Button>
          )}
        </SimpleCard>
      )}
    </>
  );
};

export default ReportsList;
