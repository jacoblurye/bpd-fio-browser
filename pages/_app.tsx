import React from "react";
import { AppProps } from "next/app";
import theme from "style/theme";
import { MuiThemeProvider } from "@material-ui/core";
import "leaflet/dist/leaflet.css";
import { RecoilRoot } from "recoil";

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
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </MuiThemeProvider>
  );
}

export default App;
