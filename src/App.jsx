import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "./context/walletContext";

/* Pages */
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Pay from "./pages/Pay";
import QR from "./pages/QR";
import Loan from "./pages/Loan";
import Invest from "./pages/Invest";
import Balance from "./pages/Balance";
import About from "./pages/About";

export default function App() {
    return (
        <WalletProvider>
            <BrowserRouter>
                <Routes>

                    {/* Login */}
                    <Route path="/" element={<Auth />} />

                    {/* Main Dashboard */}
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* Features */}
                    <Route path="/pay" element={<Pay />} />
                    <Route path="/qr" element={<QR />} />
                    <Route path="/loan" element={<Loan />} />
                    <Route path="/invest" element={<Invest />} />
                    <Route path="/balance" element={<Balance />} />
                    <Route path="/about" element={<About />} />

                </Routes>
            </BrowserRouter>
        </WalletProvider>
    );
}
