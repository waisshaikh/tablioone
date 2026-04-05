import React, { useRef, useCallback, useEffect, useState } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";
import { useNavigate } from "react-router-dom";

export default function TableOrder() {
  const webcamRef = useRef(null);
  const [scanned, setScanned] = useState("");
  const [facingMode, setFacingMode] = useState("user");
  const navigate = useNavigate();

  const capture = useCallback(() => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height);

      if (code) {
        console.log("✅ QR:", code.data);
        setScanned(code.data);

        if (code.data.includes("table=")) {
          const tableId = code.data.split("table=")[1];


         sessionStorage.setItem("tableId", tableId);

          navigate("/menu", {
            state: { tableId },
          });
        } else {
          alert("Invalid QR 🚫");
        }
      }
    };
  }, [navigate]);

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
          screenshotFormat="image/png"
          videoConstraints={{ facingMode }}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {scanned && <p className="mt-4 text-green-400">{scanned}</p>}
    </div>
  );
}