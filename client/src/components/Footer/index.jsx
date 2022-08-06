import { useState, useEffect } from "react";
import useEth from "../../contexts/EthContext/useEth";
import Footer from "./Footer";
const artifactPair = require("../../contracts/IUniswapV2Pair.json");

function MainFooter() {
  const {
    state,
    state: {
      contractChainlink,
      contractFactory,
      addressCMC,
      accounts,
      networkID,
      web3,
    },
  } = useEth();

  const [ethPrice, setEthPrice] = useState(0);
  console.log(0, "ethPrice =>", ethPrice);
  const [cmcPrice, setCmcPrice] = useState("no liquidity provided yet");
  console.log(0, "cmcPrice =>", cmcPrice);

  useEffect(() => {
    async function getPrices() {
      let chainlinkEthPriceRaw = await contractChainlink.methods
        .getLatestPrice()
        .call();

      let chainlinkEthPrice = Number(chainlinkEthPriceRaw.slice(0, 6)) / 100;

      if (networkID === 42) {
        const wethAddressKovan = "0xd0A1E359811322d97991E03f863a0C30C2cF029C";

        let getPair = await contractFactory.methods
          .getPair(addressCMC, wethAddressKovan)
          .call();
        console.log("getPair =>", getPair);

        if (getPair !== "0x0000000000000000000000000000000000000000") {
          let contractPair = new web3.eth.Contract(artifactPair.abi, getPair);
          let getReserves = await contractPair.methods.getReserves().call();
          console.log("getReserves =>", getReserves);

          let reserveCMC;
          let reserveWETH;
          let token0 = await contractPair.methods.token0().call();

          token0 === addressCMC
            ? (reserveCMC =
                getReserves.reserve0 && (reserveWETH = getReserves.reserve1))
            : (reserveCMC =
                getReserves.reserve1 && (reserveWETH = getReserves.reserve0));

          console.log("reserveCMC =>", reserveCMC);
          console.log("reserveWETH =>", reserveWETH);

          let pooledCmcPrice = (reserveWETH / reserveCMC) * chainlinkEthPrice;
          setCmcPrice(pooledCmcPrice);
        }
      }

      setEthPrice(chainlinkEthPrice);
    }

    if (state && contractChainlink && contractFactory) {
      getPrices();
    }
  }, [
    state,
    accounts,
    addressCMC,
    contractChainlink,
    contractFactory,
    networkID,
    web3,
  ]);

  let getPricesOnRefresh = async () => {
    console.log("getPricesOnRefresh Function");
    let chainlinkEthPriceRaw = await contractChainlink.methods
      .getLatestPrice()
      .call();
    let chainlinkEthPrice = Number(chainlinkEthPriceRaw.slice(0, 6)) / 100;

    if (networkID === 42) {
      const wethAddressKovan = "0xd0A1E359811322d97991E03f863a0C30C2cF029C";

      let getPair = await contractFactory.methods
        .getPair(addressCMC, wethAddressKovan)
        .call();
      console.log("getPair =>", getPair);

      if (getPair !== "0x0000000000000000000000000000000000000000") {
        let contractPair = new web3.eth.Contract(artifactPair.abi, getPair);
        let getReserves = await contractPair.methods.getReserves().call();
        console.log("getReserves =>", getReserves);

        let reserveCMC;
        let reserveWETH;
        let token0 = await contractPair.methods.token0().call();

        token0 === addressCMC
          ? (reserveCMC =
              getReserves.reserve0 && (reserveWETH = getReserves.reserve1))
          : (reserveCMC =
              getReserves.reserve1 && (reserveWETH = getReserves.reserve0));

        console.log("reserveCMC =>", reserveCMC);
        console.log("reserveWETH =>", reserveWETH);

        let pooledCmcPrice = (reserveWETH / reserveCMC) * chainlinkEthPrice;
        setCmcPrice(pooledCmcPrice);
      }
    }

    setEthPrice(chainlinkEthPrice);
  };

  return (
    <Footer
      ethPrice={ethPrice}
      cmcPrice={cmcPrice}
      getPricesOnRefresh={getPricesOnRefresh}
    />
  );
}

export default MainFooter;
