import { useState, useEffect } from "react";
import useEth from "../../contexts/EthContext/useEth";
import Staking from "./Staking";

function MainStaking({ refreshBalance }) {
  const {
    state,
    state: {
      contractCMC,
      contractCMCStaking,
      accounts,
      addressCMCStaking,
      web3,
    },
  } = useEth();

  return (
    <div className="main">
      {/* <Swap addressCMC={addressCMC} />
      <hr /> */}
      {
        <Staking
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

export default MainStaking;
