import { createInstance } from "../fhevmjs/dist/node.js";

let instance;

export async function initFheInstance() {
  const publicKey = "0x0000000000000000000000000000000000000001";
  instance = await createInstance({
    chainId: 11155111,
    kmsAddress: "0x0000000000000000000000000000000000000043",
    publicKey,
  });
  console.log("🔐 FHE Instance инициализирован");
}

export async function encryptValue(n) {
  if (!instance) throw new Error("FHE instance not initialized");

  const result = instance.encrypt32(n);

  let bytes;
  if (typeof result?.ciphertext === "string") {
    if (result.ciphertext.startsWith("encrypted(")) {
      throw new Error("❌ encrypt32 вернул 'encrypted(...)' — это НЕ байты!");
    }
    bytes = Buffer.from(result.ciphertext.replace(/^0x/, ""), "hex");
  } else if (result?.ciphertext instanceof Uint8Array) {
    bytes = Buffer.from(result.ciphertext);
  } else {
    throw new Error("❌ Неизвестный формат ciphertext: " + typeof result.ciphertext);
  }

  return bytes;
}
