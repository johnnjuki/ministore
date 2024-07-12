const hre = require("hardhat");

async function main() {
  await hre.run("compile");

  const miniStore = await hre.ethers.deployContract("MiniStore");
  await miniStore.waitForDeployment();
  console.log(`MiniStore deployed to ${miniStore.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
