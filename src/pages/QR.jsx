import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import QrScanner from "react-qr-scanner";

export default function QR() {
  const [scanData, setScanData] = useState("");
  const navigate = useNavigate();

  const handleScan = (result) => {
    if (result) {
      setScanData(result.text);
      navigate("/pay", { state: { merchantId: result.text } });
    }
  };

  const handleError = (err) => console.error(err);

  const previewStyle = { height: "80vh", width: "100%" };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <QrScanner
        delay={300}
        style={previewStyle}
        onError={handleError}
        onScan={handleScan}
      />
    </div>
  );
}
