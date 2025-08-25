import React, { useMemo, useState } from "react";
import "./SearchProperty.css";

export default function SearchProperty({ properties = [] }) {
  const [showDetails, setShowDetails] = useState({});
  const [clientQuery, setClientQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [isClientListOpen, setIsClientListOpen] = useState(false);

  // Dummy clients data (can be replaced with API later)
  const dummyClients = useMemo(
    () => [
      { id: "c1", name: "Aman Verma", phone: "9876543210" },
      { id: "c2", name: "Priya Singh", phone: "9811122233" },
      { id: "c3", name: "Rohit Kumar", phone: "9876001122" },
      { id: "c4", name: "Neha Gupta", phone: "9910099100" },
      { id: "c5", name: "Vikas Sharma", phone: "8800550033" },
    ],
    []
  );

  const filteredClients = useMemo(() => {
    const q = clientQuery.trim();
    if (!q) return [];
    return dummyClients.filter((c) => c.phone.includes(q));
  }, [clientQuery, dummyClients]);

  const toggleDetails = (id) => {
    setShowDetails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAddClient = async (prop) => {
    try {
     
      
      // ← CORRECT: Send only PropertyInterest data
      const propertyInterest = {
        property_id: prop._id,
        dealer_id: prop.dealer_id,
      };
  
      const response = await fetch("http://localhost:8080/leads/admin/68ab92a05a06fc1c3b418012/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(propertyInterest), // ← Only PropertyInterest
      });
  
      if (response.ok) {
        const result = await response.json();
        alert(result.message || "Property added successfully");
      } else {
        const error = await response.json();
        alert("Failed to add property");
      }
    } catch (error) {
      console.error("Error creating lead:", error);
      alert("Failed to add property. Please try again.");
    } 
  };

  return (
    <div className="search-property-container">
      <h2 className="search-property-title">Property Listings</h2>

      {/* Client Search */}
      <div className="client-search">
        <label className="client-search-label">Search Client by Phone</label>
        <input
          type="tel"
          inputMode="numeric"
          className="client-search-input"
          placeholder="Enter phone number"
          value={clientQuery}
          onChange={(e) => {
            setClientQuery(e.target.value.replace(/[^0-9]/g, ""));
            setIsClientListOpen(true);
          }}
          onFocus={() => setIsClientListOpen(true)}
        />
        {isClientListOpen && filteredClients.length > 0 && (
          <ul className="client-search-results" role="listbox">
            {filteredClients.map((c) => (
              <li
                key={c.id}
                role="option"
                tabIndex={0}
                className="client-search-result-item"
                onClick={() => {
                  setSelectedClient(c);
                  setIsClientListOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSelectedClient(c);
                    setIsClientListOpen(false);
                  }
                }}
              >
                <span className="client-result-name">{c.name}</span>
                <span className="client-result-phone">{c.phone}</span>
              </li>
            ))}
          </ul>
        )}

        {selectedClient && (
          <div className="client-selected-pill">
            Searching for: <b>{selectedClient.name}</b> ({selectedClient.phone})
            <button
              className="client-clear-btn"
              onClick={() => {
                setSelectedClient(null);
                setClientQuery("");
                setIsClientListOpen(false);
              }}
              aria-label="Clear selected client"
            >
              ×
            </button>
          </div>
        )}
      </div>

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

                {/* Toggle Button */}
                <button
                  className="search-property-toggle-btn"
                  onClick={() => toggleDetails(prop.id)}
                >
                  {showDetails[prop.id]
                    ? "Hide Details"
                    : "Show Price & Owner"}
                </button>

                {/* Add Client Button */}
                <button
                  className="search-property-add-client-btn"
                  onClick={() => handleAddClient(prop)}
                >
                  Add Client
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
