import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PropertiView.css";

export default function PropertiView() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [showOwner, setShowOwner] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:8080/properties/dealer/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }

        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  const toggleOwner = (index) => {
    setShowOwner((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleDelete = (property, e) => {
    e.stopPropagation();
    setSelectedProperty(property);
    setModalType("delete");
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedProperty) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:8080/properties/dealer/${selectedProperty.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setProperties(prevProperties => 
          prevProperties.filter(property => property.id !== selectedProperty.id)
        );
        alert('Property deleted successfully');
        closeModal();
      } else {
        alert(result.message || 'Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewClients = (property, e) => {
    e.stopPropagation();
    setSelectedProperty(property);
    setModalType("viewClients");
    setShowModal(true);
  };

  const handlePreview = (property, e) => {
    e.stopPropagation();
    const previewUrl = `/preview/${property.id}`;
    window.open(previewUrl, "_blank", "noopener,noreferrer");
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProperty(null);
    setModalType("");
  };

  return (
    <div className="property-view-container">
      <h2 className="property-view-title">
        Property Listings
      </h2>

      <div className="property-view-grid">
        {properties.map((prop, index) => (
          <div key={index} className="property-view-card">
            {/* Carousel */}
            <div className="property-view-carousel">
              <div className="property-view-carousel-content">
                {prop.photos && prop.photos.map((photo, i) => (
                  <img
                    key={i}
                    src={photo}
                    alt={`Property ${i}`}
                  />
                ))}
                {prop.videos && prop.videos.map((video, i) => (
                  <video key={i} controls>
                    <source src={video} type="video/mp4" />
                  </video>
                ))}
              </div>
            </div>

            {/* Property Details */}
            <div className="property-view-details">
              <h3 className="property-view-card-title">{prop.title}</h3>
              <p className="property-view-description">{prop.description}</p>
              <p className="property-view-info">
                <b>Address:</b> {prop.address}
              </p>
              <p className="property-view-info">
                <b>Nearest Landmark:</b> {prop.nearest_landmark}
              </p>
              <p className="property-view-price">
                ₹{prop.price ? prop.price.toLocaleString() : 'Price not available'}
              </p>

              {/* Owner Details */}
              {showOwner[index] ? (
                <div className="property-view-owner">
                  <p>
                    <b>Owner:</b> {prop.owner_name}
                  </p>
                  <p>
                    <b>Phone:</b> {prop.owner_phone}
                  </p>
                </div>
              ) : null}

              {/* Action Buttons */}
              <div className="property-view-actions">
                <button
                  className="property-view-action-btn toggle-btn"
                  onClick={() => toggleOwner(index)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  {showOwner[index] ? "Hide Details" : "Show Owner"}
                </button>

                <button
                  className="property-view-action-btn preview-btn"
                  onClick={(e) => handlePreview(prop, e)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Preview
                </button>

                <button
                  className="property-view-action-btn clients-btn"
                  onClick={(e) => handleViewClients(prop, e)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  View Clients
                </button>

                <button
                  className="property-view-action-btn delete-btn"
                  onClick={(e) => handleDelete(prop, e)}
                >
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

      {/* Modals */}
      {showModal && (
        <div className="property-view-modal-overlay" onClick={closeModal}>
          <div className="property-view-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="property-view-modal-header">
              <h3>
                {modalType === "delete" && "Delete Property"}
                {modalType === "viewClients" && "Property Clients"}
              </h3>
              <button
                className="property-view-modal-close"
                onClick={closeModal}
                aria-label="Close modal"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <div className="property-view-modal-content">
              {modalType === "delete" && (
                <div className="property-view-delete-confirmation">
                  <p>
                    Are you sure you want to delete "{selectedProperty?.title}"?
                  </p>
                  <p className="property-view-warning-text">This action cannot be undone.</p>
                  <div className="property-view-modal-actions">
                    <button className="property-view-btn-cancel" onClick={closeModal}>
                      Cancel
                    </button>
                    <button 
                      className="property-view-btn-delete" 
                      onClick={confirmDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <svg className="property-view-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                          </svg>
                          Deleting...
                        </>
                      ) : (
                        'Delete Property'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {modalType === "viewClients" && (
                <div className="property-view-clients-list">
                  {selectedProperty?.clients && selectedProperty.clients.length > 0 ? (
                    <div className="property-view-clients-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Client Name</th>
                            <th>Phone</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedProperty.clients.map((client, index) => (
                            <tr key={index}>
                              <td>{client.name || client}</td>
                              <td>{client.phone || 'N/A'}</td>
                              <td>
                                <span className="property-view-client-status active">
                                  Active
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="property-view-no-clients">
                      No clients assigned to this property yet.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
