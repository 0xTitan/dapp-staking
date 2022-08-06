// ERC20Token.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./CMCStaking.sol";

/** Staking contract with reward for CMC token */
contract CMCLiquidity is CMCStaking {
    address private constant WETH = 0xc778417E063141139Fce010982780140Aa0cD5Ab;
    address public router;
    address public factory;

    event Log(string message, uint256 val);
    event LogPairAddress(string message, address pairAddress);
    event LogSendBackLPToMsgSenderSuccess(string message, bool result);
    event LogSendBackTokenToMsgSenderSuccess(
        string message,
        bool isTokenInCMC_LiqContract,
        uint256 amount,
        bool success
    );

    constructor(
        address _router,
        address _factory,
        address _stakingToken,
        address _rewardToken
    ) CMCStaking(_stakingToken, _rewardToken) {
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

        //get the address of the pair in order to send back to caller his LP token
        address pair = IUniswapV2Factory(factory).getPair(_tokenA, _tokenB);
        bool result = IUniswapV2Pair(pair).transfer(msg.sender, liquidity);

        //update balance
        balanceOf[msg.sender] += liquidity;

        //get tokens sent in excess to this contract and send back to caller his tokens
        uint256 contractBalanceTokenA = IERC20(_tokenA).balanceOf(
            address(this)
        );
        emit Log("Balance Token A", contractBalanceTokenA);

        if (contractBalanceTokenA > 0) {
            bool success = IERC20(_tokenA).transfer(
                msg.sender,
                contractBalanceTokenA
            );
            emit LogSendBackTokenToMsgSenderSuccess(
                "isTokenInExcess",
                true,
                contractBalanceTokenA,
                success
            );
        } else {
            emit LogSendBackTokenToMsgSenderSuccess(
                "isTokenInExcess",
                false,
                contractBalanceTokenA,
                false
            );
        }

        uint256 contractBalanceTokenB = IERC20(_tokenB).balanceOf(
            address(this)
        );
        emit Log("Balance Token B", contractBalanceTokenB);

        if (contractBalanceTokenB > 0) {
            bool success = IERC20(_tokenB).transfer(
                msg.sender,
                contractBalanceTokenB
            );
            emit LogSendBackTokenToMsgSenderSuccess(
                "isTokenInExcess",
                true,
                contractBalanceTokenB,
                success
            );
        } else {
            emit LogSendBackTokenToMsgSenderSuccess(
                "isTokenInExcess",
                false,
                contractBalanceTokenB,
                false
            );
        }

        emit Log("amountA", amountA);
        emit Log("amountB", amountB);
        emit Log("liquidity", liquidity);
        emit LogPairAddress("pair", pair);
        emit LogSendBackLPToMsgSenderSuccess("isLpBackToMsgSender", result);
    }

    function removeLiquidity(address _tokenA, address _tokenB) external {
        address pair = IUniswapV2Factory(factory).getPair(_tokenA, _tokenB);
        uint256 liquidity = IERC20(pair).balanceOf(msg.sender);
        require(liquidity > 0, "You do not have any LP token");
        //transfer LP back to contract
        IERC20(pair).transferFrom(msg.sender, address(this), liquidity);
        //approve touter from this contract
        IERC20(pair).approve(router, liquidity);
        //get back token
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

        balanceOf[msg.sender] -= liquidity;
        IERC20(_tokenA).transfer(msg.sender, amountA);
        IERC20(_tokenB).transfer(msg.sender, amountB);
        emit Log("amountA", amountA);
        emit Log("amountB", amountB);
    }

    function getPairAdress(address _tokenA, address _tokenB)
        public
        view
        returns (address)
    {
        address pair = IUniswapV2Factory(factory).getPair(_tokenA, _tokenB);
        return pair;
    }
}
