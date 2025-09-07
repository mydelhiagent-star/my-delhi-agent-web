import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";
import "./PropertyPreview.css";

export default function PropertyPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const preloaded = location.state && location.state.property ? location.state.property : null;

  const [property, setProperty] = useState(preloaded);
  const [loading, setLoading] = useState(!preloaded);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [showAddress, setShowAddress] = useState(true);
  const [showOwner, setShowOwner] = useState(true);

  useEffect(() => {
    if (preloaded) {
      setProperty(preloaded);
      setLoading(false);
      return;
    }

    // Use dummy data for testing
    const dummyProperties = [
      {
        id: "1",
        title: "Luxury 3BHK Apartment in Sector 62",
        description: "Spacious and modern 3 bedroom apartment with premium amenities. Located in the heart of Noida with excellent connectivity to Delhi and other major areas. The apartment features a contemporary design with high-quality finishes and modern fixtures.",
        address: "Sector 62, Noida, Uttar Pradesh 201301",
        nearest_landmark: "DLF Mall of India",
        price: 4500000,
        property_type: "Apartment",
        bedrooms: 3,
        bathrooms: 2,
        area: 1200,
        status: "active",
        owner_name: "Rajesh Kumar",
        owner_phone: "+91 9876543210",
        images: [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          "https://images.unsplash.com/photo-1560448204-5c3b3f3b3b3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        ],
        videos: [],
        clients: ["John Doe", "Jane Smith", "Mike Johnson"],
        created_at: new Date().toISOString()
      },
      {
        id: "2",
        title: "Modern 2BHK Villa in Greater Noida",
        description: "Beautiful 2 bedroom villa with a private garden and modern amenities. Perfect for families looking for a peaceful environment with all modern conveniences.",
        address: "Greater Noida West, Uttar Pradesh 201310",
        nearest_landmark: "Gaur City Mall",
        price: 3200000,
        property_type: "Villa",
        bedrooms: 2,
        bathrooms: 2,
        area: 900,
        status: "pending",
        owner_name: "Priya Sharma",
        owner_phone: "+91 9876543211",
        images: [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        ],
        videos: [],
        clients: ["Sarah Wilson"],
        created_at: new Date().toISOString()
      },
      {
        id: "3",
        title: "Premium 4BHK Penthouse in Gurgaon",
        description: "Luxurious 4 bedroom penthouse with panoramic city views. Features premium amenities including a private terrace, modern kitchen, and spacious living areas.",
        address: "Sector 29, Gurgaon, Haryana 122001",
        nearest_landmark: "Cyber City Metro Station",
        price: 8500000,
        property_type: "Penthouse",
        bedrooms: 4,
        bathrooms: 3,
        area: 1800,
        status: "sold",
        owner_name: "Amit Patel",
        owner_phone: "+91 9876543212",
        images: [
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        ],
        videos: [],
        clients: ["David Brown", "Lisa Davis"],
        created_at: new Date().toISOString()
      }
    ];

    // Find property by ID or use first one as default
    const selectedProperty = dummyProperties.find(p => p.id === id) || dummyProperties[0];
    
    // Simulate loading delay
    setTimeout(() => {
      setProperty(selectedProperty);
      setLoading(false);
    }, 1000);
  }, [id, preloaded]);

  const mediaItems = useMemo(() => {
    const photos = Array.isArray(property?.images) ? property.images.map((src) => ({ type: "image", src })) : [];
    const videos = Array.isArray(property?.videos) ? property.videos.map((src) => ({ type: "video", src })) : [];
    return [...photos, ...videos];
  }, [property]);

  const canShowMedia = mediaItems.length > 0;
  const activeMedia = canShowMedia ? mediaItems[Math.max(0, Math.min(currentImageIndex, mediaItems.length - 1))] : null;

  const goPrev = () =>
    setCurrentImageIndex((i) =>
      mediaItems.length === 0 ? 0 : (i - 1 + mediaItems.length) % mediaItems.length
    );

  const goNext = () =>
    setCurrentImageIndex((i) => (mediaItems.length === 0 ? 0 : (i + 1) % mediaItems.length));

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "status-active";
      case "pending":
        return "status-pending";
      case "sold":
        return "status-sold";
      default:
        return "status-active";
    }
  };

  if (loading) {
    return (
      <div className="property-preview-loading">
        <div className="loading-spinner"></div>
        <p>Loading property details...</p>
        <p style={{ fontSize: '0.875rem', opacity: 0.7, marginTop: '1rem' }}>
          Property ID: {id}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="property-preview-error">
        <div className="error-icon">⚠️</div>
        <h2>Error Loading Property</h2>
        <p>{error}</p>
        <button onClick={() => window.close()} className="btn-primary">
          Close Tab
        </button>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="property-preview-error">
        <div className="error-icon">🏠</div>
        <h2>Property Not Found</h2>
        <p>The property you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => window.close()} className="btn-primary">
          Close Tab
        </button>
      </div>
    );
  }

  return (
    <div className="property-preview">
      {/* Header */}
      <header className="preview-header">
        <div className="header-content">
          <div className="header-left">
            <div className="property-title-section">
              <h1>{property.title}</h1>
              <div className="property-meta">
                <span className="property-type">{property.property_type}</span>
                <span className="property-location">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {property.nearest_landmark}
                </span>
              </div>
            </div>
          </div>
          <div className="header-right">
            <div className={`status-badge ${getStatusColor(property.status)}`}>
              {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
            </div>
          </div>
        </div>
      </header>

      {/* Full Size Media Gallery */}
      <section className="fullscreen-gallery">
        <div className="gallery-container">
          {activeMedia ? (
            <div className="main-media">
              {activeMedia.type === "image" ? (
                <img
                  src={activeMedia.src}
                  alt={`${property.title} - Image ${currentImageIndex + 1}`}
                  className="gallery-image"
                />
              ) : (
                <video controls className="gallery-video">
                  <source src={activeMedia.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          ) : (
            <div className="no-media">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21,15 16,10 5,21" />
              </svg>
              <p>No media available</p>
            </div>
          )}

          {/* Navigation Controls */}
          {canShowMedia && mediaItems.length > 1 && (
            <>
              <button className="gallery-nav prev" onClick={goPrev} aria-label="Previous image">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15,18 9,12 15,6" />
                </svg>
              </button>
              <button className="gallery-nav next" onClick={goNext} aria-label="Next image">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9,18 15,12 9,6" />
                </svg>
              </button>
              <div className="gallery-counter">
                {currentImageIndex + 1} / {mediaItems.length}
              </div>
            </>
          )}
        </div>

        {/* Thumbnail Strip */}
        {mediaItems.length > 1 && (
          <div className="thumbnail-strip">
            {mediaItems.map((item, index) => (
              <button
                key={index}
                className={`thumbnail ${index === currentImageIndex ? "active" : ""}`}
                onClick={() => setCurrentImageIndex(index)}
              >
                {item.type === "image" ? (
                  <img src={item.src} alt={`Thumbnail ${index + 1}`} />
                ) : (
                  <div className="video-thumbnail">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Main Content */}
      <main className="preview-main">

        {/* Action Buttons */}
        <section className="action-buttons-section">
          <div className="action-buttons-grid">
            <button
              className={`action-btn ${showPrice ? 'active' : ''}`}
              onClick={() => setShowPrice(!showPrice)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              <span>{showPrice ? 'Hide' : 'Show'} Price</span>
            </button>

            <button
              className={`action-btn ${showAddress ? 'active' : ''}`}
              onClick={() => setShowAddress(!showAddress)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{showAddress ? 'Hide' : 'Show'} Address</span>
            </button>

            <button
              className={`action-btn ${showOwner ? 'active' : ''}`}
              onClick={() => setShowOwner(!showOwner)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>{showOwner ? 'Hide' : 'Show'} Owner</span>
            </button>

            <button
              className={`action-btn ${showDetails ? 'active' : ''}`}
              onClick={() => setShowDetails(!showDetails)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              <span>{showDetails ? 'Hide' : 'Show'} Details</span>
            </button>
          </div>
        </section>

        {/* Price Information */}
        {showPrice && (
          <section className="info-section price-section">
            <div className="info-content">
              <h3>Price Information</h3>
              <div className="price-display">
                <div className="price-main">
                  <span className="price-value">{formatPrice(property.price)}</span>
                  <span className="price-label">Total Price</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Address Information */}
        {showAddress && (
          <section className="info-section address-section">
            <div className="info-content">
              <h3>Location Information</h3>
              <div className="address-display">
                <div className="address-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <div>
                    <span className="label">Full Address</span>
                    <span className="value">{property.address}</span>
                  </div>
                </div>
                <div className="address-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9,22 9,12 15,12 15,22" />
                  </svg>
                  <div>
                    <span className="label">Nearest Landmark</span>
                    <span className="value">{property.nearest_landmark}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Owner Information */}
        {showOwner && (property.owner_name || property.owner_phone) && (
          <section className="info-section owner-section">
            <div className="info-content">
              <h3>Owner Information</h3>
              <div className="owner-display">
                {property.owner_name && (
                  <div className="owner-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <div>
                      <span className="label">Owner Name</span>
                      <span className="value">{property.owner_name}</span>
                    </div>
                  </div>
                )}
                {property.owner_phone && (
                  <div className="owner-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <div>
                      <span className="label">Phone Number</span>
                      <span className="value">{property.owner_phone}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Property Details */}
        {showDetails && (
          <section className="property-details">
            <div className="details-content">
              {/* Description */}
              <div className="detail-section">
                <h3>Description</h3>
                <p>{property.description}</p>
              </div>

              {/* Key Information */}
              <div className="detail-section">
                <h3>Key Information</h3>
                <div className="info-grid">
                  <InfoCard
                    icon="🏠"
                    label="Property Type"
                    value={property.property_type}
                  />
                  <InfoCard
                    icon="🛏️"
                    label="Bedrooms"
                    value={property.bedrooms}
                  />
                  <InfoCard
                    icon="🚿"
                    label="Bathrooms"
                    value={property.bathrooms}
                  />
                  <InfoCard
                    icon="📐"
                    label="Area"
                    value={`${property.area?.toLocaleString() || 'N/A'} sq ft`}
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div className="detail-section">
                <h3>Additional Information</h3>
                <div className="additional-info">
                  <div className="info-item">
                    <span className="label">Created</span>
                    <span className="value">
                      {new Date(property.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Property ID</span>
                    <span className="value">{property.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="info-card">
      <div className="info-icon">{icon}</div>
      <div className="info-content">
        <span className="info-label">{label}</span>
        <span className="info-value">{value}</span>
      </div>
    </div>
  );
}
