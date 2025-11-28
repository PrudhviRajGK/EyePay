import { createContext, useContext, useState } from "react";

const WalletContext = createContext();

export function WalletProvider({ children }) {
    const [walletData, setWalletData] = useState(null);
    const [account, setAccount] = useState(null);
    const [network, setNetwork] = useState(null);

    return (
        <WalletContext.Provider value={{ walletData, setWalletData, account, setAccount, network, setNetwork }}>
            {children}
        </WalletContext.Provider>
    );
}

export const useWallet = () => useContext(WalletContext);
