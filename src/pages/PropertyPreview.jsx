import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";
import "./PropertyPreview.css";

export default function PropertyPreview() {
  const { id } = useParams();
  const location = useLocation();
  const preloaded = location.state && location.state.property ? location.state.property : null;

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(!preloaded);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [showPrice, setShowPrice] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showOwner, setShowOwner] = useState(false);

  const closeAllExcept = (key) => {
    setShowPrice(key === 'price');
    setShowAddress(key === 'address');
    setShowOwner(key === 'owner');
    setShowDetails(key === 'details');
  };

  useEffect(() => {
    if (preloaded) {
      setProperty(normalizeProperty(preloaded));
      setLoading(false);
      return;
    }

    const fetchProperty = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // Try primary by ID path
        let response = await fetch(`${API_ENDPOINTS.PROPERTIES}/${id}`, { method: 'GET', headers });

        // Fallback to query param form if not OK
        if (!response.ok) {
          response = await fetch(`${API_ENDPOINTS.PROPERTIES}?id=${id}`, { method: 'GET', headers });
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Accept common shapes
        let dataCandidate = null;
        if (result?.success && result.data) {
          dataCandidate = result.data;
        } else if (Array.isArray(result)) {
          dataCandidate = result;
        } else if (result?.property) {
          dataCandidate = result.property;
        } else {
          dataCandidate = result;
        }

        let resolvedProperty = null;
        if (Array.isArray(dataCandidate)) {
          resolvedProperty = dataCandidate.find(p => String(p.id) === String(id)) || dataCandidate[0];
        } else {
          resolvedProperty = dataCandidate;
        }

        if (!resolvedProperty) {
          setError('Property not found in API response');
          return;
        }

        setProperty(normalizeProperty(resolvedProperty));
      } catch (error) {
        console.error('Error fetching property:', error);
        setError(`Failed to load property details: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id, preloaded]);

  function normalizeProperty(raw) {
    if (!raw || typeof raw !== 'object') return null;
    const photos = Array.isArray(raw.photos) ? raw.photos : Array.isArray(raw.images) ? raw.images : [];
    const videos = Array.isArray(raw.videos) ? raw.videos : [];
    return {
      id: raw.id,
      title: raw.title || raw.name || 'Untitled Property',
      description: raw.description || '',
      address: raw.address || '',
      nearest_landmark: raw.nearest_landmark || raw.landmark || '',
      min_price: raw.min_price || raw.price_min || raw.price || null,
      max_price: raw.max_price || raw.price_max || null,
      property_type: raw.property_type || raw.type || '',
      bedrooms: raw.bedrooms || raw.beds || null,
      bathrooms: raw.bathrooms || raw.baths || null,
      area: raw.area || raw.square_feet || raw.size || null,
      owner_name: raw.owner_name || raw.owner || '',
      owner_phone: raw.owner_phone || raw.phone || '',
      created_at: raw.created_at || raw.createdAt || new Date().toISOString(),
      photos,
      videos,
      images: Array.isArray(raw.images) ? raw.images : photos,
    };
  }

  const mediaItems = useMemo(() => {
    const photos = Array.isArray(property?.photos) ? property.photos.map((src) => ({ type: "image", src })) : [];
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

  // Function to extract YouTube video ID
  const getYouTubeVideoId = (url) => {
    const regex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|live\/|embed\/))([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Function to get YouTube thumbnail URL
  const getYouTubeThumbnail = (url) => {
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    return null;
  };

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
        <p style={{ fontSize: '0.875rem', opacity: 0.7, marginTop: '1rem' }}>
          Property ID: {id}
        </p>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
          <button onClick={() => window.close()} className="btn-primary">
            Close Tab
          </button>
          <button onClick={() => window.location.reload()} className="btn-secondary">
            Retry
          </button>
        </div>
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
            {/* <div className={`status-badge ${getStatusColor(property.status)}`}>
              {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
            </div> */}
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
                <iframe
                  src={activeMedia.src}
                  title="Property video"
                  className="gallery-video"
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    borderRadius: "8px"
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
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
                    {getYouTubeThumbnail(item.src) ? (
                      <img 
                        src={getYouTubeThumbnail(item.src)} 
                        alt={`Video thumbnail ${index + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    )}
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
              onClick={() => closeAllExcept(showPrice ? '' : 'price')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              <span>{showPrice ? 'Hide' : 'Show'} Price</span>
            </button>

            <button
              className={`action-btn ${showAddress ? 'active' : ''}`}
              onClick={() => closeAllExcept(showAddress ? '' : 'address')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{showAddress ? 'Hide' : 'Show'} Address</span>
            </button>

            <button
              className={`action-btn ${showOwner ? 'active' : ''}`}
              onClick={() => closeAllExcept(showOwner ? '' : 'owner')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>{showOwner ? 'Hide' : 'Show'} Owner</span>
            </button>

            <button
              className={`action-btn ${showDetails ? 'active' : ''}`}
              onClick={() => closeAllExcept(showDetails ? '' : 'details')}
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
                  <span className="price-value">
                    {property.min_price && property.max_price 
                      ? `${formatPrice(property.min_price)} - ${formatPrice(property.max_price)}`
                      : property.min_price 
                        ? formatPrice(property.min_price)
                        : property.max_price 
                          ? formatPrice(property.max_price)
                          : 'Price not available'
                    }
                  </span>
                  <span className="price-label">Price Range</span>
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
                    <span className="label">Posted On</span>
                    <span className="value">
                      {new Date(property.created_at).toLocaleDateString()}
                    </span>
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
