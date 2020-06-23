import React, { ReactNode } from "react";
import Link from "next/link";
import Head from "next/head";
import { Grid } from "@material-ui/core";

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
    <header>
      <Grid container alignItems="center" spacing={1}>
        <Grid item>
          <Link href="/">
            <a>BPD FIO</a>
          </Link>
        </Grid>
        <Grid item>
          <Link href="/reports">
            <a>Reports</a>
          </Link>
        </Grid>
        <Grid item>
          <Link href="/officers">
            <a>Officers</a>
          </Link>
        </Grid>
      </Grid>
    </header>
    {children}
  </div>
);

export default Layout;
