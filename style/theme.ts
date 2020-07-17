import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  overrides: {
    MuiChip: {
      root: {
        borderRadius: 5,
      },
    },
  },
});

export default theme;
