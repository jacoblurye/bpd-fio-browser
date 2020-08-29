import React, { ReactNode } from "react";
import Head from "next/head";
import ScrollToTop from "./ScrollToTop";
import { Box, Divider } from "@material-ui/core";
import Header from "./Header";
import Disclaimer from "./Disclaimer";

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ title, children }: Props) => {
  return (
    <ScrollToTop>
      <Head>
        <title>{title ? `${title} - ` : ""}BPD FIO Browser</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="Browse 44,000 Boston Police Department Field Interrogation and Observation (FIO) reports, filed between 2015 and 2019 as part of the BPD's stop-and-frisk program."
        />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="BPD FIO Browser" />
        <meta
          name="twitter:description"
          content="Search and analyze the Boston Police Department's field interrogation and observation reports."
        />
      </Head>
      <Box m="auto" maxWidth={1000}>
        <Header />
      </Box>
      <Box marginTop={1} marginBottom={2}>
        <Divider />
      </Box>
      <Box m="auto" maxWidth={1000}>
        {children}
      </Box>
      {typeof window !== "undefined" && <Disclaimer />}
    </ScrollToTop>
  );
};

export default Layout;
