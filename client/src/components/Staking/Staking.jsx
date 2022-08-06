import { useState, useEffect } from "react";
import "./Staking.css";

function Staking(props) {
  const {
    contractCMC,
    contractCMCStaking,
    addressCMCStaking,
    accounts,
    web3,
    refreshBalance,
  } = props;
  const [tokenAmountToStake, setTokenAmountToStake] = useState(
    "Enter CMC Token amount you want to stake"
  );
  const [tokenAmountToWidthdraw, setTokenAmountToWidthdraw] = useState(
    "Enter CMC Token amount you want to withdraw"
  );

  const [balanceCMC, setBalanceCMC] = useState(0);
  const [rewardEarn, setRewardEarn] = useState(0);
  const [stakedAmount, setStakedAmount] = useState(0);

  useEffect(() => {
    //get CMC balance
    const getCMCBalance = async () => {
      const valueWei = contractCMC
        ? await contractCMC.methods.balanceOf(accounts[0]).call()
        : 0;
      let valueCMC = web3 ? web3.utils.fromWei(valueWei, "ether") : 0;
      setBalanceCMC(valueCMC);
    };

    getCMCBalance();
    getStakedBalance();

    //start timer to display reward
    const interval = setInterval(() => {
      getReward();
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  });

  /***********************Staking management************************ */
  const handleStakeAmountChange = (e) => {
    const { value } = e.target;
    //remove non numeric character
    const result = value.replace(/\D/g, "");
    setTokenAmountToStake(result);
  };

  const handleStake = async () => {
    let decimals = web3.utils.toBN(18);
    const amount = web3.utils.toBN(tokenAmountToStake);
    const stakeQty = amount.mul(web3.utils.toBN(10).pow(decimals));
    const approved = await contractCMC.methods
      .approve(addressCMCStaking, stakeQty)
      .send({
        from: accounts[0],
      });
    if (approved) {
      const transact = await contractCMCStaking.methods
        .stake(stakeQty)
        .send({ from: accounts[0] });
      getStakedBalance();
      refreshBalance("refresh after stake");
      setTokenAmountToStake("");
    }
  };

  /***********************Widthdraw management************************ */
  const handleWidthdrawAmountChange = (e) => {
    const { value } = e.target;
    //remove non numeric character
    const result = value.replace(/\D/g, "");
    setTokenAmountToWidthdraw(result);
  };

  const handleWithdraw = async () => {
    let decimals = web3.utils.toBN(18);
    const amount = web3.utils.toBN(tokenAmountToWidthdraw);
    const withdrawQty = amount.mul(web3.utils.toBN(10).pow(decimals));
    const transact = await contractCMCStaking.methods
      .withdraw(withdrawQty)
      .send({ from: accounts[0] });
    getStakedBalance();
    refreshBalance("refresh after widthdraw");
    setTokenAmountToWidthdraw("");
  };

  /***********************Get staked amout info************************ */
  const getStakedBalance = async () => {
    if (contractCMCStaking) {
      let stakedBalance = await contractCMCStaking.methods
        .balanceOf(accounts[0])
        .call();
      stakedBalance = web3 ? web3.utils.fromWei(stakedBalance, "ether") : 0;
      setStakedAmount(stakedBalance);
    }
  };

  /***********************Get reward info*********************** */
  const getReward = async () => {
    if (contractCMCStaking) {
      let reward = await contractCMCStaking.methods.earned(accounts[0]).call();
      reward = web3 ? web3.utils.fromWei(reward, "ether") : 0;
      setRewardEarn(reward);
    }
  };

  /***********************Widthdraw reward************************ */
  const handleWithdrawReward = async () => {
    if (contractCMCStaking) {
      await contractCMCStaking.methods.getReward().send({ from: accounts[0] });
      getStakedBalance();
      refreshBalance("refresh after get reward");
    }
  };

  return (
    <>
      <div className="staking-main">
        <div className="staking-admin-instruction">
          <span className="admin-instruction">
            Please proceed with amount of token you want to set for staking
          </span>
        </div>
        <div className="staking-info">
          <div>
            <span className="admin-instruction">
              Staked amount : {stakedAmount}
            </span>
          </div>
          <div>
            <span className="admin-instruction">
              | Rewards earned : {rewardEarn}
            </span>
          </div>
        </div>
        <div className="staking-main-input">
          <div className="staking-input">
            <input
              className="staking-inputTxt"
              name="stake"
              type="text"
              id="stake"
              value={tokenAmountToStake}
              onChange={(e) => handleStakeAmountChange(e)}
            ></input>
            <button
              type="button"
              className="staking-button"
              onClick={handleStake}
              // disabled={duration <= 0 || hasDuration}
            >
              <span>Stake</span>
            </button>
          </div>
          <div className="widthdraw-input">
            <input
              className="widthdraw-inputTxt"
              name="widthdraw"
              type="text"
              id="widthdraw"
              value={tokenAmountToWidthdraw}
              onChange={(e) => handleWidthdrawAmountChange(e)}
            ></input>
            <button
              type="button"
              className="withdraw-button"
              onClick={handleWithdraw}
              disabled={isNaN(tokenAmountToWidthdraw)}
            >
              <span>Withdraw</span>
            </button>
            <button
              type="button"
              className="withdrawReward-button"
              onClick={handleWithdrawReward}
              // disabled={duration <= 0 || hasDuration}
            >
              <span>Withdraw Reward</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Staking;
