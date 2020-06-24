import React from "react";
import Layout from "components/Layout";
import axios from "axios";
import {
  Grid,
  TextField,
  Fade,
  IconButton,
  Typography,
} from "@material-ui/core";
import { FieldContact } from "interfaces";
import { SearchResults } from "flexsearch";
import { useForm } from "react-hook-form";
import ReportSummaryCard from "components/ReportSummaryCard";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";

const searchReports = (query: string, page?: string) => {
  return axios
    .get<SearchResults<FieldContact>>("/api/reports/search", {
      params: { q: query.trim(), page },
    })
    .then(({ data }) => data);
};

const SEARCH_BOX = "search-box";
const SCROLL_LOAD_THRESHOLD = 1000;

const Reports: React.FC = () => {
  const { handleSubmit, register } = useForm();
  const [query, setQuery] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [nextPage, setNextPage] = React.useState<string | undefined>();
  const [reports, setReports] = React.useState<FieldContact[] | undefined>();

  React.useEffect(() => {
    // Warm up the serverless endpoint (random string to force a cache miss)
    searchReports(Math.random().toString());
  }, []);

  // Execute a search query based on the search box contents
  const handleSearch = handleSubmit(({ [SEARCH_BOX]: q }) => {
    setQuery(q);
    setReports(undefined);
    setLoading(true);
    searchReports(q).then(({ result, next }) => {
      setReports(result);
      setNextPage(next);
      setLoading(false);
    });
    // Clear searchbox focus
    // @ts-ignore
    document.activeElement?.blur();
  });

  // Load the next page of query results if the user nears the bottom of the page
  useScrollPosition(({ currPos }) => {
    const thresholdScrollPos =
      document.body.offsetHeight -
      window.screen.availHeight -
      SCROLL_LOAD_THRESHOLD;

    const isAtThreshold = -currPos.y > thresholdScrollPos;

    if (isAtThreshold && nextPage && reports && query && !loading) {
      setLoading(true);
      searchReports(query, nextPage).then(({ result, next }) => {
        setReports([...reports, ...result]);
        setNextPage(next);
        setLoading(false);
      });
    }
  });

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
        {!!query && (
          <Grid item>
            <Grid container justify="center">
              <Typography variant="subtitle2" color="textSecondary">
                {loading
                  ? "loading..."
                  : !nextPage &&
                    (reports?.length
                      ? `showing ${reports.length} result${
                          reports.length > 1 ? "s" : ""
                        } for "${query}"`
                      : `no results for "${query}"`)}
              </Typography>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Layout>
  );
};

export default Reports;
