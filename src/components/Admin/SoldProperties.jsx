import React, { useState, useEffect } from "react";
import "./SoldProperties.css";
import { API_ENDPOINTS } from "../../config/api";

export default function SoldProperties() {
  const [soldProperties, setSoldProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);



  useEffect(() => {
    fetchSoldProperties();
  }, []);

  const fetchSoldProperties = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      const response = await fetch(`${API_ENDPOINTS.LEADS_ADMIN}properties-details?sold=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if(response.ok) {
        const data = await response.json();
        setSoldProperties(data || []);
      }
      else {
        throw new Error("Failed to fetch sold properties");
      }
    }
    catch(error) {
      console.error("Error fetching sold properties:", error);
    }
    finally {
      setLoading(false);
    }
  }

  // Handle search and filter
  useEffect(() => {
    let filtered = soldProperties;

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.property_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.dealer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(property => property.status === statusFilter);
    }

    setFilteredProperties(filtered);
  }, [soldProperties, searchTerm, statusFilter]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
  };

  const handleViewProperty = (property) => {
    setSelectedProperty(property);
    setShowPropertyModal(true);
  };

  const closePropertyModal = () => {
    setShowPropertyModal(false);
    setSelectedProperty(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return <div className="sold-properties-loading">Loading sold properties...</div>;
  }

  return (
    <div className="sold-properties-container">
      <h3 className="sold-properties-title">Sold Properties</h3>
      
      {/* Search and Filter Controls */}
      <div className="search-filter-container">
        {/* Search on the left */}
        <div className="search-container">
          <label htmlFor="property-search" className="search-label">
            Search Properties:
          </label>
          <input
            id="property-search"
            type="text"
            placeholder="Search by title, property number, client, dealer, or location..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        
        {/* Filter on the right */}
        <div className="status-filter-container">
          <label htmlFor="status-filter" className="status-filter-label">
            Filter by Status:
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            className="status-filter-dropdown"
          >
            <option value="all">All Statuses</option>
            <option value="converted">Converted</option>
            <option value="sold">Sold</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <h4>Total Sold</h4>
          <p className="summary-number">{filteredProperties.length}</p>
        </div>
        <div className="summary-card">
          <h4>Total Revenue</h4>
          <p className="summary-number">
            {formatPrice(filteredProperties.reduce((sum, prop) => sum + prop.populated_properties.sold_price, 0))}
          </p>
        </div>
       
      </div>
      
      <div className="sold-properties-table-container">
        <table className="sold-properties-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Client</th>
              <th>Dealer</th>
              <th>Sold Price</th>
              <th>Sold Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProperties.map((property) => (
              <tr key={property.id} className="sold-property-row">
                <td>
                  <div className="property-info">
                    <div className="property-title">{property.populated_properties.title}</div>
                    <div className="property-location">{property.dealer_info.location}</div>
                  </div>
                </td>
                <td>
                  <div className="client-info">
                    <div className="client-name">{property.name}</div>
                    <div className="client-phone">{property.phone}</div>
                  </div>
                </td>
                <td>
                  <div className="dealer-info">
                    <div className="dealer-name">{property.dealer_info.name}</div>
                    <div className="dealer-phone">{property.dealer_info.phone}</div>
                  </div>
                </td>
                <td className="price-cell">
                  <div className="sold-price">{formatPrice(property.populated_properties.sold_price)}</div>
                  <div className="original-price">
                    {formatPrice(property.populated_properties.min_price)} - {formatPrice(property.populated_properties.max_price)}
                  </div>
                </td>
                {/* <td className="commission-cell">
                  <div className="commission-amount">{formatPrice(property.commission)}</div>
                  <div className="commission-percentage">
                    {((property.commission / property.sold_price) * 100).toFixed(1)}%
                  </div>
                </td> */}
                <td className="date-cell">
                  {formatDate(property.populated_properties.sold_date)}
                </td>
                <td className="property-actions">
                  <button
                    className="property-btn property-btn-view"
                    onClick={() => handleViewProperty(property)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Property Details Modal */}
      {showPropertyModal && selectedProperty && (
        <div className="property-modal-overlay" onClick={closePropertyModal}>
          <div className="property-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="property-modal-header">
              <h3>Property Details - {selectedProperty.populated_properties.title}</h3>
              <button className="property-modal-close" onClick={closePropertyModal}>
                ✕
              </button>
            </div>
            
            <div className="property-modal-body">
              {/* Property Images */}
              {selectedProperty.photos && selectedProperty.photos.length > 0 && (
                <div className="property-images">
                  <h4>Property Images</h4>
                  <div className="images-grid">
                    {selectedProperty.photos.map((photo, index) => (
                      <img key={index} src={photo} alt={`Property ${index + 1}`} />
                    ))}
                  </div>
                </div>
              )}

              {/* Property Details */}
              <div className="property-details-grid">
                <div className="detail-section">
                  <h4>Property Information</h4>
                  <div className="detail-row">
                    <strong>Property Number:</strong> {selectedProperty.populated_properties.property_number}
                  </div>
                  <div className="detail-row">
                    <strong>Description:</strong> {selectedProperty.populated_properties.description}
                  </div>
                  <div className="detail-row">
                    <strong>Address:</strong> {selectedProperty.populated_properties.address}
                  </div>
                  <div className="detail-row">
                    <strong>Nearest Landmark:</strong> {selectedProperty.populated_properties.nearest_landmark}
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Pricing Information</h4>
                  <div className="detail-row">
                    <strong>Original Price Range:</strong> {formatPrice(selectedProperty.populated_properties.min_price)} - {formatPrice(selectedProperty.populated_properties.max_price)}
                  </div>
                  <div className="detail-row">
                    <strong>Sold Price:</strong> {formatPrice(selectedProperty.populated_properties.sold_price)}
                  </div>
                 
                 
                </div>

                <div className="detail-section">
                  <h4>Owner Information</h4>
                  <div className="detail-row">
                    <strong>Name:</strong> {selectedProperty.populated_properties.owner_name}
                  </div>
                  <div className="detail-row">
                    <strong>Phone:</strong> {selectedProperty.populated_properties.owner_phone}
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Client Information</h4>
                  <div className="detail-row">
                    <strong>Name:</strong> {selectedProperty.name}
                  </div>
                  <div className="detail-row">
                    <strong>Phone:</strong> {selectedProperty.phone}
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Dealer Information</h4>
                  <div className="detail-row">
                    <strong>Name:</strong> {selectedProperty.dealer_info.name}
                  </div>
                  <div className="detail-row">
                    <strong>Phone:</strong> {selectedProperty.dealer_info.phone}
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Transaction Information</h4>
                  <div className="detail-row">
                    <strong>Sold Date:</strong> {formatDate(selectedProperty.sold_date)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
