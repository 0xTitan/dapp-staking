const json = require("@uniswap/v2-core/build/UniswapV2Factory.json");
const contract = require("@truffle/contract");
const UniswapV2Factory = contract(json);

const FETH = artifacts.require("FETH");

UniswapV2Factory.setProvider(web3._provider);

module.exports = async function (deployer, network, accounts) {
  console.log("network =>", network);
  console.log(1);

  await deployer.deploy(UniswapV2Factory, accounts[0], { from: accounts[0] });

  console.log(2);

  const UniswapV2FactoryInstance = await UniswapV2Factory.deployed();
  console.log("UniswapV2FactoryInstance =>", UniswapV2FactoryInstance);

  console.log(3);

  if (network === "development") {
    console.log(33, "development");
    await deployer.deploy(FETH);
    const FETHInstance = await FETH.deployed();
    console.log("FETH address =>", FETHInstance.address);
    await FETHInstance.faucet(accounts[0], 1000);
  }

  console.log(4);
};
