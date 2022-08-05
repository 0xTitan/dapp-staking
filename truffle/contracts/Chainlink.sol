// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "../node_modules/@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Chainlink {
    AggregatorV3Interface internal priceFeed;

    /*  Network: Kovan
        https://docs.chain.link/docs/ethereum-addresses/#Kovan%20Testnet 

        Aggregator: ETH/USD 

        Address: 0x9326BFA02ADD2366b30bacB125260Af641031331 
        Constructor set on this pair at deployment but can be changed for another pair with setAddr() function.
    */

    constructor() {
        priceFeed = AggregatorV3Interface(
            0x9326BFA02ADD2366b30bacB125260Af641031331
        );
    } /** * Returns the latest price */

    function setAddr(address _pair) public {
        priceFeed = AggregatorV3Interface(_pair);
    }

    function getLatestPrice() public view returns (int256) {
        (
            ,
            /*uint80 roundID*/
            int256 price, /*uint startedAt*/ /*uint timeStamp*/ /*uint80 answeredInRound*/
            ,
            ,

        ) = priceFeed.latestRoundData();

        return price;
    }
}
