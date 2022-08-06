import React from "react";
import AddLiquidity from "./AddLiquidity";
import useEth from "../../contexts/EthContext/useEth";

function MainAddLiquidity({ refreshBalance }) {
  const {
    state,
    state: {
      artifactERC20,
      addressCMC,
      addressCMCLiquidity,
      contractCMC,
      contractCMCLiquidity,
      accounts,
      web3,
      networkID,
      isOwnerCMC,
      isOwnerCMCStaking,
    },
  } = useEth();

  return (
    <AddLiquidity
      artifactERC20={artifactERC20}
      addressCMC={addressCMC}
      addressCMCLiquidity={addressCMCLiquidity}
      contractCMC={contractCMC}
      contractCMCLiquidity={contractCMCLiquidity}
      accounts={accounts}
      web3={web3}
      refreshBalance={refreshBalance}
    />
  );
}

export default MainAddLiquidity;
