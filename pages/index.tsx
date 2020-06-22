import React from "react";
import Layout from "components/Layout";
import { Typography } from "@material-ui/core";
import { getFieldContactCollection } from "utils/data-pull";

const IndexPage = () => {
  React.useEffect(() => {
    getFieldContactCollection();
  });
  return (
    <Layout title="Home | Boston Police Department FIO Data">
      <Typography variant="h5">Hello Next.js 👋</Typography>
    </Layout>
  );
};

export default IndexPage;
