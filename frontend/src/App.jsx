import React, { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import LandingPage from "./screens/LandingScreen";
import FundsScreen from "./screens/FundsScreen";
import PortfoliosScreen from "./screens/PortfoliosScreen";
import CompareScreen from "./screens/CompareScreen";
import { sendLogout } from "./services/UserService";
import UnauthorizedPage from "./components/UnauthorizedAccess";

function App() {
  useEffect(() => {
    sessionStorage.removeItem("accessToken");
  }, []);

  const [started, setStarted] = useState(false);
  const [page, setPage] = useState(0);
  const [authorized, setAuthorized] = useState(false);

  const handleStart = () => {
    setStarted(true);
  };

  const onLogin = () => {
    setStarted(true);
    setAuthorized(true);
  };

  const handleLogout = async () => {
    sessionStorage.removeItem("accessToken");
    await sendLogout();
    setAuthorized(false);
    setStarted(false);
    setPage(0);
  };

  return (
    <>
      {!started ? (
        <LandingPage handleStart={handleStart} onLogin={onLogin}></LandingPage>
      ) : (
        <>
          <Header page={page} setPage={setPage} onLogout={handleLogout} />
          {page == 0 && <FundsScreen />}
          {page == 1 &&
            (authorized ? (
              <PortfoliosScreen />
            ) : (
              <UnauthorizedPage onLogin={onLogin} />
            ))}
          {page == 2 &&
            (authorized ? (
              <CompareScreen />
            ) : (
              <UnauthorizedPage onLogin={onLogin} />
            ))}
        </>
      )}
    </>
  );
}

export default App;
