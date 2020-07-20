import React, { ReactNode } from "react";
import Head from "next/head";
import ScrollToTop from "./ScrollToTop";
import { Box, Divider } from "@material-ui/core";
import Header from "./Header";

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ title, children }: Props) => {
  return (
    <ScrollToTop>
      <Head>
        <title>{title} | BPD FIO Browser</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
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
    </ScrollToTop>
  );
};

export default Layout;
