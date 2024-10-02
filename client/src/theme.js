import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: '#F25C05', // Customize the primary color
    },
    secondary: {
      main: '#CCCCCC', // Customize the secondary color
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif', // Customize the font family
    h1: {
      color: "#0f172a"
    },
    h2: {
      color: '#222222', // Color for h1
    },
    h4: {
      color: '#F25C05', // Color for h4
    },
    h5: {
      color: '#6a6a6a', // Color for body1
    },
    body1: {
      color: '#222222', // Color for body2
    },
    caption: {
      color: '#999999', // Color for caption
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Customize button styles
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: '1px solid #e0e0e0', // Customize DataGrid styles
        },
      },
    },
  },
});
