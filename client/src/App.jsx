import { EthProvider } from "./contexts/EthContext";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useEth from "./contexts/EthContext/useEth";
import Intro from "./components/Intro/";
import MainFooter from "./components/Footer";
import Navbar from "./components/Navbar/Navbar";
import MainStaking from "./components/Staking";
import MainMint from "./components/Mint";
import MainStakingAdmin from "./components/StakingAdmin";
import "./App.css";
import MainAddLiquidity from "./components/AddLiquidity";

function App() {
  const [userInfo, SetUserInfo] = useState();
  const [isOwner, setIsOwner] = useState(false);

  const refreshBalance = (info) => {
    SetUserInfo(info);
  };

  const refreshOwner = (isOwner) => {
    setIsOwner(isOwner);
  };

  return (
    <BrowserRouter>
      <EthProvider>
        <div id="App">
          {!isOwner && <div className="app-navbar">{<Navbar />}</div>}
          <div className="container">
            <Intro
              userInfo={userInfo}
              refreshBalance={refreshBalance}
              refreshOwner={refreshOwner}
            />

            <Routes>
              <Route
                path="/dapp-staking/"
                element={
                  isOwner ? (
                    <MainStakingAdmin />
                  ) : (
                    <div className="welcome">
                      <span className="instruction">
                        Welcome to CMC staking dapp. Please first mint some
                        token then enjoy staking !!!
                      </span>
                    </div>
                  )
                }
              />
              <Route
                path="/dapp-staking/mint"
                element={
                  !isOwner ? (
                    <MainMint refreshBalance={refreshBalance} />
                  ) : (
                    <Navigate to="/dapp-staking" replace />
                  )
                }
              />
              <Route
                path="/dapp-staking/stake"
                element={
                  !isOwner ? (
                    <MainStaking refreshBalance={refreshBalance} />
                  ) : (
                    <Navigate to="/dapp-staking" replace />
                  )
                }
              />
              <Route
                path="/dapp-staking/add-liquidity"
                element={
                  !isOwner ? (
                    <MainAddLiquidity refreshBalance={refreshBalance} />
                  ) : (
                    <Navigate to="/dapp-staking" replace />
                  )
                }
              />

              {/* <Main refreshBalance={refreshBalance} /> */}

              <Route
                path="*"
                element={<Navigate to="/dapp-staking" replace />}
              />
            </Routes>
            <MainFooter />
          </div>
        </div>
      </EthProvider>
    </BrowserRouter>
  );
}

export default App;
