import React, { useState } from "react";
import { useWallet } from "../context/walletContext";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

/* ───────────────────────────── NFTs On Sale ───────────────────────────── */
// Replace with real NFT IDs later
const nftList = [
  {
    id: "0.0.501234",
    name: "Cyber Ape #01",
    price: "3", // HBAR
    img: "https://i.seadn.io/gae/fake1.png?w=600&auto=format",
  },
  {
    id: "0.0.501235",
    name: "Glitch Helmet #92",
    price: "5",
    img: "https://i.seadn.io/gae/fake2.png?w=600&auto=format",
  },
  {
    id: "0.0.501236",
    name: "VR Samurai #11",
    price: "2.5",
    img: "https://i.seadn.io/gae/fake3.png?w=600&auto=format",
  }
];

/* Convert Hedera Token ID → EVM address */
async function convertNFT(id) {
  const url = `https://testnet.mirrornode.hedera.com/api/v1/tokens/${id}`;
  const json = await fetch(url).then(r => r.json());
  return json.token_id ? json.token_id : null;
}

export default function Invest() {
  const { walletData, account } = useWallet();
  const navigate = useNavigate();

  const [status, setStatus] = useState("");
  const [bidPopup, setBidPopup] = useState(null);
  const [bidAmount, setBidAmount] = useState("");

  if (!account) return navigate("/");

  /* BUY NFT — Simple transfer of HBAR */
  async function buyNFT(nft) {
    try {
      setStatus(`⏳ Purchasing ${nft.name}...`)

      const provider = walletData[1];
      const signer = provider.getSigner();

      const value = ethers.utils.parseUnits(nft.price.toString(), 18)

      const tx = await signer.sendTransaction({
        to: "0x000000000000000000000000000000000000dead", // temporary seller wallet
        value
      });

      setStatus(
        `🎉 NFT Purchased Successfully!
──────────────────────
Item: ${nft.name}
Paid: ${nft.price} HBAR
Tx:   ${tx.hash}`
      );

    } catch(err) {
      setStatus(`❌ Purchase Failed:\n${err.message}`);
    }
  }

  /* BID SYSTEM — currently off-chain but expandable later */
  function submitBid(nft) {
    setStatus(
      `💰 Bid placed!
────────────────────
NFT: ${nft.name}
Bid: ${bidAmount} HBAR`
    );
    setBidPopup(null);
    setBidAmount("");
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] px-5 py-10 flex justify-center">
      <div className="w-full max-w-4xl">

        <h1 className="text-3xl font-bold text-gray-900 mb-6">EyePay — NFT Market (Testnet)</h1>
        <p className="text-gray-500 mb-10">Buy & Bid NFTs — Only on Hedera Testnet ⚡</p>

        {/* NFT Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {nftList.map(nft => (
            <div key={nft.id} className="bg-white p-4 rounded-2xl shadow-lg border">

              <img src={nft.img} alt={nft.name} className="w-full rounded-xl mb-3" />

              <h2 className="text-lg font-semibold text-gray-900">{nft.name}</h2>
              <p className="text-sm text-gray-500">NFT ID: {nft.id}</p>

              <p className="text-xl font-bold text-blue-600 mt-2">{nft.price} HBAR</p>

              <button
                onClick={()=>buyNFT(nft)}
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700"
              >
                Buy Now
              </button>
              
              <button
                onClick={()=>setBidPopup(nft)}
                className="w-full mt-2 bg-gray-900 text-white py-2 rounded-xl hover:bg-black"
              >
                Place Bid
              </button>
            </div>
          ))}
        </div>

        {/* BID POPUP */}
        {bidPopup && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl w-80 text-center shadow-xl">
              <h2 className="text-lg font-bold mb-3">Bid on {bidPopup.name}</h2>

              <input
                type="number"
                value={bidAmount}
                onChange={(e)=>setBidAmount(e.target.value)}
                placeholder="Enter bid amount (HBAR)"
                className="w-full px-3 py-2 border rounded-xl mb-4"
              />

              <button
                onClick={()=>submitBid(bidPopup)}
                className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700"
              >
                Submit Bid
              </button>

              <button
                onClick={()=>setBidPopup(null)}
                className="w-full mt-2 text-sm text-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {status && <p className="mt-6 p-4 bg-gray-100 rounded-xl text-xs whitespace-pre-line border">{status}</p>}
      </div>
    </div>
  );
}
