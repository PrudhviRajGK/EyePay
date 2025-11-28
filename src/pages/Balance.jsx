import React, { useState } from "react";

/* Convert EVM → Hedera Account ID if needed */
async function resolveAccount(input) {
  // If user already entered Hedera ID 0.0.x → use directly
  if (input.includes(".")) return input;

  // Otherwise they entered 0x — convert to Hedera lookup
  const clean = input.replace("0x", "");
  const url = `https://testnet.mirrornode.hedera.com/api/v1/accounts?evm_address=${clean}`;
  const data = await fetch(url).then(r => r.json()).catch(()=>null);

  return data?.accounts?.[0]?.account ?? null;
}

/* Fetch HBAR Balance */
async function fetchHBAR(id) {
  const url = `https://testnet.mirrornode.hedera.com/api/v1/accounts/${id}`;
  const data = await fetch(url).then(r => r.json()).catch(()=>null);

  const tinybars = data?.balance?.balance || 0;
  return (tinybars / 100_000_000).toFixed(8); // convert tinybars → HBAR
}

export default function Balance() {
  const [input, setInput] = useState("");
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState("");

  async function checkBalance() {
    setError(""); setBalance(null);

    if (!input.trim()) return setError("Enter an account ID first");

    const id = await resolveAccount(input);
    if (!id) return setError("Invalid account — cannot resolve");

    const hbar = await fetchHBAR(id);
    setBalance(`${hbar} HBAR`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f7fb] px-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md text-center">

        <h1 className="text-2xl font-semibold text-gray-900 mb-2">HBAR Balance Checker</h1>
        <p className="text-sm text-gray-500 mb-6">Type ANY Hedera Address</p>

        <input
          type="text"
          placeholder="0.0.x or 0xEVMinHex"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="w-full p-3 border rounded-xl mb-4 text-sm"
        />

        <button
          onClick={checkBalance}
          className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
        >
          Check Balance
        </button>

        {balance && (
          <p className="mt-5 bg-gray-100 p-4 rounded-xl text-lg font-bold text-blue-600">
            {balance}
          </p>
        )}

        {error && <p className="mt-4 text-red-600 text-sm font-semibold">{error}</p>}

      </div>
    </div>
  );
}
