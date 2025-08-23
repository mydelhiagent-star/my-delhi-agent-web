import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";
import { API_ENDPOINTS } from "../../config/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(API_ENDPOINTS.ADMIN_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, password }).toString(),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Login failed");
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.token); // save JWT
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Something went wrong. Try again!");
    }
  };

  return (
    <div className="admin-login-container">
      <form onSubmit={handleLogin} className="admin-login-form">
        <h2 className="admin-login-title">Admin Login</h2>
        {error && <p className="admin-login-error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="admin-login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="admin-login-input"
        />
        <button type="submit" className="admin-login-btn">
          Login
        </button>
      </form>
    </div>
  );
}
