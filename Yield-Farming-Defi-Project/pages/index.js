import Head from 'next/head'
// import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, {useState, useEffect} from 'react'
import Web3 from 'web3'
import 'bootstrap/dist/css/bootstrap.min.css'
import Nav from './Nav'
import DaiToken from '../build/contracts/DaiToken.json'
import DappToken from '../build/contracts/DappToken.json'
import TokenFarm from '../build/contracts/TokenFarm.json'
import Main from './Main'







export default function Home() {


const [account, setAccount] = useState()
const [daiToken, setDaiToken] = useState({})
const [dappToken, setDappToken] = useState({})
const [tokenFarm, setTokenFarm] = useState({})
const [daiTokenBalance, setDaiTokenBalance] = useState('0')
const [dappTokenBalance, setDappTokenBalance] = useState('0')
const [stakingBalance, setStakingBalance] = useState('0')
const [loading, setLoading] = useState(true)
const [toggle, setToggle] = useState(false)


//---------------------------------------------------------------------------
  useEffect (() => {
      loadWeb3()
      loadBlockchainData()
      if(typeof document !== undefined) {
       let bootstrap =  require('bootstrap/dist/js/bootstrap')
       let toastElList = [].slice.call(document.querySelectorAll('.toast'))
       let toastList = toastElList.map(function (toastEl) {
          return new bootstrap.Toast(toastEl)
        })
        // show each toast explicitly
        toastList.forEach( function(element, index) {
          element.show()
        })    
      }
      },[account, toggle]);
  //-----------------------------------------------------------------------


  const loadWeb3 = ( async () =>{
    if (window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
   }
   else if(window.web3){
    window.web3 = await new Web3(window.web3.currentProvider)
   }
   else {
    window.alert("Non-Ethereum browser detected. youshould consider trying MetaMask!")
    setToggle(!toggle);
   }
  })

//------------------------------------------------------------------------------------

  const loadBlockchainData = (async ()=> {
    const web3 = await window.web3
    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0])   
    if(account){
    const networkId = await web3.eth.net.getId()
    const daiTokenData = await DaiToken.networks[networkId]
    if(daiTokenData){
      const daiToken =  await  new web3.eth.Contract(DaiToken.abi, daiTokenData.address)
        setDaiToken({daiToken})                
      let daiTokenBalance = await daiToken.methods.balanceOf(account).call()       
      setDaiTokenBalance(daiTokenBalance.toString())
    }
      else{
        window.alert('DaiToken contract not deployed to detected network.')
      }
    const tokenFarmData = await TokenFarm.networks[networkId]
    if(tokenFarmData){
      const tokenFarm =  await  new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)
        setTokenFarm({tokenFarm})    
      let stakingBalance = await tokenFarm.methods.stakingBalance(account).call()
      setStakingBalance(stakingBalance.toString())
      let dappTokenBalance = await tokenFarm.methods.issued(account).call()
      setDappTokenBalance(dappTokenBalance.toString())
    }
      else{
        window.alert('TokenFarm contract not deployed to detected network.')
      }
      setLoading(false)      
    }
  })
//------------------------------------------------------------------------------------------------------

  


  


//--------------------------------------------------------------------------------------------------------

const unstakeTokens= (async(e)=>{
  setLoading(true)
  await tokenFarm.tokenFarm.methods.issueTokens().send({from: account})
  await tokenFarm.tokenFarm.methods.unstakeTokens().send({from: account})
     setLoading(false)
     setToggle(!toggle)
   })

//------------------------------------------------------------------------------------------------------

const stakeToken= (async(e)=>{
setLoading(true)
await daiToken.daiToken.methods.approve(tokenFarm.tokenFarm._address, e).send({from: account})
await tokenFarm.tokenFarm.methods.stakeTokens(e).send({from: account})
setLoading(false)
setToggle(!toggle)
})
//-----------------------------------------------------------------------------------------------------

let content
if(loading){

content = <p id ="loader" className = "text-center">Loading...</p>

}else{
  
  content = <Main   UnstakeTokens = {unstakeTokens} StakeToken = {stakeToken} StakingBalance = {stakingBalance} Account = {account} DaiToken = {daiToken} DappToken = {DappToken} TokenFarm = {TokenFarm} DaiTokenBalance = {daiTokenBalance} DappTokenBalance = {dappTokenBalance} Loading = {true} />  
}
 //--------------------------------------------------------------------------------------------------------------------------
 



   return (
   
    <div>
       <Head>
      <title>DeFi Project</title>
      <meta name="description" content="A demo about NextJS and Bootstrap 5" />
      {/* <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"></link> */}
      </Head>

      {/* <Nav /> */}



<div className="collapse" id="navbarToggleExternalContent">
  <div className="bg-dark p-4">
    <h5 className="text-white h4">DeFi Application by Loveleet</h5>
    <span className="text-muted">Toggleable via the navbar brand.</span>
  </div>
</div>
<nav className="navbar navbar-dark bg-dark">
  <div className="container-fluid">
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <h5 className = "text-white h4 mx-auto"> Address: </h5>
 

    <h1 className = "text-white h6">{account}</h1>
  </div>
 
</nav>

<main>

  
  {content}
  
</main>




</div>
)
}