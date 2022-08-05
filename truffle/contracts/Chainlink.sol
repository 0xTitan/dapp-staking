// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "../node_modules/@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Chainlink {
    AggregatorV3Interface internal priceFeed;

    /** * Network: Kovan 

    * Aggregator: BNB/USD 

    * Address: 0x8993ED705cdf5e84D0a3B754b5Ee0e1783fcdF16 */

    constructor() {
        priceFeed = AggregatorV3Interface(
            0x8993ED705cdf5e84D0a3B754b5Ee0e1783fcdF16
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
