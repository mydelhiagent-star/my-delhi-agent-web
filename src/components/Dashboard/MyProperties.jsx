"use client";

import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import "./MyProperties.css";
import { API_ENDPOINTS } from "../../config/api";
import AddClientModal from "./AddClientModal";
import PropertyClientsModal from "./PropertyClientsModal";

const MyProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPrice, setShowPrice] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showOwnerInfo, setShowOwnerInfo] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showSpecifications, setShowSpecifications] = useState(false);
  const [showClients, setShowClients] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cardImageIndexById, setCardImageIndexById] = useState({});
  
  // Add Client Modal State
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  
  // Property Clients Modal State
  const [showPropertyClientsModal, setShowPropertyClientsModal] = useState(false);

  useEffect(() => {
    fetchProperties(currentPage);
  }, [currentPage]);

  const fetchProperties = async (page = 1) => {
    setIsLoading(true);
    try {
      // Request 13 items instead of 12 to check if there are more
      const response = await fetch(
        `${API_ENDPOINTS.PROPERTIES}?page=${page}&limit=13`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        const processedProperties = result.data.map((property) => ({
          ...property,
          images: property.photos || [],
          videos: property.videos || [],
          clients: property.clients || [],
          created_at:
            property.created_at === "0001-01-01T00:00:00Z"
              ? new Date().toISOString()
              : property.created_at,
        }));

        // Check if there are more pages
        const hasMorePages = processedProperties.length === 13;
        const actualProperties = hasMorePages
          ? processedProperties.slice(0, 12)  // Show only 12 if more exist
          : processedProperties;               // Show all if this is the last page

        // Update properties
        setProperties(actualProperties);
        setCurrentPage(page);

        // Set pagination info
        if (hasMorePages) {
          // There are more pages
          setTotalPages(Math.max(totalPages, page + 1));
          console.log(`Page ${page}: ${actualProperties.length} properties, hasMore: true, totalPages: ${Math.max(totalPages, page + 1)}`);
        } else {
          // This is the last page
          setTotalPages(page);
          console.log(`Page ${page}: ${actualProperties.length} properties (last page), totalPages: ${page}`);
        }
        
      } else {
        console.error("Failed to fetch properties:", result.message);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add these functions after fetchProperties
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages && properties.length > 0) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  // Filtered properties based on search
  const filteredProperties = useMemo(() => {
    if (!searchTerm) return properties;

    return properties.filter(
      (property) =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.nearest_landmark
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        property.property_type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [properties, searchTerm]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // If searching, reset to page 1
    if (value) {
      setCurrentPage(1);
    }
  };

  // Handler functions
  const handlePropertyClick = (property, e) => {
    e.stopPropagation();
    // Open preview in new tab
    const previewUrl = `/preview/${property.id}`;
    window.open(previewUrl, "_blank", "noopener,noreferrer");
  };

 
  const getCardImageList = (property) => {
    const imagesFromImages = Array.isArray(property.images) ? property.images : [];
    const imagesFromPhotos = Array.isArray(property.photos) ? property.photos : [];
    const merged = imagesFromImages.length > 0 ? imagesFromImages : imagesFromPhotos;
    return merged.slice(0, 4);
  };

  const getCardIndex = (propertyId, max) => {
    const idx = cardImageIndexById[propertyId] ?? 0;
    if (!Number.isInteger(idx) || idx < 0) return 0;
    if (max && idx >= max) return 0;
    return idx;
  };

  const goPrevCardImage = (propertyId, total, e) => {
    e.stopPropagation();
    setCardImageIndexById((prev) => {
      const current = prev[propertyId] ?? 0;
      const next = total > 0 ? (current - 1 + total) % total : 0;
      return { ...prev, [propertyId]: next };
    });
  };

  const goNextCardImage = (propertyId, total, e) => {
    e.stopPropagation();
    setCardImageIndexById((prev) => {
      const current = prev[propertyId] ?? 0;
      const next = total > 0 ? (current + 1) % total : 0;
      return { ...prev, [propertyId]: next };
    });
  };

  const handleEdit = (property, e) => {
    e.stopPropagation();
    // Navigate to PostProperty with edit data
    navigate('/dashboard/post-property', {
      state: {
        isEditMode: true,
        propertyData: property
      }
    });
  };

  const handleDelete = (property, e) => {
    e.stopPropagation();
    setSelectedProperty(property);
    setModalType("delete");
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedProperty) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.PROPERTIES_DEALER}${selectedProperty.id}`, {
        method: 'DELETE',
      headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        
        setProperties(prevProperties => 
          prevProperties.filter(property => property.id !== selectedProperty.id)
        );
        
        alert('Property deleted successfully');

        fetchProperties(currentPage);
      } else {
        alert(result.message || 'Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property. Please try again.');
    } finally {
      closeModal();
      setIsDeleting(false);
    }
  };

  const handleAddClient = (property, e) => {
    e.stopPropagation();
    setSelectedProperty(property);
    setShowAddClientModal(true);
  };

  const handleViewClients = (property, e) => {
    e.stopPropagation();
    setSelectedProperty(property);
    setShowPropertyClientsModal(true);
  };

  
  const handleAddClientSubmit = async (clientData) => {
    try {
      
      const response = await fetch(`${API_ENDPOINTS.DEALER_CLIENTS}/${clientData.clientId}/properties`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ 
          property_id: selectedProperty.id,
          note: clientData.notes,
          status: clientData.status,

        }),
      });
  
      const result = await response.json();
      
      if (!result.success) {
        alert(result.message || "Failed to add client to property");
        return;
      }
  
      alert("Client added to property successfully!");
      
     
      fetchProperties(currentPage);
      
      
      setShowAddClientModal(false);
    } catch (error) {
      console.error("Error adding client to property:", error);
      alert("Failed to add client to property. Please try again.");
    }
  };

  const handlePreview = (property, e) => {
    e.stopPropagation();
    // Open preview in new tab
    const previewUrl = `/preview/${property.id}`;
    window.open(previewUrl, "_blank", "noopener,noreferrer");
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProperty(null);
    setModalType("");
  };

  const closePreviewModal = () => {
    setShowPreviewModal(false);
    setSelectedProperty(null);
    setCurrentImageIndex(0);
    setShowPrice(false);
    setShowAddress(false);
    setShowOwnerInfo(false);
    setShowDescription(false);
    setShowSpecifications(false);
    setShowClients(false);
  };

  // Image navigation functions
  const nextImage = () => {
    if (selectedProperty && selectedProperty.images) {
      setCurrentImageIndex((prev) =>
        prev === selectedProperty.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedProperty && selectedProperty.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedProperty.images.length - 1 : prev - 1
      );
    }
  };

  const togglePrice = () => {
    setShowPrice(!showPrice);
  };

  const toggleAddress = () => {
    setShowAddress(!showAddress);
  };

  const toggleOwnerInfo = () => {
    setShowOwnerInfo(!showOwnerInfo);
  };

  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };

  const toggleSpecifications = () => {
    setShowSpecifications(!showSpecifications);
  };

  const toggleClients = () => {
    setShowClients(!showClients);
  };

  const formatPrice = (minPrice, maxPrice) => {
    const min = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(minPrice);

    const max = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(maxPrice);

    return `${min} - ${max}`;
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

  return (
    <div className="my-properties-container">
      {/* Header */}
      <div className="properties-header">
        <h2>My Properties</h2>
        <p>Manage your property listings</p>
      </div>

      {/* Search and View Controls */}
      <div className="properties-controls">
        <div className="search-container">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
              </div>

        
            </div>

      {/* Properties Grid/List */}
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading properties...</p>
        </div>
      ) : (
        <div className={`properties-container ${viewMode}`}>
          {filteredProperties.map((property) => (
          <div
            key={property.id}
            className={`property-card ${viewMode}`}
            onClick={(e) => handlePropertyClick(property, e)}
          >
            {/* Property Media */}
            <div className="property-media">
              {(() => {
                const imageList = getCardImageList(property);
                const total = imageList.length;
                const activeIndex = getCardIndex(property.id, total);
                if (total > 0) {
                  return (
                    <>
                      <img
                        src={imageList[activeIndex] || "/placeholder.svg"}
                        alt={property.title}
                        className="property-image"
                      />
                      {total > 1 && (
                        <>
                          <button
                            className="card-slider-nav prev"
                            onClick={(e) => goPrevCardImage(property.id, total, e)}
                            aria-label="Previous image"
                            title="Previous"
                          >
                            
                          </button>
                          <button
                            className="card-slider-nav next"
                            onClick={(e) => goNextCardImage(property.id, total, e)}
                            aria-label="Next image"
                            title="Next"
                          >
                           
                          </button>
                          <div className="card-slider-dots">
                            {imageList.map((_, dotIdx) => (
                              <span
                                key={dotIdx}
                                className={`dot ${dotIdx === activeIndex ? 'active' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCardImageIndexById((prev) => ({ ...prev, [property.id]: dotIdx }));
                                }}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  );
                }
                return (
                <div className="no-image-placeholder">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21,15 16,10 5,21" />
                  </svg>
                </div>
                );
              })()}
 
              {/* Do not show video indicator in card slider as requested */}
 
              {/* Status chip */}
              {/* <div className={`status-chip ${getStatusColor(property.status)}`}>
                  {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
              </div> */}
            </div>

            {/* Property Info */}
            <div className="property-info">
              <h3 className="property-title">{property.title}</h3>
              <p className="property-landmark">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {property.nearest_landmark}
              </p>
            </div>

            {/* Action Buttons */}
            <div
              className="property-actions"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="action-btn edit"
                onClick={(e) => handleEdit(property, e)}
                title="Edit Property"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>

              <button
                className="action-btn delete"
                onClick={(e) => handleDelete(property, e)}
                title="Delete Property"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="3,6 5,6 21,6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>

            <button
                className="action-btn add-client"
                onClick={(e) => handleAddClient(property, e)}
                title="Add Client"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
            </button>
            
            <button
                className="action-btn view-clients"
                onClick={(e) => handleViewClients(property, e)}
                title="View Clients"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                {property.clients && property.clients.length > 0 && (
                  <span className="client-count">{property.clients.length}</span>
                )}
              </button>

              <button
                className="action-btn preview"
                onClick={(e) => handlePreview(property, e)}
                title="Preview Property"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
            </button>
            </div>
          </div>
          ))}
        </div>
      )}

      {/* No Results - only show when not loading */}
      {!isLoading && filteredProperties.length === 0 && (
        <div className="no-results">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
          <h3>No properties found</h3>
          <p>Try adjusting your search terms</p>
        </div>
      )}

      {/* Add the pagination code here - after line 358 */}
      {/* Pagination */}
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-wrapper">
          <div className="pagination-container">
            {/* Pagination Info */}
            {/* <div className="pagination-info">
              <span className="pagination-text">
                Showing{" "}
                <span className="font-semibold">
                  {(currentPage - 1) * 3 + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold">
                  {Math.min(currentPage * 3, totalItems)}
                </span>{" "}
                of <span className="font-semibold">{totalItems}</span>{" "}
                properties
              </span>
            </div> */}

            {/* Pagination Controls */}
            <div className="pagination-controls">
              {/* Previous Button */}
              <button
                className={`pagination-btn prev-btn ${
                  currentPage === 1 ? "disabled" : ""
                }`}
                onClick={handlePreviousPage}
                disabled={currentPage === 1 || isLoading}
                aria-label="Previous page"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="15,18 9,12 15,6" />
                </svg>
                <span>Previous</span>
              </button>

              {/* Page Numbers */}
              <div className="pagination-numbers">
                {/* First Page */}
                {currentPage > 3 && (
                  <>
                    <button
                      className="pagination-number"
                      onClick={() => handlePageChange(1)}
                      disabled={isLoading}
                    >
                      1
                    </button>
                    {currentPage > 4 && (
                      <span className="pagination-ellipsis">...</span>
                    )}
                  </>
                )}

                {/* Page Numbers */}
                {getPageNumbers().map((page) => (
                      <button
                    key={page}
                    className={`pagination-number ${
                      currentPage === page ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(page)}
                    disabled={isLoading}
                  >
                    {page}
                      </button>
                ))}

                {/* Last Page */}
                {currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && (
                      <span className="pagination-ellipsis">...</span>
                    )}
                    <button
                      className="pagination-number"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={isLoading}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
            </div>

              {/* Next Button */}
                      <button
                className={`pagination-btn next-btn ${
                  currentPage === totalPages || properties.length === 0 ? "disabled" : ""
                }`}
                onClick={handleNextPage}
                disabled={currentPage === totalPages || isLoading || properties.length === 0}
                aria-label="Next page"
              >
                <span>Next</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="9,18 15,12 9,6" />
                </svg>
                      </button>
                    </div>
              </div>
        </div>
      )}

      {/* Property Preview Modal */}
      {showPreviewModal && selectedProperty && (
        <div className="preview-modal-overlay" onClick={closePreviewModal}>
          <div
            className="preview-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="preview-modal-header">
              <h2>{selectedProperty.title}</h2>
              <button
                className="preview-modal-close"
                onClick={closePreviewModal}
                aria-label="Close preview"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="preview-modal-content">
              {/* Full Screen Image Carousel */}
              <div className="fullscreen-image-section">
                <div className="image-carousel-container">
                  {/* Navigation Arrows */}
                  {selectedProperty.images &&
                    selectedProperty.images.length > 1 && (
                      <>
              <button
                          className="carousel-nav prev"
                          onClick={prevImage}
                          aria-label="Previous image"
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="15,18 9,12 15,6" />
                          </svg>
              </button>
              <button
                          className="carousel-nav next"
                          onClick={nextImage}
                          aria-label="Next image"
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="9,18 15,12 9,6" />
                          </svg>
              </button>
                      </>
                    )}

                  {/* Full Screen Main Image */}
                  <div className="fullscreen-image-container">
                    {selectedProperty.images &&
                    selectedProperty.images.length > 0 ? (
                      <img
                        src={selectedProperty.images[currentImageIndex]}
                        alt={`${selectedProperty.title} - Image ${
                          currentImageIndex + 1
                        }`}
                        className="fullscreen-image"
                      />
                    ) : (
                      <div className="no-image-placeholder">
                        <svg
                          width="64"
                          height="64"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <rect
                            x="3"
                            y="3"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                          />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21,15 16,10 5,21" />
                        </svg>
                        <span>No Images Available</span>
            </div>
                    )}
                  </div>

                  {/* Image Counter */}
                  {selectedProperty.images &&
                    selectedProperty.images.length > 1 && (
                      <div className="image-counter">
                        {currentImageIndex + 1} /{" "}
                        {selectedProperty.images.length}
        </div>
      )}

                  {/* Video Indicator */}
                  {selectedProperty.videos &&
                    selectedProperty.videos.length > 0 && (
                      <div className="video-indicator">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <polygon points="5,3 19,12 5,21" />
                        </svg>
                        <span>
                          {selectedProperty.videos.length} Video
                          {selectedProperty.videos.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                </div>

                {/* Action Buttons Row */}
                <div className="action-buttons-row">
                  <button
                    className="action-btn price-btn"
                    onClick={togglePrice}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    <span>{showPrice ? "Hide" : "Show"} Price</span>
                  </button>

                  <button
                    className="action-btn address-btn"
                    onClick={toggleAddress}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{showAddress ? "Hide" : "Show"} Address</span>
                  </button>

              <button
                    className="action-btn owner-btn"
                    onClick={toggleOwnerInfo}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>{showOwnerInfo ? "Hide" : "Show"} Owner Info</span>
              </button>

                <button
                    className="action-btn description-btn"
                    onClick={toggleDescription}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14,2 14,8 20,8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10,9 9,9 8,9" />
                    </svg>
                    <span>{showDescription ? "Hide" : "Show"} Description</span>
                </button>

                <button
                    className="action-btn specs-btn"
                    onClick={toggleSpecifications}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <line x1="9" y1="9" x2="15" y2="9" />
                      <line x1="9" y1="15" x2="15" y2="15" />
                    </svg>
                    <span>
                      {showSpecifications ? "Hide" : "Show"} Specifications
                    </span>
                  </button>

                  <button
                    className="action-btn clients-btn"
                    onClick={toggleClients}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span>
                      {showClients ? "Hide" : "Show"} Clients (
                      {selectedProperty.clients.length})
                    </span>
                </button>
              </div>
            </div>

              {/* Price Information (Collapsible) */}
              {showPrice && (
                <div className="info-section price-section">
                  <div className="info-content">
                    <h3>Price Information</h3>
                    <div className="price-display">
                      <div className="price-range">
                        <span className="price-label">Price Range:</span>
                        <span className="price-value">
                          {formatPrice(
                            selectedProperty.min_price,
                            selectedProperty.max_price
                          )}
                        </span>
                      </div>
                      <div className="price-details">
                        <div className="price-item">
                          <span className="label">Minimum:</span>
                          <span className="value">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                              minimumFractionDigits: 0,
                            }).format(selectedProperty.min_price)}
                          </span>
                        </div>
                        <div className="price-item">
                          <span className="label">Maximum:</span>
                          <span className="value">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                              minimumFractionDigits: 0,
                            }).format(selectedProperty.max_price)}
                          </span>
                        </div>
                      </div>
                    </div>
          </div>
        </div>
      )}

              {/* Address Information (Collapsible) */}
              {showAddress && (
                <div className="info-section address-section">
                  <div className="info-content">
                    <h3>Location Information</h3>
                    <div className="address-display">
                      <div className="address-item">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <div className="address-details">
                          <span className="label">Full Address:</span>
                          <span className="value">
                            {selectedProperty.address}
                          </span>
                        </div>
                      </div>
                      <div className="address-item">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          <polyline points="9,22 9,12 15,12 15,22" />
                        </svg>
                        <div className="address-details">
                          <span className="label">Nearest Landmark:</span>
                          <span className="value">
                            {selectedProperty.nearest_landmark}
                          </span>
            </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Owner Information (Collapsible) */}
              {showOwnerInfo && (
                <div className="info-section owner-section">
                  <div className="info-content">
                    <h3>Owner Information</h3>
                    <div className="owner-display">
                      <div className="owner-item">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        <div className="owner-details">
                          <span className="label">Owner Name:</span>
                          <span className="value">
                            {selectedProperty.owner_name}
                          </span>
                        </div>
                      </div>
                      <div className="owner-item">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        <div className="owner-details">
                          <span className="label">Phone Number:</span>
                          <span className="value">
                            {selectedProperty.owner_phone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Description Information (Collapsible) */}
              {showDescription && (
                <div className="info-section description-section">
                  <div className="info-content">
                    <h3>Property Description</h3>
                    <div className="description-display">
                      <div className="description-content">
                        <p>{selectedProperty.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Specifications Information (Collapsible) */}
              {showSpecifications && (
                <div className="info-section specs-section">
                  <div className="info-content">
                    <h3>Property Specifications</h3>
                    <div className="specs-display">
                      <div className="specs-grid">
                        <div className="spec-item">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9,22 9,12 15,12 15,22" />
                          </svg>
                          <div className="spec-details">
                            <span className="label">Property Type:</span>
                            <span className="value">
                              {selectedProperty.property_type}
                              </span>
                                  </div>
                        </div>
                        <div className="spec-item">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect
                              x="2"
                              y="3"
                              width="20"
                              height="14"
                              rx="2"
                              ry="2"
                            />
                            <line x1="8" y1="21" x2="16" y2="21" />
                            <line x1="12" y1="17" x2="12" y2="21" />
                          </svg>
                          <div className="spec-details">
                            <span className="label">Bedrooms:</span>
                            <span className="value">
                              {selectedProperty.bedrooms}
                            </span>
                          </div>
                        </div>
                        <div className="spec-item">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M8 2v4" />
                            <path d="M16 2v4" />
                            <rect
                              x="3"
                              y="4"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            />
                            <path d="M3 10h18" />
                          </svg>
                          <div className="spec-details">
                            <span className="label">Bathrooms:</span>
                            <span className="value">
                              {selectedProperty.bathrooms}
                            </span>
                          </div>
                        </div>
                        <div className="spec-item">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect
                              x="3"
                              y="3"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            />
                            <path d="M9 9h6v6H9z" />
                          </svg>
                          <div className="spec-details">
                            <span className="label">Area:</span>
                            <span className="value">
                              {selectedProperty.area.toLocaleString()} sq ft
                            </span>
                </div>
                        </div>
                        <div className="spec-item">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12,6 12,12 16,14" />
                          </svg>
                          <div className="spec-details">
                            <span className="label">Created:</span>
                            <span className="value">
                              {new Date(
                                selectedProperty.created_at
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="spec-item">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="3" />
                            <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
                          </svg>
                          <div className="spec-details">
                            <span className="label">Status:</span>
                            <span
                              className={`value status-badge ${getStatusColor(
                                selectedProperty.status
                              )}`}
                            >
                              {selectedProperty.status.charAt(0).toUpperCase() +
                                selectedProperty.status.slice(1)}
                            </span>
                          </div>
                        </div>
              </div>
            </div>
          </div>
        </div>
      )}

              {/* Clients Information (Collapsible) */}
              {showClients && (
                <div className="info-section clients-section">
                  <div className="info-content">
                    <h3>
                      Assigned Clients ({selectedProperty.clients.length})
                    </h3>
                    <div className="clients-display">
                      {selectedProperty.clients.length > 0 ? (
                        <div className="clients-list">
                          {selectedProperty.clients.map((client, index) => (
                            <div key={index} className="client-item">
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                              </svg>
                              <span className="client-name">{client}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="no-clients">
                          <svg
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                          <p>No clients assigned to this property</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Modals */}
      {showModal && createPortal(
        <div 
          className="modal-overlay" 
          onClick={closeModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {modalType === "edit" && "Edit Property"}
                {modalType === "delete" && "Delete Property"}
                {modalType === "addClient" && "Add Client"}
                {modalType === "viewClients" && "Property Clients"}
              </h3>
                              <button
                className="modal-close"
                onClick={closeModal}
                aria-label="Close modal"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <div className="modal-content">
              {modalType === "delete" && (
                <div className="delete-confirmation">
                  <p>
                    Are you sure you want to delete "{selectedProperty?.title}"?
                  </p>
                  <p className="warning-text">This action cannot be undone.</p>
                  <div className="modal-actions">
                    <button className="btn-cancel" onClick={closeModal}>
                                Cancel
                              </button>
                              <button
                      className="btn-delete" 
                      onClick={confirmDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                          </svg>
                          Deleting...
                        </>
                      ) : (
                        'Delete Property'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {modalType === "viewClients" && (
                <div className="clients-list">
                  {selectedProperty?.clients.length > 0 ? (
                    <div className="clients-table">
                      <table>
                  <thead>
                    <tr>
                            <th>Client Name</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                          {selectedProperty.clients.map((client, index) => (
                            <tr key={index}>
                              <td>{client}</td>
                              <td>
                                <span className="client-status active">
                                  Active
                              </span>
                        </td>
                        <td>
                                <button className="table-action-btn">
                                  Contact
                              </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
                  ) : (
                    <p className="no-clients">
                      No clients assigned to this property yet.
                    </p>
                  )}
            </div>
              )}

              {modalType === "edit" && (
                <div className="form-placeholder">
                  <p>
                    Form content would go here for edit functionality.
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={showAddClientModal}
        onClose={() => setShowAddClientModal(false)}
        onSubmit={handleAddClientSubmit}
      />

      {/* Property Clients Modal */}
      <PropertyClientsModal
        isOpen={showPropertyClientsModal}
        onClose={() => setShowPropertyClientsModal(false)}
        property={selectedProperty}
      />
    </div>
  );
};

export default MyProperties;
