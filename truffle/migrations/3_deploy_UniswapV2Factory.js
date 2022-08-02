const json = require("@uniswap/v2-core/build/UniswapV2Factory.json");
const contract = require("@truffle/contract");
const UniswapV2Factory = contract(json);

const CMC = artifacts.require("CMC");
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

  const CMCInstance = await CMC.deployed();
  console.log("CMC address =>", CMCInstance.address);

  console.log(4);

  if (network === "development") {
    console.log(5, "development start");

    await deployer.deploy(FETH);
    const FETHInstance = await FETH.deployed();
    console.log("FETH address =>", FETHInstance.address);
    await FETHInstance.faucet(accounts[0], 1000);

    const createPair = await UniswapV2FactoryInstance.createPair(
      FETHInstance.address,
      CMCInstance.address,
      { from: accounts[0] }
    );
    console.log("createPair =>", createPair);

    const pair0 = await UniswapV2FactoryInstance.allPairs(0);
    console.log("pair0 =>", pair0);

    console.log(5, "development finish");
  } else if (network === "ropsten") {
    console.log(5, "ropsten start");
    // to complement
    console.log(5, "ropsten finish");
  } else if (network === "kovan") {
    console.log(5, "kovan start");
    // to complement
    console.log(5, "kovan finish");
  }

  console.log(6);
};
