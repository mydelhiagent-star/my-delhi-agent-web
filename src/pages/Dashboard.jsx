import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostProperty from "../components/Dashboard/PostProperty";
import MyProperties from "../components/Dashboard/MyProperties";
import MyClients from "../components/Dashboard/MyClients";
import "./Dashboard.css";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("my");
  const [userInfo, setUserInfo] = useState(null);
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalClients: 0,
    activeListings: 0,
    monthlyRevenue: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Get user info from token
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserInfo(payload);
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const tabs = [
    {
      id: "post",
      label: "Post Property",
      icon: "🏠",
      description: "Add new property listings"
    },
    {
      id: "my",
      label: "My Properties",
      icon: "📋",
      description: "Manage your properties"
    },
    {
      id: "clients",
      label: "My Clients",
      icon: "👥",
      description: "View and manage clients"
    }
  ];

  return (
    <div className="dashboard">
      {/* Dashboard Header */}
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <div className="dashboard-logo">
                <div className="logo-icon">🏢</div>
                <div className="logo-text">
                  <h1 className="logo-title">My Delhi Agent</h1>
                  <p className="logo-subtitle">Broker Dashboard</p>
                </div>
              </div>
            </div>
            
            <div className="header-right">
              <div className="user-info">
                <div className="user-avatar">
                  <span className="avatar-text">
                    {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : "B"}
                  </span>
                </div>
                <div className="user-details">
                  <span className="user-name">{userInfo?.name || "Broker"}</span>
                  <span className="user-role">Premium Broker</span>
                </div>
              </div>
              
              <button className="btn btn-ghost logout-btn" onClick={handleLogout}>
                <span className="btn-icon">🚪</span>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Stats */}
      <section className="dashboard-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🏠</div>
              <div className="stat-content">
                <span className="stat-number">{stats.totalProperties}</span>
                <span className="stat-label">Total Properties</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <span className="stat-number">{stats.totalClients}</span>
                <span className="stat-label">Active Clients</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <span className="stat-number">{stats.activeListings}</span>
                <span className="stat-label">Active Listings</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <span className="stat-number">₹{stats.monthlyRevenue.toLocaleString()}</span>
                <span className="stat-label">Monthly Revenue</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Navigation */}
      <nav className="dashboard-nav">
        <div className="container">
          <div className="nav-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
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

      {/* Dashboard Content */}
      <main className="dashboard-content">
        <div className="container">
          <div className="content-wrapper">
            {activeTab === "post" && <PostProperty />}
            {activeTab === "my" && <MyProperties />}
            {activeTab === "clients" && <MyClients />}
          </div>
        </div>
      </main>

      {/* Quick Actions Floating Button */}
      <div className="quick-actions">
        <button className="quick-action-btn" onClick={() => setActiveTab("post")}>
          <span className="action-icon">➕</span>
          <span className="action-text">Add Property</span>
        </button>
      </div>
    </div>
  );
}