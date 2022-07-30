// erc20.test.js
const {
  BN,
  ether,
  expectEvent,
  expectRevert,
} = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const CMC = artifacts.require("CMC");
const CMCStaking = artifacts.require("CMCStaking");
contract("CMCStaking", function (accounts) {
  let decimals = web3.utils.toBN(18);
  let amount = web3.utils.toBN(0);
  // calculate ERC20 token amount
  const _initialsupply = amount.mul(web3.utils.toBN(10).pow(decimals));
  const _decimals = new BN(18);
  const owner = accounts[0];
  const staker = accounts[1];

  describe("INIT", () => {
    before(async function () {
      //deploy CMC contract
      this.CMCInstance = await CMC.new(web3.utils.toBN(_initialsupply), {
        from: owner,
      });

      //mint 100 token to staker address
      amount = web3.utils.toBN(100);
      const mintedQty = amount.mul(web3.utils.toBN(10).pow(decimals));
      await this.CMCInstance.mint(mintedQty, { from: staker });
      const currentBalance = await this.CMCInstance.balanceOf(staker);

      //deploy CMCStaking contract with CMC contract address
      this.CMCStakingInstance = await CMCStaking.new(this.CMCInstance.address, {
        from: owner,
      });

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
  });
});
