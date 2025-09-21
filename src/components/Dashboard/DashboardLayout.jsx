"use client";

import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../pages/Dashboard.css";

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token and redirect to login
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="dashboard-container">
      {/* Premium Top Bar */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Broker Dashboard</h1>
          <button className="logout-btn" onClick={handleLogout} aria-label="Logout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16,17 21,12 16,7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Tab Navigation */}
        <nav className="tab-navigation" role="tablist">
          <Link
            to="/dashboard/properties"
            className={`tab-button ${isActive("/dashboard/properties") ? "active" : ""}`}
            role="tab"
            aria-selected={isActive("/dashboard/properties")}
            aria-controls="properties-panel"
          >
            <span>My Properties</span>
          </Link>
          <Link
            to="/dashboard/post-property"
            className={`tab-button ${isActive("/dashboard/post-property") ? "active" : ""}`}
            role="tab"
            aria-selected={isActive("/dashboard/post-property")}
            aria-controls="post-panel"
          >
            <span>Post Property</span>
          </Link>
        
          <Link
            to="/dashboard/all-clients"
            className={`tab-button ${isActive("/dashboard/all-clients") ? "active" : ""}`}
            role="tab"
            aria-selected={isActive("/dashboard/all-clients")}
            aria-controls="all-clients-panel"
          >
            <span>My Clients</span>
          </Link>
          <Link
            to="/dashboard/clients"
            className={`tab-button ${isActive("/dashboard/clients") ? "active" : ""}`}
            role="tab"
            aria-selected={isActive("/dashboard/clients")}
            aria-controls="clients-panel"
          >
            <span>My Delhi Agent Clients</span>
          </Link>
          <Link
            to="/dashboard/inquiry"
            className={`tab-button ${isActive("/dashboard/inquiry") ? "active" : ""}`}
            role="tab"
            aria-selected={isActive("/dashboard/inquiry")}
            aria-controls="inquiry-panel"
          >
            <span>Property Inquiry</span>
          </Link>
        </nav>

        {/* Tab Content Container */}
        <div className="tab-content-container">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
