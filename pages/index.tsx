import React from "react";
import Layout from "components/Layout";
import axios from "axios";
import { Grid, TextField, Fade, Button } from "@material-ui/core";
import { FieldContact } from "interfaces";
import { SearchResults } from "flexsearch";
import ReportSummaryCard from "components/ReportSummaryCard";

const searchReports = (q: string, page?: string) => {
  return axios
    .get<SearchResults<FieldContact>>("/api/reports/search", {
      params: { q, page },
    })
    .then(({ data }) => data);
};

const Reports: React.FC = () => {
  React.useEffect(() => {
    // warm up the serverless endpoint
    searchReports("");
  }, []);

  const [query, setQuery] = React.useState<string>("");
  const [nextPage, setNextPage] = React.useState<string | undefined>();
  const [reports, setReports] = React.useState<FieldContact[] | undefined>();
  const runNewQuery = () => {
    setNextPage(undefined);
    searchReports(query).then(({ result, next }) => {
      setReports(result);
      setNextPage(next);
    });
  };
  const loadMore = () => {
    if (nextPage && reports) {
      searchReports(query, nextPage).then(({ result, next }) => {
        setReports([...reports, ...result]);
        setNextPage(next);
      });
    }
  };

  React.useEffect(() => {
    runNewQuery();
  }, [query]);

  const showLoadMore = reports && reports.length > 0 && nextPage;

  return (
    <Layout title="Reports | Boston Police Department FIO Data">
      <Grid container direction="column" spacing={1}>
        <Grid item>
          <TextField
            fullWidth
            variant="outlined"
            value={query}
            placeholder="Search 35,000 BPD field contact records"
            onChange={(e) => setQuery(e.currentTarget.value)}
            InputProps={{ endAdornment: <div>🔍</div> }}
          />
        </Grid>
        {reports?.map((report) => (
          <Grid item key={report.fcNum}>
            <Fade in={true}>
              <ReportSummaryCard report={report} searchTerm={query} />
            </Fade>
          </Grid>
        ))}
        {showLoadMore && (
          <Grid item>
            <Button fullWidth onClick={loadMore}>
              load more
            </Button>
          </Grid>
        )}
      </Grid>
    </Layout>
  );
};

export default Reports;
