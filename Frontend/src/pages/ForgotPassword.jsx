import React, { useState } from "react";
import axios from "axios";
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function sendOtp() {
    if (!phone) return setMsg("Phone is required");
    try {
      setLoading(true);
      await axios.post(`${API}/api/user/auth/forgot/start`, { phone });
      setMsg("✅ OTP sent to your phone");
      setStep(2);
    } catch (e) {
      setMsg(e.response?.data?.message || "❌ Error sending OTP");
    } finally {
      setLoading(false);
    }
  }

  async function verify() {
    if (!otp || !newPassword) return setMsg("All fields required");
    if (newPassword.length < 6) return setMsg("Password must be at least 6 characters");
    try {
      setLoading(true);
      const { data } = await axios.post(`${API}/api/user/auth/forgot/verify`, { phone, otp, newPassword });
      localStorage.setItem("token", data.token);
      setMsg("✅ Password changed & logged in");
      setSuccess(true);
      // Redirect after 2s
      setTimeout(() => (window.location.href = "/dashboard"), 2000);
    } catch (e) {
      setMsg(e.response?.data?.message || "❌ Error verifying OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
      
      {step === 1 ? (
        <>
          <input
            className="border p-2 w-full mb-3 rounded"
            placeholder="Phone"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
          <button
            className="bg-black text-white px-4 py-2 rounded w-full disabled:opacity-50"
            onClick={sendOtp}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </>
      ) : (
        <>
          <input
            className="border p-2 w-full mb-3 rounded"
            placeholder="OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
          />
          <input
            className="border p-2 w-full mb-3 rounded"
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          <button
            className="bg-black text-white px-4 py-2 rounded w-full disabled:opacity-50"
            onClick={verify}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Reset Password"}
          </button>
        </>
      )}

      {msg && (
        <p className={`mt-3 text-sm ${success ? "text-green-600" : "text-red-600"}`}>
          {msg}
        </p>
      )}
    </div>
  );
}
