import { useState, useEffect } from "react";

function Staking(props) {
  const { contractCMC, contractCMCStaking, addressCMCStaking, accounts, web3 } =
    props;
  const [tokenAmountToStake, setTokenAmountToStake] = useState(
    "Enter CMC Token amount you want to stake"
  );
  const [tokenAmountToWidthdraw, setTokenAmountToWidthdraw] = useState(
    "Enter CMC Token amount you wnat to widthdraw"
  );
  const [tokenAmountToMint, setTokenAmountToMint] = useState(
    "Enter CMC Token amount you wnat to mint"
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
    }
  };

  const handleWidthdrawAmountChange = (e) => {
    const { value } = e.target;
    //remove non numeric character
    const result = value.replace(/\D/g, "");
    setTokenAmountToWidthdraw(result);
  };

  const handleWidthdraw = async () => {
    let decimals = web3.utils.toBN(18);
    const amount = web3.utils.toBN(tokenAmountToWidthdraw);
    const withdrawQty = amount.mul(web3.utils.toBN(10).pow(decimals));
    const transact = await contractCMCStaking.methods
      .withdraw(withdrawQty)
      .send({ from: accounts[0] });
  };

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
  };

  const getStakedBalance = async () => {
    if (contractCMCStaking) {
      let stakedBalance = await contractCMCStaking.methods
        .balanceOf(accounts[0])
        .call();
      stakedBalance = web3 ? web3.utils.fromWei(stakedBalance, "ether") : 0;
      setStakedAmount(stakedBalance);
    }
  };

  const getReward = async () => {
    if (contractCMCStaking) {
      let reward = await contractCMCStaking.methods.earned(accounts[0]).call();
      reward = web3 ? web3.utils.fromWei(reward, "ether") : 0;
      setRewardEarn(reward);
    }
  };

  return (
    <div className="staking-main">
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
      <hr></hr>
      <span className="admin-instruction">
        Please proceed with amount of token you want to set for staking
      </span>

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
          onClick={handleWidthdraw}
          // disabled={duration <= 0 || hasDuration}
        >
          <span>Withdraw</span>
        </button>
      </div>
      <div>
        <span className="admin-instruction">
          Staked amount : {stakedAmount}
        </span>
      </div>
      <div>
        <span className="admin-instruction">Rewards earned : {rewardEarn}</span>
      </div>
    </div>
  );
}

export default Staking;
