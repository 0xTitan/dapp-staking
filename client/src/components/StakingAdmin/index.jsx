import { useState, useEffect } from "react";
import useEth from "../../contexts/EthContext/useEth";
import StakingAdmin from "./StakingAdmin";

function MainStakingAdmin({ refreshBalance }) {
  const {
    state,
    state: {
      contractCMC,
      contractCMCStaking,
      contractCMCLiquidity,
      accounts,
      addressCMCStaking,
      addressCMCLiquidity,
      web3,
      networkID,
      isOwnerCMC,
      isOwnerCMCStaking,
    },
  } = useEth();

  return (
    <div className="main">
      <StakingAdmin
        key="simpleStaking"
        contractCMC={contractCMC}
        contractCMCStaking={contractCMCStaking}
        addressCMCStaking={addressCMCStaking}
        accounts={accounts}
        web3={web3}
        adminInstruction={
          "Admin please proceed with SIMPLE staking program configuration"
        }
      />
      <hr></hr>
      <StakingAdmin
        key="liquidityStaking"
        contractCMC={contractCMC}
        contractCMCStaking={contractCMCLiquidity}
        addressCMCStaking={addressCMCLiquidity}
        accounts={accounts}
        web3={web3}
        adminInstruction={
          "Admin please proceed with LIQUIDITY staking program configuration"
        }
      />
    </div>
  );
}

export default MainStakingAdmin;
