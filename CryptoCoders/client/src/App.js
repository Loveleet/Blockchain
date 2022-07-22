import React, { useEffect, useState, Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import "./App.css";
import CryptoCoders from "./contracts/CryptoCoders.json";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Container, Navbar, NavDropdown, MenuItem, Tabs, ButtonToolbar, Button, Table, ButtonGroup, Row, Col, Grid, Panel, FormGroup, FormControl } from 'react-bootstrap';
import "./logo.svg";
import "./logo192.png";


const App = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [coders, setCoders] = useState([]);
  const [mintText, setMintText] = useState("")






  const loadNFTS = async (contract) => {
    const totalSupply = await contract.methods.totalSupply().call();
    let nfts = [];
    for (let i = 0; i < totalSupply; i++) {
      let coder = await contract.methods.coders(i).call();
      nfts.push(coder);
    }
    setCoders(nfts);
  }

  const loadweb3account = async (web3) => {
    const account = await web3.eth.getAccounts();
    if (account) {
      console.log(account);
      setAccount(account[0]);
    }

  }
  const loadweb3contract = async (web3) => {
    const networkId = await web3.eth.net.getId();
    const networkData = await CryptoCoders.networks[networkId];
    if (networkData) {
      const abi = CryptoCoders.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      setContract(contract);
      return contract;

    }
  }

  useEffect(async () => {
    const web3 = await getWeb3();
    await loadweb3account(web3);
    let contract = await loadweb3contract(web3);
    await loadNFTS(contract);


  }, [])


  const mint = async() => {
      await contract.methods.mint(mintText).send({from: account}, (error)=>{
        console.log("worked");
        if(!error){
          setCoders([...coders, mintText]);
          setMintText("");
          
        }
      })

  }

  return (
    <div>

      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src="./logo192.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            <a> NFT Creator</a>
            <span><br></br>Contract Account No. :- {account}</span>
          </Navbar.Brand>

        </Container>

      </Navbar>
      <div className="container-fluid mt-5">
        <div className="row">
          <div className=" col d-flex flex-column align-items-center">
            <img className="mb-4" src="https://avatars.dicebear.com/api/adventurer/new.svg" height="220" width="230" />
            <h1 className="display-5 fw-bold"> Crypto Coders</h1>
            <div className="col-6 text-center">
              <p className="lead text-center">These are the NFT we created to test the functionality. Below is the input area to name your NFT and clicking mint will int a NFT for you.</p>
            </div>
            <br>
            </br>
            <div>
              <input type="text" 
              placeholder="NFT Name" 
              className="form-control mb-2" 
              value={mintText}
              onChange= {(e)=>setMintText(e.target.value)}/>
              <br></br>
              <button className="btn btn-primary" 
              variant="warning"
              onClick={mint}
              >MINT</button>
              <br></br>
            </div>

            <div className="col-8 d-flex justify-content flex-wrap">
              {coders.map((coder, key) =>
                <div key={key} className="d-flex flex-column align-items-center flex-wrap">
                  <img width="150" 
                  src={`https://avatars.dicebear.com/api/adventurer/${coder}.svg`} />

                  <span>{coder}</span>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

    </div>
  )
}

export default App;