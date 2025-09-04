// src/pages/Dashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PostProperty from "../components/Dashboard/PostProperty";
import MyProperties from "../components/Dashboard/MyProperties";
import MyClients from "../components/Dashboard/MyClients";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("my");
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
    } catch (_) {}
    navigate("/");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Broker Dashboard
      </h2>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            background: "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "20px",
          flexWrap: "wrap"
        }}
      >
        <button
          onClick={() => setActiveTab("post")}
          style={{
            padding: "10px 20px",
            background: activeTab === "post" ? "#007bff" : "#ddd",
            color: activeTab === "post" ? "#fff" : "#000",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Post Property
        </button>
        <button
          onClick={() => setActiveTab("my")}
          style={{
            padding: "10px 20px",
            background: activeTab === "my" ? "#007bff" : "#ddd",
            color: activeTab === "my" ? "#fff" : "#000",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          My Properties
        </button>
        <button
          onClick={() => setActiveTab("clients")}
          style={{
            padding: "10px 20px",
            background: activeTab === "clients" ? "#007bff" : "#ddd",
            color: activeTab === "clients" ? "#fff" : "#000",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          My Clients
        </button>
      </div>

      {/* Conditional Components */}
      {activeTab === "post" && <PostProperty />}
      {activeTab === "my" && <MyProperties />}
      {activeTab === "clients" && <MyClients />}
    </div>
  );
}