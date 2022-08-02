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
      web3,
      networkID,
      isOwnerCMC,
      isOwnerCMCStaking,
    },
  } = useEth();

  return (
    <div className="main">
      {/* <Swap />
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
