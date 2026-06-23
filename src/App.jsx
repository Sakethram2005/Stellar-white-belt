import { useEffect, useState } from "react";
import {
  connectWallet,
  disconnectWallet,
  fetchXlmBalance,
  sendXlm,
} from "./freighter";
import "./styles.css";

export default function App() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("1");
  const [status, setStatus] = useState("");
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);

  const refreshBalance = async (addr) => {
    const b = await fetchXlmBalance(addr);
    setBalance(b);
  };

  useEffect(() => {
    const saved = localStorage.getItem("stellar_address");
    if (saved) {
      setAddress(saved);
      refreshBalance(saved);
    }
  }, []);

  const handleConnect = async () => {
    try {
      setLoading(true);
      setStatus("Connecting wallet...");
      const addr = await connectWallet();
      setAddress(addr);
      localStorage.setItem("stellar_address", addr);
      await refreshBalance(addr);
      setStatus("Wallet connected.");
    } catch (err) {
      setStatus(`Connection failed: ${err.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    localStorage.removeItem("stellar_address");
    setAddress("");
    setBalance("");
    setTxHash("");
    setStatus("Wallet disconnected.");
    await disconnectWallet();
  };

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setStatus("Sending transaction...");
      setTxHash("");

      const result = await sendXlm({
        sender: address,
        destination,
        amount,
      });

      setTxHash(result.hash);
      setStatus("Transaction successful.");
      await refreshBalance(address);
    } catch (err) {
      setStatus(`Transaction failed: ${err.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Stellar White Belt dApp</h1>
        <p>Freighter wallet + Testnet balance + XLM transfer</p>

        <div className="actions">
          {!address ? (
            <button onClick={handleConnect} disabled={loading}>
              Connect Wallet
            </button>
          ) : (
            <button onClick={handleDisconnect} className="secondary">
              Disconnect Wallet
            </button>
          )}
        </div>

        {address && (
          <div className="box">
            <p><strong>Connected Address:</strong></p>
            <code>{address}</code>
            <p><strong>XLM Balance:</strong> {balance || "Loading..."}</p>
          </div>
        )}

        {address && (
          <form onSubmit={handleSend} className="form">
            <h2>Send XLM</h2>
            <input
              type="text"
              placeholder="Destination address"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
            <input
              type="number"
              step="0.0000001"
              min="0.0000001"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              Send Transaction
            </button>
          </form>
        )}

        <div className="status">
          <p><strong>Status:</strong> {status || "Idle"}</p>
          {txHash && (
            <p><strong>Transaction Hash:</strong> <code>{txHash}</code></p>
          )}
        </div>
      </div>
    </div>
  );
}