// src/pages/Dashboard.jsx
import React, { useState } from "react";
import PostProperty from "../components/Dashboard/PostProperty";
import MyProperties from "../components/Dashboard/MyProperties";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("post");

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Broker Dashboard
      </h2>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "20px",
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
      </div>

      {/* Conditional Components */}
      {activeTab === "post" && <PostProperty />}
      {activeTab === "my" && <MyProperties />}
    </div>
  );
}
