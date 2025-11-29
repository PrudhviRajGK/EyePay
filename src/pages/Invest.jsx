// nft logic to be implemented in later stages

import React, { useState, useEffect } from "react";
import { useWallet } from "../context/walletContext";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

// LOCAL NFT IMAGES (from public/nfts/)
const NFTS = [
  { id: 1, name: "Cyber Ape",       price: "2",   img: "/nfts/ape1.png" },
  { id: 2, name: "Neon Samurai",   price: "3.5", img: "/nfts/samurai2.png" },
  { id: 3, name: "Glitch Mask",    price: "1.2", img: "/nfts/glitch3.png" },
  { id: 4, name: "Hologram Skull", price: "4",   img: "/nfts/skull4.png" },
  { id: 5, name: "Galaxy Ape",     price: "2.7", img: "/nfts/ape5.png" },
  { id: 6, name: "Tech Runner",    price: "3",   img: "/nfts/runner6.png" },
];

// HBAR testnet receiver (YOU SHOULD CHANGE THIS LATER)
const SELLER = "0x000000000000000000000000000000000000dead";

export default function Invest() {
  const { walletData, account } = useWallet();
  const navigate = useNavigate();

  const [status, setStatus] = useState("");
  const [bidPopup, setBidPopup] = useState(null);
  const [bidAmount, setBidAmount] = useState("");

  useEffect(() => { if (!account) navigate("/"); }, [account]);

  /** BUY NFT (Testnet HBAR Send Only) **/
  async function buy(nft) {
    try {
      const signer = walletData[1].getSigner();
      const tx = await signer.sendTransaction({
        to: SELLER,
        value: ethers.utils.parseUnits(nft.price, 18),
      });

      setStatus(`🟢 PURCHASE SUCCESSFUL

Item: ${nft.name}
Paid: ${nft.price} HBAR
Tx: ${tx.hash}`);
    } catch (err) {
      setStatus("❌ " + err.message);
    }
  }

  /** BID FEATURE (OFF-CHAIN TEST LOGIC) **/
  function placeBid(nft) {
    setStatus(`💰 BID PLACED

NFT: ${nft.name}
Bid Amount: ${bidAmount} HBAR`);

    setBidPopup(null);
    setBidAmount("");
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white p-10">
      <h1 className="text-3xl font-bold mb-10 text-center">Testnet NFT Store 🧪</h1>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">

        {NFTS.map((nft) => (
          <div key={nft.id} className="bg-white/10 p-4 rounded-xl text-center shadow-lg">

            <img src={nft.img} className="w-full h-48 object-cover rounded mb-3" />

            <h2 className="font-bold text-lg">{nft.name}</h2>
            <p className="text-emerald-400 font-bold text-xl mt-1">{nft.price} HBAR</p>

            {/* BUY */}
            <button
              onClick={() => buy(nft)}
              className="mt-3 w-full bg-emerald-500 hover:bg-emerald-600 py-2 rounded-lg">
              Buy (Testnet)
            </button>

            {/* BID */}
            <button
              onClick={() => setBidPopup(nft)}
              className="mt-2 w-full bg-[#222]/60 hover:bg-[#333] py-2 rounded-lg border border-white/10">
              Bid
            </button>

          </div>
        ))}

      </div>

      {/* BID POPUP */}
      {bidPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white/10 p-6 rounded-xl w-72 text-center border border-white/20">

            <h2 className="text-lg font-bold mb-3">Place bid on {bidPopup.name}</h2>

            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="Enter HBAR amount"
              className="w-full p-2 rounded bg-black/30 mb-3 text-white text-center border border-white/20"
            />

            <button
              onClick={() => placeBid(bidPopup)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 py-2 rounded mb-2">
              Submit Bid
            </button>

            <button onClick={() => setBidPopup(null)} className="text-gray-400">
              Cancel
            </button>

          </div>
        </div>
      )}

      {status && (
        <pre className="bg-black/40 p-4 mt-8 rounded-lg text-sm whitespace-pre-wrap max-w-4xl mx-auto">
          {status}
        </pre>
      )}

    </div>
  );
}
