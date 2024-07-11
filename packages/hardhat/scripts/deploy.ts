const hre = require('hardhat');

async function main() {
  await hre.run("compile");

  const miniStore = await hre.ethers.deployContract('MiniStore',["0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1" as `0x${string}`]);
  await miniStore.waitForDeployment();
  console.log(`MiniStore deployed to ${miniStore.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
