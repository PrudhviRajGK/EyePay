import React, { useState } from "react";
import { useWallet } from "../context/walletContext";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

// 🔥 Convert Hedera ID → EVM Address automatically
async function convertToEVM(hederaId) {
  try {
    const url = `https://testnet.mirrornode.hedera.com/api/v1/accounts/${hederaId}`;
    const res = await fetch(url).then(r => r.json());
    return res.evm_address || null;
  } catch {
    return null;
  }
}

export default function Loan() {
  const { walletData, account, network } = useWallet();
  const navigate = useNavigate();

  const [loanRequestAmount, setLoanRequestAmount] = useState("");
  const [loanLendAmount, setLoanLendAmount] = useState("");
  const [borrowerId, setBorrowerId] = useState(""); // Can be 0.0.x OR 0x
  const [status, setStatus] = useState("");

  if (!account) return navigate("/");

  // 🟣 Borrow Amount UI (request only)
  function requestLoan() {
    if (!loanRequestAmount || Number(loanRequestAmount) <= 0)
      return setStatus("⚠ Enter valid loan request amount");

    setStatus(`📌 Loan requested for ${loanRequestAmount} HBAR.\nWaiting for lender approval...`);
  }

  // 🟢 Lend Amount (actual HBAR transfer)
  async function lendMoney() {
    if (!borrowerId) return setStatus("⚠ Enter borrower ID");
    if (!loanLendAmount || Number(loanLendAmount) <= 0)
      return setStatus("⚠ Enter valid amount to lend");

    try {
      setStatus("⏳ Checking address...");

      const provider = walletData[1];
      const signer = provider.getSigner();

      let toAddress = borrowerId;

      // 🔄 If a Hedera 0.0.x format is entered → Convert to EVM address
      if (!borrowerId.startsWith("0x")) {
        const evm = await convertToEVM(borrowerId);
        if (!evm) return setStatus("❌ Invalid Hedera ID — cannot convert");
        toAddress = evm;
      }

      const value = ethers.utils.parseUnits(loanLendAmount.toString(), 18);

      setStatus("📤 Sending HBAR loan transaction...");

      const tx = await signer.sendTransaction({ to: toAddress, value });

      setStatus(
        `✅ Loan Sent Successfully!
━━━━━━━━━━━━━━━━━━━━━━
Amount: ${loanLendAmount} HBAR
Borrower: ${borrowerId}
Tx Hash: ${tx.hash}
━━━━━━━━━━━━━━━━━━━━━━`
      );
    } catch (err) {
      setStatus(`❌ Loan failed: ${err.message}`);
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border p-8 space-y-8">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900">EyePay — Loan System</h1>
          <p className="text-sm text-gray-500">Borrow or Lend HBAR instantly</p>
        </div>

        {/* Wallet */}
        <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700">
          <div><b>Wallet:</b> {account.slice(0,6)}...{account.slice(-4)}</div>
          <div><b>Network:</b> {network}</div>
        </div>

        {/* Borrow Section */}
        <div className="rounded-2xl border border-purple-300 bg-purple-50 p-5">
          <h2 className="text-sm font-semibold mb-3">Borrow HBAR</h2>
          <input
            type="number"
            className="w-full p-3 border rounded-xl mb-3"
            placeholder="Enter HBAR to request"
            value={loanRequestAmount}
            onChange={(e)=>setLoanRequestAmount(e.target.value)}
          />
          <button
            onClick={requestLoan}
            className="w-full py-3 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700"
          >
            Request Loan
          </button>
        </div>

        {/* Lend Section */}
        <div className="rounded-2xl border border-green-300 bg-green-50 p-5">
          <h2 className="text-sm font-semibold mb-3">Lend HBAR</h2>

          <input
            type="text"
            className="w-full p-3 border rounded-xl mb-2"
            placeholder="Borrower Hedera ID (0.0.x) or EVM (0x...)"
            value={borrowerId}
            onChange={(e)=>setBorrowerId(e.target.value)}
          />

          <input
            type="number"
            className="w-full p-3 border rounded-xl mb-3"
            placeholder="Amount (HBAR)"
            value={loanLendAmount}
            onChange={(e)=>setLoanLendAmount(e.target.value)}
          />

          <button
            onClick={lendMoney}
            className="w-full py-3 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700"
          >
            Lend Money
          </button>
        </div>

        {/* STATUS */}
        {status && (
          <div className="text-xs bg-gray-100 border rounded-xl p-3 whitespace-pre-line">{status}</div>
        )}
      </div>
    </div>
  );
}
