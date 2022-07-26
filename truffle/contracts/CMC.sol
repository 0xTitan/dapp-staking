// ERC20Token.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CMC is ERC20 {
    constructor(uint256 initialSupply) ERC20("CAMACL", "CMC") {
        _mint(msg.sender, initialSupply);
    }
}
