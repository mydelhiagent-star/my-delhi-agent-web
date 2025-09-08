"use client"

import { useState, useEffect } from "react"
import "./MyClients.css"
import { API_ENDPOINTS } from "../../config/api"

const MyClients = () => {
  const [clients, setClients] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const [selectedClient, setSelectedClient] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    setIsLoading(true)
    setError("")
    try {
      const response = await fetch(API_ENDPOINTS.LEADS_DEALER, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })

      const result = await response.json()

      if (result.success) {
        setClients(result.data || [])
      } else {
        setError(result.message || 'Failed to fetch clients')
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
      setError('Failed to load clients. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewClient = (client) => {
    setSelectedClient(client)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedClient(null)
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

  if (isLoading) {
    return (
      <div className="my-clients-container">
        <div className="clients-header">
          <h2>My Clients</h2>
          <p>Manage your client relationships</p>
        </div>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading clients...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="my-clients-container">
        <div className="clients-header">
          <h2>My Clients</h2>
          <p>Manage your client relationships</p>
        </div>
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Clients</h3>
          <p>{error}</p>
          <button onClick={fetchClients} className="btn-retry">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="my-clients-container">
      <div className="clients-header">
        <h2>My Clients</h2>
        <p>Manage your client relationships</p>
      </div>

      {clients.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No Clients Found</h3>
          <p>You don't have any clients yet. Start by adding clients to your properties.</p>
        </div>
      ) : (
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
                <div className={`client-status-badge ${getStatusColor('active')}`}>
                  {getStatusIcon('active')}
                  <span>Active</span>
                </div>
              </div>
            </div>

            {/* <div className="client-details">
              <div className="detail-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>{client.phone}</span>
              </div> */}

              {client.requirement && (
                <div className="detail-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9,22 9,12 15,12 15,22" />
                  </svg>
                  <span>{client.requirement}</span>
                </div>
              )}

              {/* {client.aadhar_number && (
                <div className="detail-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <circle cx="12" cy="16" r="1" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>Aadhar: {client.aadhar_number}</span>
                </div>
              )}
            </div> */}

            {/* <div className="client-properties">
              <h4>Interested Properties ({client.properties?.length || 0})</h4>
             
            </div> */}
              
              <div className="client-actions">
              <button className="action-btn primary" onClick={() => handleViewClient(client)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                  View Details
                </button>

              {/* <button className="action-btn secondary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Contact
              </button> */}
              </div>
            </div>
          ))}
        </div>
      )}

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
                  <div className={`client-status-badge ${getStatusColor('active')}`}>
                    {getStatusIcon('active')}
                    <span>Active</span>
                  </div>
                </div>
            </div>

              <div className="client-detail-grid">
                {/* <div className="detail-section"> */}
                  {/* <h5>Contact Information</h5> */}
                  {/* <div className="detail-list"> */}
                    {/* <div className="detail-row">
                      <span className="label">Phone:</span>
                      <span className="value">{selectedClient.phone}</span>
                    </div> */}
                    {/* {selectedClient.aadhar_number && (
                      <div className="detail-row">
                        <span className="label">Aadhar Number:</span>
                        <span className="value">{selectedClient.aadhar_number}</span>
                      </div>
                    )} */}
                    {/* <div className="detail-row">
                      <span className="label">Client ID:</span>
                      <span className="value">{selectedClient.id}</span>
                    </div> */}
                  {/* </div> */}
                {/* </div> */}

                <div className="detail-section">
                  <h5>Client Information</h5>
                  <div className="detail-list">
                    {selectedClient.requirement && (
                      <div className="detail-row">
                        <span className="label">Requirement:</span>
                        <span className="value">{selectedClient.requirement}</span>
                      </div>
                    )}
                    <div className="detail-row">
                      <span className="label">Properties Count:</span>
                      <span className="value">{selectedClient.properties?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="detail-section full-width">
                <h5>Interested Properties</h5>
                <div className="properties-grid">
                  {selectedClient.properties && selectedClient.properties.length > 0 ? (
                    selectedClient.properties.map((property, index) => (
                      <div key={index} className="property-card">
                        <div className="property-image">
                          {property.photos && property.photos.length > 0 ? (
                            <img 
                              src={property.photos[0]} 
                              alt={property.title || 'Property'} 
                              className="property-img"
                            />
                          ) : (
                            <div className="no-image">
                              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <polyline points="21,15 16,10 5,21"/>
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        <div className="property-content">
                          <h6 className="property-title">
                            {property.title || 'Property'}
                          </h6>
                          
                          <div className="property-details">
                            <div className="property-status">
                              <span className={`status-badge ${property.status}`}>
                                {property.status}
                              </span>
                            </div>
                            
                            {property.note && (
                              <div className="property-note">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                  <polyline points="14,2 14,8 20,8"/>
                                  <line x1="16" y1="13" x2="8" y2="13"/>
                                  <line x1="16" y1="17" x2="8" y2="17"/>
                                </svg>
                                <span>{property.note}</span>
                              </div>
                            )}
                          </div>
                          
                          {/* <div className="property-actions">
                            <button className="btn-view-property">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                              </svg>
                              View Property
                            </button>
                          </div> */}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-properties">
                      <div className="no-properties-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                          <polyline points="9,22 9,12 15,12 15,22"/>
                        </svg>
                      </div>
                      <h4>No Properties Assigned</h4>
                      <p>This client hasn't been assigned to any properties yet.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* <div className="modal-actions">
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
                  </div> */}
              </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyClients
