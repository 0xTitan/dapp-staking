import { useState, useEffect } from "react";
import useEth from "../../contexts/EthContext/useEth";
import Title from "./Title";
import Swap from "./Swap";
import StakingAdmin from "./StakingAdmin";
import Staking from "./Staking";

function Main() {
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

  return (
    <div className="main">
      {/* <Swap addressCMC={addressCMC} />
      <hr /> */}
      {isOwnerCMC && (
        <StakingAdmin
          contractCMCStaking={contractCMCStaking}
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
        />
      )}
    </div>
  );
}

export default Main;
