import React, { useState, useEffect } from "react";


export default function MyProperties() {
  const [properties, setProperties] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null);
  const [soldOptions, setSoldOptions] = useState(null);
  

 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // no token means no properties to fetch

    const fetchProperties = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/properties/",
          {
            headers: { Authorization: `Bearer ${token}` },
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

  const saveProperties = (updated) => {
    setProperties(updated);
    localStorage.setItem("myProperties", JSON.stringify(updated));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      const updated = properties.filter((p) => p.id !== id);
      saveProperties(updated);
    }
  };

  const handleSold = (id, soldBy) => {
    const updated = properties.map((p) =>
      p.id === id ? { ...p, status: `Sold by ${soldBy}` } : p
    );
    saveProperties(updated);
    setSoldOptions(null);
    alert(`Property marked as Sold by ${soldBy}`);
  };

  const handleEditSave = (e) => {
    e.preventDefault();

    // handle photos & videos split
    const updatedProperty = {
      ...editingProperty,
      photos: editingProperty.photosInput
        ? editingProperty.photosInput.split(",").map((p) => p.trim())
        : [],
      videos: editingProperty.videosInput
        ? editingProperty.videosInput.split(",").map((v) => v.trim())
        : [],
    };

    const updated = properties.map((p) =>
      p.id === editingProperty.id ? updatedProperty : p
    );
    saveProperties(updated);
    setEditingProperty(null);
    alert("Property updated successfully!");
  };

  return (
    <div>
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
        My Properties
      </h3>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {properties.map((prop) => (
          <div
            key={prop.id}
            style={{
              width: "320px",
              background: "#fff",
              padding: "15px",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              position: "relative",
            }}
          >
            {/* Carousel */}
            <div
              style={{
                position: "relative",
                height: "180px",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  overflowX: "auto",
                  scrollSnapType: "x mandatory",
                  height: "100%",
                }}
              >
                {prop.photos &&
                  prop.photos.map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      alt={`Property ${i}`}
                      style={{
                        minWidth: "100%",
                        objectFit: "cover",
                        scrollSnapAlign: "center",
                      }}
                    />
                  ))}
                {prop.videos &&
                  prop.videos.map((video, i) => (
                    <video
                      key={i}
                      controls
                      style={{
                        minWidth: "100%",
                        objectFit: "cover",
                        scrollSnapAlign: "center",
                      }}
                    >
                      <source src={video} type="video/mp4" />
                    </video>
                  ))}
              </div>
            </div>

            <h4>{prop.title}</h4>
            <p>{prop.description}</p>
            <p>
              <b>Address:</b> {prop.address}
            </p>
            <p>
              <b>Price:</b> ₹{prop.price}
            </p>
            <p>
              <b>Nearest Landmark:</b> {prop.nearest_landmark}
            </p>
            {prop.status && (
              <p style={{ color: "green", fontWeight: "bold" }}>
                Status: {prop.status}
              </p>
            )}

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button
                onClick={() =>
                  setEditingProperty({
                    ...prop,
                    photosInput: prop.photos?.join(",") || "",
                    videosInput: prop.videos?.join(",") || "",
                  })
                }
                style={{
                  flex: 1,
                  background: "#ffc107",
                  border: "none",
                  padding: "8px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(prop.id)}
                style={{
                  flex: 1,
                  background: "#dc3545",
                  border: "none",
                  padding: "8px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  color: "#fff",
                }}
              >
                Delete
              </button>
            </div>

            {/* Sold Flow */}
            {soldOptions === prop.id ? (
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => handleSold(prop.id, "Me")}
                  style={{
                    width: "100%",
                    background: "#28a745",
                    border: "none",
                    padding: "8px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    color: "#fff",
                    marginBottom: "5px",
                  }}
                >
                  Sold by Me
                </button>
                <button
                  onClick={() => handleSold(prop.id, "My Delhi Agent")}
                  style={{
                    width: "100%",
                    background: "#17a2b8",
                    border: "none",
                    padding: "8px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    color: "#fff",
                    marginBottom: "5px",
                  }}
                >
                  Sold by My Delhi Agent
                </button>
                <button
                  onClick={() => handleSold(prop.id, "Other")}
                  style={{
                    width: "100%",
                    background: "#6c757d",
                    border: "none",
                    padding: "8px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    color: "#fff",
                  }}
                >
                  Sold by Other
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSoldOptions(prop.id)}
                style={{
                  marginTop: "10px",
                  width: "100%",
                  background: "#007bff",
                  border: "none",
                  padding: "8px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  color: "#fff",
                }}
              >
                Mark as Sold
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingProperty && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <form
            onSubmit={handleEditSave}
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "10px",
              width: "400px",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <h3>Edit Property</h3>
            <input
              type="text"
              name="title"
              value={editingProperty.title}
              onChange={(e) =>
                setEditingProperty({
                  ...editingProperty,
                  title: e.target.value,
                })
              }
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
            <textarea
              name="description"
              value={editingProperty.description}
              onChange={(e) =>
                setEditingProperty({
                  ...editingProperty,
                  description: e.target.value,
                })
              }
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
            <input
              type="text"
              name="address"
              value={editingProperty.address}
              onChange={(e) =>
                setEditingProperty({
                  ...editingProperty,
                  address: e.target.value,
                })
              }
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
            <input
              type="number"
              name="price"
              value={editingProperty.price}
              onChange={(e) =>
                setEditingProperty({
                  ...editingProperty,
                  price: e.target.value,
                })
              }
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
            <input
              type="text"
              name="nearest_landmark"
              value={editingProperty.nearest_landmark}
              onChange={(e) =>
                setEditingProperty({
                  ...editingProperty,
                  nearest_landmark: e.target.value,
                })
              }
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />

            {/* Photos */}
            <div style={{ marginBottom: "15px" }}>
              <label>
                <b>Photos</b>
              </label>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  margin: "10px 0",
                }}
              >
                {editingProperty.photos &&
                  editingProperty.photos.map((photo, i) => (
                    <div key={i} style={{ position: "relative" }}>
                      <img
                        src={photo}
                        alt={`photo-${i}`}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "5px",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setEditingProperty({
                            ...editingProperty,
                            photos: editingProperty.photos.filter(
                              (_, idx) => idx !== i
                            ),
                          })
                        }
                        style={{
                          position: "absolute",
                          top: "-5px",
                          right: "-5px",
                          background: "red",
                          color: "#fff",
                          border: "none",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                        }}
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
              <label>
                <b>Videos</b>
              </label>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  margin: "10px 0",
                }}
              >
                {editingProperty.videos &&
                  editingProperty.videos.map((video, i) => (
                    <div key={i} style={{ position: "relative" }}>
                      <video
                        src={video}
                        controls
                        style={{
                          width: "100px",
                          height: "80px",
                          borderRadius: "5px",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setEditingProperty({
                            ...editingProperty,
                            videos: editingProperty.videos.filter(
                              (_, idx) => idx !== i
                            ),
                          })
                        }
                        style={{
                          position: "absolute",
                          top: "-5px",
                          right: "-5px",
                          background: "red",
                          color: "#fff",
                          border: "none",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                        }}
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

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  background: "#007bff",
                  border: "none",
                  padding: "10px",
                  color: "#fff",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingProperty(null)}
                style={{
                  flex: 1,
                  background: "#6c757d",
                  border: "none",
                  padding: "10px",
                  color: "#fff",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
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
