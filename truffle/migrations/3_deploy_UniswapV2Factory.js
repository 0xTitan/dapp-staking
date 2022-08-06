const jsonFactory = require("@uniswap/v2-core/build/UniswapV2Factory.json");
const jsonRouter = require("@uniswap/v2-periphery/build/UniswapV2Router02.json");
const jsonPair = require("@uniswap/v2-core/build/UniswapV2Pair.json");
const ERC20 = require("@openzeppelin/contracts/build/contracts/IERC20.json");
const contract = require("@truffle/contract");
const CMCLiquidity = artifacts.require("CMCLiquidity");
const UniswapV2Factory = contract(jsonFactory);
const UniswapV2Router = contract(jsonRouter);
const UniswapV2Pair = contract(jsonPair);

const CMC = artifacts.require("CMC");
const FETH = artifacts.require("FETH");
const addressWETHRopsten = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
const addressWETHKovan = "0xd0A1E359811322d97991E03f863a0C30C2cF029C";

UniswapV2Factory.setProvider(web3._provider);
UniswapV2Router.setProvider(web3._provider);
UniswapV2Pair.setProvider(web3._provider);

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

  //////////////////////////////

  if (network === "development") {
    const CMCInstance = await CMC.deployed();
    console.log("CMC address =>", CMCInstance.address);

    console.log(5);

    console.log(6, "development start");

    await deployer.deploy(FETH);
    const FETHInstance = await FETH.deployed();
    console.log(6, "FETH address =>", FETHInstance.address);

    const createPair = await UniswapV2FactoryInstance.createPair(
      FETHInstance.address,
      CMCInstance.address,
      { from: accounts[0] }
    );

    const pair = await UniswapV2FactoryInstance.allPairs(0);

    console.log(6, "pair0 =>", pair);

    await deployer.deploy(
      CMCLiquidity,
      UniswapV2RouterInstance.address,
      UniswapV2FactoryInstance.address,
      pair,
      CMCInstance.address
    );

    const CMCLiquidityInstance = await CMCLiquidity.deployed();
    console.log(
      "CMCLiquidityInstance address =>",
      CMCLiquidityInstance.address
    );

    console.log(
      await CMCLiquidityInstance.getPairAdress(
        FETHInstance.address,
        CMCInstance.address
      )
    );

    let decimals = web3.utils.toBN(18);
    let mintedQtyToOwner = web3.utils.toBN(1000);

    /// FETH Faucet accounts 0 and 1 ///

    await FETHInstance.faucet(
      accounts[0],
      mintedQtyToOwner.mul(web3.utils.toBN(10).pow(decimals))
    );

    await FETHInstance.faucet(
      accounts[1],
      mintedQtyToOwner.mul(web3.utils.toBN(10).pow(decimals))
    );

    /// Approve CMCLiquidity accounts 0 and 1 ///

    let approve1 = await FETHInstance.approve(
      CMCLiquidityInstance.address,
      10000
    );

    let approve2 = await CMCInstance.approve(
      CMCLiquidityInstance.address,
      10000
    );

    let approve3 = await FETHInstance.approve(
      CMCLiquidityInstance.address,
      10000,
      { from: accounts[1] }
    );

    let approve4 = await CMCInstance.approve(
      CMCLiquidityInstance.address,
      10000,
      { from: accounts[1] }
    );

    /// add liquidity from accounts 0 and 1 ///

    console.log(
      6,
      "allPairsLength Before addLiquidity",
      (await UniswapV2FactoryInstance.allPairsLength()).toString()
    );

    const lp = await CMCLiquidityInstance.addLiquidity(
      FETHInstance.address,
      CMCInstance.address,
      10000,
      10000
    );

    // console.log(6, "lp.logs0 =>", lp.logs[0].args);
    // console.log(6, "lp.logs1 =>", lp.logs[1].args);
    // console.log(6, "lp.logs2 =>", lp.logs[2].args);
    // console.log(6, "lp.logs3 =>", lp.logs[3].args);
    // console.log(6, "lp.logs4 =>", lp.logs[4].args);

    console.log(
      "CMC balanceOf account 1 before addliq =>",
      (await CMCInstance.balanceOf(accounts[1])).toString()
    );

    console.log(
      "FETH balanceOf account 1 before addliq =>",
      (await FETHInstance.balanceOf(accounts[1])).toString()
    );

    console.log(
      "CMC balanceOf CMC Liquidity before addliq =>",
      (await CMCInstance.balanceOf(CMCLiquidityInstance.address)).toString()
    );

    console.log(
      "FETH balanceOf CMC Liquidity before addliq =>",
      (await FETHInstance.balanceOf(CMCLiquidityInstance.address)).toString()
    );

    const lp2 = await CMCLiquidityInstance.addLiquidity(
      FETHInstance.address,
      CMCInstance.address,
      5000,
      10000,
      { from: accounts[1] }
    );

    console.log(6, "lp2.logs0 =>", lp2.logs[0].args);
    console.log(6, "lp2.logs1 =>", lp2.logs[1].args);
    console.log(6, "lp2.logs2 =>", lp2.logs[2].args);
    console.log(6, "lp2.logs3 =>", lp2.logs[3].args);
    // console.log(6, "lp2.logs4 =>", lp2.logs[4].args);

    // console.log(
    //   6,
    //   "allPairsLength after addLiquidity",
    //   (await UniswapV2FactoryInstance.allPairsLength()).toString()
    // );

    const pair0 = await UniswapV2FactoryInstance.allPairs(0);
    // console.log(6, "pair0 =>", pair0);

    let newPair = new web3.eth.Contract(UniswapV2Pair.abi, pair0);
    // console.log(6, "newPair.methods =>", newPair.methods);

    let LP_BalanceOfAccounts0 = await newPair.methods
      .balanceOf(accounts[0])
      .call();

    let LP_BalanceOfAccounts1 = await newPair.methods
      .balanceOf(accounts[1])
      .call();

    console.log(
      6,
      "LP balanceOfAccounts0 =>",
      LP_BalanceOfAccounts0.toString()
    );

    console.log(
      6,
      "LP balanceOfAccounts1 =>",
      LP_BalanceOfAccounts1.toString()
    );

    console.log(
      "CMC balanceOf account 1 after addliq =>",
      (await CMCInstance.balanceOf(accounts[1])).toString()
    );

    console.log(
      "FETH balanceOf account 1 after addliq =>",
      (await FETHInstance.balanceOf(accounts[1])).toString()
    );

    console.log(
      "CMC balanceOf CMC Liquidity after addliq =>",
      (await CMCInstance.balanceOf(CMCLiquidityInstance.address)).toString()
    );

    console.log(
      "FETH balanceOf CMC Liquidity after addliq =>",
      (await FETHInstance.balanceOf(CMCLiquidityInstance.address)).toString()
    );

    const address0 = "0x0000000000000000000000000000000000000000";
    let LP_BalanceOfAddress0 = await newPair.methods.balanceOf(address0).call();
    console.log(6, "LP balanceOfAddress0 =>", LP_BalanceOfAddress0.toString());

    let getCMCLPReserves = await newPair.methods.getReserves().call();
    // console.log(6, "getCMCLPReserves =>", getCMCLPReserves);

    console.log(6, "development finish");

    //////////////////////////////
  } else if (network === "ropsten") {
    const createPair = await UniswapV2FactoryInstance.createPair(
      addressWETHRopsten,
      CMCInstance.address,
      { from: accounts[0] }
    );

    const pair = await UniswapV2FactoryInstance.allPairs(0);

    console.log(6, "pair0 =>", pair);

    await deployer.deploy(
      CMCLiquidity,
      UniswapV2RouterInstance.address,
      UniswapV2FactoryInstance.address,
      pair,
      CMCInstance.address
    );
    const CMCLiquidityInstance = await CMCLiquidity.deployed();
    console.log(
      "CMCLiquidityInstance address =>",
      CMCLiquidityInstance.address
    );
    console.log(6, "ropsten start");

    let weth = new web3.eth.Contract(ERC20.abi, addressWETHRopsten);
    await weth.methods
      .approve(CMCLiquidityInstance.address, 10000000)
      .send({ from: accounts[0] });
    console.log(6, "approved CMCLiquidityInstance for WETH");

    let approve = await CMCInstance.approve(
      CMCLiquidityInstance.address,
      10000000
    );
    console.log(
      6,
      "approved CMCLiquidityInstance for CMC =>",
      approve.logs[0].args
    );

    const lp = await CMCLiquidityInstance.addLiquidity(
      addressWETHRopsten,
      CMCInstance.address,
      10000000,
      10000000
    );

    console.log(6, "lp.logs0 =>", lp.logs[0].args);
    console.log(6, "lp.logs1 =>", lp.logs[1].args);
    console.log(6, "lp.logs2 =>", lp.logs[2].args);

    console.log(6, "ropsten finish");

    ////////////////////////////
  } else if (network === "kovan") {
    console.log(6, "kovan start");

    let weth = new web3.eth.Contract(ERC20.abi, addressWETHKovan);

    const createPair = await UniswapV2FactoryInstance.createPair(
      addressWETHKovan,
      CMCInstance.address,
      { from: accounts[0] }
    );

    const pair = await UniswapV2FactoryInstance.allPairs(0);

    console.log(6, "pair0 =>", pair);

    await deployer.deploy(
      CMCLiquidity,
      UniswapV2RouterInstance.address,
      UniswapV2FactoryInstance.address,
      pair,
      CMCInstance.address
    );

    await weth.methods
      .approve(CMCLiquidityInstance.address, 10000000)
      .send({ from: accounts[0] });
    console.log(6, "approved CMCLiquidityInstance for WETH accounts[0]");

    let approve = await CMCInstance.approve(
      CMCLiquidityInstance.address,
      10000000
    );

    console.log(
      6,
      "approved CMCLiquidityInstance for CMC accounts[0] =>",
      approve.logs[0].args
    );

    const lp = await CMCLiquidityInstance.addLiquidity(
      addressWETHKovan,
      CMCInstance.address,
      10000000,
      10000000
    );

    console.log(6, "lp.logs0 =>", lp.logs[0].args);
    console.log(6, "lp.logs1 =>", lp.logs[1].args);
    console.log(6, "lp.logs2 =>", lp.logs[2].args);

    console.log(
      6,
      "allPairsLength after addLiquidity",
      (await UniswapV2FactoryInstance.allPairsLength()).toString()
    );

    const pair0 = await UniswapV2FactoryInstance.allPairs(0);
    console.log(6, "pair0 =>", pair0);

    let newPair = new web3.eth.Contract(UniswapV2Pair.abi, pair0);
    // console.log(6, "newPair.methods =>", newPair.methods);

    let LP_BalanceOfAccounts0 = await newPair.methods
      .balanceOf(accounts[0])
      .call();

    console.log(
      6,
      "LP balanceOfAccounts0 =>",
      LP_BalanceOfAccounts0.toString()
    );

    const address0 = "0x0000000000000000000000000000000000000000";
    let LP_BalanceOfAddress0 = await newPair.methods.balanceOf(address0).call();
    console.log(6, "LP balanceOfAddress0 =>", LP_BalanceOfAddress0.toString());

    let getCMCLPReserves = await newPair.methods.getReserves().call();
    console.log(6, "getCMCLPReserves =>", getCMCLPReserves);

    console.log(6, "kovan finish");
  }

  console.log(7);
};
