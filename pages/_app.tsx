import React from "react";
import { AppProps } from "next/app";
import theme from "style/theme";
import { MuiThemeProvider } from "@material-ui/core";
import "leaflet/dist/leaflet.css";

function App({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <MuiThemeProvider theme={theme}>
      <Component {...pageProps} />
    </MuiThemeProvider>
  );
}

export default App;
