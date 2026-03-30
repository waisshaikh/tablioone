// src/pages/LoginPhone.jsx
import React, { useState } from "react";
import { auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function LoginPhone() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Create (or reuse) invisible reCAPTCHA
  const ensureRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => console.log("reCAPTCHA solved ✅"),
      });
    }
    return window.recaptchaVerifier;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!phone || !phone.startsWith("+")) {
      setError("Enter phone in E.164 format, e.g. +919876543210");
      return;
    }
    try {
      setSending(true);
      const verifier = ensureRecaptcha();
      const confirmation = await signInWithPhoneNumber(auth, phone, verifier);
      setConfirmationResult(confirmation);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to send OTP");
      // reset the verifier if it fails so user can retry
      window.recaptchaVerifier?.clear();
      window.recaptchaVerifier = null;
    } finally {
      setSending(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!confirmationResult) return;
    try {
      setVerifying(true);
      // For test numbers, enter the exact code you configured in Firebase console
      const result = await confirmationResult.confirm(otp);
      const user = result.user;

      // Keep phone for your backend linkage
      localStorage.setItem("userPhone", user.phoneNumber || "");

      // Redirect anywhere (home/profile)
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message || "Invalid OTP");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Login with Phone</h1>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {!confirmationResult ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <input
              type="tel"
              placeholder="+91 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value.trim())}
              className="w-full px-3 py-2 border rounded"
              required
            />
            <div id="recaptcha-container"></div>
            <button
              type="submit"
              disabled={sending}
              className={`w-full px-4 py-2 text-white rounded ${sending ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {sending ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP (e.g. 123456)"
              value={otp}
              onChange={(e) => setOtp(e.target.value.trim())}
              className="w-full px-3 py-2 border rounded"
              required
              inputMode="numeric"
            />
            <button
              type="submit"
              disabled={verifying}
              className={`w-full px-4 py-2 text-white rounded ${verifying ? "bg-green-400" : "bg-green-600 hover:bg-green-700"}`}
            >
              {verifying ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              type="button"
              onClick={() => {
                // allow resending: reset state & recaptcha
                setConfirmationResult(null);
                window.recaptchaVerifier?.clear();
                window.recaptchaVerifier = null;
              }}
              className="w-full px-4 py-2 border rounded"
            >
              Use a different number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
