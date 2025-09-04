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

  // Dummy data for sold properties
  const dummySoldProperties = [
    {
      id: 1,
      property_number: "PROP001",
      title: "Luxury 3BHK Apartment",
      description: "Beautiful 3BHK apartment with modern amenities in prime location",
      address: "Sector 15, Gurgaon",
      min_price: 7500000,
      max_price: 8500000,
      sold_price: 8000000,
      nearest_landmark: "Metro Station",
      photos: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500"
      ],
      videos: [],
      owner_name: "Rajesh Kumar",
      owner_phone: "9876543210",
      dealer_name: "ABC Properties",
      dealer_phone: "9876543211",
      client_name: "Priya Sharma",
      client_phone: "9876543212",
      sold_date: "2024-01-15",
      status: "converted",
      commission: 240000,
      location: "Gurgaon",
      sub_location: "Sector 15"
    },
    {
      id: 2,
      property_number: "PROP002",
      title: "2BHK Independent House",
      description: "Spacious 2BHK independent house with garden",
      address: "Vasant Kunj, Delhi",
      min_price: 12000000,
      max_price: 14000000,
      sold_price: 13500000,
      nearest_landmark: "Shopping Mall",
      photos: [
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500"
      ],
      videos: [],
      owner_name: "Suresh Agarwal",
      owner_phone: "9876543213",
      dealer_name: "XYZ Realty",
      dealer_phone: "9876543214",
      client_name: "Amit Singh",
      client_phone: "9876543215",
      sold_date: "2024-01-20",
      status: "converted",
      commission: 405000,
      location: "Delhi",
      sub_location: "Vasant Kunj"
    },
    {
      id: 3,
      property_number: "PROP003",
      title: "1BHK Studio Apartment",
      description: "Modern 1BHK studio apartment perfect for young professionals",
      address: "Cyber City, Gurgaon",
      min_price: 4500000,
      max_price: 5500000,
      sold_price: 5000000,
      nearest_landmark: "IT Park",
      photos: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500"
      ],
      videos: [],
      owner_name: "Meera Patel",
      owner_phone: "9876543216",
      dealer_name: "ABC Properties",
      dealer_phone: "9876543211",
      client_name: "Rohit Verma",
      client_phone: "9876543217",
      sold_date: "2024-02-01",
      status: "converted",
      commission: 150000,
      location: "Gurgaon",
      sub_location: "Cyber City"
    },
    {
      id: 4,
      property_number: "PROP004",
      title: "4BHK Villa",
      description: "Luxurious 4BHK villa with private pool and garden",
      address: "DLF Phase 2, Gurgaon",
      min_price: 25000000,
      max_price: 30000000,
      sold_price: 28000000,
      nearest_landmark: "Golf Course",
      photos: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500",
        "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=500"
      ],
      videos: [],
      owner_name: "Vikram Malhotra",
      owner_phone: "9876543218",
      dealer_name: "Premium Properties",
      dealer_phone: "9876543219",
      client_name: "Anita Gupta",
      client_phone: "9876543220",
      sold_date: "2024-02-10",
      status: "converted",
      commission: 840000,
      location: "Gurgaon",
      sub_location: "DLF Phase 2"
    },
    {
      id: 5,
      property_number: "PROP005",
      title: "3BHK Penthouse",
      description: "Exclusive 3BHK penthouse with city view",
      address: "Connaught Place, Delhi",
      min_price: 18000000,
      max_price: 22000000,
      sold_price: 20000000,
      nearest_landmark: "Central Park",
      photos: [
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=500",
        "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=500"
      ],
      videos: [],
      owner_name: "Deepak Jain",
      owner_phone: "9876543221",
      dealer_name: "Elite Realty",
      dealer_phone: "9876543222",
      client_name: "Sunita Reddy",
      client_phone: "9876543223",
      sold_date: "2024-02-15",
      status: "converted",
      commission: 600000,
      location: "Delhi",
      sub_location: "Connaught Place"
    }
  ];

  useEffect(() => {
    fetchSoldProperties();
  }, []);

  const fetchSoldProperties = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      const response = await fetch(`${API_ENDPOINTS.LEADS_ADMIN}/properties-details?sold=true`, {
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
                  {formatDate(property.sold_date)}
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
              <h3>Property Details - {selectedProperty.title}</h3>
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
                    <strong>Property Number:</strong> {selectedProperty.property_number}
                  </div>
                  <div className="detail-row">
                    <strong>Description:</strong> {selectedProperty.description}
                  </div>
                  <div className="detail-row">
                    <strong>Address:</strong> {selectedProperty.address}
                  </div>
                  <div className="detail-row">
                    <strong>Nearest Landmark:</strong> {selectedProperty.nearest_landmark}
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Pricing Information</h4>
                  <div className="detail-row">
                    <strong>Original Price Range:</strong> {formatPrice(selectedProperty.min_price)} - {formatPrice(selectedProperty.max_price)}
                  </div>
                  <div className="detail-row">
                    <strong>Sold Price:</strong> {formatPrice(selectedProperty.sold_price)}
                  </div>
                  <div className="detail-row">
                    <strong>Commission:</strong> {formatPrice(selectedProperty.commission)}
                  </div>
                  <div className="detail-row">
                    <strong>Commission %:</strong> {((selectedProperty.commission / selectedProperty.sold_price) * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Owner Information</h4>
                  <div className="detail-row">
                    <strong>Name:</strong> {selectedProperty.owner_name}
                  </div>
                  <div className="detail-row">
                    <strong>Phone:</strong> {selectedProperty.owner_phone}
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Client Information</h4>
                  <div className="detail-row">
                    <strong>Name:</strong> {selectedProperty.client_name}
                  </div>
                  <div className="detail-row">
                    <strong>Phone:</strong> {selectedProperty.client_phone}
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Dealer Information</h4>
                  <div className="detail-row">
                    <strong>Name:</strong> {selectedProperty.dealer_name}
                  </div>
                  <div className="detail-row">
                    <strong>Phone:</strong> {selectedProperty.dealer_phone}
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Transaction Information</h4>
                  <div className="detail-row">
                    <strong>Sold Date:</strong> {formatDate(selectedProperty.sold_date)}
                  </div>
                  <div className="detail-row">
                    <strong>Status:</strong> <span className="status-badge converted">{selectedProperty.status}</span>
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
