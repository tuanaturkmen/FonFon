import React, { useState } from "react";
import { createTheme, ThemeProvider, CssBaseline, Box } from "@mui/material";
import FundTable from "../components/FundTable";
import TopFundsCards from "../components/TopFundsCard";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0B1120",
      paper: "#111827",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#9CA3AF",
    },
    success: { main: "#10B981" },
    error: { main: "#EF4444" },
    info: { main: "#10B981" },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #1F2937",
          paddingTop: "12px",
          paddingBottom: "16px",
        },
        head: {
          color: "#9CA3AF",
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          fontWeight: 600,
          borderBottom: "none",
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          color: "#9CA3AF",
          "&.Mui-selected": {
            backgroundColor: "#10B981",
            color: "white",
          },
        },
      },
    },
  },
});

export default function FundsScreen() {
  const [page, setPage] = useState(0);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      {page == 0 && (
        <Box sx={{ marginTop: 1 }}>
          <TopFundsCards />
          <FundTable />
        </Box>
      )}
    </ThemeProvider>
  );
}
