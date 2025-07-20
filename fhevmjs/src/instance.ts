// src/instance.ts
import { FhevmInstanceConfig } from "./types";

export function createInstance(config: FhevmInstanceConfig) {
  const { publicKey, chainId, kmsAddress } = config;

  if (!kmsAddress || typeof kmsAddress !== "string") {
    throw new Error("KMS contract address is not valid or empty");
  }

  if (!chainId || typeof chainId !== "number") {
    throw new Error("Chain ID is not valid or empty");
  }

  return {
    encrypt32(value: number) {
      const buf = Buffer.alloc(32);
      buf.writeUInt32BE(value, 28);
      return {
        ciphertext: new Uint8Array(buf),
        kmsAddress,
        chainId,
        publicKey,
      };
    },

    decrypt32(ciphertext: string | Uint8Array) {
      let buf: Buffer;

      if (typeof ciphertext === "string") {
        buf = Buffer.from(ciphertext.replace(/^0x/, ""), "hex");
      } else {
        buf = Buffer.from(ciphertext);
      }

      // читаем 4 байта в конце
      const value = buf.readUInt32BE(28);
      return value;
    },
  };
}
