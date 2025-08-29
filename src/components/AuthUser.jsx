
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthUser() {
  const navigate = useNavigate();

  // Retrieve token & user from sessionStorage
  const getToken = () => {
    const tokenString = sessionStorage.getItem("token");
    return tokenString ? JSON.parse(tokenString) : null;
  };

  const getUser = () => {
    const userString = sessionStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  };

  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(getUser());

  // Save token & user, update state and navigate to dashboard
  const saveToken = (user, token) => {
    sessionStorage.setItem("token", JSON.stringify(token));
    sessionStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
    navigate("/dashboard");
  };

  // Logout function with redirect to homepage
  const logout = () => {
    sessionStorage.clear();
    setToken(null);
    setUser(null);
    navigate("/"); // Redirect to homepage on logout
  };

  // Create axios instance with token header if available
  const http = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  return {
    setToken: saveToken,
    token,
    user,
    http,
    logout,
  };
}
