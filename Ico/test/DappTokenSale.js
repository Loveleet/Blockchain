//const { web3 } = require("@openzeppelin/test-helpers/src/setup");

const { web3 } = require("@openzeppelin/test-helpers/src/setup");

var DappToken = artifacts.require('./DappToken.sol')
var DappTokenSale = artifacts.require('./DappTokenSale.sol')

function decimal(){
 return 18
}

contract('DappTokenSale', function (accounts){
var tokenSaleInstance;
var tokenInstance;
var tokenPrice
var tokensSoldnew
var dappTokens
var test
//Using asynch await functionality.

it('initializes the contract with the correct values', async function (){
     dappTokens = await DappToken.deployed();
     tokenSaleInstance = await DappTokenSale.deployed();
     // Checking the contract instance is deploying
     Address = await tokenSaleInstance.address;
     assert.notEqual(Address, 0x0, "has contract address");
     // Checking the instance of DappToken has been issued correctly in the variable "tokenContract" in DappTokenSale.sol contract.
     tokenInstance = await tokenSaleInstance.tokenContract();
     assert.notEqual(tokenInstance, 0x0,'has token address');
//     console.log(tokenInstance)
     //Testing the price of the token are mentioned correctly.
     tokenPrice = await tokenSaleInstance.tokenPrice()
     assert.equal(tokenPrice.toString(), 1000000000000000,'price is correct')     
})


//Testing the function initialIcoForSale.
it("Function initialIcoForSale", async () => {
     //check funtion working
     await tokenSaleInstance.initialIcoForSale(10000, {from: accounts[0]})
     assert.equal( await dappTokens.balanceOf(tokenSaleInstance.address), 10000, "Tokens hold by ICO contract is correct")

     //Try with wrong owner address.
     try{
          await tokenSaleInstance.initialIcoForSale.call(1000, {from: accounts[2]});
          assert(false);
     } catch(error){ assert(error.message.indexOf("revert")>=0, "Attention! The ICO is initialising by any account.")     }

     //Try with tokens more than balance.
     try{
          await tokenSaleInstance.initialIcoForSale.call(1000, {from: accounts[2]});
          assert(false);
     } catch(error){
           assert(error.message.indexOf("revert")>=0, "Attention! Tokens are transfered more than balance")}        
})



//Complete testing of buyToken function.
it("Function buyTokens will be checked here", async function (){

     //Checking by buying tokens
     reciept = await tokenSaleInstance.buyTokens(200, {from: accounts[8], value: 200 * tokenPrice})    
     assert.equal(await dappTokens.balanceOf(accounts[8]), 200, "The account haven't received the desired tokens")
     //checking the sold tokens are tracking
     assert.equal(await tokenSaleInstance.tokensSold(), 200, "Count of sold tokens are wrong" )
     //checking the events are emitted correctly
     assert.equal(reciept.logs.length,2, "triggers one event");
     assert.equal(reciept.logs[0].event, "Transfer", 'should be the "Transfer" event');
     assert.equal(reciept.logs[0].args.from,tokenSaleInstance.address, 'logs the account the tokens are transfered from');
     assert.equal(reciept.logs[0].args.to, accounts[8], "logs the account the tokens are transfered to");
     assert.equal(reciept.logs[0].args.value, 200, "logs the amount of token transfered")
     assert.equal(reciept.logs[1].event, "tokenspurchased", 'should be the "Transfer" event');
     assert.equal(reciept.logs[1].args.To, accounts[8], 'logs the account the tokens are transfered to');
     assert.equal(reciept.logs[1].args.Amount_of_tokens, 200, "logs the amount of tokens transfered")


     //Testing buying more tokens then balance in contract.
     try{
     await tokenSaleInstance.buyTokens.call(200000, { from: accounts[1], value: 200000 * tokenPrice})
     assert(false);
     } catch(error){
          assert(error.message.indexOf("revert") >= 0, "Attention! Accounts are able to purchase tokens more than balance" )
     }

     //Testing buy entering wrong price
     try{
          await tokenSaleInstance.buyTokens.call(200, { from: accounts[1], value: 2000 * tokenPrice})
          assert(false);
          } catch(error){
               assert(error.message.indexOf("revert") >= 0, "Attention! Wrong amount to purchase tokens")
          }

})

//Testing self destruction function.
it("Checking self distruction functions", async () => {

     //chceking balance of eth and tokens before destruction
     ethBalanceOfAccountBefore = await web3.eth.getBalance(accounts[0])
     ethBalanceOfContract =  await web3.eth.getBalance(tokenSaleInstance.address)
     tokenBalanceOfAccountBefore = await dappTokens.balanceOf(accounts[0])
     tokenBalanceOfContract = await dappTokens.balanceOf(tokenSaleInstance.address)
     //initialise the selfdestruction function.
     await tokenSaleInstance.endSale();
     //checking the balances after self detriction
     assert(await web3.eth.getBalance(accounts[0] ) >> ethBalanceOfAccountBefore , "The contract haven't got the correct eth balance back after destruction of contract")
     assert(await web3.eth.getBalance(tokenSaleInstance.address) ==  0 , "The ethers not trasferred to the owner account after the destruction")
     assert(await dappTokens.balanceOf(accounts[0]) >> tokenBalanceOfAccountBefore , "The tokens are not transferred to the admin account correctly after the destruction")
     assert.equal(await dappTokens.balanceOf(tokenSaleInstance.address), 0 , "The balance of tokens in contract still remaining after the destruction")
     

})
})






