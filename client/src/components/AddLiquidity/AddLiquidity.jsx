import React from "react";
import { useCallback } from "react";
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

  //   const addressWETHRopsten = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
  const addressWETHRopsten = "0x94A5371dBF1112C7fA2dd038D22d9B3EcF7C7305";

  const [tokenAmountToAddCMC, setTokenAmountToAddCMC] = useState(
    "Enter CMC Token amount you want to add"
  );

  const [tokenAmountToAddWETH, setTokenAmountToAddWETH] = useState(
    "Enter WETH Token amount you want to add"
  );

  const [pairAdress, SetPairAdress] = useState(0);
  const [lpAmount, setLPAmount] = useState(0);
  const [rewardEarn, setRewardEarn] = useState(0);

  useEffect(() => {
    getPairAdress();
    getLPBalance();
    //start timer to display reward
    const interval = setInterval(() => {
      getReward();
    }, 2000);

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

  /************************Handle stake liquidity************************** */

  const handleStakeLiquidity = async () => {
    const amount = lpAmount * 1e18;
    const stakeQty = web3.utils.toBN(amount);
    console.log(amount);
    console.log(stakeQty);
    const contractPair = new web3.eth.Contract(
      artifactERC20["abi"],
      pairAdress
    );
    //we approve cmc liquidity contract to manage LP and stake them
    const approved = await contractPair.methods
      .approve(addressCMCLiquidity, stakeQty)
      .send({
        from: accounts[0],
      });
    console.log("approved");
    let transac;
    if (approved) {
      try {
        transac = await contractCMCLiquidity.methods
          .stake(stakeQty)
          .send({ from: accounts[0] });
        refreshBalance("refresh after stake lp");
      } catch (error) {
        console.log(error);
        console.log(transac);
        console.log(await contractCMCLiquidity.methods.stakingToken().call());
        console.log(await contractCMCLiquidity.methods.rewardsToken().call());
      }
    }
  };

  /************************Remove liquidity************************** */

  const handleRemoveLiquidity = async () => {
    //approve WETH
    const contractPair = new web3.eth.Contract(
      artifactERC20["abi"],
      pairAdress
    );

    const amount = lpAmount * 1e18;
    console.log(amount);
    const approvedPair = await contractPair.methods
      .approve(addressCMCLiquidity, web3.utils.toBN(amount))
      .send({
        from: accounts[0],
      });

    if (approvedPair) {
      try {
        const transac = await contractCMCLiquidity.methods
          .removeLiquidity(addressWETHRopsten, addressCMC)
          .send({ from: accounts[0] });
        // const transact = await contractCMC.methods
        //   .mint(mintQty)
        //   .send({ from: accounts[0] });
        console.log(transac);
        refreshBalance("refresh after remove liquidity");
        getLPBalance();
      } catch (err) {
        console.log("Error when adding liquidity : " + err);
      }
    }
  };

  /************************Withdraw LP************************** */

  const handleWithdrawLiquidity = async () => {
    const amount = lpAmount * 1e18;
    const stakeQty = web3.utils.toBN(amount);
    const transact = await contractCMCLiquidity.methods
      .withdraw(stakeQty)
      .send({ from: accounts[0] });
    refreshBalance("refresh after widthdraw LP");
  };

  /************************Withdraw Reward************************** */

  const handleWithdrawReward = async () => {
    if (contractCMCLiquidity) {
      await contractCMCLiquidity.methods
        .getReward()
        .send({ from: accounts[0] });
      getLPBalance();
      refreshBalance("refresh after get liq reward");
    }
  };

  /****************Get LP balance **************************************/
  const getLPBalance = async () => {
    const contractPair =
      web3 &&
      pairAdress &&
      new web3.eth.Contract(artifactERC20["abi"], pairAdress);

    const balance = contractPair
      ? await contractPair.methods.balanceOf(accounts[0]).call()
      : 0;

    let valueLP = web3
      ? web3.utils.fromWei(web3.utils.toBN(balance), "ether")
      : 0;

    setLPAmount(valueLP);
  };

  /***********************Get reward info*********************** */
  const getReward = async () => {
    if (contractCMCLiquidity) {
      let reward = await contractCMCLiquidity.methods
        .earned(accounts[0])
        .call();
      reward = web3 ? web3.utils.fromWei(reward, "ether") : 0;
      setRewardEarn(reward);
    }
  };

  const getLPHeldByContract = async () => {
    // if (contractCMCStaking) {
    let balance =
      contractCMCLiquidity &&
      (await contractCMCLiquidity.methods.balanceOf(accounts[0]).call());
    console.log("balance held by contract : " + balance);
    //   reward = web3 ? web3.utils.fromWei(reward, "ether") : 0;
    //   setRewardEarn(reward);
    // }
  };

  const getPairAdress = async () => {
    const addr =
      contractCMCLiquidity &&
      (await contractCMCLiquidity.methods
        .getPairAdress(addressWETHRopsten, addressCMC)
        .call());
    SetPairAdress(addr);
    console.log("pair address : " + addr);
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
      <div className="withdrawLiquidity-operation">
        <div className="stakeLiquidity-remove">
          <button
            type="button"
            className="stakeLiquidity-button"
            onClick={handleStakeLiquidity}
            disabled={!lpAmount > 0}
          >
            <span>Stake LP</span>
          </button>
        </div>
        <div className="withdrawLiquidity-remove">
          <button
            type="button"
            className="withdrawLiquidity-button"
            onClick={handleRemoveLiquidity}
            disabled={!lpAmount > 0}
          >
            <span>Remove LP</span>
          </button>
        </div>
        <div className="withdrawLiquidity-remove">
          <button
            type="button"
            className="withdrawLiquidity-button"
            onClick={handleWithdrawLiquidity}
            disabled={!lpAmount > 0}
          >
            <span>Withdraw LP</span>
          </button>
        </div>
        <div className="withdrawLiquidity-reward">
          <button
            type="button"
            className="withdrawReward-button"
            onClick={handleWithdrawReward}
            // disabled={duration <= 0 || hasDuration}
          >
            <span>Withdraw rewards</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddLiquidity;
