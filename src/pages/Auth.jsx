import React from "react";
import walletConnectFcn from "../components/hedera/walletConnect";
import { useWallet } from "../context/walletContext";
import MyGroup from "../components/MyGroup.jsx";
import { useNavigate } from "react-router-dom";

export default function Auth() {
    const { setWalletData, setAccount, setNetwork, account } = useWallet();
    const navigate = useNavigate();

    async function connectWallet() {
        const wData = await walletConnectFcn();

        if (wData && wData[0]) {
            setWalletData(wData);
            setAccount(wData[0]);
            setNetwork(wData[2]);
            navigate("/dashboard");
        }
    }

    return (
        <div className="App">
            <h1 className="header">Connect Wallet to Continue</h1>
            <MyGroup fcn={connectWallet} buttonLabel={"Connect Wallet"} text={account ? "Connected" : ""} />
        </div>
    );
}
