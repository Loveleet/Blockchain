// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

//importing the openzeppelin library which contains readymade code for ERC tokens, using this will save the time and less the chances of errors.
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract DappToken is ERC20{

 
 
  // making constructor with token name and symbol as arguments.
  address ownerIco;

  constructor() ERC20("KotiToken", "KOTI"){
  // Minting the required tokens as a total supply
    _mint(msg.sender, 1000000 ** 10 * decimals());
    ownerIco = msg.sender;

  }
  //It initiate transfer tokens from owner to ICO contract address
  function initiateIco(address to, address ownerofIco, uint256 amount) public {
    require(ownerIco == ownerofIco, 'only admin can use this function');
    startIco(to, ownerofIco, amount);
  }

  



}
  