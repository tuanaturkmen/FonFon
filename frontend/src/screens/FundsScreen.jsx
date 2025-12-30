import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider, CssBaseline, Box } from "@mui/material";
import FundTable from "../components/FundTable";
import TopFundsCards from "../components/TopFundsCard";
import BrandedLoader from "../components/BrandedLoaders";
import { getTopFunds, getAllFunds } from "../services/FundService";

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
  const [funds, setFunds] = useState([]);
  const [topFunds, setTopFunds] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loadFundData = async () => {
      try {
        const [funds, topFunds] = await Promise.all([
          getAllFunds(),
          getTopFunds(),
        ]);

        setFunds(funds);
        setTopFunds(topFunds.slice(0, 5));
        setTimeout(() => {
          setReady(true);
        }, 1000);
      } catch (error) {
        console.error(error); // TODO: toast
      }
    };
    loadFundData();
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {ready ? (
        <Box sx={{ marginTop: 2 }}>
          <TopFundsCards topFunds={topFunds} />
          <FundTable funds={funds} />
        </Box>
      ) : (
        <Box
          sx={{
            height: "90vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BrandedLoader message={"Loading Funds.."}></BrandedLoader>
        </Box>
      )}
    </ThemeProvider>
  );
}
