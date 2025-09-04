import React, { useState, useEffect } from "react";
import "./ConflictingProperties.css";
import { API_ENDPOINTS } from "../../config/api";

export default function ConflictingProperties() {
  const [conflicts, setConflicts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConflictingProperties();
  }, []);

  const fetchConflictingProperties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_ENDPOINTS.LEADS_ADMIN}properties-details?deleted=true`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch conflicting properties");
      }

      const data = await response.json();
      console.log("Raw API Response:", data);
      setConflicts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching conflicting properties:", error);
      setConflicts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="conflicts-loading">Loading...</div>;
  }

  return (
    <div className="conflicts-container">
      <h3 className="conflicts-title">Conflicting Properties</h3>
      
      {conflicts.length === 0 ? (
        <div className="no-conflicts">No data found</div>
      ) : (
        <div className="conflicts-grid">
          {conflicts.map((item, index) => (
            <div key={index} className="conflict-card">
              {/* Property Photo */}
              {item.populated_properties && item.populated_properties.photos && item.populated_properties.photos.length > 0 && (
                <div className="property-image">
                  <img 
                    src={item.populated_properties.photos[0]} 
                    alt={item.populated_properties.title || 'Property'} 
                  />
                </div>
              )}
              
              <div className="card-content">
                {/* Property Description */}
                {item.populated_properties && (
                  <div className="property-section">
                    <h4 className="section-title">Property Details</h4>
                    <p className="property-title">{item.populated_properties.title || 'N/A'}</p>
                    <p className="property-description">{item.populated_properties.description || 'N/A'}</p>
                    <p className="property-address"><strong>Address:</strong> {item.populated_properties.address || 'N/A'}</p>
                    <p className="property-price"><strong>Price:</strong> ₹{item.populated_properties.price?.toLocaleString() || 'N/A'}</p>
                    <p className="property-landmark"><strong>Landmark:</strong> {item.populated_properties.nearest_landmark || 'N/A'}</p>
                    <p className="property-owner"><strong>Owner:</strong> {item.populated_properties.owner_name || 'N/A'}</p>
                    <p className="property-owner-phone"><strong>Owner Phone:</strong> {item.populated_properties.owner_phone || 'N/A'}</p>
                  </div>
                )}

                {/* Dealer Info */}
                {item.dealer_info && (
                  <div className="dealer-section">
                    <h4 className="section-title">Dealer Information</h4>
                    <p className="dealer-name"><strong>Name:</strong> {item.dealer_info.name || 'N/A'}</p>
                    <p className="dealer-shop"><strong>Shop:</strong> {item.dealer_info.shop_name || 'N/A'}</p>
                    <p className="dealer-location"><strong>Location:</strong> {item.dealer_info.location || 'N/A'}</p>
                    <p className="dealer-sub-location"><strong>Sub Location:</strong> {item.dealer_info.sub_location || 'N/A'}</p>
                    <p className="dealer-address"><strong>Office Address:</strong> {item.dealer_info.office_address || 'N/A'}</p>
                    <p className="dealer-phone"><strong>Phone:</strong> {item.dealer_info.phone || 'N/A'}</p>
                    <p className="dealer-email"><strong>Email:</strong> {item.dealer_info.email || 'N/A'}</p>
                  </div>
                )}

                {/* Client Info */}
                <div className="client-section">
                  <h4 className="section-title">Client Information</h4>
                  <p className="client-name"><strong>Name:</strong> {item.name || 'N/A'}</p>
                  <p className="client-phone"><strong>Phone:</strong> {item.phone || 'N/A'}</p>
                  {item.email && <p className="client-email"><strong>Email:</strong> {item.email}</p>}
                  {item.aadhar_number && <p className="client-aadhar"><strong>Aadhar:</strong> {item.aadhar_number}</p>}
                  {item.requirement && <p className="client-requirement"><strong>Requirement:</strong> {item.requirement}</p>}
                  {item.properties && <p className="client-status"><strong>Status:</strong> {item.properties.status || 'N/A'}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}