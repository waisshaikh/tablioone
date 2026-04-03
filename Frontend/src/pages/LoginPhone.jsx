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

      const user = result.user;

      console.log("✅ Logged in user:", user);

      // redirect back
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-white/10 p-8 rounded-xl text-center">
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        <button
          onClick={handleGoogleLogin}
          className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200"
        >
          Continue with Google!
        </button>
      </div>
    </div>
  );
}