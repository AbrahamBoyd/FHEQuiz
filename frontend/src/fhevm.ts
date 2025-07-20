import { ethers } from "ethers";
import { createInstance } from "../../fhevmjs/dist/node"; // путь к твоей сборке
import type { PublicKey } from "../../fhevmjs/dist/node";

let instance: Awaited<ReturnType<typeof createInstance>>;

export async function initFheInstance() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();

  instance = await createInstance({
    provider,
    chainId: Number(network.chainId),
    kmsAddress: import.meta.env.VITE_CONTRACT_ADDRESS!,
  });

  await instance.ready;
  console.log("🧠 FHE frontend instance ready");
}

export async function decryptEbool(ciphertext: string): Promise<boolean> {
  if (!instance) throw new Error("FHE instance not initialized");
  return instance.decrypt(ciphertext) === 1;
}
