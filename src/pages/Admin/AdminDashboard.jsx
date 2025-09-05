import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchProperty from "../../pages/SearchByLocation";
import AddDealer from "../../components/SignupForm/SignupForm";
import AddClient from "../../components/Admin/AddClient";
import ClientsList from "../../components/Admin/ClientsList";
import ConflictingProperties from "../../components/Dashboard/ConflictingProperties";
import DealersList from "../../components/Admin/DealersList";
import Statistics from "../../components/Admin/Statistics";
import SoldProperties from "../../components/Admin/SoldProperties";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("search");
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      navigate("/admin/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const adminTabs = [
    {
      id: "search",
      label: "Search Properties",
      icon: "🔍",
      description: "Search and manage properties"
    },
    {
      id: "dealer",
      label: "Add Dealer",
      icon: "👤",
      description: "Register new dealers"
    },
    {
      id: "client",
      label: "Add Client",
      icon: "👥",
      description: "Add new clients"
    },
    {
      id: "clients",
      label: "All Clients",
      icon: "📋",
      description: "View all clients"
    },
    {
      id: "dealers_list",
      label: "All Dealers",
      icon: "🏢",
      description: "Manage dealers"
    },
    {
      id: "conflicts",
      label: "Conflicts",
      icon: "⚠️",
      description: "Resolve conflicts"
    },
    {
      id: "stats",
      label: "Statistics",
      icon: "📊",
      description: "View analytics"
    },
    {
      id: "sold",
      label: "Sold Properties",
      icon: "✅",
      description: "Track sales"
    }
  ];

  return (
    <div className="admin-dashboard">
      {/* Admin Header */}
      <header className="admin-header">
        <div className="container">
          <div className="admin-header-content">
            <div className="admin-logo">
              <div className="logo-icon">🛡️</div>
              <div className="logo-text">
                <h1 className="logo-title">Admin Dashboard</h1>
                <p className="logo-subtitle">My Delhi Agent</p>
              </div>
            </div>
            
            <div className="admin-actions">
              <button className="btn btn-ghost logout-btn" onClick={handleLogout}>
                <span className="btn-icon">🚪</span>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <nav className="admin-nav">
        <div className="container">
          <div className="admin-nav-tabs">
            {adminTabs.map((tab) => (
              <button
                key={tab.id}
                className={`admin-nav-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className="tab-icon">{tab.icon}</div>
                <div className="tab-content">
                  <span className="tab-label">{tab.label}</span>
                  <span className="tab-description">{tab.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Admin Content */}
      <main className="admin-content">
        <div className="container">
          <div className="admin-content-wrapper">
            {activeTab === "search" && <SearchProperty />}
            {activeTab === "dealer" && <AddDealer />}
            {activeTab === "client" && <AddClient />}
            {activeTab === "clients" && <ClientsList />}
            {activeTab === "dealers_list" && <DealersList />}
            {activeTab === "conflicts" && <ConflictingProperties />}
            {activeTab === "stats" && <Statistics />}
            {activeTab === "sold" && <SoldProperties />}
          </div>
        </div>
      </main>
    </div>
  );
}