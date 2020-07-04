import React from "react";
import Layout from "components/Layout";
import { Grid, Box } from "@material-ui/core";
import ReportsList from "components/ReportsList";
import ResultsSummary from "components/ResultsSummary";
import SearchBox from "components/SearchBox";
import WakeupSearch from "components/WakeupSearch";

const SearchContainer: React.FC = () => {
  return (
    <Layout title="Reports | Boston Police Department FIO Data">
      <Grid container direction="column" spacing={1}>
        <Grid item>
          <SearchBox />
        </Grid>
        <Grid item>
          <Box m={1}>
            <ResultsSummary />
          </Box>
        </Grid>
        <Grid item>
          <Box m={1}>
            <ReportsList />
          </Box>
        </Grid>
      </Grid>
      <WakeupSearch />
    </Layout>
  );
};

export default SearchContainer;
