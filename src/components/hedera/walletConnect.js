import { ethers } from "ethers";
const network = "testnet";

async function walletConnectFcn() {
    console.log(`\n=======================================`);
    
    if (!window.ethereum) {
        alert("MetaMask not detected 🦊 Install the extension first.");
        return;
    }

    // ETHERS PROVIDER
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    console.log(`- Switching network to the Hedera ${network}...🟠`);

    let chainId = 
        network === "testnet" ? "0x128" :
        network === "previewnet" ? "0x129" :
        "0x127";

    try {
        await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
                {
                    chainName: `Hedera ${network}`,
                    chainId: chainId,
                    nativeCurrency: { name: "HBAR", symbol: "HBAR", decimals: 18 }, // FIXED HERE
                    rpcUrls: [`https://${network}.hashio.io/api`],
                    blockExplorerUrls: [`https://hashscan.io/${network}/`],
                },
            ],
        });
        console.log("- Switched to Hedera Network ✅");
    } catch (error) {
        console.log("⚠ Network switch failed:", error.message);
    }

    console.log("- Requesting wallet connection...🟠");

    let selectedAccount;

    try {
        // 🔥 Forces MetaMask popup even if already connected before
        await window.ethereum.request({
            method: "wallet_requestPermissions",
            params: [{ eth_accounts: {} }]
        });

        const accounts = await provider.send("eth_requestAccounts", []);
        selectedAccount = accounts[0];
        console.log(`- Selected account: ${selectedAccount} ⚡`);
    } catch (connectError) {
        console.log(`❌ Wallet Connection Failed: ${connectError.message}`);
        return;
    }

    return [selectedAccount, provider, network];
}

export default walletConnectFcn;
