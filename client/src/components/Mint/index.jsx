import { useState, useEffect } from "react";
import useEth from "../../contexts/EthContext/useEth";
import Mint from "./Mint";

function MainMint({ refreshBalance }) {
  const {
    state,
    state: {
      contractCMC,
      contractCMCStaking,
      accounts,
      addressCMCStaking,
      addressCMC,
      web3,
      networkID,
      isOwnerCMC,
      isOwnerCMCStaking,
    },
  } = useEth();

  return (
    <div className="main">
      {/* <Swap addressCMC={addressCMC} />
      <hr /> */}
      {
        <Mint
          contractCMC={contractCMC}
          contractCMCStaking={contractCMCStaking}
          addressCMCStaking={addressCMCStaking}
          accounts={accounts}
          web3={web3}
          refreshBalance={refreshBalance}
        />
      }
    </div>
  );
}

export default MainMint;
