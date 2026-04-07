import React, { useState } from "react";
import { auth, provider } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //  Email + Password Register
  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("Registered user:", userCredential.user);
      alert("Registration Successful 🎉");

      navigate("/login"); // redirect after register
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // Google Register 
  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google user:", result.user);

      alert("Google Signup Successful 🚀");
      navigate("/"); // or dashboard
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center">Register</h2>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded"
      />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded"
      />

      <button
        onClick={handleRegister}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Register
      </button>

      <button
        onClick={handleGoogleSignup}
        className="bg-red-500 text-white p-2 rounded"
      >
        Continue with Google
      </button>

      {/* Redirect to Login */}
      <p className="text-center">
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          className="text-blue-500 cursor-pointer"
        >
          Login
        </span>
      </p>
    </div>
  );
};

export default Register;