// src/pages/TableQRScanner.jsx
import React, { useRef, useCallback, useEffect, useState } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";
import { useNavigate } from "react-router-dom";

export default function TableQRScanner() {
  const webcamRef = useRef(null);
  const [scanned, setScanned] = useState("");
  const navigate = useNavigate();

  const capture = useCallback(() => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);
        if (code) {
          console.log("✅ QR Code:", code.data);
          setScanned(code.data);

          // Example QR: https://maaslli.com/menu?table=5
          if (code.data.includes("table=")) {
            const tableId = code.data.split("table=")[1];
            navigate(`/menu?table=${tableId}`);
          }
        }
      };
    }
  }, [navigate]);

  // Keep scanning every 1s
  useEffect(() => {
    const interval = setInterval(capture, 1000);
    return () => clearInterval(interval);
  }, [capture]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-2xl font-bold mb-6">📷 Scan Table QR</h1>

      <div className="w-[320px] h-[320px] border-4 border-teal-500 rounded-lg overflow-hidden">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/png"
          videoConstraints={{
            facingMode: "user", // 👈 use "environment" for mobile
          }}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {scanned && (
        <p className="mt-4 text-green-400">✅ Scanned: {scanned}</p>
      )}
    </div>
  );
}
