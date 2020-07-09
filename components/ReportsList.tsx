import React from "react";
import { Grid, Button, Typography, Box, Divider } from "@material-ui/core";
import ReportOverviewCard from "./ReportOverviewCard";
import {
  useLoadMoreReports,
  searchNewReports,
  useReports,
  searchSummary,
  searchFilters,
} from "state";
import { useRecoilValueLoadable, useRecoilValue } from "recoil";
import { isEmpty } from "lodash";

const ReportsList: React.FC = () => {
  const filters = useRecoilValue(searchFilters);
  const summaryHasLoaded =
    useRecoilValueLoadable(searchSummary).state === "hasValue";
  const resultsLoadable = useRecoilValueLoadable(searchNewReports);
  const reports = useReports();
  const loadMoreReports = useLoadMoreReports();

  let bottomMessage = null;
  switch (resultsLoadable.state) {
    case "hasValue":
      if (summaryHasLoaded) {
        const noReports = reports.length === 0;
        const nextPageExists = resultsLoadable.contents?.next;
        if (noReports) {
          bottomMessage = (
            <Typography color="textSecondary">
              found no results for the provided filters
            </Typography>
          );
        } else if (nextPageExists) {
          bottomMessage = (
            <Button size="small" onClick={() => loadMoreReports()}>
              load more reports
            </Button>
          );
        } else {
          bottomMessage = (
            <Typography color="textSecondary">
              loaded all results for the provided filters
            </Typography>
          );
        }
      }
      break;
    default:
      bottomMessage = <Typography color="textSecondary">loading...</Typography>;
  }

  return (
    <Box>
      {summaryHasLoaded && reports.length > 0 && (
        <>
          <Typography variant="overline">Reports</Typography>
          <Divider />
          <Box marginY={1}>
            <Grid container direction="column" spacing={1}>
              {reports.map((report) => (
                <Grid item key={report.fcNum}>
                  <ReportOverviewCard report={report} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      )}
      {!isEmpty(filters) && (
        <Box height={40} textAlign="center">
          {bottomMessage}
        </Box>
      )}
    </Box>
  );
};

export default ReportsList;
