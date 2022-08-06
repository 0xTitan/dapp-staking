import React from "react";
import { useState, useEffect } from "react";
import "./AddLiquidity.css";

function AddLiquidity(props) {
  const {
    artifactERC20,
    addressCMC,
    addressCMCLiquidity,
    contractCMC,
    contractCMCLiquidity,
    accounts,
    web3,
    refreshBalance,
  } = props;

  const addressWETHRopsten = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
  const CMC_WETH_pairAdress = "0x186bb7B3A3E78C1980052915B7AfAA4691248dc6";
  const [tokenAmountToAddCMC, setTokenAmountToAddCMC] = useState(
    "Enter CMC Token amount you want to add"
  );

  const [tokenAmountToAddWETH, setTokenAmountToAddWETH] = useState(
    "Enter WETH Token amount you want to add"
  );

  const [lpAmount, setLPAmount] = useState(0);
  const [rewardEarn, setRewardEarn] = useState(0);

  useEffect(() => {
    getLPBalance();

    //start timer to display reward
    const interval = setInterval(() => {
      getReward();
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  });

  /***********************add liquidity management************************ */
  const handleCMCAmountChange = (e) => {
    const { value } = e.target;
    //remove non numeric character
    const result = value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*?)\..*/g, "$1")
      .replace(/^0[^.]/, "0");
    setTokenAmountToAddCMC(result);
  };

  const handleWETHAmountChange = (e) => {
    const { value } = e.target;
    //remove non numeric character
    const result = value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*?)\..*/g, "$1")
      .replace(/^0[^.]/, "0");
    setTokenAmountToAddWETH(result);
  };

  const handleAddLiquidity = async () => {
    console.log(contractCMCLiquidity);
    const amountCMC = web3.utils.toBN(tokenAmountToAddCMC * 1e18);
    const amountWETH = web3.utils.toBN(tokenAmountToAddWETH * 1e18);
    console.log("amountCMC : " + amountCMC);
    console.log("amountWETH : " + amountWETH);
    //const qtyCMC = amountCMC.mul(web3.utils.toBN(10).pow(decimals));
    //const qtyWETH = amountWETH.mul(web3.utils.toBN(10).pow(decimals));

    //approve CMC liquidity
    const approvedCMC = await contractCMC.methods
      .approve(addressCMCLiquidity, amountCMC)
      .send({
        from: accounts[0],
      });

    //approve WETH
    const contractWETH = new web3.eth.Contract(
      artifactERC20["abi"],
      addressWETHRopsten
    );

    const approvedWETH = await contractWETH.methods
      .approve(addressCMCLiquidity, amountWETH)
      .send({
        from: accounts[0],
      });

    if (approvedCMC && approvedWETH) {
      try {
        const transac = await contractCMCLiquidity.methods
          .addLiquidity(addressWETHRopsten, addressCMC, amountWETH, amountCMC)
          .send({ from: accounts[0] });
        // const transact = await contractCMC.methods
        //   .mint(mintQty)
        //   .send({ from: accounts[0] });
        console.log(transac);
        refreshBalance("refresh after add liquidity");
        setTokenAmountToAddCMC("");
        setTokenAmountToAddWETH("");
      } catch (err) {
        console.log("Error when adding liquidity : " + err);
      }
    }
  };

  /****************Get LP balance **************************************/
  const getLPBalance = async () => {
    const contractPair =
      web3 && new web3.eth.Contract(artifactERC20["abi"], CMC_WETH_pairAdress);

    const balance = contractPair
      ? await contractPair.methods.balanceOf(accounts[0]).call()
      : 0;

    let valueLP = web3 ? web3.utils.fromWei(balance, "ether") : 0;

    setLPAmount(valueLP);
  };

  /***********************Get reward info*********************** */
  const getReward = async () => {
    // if (contractCMCStaking) {
    //   let reward = await contractCMCStaking.methods.earned(accounts[0]).call();
    //   reward = web3 ? web3.utils.fromWei(reward, "ether") : 0;
    //   setRewardEarn(reward);
    // }
  };

  return (
    <div className="addLiquidity-main">
      <span className="admin-instruction">
        Please add liquitiy. For now now only CMC/WETH pair is available. More
        will come soon !
      </span>
      <div className="lp-info">
        <div>
          <span className="admin-instruction">lp amount : {lpAmount}</span>
        </div>
        <div>
          <span className="admin-instruction">
            | Rewards earned : {rewardEarn}
          </span>
        </div>
      </div>
      <div className="addLiquidity-operation">
        <div className="addLiquidity-asset">
          <div className="input-box">
            <input
              className="tokenCMC-inputTxt"
              name="tokenCMC"
              type="text"
              id="tokenCMC"
              value={tokenAmountToAddCMC}
              onChange={(e) => handleCMCAmountChange(e)}
            ></input>
            <span className="unit">CMC</span>
          </div>
          <div className="input-box">
            <input
              className="tokenWETH-inputTxt"
              name="tokenWETH"
              type="text"
              id="tokenWETH"
              value={tokenAmountToAddWETH}
              onChange={(e) => handleWETHAmountChange(e)}
            ></input>
            <span className="unit">WETH</span>
          </div>
        </div>
        <div className="addLiquidity-deposit">
          <button
            type="button"
            className="addLiquidity-button"
            onClick={handleAddLiquidity}
            // disabled={duration <= 0 || hasDuration}
          >
            <span>Add liquidity</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddLiquidity;
