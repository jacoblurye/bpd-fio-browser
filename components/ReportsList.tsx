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
  const reports = useReports() || initialReports;
  const loadMoreReports = useLoadMoreReports();

  if (hasFilters && resultsLoadable.state !== "hasValue") {
    return null;
  }

  const hasNextPage =
    resultsLoadable.state === "hasValue" && resultsLoadable.contents?.next;

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
          {hasNextPage && (
            <Box textAlign="center">
              <Button
                fullWidth
                size="small"
                color="primary"
                variant="outlined"
                onClick={() => loadMoreReports()}
              >
                load more reports
              </Button>
            </Box>
          )}
        </SimpleCard>
      )}
    </>
  );
};

export default ReportsList;
