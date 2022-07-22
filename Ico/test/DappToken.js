
//Importing the abstract of the code in order to use it
var DappToken = artifacts.require("./DappToken.sol")




// Assigning the contract with call back function which returns the accounts by default
contract('DappToken', function (accounts){

    
//Using .then functionality here.

// Testing fundamental information assigned to contract is correct.
it("To check the name and symbol of contract", function(){
        return DappToken.deployed().then(function(instance){tokenInstance=instance;    
        return tokenInstance.name().then(function(name){assert.equal(name, 'KotiToken',"has the correct name")
        return tokenInstance.symbol().then(function(symbol){assert.equal(symbol,"KOTI",'has the correct symbol')});
    })
    })
    })

//Testing the total supply is correct 
it("To check the total supply of the contract", function(){
   return DappToken.deployed().then(function(instance){ tokenInstance=instance;
   return tokenInstance.totalSupply().then(function(totalSupply){
        assert.equal(totalSupply.toString(), 10000000,'set the total supply to 1,000,000');
   return tokenInstance.balanceOf(accounts[0]).then(function(balance){
        assert.equal(balance.toString(), 10000000,'it allocates the initial supply to the admin account');      
})
})
})
})

//Testing the transfer functionality
it("To check the balance of other account after transfer", function(){
   return DappToken.deployed().then(function(instance){ tokenInstance = instance;
   //Calling the transfer function to check it revert the retruns as true.
   return tokenInstance.transfer.call(accounts[1], 2500);
     }).then(function(success){
     assert.equal(success, true,"it returns the true");
   //Test the transfer function and its event are showing correct value
   return tokenInstance.transfer(accounts[1], 2500,{from: accounts[0]});
     }).then(function(reciept) {
        assert.equal(reciept.logs.length,1, "triggers one event");
        assert.equal(reciept.logs[0].event, "Transfer", 'should be the "Transfer" event');
        assert.equal(reciept.logs[0].args.from,accounts[0], 'logs the account the tokens are transfered from');
        assert.equal(reciept.logs[0].args.to, accounts[1], "logs the account the tokens are transfered to");
        assert.equal(reciept.logs[0].args.value, 2500, "logs the amount of token transfered")
   //Checking the balance after transfer function  
   return tokenInstance.balanceOf(accounts[1]);
     }).then(function(balance){
      assert.equal(balance.toString(), 2500,"adds the amount to the receiving account");
   return tokenInstance.balanceOf(accounts[0]);
     }).then(function(balance){
      assert.equal(balance.toString(), 10000000 - 2500, "Main account balance is correct after the transfer ")
  });
});


//Checking the approve function 
it("To check the approve function is working",function(){
    return DappToken.deployed().then(function(instance){tokenInstance = instance;
    //Calling the approve function to check it returns the true/success
    return tokenInstance.approve.call(accounts[1], 4000);
    }).then(function(success){assert.equal(success, true,"it returns true");
    //Testing the approve function and its event are emiting the correct values
    return tokenInstance.approve(accounts[1], 4500, {from: accounts[0]});
    }).then(function(reciept){
        assert.equal(reciept.logs.length, 1, "triggers one event");
        assert.equal(reciept.logs[0].event, "Approval", 'should be the "Approval" event');
        assert.equal(reciept.logs[0].args.owner,accounts[0], "logs the owner account is correct");
        assert.equal(reciept.logs[0].args.spender, accounts[1], "logs the spender accounts is correct");
        assert.equal(reciept.logs[0].args.value, 4500, "logs the amount approved to transact");
    //Checking the allowed amount and account is correctly listed.
    return tokenInstance.allowance(accounts[0], accounts[1]);
    }).then(function(amount){assert.equal(amount.toString(), 4500, "amount added to approve function is correct");
    //Testing the transfer from function with its emited event are working correctly
    return tokenInstance.transferFrom(accounts[0], accounts[2], 2500, {from: accounts[1]});
    }).then(function(reciept){
        assert.equal(reciept.logs.length, 2, "triggers one event");
        assert.equal(reciept.logs[0].event, "Approval", 'should be the "Approval" event');
        assert.equal(reciept.logs[0].args.owner,accounts[0], "logs the owner account is correct");
        assert.equal(reciept.logs[0].args.spender, accounts[1], "logs the spender accounts is correct");
        assert.equal(reciept.logs[0].args.value.toString(), 2000, "logs the amount approved to transact");
        assert.equal(reciept.logs[1].event, "Transfer", "Should be the 'Transfer' event");
        assert.equal(reciept.logs[1].args.from, accounts[0], "Amount transfered from account is correct in transferFrom function");
        assert.equal(reciept.logs[1].args.to, accounts[2], "Amount transfered to account is correct in transferFrom function");
        assert.equal(reciept.logs[1].args.value, 2500, "Amount tranfered is correct in transferFrom function");
    //Checking the amount has been deducted from allownce mapping after the transferFrom function used 
    return tokenInstance.allowance(accounts[0], accounts[1]).then (function(allowedamt){
        assert.equal(allowedamt.toString(), 2000, "amount left after transaction in approval Mapping");
    //Checkinf the balance has been deducted after the amount transfered from account.
    return tokenInstance.balanceOf(accounts[2]).then(function(balance){
        assert.equal(balance.toString(), 2500, "amount received to othe account is correct");
    //Checking if over amount than allowed is accepted by the transferFrom function.
    return tokenInstance.transferFrom.call(accounts[0], accounts[2], 6598, {from: accounts[1]})
    }).then(assert.fail).catch(function(error){
        assert((error.toString()).indexOf("revert")>= 0, "Check the over amount than allowed is identify ");
    //Testing the approve function and its events
    return tokenInstance.approve(accounts[3], 4000, {from: accounts[2]})
    }).then (function(reciept){
        assert.equal(reciept.logs.length, 1, 'Log has been generated on the name of "Approval"');
        assert.equal(reciept.logs[0].args.owner, accounts[2], "checking owner is correct");
        assert.equal(reciept.logs[0].args.spender, accounts[3],"checking spender is correct");
    //Testing the functionality declining the amount more than the balance.
    return tokenInstance.transferFrom.call(accounts[2],accounts[4], 3800,{from: accounts[3]})
    }).then(assert.fail).catch(function(error){
        assert((error.toString()).indexOf("revert")>=0, "Check if the amount is transferring more than balance")
    })
    
});     
});  
});
});