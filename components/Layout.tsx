import React, { ReactNode } from "react";
import Head from "next/head";
type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ title, children }: Props) => (
  <div style={{ maxWidth: 800, margin: "auto" }}>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    {children}
  </div>
);

export default Layout;
