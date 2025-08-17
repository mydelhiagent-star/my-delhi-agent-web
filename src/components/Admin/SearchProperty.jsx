import React, { useState } from "react";

export default function SearchProperty({ properties = [] }) {
  
  const [showDetails, setShowDetails] = useState({});

  const toggleDetails = (id) => {
    setShowDetails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Property Listings
      </h2>

      {properties.length === 0 ? (
        <p style={{ textAlign: "center" }}>No properties found.</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          {properties.map((prop) => (
            <div
              key={prop.id}
              style={{
                width: "320px",
                background: "#fff",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Carousel */}
              <div style={{ position: "relative", height: "200px" }}>
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

              {/* Property Details */}
              <div style={{ padding: "15px" }}>
                <h3>{prop.title}</h3>
                <p style={{ color: "#555" }}>{prop.description}</p>
                <p>
                  <b>Address:</b> {prop.address}
                </p>
                <p>
                  <b>Nearest Landmark:</b> {prop.nearest_landmark}
                </p>

                {/* Hidden Price */}
                {showDetails[prop.id] && (
                  <p
                    style={{
                      fontSize: "18px",
                      color: "#007bff",
                      fontWeight: "bold",
                    }}
                  >
                    ₹{prop.price.toLocaleString()}
                  </p>
                )}

                {/* Owner Details */}
                {showDetails[prop.id] && (
                  <div
                    style={{
                      marginTop: "10px",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                      background: "#f9f9f9",
                    }}
                  >
                    <p>
                      <b>Owner:</b> {prop.owner_name}
                    </p>
                    <p>
                      <b>Phone:</b> {prop.owner_phone}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => toggleDetails(prop.id)}
                  style={{
                    marginTop: "10px",
                    padding: "8px 12px",
                    border: "none",
                    borderRadius: "5px",
                    background: "#28a745",
                    color: "#fff",
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  {showDetails[prop.id]
                    ? "Hide Details"
                    : "Show Price & Owner"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
