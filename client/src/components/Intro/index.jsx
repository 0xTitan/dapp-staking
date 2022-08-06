import { useState, useEffect } from "react";
import useEth from "../../contexts/EthContext/useEth";
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";
import UserInformations from "./UserInformations";

function Intro({ userInfo, refreshBalance, refreshOwner }) {
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
    },
  } = useEth();

  const [userAddress, setUserAddress] = useState(null);
  const [contractAddress, setContractAddress] = useState(null);
  const [balance, setBalance] = useState(0);
  const [balanceCMC, setBalanceCMC] = useState(0);
  const [network, setNetwork] = useState("");
  //const [ownerAddress, setOwnerAddress] = useState(null);

  useEffect(() => {
    async function getDetails() {
      if (state && accounts) {
        getCurrentAddress();
        getBalance();
        getCMCBalance();
        getNetwork();
      }
    }

    getDetails();
  }, [state, address, accounts, userInfo, refreshBalance]);

  const getBalance = async () => {
    // const value = contract
    //   ? await contract.methods.winningProposalID().call({ from: accounts[0] })
    //   : -1;

    const valueWei = web3 ? await web3.eth.getBalance(accounts[0]) : 0;
    let valueEth = web3 ? web3.utils.fromWei(valueWei, "ether") : 0;
    valueEth = Number(valueEth).toFixed(3);
    setBalance(valueEth + " ETH");
  };

  const getCMCBalance = async () => {
    // const value = contract
    //   ? await contract.methods.winningProposalID().call({ from: accounts[0] })
    //   : -1;

    const valueWei = contractCMC
      ? await contractCMC.methods.balanceOf(accounts[0]).call()
      : 0;
    console.log(valueWei);
    let valueCMC = web3 ? web3.utils.fromWei(valueWei, "ether") : 0;
    valueCMC = Number(valueCMC).toFixed(3);
    setBalanceCMC(valueCMC + " CMC");
  };

  const getCurrentAddress = async () => {
    if (accounts) {
      const addr =
        accounts[0].substring(0, 7) +
        "..." +
        accounts[0].substring(accounts[0].length - 4, accounts[0].length);
      setUserAddress(addr);
      refreshOwner(isOwnerCMC);
    }
  };

  const getNetwork = async () => {
    switch (networkID) {
      case 1:
        setNetwork("Ethereum");
        break;
      case 3:
        setNetwork("Ropsten");
        break;
      case 4:
        setNetwork("Rinkeby");
        break;
      case 5:
        setNetwork("Goerli");
        break;
      case 42:
        setNetwork("Kovan");
        break;
      default:
        setNetwork("local - Ganache");
    }
  };

  return (
    <div>
      {!state.artifactCMC ? (
        <NoticeNoArtifact />
      ) : !state.contractCMC ? (
        <NoticeWrongNetwork />
      ) : (
        <UserInformations
          userAddress={userAddress}
          contractAddress={contractAddress}
          balance={balance}
          balanceCMC={balanceCMC}
          network={network}
          // ownerAddress={ownerAddress}
        />
      )}
      <br />
    </div>
  );
}

export default Intro;
