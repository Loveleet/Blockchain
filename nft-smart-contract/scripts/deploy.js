const {ethers} = require("hardhat")

async function main() {
  const Club = await ethers.getContractFactory("Club")
  const club = await Club.deploy("Club", "CLB")

  try{
    await club.deployed()
    console.log(`Contract succefully to ${club.address}`)
    
     }catch(err){
       console.log(`Error: ${err.message}`)

     }
     
       try{

        const newItemId = await club.mint("https://ipfs.io/ipfs/QmQjcuNdkuit29unrKjbAyxaXZ1ZjDxrg2n66gb6MReYq8")
        console.log(`NFT minted successfully: ${newItemId}`)

       }catch(err) {
         console.log(`Error: ${err.message}`)
       }
     }


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
