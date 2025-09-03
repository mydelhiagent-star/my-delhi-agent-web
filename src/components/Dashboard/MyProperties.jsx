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

  // View clients removed per request

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

  const attachPropertyToClient = async (client, property) => {
    if (!client) return;
    try {
      const body = {
        property_id: property._id || property.id,
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
      if (response.ok) {
        const result = await response.json();
        alert(result.message || "Property added to client");
      } else {
        await response.json();
        alert("Failed to add property to client");
      }
    } catch (err) {
      console.error("Attach property error:", err);
      alert("Failed to add property. Please try again.");
    }
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
      const createRes = await fetch(API_ENDPOINTS.LEADS_ADMIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name.trim(), phone: cleanPhone }),
      });
      if (!createRes.ok) {
        const err = await createRes.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create client");
      }
      const created = await createRes.json();
      const client = created.lead || created.client || created; // backend may return lead
      // Attach to property
      await attachPropertyToClient(client, selectedPropertyForAdd);
      closeAddClientModal();
    } catch (e) {
      console.error(e);
      setAddClientError(e.message || "Failed to add client");
    } finally {
      setAddClientSubmitting(false);
    }
  };

  // View clients helpers removed

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
    </div>
  );
}
