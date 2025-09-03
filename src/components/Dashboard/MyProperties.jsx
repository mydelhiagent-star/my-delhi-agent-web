import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropertyPreview from "../PropertyPreview/PropertyPreview";
import "./MyProperties.css";
import { API_ENDPOINTS } from "../../config/api";

export default function MyProperties() {
  const [properties, setProperties] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [previewProperty, setPreviewProperty] = useState(null);

  // Add/attach client inline state per property
  // Add client modal
  const [addClientModalOpen, setAddClientModalOpen] = useState(false);
  const [selectedPropertyForAdd, setSelectedPropertyForAdd] = useState(null);
  const [addClientForm, setAddClientForm] = useState({ name: "", phone: "" });
  const [addClientSubmitting, setAddClientSubmitting] = useState(false);
  const [addClientError, setAddClientError] = useState("");

  // View clients modal state
  const [viewClientsModalOpen, setViewClientsModalOpen] = useState(false);
  const [selectedPropertyForView, setSelectedPropertyForView] = useState(null);
  const [propertyClients, setPropertyClients] = useState([]);
  const [editingClient, setEditingClient] = useState(null);
  const [editClientForm, setEditClientForm] = useState({ name: "", phone: "", status: "", note: "" });

  // Dummy data for testing
  const dummyClients = [
    { id: 1, name: "John Doe", phone: "9876543210", status: "marked", note: "Interested in 2BHK" },
    { id: 2, name: "Jane Smith", phone: "9876543211", status: "unmarked", note: "Looking for investment property" },
    { id: 3, name: "Mike Johnson", phone: "9876543212", status: "marked", note: "Budget: 50L-70L" },
    { id: 4, name: "Sarah Wilson", phone: "9876543213", status: "unmarked", note: "First time buyer" }
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINTS.PROPERTIES, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }

        const data = await response.json();
        const apiProperties = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : Array.isArray(data?.properties)
          ? data.properties
          : [];

        setProperties(apiProperties);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleDelete = async (id) => {
    console.log(id);
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${API_ENDPOINTS.PROPERTIES_DEALER}${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete property");
        }
        const updatedProperties = properties.filter((p) => p.id !== id);
        setProperties(updatedProperties);
        alert("Property deleted successfully!");
      } catch (error) {
        console.error("Error deleting property:", error);
        alert("Failed to delete property");
      }
    }
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    const id = editingProperty.id;
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_ENDPOINTS.PROPERTIES_DEALER}${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: editingProperty.title,
        description: editingProperty.description,
        address: editingProperty.address,
        min_price: editingProperty.min_price,
        max_price: editingProperty.max_price,
        nearest_landmark: editingProperty.nearest_landmark,
        photos: editingProperty.photos,
        videos: editingProperty.videos,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to edit property");
    }

    // Update local state with the current editingProperty data
    const updatedProperty = {
      ...editingProperty,
      photos: editingProperty.photos || [], // Use current photos from state
      videos: editingProperty.videos || [], // Use current videos from state
    };

    const updated = properties.map((p) =>
      p.id === editingProperty.id ? updatedProperty : p
    );
    setProperties(updated);
    setEditingProperty(null);
    alert("Property updated successfully!");
  };

  if (loading) {
    return <div>Loading properties...</div>;
  }

  const openAddClientModal = (property) => {
    setSelectedPropertyForAdd(property);
    setAddClientForm({ name: "", phone: "" });
    setAddClientError("");
    setAddClientModalOpen(true);
  };

  const closeAddClientModal = () => {
    setAddClientModalOpen(false);
    setSelectedPropertyForAdd(null);
    setAddClientForm({ name: "", phone: "" });
    setAddClientError("");
  };

 

  const createClientAndAttach = async () => {
    if (!selectedPropertyForAdd) return;
    const { name, phone } = addClientForm;
    const cleanPhone = (phone || "").replace(/\D/g, "");
    if (!name.trim() || cleanPhone.length !== 10) {
      setAddClientError("Enter a valid name and 10-digit phone");
      return;
    }
    setAddClientSubmitting(true);
    setAddClientError("");
    try {
      const token = localStorage.getItem("token");
      // Create client
      const createRes = await fetch(API_ENDPOINTS.DEALER_CLIENTS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name.trim(), phone: cleanPhone, property_id : selectedPropertyForAdd.id, dealer_id : selectedPropertyForAdd.dealer_id }),
      });
      if (!createRes.ok) {
        const err = await createRes.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create client");
      }
      
      closeAddClientModal();
    } catch (e) {
      console.error(e);
      setAddClientError(e.message || "Failed to add client");
    } finally {
      setAddClientSubmitting(false);
    }
  };

  // View clients helpers
  const openViewClientsModal = (property) => {
    setSelectedPropertyForView(property);
    setPropertyClients(dummyClients); // Using dummy data for testing
    setViewClientsModalOpen(true);
  };

  const closeViewClientsModal = () => {
    setViewClientsModalOpen(false);
    setSelectedPropertyForView(null);
    setPropertyClients([]);
    setEditingClient(null);
    setEditClientForm({ name: "", phone: "", status: "", note: "" });
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setEditClientForm({
      name: client.name,
      phone: client.phone,
      status: client.status,
      note: client.note
    });
  };

  const handleSaveClientEdit = () => {
    if (!editingClient) return;
    
    // Validate phone number
    const cleanPhone = editClientForm.phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }
    
    // Validate name
    if (!editClientForm.name.trim()) {
      alert("Please enter a valid name");
      return;
    }
    
    const updatedClients = propertyClients.map(client =>
      client.id === editingClient.id
        ? { ...client, ...editClientForm, phone: cleanPhone }
        : client
    );
    setPropertyClients(updatedClients);
    setEditingClient(null);
    setEditClientForm({ name: "", phone: "", status: "", note: "" });
  };

  const handleDeleteClient = (clientId) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      const updatedClients = propertyClients.filter(client => client.id !== clientId);
      setPropertyClients(updatedClients);
    }
  };

  const handleCancelEdit = () => {
    setEditingClient(null);
    setEditClientForm({ name: "", phone: "", status: "", note: "" });
  };

  const handlePhoneInputChange = (value) => {
    const clean = value.replace(/\D/g, "").slice(0, 10);
    setEditClientForm(prev => ({ ...prev, phone: clean }));
  };

  return (
    <div className="my-properties-container">
      <h3 className="my-properties-title">My Properties</h3>
      <div className="properties-grid">
        {(properties ?? []).map((prop) => (
          <div key={prop.id} className="property-card">
            {/* Carousel */}

            <div
              className="property-carousel"
              onClick={() => setPreviewProperty(prop)}
              style={{ cursor: "pointer" }}
            >
              <div className="property-carousel-content">
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

            <h4
              className="property-title"
              onClick={() => setPreviewProperty(prop)}
              style={{ cursor: "pointer" }}
            >
              Property Number: {prop.property_number}
            </h4>

            <p
              className="property-detail"
              onClick={() => setPreviewProperty(prop)}
              style={{ cursor: "pointer" }}
            >
              <b>Title:</b> {prop.title}
            </p>

            <p className="property-detail">
              <b>Price:</b> ₹{prop.min_price} - ₹{prop.max_price}
            </p>
            <p className="property-detail">
              <b>Nearest Landmark:</b> {prop.nearest_landmark}
            </p>
            {prop.status && (
              <p className="property-status">Status: {prop.status}</p>
            )}

            <div
              className="property-actions"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <button
                className="property-btn property-btn-edit"
                onClick={() =>
                  setEditingProperty({
                    ...prop,
                    photosInput: prop.photos?.join(",") || "",
                    videosInput: prop.videos?.join(",") || "",
                  })
                }
              >
                Edit
              </button>
              <button
                className="property-btn property-btn-delete"
                onClick={() => handleDelete(prop.id)}
              >
                Delete
              </button>
              {/* View Clients removed; Add Client moved to bottom */}
            </div>

            {/* Add Client button at bottom of card */}
            <button
              className="property-btn property-btn-sold"
              onClick={() => openAddClientModal(prop)}
            >
              Add Client
            </button>
            
            {/* View Client button below Add Client */}
            <button
              className="property-btn property-btn-view-clients"
              onClick={() => openViewClientsModal(prop)}
            >
              View Clients
            </button>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingProperty && (
        <div className="edit-modal-overlay">
          <form onSubmit={handleEditSave} className="edit-modal-content">
            <h3 className="edit-modal-title">Edit Property</h3>
            <input
              type="text"
              name="title"
              className="edit-modal-input"
              value={editingProperty.title}
              onChange={(e) =>
                setEditingProperty({
                  ...editingProperty,
                  title: e.target.value,
                })
              }
            />
            <textarea
              name="description"
              className="edit-modal-textarea"
              value={editingProperty.description}
              onChange={(e) =>
                setEditingProperty({
                  ...editingProperty,
                  description: e.target.value,
                })
              }
            />
            <input
              type="text"
              name="address"
              className="edit-modal-input"
              value={editingProperty.address}
              onChange={(e) =>
                setEditingProperty({
                  ...editingProperty,
                  address: e.target.value,
                })
              }
            />
            <input
              type="number"
              name="price"
              className="edit-modal-input"
              value={editingProperty.min_price}
              onChange={(e) =>
                setEditingProperty({
                  ...editingProperty,
                  min_price: e.target.value,
                })
              }
            />
            <input
              type="number"
              name="max_price"
              className="edit-modal-input"
              value={editingProperty.max_price}
              onChange={(e) =>
                setEditingProperty({
                  ...editingProperty,
                  max_price: e.target.value,
                })
              }
            />
            <input
              type="text"
              name="nearest_landmark"
              className="edit-modal-input"
              value={editingProperty.nearest_landmark}
              onChange={(e) =>
                setEditingProperty({
                  ...editingProperty,
                  nearest_landmark: e.target.value,
                })
              }
            />

            {/* Photos */}
            <div style={{ marginBottom: "15px" }}>
              <label className="edit-modal-label">
                <b>Photos</b>
              </label>
              <div className="media-grid">
                {editingProperty.photos &&
                  editingProperty.photos.map((photo, i) => (
                    <div key={i} className="media-item">
                      <img src={photo} alt={`photo-${i}`} />
                      <button
                        type="button"
                        className="media-remove-btn"
                        onClick={() =>
                          setEditingProperty({
                            ...editingProperty,
                            photos: editingProperty.photos.filter(
                              (_, idx) => idx !== i
                            ),
                          })
                        }
                      >
                        ✕
                      </button>
                    </div>
                  ))}
              </div>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  Promise.all(
                    files.map((file) => {
                      return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(file);
                      });
                    })
                  ).then((newPhotos) => {
                    setEditingProperty({
                      ...editingProperty,
                      photos: [...(editingProperty.photos || []), ...newPhotos],
                    });
                  });
                }}
              />
            </div>

            {/* Videos */}
            <div style={{ marginBottom: "15px" }}>
              <label className="edit-modal-label">
                <b>Videos</b>
              </label>
              <div className="media-grid">
                {editingProperty.videos &&
                  editingProperty.videos.map((video, i) => (
                    <div key={i} className="media-item">
                      <video controls>
                        <source src={video} type="video/mp4" />
                      </video>
                      <button
                        type="button"
                        className="media-remove-btn"
                        onClick={() =>
                          setEditingProperty({
                            ...editingProperty,
                            videos: editingProperty.videos.filter(
                              (_, idx) => idx !== i
                            ),
                          })
                        }
                      >
                        ✕
                      </button>
                    </div>
                  ))}
              </div>

              <input
                type="file"
                accept="video/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  Promise.all(
                    files.map((file) => {
                      return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(file);
                      });
                    })
                  ).then((newVideos) => {
                    setEditingProperty({
                      ...editingProperty,
                      videos: [...(editingProperty.videos || []), ...newVideos],
                    });
                  });
                }}
              />
            </div>

            <div className="edit-modal-actions">
              <button
                type="submit"
                className="edit-modal-btn edit-modal-btn-save"
              >
                Save
              </button>
              <button
                type="button"
                className="edit-modal-btn edit-modal-btn-cancel"
                onClick={() => setEditingProperty(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {previewProperty && (
        <PropertyPreview
          property={previewProperty}
          onClose={() => setPreviewProperty(null)}
        />
      )}

      {/* View Clients modal removed */}

      {addClientModalOpen && selectedPropertyForAdd && (
        <div className="edit-modal-overlay" onClick={closeAddClientModal}>
          <div
            className="edit-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <h3 className="edit-modal-title" style={{ margin: 0 }}>
                Add Client
              </h3>
              <button
                className="media-remove-btn"
                onClick={closeAddClientModal}
              >
                ✕
              </button>
            </div>
            <div>
              <input
                type="text"
                className="edit-modal-input"
                placeholder="Client Name"
                value={addClientForm.name}
                onChange={(e) =>
                  setAddClientForm((f) => ({ ...f, name: e.target.value }))
                }
              />
              <input
                type="tel"
                inputMode="numeric"
                className="edit-modal-input"
                placeholder="Phone (10 digits)"
                value={addClientForm.phone}
                onChange={(e) => {
                  const clean = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setAddClientForm((f) => ({ ...f, phone: clean }));
                }}
              />
              {addClientError && (
                <div style={{ color: "#ff6b6b", marginBottom: 8 }}>
                  {addClientError}
                </div>
              )}
              <div className="edit-modal-actions">
                <button
                  className="edit-modal-btn edit-modal-btn-save"
                  onClick={createClientAndAttach}
                  disabled={addClientSubmitting}
                >
                  {addClientSubmitting ? "Adding..." : "Add Client"}
                </button>
                <button
                  className="edit-modal-btn edit-modal-btn-cancel"
                  onClick={closeAddClientModal}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Clients Modal */}
      {viewClientsModalOpen && selectedPropertyForView && (
        <div className="edit-modal-overlay" onClick={closeViewClientsModal}>
          <div
            className="view-clients-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="view-clients-modal-header">
              <h3 className="edit-modal-title" style={{ margin: 0 }}>
                Clients for {selectedPropertyForView.title}
              </h3>
              <button
                className="modal-close-button"
                onClick={closeViewClientsModal}
              >
                Close
              </button>
            </div>
            
            <div className="view-clients-modal-body">
              <div className="clients-table-container">
                <table className="clients-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Note</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {propertyClients.map((client) => (
                      <tr 
                        key={client.id} 
                        className={`client-row ${client.status === 'marked' ? 'marked-row' : 'unmarked-row'}`}
                      >
                        <td>
                          {editingClient?.id === client.id ? (
                            <input
                              type="text"
                              className="client-edit-input"
                              placeholder="Enter client name"
                              value={editClientForm.name}
                              onChange={(e) => setEditClientForm(prev => ({ ...prev, name: e.target.value }))}
                            />
                          ) : (
                            client.name
                          )}
                        </td>
                        <td>
                          {editingClient?.id === client.id ? (
                            <input
                              type="tel"
                              inputMode="numeric"
                              className="client-edit-input"
                              placeholder="Enter 10-digit phone"
                              value={editClientForm.phone}
                              onChange={(e) => handlePhoneInputChange(e.target.value)}
                            />
                          ) : (
                            client.phone
                          )}
                        </td>
                        <td>
                          {editingClient?.id === client.id ? (
                            <select
                              className="client-edit-select"
                              value={editClientForm.status}
                              onChange={(e) => setEditClientForm(prev => ({ ...prev, status: e.target.value }))}
                            >
                              <option value="marked">Marked</option>
                              <option value="unmarked">Unmarked</option>
                            </select>
                          ) : (
                            <span className={`status-badge ${client.status}`}>
                              {client.status}
                            </span>
                          )}
                        </td>
                        <td>
                          {editingClient?.id === client.id ? (
                            <input
                              type="text"
                              className="client-edit-input"
                              placeholder="Enter note"
                              value={editClientForm.note}
                              onChange={(e) => setEditClientForm(prev => ({ ...prev, note: e.target.value }))}
                            />
                          ) : (
                            client.note
                          )}
                        </td>
                        <td className="client-actions">
                          {editingClient?.id === client.id ? (
                            <>
                              <button
                                className="client-action-btn client-save-btn"
                                onClick={handleSaveClientEdit}
                              >
                                Save
                              </button>
                              <button
                                className="client-action-btn client-cancel-btn"
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="client-action-btn client-edit-btn"
                                onClick={() => handleEditClient(client)}
                              >
                                Edit
                              </button>
                              <button
                                className="client-action-btn client-delete-btn"
                                onClick={() => handleDeleteClient(client.id)}
                              >
                                Delete
                              </button>
                            </>
                          )}
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
    </div>
  );
}
