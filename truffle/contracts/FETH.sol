// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FETH is ERC20 {
    constructor() ERC20("FETH", "Fake Eth") {}

    function faucet(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
