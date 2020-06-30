import React, { ReactNode } from "react";
import Head from "next/head";
import ScrollToTop from "./ScrollToTop";
import { Box } from "@material-ui/core";
type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ title, children }: Props) => {
  return (
    <ScrollToTop>
      <Box m="auto" maxWidth={960}>
        <Head>
          <title>{title}</title>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        {children}
      </Box>
    </ScrollToTop>
  );
};

export default Layout;
