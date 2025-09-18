
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthUser() {
  const navigate = useNavigate();

  // Retrieve token & user from sessionStorage
  const getToken = () => {
    const tokenString = localStorage.getItem("token");
    return tokenString ? JSON.parse(tokenString) : null;
  };

  const getUser = () => {
    const userString = localStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  };

  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(getUser());

  // Save token & user, update state and navigate to dashboard
  const saveToken = (user, token) => {
    localStorage.setItem("token", JSON.stringify(token));
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
    if (JSON.parse(localStorage.getItem('user')).role == 'Manager') {
      navigate("/dashboard"); // navigate after login
    } else {
      navigate("/menu"); // navigate after login
    }
    // navigate("/dashboard");
  };

  // Logout function with redirect to homepage
  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    navigate("/login"); // Redirect to homepage on logout
  };

  // Create axios instance with token header if available
  const http = axios.create({
    baseURL: "https://coffeeshopbackend3100-production.up.railway.app/api",
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
