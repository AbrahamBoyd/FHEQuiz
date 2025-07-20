import { ethers } from "ethers";
import * as dotenv from "dotenv";
import ComparatorAbi from "../artifacts/contracts/PrivateComparator.sol/PrivateComparator.json";

// ⬇️ Импорт всей fhevmjs как объекта
import * as fhevm from "/root/zama/fhevmjs/lib/node.js";

dotenv.config();

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;
const RPC_URL = process.env.RPC_URL!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ComparatorAbi.abi, wallet);

  // ⬇️ Инициализация wasm
  await fhevm.initWasm();

  // ⬇️ Ручное создание encoder без RPC
  const encoder = fhevm.buildEncoder({ nBits: 32 });

  const a = 10;
  const b = 20;

  const encA = encoder.encode(a);
  const encB = encoder.encode(b);

  const proofA = fhevm.generatePublicSignature(encA);
  const proofB = fhevm.generatePublicSignature(encB);

  const tx = await contract.setValues(encA, encB, proofA, proofB);
  await tx.wait();

  console.log(`🔐 Успешно зашифровали и отправили ${a} и ${b}`);
}

main().catch(console.error);
