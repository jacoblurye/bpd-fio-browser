import React from "react";
import Layout from "components/Layout";
import {
  Grid,
  TextField,
  IconButton,
  Typography,
  Divider,
  Box,
} from "@material-ui/core";
import { useForm } from "react-hook-form";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import SearchResultsList from "components/SearchResultsList";
import SearchResultsSummary from "components/SearchResultsSummary";
import { Search } from "@material-ui/icons";
import { useRouter } from "next/dist/client/router";
import {
  useRecoilState,
  useSetRecoilState,
  useRecoilValueLoadable,
} from "recoil";
import { searchQuery, searchPage, searchSummary, searchReports } from "state";
import { FieldContact } from "interfaces";

const SEARCH_BOX = "search-box";
const SCROLL_LOAD_THRESHOLD = 1000;

const Reports: React.FC = () => {
  const router = useRouter();
  const { handleSubmit, register, setValue, getValues } = useForm();

  const [query, setQuery] = useRecoilState(searchQuery);
  const setPage = useSetRecoilState(searchPage);
  const summaryLoadable = useRecoilValueLoadable(searchSummary);
  const summary =
    summaryLoadable.state === "hasValue" && summaryLoadable.contents;
  const reportsLoadable = useRecoilValueLoadable(searchReports);
  const reports =
    reportsLoadable.state === "hasValue" && reportsLoadable.contents;

  const [loadedReports, setLoadedReports] = React.useState<FieldContact[]>([]);
  const allReports =
    reports && reports.result.length > 0
      ? [...loadedReports, ...reports.result]
      : loadedReports;

  // Execute a search query based on the search box contents
  const handleSearch = handleSubmit(({ [SEARCH_BOX]: q }) => {
    setQuery(q);
    setPage(true);
    setLoadedReports([]);
    const query = q ? { q } : undefined;
    router.push({ pathname: router.pathname, query });
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

    if (isAtThreshold && reports) {
      if (reports.next) {
        setPage(reports.next);
        setLoadedReports(allReports);
      }
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
        {summary && summary.total > 0 && (
          <Grid item>
            <Box m={1}>
              <Typography variant="overline">Summary</Typography>
              <Divider />
              <SearchResultsSummary summary={summary} searchTerm={query} />
            </Box>
          </Grid>
        )}
        {allReports.length > 0 && (
          <Grid item>
            <Box m={1}>
              <Typography variant="overline">Reports</Typography>
              <Box marginTop={1}>
                <SearchResultsList results={allReports} searchTerm={query} />
              </Box>
            </Box>
          </Grid>
        )}
        {query && (
          <Grid item>
            <Box textAlign="center">
              <Typography variant="subtitle2" color="textSecondary">
                {reportsLoadable.state === "loading"
                  ? "loading..."
                  : summary &&
                    summary.total === 0 &&
                    `no results for "${query}"`}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Layout>
  );
};

export default Reports;
