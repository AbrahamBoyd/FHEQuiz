type Config = {
  publicKey: string;
  chainId: number;
  kmsAddress: string;
};

export function createInstance(config: Config) {
  const { publicKey, chainId, kmsAddress } = config;

  if (!kmsAddress || typeof kmsAddress !== "string") {
    throw new Error("KMS contract address is not valid or empty");
  }
  if (!chainId || typeof chainId !== "number") {
    throw new Error("Chain ID is not valid or empty");
  }

  return {
    encrypt32: (value: number) => {
      return {
        ciphertext: `encrypted(${value})`,
        kmsAddress,
        chainId,
        publicKey,
      };
    },
  };
}
