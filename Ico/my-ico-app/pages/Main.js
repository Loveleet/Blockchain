import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { web3 } from "@openzeppelin/test-helpers/src/setup";

export default function Main(props) {

 const {DappTokenSaleBalance, Price, TotalTokenSent, Balance, MyTokenBalance, Initiate, Stop, BuyTokens} = props;

 //____________________________________________________________________________________


 const [inputTokens, setInputTokens] = useState(0)
 const [etherRequired, setEtherRequired] = useState();
 const [initiateTokenValue, setInitiateTokenValue] = useState(0)

 //______________________________________________________________________________

 const InitiateTokenValueFunction = (()=>{
  if (Number(initiateTokenValue) > 0) {
    Initiate(initiateTokenValue);
    setInitiateTokenValue();
    const initiatingTokenInput = document.getElementById(
      "initiatingTokenInput"
    );
    initiatingTokenInput.value = "";
  } else {
    alert("please enter the quantity first");
  }

  } )

//____________________________________________________________________________________


const etherRequiredCheck=(()=>{
  if (Number(etherRequired) >= Number(Balance)) {
    return (
      <div>
        {" "}
        <p>
          {Number(etherRequired)}{" "}
          <p style={{ color: "red", fontSize: "11px" }}>
            Hey ! but you are running out of Balance.
          </p>{" "}
        </p>
      </div>
    );
  } else {
    return etherRequired ;
  }
})

//___________________________________________________________________________________


 let quantityIsMore;
if (Number(inputTokens) > Number(DappTokenSaleBalance)) {
  quantityIsMore = (
    <small style={{ color: "red", fontSize: "10px" }}>
      Unavailable Quantity
    </small>
  );
} else {
  quantityIsMore = <br></br>;
}


//_________________________________________________________________________________________________

const buyTokenFunction = (async()=> {
    if (
      Number(etherRequired) <= Number(Balance) &&
      Number(inputTokens) <= Number(DappTokenSaleBalance) && 
      Number(inputTokens) != 0
    ) {
      await BuyTokens(inputTokens, etherRequired);
      setEtherRequired();
    } else {
      alert(
        "Please check the entered token amount, may be balance of ethers or balance of token is not available"
      );
      setEtherRequired();
    }
    setInputTokens()
    
    const tokenPurchaseInput = document.getElementById("tokenPurchaseInput")
    tokenPurchaseInput.value = ""
    

})

//__________________________________________________________________________________________________________________

const StopFunction = (()=>{
  if(confirm("Warning !!  Are you sure to kill this contract ?")== true){
    Stop()
  }
})







  return (
    <div
      style={{
        margin: "auto",
        marginTop: "auto",
        backgroundColor: "azure",
        inlineSize: "-webkit-fill-available",
      }}
    >
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <div className="row row-cols-1 row-cols-md-3 mb-3 text-center">
        <div className="col">
          <div
            className="card mb-4 rounded-3 shadow-sm"
            style={{ backgroundColor: "floralwhite", height: "470px" }}
          >
            <div
              className="card-header py-3"
              style={{ backgroundColor: "yellow" }}
            >
              {/* _______________________________________________________________________________________________ */}

              <h5 className="my-0 fw-normal">For Admin</h5>
            </div>
            <div className="card-body">
              <h6
                className="card-title pricing-card-title"
                style={{ width: "-webkit-fill-available" }}
              >
                Initiate the ICO
              </h6>
              <br></br>
              <input
                id="initiatingTokenInput"
                type="number"
                style={{ width: "-webkit-fill-available", margin: "9px" }}
                placeholder="Enter no. of Tokens"
                onChange={(e) => {
                  setInitiateTokenValue(e.target.value);
                }}
              ></input>
              <button
                onClick={InitiateTokenValueFunction}
                type="button"
                className="btn btn-success"
                style={{ width: "150px" }}
              >
                Initiate
              </button>
              <br></br>
              <br></br>
              <hr></hr>
              <br></br>
              <h6>Stop the ICO</h6>
              <br></br>

              <button
                type="button"
                className="btn btn-danger "
                style={{ width: "150px" }}
                onClick={StopFunction}
              >
                STOP
              </button>
            </div>
          </div>
        </div>
        {/* _______________________________________________________________________________________________ */}

        <div className="col">
          <div
            className="card mb-4 rounded-3 shadow-sm"
            style={{ backgroundColor: "floralwhite", height: "470px" }}
          >
            <div
              className="card-header py-3"
              style={{ backgroundColor: "aquamarine" }}
            >
              <h4 className="my-0 fw-normal">Stats</h4>
            </div>
            <div className="card-body">
              <h6>Available ICO Tokens :</h6>
              <p>{DappTokenSaleBalance}</p>
              <hr></hr>
              <br></br>
              <h6>ICO Tokens Sold :</h6>
              <p>{TotalTokenSent}</p>
              <hr></hr>
              <br></br>
              <h6>Price :</h6>
              <p>{Price} Ether</p>
              <hr></hr>
              <br></br>
              <h6>Ethers Balance :</h6>
              {Balance}
            </div>
          </div>
        </div>
        {/* _______________________________________________________________________________________________ */}


        <div className="col">
          <div
            className="card mb-4 rounded-3 shadow-sm border-primary"
            style={{ backgroundColor: "floralwhite", height: "470px" }}
          >
            <div
              className="card-header py-3 "
              style={{ backgroundColor: "yellow" }}
            >
              <h4 className="my-0 fw-normal">For Client</h4>
            </div>
            <div className="card-body">
              <h6> My Token Balance : </h6>
              <small style={{ fontSize: "12px", margin:"auto" }}>{MyTokenBalance}</small>
              <br></br>
              <hr></hr>

              {quantityIsMore}
              <input
                id="tokenPurchaseInput"
                type="number"
                placeholder="Enter Tokens quantity to purchase"
                style={{ width: "-webkit-fill-available", margin: "1px" }}
                onChange={(e) => {
                  setInputTokens(e.target.value);
                  setEtherRequired(e.target.value * Number(Price));
                }}
              ></input>
              <br></br>
              <br></br>
              <hr></hr>
              <h6>Ethers required to purchase: </h6>
              {etherRequiredCheck()}
              <br></br>
              <br></br>

              <button
                onClick={buyTokenFunction}
                type="button"
                className="btn btn-warning"
                style={{ width: "-webkit-fill-available" }}
              >
                Purchase it !
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
