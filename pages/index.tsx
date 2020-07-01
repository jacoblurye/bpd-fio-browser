import React from "react";
import Layout from "components/Layout";
import axios from "axios";
import {
  Grid,
  TextField,
  IconButton,
  Typography,
  Divider,
  Box,
} from "@material-ui/core";
import {
  FieldContact,
  FCSearchResult,
  FCSearchResultSummary,
} from "interfaces";
import { useForm } from "react-hook-form";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import SearchResultsList from "components/SearchResultsList";
import SearchResultsSummary from "components/SearchResultsSummary";
import { Search } from "@material-ui/icons";
import { useRouter } from "next/dist/client/router";

const PAGE_LIMIT = 25;
const SEARCH_BOX = "search-box";
const SCROLL_LOAD_THRESHOLD = 1000;

const searchReports = (query: string, page?: string) => {
  const q = {
    query: query.trim(),
    page: page || true,
    limit: PAGE_LIMIT,
  };
  return axios
    .get<FCSearchResult>("/api/reports/search", {
      params: { q },
    })
    .then(({ data }) => data);
};

const Reports: React.FC = () => {
  React.useEffect(() => {
    // Warm up the serverless endpoint (random string to force a cache miss)
    searchReports(Math.random().toString());
  }, []);

  const { handleSubmit, register, setValue, getValues } = useForm();
  const [query, setQuery] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [nextPage, setNextPage] = React.useState<string | undefined>();
  const [reports, setReports] = React.useState<FieldContact[] | undefined>();
  const [summary, setSummary] = React.useState<
    FCSearchResultSummary | undefined
  >();

  const router = useRouter();

  // Execute a search query based on the search box contents
  const handleSearch = handleSubmit(({ [SEARCH_BOX]: q }) => {
    setQuery(q);
    router.push({ pathname: router.pathname, query: { q } });
    setReports(undefined);
    setLoading(true);
    setSummary(undefined);
    searchReports(q).then(({ results: { result, next }, summary }) => {
      setReports(result);
      setNextPage(next);
      setLoading(false);
      setSummary(summary);
    });
    // Clear searchbox focus
    // @ts-ignore
    document.activeElement?.blur();
  });

  React.useEffect(() => {
    // Sync the searchbox value with the `q` query param
    const q = router.query.q as string;
    if (q && q !== getValues()[SEARCH_BOX]) {
      setValue(SEARCH_BOX, q);
      handleSearch();
    }
  }, [router]);

  // Load the next page of query results if the user nears the bottom of the page
  useScrollPosition(({ currPos }) => {
    const thresholdScrollPos =
      document.body.offsetHeight -
      window.screen.availHeight -
      SCROLL_LOAD_THRESHOLD;

    const isAtThreshold = -currPos.y > thresholdScrollPos;

    if (isAtThreshold && nextPage && reports && query && !loading) {
      setLoading(true);
      searchReports(query, nextPage).then(({ results: { result, next } }) => {
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
              placeholder="Search 35,000 police records"
              InputProps={{
                endAdornment: (
                  <IconButton
                    style={{ background: "none" }}
                    onClick={handleSearch}
                  >
                    <Search />
                  </IconButton>
                ),
              }}
              autoComplete="off"
              autoCorrect="off"
            />
          </form>
        </Grid>
        {query && reports && summary && summary.total > 0 && (
          <>
            <Grid item>
              <Box m={1}>
                <Typography variant="overline">Summary</Typography>
                <Divider />
                <SearchResultsSummary summary={summary} searchTerm={query} />
              </Box>
            </Grid>
            <Grid item>
              <Box m={1}>
                <Typography variant="overline">Reports</Typography>
                <Divider />
                <Box marginTop={1}>
                  <SearchResultsList results={reports} searchTerm={query} />
                </Box>
              </Box>
            </Grid>
          </>
        )}
        {query && (
          <Grid item>
            <Box textAlign="center">
              <Typography variant="subtitle2" color="textSecondary">
                {loading
                  ? "loading..."
                  : !reports?.length && `no results for "${query}"`}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Layout>
  );
};

export default Reports;
