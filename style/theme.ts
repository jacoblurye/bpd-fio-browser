import { createMuiTheme } from "@material-ui/core/styles";

// @ts-ignore
const theme = createMuiTheme({
  shadows: ["none"],
  typography: {
    fontFamily: "Helvetica Neue",
  },
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
});

export default theme;
