const DappToken = artifacts.require("DappToken");
const DappTokenSale = artifacts.require("DappTokenSale");

module.exports = async function (deployer) {
  await deployer.deploy(DappToken);
  // Transfering the address of DappToken and price to DappTokenSale.sol contract will deploying it.
  await deployer.deploy(DappTokenSale, DappToken.address, 1000000000000000);
};
