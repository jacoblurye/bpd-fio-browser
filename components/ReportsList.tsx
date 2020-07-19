import React from "react";
import { Grid, Button, Typography, Box } from "@material-ui/core";
import ReportOverviewCard from "./ReportOverviewCard";
import {
  useLoadMoreReports,
  searchNewReports,
  useReports,
  searchSummary,
} from "state";
import { useRecoilValueLoadable } from "recoil";
import SimpleCard from "./SimpleCard";

const ReportsList: React.FC = () => {
  const summaryHasLoaded =
    useRecoilValueLoadable(searchSummary).state === "hasValue";
  const resultsLoadable = useRecoilValueLoadable(searchNewReports);
  const hasNextPage =
    resultsLoadable.state === "hasValue" && resultsLoadable.contents?.next;

  const reports = useReports();
  const loadMoreReports = useLoadMoreReports();

  return (
    <>
      {summaryHasLoaded && reports.length > 0 && (
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
