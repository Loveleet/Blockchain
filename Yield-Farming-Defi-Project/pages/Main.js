import React, {useState, useEffect} from 'react'
import dai from "../images/dai.png"



export default function Main(props){

    const {IssueDappTokens, UnstakeTokens, StakeToken, StakingBalance, Account, DaiToken, DappToken, TokenFarm, DaiTokenBalance, DappTokenBalance, Loading} = props;

    const[message, setMessage] = useState('');

    
    const handleChange = event => {
        setMessage(event.target.value.toString());        
    }
    

    const handleUnstake = (async()=>{

         await UnstakeTokens()

    })
    


   
return (

<div id='content' className ="mt-3">
    <table className ="table table-borderless text-muted text-center">
        <thead>
            <tr>
                <th scope ="col">StakingBalance </th>
                <th scope = "col">RewardBalance</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    {window.web3.utils.fromWei(StakingBalance, 'Ether')} mDAI 
                </td>
                <td>
                    {window.web3.utils.fromWei(DappTokenBalance, 'Ether')} DAPP 
                </td>
            </tr>
        </tbody>
    </table>

    <div className='card mb-4'>
        <div classnam ='card-body'>
        <form className='mb-3' onSubmit={(event)=>{
            event.preventDefault()
           let amount =  window.web3.utils.toWei(message,'Ether')
            StakeToken(amount)
        }}>
            <div>
                <label className = "float-left"><b>Stake Tokens</b></label>
                <span className="float-right text-muted ">
                    Balance: {window.web3.utils.fromWei(DaiTokenBalance, "Ether")}
                </span>
            </div>
            <div className = "input-group mb-4">
                <input
                type = "text"
                value = {message}
                onChange = {handleChange}
                className = "form-control form-control-lg"
                placeholder = "0"
                required />
                <div className= "input-group-append">
                    <div className = "input-group-text">
                        <img src= {dai} height='32' alt = ''/>
                        &nbsp;&nbsp;&nbsp; mDai
                    </div>
                </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block btn-lg">STAKE !</button>
            </form>
            <button type="submit" onClick = {handleUnstake} className="btn btn-primary btn-block btn-lg">UNSTAKE !</button>
            <br></br><br></br>
            {/* <button type="submit" onClick = {IssueDappTokens} className="btn btn-primary btn-block btn-lg">Issue Dapp Token</button> */}
        



    </div>
    </div>




</div>


);


}