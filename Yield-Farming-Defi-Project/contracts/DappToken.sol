// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import  "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract DappToken is ERC20 {
 

constructor ()  ERC20("DappToken", "DAI"){
  
  _mint(msg.sender, 100000 * 10 ** decimals());

} 

}