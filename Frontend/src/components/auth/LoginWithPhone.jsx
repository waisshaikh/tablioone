import React, { useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";

const LoginWithPhone = () => {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => {
          console.log("Recaptcha verified");
        },
      },
      auth
    );
  };

  const sendOtp = async () => {
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      alert("OTP sent!");
    } catch (error) {
      console.error(error);
      alert("Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    if (!confirmationResult) return;

    try {
      const userCredential = await confirmationResult.confirm(otp);
      console.log("User signed in:", userCredential.user);

      alert("Login Successful 🎉");
      navigate("/"); // dashboard/home
    } catch (error) {
      console.error(error);

      // 👉 If somehow user not found / invalid → suggest register
      alert("User not found. Please register first.");
      navigate("/register");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-center">Login with Phone</h2>

      <input
        type="text"
        placeholder="Enter phone number (+91...)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border p-2"
      />

      <button
        onClick={sendOtp}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Send OTP
      </button>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="border p-2"
      />

      <button
        onClick={verifyOtp}
        className="bg-green-500 text-white p-2 rounded"
      >
        Verify OTP
      </button>

      {/* 👉 REGISTER LINK */}
      <p className="text-center">
        Don’t have an account?{" "}
        <span
          onClick={() => navigate("/register")}
          className="text-blue-500 cursor-pointer"
        >
          Register First
        </span>
      </p>

      <div id="recaptcha-container"></div>
    </div>
  );
};

export default LoginWithPhone;