// ERC20Token.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/** Staking contract with reward for CMC token */
contract CMCLiquidity is Ownable {
    address private constant WETH = 0xc778417E063141139Fce010982780140Aa0cD5Ab;
    address public router;
    address public factory;

    event Log(string message, uint256 val);

    constructor(address _router, address _factory) {
        router = _router;
        factory = _factory;
    }

    function addLiquidity(
        address _tokenA,
        address _tokenB,
        uint256 _amountA,
        uint256 _amountB
    ) external {
        //transfer both token to smart contract
        IERC20(_tokenA).transferFrom(msg.sender, address(this), _amountA);
        IERC20(_tokenB).transferFrom(msg.sender, address(this), _amountB);

        //approve router address to allow token usage
        IERC20(_tokenA).approve(router, _amountA);
        IERC20(_tokenB).approve(router, _amountB);
        (uint256 amountA, uint256 amountB, uint256 liquidity) = IUniswapV2Router02(
            router
        ).addLiquidity(
                _tokenA,
                _tokenB,
                _amountA,
                _amountB,
                1, //min amount receive for token A
                1, //min amount receive for token B
                address(this),
                block.timestamp
            );

        emit Log("amountA", amountA);
        emit Log("amountB", amountB);
        emit Log("liquitity", liquidity);
    }

    function removeLiquidity(address _tokenA, address _tokenB) external {
        address pair = IUniswapV2Factory(factory).getPair(_tokenA, _tokenB);
        uint256 liquidity = IERC20(pair).balanceOf(address(this));

        IERC20(pair).approve(router, liquidity);

        (uint256 amountA, uint256 amountB) = IUniswapV2Router02(router)
            .removeLiquidity(
                _tokenA,
                _tokenB,
                liquidity,
                1, //min amount receive for token A
                1, //min amount receive for token B
                address(this),
                block.timestamp
            );

        emit Log("amountA", amountA);
        emit Log("amountB", amountB);
    }
}
