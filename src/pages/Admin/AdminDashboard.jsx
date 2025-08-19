import React, { useState } from "react";
import SearchProperty from "../../pages/SearchByLocation";
import AddDealer from "../../components/SignupForm/SignupForm";
import AddClient from "../../components/Admin/AddClient";
import Statistics from "../../components/Admin/Statistics";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("search");

  return (
    <div className="admin-dashboard-container">
      <h2 className="admin-dashboard-title">Admin Dashboard</h2>

      {/* Menu Buttons */}
      <div className="admin-dashboard-menu">
        <button 
          className={`admin-dashboard-menu-btn ${activeTab === "search" ? "active" : ""}`}
          onClick={() => setActiveTab("search")}
        >
          Search by Property
        </button>
        <button 
          className={`admin-dashboard-menu-btn ${activeTab === "dealer" ? "active" : ""}`}
          onClick={() => setActiveTab("dealer")}
        >
          Add Dealer
        </button>
        <button 
          className={`admin-dashboard-menu-btn ${activeTab === "client" ? "active" : ""}`}
          onClick={() => setActiveTab("client")}
        >
          Add Client
        </button>
        <button 
          className={`admin-dashboard-menu-btn ${activeTab === "stats" ? "active" : ""}`}
          onClick={() => setActiveTab("stats")}
        >
          Statistics
        </button>
      </div>

      {/* Render Selected Component */}
      <div className="admin-dashboard-content">
        {activeTab === "search" && <SearchProperty />}
        {activeTab === "dealer" && <AddDealer />}
        {activeTab === "client" && <AddClient />}
        {activeTab === "stats" && <Statistics />}
      </div>
    </div>
  );
}
