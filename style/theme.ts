import { createMuiTheme } from "@material-ui/core/styles";

// @ts-ignore
const theme = createMuiTheme({
  typography: {
    fontFamily: "Helvetica Neue",
  },
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
  overrides: {
    MuiCard: {
      root: {
        boxShadow: "none",
        border: "1px solid #cfd0d0",
        borderRadius: 5,
      },
    },
  },
});

export default theme;
