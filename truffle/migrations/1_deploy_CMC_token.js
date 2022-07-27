const CMC = artifacts.require("CMC");

module.exports = async function (deployer) {
  let decimals = web3.utils.toBN(18);
  let amount = web3.utils.toBN(1000);
  // calculate ERC20 token amount
  const _initialsupply = amount.mul(web3.utils.toBN(10).pow(decimals));
  await deployer.deploy(CMC, _initialsupply);
};
