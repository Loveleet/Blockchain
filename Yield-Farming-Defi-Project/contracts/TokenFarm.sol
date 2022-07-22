// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    // All code goes here.....

    string public name = "Dapp Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken;

    address[] public stakers;
    address public owner;

    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;
    mapping(address => uint256) public issued;

    event staking(
        address indexed from,
        uint256 balanceBeforeStaking,
        uint256 indexed amountToStake,
        uint256 balanceAfterStaking,
        uint256 indexed totalStakingBalance
    );

    // event issuedevent(address indexed from, uint indexed balance, uint indexed daibalance);

    constructor(DappToken _dappToken, DaiToken _daiToken) {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    // 1. Stake Tokens (Deposit)
    function stakeTokens(uint256 _amount) public {
        require(_amount > 0, "amount cannot be 0");
        // Transfer Mock Dai Token from investor's wallet to this contract for staking
        daiToken.transferFrom(msg.sender, address(this), _amount);
        stakingBalance[msg.sender] += _amount;

        //Add user to stakers array *only* if they haven't staked already
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }
        //Update staking status
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;

        emit staking(
            msg.sender,
            daiToken.balanceOf(msg.sender) + _amount,
            _amount,
            daiToken.balanceOf(msg.sender),
            stakingBalance[msg.sender]
        );
    }

    // 2. Unstaking Tokens (Withdraw)
    function unstakeTokens() public {
        uint256 balance = stakingBalance[msg.sender];

        require(balance > 0, "staking balance cannot be 0");
        daiToken.transfer(msg.sender, balance);
        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender] = false;
    }

    // 3. Issuing Tokens ()
    function issueTokens() public {
        require(msg.sender == owner, "Caller must be the owner");
        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint256 balance = stakingBalance[recipient];
            // dappToken.transfer(recipient, balance);
            if (balance > 0) {
                issued[msg.sender] += balance;
                // emit issuedevent(msg.sender, balance, stakingBalance[msg.sender]);
                dappToken.transfer(recipient, balance);
            }
        }
    }
}
