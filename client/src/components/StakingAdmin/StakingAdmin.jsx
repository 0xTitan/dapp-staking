import { useState, useEffect } from "react";
import "./StakingAdmin.css";

function StakingAdmin(props) {
  const {
    contractCMC,
    contractCMCStaking,
    addressCMCStaking,
    accounts,
    web3,
    adminInstruction,
  } = props;
  const [duration, setDuration] = useState("Enter reward duration in (s)");
  const [hasDuration, setHasDuration] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(
    "Enter CMC Token amount for reward"
  );
  const [hasTokenAmount, setHasTokenAmount] = useState(false);
  const [hasRewardAddressDefined, setRewardAddressDefine] = useState(false);
  const [finishAt, setFinishAt] = useState(0);
  const [blockTimestamp, setBlockTimestamp] = useState(0);

  useEffect(() => {
    isDurationAlreadySet();
    isTokenAmountAlreadySet();
  });

  const isDurationAlreadySet = async () => {
    const value = await contractCMCStaking.methods.duration().call();
    if (value && value > 0) {
      setDuration(value);
      setHasDuration(true);
    }
  };

  const isTokenAmountAlreadySet = async () => {
    const block = await web3.eth.getBlock("latest");
    setBlockTimestamp(block.timestamp);
    const value = await contractCMCStaking.methods.finishAt().call();
    if (value && value > 0) {
      setFinishAt(value);
      //setHasTokenAmount(true);
    }
  };

  const isRewardAddressDefined = async () => {
    const value = await contractCMC.methods.stakingContract().call();
    if (value) {
      setRewardAddressDefine(true);
    }
  };

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
    let decimals = web3.utils.toBN(18);
    const amount = web3.utils.toBN(tokenAmount);
    const rewards = amount.mul(web3.utils.toBN(10).pow(decimals));
    const transact = await contractCMCStaking.methods
      .defineRewardAmount(rewards)
      .send({ from: accounts[0] });
    isTokenAmountAlreadySet();
    // showEvent(
    //   "Voter added  :" +
    //     transact.events.VoterRegistered.returnValues.voterAddress
    // );
  };

  const handleSetContractAddressForRewardMinting = async () => {
    const transact = await contractCMC.methods
      .setStakingContractAddress(addressCMCStaking)
      .send({ from: accounts[0] });
    setRewardAddressDefine(true);
    // showEvent(
    //   "Voter added  :" +
    //     transact.events.VoterRegistered.returnValues.voterAddress
    // );
  };

  return (
    <>
      <div className="stakingAdmin-main">
        <span className="admin-instruction">{adminInstruction}</span>
        <div className="stakingAdmin-info">
          <div>
            <span className="admin-instruction">
              Current block time is : {blockTimestamp}
            </span>
          </div>
          <div>
            <span className="admin-instruction">
              | Program finish at : {finishAt}
            </span>
          </div>
        </div>
        <div className="stakingAdmin-duration">
          <div className="duration-input">
            <input
              className="duration-inputTxt"
              name="duration"
              type="text"
              id="duration"
              value={duration}
              onChange={(e) => handleDurationChange(e)}
              disabled={hasDuration}
            ></input>
            <button
              type="button"
              className="duration-button"
              onClick={handleSetDuration}
              disabled={duration <= 0 || hasDuration}
            >
              <span>Set duration</span>
            </button>
          </div>
          <div className="stakingAdmin-tokenAmount">
            <div className="tokenAmount-input">
              <input
                className="tokenAmount-inputTxt"
                name="tokenAmount"
                type="text"
                id="tokenAmount"
                value={tokenAmount}
                onChange={(e) => handleSetTokenAmountChange(e)}
                // disabled={hasTokenAmount}
              ></input>
              <button
                type="button"
                className="tokenAmount-button"
                onClick={handleSetTokenAmount}
                // disabled={tokenAmount <= 0 || hasTokenAmount}
              >
                <span>Set token amount</span>
              </button>
            </div>
            <div className="stakingAdmin-mintAdress">
              <button
                type="button"
                className="setAdressForReward-button"
                onClick={handleSetContractAddressForRewardMinting}
                disabled={hasRewardAddressDefined}
              >
                <span>Allow this contract for reward minting</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StakingAdmin;
