import React, { useState } from "react";
import SearchProperty from "../../pages/SearchByLocation";
import AddDealer from "../../components/SignupForm/SignupForm";
import AddClient from "../../components/Admin/AddClient";
import Statistics from "../../components/Admin/Statistics";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("search");

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      {/* Menu Buttons */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
        <button onClick={() => setActiveTab("search")}>
          Search by Property
        </button>
        <button onClick={() => setActiveTab("dealer")}>Add Dealer</button>
        <button onClick={() => setActiveTab("client")}>Add Client</button>
        <button onClick={() => setActiveTab("stats")}>Statistics</button>
      </div>

      {/* Render Selected Component */}
      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        {activeTab === "search" && <SearchProperty />}
        {activeTab === "dealer" && <AddDealer />}
        {activeTab === "client" && <AddClient />}
        {activeTab === "stats" && <Statistics />}
      </div>
    </div>
  );
}
