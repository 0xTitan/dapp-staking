import { useState, useEffect } from "react";
import useEth from "../../contexts/EthContext/useEth";
import Title from "./Title";
import Swap from "./Swap";
import StakingAdmin from "./StakingAdmin";
import Staking from "./Staking";

function Main({ refreshBalance }) {
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
  console.log("address CMC =>", addressCMC);

  useEffect(() => {
    console.log(state);
  });

  return (
    <div className="main">
      {/* <Swap addressCMC={addressCMC} />
      <hr /> */}
      {isOwnerCMC && (
        <StakingAdmin
          contractCMC={contractCMC}
          contractCMCStaking={contractCMCStaking}
          addressCMCStaking={addressCMCStaking}
          accounts={accounts}
          web3={web3}
        />
      )}
      {!isOwnerCMC && (
        <Staking
          contractCMC={contractCMC}
          contractCMCStaking={contractCMCStaking}
          addressCMCStaking={addressCMCStaking}
          accounts={accounts}
          web3={web3}
          refreshBalance={refreshBalance}
        />
      )}
    </div>
  );
}

export default Main;
