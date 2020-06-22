import React from "react";
import { AppProps } from "next/app";
import theme from "style/theme";
import { MuiThemeProvider } from "@material-ui/core";

function App({ Component, pageProps }: AppProps) {
  return (
    <MuiThemeProvider theme={theme}>
      <Component {...pageProps} />
    </MuiThemeProvider>
  );
}

export default App;
