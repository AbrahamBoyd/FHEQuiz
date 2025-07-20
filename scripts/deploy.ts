// scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
  const factory = await ethers.getContractFactory("FHEQuiz");
  const contract = await factory.deploy();
  await contract.waitForDeployment();

  console.log("✅ FHEQuiz deployed to:", await contract.getAddress());
}

main().catch((err) => {
  console.error("❌ Deployment failed:", err);
  process.exit(1);
});
