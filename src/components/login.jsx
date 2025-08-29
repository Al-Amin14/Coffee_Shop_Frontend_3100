import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthUser from "./AuthUser";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { LoginContext } from "../context/login";
import { useContext } from "react";

function Login() {
  const navigate = useNavigate();
  const { http, setToken } = AuthUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const { loged, setLoged } = useContext(LoginContext);

  const submitForm = (e) => {
    e.preventDefault();
    setError("");

    http
      .post("/login", { email, password })
      .then((res) => {
        setToken(res.data.user, res.data.access_token);
        setLoged(true);
        toast.success("Login successful!");
        navigate("/dashboard");
      })
      .catch((err) => {
        console.error("Login failed:", err);
        const message =
          err.response?.data?.message || "Invalid email or password";
        setError(message);
      });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f0eadd] p-4 mx-auto">
      <div className="bg-[#fffaf0] w-full max-w-md p-8 rounded-2xl shadow-lg border border-[#e0d8cd]">
        <h1 className="text-3xl font-bold text-[#6b4f4f] text-center mb-1">
          Coffee Shop
        </h1>
        <p className="text-center text-[#a08c8c] mb-6 text-sm">
          Brew success with seamless management
        </p>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={submitForm} className="space-y-4">
          {/* Email */}
          <div className="flex flex-col">
            <label className="text-[#a08c8c] font-bold mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="px-4 py-2 border border-[#e0d8cd] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d28f5d] text-[#6b4f4f]"
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col relative">
            <label className="text-[#a08c8c] font-bold mb-1">Password</label>
            <input
              type={passwordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="px-4 py-2 border border-[#e0d8cd] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d28f5d] text-[#6b4f4f]"
              required
            />
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#a08c8c] cursor-pointer"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          {/* Additional options */}
          <div className="flex justify-between items-center text-sm text-[#a08c8c]">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-[#d28f5d] font-bold hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-tr from-[#e59c69] to-[#d28f5d] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1"
          >
            Sign In
          </button>
        </form>

        {/* Sign Up Section */}
        <div className="mt-6 text-center">
          <p className="text-[#6b4f4f] mb-2">Don't have an account?</p>
          <button
            onClick={() => navigate("/register")}
            className="w-full py-3 bg-[#d28f5d] text-white font-bold rounded-xl shadow-md hover:bg-[#e59c69] transition-colors"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
