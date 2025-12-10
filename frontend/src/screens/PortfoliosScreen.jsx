import React, { useState, useEffect } from "react";
import PortfoliosWelcomer from "../components/PortfoliosWelcomer";
import PortfolioCreator from "../components/PortfolioCreator";

export default function PortfoliosScreen() {
  const [portfolios, setPortfolios] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    // Get user portfolios from BE
    console.log("PortfolisScreen");
  }, []);

  const handleCreatePortfolioClick = () => {
    console.log("handleCreatePortfolioClick");
    setIsCreating(true);
  };

  const handleBackClick = () => {
    console.log("handleBackClick");
    setIsCreating(false);
  };

  return (
    <>
      {portfolios.length == 0 && !isCreating && (
        <PortfoliosWelcomer
          handleCreatePortfolioClick={handleCreatePortfolioClick}
        ></PortfoliosWelcomer>
      )}

      {isCreating && (
        <PortfolioCreator handleBackClick={handleBackClick}></PortfolioCreator>
      )}
    </>
  );
}
