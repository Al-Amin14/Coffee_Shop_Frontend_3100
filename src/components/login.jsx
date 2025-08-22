import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import AuthUser from "./AuthUser";

function Login() {
  const navigate = useNavigate();
  const { http, setToken } = AuthUser(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  const submitForm = (e) => {
    e.preventDefault(); 

   
    setError("");

    
    http
      .post("/login", { email, password })
      .then((res) => {
        
        setToken(res.data.user, res.data.access_token);
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
    <div className="auth-container">
      <h1>Coffee Shop</h1>
      <p>Brew success with seamless management</p>

      <form onSubmit={submitForm}>
        
        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <div className="input-wrapper">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <i
              className={`password-toggle ${
                passwordVisible ? "fa-eye-slash" : "fa-eye"
              }`}
              onClick={() => setPasswordVisible(!passwordVisible)}
            ></i>
          </div>
        </div>

        <div className="additional-options">
          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>
          <a href="#" className="forgot-password">
            Forgot password?
          </a>
        </div>

        <button type="submit" className="submit-btn">
          Sign In
        </button>

        <p style={{ textAlign: "center", marginTop: "15px" }}>
          Don't have an account?{" "}
          <span
            style={{ color: "#4CAF50", cursor: "pointer", fontWeight: "bold" }}
            onClick={() => navigate("/register")}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
