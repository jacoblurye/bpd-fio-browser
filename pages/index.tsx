import React from "react";
import Layout from "components/Layout";
import axios from "axios";
import {
  Grid,
  TextField,
  Fade,
  Button,
  IconButton,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import { FieldContact } from "interfaces";
import { SearchResults } from "flexsearch";
import { useForm } from "react-hook-form";
import ReportSummaryCard from "components/ReportSummaryCard";

const searchReports = (query: string, page?: string) => {
  return axios
    .get<SearchResults<FieldContact>>("/api/reports/search", {
      params: { q: query.trim(), page },
    })
    .then(({ data }) => data);
};

const SEARCH_BOX = "search-box";

const Reports: React.FC = () => {
  React.useEffect(() => {
    // warm up the serverless endpoint (random string to force a cache miss)
    searchReports(Math.random().toString());
  }, []);

  const { handleSubmit, register } = useForm();

  const [query, setQuery] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [nextPage, setNextPage] = React.useState<string | undefined>();
  const [reports, setReports] = React.useState<FieldContact[] | undefined>();
  const runNewQuery = (q: string) => {
    setLoading(true);
    searchReports(q).then(({ result, next }) => {
      setReports(result);
      setNextPage(next);
      setLoading(false);
    });
  };
  const loadMore = () => {
    if (nextPage && reports && query) {
      setLoading(true);
      searchReports(query, nextPage).then(({ result, next }) => {
        setReports([...reports, ...result]);
        setNextPage(next);
        setLoading(false);
      });
    }
  };
  const handleSearch = handleSubmit(({ [SEARCH_BOX]: q }) => {
    runNewQuery(q);
    setQuery(q);
  });

  const showLoadMore = reports && reports.length > 0 && nextPage;

  return (
    <Layout title="Reports | Boston Police Department FIO Data">
      <Grid container direction="column" spacing={1}>
        <Grid item>
          <form onSubmit={handleSearch}>
            <TextField
              name={SEARCH_BOX}
              inputRef={register}
              fullWidth
              autoFocus
              variant="outlined"
              placeholder="Search 35,000 BPD field contact records"
              InputProps={{
                endAdornment: (
                  <IconButton
                    style={{ background: "none" }}
                    onClick={handleSearch}
                  >
                    🔍
                  </IconButton>
                ),
              }}
              autoComplete="off"
              autoCorrect="off"
            />
          </form>
        </Grid>
        {reports?.map((report) => (
          <Grid item key={report.fcNum}>
            <Fade in={true} timeout={300}>
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
