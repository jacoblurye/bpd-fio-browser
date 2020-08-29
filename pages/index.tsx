import React from "react";
import Layout from "components/Layout";
import { Grid } from "@material-ui/core";
import ReportsList, { ReportsListProps } from "components/ReportsList";
import ResultsSummary, { ResultsSummaryProps } from "components/ResultsSummary";
import SearchBox from "components/SearchBox";
import WakeupSearch from "components/WakeupSearch";
import QueryStatus from "components/QueryStatus";
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import { getQueryResult, getQuerySummary } from "search";
import { SearchOptions } from "interfaces";

const NeedHelpAlert = dynamic(() => import("components/NeedHelpAlert"), {
  ssr: false,
});

type SearchContainerProps = ReportsListProps & ResultsSummaryProps;

const SearchContainer: React.FC<SearchContainerProps> = ({
  initialSummary,
  initialReports,
}) => {
  return (
    <Layout>
      <NeedHelpAlert />
      <Grid container direction="column" spacing={1}>
        <Grid item>
          <SearchBox />
        </Grid>
        <Grid item>
          <ResultsSummary initialSummary={initialSummary} />
        </Grid>
        <Grid item>
          <ReportsList initialReports={initialReports} />
        </Grid>
        <Grid item>
          <QueryStatus />
        </Grid>
      </Grid>
      <WakeupSearch />
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<SearchContainerProps> = async () => {
  const queryAll: SearchOptions = { query: [], limit: 25 };
  const [{ result: initialReports }, initialSummary] = await Promise.all([
    getQueryResult(queryAll),
    getQuerySummary(queryAll),
  ]);

  return { props: { initialSummary, initialReports } };
};

export default SearchContainer;
