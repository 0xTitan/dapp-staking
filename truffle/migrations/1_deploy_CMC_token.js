const CMC = artifacts.require("CMC");
// const CMCStaking = artifacts.require("CMCStaking");

module.exports = async function (deployer, network, accounts) {
  let decimals = web3.utils.toBN(18);
  let supplyAmount = web3.utils.toBN(0); // start with 0
  let mintedQtyToOwner = web3.utils.toBN(1000); // transfer 1000 token to owner
  let mintedQtyToAccount1 = web3.utils.toBN(500); // transfer 500 token to accounts[1]

  // calculate ERC20 token amount
  const _initialsupply = supplyAmount.mul(web3.utils.toBN(10).pow(decimals));
  await deployer.deploy(CMC, _initialsupply, 0);
  const CMCInstance = await CMC.deployed();
  console.log("CMCInstanceAddress =>", CMCInstance.address);
  await CMCInstance.mint(
    mintedQtyToOwner.mul(web3.utils.toBN(10).pow(decimals))
  );

//   await CMCInstance.mint(
//     mintedQtyToAccount1.mul(web3.utils.toBN(10).pow(decimals)),
//     { from: accounts[1] }
//  );

  console.log(
    "balanceOf account 0 =>",
    (await CMCInstance.balanceOf(accounts[0])).toString()
  );

  console.log(
    "balanceOf account 1 =>",
    (await CMCInstance.balanceOf(accounts[1])).toString()
  );
};
