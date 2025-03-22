import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#39b6c7ff", // Butonun normal rengi
    },
    background: {
      default: "#dee0dfff", // Light mod arka planı
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            backgroundColor: "#F2613F",
            cursor: "not-allowed",
            opacity: 0.7, 
          },
        },
      },
    },
  },
});


export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#39b6c7ff", // Buton text rengi
    },
    background: {
      default: "#16222aff", // Dark mod arka planı
    },
    text: {
      primary: "#dee0dfff", // Yazı rengi
    },
  },
});



export const getColor = (theme, action) => {
  return (
    action === "bgcolor" ?
      theme === "dark" ? "#16222aff" : "#dee0dfff"
      : action === "color" ?
        theme === "dark" ? "#dee0dfff" : "#16222aff"
        : null
  )
};

export const getcolorflat = (theme, action) => {
  return (
    action === "bgcolor" ?
      theme === "dark" ? "#39b6c7ff": "#16222aff" 
      : action === "color" ?
        theme === "dark" ? "#16222aff" : "#dee0dfff"
        : null
  )
};