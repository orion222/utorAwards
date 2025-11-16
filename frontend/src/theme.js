import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#7CD93A",          // var(--primary)
      light: "#CFD4C0",         // var(--primary-neutral)
      dark: "#6ABB30",          // var(--primary-hover)
      contrastText: "#232715",  // var(--text)
    },
    secondary: {
      main: "#F59B66",          // var(--secondary)
      contrastText: "#232715",
    },

    // Backgrounds
    background: {
      default: "#FCFEFB",       // var(--bg)
      paper: "#F8FAF4",         // var(--bg-light)
    },

    custom: {
      bgDark: "#E8EBDF",        // var(--bg-dark)
      accent: "#BBA3E5",        // var(--accent)
      primaryNeutral: "#CFD4C0",
      border: "#D9DCCF",
    },

    // Text colors
    text: {
      primary: "#232715",       // var(--text)
      secondary: "#6B6F5A",     // var(--text-muted)
      disabled: "#8C927A",      // var(--text-muted-hover)
    },

    // Semantic colors
    success: {
      main: "#62C53C",
    },
    error: {
      main: "#E4584F",
    },
    info: {
      main: "#7DA4F2",
    },
    warning: {
      main: "#F2C94C",
    },
  },

  typography: {
    fontFamily: `"Inter", sans-serif`,
  },
});

export default theme;