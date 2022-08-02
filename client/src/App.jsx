import { EthProvider } from "./contexts/EthContext";
import { useState, useEffect } from "react";
import Intro from "./components/Intro/";
import Main from "./components/Main";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  const [userInfo, SetUserInfo] = useState();

  const refreshBalance = (info) => {
    SetUserInfo(info);
  };

  return (
    <EthProvider>
      <div id="App">
        <div className="container">
          <Intro userInfo={userInfo} refreshBalance={refreshBalance} />
          <hr />
          <Main refreshBalance={refreshBalance} />
          <hr />
          <Footer />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
