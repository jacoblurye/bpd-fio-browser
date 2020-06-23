import React from "react";
import Layout from "components/Layout";
import axios from "axios";
import {
  Grid,
  TextField,
  Fade,
  Card,
  CardContent,
  Button,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { FieldContact } from "interfaces";
import { SearchResults } from "flexsearch";

const searchReports = (q: string, page?: string) => {
  return axios
    .get<SearchResults<FieldContact>>("/api/reports/search", {
      params: { q, page },
    })
    .then(({ data }) => data);
};

const Reports: React.FC = () => {
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
            placeholder="Search BPD field contact records"
            onChange={(e) => setQuery(e.currentTarget.value)}
            onSubmit={() => console.log("submitted!")}
            InputProps={{ endAdornment: <Search /> }}
          />
        </Grid>
        {reports?.map(({ fcNum, narrative }) => (
          <Grid item key={fcNum}>
            <Fade in={true}>
              <Card>
                <CardContent>{narrative}</CardContent>
              </Card>
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
