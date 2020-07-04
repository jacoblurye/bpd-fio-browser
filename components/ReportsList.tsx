import React from "react";
import { Grid, Button, Typography, Box, Divider } from "@material-ui/core";
import ReportOverviewCard from "./ReportOverviewCard";
import {
  useLoadMoreReports,
  searchNewReports,
  useReports,
  searchQuery,
  searchSummary,
} from "state";
import { useRecoilValueLoadable, useRecoilValue } from "recoil";

const ReportsList: React.FC = () => {
  const query = useRecoilValue(searchQuery);
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
              found no results for "{query}"
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
              loaded all results for "{query}"
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
                  <ReportOverviewCard report={report} searchTerm={query} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      )}
      {query && (
        <Box height={40} textAlign="center">
          {bottomMessage}
        </Box>
      )}
    </Box>
  );
};

export default ReportsList;
