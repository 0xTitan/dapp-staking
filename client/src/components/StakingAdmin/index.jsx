import { useState, useEffect } from "react";
import useEth from "../../contexts/EthContext/useEth";
import StakingAdmin from "./StakingAdmin";

function MainStakingAdmin({ refreshBalance }) {
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
      {
        <StakingAdmin
          contractCMC={contractCMC}
          contractCMCStaking={contractCMCStaking}
          addressCMCStaking={addressCMCStaking}
          accounts={accounts}
          web3={web3}
        />
      }
    </div>
  );
}

export default MainStakingAdmin;
