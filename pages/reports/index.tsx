import React from "react";
import Layout from "components/Layout";
import axios from "axios";
import throttle from "lodash/throttle";
import { Grid, TextField } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { FieldContact } from "interfaces";

const THROTTLE_WAIT = 500;

const Reports: React.FC = () => {
  const [query, setQuery] = React.useState<string>("");
  const [reports, setReports] = React.useState<FieldContact[] | undefined>();
  const updateSearchQuery = throttle(() => {
    axios
      .get<FieldContact[]>("/api/reports/search", { params: { q: query } })
      .then(({ data }) => setReports(data));
  }, THROTTLE_WAIT);
  React.useEffect(() => {
    updateSearchQuery();
  }, [query]);

  return (
    <Layout title="Reports | Boston Police Department FIO Data">
      <Grid container direction="column" spacing={1}>
        <Grid item>
          <TextField
            fullWidth
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            InputProps={{ endAdornment: <Search /> }}
            inputProps={{ placeholder: "Search BPD field contact records" }}
          />
        </Grid>
        {reports?.map(({ fcNum, narrative }) => (
          <Grid item key={fcNum}>
            {narrative}
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
};

export default Reports;
