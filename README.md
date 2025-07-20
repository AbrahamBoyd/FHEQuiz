# 🔐 FHE Quiz DApp – Private Quiz with Zama FHEVM

This project is a full-stack decentralized application (DApp) that allows private comparison of quiz answers using Fully Homomorphic Encryption (FHE) on the Zama FHEVM network.

---

## 🧩 Features

- ✅ Set encrypted correct answer (e.g. hashed string like `"Paris"`)
- ✅ Submit encrypted user answer
- ✅ Private comparison on-chain (no one can see your guess!)
- ✅ React frontend + Express backend
- ✅ Built for Zama FHEVM on Sepolia testnet

---

## 🏗 Structure

```
FHEQuiz/
├── contracts/                # Solidity smart contracts (FHEQuiz.sol)
├── scripts/                  # Hardhat deployment scripts
├── backend/                  # Node.js + Express server for encryption
├── frontend/                 # React dApp (Vite + Ethers.js + axios)
```

---

## 🚀 Quick Start

### 1. Clone and install
```bash
git clone <your-repo-url>
cd FHEQuiz
```

### 2. Backend
```bash
cd backend
cp .env.example .env     # Add your INFURA_API_KEY here
npm install
npm start
```

### 3. Frontend
```bash
cd ../frontend
cp .env.example .env     # Add contract + backend URL
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

---

## 🧠 Smart Contract

Solidity contract located in `contracts/FHEQuiz.sol` with methods:
- `setCorrectAnswer(bytes)`
- `submitAnswer(bytes)`
- `getResult() → ebool`
- `resetCorrect()` and `resetAnswer()`

---

## 📡 Deploy to Zama FHEVM (Sepolia)

```bash
npx hardhat run scripts/deploy.ts --network zama
```

Update `VITE_CONTRACT_ADDRESS` in `frontend/.env`.

---

## 🛡 Tech Stack

- 🧠 Zama FHEVM (Sepolia)
- 🔐 Custom-built `fhevmjs` for backend encryption
- 💻 React + Vite + Ethers.js
- 🛰 Express.js API (Node)
- ⚙️ Hardhat for deployment

---

Made with ❤️ using [Zama FHEVM](https://docs.zama.ai/).
