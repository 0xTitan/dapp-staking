// ERC20Token.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CMC is ERC20, Ownable {
    uint256 public maxTotalSupply = 20000000 * 10**decimals();
    uint256 public maxSupplyMintable = 10000000 * 10**decimals();
    uint256 public mintedSupply;
    address public stakingContract;

    constructor(uint256 _initialSupply, uint256 _mintedSupply)
        ERC20("CAMACLE", "CMC")
    {
        require(
            _initialSupply <= maxTotalSupply,
            "The total supply for CMC token will be exceed"
        );
        mintedSupply = _mintedSupply;
        _mint(msg.sender, _initialSupply);
    }

    /**@notice allow any address to mint
     * @param amount amout of token to mint
     * @dev
     */
    function mint(uint256 amount) external {
        require(amount <= 1000 * 10**decimals(), "Max claimable token is 1000");
        require(
            mintedSupply + amount <= maxSupplyMintable,
            "The total supply for CMC token will be exceed"
        );

        //mint tokens
        mintedSupply += amount;
        _mint(msg.sender, amount);
    }

    /**@notice set stakingContract address
     * @param contractAddress stakingContract address
     * @dev only for owner
     */
    function setStakingContractAddress(address contractAddress)
        external
        onlyOwner
    {
        stakingContract = contractAddress;
    }

    /**@notice allow stakingContract to mintReward
     * @param amount amout of token to mint
     */
    function mintReward(uint256 amount) external {
        require(msg.sender == stakingContract, "You cannot mint reward");
        //mint tokens
        _mint(msg.sender, amount);
    }
}
