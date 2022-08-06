const Chainlink = artifacts.require("Chainlink");

module.exports = async function (deployer, network, accounts) {
  console.log("network =>", network);
  await deployer.deploy(Chainlink);

  const ChainlinkInstance = await Chainlink.deployed();

  if (network === "kovan") {
    console.log(
      "getETH/USD price =>",
      (await ChainlinkInstance.getLatestPrice()).toString()
    );
  }
};
