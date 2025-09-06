"use client"

import { useState } from "react"
import "./MyClients.css"

const MyClients = () => {
  const [clients] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      status: "active",
      properties: ["Modern Downtown Apartment"],
      joinDate: "2024-01-15",
      budget: 500000,
      preferences: "Downtown, 2+ bedrooms",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@email.com",
      phone: "+1 (555) 987-6543",
      status: "interested",
      properties: ["Modern Downtown Apartment", "Luxury Family Home"],
      joinDate: "2024-02-20",
      budget: 750000,
      preferences: "Family-friendly, good schools",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@email.com",
      phone: "+1 (555) 456-7890",
      status: "pending",
      properties: ["Luxury Family Home"],
      joinDate: "2024-03-10",
      budget: 800000,
      preferences: "Luxury amenities, large lot",
    },
  ])

  const [selectedClient, setSelectedClient] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const handleViewClient = (client) => {
    setSelectedClient(client)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedClient(null)
  }

  const formatBudget = (budget) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(budget)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "status-active"
      case "interested":
        return "status-interested"
      case "pending":
        return "status-pending"
      case "closed":
        return "status-closed"
      default:
        return "status-active"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22,4 12,14.01 9,11.01" />
          </svg>
        )
      case "interested":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        )
      case "pending":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="my-clients-container">
      <div className="clients-header">
        <h2>My Clients</h2>
        <p>Manage your client relationships</p>
      </div>

        <div className="clients-grid">
          {clients.map((client) => (
            <div key={client.id} className="client-card">
            <div className="client-header">
              <div className="client-avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="client-info">
                <h3 className="client-name">{client.name}</h3>
                <div className={`client-status-badge ${getStatusColor(client.status)}`}>
                  {getStatusIcon(client.status)}
                  <span>{client.status.charAt(0).toUpperCase() + client.status.slice(1)}</span>
                </div>
              </div>
            </div>

            <div className="client-details">
              <div className="detail-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>{client.email}</span>
              </div>

              <div className="detail-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>{client.phone}</span>
              </div>

              <div className="detail-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
                <span>Joined {formatDate(client.joinDate)}</span>
              </div>

              <div className="detail-item budget">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                <span>Budget: {formatBudget(client.budget)}</span>
              </div>
            </div>

            <div className="client-properties">
              <h4>Interested Properties ({client.properties.length})</h4>
              <div className="properties-list">
                {client.properties.slice(0, 2).map((property, index) => (
                  <div key={index} className="property-tag">
                    {property}
                  </div>
                ))}
                {client.properties.length > 2 && (
                  <div className="property-tag more">+{client.properties.length - 2} more</div>
                )}
              </div>
              </div>
              
              <div className="client-actions">
              <button className="action-btn primary" onClick={() => handleViewClient(client)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                  View Details
                </button>

              <button className="action-btn secondary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Contact
              </button>
              </div>
            </div>
          ))}
        </div>

      {/* Client Details Modal */}
      {showModal && selectedClient && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Client Details</h3>
              <button className="modal-close" onClick={closeModal} aria-label="Close modal">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <div className="modal-content">
              <div className="client-detail-header">
                <div className="client-avatar large">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <h4>{selectedClient.name}</h4>
                  <div className={`client-status-badge ${getStatusColor(selectedClient.status)}`}>
                    {getStatusIcon(selectedClient.status)}
                    <span>{selectedClient.status.charAt(0).toUpperCase() + selectedClient.status.slice(1)}</span>
              </div>
              </div>
            </div>

              <div className="client-detail-grid">
                <div className="detail-section">
                  <h5>Contact Information</h5>
                  <div className="detail-list">
                    <div className="detail-row">
                      <span className="label">Email:</span>
                      <span className="value">{selectedClient.email}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Phone:</span>
                      <span className="value">{selectedClient.phone}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Join Date:</span>
                      <span className="value">{formatDate(selectedClient.joinDate)}</span>
                    </div>
                          </div>
                        </div>

                <div className="detail-section">
                  <h5>Preferences</h5>
                  <div className="detail-list">
                    <div className="detail-row">
                      <span className="label">Budget:</span>
                      <span className="value budget-value">{formatBudget(selectedClient.budget)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Preferences:</span>
                      <span className="value">{selectedClient.preferences}</span>
                    </div>
                              </div>
                          </div>
                      </div>

              <div className="detail-section full-width">
                <h5>Interested Properties</h5>
                <div className="properties-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Property Name</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedClient.properties.map((property, index) => (
                        <tr key={index}>
                          <td>{property}</td>
                          <td>
                            <span className="property-status active">Viewing</span>
                          </td>
                          <td>
                            <button className="table-action-btn">Schedule Tour</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  Send Email
                </button>
                <button className="btn-secondary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  Call Client
                </button>
                  </div>
              </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyClients
