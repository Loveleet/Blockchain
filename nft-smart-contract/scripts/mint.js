const {ethers} = require("hardhat")
const ClubJSON = require("../artifacts/contracts/Club.sol/Club.json")
require("dotenv").config();


async function main() {

    const abi = ClubJSON.abi
    const provider =new ethers.providers.InfuraProvider("rinkeby", process.env.RINKEBY_PROJECT_ID)
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
    const signer = wallet.connect(provider)
    const club = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, signer)
    await club.mint("https://ipfs.io/ipfs/QmSMxoVBNERHMGjEgxo1bsRPNhD1tmiGQP6ZfoJujs9Q8f")
    console.log("NFT minted")




}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
