const CMC = artifacts.require("CMC");
const CMCStaking = artifacts.require("CMCStaking");

module.exports = async function (deployer) {
  let decimals = web3.utils.toBN(18);
  let supplyAmount = web3.utils.toBN(0); // start with 0
  let mintedQtyToOwner = web3.utils.toBN(1000); // transfer 1000 token to owner
  // calculate ERC20 token amount
  const _initialsupply = supplyAmount.mul(web3.utils.toBN(10).pow(decimals));
  await deployer.deploy(CMC, _initialsupply, 0);
  const CMCInstance = await CMC.deployed();
  console.log("CMCInstanceAddress =>", CMCInstance.address);
  await CMCInstance.mint(
    mintedQtyToOwner.mul(web3.utils.toBN(10).pow(decimals))
  );
};
