import Head from 'next/head'
import { useState, useEffect, useLayoutEffect } from 'react'
import styles from '../styles/Home.module.css'
import 'bulma/css/bulma.css'
import Web3 from 'Web3';
import lotteryContract from '../Blockchain/contracts/lottery';

export default function Home() {

  const [web3, setWeb3] = useState();
  const [address, setAddress] = useState([]);
  const [lcContract, setLcContract] = useState();
  const [lotteryPot, setLotteryPot] = useState();
  const [lotteryPlayers, setLotteryPlayers] = useState([])
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState()
  const [winners, setWinners] = useState([])
  const [winnerLotteryId, setWinnerLotteryId] = useState([])

  


  useEffect(() => {
    
    
   updatestate ()
   
   
   
  
   

  },[lcContract])



 

 const updatestate = () => {
  //  if (address == 0)connectWalletHandler ()
  if (lcContract) getPot() 
  if (lcContract) getPlayers()
  if (lcContract) getlotteryid() 
 }

const getPot = async () => {

 
 
    const pot = await lcContract.methods.getBalance().call()
    setLotteryPot(web3.utils.fromWei(pot,'ether'))  
  }


  const getwinnerHistory = async (id) => {

    
    for ( let i = parseInt(id); i > 0; i--) {
 
    const winneraddress = await lcContract.methods.lotteryHistory(i).call()
    const winnerdata = {}
     winnerdata.id = i
     winnerdata.address = winneraddress

     
     if(winners.length < winnerdata.id){
       setWinners(winners => [...winners, winnerdata])
           
     }
      
     
     
    
  }
}

  const getlotteryid = async () => {
    try{
    const idnew = await lcContract.methods.lotteryId().call()
    setWinnerLotteryId(idnew)
    await getwinnerHistory(idnew)
   
  }catch(err){
   
  }
  }



  const getPlayers = async () => {
    // console.log('getplayers')
    try{
    const players = await lcContract.methods.getPlayers().call()
    setLotteryPlayers(players)
    }catch(err){
     
    }
  }

  const enterLotteryHandler = async () => {
    setError('')

    try{
    await lcContract.methods.enter().send({
      from: address,
      value: '15000000000000000',
      gas: 300000,
      gasPrice: null 
    })
    updatestate ()
  }catch(err) {
    setError(err.message)
  }
    
  }

  const pickWinnerHandler = async () => {
    setError('')

    try{
      await lcContract.methods.pickWinner().send({
        from: address,
        gas: 300000,
        gasprice: null
      })
     
    }catch(err) {
      setError(err.message)
    }

    }

    const payWinnerHandler = async() => {
      setError('')
      setSuccessMsg('')
      try{
        await lcContract.methods.payWinner().send({
          from: address,
        gas: 300000,
        gasprice: null
      })
      await getlotteryid ()
      
      const winnerAddress = await lcContract.methods.lotteryHistory(winnerLotteryId-1).call()
      setSuccessMsg(`The winner is ${winnerAddress}`)
     
      updatestate ()


      }catch(err) {
        setError(err.message)
      }
    }

  

  const connectWalletHandler = async () => {
    setError('')
    /* Check if meta mask is installed*/
    

    if ( typeof window !== "undefined" && typeof window.ethereum !== "undefined"){
      /* Try to connect the metamask if its available */
  
      
      try{ 
        await window.ethereum.request({ method: "eth_requestAccounts" })

        
        // Make new web3 instance and set to state
        const web3 = new Web3(window.ethereum);
        setWeb3(web3);
        
        // get list of accounts. 
        const accounts = await web3.eth.getAccounts()
        // Set account 1 to React state
        setAddress(accounts[0]);

        // create local contract copy
        const lc = lotteryContract(web3)
        setLcContract(lc)

        window.ethereum.on('accountsChanged', async() => {
          
           const accounts = await web3.eth.getAccounts()
           console.warn("Account has been changed to", accounts[0])
           
           setAddress(accounts[0])
          }
          
         ) 
        
      }catch(err){
        setError(err.message)
      }

    }else {
      console.warn ("Please install Metamask")
    }



  }


  return (
    <div>
      <Head>
        <title>Ether Lottery</title>
        <meta name="description" content="Ethereum Lotttery DApp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <nav className='navbar mt -4 mb -4'>
          <div className='container'>
            <div className="navbar-brand">
              <h1> Ether Lottery</h1>
            </div>
            <div className='navbar-end mt-4 ' >
              <button onClick={connectWalletHandler} className='button is-link'>
                Connect Wallet
              </button>
            </div>
          </div>
        </nav>
        <div className='container'>
          <section className='mt-5'>
            <div className='columns'>
            <div className="column is-two-thirds">
              <section className='mt-5'>
              <p>Enter the lottery by sending 0.01 Ether</p>
              <button onClick={enterLotteryHandler} className='button is-link is-light mt-3 is-large'> Play now</button>
              </section>
              <section className='mt-6'>
              <p><b>Admin Only: </b> Pick Winner</p>
              <button onClick={pickWinnerHandler} className='button is-primary is-light mt-3 is-large'> Pick Winner</button>
              </section>
              <section className='mt-6'>
              <p><b>Admin Only: </b> Pay Winner</p>
              <button onClick={payWinnerHandler} className='button is-success is-l      ight mt-3 is-large'> Pay Winner</button>
              </section>
              
              <section>
                <div className='container has-text-danger mt-6'>
                  <p> {error}</p>
                </div>
               </section>
               <section>
                <div className='container has-text-success mt-6'>
                  <p>{successMsg}</p> 
                </div>
               </section>
            </div>
            <div className={`${styles.lotteryinfo} column is-one-third`}>
            <section className='mt-5'>
              <div className='card'>
                <div className='card-content'>
                  <div className='content'>
                    <h2> Lottery History</h2>
                    {
                      (winners && winners.length > 0) && winners.map(items => {
                        if (winnerLotteryId !=  items.id) {
                        return <div className='history-entry mt-3' key ={items.id}>
                      <div>Lottery # key= "{items.id}" Winner</div>
                       <div>
                         <a href={`https://etherscan.io/address/${items.address}`} target="_blank">
                           {items.address}
                         
                         </a>
                       </div>
                    
                    </div>
                        }             
                      
                      })
                    }
                    
                  </div>

                </div>
              </div>
            </section>
            <section className='mt-5'>
              <div className='card'>
                <div className='card-content'>
                  <div className='content'>
                    <h2> Players {lotteryPlayers.length}</h2>
                     <ul className="ml-0">                        {
                          (lotteryPlayers && lotteryPlayers.length > 0) && lotteryPlayers.map((player, index) => {
                         return  <li key={`${player}-${index}`} >
                          <a href={`https://etherscan.io/address/${player}`} target="_blank">
                         {player}
                         </a>
                         </li>
                          })
                         }
                       </ul>
                    
                  </div>

                </div>
              </div>
            </section>
            <section className='mt-5'>
              <div className='card'>
                <div className='card-content'>
                  <div className='content'>
                    <h2> Pot</h2>
                    <p> {lotteryPot}  Ether</p>
                  </div>

                </div>
              </div>
            </section>
            </div>
            </div> 
          </section>
        </div>
       
      </main>

      <footer className={styles.footer}>
       <p>&copy; 2022 Club Infotech</p>
      </footer>
    </div>
  )
}

