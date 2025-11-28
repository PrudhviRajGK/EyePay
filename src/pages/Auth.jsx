import React, { useState } from "react";
import walletConnectFcn from "../components/hedera/walletConnect";
import { useWallet } from "../context/walletContext";
import { useNavigate } from "react-router-dom";

export default function Auth() {
    const { setWalletData, setAccount, setNetwork, account } = useWallet();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function connectWallet() {
        setLoading(true);
        setError("");
        try {
            const wData = await walletConnectFcn();
            if (wData && wData[0]) {
                setWalletData(wData);
                setAccount(wData[0]);
                setNetwork(wData[2]);
                navigate("/dashboard");
            } else setError("Connection failed. Try again.");
        } catch {
            setError("Unlock wallet & try again.");
        } finally {
            setLoading(false);
        }
    }

    const format = a => a ? `${a.slice(0,6)}...${a.slice(-4)}` : "";

    return (
        <div style={styles.screen}>

            {/* Brand Header – Apple / PayPal Style */}
            <div style={styles.brandWrapper}>
                <h1 style={styles.brand}>EyePay</h1>
                <p style={styles.tagline}>Payments in a New Dimension</p>
            </div>

            {/* Auth Card */}
            <div style={styles.card}>
                <h2 style={styles.heading}>Sign in with Wallet</h2>
                <p style={styles.subtext}>Secure Hedera Web3 access</p>

                {!account ? (
                    <>
                        <button 
                            onClick={connectWallet}
                            disabled={loading}
                            style={{ ...styles.button, opacity: loading ? .55 : 1 }}
                        >
                            {loading ? "Connecting..." : "Connect Wallet"}
                        </button>

                        {error && <div style={styles.error}>{error}</div>}

                        <a href="https://metamask.io/download/" target="_blank" style={styles.link}>
                            Install MetaMask
                        </a>
                    </>
                ) : (
                    <>
                        <div style={styles.connectedBadge}>
                            ✓ Connected • {format(account)}
                        </div>

                        <button style={styles.button} onClick={() => navigate("/dashboard")}>
                            Continue →
                        </button>
                    </>
                )}

                <p style={styles.footer}>Powered by Hedera</p>
            </div>
        </div>
    );
}

/* ── Apple + PayPal Inspired Minimal UI ───────────────────── */
const styles = {
    screen: {
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f6f7fb",
        fontFamily: "Inter, -apple-system, system-ui"
    },

    /* Brand */
    brandWrapper: {
        textAlign: "center",
        marginBottom: 40,
        transform: "translateY(-20px)"
    },
    brand: {
        fontSize: 40,
        fontWeight: 700,
        letterSpacing: "-.5px",
        color: "#111",
        marginBottom: 4
    },
    tagline: {
        fontSize: 15,
        color: "#555",
        fontWeight: 400
    },

    /* Card */
    card: {
        width: 380,
        background: "#fff",
        padding: "38px 34px",
        borderRadius: 16,
        boxShadow: "0 10px 28px rgba(0,0,0,.05)",
        textAlign: "center",
    },
    heading: {
        fontSize: 22,
        fontWeight: 600,
        marginBottom: 6,
        color: "#111"
    },
    subtext: {
        fontSize: 14,
        color: "#666",
        marginBottom: 28
    },

    button: {
        width: "100%",
        background: "#0070f3",
        color: "#fff",
        padding: "14px 0",
        borderRadius: 10,
        border: "none",
        fontSize: 16,
        fontWeight: 600,
        cursor: "pointer",
        marginBottom: 14
    },

    connectedBadge: {
        background: "#111",
        color: "#fff",
        padding: 14,
        borderRadius: 10,
        fontSize: 14,
        marginBottom: 18,
        fontWeight: 500
    },

    link: {
        color: "#0070f3",
        fontSize: 14,
        fontWeight: 500,
        marginTop: 8,
        display: "inline-block",
        textDecoration: "none"
    },

    error: {
        marginTop: 12,
        fontSize: 13,
        color: "#d00",
        fontWeight: 500
    },

    footer: {
        marginTop: 30,
        fontSize: 13,
        color: "#999",
    }
};
