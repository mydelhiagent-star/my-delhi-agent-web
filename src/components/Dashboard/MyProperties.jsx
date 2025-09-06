"use client"

import { useState } from "react"
import "./MyProperties.css"

const MyProperties = () => {
  const [properties] = useState([
    {
      id: 1,
      title: "Modern Downtown Apartment",
      location: "123 Main St, Downtown",
      price: 450000,
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      status: "active",
      images: ["/modern-apartment.png"],
      clients: ["John Doe", "Jane Smith"],
    },
    {
      id: 2,
      title: "Luxury Family Home",
      location: "456 Oak Ave, Suburbs",
      price: 750000,
      bedrooms: 4,
      bathrooms: 3,
      area: 2500,
      status: "pending",
      images: ["/luxury-family-home-exterior.jpg"],
      clients: ["Mike Johnson"],
    },
  ])

  const [selectedProperty, setSelectedProperty] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("")

  const handleEdit = (property) => {
    setSelectedProperty(property)
    setModalType("edit")
    setShowModal(true)
  }

  const handleDelete = (property) => {
    setSelectedProperty(property)
    setModalType("delete")
    setShowModal(true)
  }

  const handleAddClient = (property) => {
    setSelectedProperty(property)
    setModalType("addClient")
    setShowModal(true)
  }

  const handleViewClients = (property) => {
    setSelectedProperty(property)
    setModalType("viewClients")
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedProperty(null)
    setModalType("")
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "status-active"
      case "pending":
        return "status-pending"
      case "sold":
        return "status-sold"
      default:
        return "status-active"
    }
  }

  return (
    <div className="my-properties-container">
      <div className="properties-header">
        <h2>My Properties</h2>
        <p>Manage your property listings</p>
      </div>

      <div className="properties-grid">
        {properties.map((property) => (
          <div key={property.id} className="property-card">
            {/* Property Images Section */}
            <div className="property-images-section">
              <div className="property-media">
                <div className="media-carousel">
                  {property.images && property.images.length > 0 ? (
                    property.images.map((image, index) => (
                      <img
                        key={index}
                        src={image || "/placeholder.svg"}
                        alt={`${property.title} - Image ${index + 1}`}
                        className="property-image"
                      />
                    ))
                  ) : (
                    <div className="no-image-placeholder">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21,15 16,10 5,21"/>
                      </svg>
                      <span>No Images</span>
                    </div>
                  )}
                </div>
                <div className={`status-chip ${getStatusColor(property.status)}`}>
                  {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="property-details">
              <h3 className="property-title">{property.title}</h3>
              <p className="property-location">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {property.location}
              </p>

              <div className="property-specs">
                <div className="spec-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9,22 9,12 15,12 15,22" />
                  </svg>
                  <span>{property.bedrooms} bed</span>
                </div>
                <div className="spec-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
                    <line x1="10" y1="5" x2="8" y2="7" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <line x1="7" y1="19" x2="7" y2="21" />
                    <line x1="17" y1="19" x2="17" y2="21" />
                  </svg>
                  <span>{property.bathrooms} bath</span>
                </div>
                <div className="spec-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M9 9h6v6H9z" />
                  </svg>
                  <span>{property.area.toLocaleString()} sq ft</span>
                </div>
              </div>

              <div className="property-price">{formatPrice(property.price)}</div>

              {/* Action Buttons */}
              <div className="property-actions">
                <button className="action-btn primary" onClick={() => handleEdit(property)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit
                </button>

                <button className="action-btn secondary" onClick={() => handleAddClient(property)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" />
                    <line x1="22" y1="11" x2="16" y2="11" />
                  </svg>
                  Add Client
                </button>

                <button className="action-btn secondary" onClick={() => handleViewClients(property)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  View Clients ({property.clients.length})
                </button>

                <button className="action-btn danger" onClick={() => handleDelete(property)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3,6 5,6 21,6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {modalType === "edit" && "Edit Property"}
                {modalType === "delete" && "Delete Property"}
                {modalType === "addClient" && "Add Client"}
                {modalType === "viewClients" && "Property Clients"}
              </h3>
              <button className="modal-close" onClick={closeModal} aria-label="Close modal">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="modal-content">
              {modalType === "delete" && (
                <div className="delete-confirmation">
                  <p>Are you sure you want to delete "{selectedProperty?.title}"?</p>
                  <p className="warning-text">This action cannot be undone.</p>
                  <div className="modal-actions">
                    <button className="btn-cancel" onClick={closeModal}>
                      Cancel
                    </button>
                    <button className="btn-delete">Delete Property</button>
                  </div>
                </div>
              )}

              {modalType === "viewClients" && (
                <div className="clients-list">
                  {selectedProperty?.clients.length > 0 ? (
                    <div className="clients-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Client Name</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedProperty.clients.map((client, index) => (
                            <tr key={index}>
                              <td>{client}</td>
                              <td>
                                <span className="client-status active">Active</span>
                              </td>
                              <td>
                                <button className="table-action-btn">Contact</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="no-clients">No clients assigned to this property yet.</p>
                  )}
                </div>
              )}

              {(modalType === "edit" || modalType === "addClient") && (
                <div className="form-placeholder">
                  <p>Form content would go here for {modalType} functionality.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyProperties
