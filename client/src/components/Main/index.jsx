import { useState, useEffect } from "react";
import useEth from "../../contexts/EthContext/useEth";
import Title from "./Title";
import Body from "./Body";
import StakingAdmin from "./StakingAdmin";
import Staking from "./Staking";

function Main() {
  const {
    state,
    state: {
      contractCMC,
      contractCMCStaking,
      accounts,
      address,
      web3,
      networkID,
      isOwnerCMC,
      isOwnerCMCStaking,
    },
  } = useEth();

  // useEffect(()=>{},[])

  return (
    <div className="main">
      {isOwnerCMC && (
        <StakingAdmin
          contractCMCStaking={contractCMCStaking}
          accounts={accounts}
          web3={web3}
        />
      )}
      {!isOwnerCMC && (
        <Staking
          contractCMCStaking={contractCMCStaking}
          accounts={accounts}
          web3={web3}
        />
      )}
      {/* <Body /> */}
    </div>
  );
}

export default Main;
