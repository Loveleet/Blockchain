import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Web3 from "web3";
import DappTokenSale from "../../build/contracts/DappTokenSale.json";
import DappToken from "../../build/contracts/DappToken.json";
import Main from "./Main.js";

export default function Home() {
  const [account, setAccount] = useState();
  const [dappTokenSale, setDappTokenSale] = useState({});
  const [dappTokenSaleBalance, setDappTokenSaleBalance] = useState(0);
  const [myTokenBalance, setMyTokenBalance] = useState(0);
  const [balance, setBalance] = useState(0);
  const [dappToken, setDappToken] = useState();
  const [price, setPrice] = useState(0);
  const [totalTokenSent, setTotalTokenSent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toggle, setToggle] = useState(true);

  // _____________________________________________________________

  useEffect(() => {
    setLoading(true);
    LoadWeb3();
    LoadBlockchain();

    if (typeof document != undefined) {
      let bootstrap = require("bootstrap/dist/js/bootstrap");
      let toastElList = [].slice.call(document.querySelectorAll(".toast"));
      let toastList = toastElList.map(function (toastEl) {
        return new bootstrap.Toast(toastEl);
      });
      //show each toast explicitly
      toastList.forEach(function (element, index) {
        element.show();
      });
    }
  }, [account, toggle]);

  // ____________________________________________________________

  // Check the metamask adn establish connection.

  const LoadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable;
    } else if (window.web3) {
      window.web3 = await new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected, you should consider trying MetaMask"
      );
    }
  };

  //_________________________________________________________________________

  // Connect and fetch data from the blockchain

  const LoadBlockchain = async () => {
    setLoading(true);

    const web3 = await window.web3;
    const accounts = await web3.eth.getAccounts();

    setAccount(accounts[0]);

    if (account) {
      const networkId = await web3.eth.net.getId();
      const dappTokenData = await DappToken.networks[networkId];

      if (dappTokenData) {
        setDappToken(
          await new web3.eth.Contract(DappToken.abi, dappTokenData.address)
        );
      } else {
        window.alert(
          "DappToken contract is not deployed to detect the network"
        );
      }
      const dappTokenSaleData = await DappTokenSale.networks[networkId];
      if (dappTokenSaleData) {
        const dappTokenSale = await new web3.eth.Contract(
          DappTokenSale.abi,
          dappTokenSaleData.address
        );
        setDappTokenSale(dappTokenSale);
        const price = await dappTokenSale.methods.tokenPrice().call();
        setPrice(web3.utils.fromWei(price, "ether"));
        setTotalTokenSent(await dappTokenSale.methods.tokensSold().call());
        if (dappTokenSale && dappToken) {
          setDappTokenSaleBalance(
            await dappToken.methods.balanceOf(dappTokenSale._address).call()
          );
          setMyTokenBalance(await dappToken.methods.balanceOf(account).call());
          setBalance(
            web3.utils.fromWei(await web3.eth.getBalance(accounts[0])),
            "ether"
          );

          setLoading(false);
        }
      } else {
        window.alert(
          "DappToken contract is not depolyed to detect the network"
        );
      }
    }

    if (!dappToken) {
      setToggle(!toggle);
    }
  };

  //__________________________________________________________________
  const initiate = async (e) => {
    await dappTokenSale.methods.initialIcoForSale(e).send({ from: account });
    setToggle(!toggle);
  };

  // ____________________________________________

  const stop = async () => {
    console.log(account);
    console.log(dappTokenSale._address);
    await dappTokenSale.methods.endSale().send({ from: account });
    setToggle(!toggle);
  };

  // ______________________________________________

  const buyTokens = async (e, r) => {
    console.log(e);
    console.log(r);
    await dappTokenSale.methods
      .buyTokens(Number(e))
      .send({ from: account, value: web3.utils.toWei(r.toString(), "ether") });
    setToggle(!toggle);
  };

  //________________________________________________________________

  let content;
  if (loading == true) {
    content = (
      <h1 style={{}}>
        <br></br>
        <br></br>
        Loading...
        <br></br>
        <small style = {{fontSize: "15px"}} > Please check wallet connections !</small>
      </h1>
    );
  } else {
    content = (
      <Main
        Price={price}
        TotalTokenSent={totalTokenSent}
        DappTokenSaleBalance={dappTokenSaleBalance}
        Balance={balance}
        MyTokenBalance={myTokenBalance}
        Initiate={initiate}
        Stop={stop}
        BuyTokens={buyTokens}
      />
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>ICO (Created own cryptocurrency)</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        ated by create{" "}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1"
          crossorigin="anonymous"
        />
        {/* {* Google Fonts *} */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW"
        crossorigin="anonymous"
      ></script>
      <div
        className="container"
        style={{
          height: "0px",
          width: "auto",
          marginTop: "auto",
          inlineSize: "-webkit-fill-available",
          marginLeft: "-webkit-fill-available",
        }}
      >
        <nav className="navbar navbar-expand-lg bg-light">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">
              Own Cryptocurrency
            </a>
            <div>
              <h6>Address:</h6>{" "}
              <div>
                <h7>{account}</h7>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <main>{content}</main>

      <footer className={styles.footer}>
        Loveleet Koti<br></br>
        loveleet@live.com
      </footer>
    </div>
  );
}
