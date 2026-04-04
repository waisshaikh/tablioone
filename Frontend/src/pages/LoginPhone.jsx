import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      console.log(" Logged in:", result.user);

      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      alert("Login failed!!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0A0A0A] to-[#121212] text-white">

      {/* Card */}
      <div className="w-[350px] p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl text-center">

        {/* Logo / Title */}
        <h1 className="text-3xl font-bold mb-2">Welcome 👋</h1>
        <p className="text-gray-400 mb-6">
          Continue with Google to proceed
        </p>

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          {/* Google Icon */}
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="google"
            className="w-5 h-5"
          />

          Continue with Google
        </button>

        {/* Small note */}
        <p className="text-xs text-gray-500 mt-6">
          Secure login powered by Google
        </p>
      </div>
    </div>
  );
}