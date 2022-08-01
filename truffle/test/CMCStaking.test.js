// erc20.test.js
const {
  BN,
  ether,
  expectEvent,
  expectRevert,
  time,
} = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const CMC = artifacts.require("CMC");
const CMCStaking = artifacts.require("CMCStaking");
contract("CMCStaking", function (accounts) {
  let decimals = web3.utils.toBN(18);
  let amount = web3.utils.toBN(0);
  // calculate ERC20 token amount
  const _initialsupply = amount.mul(web3.utils.toBN(10).pow(decimals));
  const owner = accounts[0];
  const staker = accounts[1];

  describe("INIT", () => {
    before(async function () {
      //deploy CMC contract
      this.CMCInstance = await CMC.new(web3.utils.toBN(_initialsupply), 0, {
        from: owner,
      });

      //mint 100 token to staker address
      amount = web3.utils.toBN(100);
      const mintedQty = amount.mul(web3.utils.toBN(10).pow(decimals));
      await this.CMCInstance.mint(mintedQty, { from: staker });

      //deploy CMCStaking contract with CMC contract address
      this.CMCStakingInstance = await CMCStaking.new(this.CMCInstance.address, {
        from: owner,
      });

      await this.CMCInstance.setStakingContractAddress(
        this.CMCStakingInstance.address,
        { from: owner }
      );

      //allow CMCStaking contract to manage CMC token from staker adress
      await this.CMCInstance.increaseAllowance(
        this.CMCStakingInstance.address,
        mintedQty,
        { from: staker }
      );

      //console.log("CMC address : " + this.CMCInstance.address);
      //console.log("CMCStaking address : " + this.CMCStakingInstance.address);
      //console.log("CMC currentBalance : " + currentBalance);
    });

    it("should stake CMC token", async function () {
      amount = web3.utils.toBN(10);
      const stakeQty = amount.mul(web3.utils.toBN(10).pow(decimals));
      await this.CMCStakingInstance.stake(stakeQty, { from: staker });
      let balanceStaker = await this.CMCStakingInstance.balanceOf(staker);
      expect(balanceStaker).to.be.bignumber.equal(stakeQty);
    });
    it("Owner should set reward duration", async function () {
      const durationInSeconds = web3.utils.toBN(1200); //20 minutes
      await this.CMCStakingInstance.setRewardsDuration(durationInSeconds, {
        from: owner,
      });
      const durationFromContract = await this.CMCStakingInstance.duration();
      expect(durationInSeconds).to.be.bignumber.equal(durationFromContract);
    });
    it("Owner should set CMC token reward amout", async function () {
      const tokenRewardAmount = web3.utils.toBN(1000); //1000 tokens
      const rewardAllocated = tokenRewardAmount.mul(
        web3.utils.toBN(10).pow(decimals)
      );
      await this.CMCStakingInstance.defineRewardAmount(rewardAllocated, {
        from: owner,
      });
      const rewardRate = await this.CMCStakingInstance.rewardRate();
      expect(rewardRate).to.be.bignumber.equal("833333333333333333");
    });
    it("Finish date should be set", async function () {
      const finishDate = await this.CMCStakingInstance.finishAt();
      expect(finishDate).to.not.equal(0);
    });
    it("Update date should be set", async function () {
      const updatedAt = await this.CMCStakingInstance.updatedAt();
      expect(updatedAt).to.not.equal(0);
    });
    it("Staker should have reward", async function () {
      let duration = time.duration.seconds(5);
      await time.increase(duration);
      //get reward after 5 seconds
      const reward = await this.CMCStakingInstance.earned(staker);
      //get all values to do the math a check result are correct
      const rewardPerTokenStored =
        await this.CMCStakingInstance.rewardPerTokenStored();
      const rewardRate = await this.CMCStakingInstance.rewardRate();
      const lastTimeRewardApplicable =
        await this.CMCStakingInstance.lastTimeRewardApplicable();
      const updatedAt = await this.CMCStakingInstance.updatedAt();
      //get elapsed time from contract - should be 5s
      const diff = lastTimeRewardApplicable - updatedAt;
      // convert time to BN with 18 decimals
      const diffBN = web3.utils
        .toBN(diff)
        .mul(web3.utils.toBN(10).pow(decimals));
      //get total supply
      const totalSupply = await this.CMCStakingInstance.totalSupply();
      //calculate rewards
      const result = web3.utils
        .toBN(rewardPerTokenStored + rewardRate.mul(diffBN).div(totalSupply))
        .mul(web3.utils.toBN(10));
      expect(reward).to.be.bignumber.equal(result);
    });
    it("Staker should get (widthdraw) reward", async function () {
      const reward = await this.CMCStakingInstance.earned(staker);
      const balanceBefore = await this.CMCInstance.balanceOf(staker);
      await this.CMCStakingInstance.getReward({ from: staker });
      //get all values to to the math check result are correct
      const currentBalance = await this.CMCInstance.balanceOf(staker);
      const expectedBalance = balanceBefore.add(reward);
      expect(currentBalance).to.be.bignumber.at.least(expectedBalance);
    });
    it("Staker should widthdraw staked token", async function () {
      const balanceBefore = await this.CMCInstance.balanceOf(staker);
      //console.log("balanceBefore : " + balanceBefore);
      amount = web3.utils.toBN(10);
      const withdrawQty = amount.mul(web3.utils.toBN(10).pow(decimals));
      const transac = await this.CMCStakingInstance.withdraw(withdrawQty, {
        from: staker,
      });
      //get all values to to the math check result are correct
      const currentBalance = await this.CMCInstance.balanceOf(staker);
      //console.log(currentBalance.toString());
      const expectedBalance = balanceBefore.add(withdrawQty);
      //console.log(expectedBalance.toString());
      expect(currentBalance).to.be.bignumber.equal(expectedBalance);
    });
    it("Should check totalSupply is back to 0", async function () {
      const totalSupply = await this.CMCStakingInstance.totalSupply();
      //console.log("totalSupply : " + totalSupply);
      expect(totalSupply).to.be.bignumber.equal(web3.utils.toBN(0));
    });

    it("Should check balance of staker is back to 0", async function () {
      const balance = await this.CMCStakingInstance.balanceOf(staker);
      //console.log("balance : " + balance);
      expect(balance).to.be.bignumber.equal(web3.utils.toBN(0));
    });
  });
});
