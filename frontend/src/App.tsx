import { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import contractAbi from "./FHEQuiz.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS!;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

function App() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState<null | boolean>(null);
  const [isOwner, setIsOwner] = useState(false);

  const connectWallet = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
      const owner = await contractInstance.owner();
      setIsOwner(owner.toLowerCase() === address.toLowerCase());
      setWalletAddress(address);
      setContract(contractInstance);
    } catch (error) {
      console.error("❌ Failed to connect wallet:", error);
    }
  };

  const handleSetCorrect = async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}/encryptString`, { value: correctAnswer });
      const encrypted = res.data.encrypted;
      const tx = await contract!.setCorrectAnswer(encrypted);
      await tx.wait();
    } catch (error) {
      console.error("❌ Failed to set correct:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}/encryptString`, { value: userAnswer });
      const encrypted = res.data.encrypted;
      const tx = await contract!.submitAnswer(encrypted);
      await tx.wait();
    } catch (error) {
      console.error("❌ Failed to submit answer:", error);
    }
  };

  const handleGetResult = async () => {
    try {
      const ebool = await contract!.getResult();
      const res = await axios.post(`${BACKEND_URL}/decrypt`, { ebool });
      setResult(res.data.result);
    } catch (error) {
      console.error("❌ Failed to get result:", error);
    }
  };

  const handleResetAnswer = async () => {
    try {
      const tx = await contract!.resetAnswer();
      await tx.wait();
      setResult(null);
    } catch (error) {
      console.error("❌ Failed to reset answer:", error);
    }
  };

  return (
    <div style={{
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#f5f7fa",
      minHeight: "100vh",
      padding: "2rem",
      color: "#333"
    }}>
      <div style={{
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
        padding: "2rem"
      }}>
        <h1 style={{
          fontSize: "2rem",
          color: "#4b0082",
          marginBottom: "1.5rem"
        }}>🧠 FHE Quiz</h1>

        {!walletAddress && (
          <button
            onClick={connectWallet}
            style={{
              backgroundColor: "#4b0082",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              marginBottom: "1rem"
            }}
          >🔌 Connect Wallet</button>
        )}

        {walletAddress && (
          <>
            <section style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ color: "#db4c77" }}>🎯 Set Correct Answer (Owner only)</h2>
              <input
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                placeholder="Correct answer"
                style={{ padding: "8px", width: "70%", marginRight: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
              />
              <button onClick={handleSetCorrect} style={{ padding: "8px 16px", backgroundColor: "#db4c77", color: "white", border: "none", borderRadius: "6px" }}>Set</button>
            </section>

            <section style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ color: "#008b8b" }}>📝 Submit Your Answer</h2>
              <input
                placeholder="Your answer"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                style={{ padding: "8px", width: "70%", marginRight: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
              />
              <button onClick={handleSubmit} style={{ padding: "8px 16px", backgroundColor: "#008b8b", color: "white", border: "none", borderRadius: "6px" }}>Submit</button>
            </section>

            <section style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ color: "#6a5acd" }}>📊 Check Result</h2>
              <button onClick={handleGetResult} style={{ padding: "8px 16px", backgroundColor: "#6a5acd", color: "white", border: "none", borderRadius: "6px" }}>Get Result</button>
              {result !== null && (
                <div style={{ fontSize: "1.5rem", marginTop: "1rem" }}>
                  {result ? "✅ Correct!" : "❌ Incorrect"}
                </div>
              )}
            </section>

            {isOwner && (
              <section>
                <h2 style={{ color: "#c71585" }}>🧹 Reset</h2>
                <button onClick={handleResetAnswer} style={{ padding: "8px 16px", backgroundColor: "#c71585", color: "white", border: "none", borderRadius: "6px" }}>Reset Answer</button>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
