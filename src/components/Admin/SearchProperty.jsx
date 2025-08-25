import React, { useState } from "react";
import "./SearchProperty.css";

export default function SearchProperty({ properties = [] }) {
  
  const [showDetails, setShowDetails] = useState({});
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [clientQuery, setClientQuery] = useState("");
  const [searchingClient, setSearchingClient] = useState(false);
  const [clientResult, setClientResult] = useState(null);

  const toggleDetails = (id) => {
    setShowDetails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const handleAddClient = async (prop) => {
    try {
     
      const propertyInterest = {
        property_id: prop._id,
        dealer_id: prop.dealer_id,
      };

      if(!clientResult){
        alert("No client found");
        return;
      }
      
  
      const response = await fetch(`http://localhost:8080/leads/admin/${clientResult[0].id}/properties`, {
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

 
  const closeAddClientModal = () => {
    setShowAddClientModal(false);
    setSelectedProperty(null);
  };

  // Search client when phone number reaches 10 digits
  const handleClientSearch = async (phoneNumber) => {
    if (phoneNumber.length === 10) {
      setSearchingClient(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8080/leads/admin/search?phone=${phoneNumber}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          if (data.leads) {
            console.log(data.leads);
            setClientResult(data.leads);
            alert(`Client Found!\nName: ${data.leads[0].name}\nPhone: ${data.leads[0].phone}`);
          } else {
            setClientResult(null);
            alert("No client found with this phone number");
          }
        } else {
          setClientResult(null);
          alert("Error searching for client");
        }
      } catch (error) {
        console.error("Error searching client:", error);
        setClientResult(null);
        alert("Failed to search for client");
      } finally {
        setSearchingClient(false);
      }
    }
  };
  

  const handleClientInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      setClientQuery(value);
      handleClientSearch(value);
    }
  };

  return (
    <div className="search-property-container">
      <h2 className="search-property-title">
        Property Listings
      </h2>

      {/* Client Search Section */}
      <div className="client-search">
        <label className="client-search-label">Search Client by Phone</label>
        <input
          type="tel"
          inputMode="numeric"
          className="client-search-input"
          placeholder="Enter phone number"
          value={clientQuery}
          onChange={handleClientInputChange}
        />
        {searchingClient && (
          <div className="client-search-loading">Searching...</div>
        )}
        {clientResult && (
          <div className="client-result">
            <p><strong>Name:</strong> {clientResult[0].name}</p>
            <p><strong>Phone:</strong> {clientResult[0].phone}</p>
            {clientResult[0].requirement && (
              <p><strong>Requirement:</strong> {clientResult[0].requirement}</p>
            )}
          </div>
        )}
      </div>

      {properties.length === 0 ? (
        <p className="search-property-empty">No properties found.</p>
      ) : (
        <div className="search-property-grid">
          {properties.map((prop) => (
            <div key={prop.id || prop._id} className="search-property-card">
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
                {showDetails[prop.id || prop._id] && (
                  <p className="search-property-price">
                    ₹{prop.price.toLocaleString()}
                  </p>
                )}

                {/* Owner Details */}
                {showDetails[prop.id || prop._id] && (
                  <div className="search-property-owner">
                    <p>
                      <b>Owner:</b> {prop.owner_name}
                    </p>
                    <p>
                      <b>Phone:</b> {prop.owner_phone}
                    </p>
                  </div>
                )}

                <div className="search-property-buttons">
                  <button
                    className="search-property-toggle-btn"
                    onClick={() => toggleDetails(prop.id || prop._id)}
                  >
                    {showDetails[prop.id || prop._id]
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
            </div>
          ))}
        </div>
      )}

      {/* Add Client Modal */}
      {showAddClientModal && (
        <div className="modal-overlay" onClick={closeAddClientModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Client</h3>
              <button className="modal-close" onClick={closeAddClientModal}>
                ×
              </button>
            </div>
            <AddClientModal 
              property={selectedProperty}
              onClose={closeAddClientModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}