import { useState, useEffect } from "react";
import useEth from "../../contexts/EthContext/useEth";

import Welcome from "./Welcome";
import Desc from "./Desc";
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";
import UserInformations from "./UserInformations";

function Intro() {
  const {
    state,
    state: { contract, accounts, address, web3 },
  } = useEth();

  const [userAddress, setUserAddress] = useState(null);
  const [contractAddress, setContractAddress] = useState(null);
  //const [ownerAddress, setOwnerAddress] = useState(null);

  useEffect(() => {
    async function getDetails() {
      if (state) {
        //à implémenter lorsque nous aurons ajouté l'inheritance ownable d'Open Zeppelin:
        //let owner = await contract.methods.owner().call();

        setUserAddress(accounts);
        setContractAddress(address);
        //setOwnerAddress(owner);
      }
    }

    getDetails();
  }, [state, address, accounts]);

  return (
    <div>
      <Welcome />
      <br />
      {!state.artifact ? (
        <NoticeNoArtifact />
      ) : !state.contract ? (
        <NoticeWrongNetwork />
      ) : (
        <UserInformations
          userAddress={userAddress}
          contractAddress={contractAddress}
          // ownerAddress={ownerAddress}
        />
      )}
      <br />
      <Desc />
    </div>
  );
}

export default Intro;
