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

    event Log(string message, uint256 val);

    function addLiquidity(
        address _tokenA,
        address _tokenB,
        uint256 _amountA,
        uint256 _amountB,
        address _router
    ) external returns (uint256) {
        //transfer both token to smart contract
        IERC20(_tokenA).transferFrom(msg.sender, address(this), _amountA);
        IERC20(_tokenB).transferFrom(msg.sender, address(this), _amountB);

        //approve router address to allow token usage
        IERC20(_tokenA).approve(_router, _amountA);
        IERC20(_tokenB).approve(_router, _amountB);
        (uint256 amountA, uint256 amountB, uint256 liquidity) = IUniswapV2Router02(
            _router
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
        return liquidity;
    }

    function removeLiquidity(
        address _tokenA,
        address _tokenB,
        address _factory,
        address _router
    ) external {
        address pair = IUniswapV2Factory(_factory).getPair(_tokenA, _tokenB);
        uint256 liquidity = IERC20(pair).balanceOf(address(this));

        IERC20(pair).approve(_router, liquidity);

        (uint256 amountA, uint256 amountB) = IUniswapV2Router02(_router)
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
