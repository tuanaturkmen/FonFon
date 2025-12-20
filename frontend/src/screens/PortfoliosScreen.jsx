import React, { useState, useEffect } from "react";
import PortfoliosWelcomer from "../components/PortfoliosWelcomer";
import PortfolioCreator from "../components/PortfolioCreator";
import Portfolios from "../components/Portfolios";
import ToastNotification from "../components/ToastNotification"; // Adjusted path
import {
  getPortfolios,
  createPortfolio,
  deletePortfolio,
} from "../services/PortfolioService";

export default function PortfoliosScreen() {
  const [portfolios, setPortfolios] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

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
  };

  const handleCreateClick = async (portfolioData) => {
    try {
      await createPortfolio(portfolioData);
      showToast("Portfolio created successfully!");
      await loadPortfolios();
      setIsCreating(false);
    } catch (error) {
      showToast("Failed to create portfolio", "error");
    }
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

  return (
    <>
      {portfolios.length === 0 && !isCreating && (
        <PortfoliosWelcomer
          handleCreatePortfolioClick={handleCreatePortfolioClick}
        />
      )}

      {portfolios.length > 0 && !isCreating && (
        <Portfolios
          portfolios={portfolios}
          handleCreatePortfolioClick={handleCreatePortfolioClick}
          handleDeletePortfolioClick={handleDeletePortfolioClick}
        />
      )}

      {isCreating && (
        <PortfolioCreator
          handleBackClick={handleBackClick}
          handleCreateClick={handleCreateClick}
        />
      )}

      <ToastNotification
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={handleCloseToast}
      />
    </>
  );
}
