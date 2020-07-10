import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    background: {
      default: "#000",
      paper: "#222",
    },
  },
  shape: {
    borderRadius: 5,
  },
  typography: {
    allVariants: {
      color: "white",
    },
  },
});

export default theme;
