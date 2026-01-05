import React, { useState, useEffect } from "react";
import PortfoliosWelcomer from "../components/PortfoliosWelcomer";
import PortfolioCreator from "../components/PortfolioCreator";
import Portfolios from "../components/Portfolios";
import PortfolioDetailView from "../components/PortfolioDetailView";
import ToastNotification from "../components/ToastNotification";
import BrandedLoader from "../components/BrandedLoaders";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
import {
  getPortfolios,
  createPortfolio,
  deletePortfolio,
  updatePortfoilo,
} from "../services/PortfolioService";

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

export default function PortfoliosScreen() {
  const [portfolios, setPortfolios] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [focusedPortfolio, setFocusedPortfolio] = useState(null);
  const [updatedPortfolio, setUpdatedPortfolio] = useState(null);
  const [ready, setReady] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setToast({ ...toast, open: false });
  };

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = async () => {
    try {
      const data = await getPortfolios(1);
      setTimeout(() => {
        setReady(true);
      }, 2000);
      setPortfolios(data);
    } catch (error) {
      showToast("Error loading portfolios", "error");
    }
  };

  const handleCreatePortfolioClick = () => {
    setIsCreating(true);
  };

  const handleBackClick = () => {
    setIsCreating(false);
    setUpdatedPortfolio(null);
  };

  const handleCreateClick = async (portfolioData) => {
    if (updatedPortfolio) {
      try {
        await updatePortfoilo(portfolioData.portfolioId, portfolioData);
        setUpdatedPortfolio(null);
      } catch (error) {
        showToast("Failed to update portfolio", "error");
      }
    } else {
      try {
        await createPortfolio(portfolioData);
        showToast("Portfolio created successfully!");
      } catch (error) {
        showToast("Failed to create portfolio", "error");
      }
    }
    try {
      await loadPortfolios();
      setIsCreating(false);
    } catch (error) {
      showToast("Failed to load portfolios", "error");
    }
  };

  const handleEditPortfolioClick = (portfolio) => {
    setIsCreating(true);
    setUpdatedPortfolio(portfolio);
    console.log(portfolio);
  };

  const handleDeletePortfolioClick = async (portfolioId) => {
    try {
      await deletePortfolio(1, portfolioId);
      showToast("Portfolio deleted successfully!");
      await loadPortfolios();
    } catch (error) {
      showToast("Failed to delete portfolio", "error");
    }
  };

  const handleViewMoreClick = (portfolio) => {
    setFocusedPortfolio(portfolio);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {ready ? (
        isCreating ? (
          <PortfolioCreator
            handleBackClick={handleBackClick}
            handleCreateClick={handleCreateClick}
            portfolio={updatedPortfolio}
          />
        ) : portfolios.length === 0 ? (
          <PortfoliosWelcomer
            handleCreatePortfolioClick={handleCreatePortfolioClick}
          />
        ) : (
          <Portfolios
            portfolios={portfolios}
            handleCreatePortfolioClick={handleCreatePortfolioClick}
            handleDeletePortfolioClick={handleDeletePortfolioClick}
            handleViewMoreClick={handleViewMoreClick}
            handleEditPortfolioClick={handleEditPortfolioClick}
          />
        )
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
          <BrandedLoader message={"Loading Portfolios.."}></BrandedLoader>
        </Box>
      )}

      <PortfolioDetailView
        open={Boolean(focusedPortfolio)}
        portfolio={focusedPortfolio}
        onClose={() => setFocusedPortfolio(null)}
      />

      <ToastNotification
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={handleCloseToast}
      />
    </ThemeProvider>
  );
}
