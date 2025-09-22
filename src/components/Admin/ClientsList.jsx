import React, { useState, useEffect } from "react";
import "./ClientsList.css";
import { API_ENDPOINTS } from "../../config/api";

export default function ClientsList() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [clientProperties, setClientProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [adminNotes, setAdminNotes] = useState({}); // propertyId -> note
  const [adminNotesDraft, setAdminNotesDraft] = useState({}); // un-saved edits per property
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchClients();
  }, []);

  // Load admin notes from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("propertyAdminNotes");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          setAdminNotes(parsed);
        }
      }
    } catch (_) {}
  }, []);

  // Handle search and filter
  useEffect(() => {
    let filtered = clients;

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(client => {
        if (!client.properties || client.properties.length === 0) {
          return false;
        }
        return client.properties.some(property => property.status === statusFilter);
      });
    }

    setFilteredClients(filtered);
  }, [clients, searchTerm, statusFilter]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_ENDPOINTS.LEADS}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setClients(Array.isArray(result.data) ? result.data : []);
      } else {
        console.error("Failed to fetch clients:", result.message);
        setClients([]);
        alert(result.message || "Failed to fetch clients");
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      setClients([]);
      alert("Failed to fetch clients. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (client) => {
    console.log("Selected client for view:", client);
    setSelectedClient(client);
    setShowClientModal(true);
    
    if (client.properties && client.properties.length > 0) {
      await fetchClientProperties(client.id, statusFilter);
    }
  };

  const getPropertyKey = (property) => {
    if (!property) return undefined;
    const candidates = [
      property.property_id,
      property.propertyId,
      property._id,
      property.id,
      property.property_number,
    ];
    const key = candidates.find((v) => v !== undefined && v !== null && String(v).trim() !== "");
    return key !== undefined ? String(key) : undefined;
  };

  const getAdminNote = (property) => {
    const key = getPropertyKey(property);
    if (!key) return "";
    return adminNotes && Object.prototype.hasOwnProperty.call(adminNotes, key)
      ? adminNotes[key] || ""
      : "";
  };

  const getAdminNoteDraft = (property) => {
    const key = getPropertyKey(property);
    if (!key) return "";
    if (adminNotesDraft && Object.prototype.hasOwnProperty.call(adminNotesDraft, key)) {
      return adminNotesDraft[key] ?? "";
    }
    // fallback to saved note if draft not created yet
    return getAdminNote(property);
  };

  const setAdminNoteDraft = (property, value) => {
    const key = getPropertyKey(property);
    if (!key) return;
    setAdminNotesDraft((prev) => ({ ...(prev || {}), [key]: value }));
  };

  const setAdminNote = async (property, value) => {
    const key = getPropertyKey(property);
    if (!key) return;
    
    // Get client ID from selected client
    const clientId = selectedClient?.id;
    if (!clientId) {
      console.error("No client selected for saving note");
      return;
    }
    
    try {
      // Save to backend first
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_ENDPOINTS.LEADS_ADMIN}${clientId}/properties/${key}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ note: value, status: "ongoing" }),
      });
      
      const result = await response.json();

      if (result.success) {
        setAdminNotes((prev) => ({ ...(prev || {}), [key]: value }));
      
        // Keep draft in sync after save
        setAdminNotesDraft((prev) => ({ ...(prev || {}), [key]: value }));
        alert("Note saved successfully!");
      } else {
        alert(result.message || "Failed to save note to backend. Please try again.");
      }
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Error saving note. Please try again.");
    }
  };

  const fetchClientProperties = async (id, status) => {
    try {
      setLoadingProperties(true);
      const token = localStorage.getItem("token");
      
      // Build URL with status filter if not "all"
      let url = `${API_ENDPOINTS.LEADS}${id}/property-details`;
      if (status !== "all") {
        url += `?status=${status}`;
      }
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setClientProperties(Array.isArray(result.data) ? result.data : []);
      } else {
        console.error("Error fetching client properties:", result.message);
        setClientProperties([]);
        alert(result.message || "Failed to fetch client properties");
      }
    } catch (error) {
      console.error("Error fetching client properties:", error);
      setClientProperties([]);
      alert("Failed to fetch client properties. Please try again.");
    } finally {
      setLoadingProperties(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
  };

  const handleEdit = (client) => {
    setEditingClient({ ...client });
  };

  const handleDelete = async (clientId) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_ENDPOINTS.LEADS_ADMIN}${clientId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (result.success) {
          setClients(clients.filter(c => c.id !== clientId));
          alert("Client deleted successfully!");
        } else {
          alert(result.message || "Failed to delete client");
        }
      } catch (error) {
        console.error("Error deleting client:", error);
        alert("Failed to delete client");
      }
    }
  };

  const handleEditSave = async () => {
    if (!editingClient) return;
    if (!editingClient.name.trim()) {
      alert("Please enter a valid name");
      return;
    }
    const cleanPhone = editingClient.phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }
  
    if (editingClient.aadhar_number.length !== 12) {
      alert("Please enter a valid aadhar number");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_ENDPOINTS.LEADS_ADMIN}${editingClient.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editingClient.name,
          phone: cleanPhone,
          requirement: editingClient.requirement,
          aadhar_number: editingClient.aadhar_number,
        }),
      });

      if (response.ok) {
        const updatedClients = clients.map(c => 
          c.id === editingClient.id ? editingClient : c
        );
        setClients(updatedClients);
        setEditingClient(null);
        alert("Client updated successfully!");
      } else {
        throw new Error("Failed to update client");
      }
    } catch (error) {
      console.error("Error updating client:", error);
      alert("Failed to update client");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="clients-loading">Loading clients...</div>;
  }

  return (
    <div className="clients-container">
      <h3 className="clients-title">All Clients</h3>
      
      {/* Search and Filter Controls */}
      <div className="search-filter-container">
        {/* Search on the left */}
        <div className="search-container">
          <label htmlFor="client-search" className="search-label">
            Search Clients:
          </label>
          <input
            id="client-search"
            type="text"
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        
        {/* Filter on the right */}
        <div className="status-filter-container">
          <label htmlFor="status-filter" className="status-filter-label">
            Filter by Status:
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            className="status-filter-dropdown"
          >
            <option value="all">All Statuses</option>
            <option value="view">View</option>
            <option value="ongoing">Ongoing</option>
            <option value="closed">Closed</option>
            <option value="converted">Converted</option>
          </select>
        </div>
      </div>
      
      <div className="clients-table-container">
        <table className="clients-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.id} className="client-row">
                <td>{client.name}</td>
                <td>{client.phone}</td>
                <td className="client-actions">
                  <button
                    className="client-btn client-btn-view"
                    onClick={() => handleView(client)}
                  >
                    View
                  </button>
                  <button
                    className="client-btn client-btn-edit"
                    onClick={() => handleEdit(client)}
                  >
                    Edit
                  </button>
                  <button
                    className="client-btn client-btn-delete"
                    onClick={() => handleDelete(client.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Client View Modal */}
      {showClientModal && selectedClient && (
        <div className="client-modal-overlay">
          <div className="client-modal-content">
            <div className="client-modal-header">
              <h3>Client Details</h3>
              <button
                className="client-modal-close"
                onClick={() => {
                  setShowClientModal(false);
                  setClientProperties([]);
                }}
              >
                ✕
              </button>
            </div>
            
            <div className="client-details">
              <div className="client-detail-row">
                <strong>Name:</strong> {selectedClient.name || 'N/A'}
              </div>
              <div className="client-detail-row">
                <strong>Phone:</strong> {selectedClient.phone || 'N/A'}
              </div>
              
              <div className="client-detail-row">
                <strong>Requirement:</strong> {selectedClient.requirement || 'N/A'}
              </div>
              <div className="client-detail-row">
                <strong>Aadhar Number:</strong> {selectedClient.aadhar_number || 'N/A'}
              </div>
            </div>

            {/* Properties Section */}
            {selectedClient.properties && selectedClient.properties.length > 0 && (
              <div className="client-properties">
                <h4>Properties (Filtered by: {statusFilter === "all" ? "All Statuses" : statusFilter})</h4>
                
                {loadingProperties ? (
                  <div className="properties-loading">Loading properties...</div>
                ) : clientProperties.length > 0 ? (
                  <div className="properties-grid">
                    {clientProperties.map((property, index) => (
                      <div key={property.id || index} className="property-card">
                        {/* Carousel - Same as MyProperties */}
                        <div className="property-carousel">
                          <div className="property-carousel-content">
                            {property.photos &&
                              property.photos.map((photo, i) => (
                                <img
                                  key={i}
                                  src={photo}
                                  alt={`Property ${i}`}
                                />
                              ))}
                            {property.videos &&
                              property.videos.map((video, i) => (
                                <video key={i} controls>
                                  <source src={video} type="video/mp4" />
                                </video>
                              ))}
                          </div>
                        </div>

                        {/* Property Details - Same structure as MyProperties */}
                        <h4 className="property-title">{property.title}</h4>
                        <p className="property-description">{property.description}</p>
                        <p className="property-detail">
                          <b>Address:</b> {property.address}
                        </p>
                        <p className="property-detail">
                          <b>Price:</b> ₹{property.min_price} - ₹{property.max_price}
                        </p>
                        <p className="property-detail">
                          <b>Nearest Landmark:</b> {property.nearest_landmark}
                        </p>
                        <p className="property-detail">
                          <b>Date:</b> {formatDate(property.created_at)}
                        </p>
                        {property.status && (
                          <p className="property-status">
                            Status: {property.status}
                          </p>
                        )}

                        {/* Admin Note: editable only if ongoing */}
                        <div style={{ marginTop: 8 }}>
                          {property.status === "ongoing" ? (
                            <div>
                              <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
                                Admin Note (visible to dealer):
                              </label>
                              <textarea
                                className="client-edit-textarea"
                                placeholder="Write a note for this ongoing property..."
                                value={property.note || ""}
                                onChange={(e) => setAdminNoteDraft(property, e.target.value)}
                                rows={3}
                                maxLength="500"
                                style={{ width: "100%" }}
                              />
                              <div style={{ textAlign: "right", fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                                {(property.note || "").length}/500 characters
                              </div>
                              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                                <button
                                  className="client-btn client-btn-edit"
                                  type="button"
                                  onClick={() => setAdminNote(property, getAdminNoteDraft(property))}
                                >
                                  Save Note
                                </button>
                               
                              </div>
                            </div>
                          ) : (
                            (() => {
                              const note = getAdminNote(property);
                              return note ? (
                                <div style={{ marginTop: 6, fontSize: 14 }}>
                                  <b>Admin Note:</b> {note}
                                </div>
                              ) : null;
                            })()
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-properties">No property details found for selected status</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {editingClient && (
        <div className="client-edit-modal-overlay">
          <div className="client-edit-modal-content">
            <div className="client-edit-modal-header">
              <h3>Edit Client</h3>
              <button
                className="client-edit-modal-close"
                onClick={() => setEditingClient(null)}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleEditSave(); }}>
              <div className="client-edit-form">
                <input
                  type="text"
                  placeholder="Name"
                  value={editingClient.name}
                  onChange={(e) => setEditingClient({
                    ...editingClient,
                    name: e.target.value
                  })}
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={editingClient.phone}
                  onChange={(e) => setEditingClient({
                    ...editingClient,
                    phone: e.target.value
                  })}
                  required
                />
               
                <textarea
                  placeholder="Requirement"
                  value={editingClient.requirement || ""}
                  onChange={(e) => setEditingClient({
                    ...editingClient,
                    requirement: e.target.value
                  })}
                  maxLength="500"
                />
                <div style={{ textAlign: "right", fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                  {(editingClient.requirement || "").length}/500 characters
                </div>
                <input
                  type="text"
                  placeholder="Aadhar Number"
                  value={editingClient.aadhar_number || ""}
                  onChange={(e) => setEditingClient({
                    ...editingClient,
                    aadhar_number: e.target.value
                  })}
                />
              </div>
              
              <div className="client-edit-actions">
                <button type="submit" className="client-edit-btn client-edit-btn-save">
                  Save
                </button>
                <button
                  type="button"
                  className="client-edit-btn client-edit-btn-cancel"
                  onClick={() => setEditingClient(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}