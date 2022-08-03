const jsonFactory = require("@uniswap/v2-core/build/UniswapV2Factory.json");
const jsonRouter = require("@uniswap/v2-periphery/build/UniswapV2Router02.json");
const ERC20 = require("@openzeppelin/contracts/build/contracts/IERC20.json");
const contract = require("@truffle/contract");
const CMCLiquidity = artifacts.require("CMCLiquidity");
const UniswapV2Factory = contract(jsonFactory);
const UniswapV2Router = contract(jsonRouter);

const CMC = artifacts.require("CMC");
const FETH = artifacts.require("FETH");
const addressWETHRopsten = "0xc778417E063141139Fce010982780140Aa0cD5Ab";

UniswapV2Factory.setProvider(web3._provider);
UniswapV2Router.setProvider(web3._provider);

module.exports = async function (deployer, network, accounts) {
  console.log("network =>", network);
  console.log(1);

  await deployer.deploy(UniswapV2Factory, accounts[0], { from: accounts[0] });

  console.log(2);

  const UniswapV2FactoryInstance = await UniswapV2Factory.deployed();
  //console.log("UniswapV2FactoryInstance =>", UniswapV2FactoryInstance);
  console.log(
    "UniswapV2FactoryInstance address =>",
    UniswapV2FactoryInstance.address
  );
  console.log(3);

  //deploy router with factory address
  await deployer.deploy(
    UniswapV2Router,
    UniswapV2FactoryInstance.address,
    addressWETHRopsten,
    { from: accounts[0] }
  );

  const UniswapV2RouterInstance = await UniswapV2Router.deployed();
  console.log(
    "UniswapV2RouterInstance address =>",
    UniswapV2RouterInstance.address
  );
  console.log(4);

  await deployer.deploy(
    CMCLiquidity,
    UniswapV2RouterInstance.address,
    UniswapV2FactoryInstance.address
  );
  const CMCLiquidityInstance = await CMCLiquidity.deployed();
  console.log("CMCLiquidityInstance address =>", CMCLiquidityInstance.address);

  const CMCInstance = await CMC.deployed();
  console.log("CMC address =>", CMCInstance.address);

  console.log(5);

  //////////////////////////////

  if (network === "development") {
    console.log(6, "development start");

    await deployer.deploy(FETH);
    const FETHInstance = await FETH.deployed();
    console.log(6, "FETH address =>", FETHInstance.address);
    let decimals = web3.utils.toBN(18);
    let mintedQtyToOwner = web3.utils.toBN(1000);
    await FETHInstance.faucet(
      accounts[0],
      mintedQtyToOwner.mul(web3.utils.toBN(10).pow(decimals))
    );

    console.log(
      6,
      "balance owner FETH =>",
      (await FETHInstance.balanceOf(accounts[0])).toString()
    );

    const createPair = await UniswapV2FactoryInstance.createPair(
      FETHInstance.address,
      CMCInstance.address,
      { from: accounts[0] }
    );
    console.log(6, "createPair.logs =>", createPair.logs);

    const pair0 = await UniswapV2FactoryInstance.allPairs(0);
    console.log(6, "pair0 =>", pair0);

    //approve CMCLiquidity
    // let feth = new web3.eth.Contract(ERC20.abi, FETHInstance.address);
    await FETHInstance.approve(CMCLiquidityInstance.address, 10000);
    console.log(6, "approved CMCLiquidityInstance for FETH");

    await CMCInstance.approve(CMCLiquidityInstance.address, 10000);
    console.log(6, "approved CMCLiquidityInstance for CMC");

    let newPair = new web3.eth.Contract(ERC20.abi, pair0);
    await newPair.methods
      .approve(CMCLiquidityInstance.address, 10000)
      .send({ from: accounts[0] });

    console.log(6, "newPair =>", newPair);

    const lp = await CMCLiquidityInstance.addLiquidity(
      FETHInstance.address,
      CMCInstance.address,
      10000,
      10000
    );

    console.log(6, "lp.logs =>", lp.logs);

    const pairBalance = await newPair.methods.balanceOf(
      CMCLiquidityInstance.address
    );

    console.log(6, "pairBalance : " + pairBalance);

    console.log(6, "development finish");
  } else if (network === "ropsten") {
    console.log(5, "ropsten start");
    // to complement
    console.log(5, "ropsten finish");
  } else if (network === "kovan") {
    console.log(5, "kovan start");
    // to complement
    console.log(5, "kovan finish");
  }

  console.log(7);
};
