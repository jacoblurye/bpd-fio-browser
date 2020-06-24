import React, { ReactNode } from "react";
import Head from "next/head";
import ScrollToTop from "./ScrollToTop";
type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ title, children }: Props) => {
  return (
    <ScrollToTop>
      <div style={{ maxWidth: 800, margin: "auto" }}>
        <Head>
          <title>{title}</title>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        {children}
      </div>
    </ScrollToTop>
  );
};

export default Layout;
