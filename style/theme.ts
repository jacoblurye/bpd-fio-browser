import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  shape: {
    borderRadius: 5,
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
