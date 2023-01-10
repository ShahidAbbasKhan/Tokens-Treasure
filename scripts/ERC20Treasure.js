const hre = require("hardhat");
async function main() {
  
  const ERC20Treasure = await hre.ethers.getContractFactory("ERC20Treasure");
  const erc20Treasure = await ERC20Treasure.deploy([0x2170ed0880ac9a755fd29b2688956bd959f933f8]);

  await erc20Treasure.deployed();

  console.log(
    `ERC20Treasure contract is deployed to ${erc20Treasure.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
