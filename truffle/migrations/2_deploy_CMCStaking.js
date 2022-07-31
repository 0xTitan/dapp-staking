const CMC = artifacts.require("CMC");
const CMCStaking = artifacts.require("CMCStaking");

module.exports = async function (deployer) {
  const CMCInstance = await CMC.deployed();
  await deployer.deploy(CMCStaking, CMCInstance.address);
  const CMCStakingInstance = await CMCStaking.deployed();
};
