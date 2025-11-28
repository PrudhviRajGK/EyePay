import React, { useState } from "react";
import { useWallet } from "../context/walletContext";
import { useNavigate, useLocation } from "react-router-dom";
import { ethers } from "ethers";

// Convert Hedera 0.0.x → EVM address using Mirror Node
async function convertToEVM(hederaId) {
  try {
    const url = `https://testnet.mirrornode.hedera.com/api/v1/accounts/${hederaId}`;
    const res = await fetch(url).then(r => r.json());
    return res.evm_address || null;
  } catch {
    return null;
  }
}

export default function Pay() {
  const { walletData, account, network } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();

  const [merchant, setMerchant] = useState(location.state?.merchantId || "");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  if (!account) return navigate("/");

  async function sendPayment() {
    if (!merchant) return setStatus("⚠ Enter or scan merchant address");
    if (!amount || Number(amount) <= 0) return setStatus("⚠ Enter valid amount");

    try {
      setStatus("⏳ Preparing transfer...");

      const provider = walletData[1];
      const signer = provider.getSigner();

      let toAddress = merchant;

      // If merchant = 0.0.x → convert → EVM address
      if (!merchant.startsWith("0x")) {
        setStatus("🔄 Converting Hedera ID → EVM address...");
        const evm = await convertToEVM(merchant);
        if (!evm) return setStatus("❌ Invalid Hedera ID — cannot convert");
        toAddress = evm;
      }

      const value = ethers.utils.parseUnits(amount.toString(), 18);

      setStatus("📤 Sending Transaction... Please approve in MetaMask");

      const tx = await signer.sendTransaction({
        to: toAddress,
        value
      });

      setStatus(
        `✅ Payment Successful!
────────────────────────
Sent:     ${amount} HBAR
Merchant: ${merchant}
Tx Hash:  ${tx.hash}
────────────────────────`
      );
    } catch (err) {
      setStatus(`❌ Payment Failed:\n${err.message}`);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f7fb] px-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
        
        <h1 className="text-2xl font-semibold text-gray-900 text-center">EyePay — Payment</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Scan or enter merchant address</p>

        {/* Merchant input */}
        <label className="text-xs font-semibold text-gray-600">Merchant Address / Hedera ID</label>
        <input
          type="text"
          value={merchant}
          onChange={(e)=>setMerchant(e.target.value)}
          placeholder="0.0.x OR 0x..."
          className="w-full p-3 border rounded-xl mb-4 text-xs bg-gray-50"
        />

        {/* Amount */}
        <label className="text-xs font-semibold text-gray-600">Amount (HBAR)</label>
        <input
          type="number"
          value={amount}
          onChange={(e)=>setAmount(e.target.value)}
          placeholder="Enter HBAR"
          className="w-full p-3 border rounded-xl mb-4"
        />

        <button
          onClick={sendPayment}
          className="w-full p-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700"
        >
          Send HBAR
        </button>

        {status && <p className="mt-4 text-xs bg-gray-100 p-3 rounded-xl whitespace-pre-line">{status}</p>}
      </div>
    </div>
  );
}
