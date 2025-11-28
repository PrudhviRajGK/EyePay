import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "./context/walletContext";

import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";

export default function App() {
    return (
        <WalletProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Auth />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </BrowserRouter>
        </WalletProvider>
    );
}
