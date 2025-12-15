import React, { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import FundsScreen from "./screens/FundsScreen";
import PortfoliosScreen from "./screens/PortfoliosScreen";

function App() {
  const [page, setPage] = useState(0);

  return (
    <>
      <Header page={page} setPage={setPage} />
      {page == 0 && <FundsScreen />}
      {page == 1 && <PortfoliosScreen />}
    </>
  );
}

export default App;
