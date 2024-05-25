import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme";
import Routing from "./containers/MainRoute";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Routing />
      </div>
    </ThemeProvider>
  );
}