// Dashboard.jsx
import React, { useState } from "react";
import { useWallet } from "../context/walletContext";
import MyGroup from "../components/MyGroup.jsx";
import contractDeployFcn from "../components/hedera/contractDeploy";
import contractExecuteFcn from "../components/hedera/contractExecute";
import { useNavigate } from "react-router-dom";
import HeroCarousel from "../components/HeroCarousel";
import ServiceGrid from "../components/ServiceGrid";

export default function Dashboard() {
    const { walletData, account, network } = useWallet();
    const navigate = useNavigate();
    const [contractAddress, setContractAddress] = useState("");
    const [deployMsg, setDeployMsg] = useState("");
    const [execMsg, setExecMsg] = useState("");

    if (!account) return navigate("/");

    async function deployContract() {
        const cAddr = await contractDeployFcn(walletData);
        setContractAddress(cAddr);
        setDeployMsg("Contract Deployed: " + cAddr);
    }

    async function executeContract() {
        if (!contractAddress) return setExecMsg(" ⚠ Deploy contract first ");
        const [txHash, finalCount] = await contractExecuteFcn(walletData, contractAddress);
        setExecMsg(`Count: ${finalCount} | TxHash: ${txHash}`);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-50 backdrop-blur-lg bg-white/95">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold">EYEPAY</h1>
                    
                </div>
            </header>

            {/* Main */}
            <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
                
                

                <HeroCarousel />
   

                <ServiceGrid />
                
                

            </main>
        </div>
    );
}