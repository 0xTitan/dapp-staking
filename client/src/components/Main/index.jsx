//import { useState, useEffect } from "react";
// import useEth from "../../contexts/EthContext/useEth";
import Title from "./Title";
import Body from "./Body";


function Main() {
  // const {
  //   state,
  //   state: { contract, accounts, address, web3 },
  // } = useEth();

  

  // useEffect(()=>{},[])

  return (
    <div className="main">
      <Title />
      <Body/>
    </div>
  );
}

export default Main;
