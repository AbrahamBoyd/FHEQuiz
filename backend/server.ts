import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {
  initFheInstance,
  encryptValue,
  encryptString,
  decryptEbool,
} from "./fhevm";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Зашифровать число (например, 42)
app.post("/encrypt", async (req, res) => {
  try {
    const { value } = req.body;
    if (value === undefined) {
      return res.status(400).json({ error: "Missing value" });
    }

    const encrypted = await encryptValue(Number(value));
    console.log(`🔐 Encrypted value ${value} → ${encrypted}`);
    res.json({ encrypted });
  } catch (err) {
    console.error("❌ encryptValue failed:", err);
    res.status(500).json({ error: "Encryption failed" });
  }
});

// Зашифровать строку (например, "Paris" → hash → uint32 → encrypted)
app.post("/encryptString", async (req, res) => {
  try {
    const { value } = req.body;
    if (!value || typeof value !== "string") {
      return res.status(400).json({ error: "Missing or invalid string" });
    }

    const encrypted = await encryptString(value);
    console.log(`🔡 Encrypted string "${value}" → ${encrypted}`);
    res.json({ encrypted });
  } catch (err) {
    console.error("❌ encryptString failed:", err);
    res.status(500).json({ error: "Encryption failed" });
  }
});

// Расшифровать ebool
app.post("/decrypt", async (req, res) => {
  try {
    const { ebool } = req.body;
    const result = await decryptEbool(ebool);
    res.json({ result });
  } catch (err) {
    console.error("❌ Decryption failed:", err);
    res.status(500).json({ error: "Decryption failed" });
  }
});

// Запуск
initFheInstance()
  .then(() => {
    console.log("🧠 FHE Quiz backend ready 🟢");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🌐 Listening on http://0.0.0.0:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ FHE init error:", err);
  });
