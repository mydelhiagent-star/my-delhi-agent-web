"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import "./Dashboard.css"
import MyClients from "../components/Dashboard/MyClients"
import MyProperties from "../components/Dashboard/MyProperties"
import PostProperty from "../components/Dashboard/PostProperty"

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("post")
  const location = useLocation()
  const navigate = useNavigate()

  // Sync URL with active tab
  useEffect(() => {
    const path = location.pathname
    if (path.includes('/properties')) {
      setActiveTab('properties')
    } else if (path.includes('/clients')) {
      setActiveTab('clients')
    } else {
      setActiveTab('post')
    }
  }, [location.pathname])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    // Update URL based on tab
    if (tab === 'properties') {
      navigate('/dashboard')
    } else if (tab === 'clients') {
      navigate('/dashboard')
    } else {
      navigate('/dashboard')
    }
  }

  const handleKeyDown = (e, tab) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      setActiveTab(tab)
    }

    // Arrow key navigation
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault()
      const tabs = ["post", "properties", "clients"]
      const currentIndex = tabs.indexOf(activeTab)
      let newIndex

      if (e.key === "ArrowLeft") {
        newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1
      } else {
        newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0
      }

      setActiveTab(tabs[newIndex])
    }
  }

  const handleLogout = () => {
    // Logout logic would be handled here
    console.log("Logout clicked")
  }

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
        <button
            className={`tab-button ${activeTab === "post" ? "active" : ""}`}
            onClick={() => handleTabChange("post")}
            onKeyDown={(e) => handleKeyDown(e, "post")}
            role="tab"
            aria-selected={activeTab === "post"}
            aria-controls="post-panel"
            tabIndex={activeTab === "post" ? 0 : -1}
          >
            <span>Post Property</span>
          </button>
          <button
            className={`tab-button ${activeTab === "properties" ? "active" : ""}`}
            onClick={() => handleTabChange("properties")}
            onKeyDown={(e) => handleKeyDown(e, "properties")}
            role="tab"
            aria-selected={activeTab === "properties"}
            aria-controls="properties-panel"
            tabIndex={activeTab === "properties" ? 0 : -1}
          >
            <span>My Properties</span>
          </button>
          <button
            className={`tab-button ${activeTab === "clients" ? "active" : ""}`}
            onClick={() => handleTabChange("clients")}
            onKeyDown={(e) => handleKeyDown(e, "clients")}
            role="tab"
            aria-selected={activeTab === "clients"}
            aria-controls="clients-panel"
            tabIndex={activeTab === "clients" ? 0 : -1}
          >
            <span>My Clients</span>
          </button>
        </nav>

        {/* Tab Content Container */}
        <div className="tab-content-container">
          {activeTab === "post" && (
            <div id="post-panel" role="tabpanel" aria-labelledby="post-tab">
              <PostProperty />
            </div>
          )}
          {activeTab === "properties" && (
            <div id="properties-panel" role="tabpanel" aria-labelledby="properties-tab">
              <MyProperties />
            </div>
          )}
          {activeTab === "clients" && (
            <div id="clients-panel" role="tabpanel" aria-labelledby="clients-tab">
              <MyClients />
            </div>
          )}
        </div>
      </main>
    </div>
  )}

export default Dashboard
