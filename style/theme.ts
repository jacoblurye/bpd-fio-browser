import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  shape: {
    borderRadius: 5,
  },
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
      },
    },
  },
});

export default theme;
