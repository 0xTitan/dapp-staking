import { useState, useEffect } from "react";
import "./Mint.css";
import React from "react";

function Mint(props) {
  const {
    contractCMC,
    contractCMCStaking,
    addressCMCStaking,
    accounts,
    web3,
    refreshBalance,
  } = props;
  const [tokenAmountToMint, setTokenAmountToMint] = useState(
    "Enter CMC Token amount you want to mint"
  );

  /***********************Mint management************************ */
  const handleMintAmountChange = (e) => {
    const { value } = e.target;
    //remove non numeric character
    const result = value.replace(/\D/g, "");
    setTokenAmountToMint(result);
  };

  const handleMint = async () => {
    let decimals = web3.utils.toBN(18);
    const amount = web3.utils.toBN(tokenAmountToMint);
    const mintQty = amount.mul(web3.utils.toBN(10).pow(decimals));
    const transact = await contractCMC.methods
      .mint(mintQty)
      .send({ from: accounts[0] });
    refreshBalance("refresh after mint");
    setTokenAmountToMint("");
  };

  return (
    <div className="staking-mainMint">
      <span className="admin-instruction">
        Please enter you amount of CMC token you want to mint. Max is 1000 token
        !
      </span>
      <div className="mint-input">
        <input
          className="mint-inputTxt"
          name="mint"
          type="text"
          id="mint"
          value={tokenAmountToMint}
          onChange={(e) => handleMintAmountChange(e)}
        ></input>
        <button
          type="button"
          className="mint-button"
          onClick={handleMint}
          // disabled={duration <= 0 || hasDuration}
        >
          <span>Mint</span>
        </button>
      </div>
    </div>
  );
}

export default Mint;
