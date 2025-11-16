import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#63a4ff",
      dark: "#004ba0",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ff9800",
      light: "#ffc947",
      dark: "#c66900",
      contrastText: "#000000",
    },
    background: {
      main: "#F8FAF4",
      darkMain: "#E8EBDF",
    },
  },
});

export default theme;
