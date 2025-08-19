import React, { useState } from "react";
import "./SearchProperty.css";

export default function SearchProperty({ properties = [] }) {
  
  const [showDetails, setShowDetails] = useState({});

  const toggleDetails = (id) => {
    setShowDetails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="search-property-container">
      <h2 className="search-property-title">
        Property Listings
      </h2>

      {properties.length === 0 ? (
        <p className="search-property-empty">No properties found.</p>
      ) : (
        <div className="search-property-grid">
          {properties.map((prop) => (
            <div key={prop.id} className="search-property-card">
              {/* Carousel */}
              <div className="search-property-carousel">
                <div className="search-property-carousel-content">
                  {prop.photos &&
                    prop.photos.map((photo, i) => (
                      <img
                        key={i}
                        src={photo}
                        alt={`Property ${i}`}
                      />
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
              <div className="search-property-details">
                <h3 className="search-property-card-title">{prop.title}</h3>
                <p className="search-property-description">{prop.description}</p>
                <p className="search-property-info">
                  <b>Address:</b> {prop.address}
                </p>
                <p className="search-property-info">
                  <b>Nearest Landmark:</b> {prop.nearest_landmark}
                </p>

                {/* Hidden Price */}
                {showDetails[prop.id] && (
                  <p className="search-property-price">
                    ₹{prop.price.toLocaleString()}
                  </p>
                )}

                {/* Owner Details */}
                {showDetails[prop.id] && (
                  <div className="search-property-owner">
                    <p>
                      <b>Owner:</b> {prop.owner_name}
                    </p>
                    <p>
                      <b>Phone:</b> {prop.owner_phone}
                    </p>
                  </div>
                )}

                <button
                  className="search-property-toggle-btn"
                  onClick={() => toggleDetails(prop.id)}
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
