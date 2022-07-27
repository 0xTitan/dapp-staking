// ERC20Token.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CMC is ERC20 {
    uint256 private maxTotalSupply = 10000000;

    constructor(uint256 initialSupply) ERC20("CAMACLE", "CMC") {
        require(
            initialSupply <= maxTotalSupply,
            "The total supply for CMC token will be exceed"
        );
        _mint(msg.sender, initialSupply);
    }

    //allow users to call the requestTokens function to mint tokens
    function mint(uint256 amount) external {
        require(amount <= 1000, "Max claimable token is 1000");
        require(
            IERC20(address(this)).totalSupply() + amount <= maxTotalSupply,
            "The total supply for CMC token will be exceed"
        );

        //mint tokens
        _mint(msg.sender, amount);
    }
}
