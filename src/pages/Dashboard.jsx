import React, { useState } from "react";
import { useWallet } from "../context/walletContext";
import MyGroup from "../components/MyGroup.jsx";
import contractDeployFcn from "../components/hedera/contractDeploy";
import contractExecuteFcn from "../components/hedera/contractExecute";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const { walletData, account, network } = useWallet();
    const navigate = useNavigate();

    const [contractAddress, setContractAddress] = useState();
    const [deployMsg, setDeployMsg] = useState();
    const [execMsg, setExecMsg] = useState();

    if (!account) return navigate("/");

    async function deployContract() {
        const cAddr = await contractDeployFcn(walletData);
        setContractAddress(cAddr);
        setDeployMsg("Contract Deployed: " + cAddr);
    }

    async function executeContract() {
        const [txHash, finalCount] = await contractExecuteFcn(walletData, contractAddress);
        setExecMsg(`Count: ${finalCount} | TxHash: ${txHash}`);
    }

    return (
        <div className="App">
            <h1 className="header">Welcome {account}</h1>
            <p>Network: <b>{network}</b></p>

            <MyGroup fcn={deployContract} buttonLabel="Deploy Contract" text={deployMsg} />
            <MyGroup fcn={executeContract} buttonLabel="Execute Contract (+1)" text={execMsg} />
        </div>
    );
}
