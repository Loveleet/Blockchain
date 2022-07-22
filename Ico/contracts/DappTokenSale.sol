// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;


import './DappToken.sol';   //Importing the DappToken.sol to use transfer funciton in contract.
import  '../ds-math/src/math.sol'; //imported the ds-math library for using calculations funcitons

//Inherting the DSMath to use its funcitons
contract DappTokenSale is DSMath {

        
        address  payable  private admin; // Admin to specify the owner of the ICO to transfer and kill the contract in the end.
        DappToken public tokenContract; //Making variable of DappToken Contract.
        uint256 public tokenPrice;  //Set the price of token.
        uint256 public tokensSold ;
        event tokenspurchased( address indexed To, uint256 Amount_of_tokens);


      

        //constructor is getting the DappToken.sol address as an argument with token price.
        constructor (DappToken _tokenContract, uint256  _tokenPrice) {
         
         admin = payable(msg.sender); //The admin will be the one who execute the contract.
         tokenContract = _tokenContract; 
         tokenPrice = _tokenPrice;

        //  tokenContract.transfer(address(this), tokenContract.balanceOf(msg.sender));

        


        }
         //This is to initializing the ICO to start token sale
        function initialIcoForSale(uint256 amount) public returns(bool){
                tokenContract.initiateIco(address(this), msg.sender, amount);
                return true;
        }

        //Creating the function to buy tokens.
        function buyTokens(uint256 _tokensQuantity) public payable {
                
                //Checking the amount sent is correct as per the _tokensQuantity.
                require(msg.value == mul(_tokensQuantity, tokenPrice),"The amount is incorrect");
                //Checking the tokens are in balance
                require(tokenContract.balanceOf(admin) >= _tokensQuantity, "Tokens are not available");
                require(tokenContract.transfer(msg.sender, _tokensQuantity));

                //Increase the quantity of token sold.
                tokensSold += _tokensQuantity;
                emit tokenspurchased(msg.sender, _tokensQuantity);

        }
        // It eleminate the bytecode of the contract after sending all tokens and amount to admin. 
        function endSale()public{
                require(admin == msg.sender, "Account is not admin to perform this function");
                require(tokenContract.transfer(msg.sender, tokenContract.balanceOf(address(this))));
                selfdestruct(admin);
        }
        


}
