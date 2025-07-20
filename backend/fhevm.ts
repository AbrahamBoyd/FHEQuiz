import { ethers } from "ethers";
import { createInstance } from "../fhevmjs/dist/node";
import * as dotenv from "dotenv";
dotenv.config();

let instance: Awaited<ReturnType<typeof createInstance>>;

export async function initFheInstance() {
  const provider = new ethers.JsonRpcProvider(
    `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`
  );

  const chainId = 11155111;
  const kmsAddress = "0x0000000000000000000000000000000000000043";

  instance = await createInstance({ provider, chainId, kmsAddress });
  await instance.ready;
  console.log("✅ FHE instance ready");
}

export async function encryptValue(value: number): Promise<string> {
  if (!instance) throw new Error("FHE instance not ready");
  await instance.ready;

  const result = instance.encrypt32(value);
  if (!result?.ciphertext) throw new Error("encrypt32 failed");

  return "0x" + Buffer.from(result.ciphertext).toString("hex");
}

export async function encryptString(str: string): Promise<string> {
  if (!instance) throw new Error("FHE instance not ready");
  await instance.ready;

  const hash = ethers.keccak256(ethers.toUtf8Bytes(str));
  const first32Bits = parseInt(hash.slice(2, 10), 16); // первые 4 байта

  console.log(`🔡 "${str}" → hash: ${hash} → uint32: ${first32Bits}`);

  const result = instance.encrypt32(first32Bits);
  if (!result?.ciphertext) throw new Error("encrypt32 failed");

  return "0x" + Buffer.from(result.ciphertext).toString("hex");
}

export async function decryptEbool(ciphertext: string): Promise<boolean> {
  if (!instance) throw new Error("FHE instance not ready");
  await instance.ready;

  const result = instance.decrypt32(ciphertext);
  return result === 1;
}
