import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

import React from "react";

function Navbar() {
  return (
    <>
      <nav className="nav-menu">
        <ul className="nav-menu-items">
          <li className="nav-text" key="mint">
            <Link to="/dapp-staking/mint">
              <span>Mint</span>
            </Link>
          </li>
          <li className="nav-text" key="stake">
            <Link to="/dapp-staking/stake">
              <span>Stake</span>
            </Link>
          </li>
          <li className="nav-text" key="addliquidity">
            <Link to="/dapp-staking/add-liquidity">
              <span>Add liquidity</span>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;
