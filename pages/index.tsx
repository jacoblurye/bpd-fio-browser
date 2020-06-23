import React from "react";
import Layout from "components/Layout";
import { Typography } from "@material-ui/core";
import axios from "axios";

const IndexPage = () => {
  React.useEffect(() => {
    // wake up report search
    axios.get('/api/reports/search?q=""');
  }, []);
  return (
    <Layout title="Home | Boston Police Department FIO Data">
      <Typography>
        Search through the Boston Police Department's Field Interrogation and
        Observation data set.
      </Typography>
    </Layout>
  );
};

export default IndexPage;
