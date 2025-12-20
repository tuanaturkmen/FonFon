import React, { useState, useEffect } from "react";
import PortfoliosWelcomer from "../components/PortfoliosWelcomer";
import PortfolioCreator from "../components/PortfolioCreator";
import Portfolios from "../components/Portfolios";
import { getPortfolios, createPortfolio } from "../services/PortfolioService";

export default function PortfoliosScreen() {
  const [portfolios, setPortfolios] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = async () => {
    const portfolios = await getPortfolios(1);
    setPortfolios(portfolios);
  };

  const handleCreatePortfolioClick = () => {
    console.log("handleCreatePortfolioClick");
    setIsCreating(true);
  };

  const handleBackClick = () => {
    console.log("handleBackClick");
    setIsCreating(false);
  };

  const handleCreateClick = async (portfolioData) => {
    console.log("handleCreateClick");
    await createPortfolio(portfolioData);
    await loadPortfolios();
    setIsCreating(false);
  };

  return (
    <>
      {portfolios.length == 0 && !isCreating && (
        <PortfoliosWelcomer
          handleCreatePortfolioClick={handleCreatePortfolioClick}
        ></PortfoliosWelcomer>
      )}

      {portfolios.length > 0 && !isCreating && (
        <Portfolios
          portfolios={portfolios}
          handleCreatePortfolioClick={handleCreatePortfolioClick}
        ></Portfolios>
      )}

      {isCreating && (
        <PortfolioCreator
          handleBackClick={handleBackClick}
          handleCreateClick={handleCreateClick}
        ></PortfolioCreator>
      )}
    </>
  );
}
