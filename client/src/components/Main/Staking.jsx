import { useState, useEffect } from "react";

function Staking(props) {
  const { contractCMCStaking, accounts, web3 } = props;
  const [duration, setDuration] = useState("Enter reward duration in (s)");
  const [hasDuration, setHasDuration] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(
    "Enter CMC Token amount for reward"
  );
  const [hasTokenAmount, setHasTokenAmount] = useState(false);

  useEffect(() => {
    const isDurationAlreadySet = async () => {
      const value = await contractCMCStaking.methods.duration().call();
      if (value && value > 0) {
        setDuration(value);
        setHasDuration(true);
      }
    };
    const isTokenAmountAlreadySet = async () => {
      // const block = await web3.eth.getBlock("latest");
      // console.log("Block :" + block.timestamp);
      const value = await contractCMCStaking.methods.finishAt().call();
      if (value && value > 0) {
        setHasTokenAmount(true);
      }
    };
    isDurationAlreadySet();
    isTokenAmountAlreadySet();
  });

  const handleDurationChange = (e) => {
    const { value } = e.target;
    //remove non numeric character
    const result = value.replace(/\D/g, "");
    setDuration(result);
  };

  const handleSetDuration = async () => {
    console.log(duration);
    console.log(contractCMCStaking);
    const transact = await contractCMCStaking.methods
      .setRewardsDuration(duration)
      .send({ from: accounts[0] });
    setHasDuration(true);
    // showEvent(
    //   "Voter added  :" +
    //     transact.events.VoterRegistered.returnValues.voterAddress
    // );
  };

  const handleSetTokenAmountChange = (e) => {
    const { value } = e.target;
    //remove non numeric character
    const result = value.replace(/\D/g, "");
    setTokenAmount(result);
  };

  const handleSetTokenAmount = async () => {
    console.log(tokenAmount);
    console.log(contractCMCStaking);
    let decimals = web3.utils.toBN(18);
    const amount = web3.utils.toBN(tokenAmount);
    const rewards = amount.mul(web3.utils.toBN(10).pow(decimals));
    const transact = await contractCMCStaking.methods
      .defineRewardAmount(rewards)
      .send({ from: accounts[0] });
    setHasTokenAmount(true);
    // showEvent(
    //   "Voter added  :" +
    //     transact.events.VoterRegistered.returnValues.voterAddress
    // );
  };

  return (
    <div className="staking-main">
      <span className="admin-instruction">
        Please proceed with amount of token you want to set for staking
      </span>

      <div className="staking-input">
        <input
          className="staking-inputTxt"
          name="duration"
          type="text"
          id="duration"
          value={duration}
          onChange={(e) => handleDurationChange(e)}
          disabled={hasDuration}
        ></input>
        <button
          type="button"
          className="staking-button"
          onClick={handleSetDuration}
          disabled={duration <= 0 || hasDuration}
        >
          <span>Stake</span>
        </button>
        <button
          type="button"
          className="withdraw-button"
          onClick={handleSetDuration}
          disabled={duration <= 0 || hasDuration}
        >
          <span>Withdraw</span>
        </button>
      </div>
    </div>
  );
}

export default Staking;
