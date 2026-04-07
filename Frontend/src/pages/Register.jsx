import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // GOOGLE SIGNUP
  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      console.log("Google signup:", result.user);
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      alert("Google signup failed ❌");
    }
  };

  //  EMAIL REGISTER
  const handleRegister = async () => {
    if (!email || !password) {
      alert("Enter email & password");
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("Registered:", res.user);

      alert("Account created 🎉 Please login");
      navigate("/login");
    } catch (err) {
      console.error(err);

      if (err.code === "auth/email-already-in-use") {
        alert("Account already exists, please login");
        navigate("/login");
      } else {
        alert("Registration failed ❌");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0A0A0A] to-[#121212] text-white">

      <div className="w-[350px] p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl text-center">

        <h1 className="text-3xl font-bold mb-2">Create Account</h1>
        <p className="text-gray-400 mb-6">
          Sign up to get started
        </p>

        {/*  EMAIL REGISTER */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 rounded bg-gray-800 outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-3 rounded bg-gray-800 outline-none"
        />

        <button
          onClick={handleRegister}
          className="w-full bg-green-600 py-2 rounded mb-4 hover:bg-green-700"
        >
          Register
        </button>

        {/* Divider */}
        <div className="flex items-center gap-2 my-4 text-gray-500 text-sm">
          <div className="flex-1 h-px bg-gray-700"></div>
          OR
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        {/*  GOOGLE SIGNUP */}
        <button
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        {/*  LOGIN REDIRECT */}
        <p className="text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-400 cursor-pointer"
          >
            Login
          </span>
        </p>

        <p className="text-xs text-gray-500 mt-4">
          Secure signup powered by Firebase
        </p>
      </div>
    </div>
  );
}