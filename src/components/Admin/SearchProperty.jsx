import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchProperty.css";
import { API_ENDPOINTS } from "../../config/api";
import PropertyPreview from "../PropertyPreview/PropertyPreview";

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function SearchProperty({ properties = [], onPropertyConverted }) {
  const [showDetails, setShowDetails] = useState({});
  const navigate = useNavigate();
  const [previewProperty, setPreviewProperty] = useState(null);
  // Inline add-client per-card state
  const [addClientOpen, setAddClientOpen] = useState({});
  const [inlinePhone, setInlinePhone] = useState({});
  const [inlineSearching, setInlineSearching] = useState({});
  const [inlineProcessing, setInlineProcessing] = useState({});
  const [inlineError, setInlineError] = useState({});
  const [inlineNotFound, setInlineNotFound] = useState({});

  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [propertyClients, setPropertyClients] = useState([]);

  // Dummy data for clients linked to properties
  const getClients = async (propertyId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_ENDPOINTS.LEADS_SEARCH}?property_id=${propertyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        const leads = Array.isArray(result.data) ? result.data : [];
        setPropertyClients(leads);
      } else {
        console.error("Failed to fetch clients:", result.message);
        setPropertyClients([]);
      }
    } catch (error) {
      console.error("Error fetching property clients:", error);
      setPropertyClients([]);
    }
  };

  const toggleDetails = (id) => {
    setShowDetails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const openClientModal = (property) => {
    setSelectedProperty(property);
    setClientModalOpen(true);
    getClients(property._id || property.id);
  };

  const closeClientModal = () => {
    setClientModalOpen(false);
    setSelectedProperty(null);
  };

  const changeClientStatus = async (propertyId, clientId, currentStatus, newStatus) => {
    if (currentStatus === newStatus) return;
    const confirmChange = window.confirm(`Are you sure you want to change status from "${currentStatus}" to "${newStatus}"?`);
    if (!confirmChange) return;

    let sellingPrice = undefined;
    if (newStatus === "converted") {
      const input = window.prompt("Enter the selling price for this conversion (numbers only):");
      if (input === null) {
        return; // user cancelled
      }
      const normalized = input.replace(/[^0-9.]/g, "");
      const priceValue = Number(normalized);
      if (!Number.isFinite(priceValue) || priceValue <= 0) {
        alert("Please enter a valid selling price.");
        return;
      }
      sellingPrice = priceValue;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_ENDPOINTS.LEADS_ADMIN}${clientId}/properties/${propertyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
            ...(sellingPrice !== undefined ? { sold_price: sellingPrice } : {}),
          }),
        }
      );
      const result = await response.json();

      if (result.success) {
        alert("Client status changed successfully");
        setPropertyClients((prevClients) =>
          prevClients.map((client) =>
            client.id === clientId
              ? {
                  ...client,
                  properties: client.properties.map((prop) =>
                    prop.property_id === propertyId
                      ? { ...prop, status: newStatus, ...(sellingPrice !== undefined ? { selling_price: sellingPrice } : {}) }
                      : prop
                  ),
                }
              : client
          )
        );
        if(newStatus === "converted" || newStatus === "closed") {
          if(newStatus === "converted" && onPropertyConverted) {
            onPropertyConverted(propertyId);
          }
          closeClientModal()
        }
      } else {
        alert(result.message || "Failed to change client status");
      }
    } catch (error) {
      console.error("Error changing client status:", error);
    }
  };

  const attachPropertyToClient = async (client, property) => {
    if (!client) return;
    const pid = property._id || property.id;
    try {
      setInlineProcessing((prev) => ({ ...prev, [pid]: true }));
      const body = {
        property_id: property._id,
        dealer_id: property.dealer_id,
      };
      const response = await fetch(
        `${API_ENDPOINTS.LEADS_ADMIN}${client.id}/properties`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(body),
        }
      );
      const result = await response.json();

      if (result.success) {
        alert(result.message || "Property added to client");
        setAddClientOpen((prev) => ({ ...prev, [pid]: false }));
        setInlinePhone((prev) => ({ ...prev, [pid]: "" }));
        setInlineNotFound((prev) => ({ ...prev, [pid]: false }));
      } else {
        alert(result.message || "Failed to add property to client");
      }
    } catch (err) {
      console.error("Attach property error:", err);
      alert("Failed to add property. Please try again.");
    } finally {
      setInlineProcessing((prev) => ({ ...prev, [pid]: false }));
    }
  };

  const toggleInlineAddClient = (id) => {
    setAddClientOpen((prev) => ({ ...prev, [id]: !prev[id] }));
    setInlineError((prev) => ({ ...prev, [id]: "" }));
    setInlineNotFound((prev) => ({ ...prev, [id]: false }));
  };

  // Handle inline phone input (no auto-search)
  const handleInlinePhoneChange = (property, value) => {
    const pid = property._id || property.id;
    const clean = value.replace(/\D/g, "");
    if (clean.length <= 10) {
      setInlinePhone((prev) => ({ ...prev, [pid]: clean }));
      setInlineError((prev) => ({ ...prev, [pid]: "" }));
      setInlineNotFound((prev) => ({ ...prev, [pid]: false }));
    }
  };

  // Manual search trigger via button
  const searchInlineAndAttach = async (property) => {
    const pid = property._id || property.id;
    const phone = (inlinePhone[pid] || "").trim();
    setInlineError((prev) => ({ ...prev, [pid]: "" }));
    setInlineNotFound((prev) => ({ ...prev, [pid]: false }));
    if (phone.length !== 10) {
      setInlineError((prev) => ({
        ...prev,
        [pid]: "Enter a valid 10-digit phone number",
      }));
      return;
    }
    setInlineSearching((prev) => ({ ...prev, [pid]: true }));
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_ENDPOINTS.LEADS}?phone=${phone}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await response.json();

      if (result.success) {
        if (result.data && result.data.length > 0) {
          await attachPropertyToClient(result.data[0], property);
        } else {
          setInlineNotFound((prev) => ({ ...prev, [pid]: true }));
        }
      } else {
        setInlineError((prev) => ({
          ...prev,
          [pid]: "Error searching for client",
        }));
      }
    } catch (err) {
      console.error("Inline client search error:", err);
      setInlineError((prev) => ({
        ...prev,
        [pid]: "Failed to search for client",
      }));
    } finally {
      setInlineSearching((prev) => ({ ...prev, [pid]: false }));
    }
  };

  return (
    <div className="search-property-container">
      <h2 className="search-property-title">Property Listings</h2>

      {/* Removed top client search as per requirement */}

      {properties.length === 0 ? (
        <p className="search-property-empty">No properties found.</p>
      ) : (
        <div className="search-property-grid">
          {properties.map((prop) => (
            <div key={prop.id || prop._id} className="search-property-card">
              {/* Carousel */}
              <div
                className="search-property-carousel"
                onClick={() => setPreviewProperty(prop)}
                style={{ cursor: "pointer" }}
              >
                <div className="search-property-carousel-content">
                  {prop.photos &&
                    prop.photos.map((photo, i) => (
                      <img key={i} src={photo} alt={`Property ${i}`} />
                    ))}
                  {prop.videos &&
                    prop.videos.map((video, i) => (
                      <video key={i} controls>
                        <source src={video} type="video/mp4" />
                      </video>
                    ))}
                </div>
              </div>

              {/* Property Details */}
              <div
                className="search-property-details"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <h3
                  className="search-property-card-title"
                  onClick={() => setPreviewProperty(prop)}
                  style={{ cursor: "pointer" }}
                >
                  Property Number: {prop.property_number}
                </h3>
                <p className="search-property-info">
                  <b>Title:</b> {prop.title}
                </p>

                <p className="search-property-info">
                  <b>Nearest Landmark:</b> {prop.nearest_landmark}
                </p>

                {/* Hidden Price */}
                {showDetails[prop.id || prop._id] && (
                  <p className="search-property-price">
                    ₹{prop.min_price.toLocaleString()} - ₹{prop.max_price.toLocaleString()}
                  </p>
                )}

                {/* Owner Details */}
                {showDetails[prop.id || prop._id] && (
                  <div className="search-property-owner">
                    <p>
                      <b>Owner:</b> {prop.owner_name}
                    </p>
                    <p>
                      <b>Phone:</b> {prop.owner_phone}
                    </p>
                  </div>
                )}

                <div className="search-property-buttons">
                  {/* Add Client Button */}
                  <button
                    className="search-property-add-client-btn"
                    onClick={() => toggleInlineAddClient(prop._id || prop.id)}
                  >
                    Add Client
                  </button>
                  {addClientOpen[prop._id || prop.id] && (
                    <div className="client-inline-add">
                      <label className="client-search-label">
                        Client Phone
                      </label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        className="client-search-input"
                        placeholder="Enter phone number"
                        value={inlinePhone[prop._id || prop.id] || ""}
                        onChange={(e) =>
                          handleInlinePhoneChange(prop, e.target.value)
                        }
                      />
                      <button
                        className="search-property-add-client-btn"
                        onClick={() => searchInlineAndAttach(prop)}
                        disabled={
                          inlineSearching[prop._id || prop.id] ||
                          inlineProcessing[prop._id || prop.id]
                        }
                      >
                        {inlineSearching[prop._id || prop.id]
                          ? "Searching..."
                          : inlineProcessing[prop._id || prop.id]
                          ? "Adding..."
                          : "Search"}
                      </button>
                      {inlineSearching[prop._id || prop.id] && (
                        <div className="client-search-loading">
                          Searching...
                        </div>
                      )}
                      {inlineProcessing[prop._id || prop.id] && (
                        <div className="client-search-loading">Adding...</div>
                      )}
                      {inlineError[prop._id || prop.id] && (
                        <div className="client-search-loading">
                          {inlineError[prop._id || prop.id]}
                        </div>
                      )}
                      {inlineNotFound[prop._id || prop.id] && (
                        <div className="client-search-loading">
                          Client not found
                        </div>
                      )}
                    </div>
                  )}

                  {/* View Client Button */}
                  <button
                    className="search-property-view-client-btn"
                    onClick={() => openClientModal(prop)}
                  >
                    View Clients
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Client List Modal */}
      {clientModalOpen && selectedProperty && (
        <div className="modal-overlay" onClick={closeClientModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                Clients for {selectedProperty.title}
              </h3>
              <button className="modal-close-btn" onClick={closeClientModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="client-table-container">
                <table className="client-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {propertyClients.map((client) => (
                      <tr key={client.id}>
                        <td>{client.name}</td>
                        <td>{client.phone}</td>
                        <td>{formatDate(client.properties[0].created_at)}</td>
                        <td>
                          <span
                            className={`status-badge status-${client.properties[0].status}`}
                          >
                            {client.properties[0].status}
                          </span>
                        </td>
                        <td className="status-actions">
                          <select
                            value={client.properties[0].status}
                            onChange={(e) => {
                              const propertyId = selectedProperty._id || selectedProperty.id;
                              const current = client.properties[0].status;
                              const next = e.target.value;
                              changeClientStatus(propertyId, client.id, current, next);
                            }}
                            className="status-dropdown"
                          >
                            <option value="view">View</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="closed">Closed</option>
                            <option value="converted">Converted</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      {previewProperty && (
        <PropertyPreview
          property={previewProperty}
          onClose={() => setPreviewProperty(null)}
        />
      )}
    </div>
  );
}
