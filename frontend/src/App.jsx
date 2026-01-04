import React, { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import FundsScreen from "./screens/FundsScreen";
import PortfoliosScreen from "./screens/PortfoliosScreen";
import LandingPage from "./screens/LandingScreen";

function App() {
  const [started, setStarted] = useState(false);
  const [page, setPage] = useState(0);

  const handleStart = () => {
    setStarted(true);
  };

  const handleLogout = () => {
    setStarted(false);
  };

  return (
    <>
      {!started ? (
        <LandingPage handleStart={handleStart}></LandingPage>
      ) : (
        <>
          <Header page={page} setPage={setPage} onLogout={handleLogout} />
          {page == 0 && <FundsScreen />}
          {page == 1 && <PortfoliosScreen />}
        </>
      )}
    </>
  );
}

export default App;
