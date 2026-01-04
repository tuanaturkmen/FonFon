import React, { useState, useEffect } from "react";
import PortfoliosWelcomer from "../components/PortfoliosWelcomer";
import PortfolioCreator from "../components/PortfolioCreator";
import Portfolios from "../components/Portfolios";
import PortfolioDetailView from "../components/PortfolioDetailView";
import ToastNotification from "../components/ToastNotification";
import {
  getPortfolios,
  createPortfolio,
  deletePortfolio,
  updatePortfoilo,
} from "../services/PortfolioService";

export default function PortfoliosScreen() {
  const [portfolios, setPortfolios] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [focusedPortfolio, setFocusedPortfolio] = useState(null);
  const [updatedPortfolio, setUpdatedPortfolio] = useState(null);

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
    setUpdatedPortfolio(null);
  };

  const handleCreateClick = async (portfolioData) => {
    if (updatedPortfolio) {
      try {
        const portfolioId = 1;
        await updatePortfoilo(portfolioId, portfolioData);
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
    <>
      {isCreating ? (
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
    </>
  );
}
