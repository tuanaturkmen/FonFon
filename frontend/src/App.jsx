import React, { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import LandingPage from "./screens/LandingScreen";
import FundsScreen from "./screens/FundsScreen";
import PortfoliosScreen from "./screens/PortfoliosScreen";
import CompareScreen from "./screens/CompareScreen";
import { sendLogout } from "./services/UserService";

function App() {
  const [started, setStarted] = useState(false);
  const [page, setPage] = useState(0);

  const handleStart = () => {
    setStarted(true);
  };

  const onLogin = () => {
    setStarted(true);
  };

  const handleLogout = async () => {
    sessionStorage.removeItem("accessToken");
    await sendLogout();
    setStarted(false);
  };

  return (
    <>
      {!started ? (
        <LandingPage handleStart={handleStart} onLogin={onLogin}></LandingPage>
      ) : (
        <>
          <Header page={page} setPage={setPage} onLogout={handleLogout} />
          {page == 0 && <FundsScreen />}
          {page == 1 && <PortfoliosScreen />}
          {page == 2 && <CompareScreen />}
        </>
      )}
    </>
  );
}

export default App;
