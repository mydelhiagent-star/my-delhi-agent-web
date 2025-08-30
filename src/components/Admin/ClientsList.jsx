import React, { useState, useEffect } from "react";
import "./ClientsList.css";
import { API_ENDPOINTS } from "../../config/api";

export default function ClientsList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [clientProperties, setClientProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_ENDPOINTS.LEADS_SEARCH}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }

      const data = await response.json();
      setClients(Array.isArray(data.leads) ? data.leads : []);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (client) => {
    console.log("Selected client for view:", client);
    setSelectedClient(client);
    setShowClientModal(true);
    
    if (client.properties && client.properties.length > 0) {
      await fetchClientProperties(client.id);
    }
  };

  const fetchClientProperties = async (id) => {
    try{
      setLoadingProperties(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_ENDPOINTS.LEADS}${id}/property-details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if(response.ok)
      {
        const data = await response.json();
        data != null ? setClientProperties(data) : setClientProperties([]);
      }
      else
      {
        console.error("Error fetching client properties:", response.status);
        setClientProperties([]);
      }
    }
    catch(error)
    {
      console.error("Error fetching client properties:", error);
      setLoadingProperties(false);
      setClientProperties([]);
    }
    finally{
      setLoadingProperties(false);
    }
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

        if (response.ok) {
          setClients(clients.filter(c => c.id !== clientId));
          alert("Client deleted successfully!");
        } else {
          throw new Error("Failed to delete client");
        }
      } catch (error) {
        console.error("Error deleting client:", error);
        alert("Failed to delete client");
      }
    }
  };

  const handleEditSave = async () => {
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
          phone: editingClient.phone,
          email: editingClient.email,
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

  if (loading) {
    return <div className="clients-loading">Loading clients...</div>;
  }

  return (
    <div className="clients-container">
      <h3 className="clients-title">All Clients</h3>
      
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
            {clients.map((client) => (
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
                <h4>Properties</h4>
                
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
                          <b>Price:</b> ₹{property.price}
                        </p>
                        <p className="property-detail">
                          <b>Nearest Landmark:</b> {property.nearest_landmark}
                        </p>
                        {property.status && (
                          <p className="property-status">
                            Status: {property.status}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-properties">No property details found</div>
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
                <input
                  type="email"
                  placeholder="Email"
                  value={editingClient.email || ""}
                  onChange={(e) => setEditingClient({
                    ...editingClient,
                    email: e.target.value
                  })}
                />
                <textarea
                  placeholder="Requirement"
                  value={editingClient.requirement || ""}
                  onChange={(e) => setEditingClient({
                    ...editingClient,
                    requirement: e.target.value
                  })}
                />
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