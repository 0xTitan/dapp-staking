// ERC20Token.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";

/** Staking contract with reward for CMC token */
contract CMCStaking is Ownable {
    IERC20 public immutable stakingToken;
    IERC20 public immutable rewardsToken;

    // Duration of rewards to be paid out (in seconds)
    uint256 public duration;
    // Timestamp of when the rewards finish
    uint256 public finishAt;
    // Minimum of last updated time and reward finish time
    uint256 public updatedAt;
    // Reward to be paid out per second
    uint256 public rewardRate;
    // Sum of (reward rate * dt * 1e18 / total supply)
    uint256 public rewardPerTokenStored;
    // User address => rewardPerTokenStored
    mapping(address => uint256) public userRewardPerTokenPaid;
    // User address => rewards to be claimed
    mapping(address => uint256) public rewards;

    // Total staked
    uint256 public totalSupply;
    // User address => staked amount
    mapping(address => uint256) public balanceOf;

    constructor(address _stakingToken) {
        stakingToken = IERC20(_stakingToken);
        rewardsToken = IERC20(_rewardToken);
    }

    /**@notice update reward 
    @dev set rewardPerTokenStored
    @dev set updatedAt
    @dev call earned() and set result to rewards mapping state variable

    */
    modifier updateReward(address _account) {
        rewardPerTokenStored = rewardPerToken();
        updatedAt = lastTimeRewardApplicable();

        if (_account != address(0)) {
            rewards[_account] = earned(_account);
            userRewardPerTokenPaid[_account] = rewardPerTokenStored;
        }

        _;
    }

    /**@notice get min date between finish date and current block timestamp
     * @return uint256 rewards
     */
    function lastTimeRewardApplicable() public view returns (uint256) {
        return _min(finishAt, block.timestamp);
    }

    /** @notice calculate reward per token base on staking duration, already rewarded amount and totalSUpply
    @return reward number of reward
     */
    function rewardPerToken() public view returns (uint256) {
        if (totalSupply == 0) {
            return rewardPerTokenStored;
        }

        uint256 result = rewardPerTokenStored +
            (rewardRate * (lastTimeRewardApplicable() - updatedAt) * 1e18) /
            totalSupply;
        //Eg with current supply set to 1000 after one second : 0 + (3*(1-0)) /1000
        return result;
    }

    /**@notice stake token
     * @param _amount address
     * @dev calculate rewards
     */
    function stake(uint256 _amount) external updateReward(msg.sender) {
        require(_amount > 0, "amount = 0");
        stakingToken.transferFrom(msg.sender, address(this), _amount);
        balanceOf[msg.sender] += _amount;
        totalSupply += _amount;
    }

    /**@notice withdraw token
     * @param _amount amount to withdraw
     * @dev calculate rewards
     */
    function withdraw(uint256 _amount) external updateReward(msg.sender) {
        require(_amount > 0, "amount = 0");
        balanceOf[msg.sender] -= _amount;
        totalSupply -= _amount;
        stakingToken.transfer(msg.sender, _amount);
    }

    /**@notice calculate current rewards
     * @param _account address
     * @return uint256 rewards
     */
    function earned(address _account) public view returns (uint256) {
        return
            ((balanceOf[_account] *
                (rewardPerToken() - userRewardPerTokenPaid[_account])) / 1e18) +
            rewards[_account];
    }

    /**@notice sent token reward by minting them
     * @dev refresh reward before minting token
     */
    function getReward() external updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            rewardsToken.mintReward(reward);
            rewardsToken.transfer(msg.sender, reward);
        }
    }

    /**@notice define duration of staking program
     * @param _duration time in second
     */
    function setRewardsDuration(uint256 _duration) external onlyOwner {
        require(finishAt < block.timestamp, "reward duration not finished");
        duration = _duration;
    }

    /**@notice define token amount used for reward
     * @param _amount number of token allocated that will be minted
     * @dev  call function setRewardsDuration first
     * @dev calculate rewardRate based on reward duration
     * @dev determine when the duration will last by setting finishAt parameter
     * @dev set updatedAt to block.timestamp value*/
    function defineRewardAmount(uint256 _amount)
        external
        onlyOwner
        updateReward(address(0))
    {
        if (block.timestamp >= finishAt) {
            //call when the first time when finishAt is no yet set
            rewardRate = _amount / duration; //Eg : rewardRate = 3 (1000 /300s)
        } else {
            // call when new amount is added to the actual staking program
            uint256 remainingRewards = (finishAt - block.timestamp) *
                rewardRate;
            rewardRate = (_amount + remainingRewards) / duration; // update reward rate onsidereing new amout + remaining reward
        }

        require(rewardRate > 0, "reward rate = 0");
        require(
            _amount + rewardsToken.totalSupply() <=
                rewardsToken.maxTotalSupply(),
            "reward amount will exceed total supply"
        );

        finishAt = block.timestamp + duration;
        updatedAt = block.timestamp;
    }

    function _min(uint256 x, uint256 y) private pure returns (uint256) {
        return x <= y ? x : y;
    }
}
