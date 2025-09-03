import React, { useEffect, useState } from "react";
import "./PropertiView.css";

// Dummy properties (you can later fetch from backend or use properties.js)


export default function SearchProperty() {
  const [properties, setProperties] = useState([]);
  const [showOwner, setShowOwner] = useState({});

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem("token"); // assuming JWT is stored here
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
                {prop.photos.map((photo, i) => (
                  <img
                    key={i}
                    src={photo}
                    alt={`Property ${i}`}
                  />
                ))}
                {prop.videos.map((video, i) => (
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
                ₹{prop.price.toLocaleString()}
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

              <button
                className="property-view-toggle-btn"
                onClick={() => toggleOwner(index)}
              >
                {showOwner[index] ? "Hide Details" : "Show Owner Details"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
