import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(
    async (
      artifactCMC,
      artifactCMCStaking,
      artifactCMCLiquidity,
      artifactERC20,
      artifactChainlink
    ) => {
      if (
        artifactCMC &&
        artifactCMCStaking &&
        artifactCMCLiquidity &&
        artifactChainlink
      ) {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const accounts = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();
        let addressCMC,
          contractCMC,
          addressCMCStaking,
          contractCMCStaking,
          addressCMCLiquidity,
          contractCMCLiquidity,
          addressChainlink,
          contractChainlink,
          isOwnerCMC,
          isOwnerCMCStaking,
          isOwnerCMCLiquidity;
        try {
          //CMC
          addressCMC = artifactCMC.networks[networkID].address;
          contractCMC = new web3.eth.Contract(artifactCMC["abi"], addressCMC);
          isOwnerCMC =
            (await contractCMC.methods.owner().call({ from: accounts[0] })) ===
            accounts[0];
          console.log("isOwnerCMC : " + isOwnerCMC);
          //CMC STaking
          addressCMCStaking = artifactCMCStaking.networks[networkID].address;
          contractCMCStaking = new web3.eth.Contract(
            artifactCMCStaking["abi"],
            addressCMCStaking
          );
          isOwnerCMCStaking =
            (await contractCMCStaking.methods
              .owner()
              .call({ from: accounts[0] })) === accounts[0];
          console.log("isOwnerCMCStaking : " + isOwnerCMCStaking);
          console.log("networkID : " + networkID);

          //CMC Liquidity

          addressCMCLiquidity =
            artifactCMCLiquidity.networks[networkID].address;
          contractCMCLiquidity = new web3.eth.Contract(
            artifactCMCLiquidity["abi"],
            addressCMCLiquidity
          );
          isOwnerCMCLiquidity =
            (await contractCMCLiquidity.methods
              .owner()
              .call({ from: accounts[0] })) === accounts[0];
          console.log("isOwnerCMCLiquidity : " + isOwnerCMCLiquidity);

          //Chainlink

          addressChainlink = artifactChainlink.networks[networkID].address;
          contractChainlink = new web3.eth.Contract(
            artifactChainlink["abi"],
            addressChainlink
          );
          console.log("addressChainlink =>", addressChainlink);
        } catch (err) {
          console.error(err);
        }
        dispatch({
          type: actions.init,
          data: {
            artifactCMC,
            artifactCMCStaking,
            artifactCMCLiquidity,
            artifactERC20,
            web3,
            accounts,
            networkID,
            contractCMC,
            contractCMCStaking,
            contractCMCLiquidity,
            addressCMC,
            addressCMCStaking,
            addressCMCLiquidity,
            isOwnerCMC,
            isOwnerCMCStaking,
            isOwnerCMCLiquidity,
          },
        });
      }
    },
    []
  );

  useEffect(() => {
    const tryInit = async () => {
      try {
        const artifactCMC = require("../../contracts/CMC.json");
        const artifactCMCStaking = require("../../contracts/CMCStaking.json");
        const artifactCMCLiquidity = require("../../contracts/CMCLiquidity.json");
        const artifactERC20 = require("../../contracts/ERC20.json");
        const artifactChainlink = require("../../contracts/Chainlink.json");
        init(
          artifactCMC,
          artifactCMCStaking,
          artifactCMCLiquidity,
          artifactERC20,
          artifactChainlink
        );
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(
        state.artifactCMC,
        state.artifactCMCStaking,
        state.artifactCMCLiquidity,
        state.artifactERC20
      );
    };

    events.forEach((e) => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach((e) => window.ethereum.removeListener(e, handleChange));
    };
  }, [
    init,
    state.artifactCMC,
    state.artifactCMCStaking,
    state.artifactCMCLiquidity,
    state.artifactERC20,
    state.artifactChainlink,
  ]);

  return (
    <EthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
