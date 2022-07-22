const { assert } = require('chai');

const TokenFarm = artifacts.require("TokenFarm");
const DappToken = artifacts.require ("DappToken");
const DaiToken = artifacts.require ("DaiToken");

require ('chai')
    .use(require('chai-as-promised'))
    .should()


function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('TokenFarm', ([owner, investor]) => {
    let daiToken, dappToken, tokenFarm
   
    before(async () => {

        daiToken = await DaiToken.new()
        dappToken = await DappToken.new()
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)
        
        //Transfer all daiTokens to tokenFarm
        await dappToken.transfer(tokenFarm.address, tokens('100000'), {from: owner})
        await daiToken.transfer(investor, tokens('100'))
        
        
    })
    

    describe('Mock Dai development', async () => {
        it('has a name', async () => {       
            const name = await daiToken.name()
            assert.equal(name, 'DaiCoin')
        })
    })  

    describe('Mock Dapp development', async () => {
        it('has a name', async () => {       
            const name = await dappToken.name()
            assert.equal(name, 'DappToken')
        })
    })

    describe('Mock TokenFarm development', async () => {
        it('has a name', async () => {       
            const name = await tokenFarm.name()
            assert.equal(name, 'Dapp Token Farm')
        })
    })

    it('contract has tokens', async () => {
        let balance = await dappToken.balanceOf(tokenFarm.address)
        assert.equal(balance.toString(), tokens('100000'))
        })




        describe('Farming Token', async () => {
            it('rewards investors for staking mDai tokens', async () => {       
               let result = await daiToken.balanceOf(investor)
               assert.equal(result.toString(), tokens('100'), "Investor Mock DAI wallet balance correct before staking")

               //Stake Mock DAI Tokens
               await daiToken.approve(tokenFarm.address, tokens('100'), {from: investor})
               await tokenFarm.stakeTokens(tokens('100'), {from: investor})

               result = await daiToken.balanceOf(investor)
               assert.equal(result.toString(), tokens('0'), 'Investor Mock DAI wallet balance correct after staking')

               result = await daiToken.balanceOf(tokenFarm.address)
               assert.equal(result.toString(), tokens('100'), 'TokenFarm successfully recieved the tokens')

               result = await tokenFarm.stakingBalance(investor)
               assert.equal(result.toString(), tokens('100', 'Investor staking tokens are correct'))

               result = await tokenFarm.isStaking(investor)
               assert.equal(result.toString(),'true','The investor is staking the amount')

               await tokenFarm.issueTokens({from: investor}).should.be.rejected;
            //    result = await tokenFarm.issued(investor)
            //    assert.equal(result.toString(), tokens('100'), "tokens issued to investor")

                await tokenFarm.unstakeTokens({from: investor })

                result = await daiToken.balanceOf(investor)
                assert.equal(result.toString(), tokens('100'), 'Investor Mock DAI wallet balance correct after staking')

                result = await daiToken.balanceOf(tokenFarm.address)
                assert.equal(result.toString(), tokens('0'), 'TokenFarm balance is correct after unstaking')

                result = await tokenFarm.stakingBalance(investor)
                assert.equal(result.toString(), tokens('0'), 'staking balance of investor is correct after unstaking')

                result = await tokenFarm.isStaking(investor)
                assert.equal(result.toString(), 'false', 'Status of is staking is correct after unstaking')


        })
    })
    
       
    })


  

