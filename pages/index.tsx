import React from "react";
import Layout from "components/Layout";
import { Grid } from "@material-ui/core";
import ReportsList from "components/ReportsList";
import ResultsSummary from "components/ResultsSummary";
import SearchBox from "components/SearchBox";
import WakeupSearch from "components/WakeupSearch";
import QueryStatus from "components/QueryStatus";

const SearchContainer: React.FC = () => {
  return (
    <Layout title="Reports | Boston Police Department FIO Data">
      <Grid container direction="column" spacing={1}>
        <Grid item>
          <SearchBox />
        </Grid>
        <Grid item>
          <ResultsSummary />
        </Grid>
        <Grid item>
          <ReportsList />
        </Grid>
        <Grid item>
          <QueryStatus />
        </Grid>
      </Grid>
      <WakeupSearch />
    </Layout>
  );
};

export default SearchContainer;
