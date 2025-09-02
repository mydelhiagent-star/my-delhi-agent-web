import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MyProperties.css";
import { API_ENDPOINTS } from "../../config/api";

export default function MyProperties() {
  const [properties, setProperties] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        price: editingProperty.price,
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

  return (
    <div className="my-properties-container">
      <h3 className="my-properties-title">My Properties</h3>
      <div className="properties-grid">
        {(properties ?? []).map((prop) => (
          <div
            key={prop.id}
            className="property-card"
            onClick={() =>
              navigate(`/property/${prop.id}`, { state: { property: prop } })
            }
            style={{ cursor: "pointer" }}
          >
            {/* Carousel */}
            <div className="property-carousel">
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

            <h4 className="property-title">{prop.title}</h4>
            <p className="property-description">{prop.description}</p>
            <p className="property-detail">
              <b>Address:</b> {prop.address}
            </p>
            <p className="property-detail">
              <b>Price:</b> ₹{prop.price}
            </p>
            <p className="property-detail">
              <b>Nearest Landmark:</b> {prop.nearest_landmark}
            </p>
            {prop.status && (
              <p className="property-status">Status: {prop.status}</p>
            )}

            <div className="property-actions">
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
            </div>
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
              value={editingProperty.price}
              onChange={(e) =>
                setEditingProperty({
                  ...editingProperty,
                  price: e.target.value,
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
    </div>
  );
}
