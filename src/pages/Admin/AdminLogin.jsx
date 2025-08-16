import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8080/admin/login", {
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
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <form
        onSubmit={handleLogin}
        style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "10px", width: "300px", textAlign: "center" }}
      >
        <h2>Admin Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <button
          type="submit"
          style={{ padding: "8px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px" }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
