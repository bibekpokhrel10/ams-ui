// npm i @material-ui/styles;

import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#1a237e",
    },
  },
  overrides: {
    MuiButton: {
      root: {
        fontSize: "1rem",
        textTransform: "none",
      },
    },
  },
});
