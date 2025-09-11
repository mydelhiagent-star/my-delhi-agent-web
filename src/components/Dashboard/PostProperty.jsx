"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PostProperty.css";
import { API_ENDPOINTS } from "../../config/api";

const PostProperty = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if we're in edit mode
  const isEditMode = location.state?.isEditMode || false;
  const editPropertyData = location.state?.propertyData || null;
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    min_price: "",
    max_price: "",
    nearest_landmark: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    property_type: "",
    owner_name: "",
    owner_phone: "",
  });

  const [errors, setErrors] = useState({});
  const [imageFiles, setImageFiles] = useState([]);
  const [isImageDragOver, setIsImageDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Add these helper functions BEFORE handleImageUpload
  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const processImagesInBatches = async (files) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    const chunks = chunkArray(imageFiles, 3); // Process 3 images at a time
    const results = [];

    for (const chunk of chunks) {
      const chunkResults = await Promise.all(
        chunk.map((file) => compressImage(file, 0.9, 1600))
      );
      results.push(...chunkResults);
    }

    return results;
  };

  // Add this state (around line 28)
  const [isProcessingImages, setIsProcessingImages] = useState(false);

  // Populate form data when in edit mode
  useEffect(() => {
    if (isEditMode && editPropertyData) {
      setFormData({
        title: editPropertyData.title || "",
        description: editPropertyData.description || "",
        address: editPropertyData.address || "",
        min_price: editPropertyData.min_price?.toString() || "",
        max_price: editPropertyData.max_price?.toString() || "",
        nearest_landmark: editPropertyData.nearest_landmark || "",
        area: editPropertyData.area?.toString() || "",
        bedrooms: editPropertyData.bedrooms?.toString() || "",
        bathrooms: editPropertyData.bathrooms?.toString() || "",
        property_type: editPropertyData.property_type || "",
        owner_name: editPropertyData.owner_name || "",
        owner_phone: editPropertyData.owner_phone || "",
      });

      // Populate existing photos if available
      if (editPropertyData.photos && editPropertyData.photos.length > 0) {
        // Convert photo URLs to File objects for display
        const existingPhotos = editPropertyData.photos.map((photoUrl, index) => {
          // Create a mock File object for existing photos
          const mockFile = new File([], `existing-photo-${index}.jpg`, {
            type: 'image/jpeg',
          });
          // Add the URL as a property for display
          mockFile.existingUrl = photoUrl;
          return mockFile;
        });
        setImageFiles(existingPhotos);
      }
    }
  }, [isEditMode, editPropertyData]);

  // Replace your handleImageUpload function
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    // Check limit
    if (imageFiles.length + files.length > 10) {
      alert(
        `You can only upload a maximum of 10 photos. You currently have ${imageFiles.length} photos and are trying to add ${files.length} more.`
      );
      return;
    }

    // Show processing indicator
    setIsProcessingImages(true);

    try {
      const processedFiles = await processImagesInBatches(files);
      setImageFiles((prev) => [...prev, ...processedFiles]);
    } catch (error) {
      console.error("Image processing failed:", error);
      alert("Failed to process some images. Please try again.");
    } finally {
      setIsProcessingImages(false);
    }
  };

  const handleImageDragOver = (e) => {
    e.preventDefault();
    setIsImageDragOver(true);
  };

  const handleImageDragLeave = (e) => {
    e.preventDefault();
    setIsImageDragOver(false);
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    setIsImageDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    setImageFiles((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    console.log('Removing image at index:', index);
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Validate required fields
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.min_price) newErrors.min_price = "Minimum price is required";
    if (!formData.max_price) newErrors.max_price = "Maximum price is required";
    if (!formData.property_type)
      newErrors.property_type = "Property type is required";
    if (!formData.nearest_landmark)
      newErrors.nearest_landmark = "Nearest landmark is required";

    if (!formData.bedrooms) newErrors.bedrooms = "Bedrooms is required";
    if (!formData.bathrooms) newErrors.bathrooms = "Bathrooms is required";
    if (!formData.area) newErrors.area = "Area is required";
    if (!formData.owner_name.trim())
      newErrors.owner_name = "Owner name is required";
    if (!formData.owner_phone)
      newErrors.owner_phone = "Owner phone is required";

    if (formData.min_price && parseInt(formData.min_price) <= 0) {
      newErrors.min_price = "Minimum price must be greater than 0";
    }
    if (
      formData.min_price &&
      formData.max_price &&
      parseInt(formData.min_price) > parseInt(formData.max_price)
    ) {
      newErrors.max_price = "Maximum price must be greater than minimum price";
    }
    if (formData.max_price && parseInt(formData.max_price) <= 0) {
      newErrors.max_price = "Maximum price must be greater than 0";
    }
    if (formData.bedrooms && parseInt(formData.bedrooms) <= 0) {
      newErrors.bedrooms = "Bedrooms must be greater than 0";
    }
    if (formData.bathrooms && parseInt(formData.bathrooms) <= 0) {
      newErrors.bathrooms = "Bathrooms must be greater than 0";
    }
    if (formData.area && parseInt(formData.area) <= 0) {
      newErrors.area = "Area must be greater than 0";
    }
    if (formData.owner_phone) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(formData.owner_phone.replace(/\D/g, ""))) {
        newErrors.owner_phone = "Please enter a valid 10-digit phone number";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      // Prepare data for API submission
      try {
        let uploadedImageKeys = [];

        if (imageFiles.length > 0) {
          // Separate existing photos from new uploads
          const existingPhotos = imageFiles.filter(file => file.existingUrl);
          const newPhotos = imageFiles.filter(file => !file.existingUrl);
          
          // Keep existing photo URLs
          const existingPhotoKeys = existingPhotos.map(file => file.existingUrl);
          
          // Upload only new photos
          let newPhotoKeys = [];
          if (newPhotos.length > 0) {
            newPhotoKeys = await uploadFilesToCloudflare(newPhotos);
          }
          
          // Combine existing and new photo keys
          uploadedImageKeys = [...existingPhotoKeys, ...newPhotoKeys];
        }

        const propertyData = {
          title: formData.title,
          description: formData.description,
          address: formData.address,
          min_price: parseInt(formData.min_price),
          max_price: parseInt(formData.max_price),
          nearest_landmark: formData.nearest_landmark,
          area: formData.area ? parseFloat(formData.area) : 0,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : 0,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : 0,
          property_type: formData.property_type,
          owner_name: formData.owner_name || "",
          owner_phone: formData.owner_phone || "",
          photos: uploadedImageKeys, // Image files
          // videos: uploadedVideoKeys, // Video files
        };
        // Determine API endpoint and method based on edit mode
        const apiEndpoint = isEditMode 
          ? `${API_ENDPOINTS.PROPERTIES_DEALER}${editPropertyData.id}`
          : API_ENDPOINTS.PROPERTIES_DEALER;
        const method = isEditMode ? "PUT" : "POST";

        const response = await fetch(apiEndpoint, {
          method: method,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(propertyData),
        });
        const result = await response.json();
        if (!result.success) {
          alert(result.message || `Failed to ${isEditMode ? 'update' : 'post'} property`);
          return;
        }
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          // Navigate back to MyProperties after success
          navigate('/dashboard/properties');
        }, 3000);
        setFormData({
          title: "",
          description: "",
          address: "",
          min_price: "",
          max_price: "",
          nearest_landmark: "",
          area: "",
          bedrooms: "",
          bathrooms: "",
          property_type: "",
          owner_name: "",
          owner_phone: "",
        });
        setImageFiles([]);

        setErrors({});
      } catch (error) {
        console.error("Error submitting property:", error);
        alert("Failed to post property. Please try again.");
        setErrors({});
      } finally {
        setIsSubmitting(false);
      }
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      alert("Please fill correct details");
    }
  };

  // Add this function before uploadFilesToCloudflare (around line 244)
  const compressImage = (file, quality = 0.9, maxWidth = 1600) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        URL.revokeObjectURL(img.src); // Clean up

        // Skip compression if image is small and already JPEG
        if (
          img.width <= maxWidth &&
          img.height <= maxWidth &&
          file.type === "image/jpeg"
        ) {
          resolve(file);
          return;
        }

        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
            });
            resolve(compressedFile);
          },
          "image/jpeg",
          quality
        );
      };

      img.onerror = () => {
        console.error("Failed to load image:", file.name);
        resolve(file); // Fallback
      };

      img.src = URL.createObjectURL(file);
    });
  };

  // Add this function after handleSubmit (around line 202)
  const uploadFilesToCloudflare = async (files) => {
    try {
      // Step 1: Get presigned URLs
      const response = await fetch(API_ENDPOINTS.PRESIGNED_URLS, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ count: files.length }),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || "Failed to get upload URLs");
      }

      const { presignedUrls } = result.data;

      // Step 2: Upload files to Cloudflare
      const uploadPromises = files.map(async (file, index) => {
        const { presignedUrl, fileKey } = presignedUrls[index];

        const uploadResponse = await fetch(presignedUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        return fileKey;
      });

      // Wait for all uploads to complete
      const uploadedKeys = await Promise.all(uploadPromises);
      return uploadedKeys;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  if (isSubmitting) {
    return (
      <div className="full-page-overlay">
        <div className="loading-content">
          <div className="modern-spinner">
            <div className="spinner-circle"></div>
          </div>
          <h3>Posting Your Property</h3>
          <p>Please wait while we upload your property details...</p>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="full-page-overlay success-overlay">
        <div className="success-content">
          <div className="success-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#10b981"/>
              <path d="m9 12 2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2>Property Posted Successfully!</h2>
          <p>Your property has been added to the listings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="post-property-container">
      <div className="post-property-header">
        <h2>{isEditMode ? 'Edit Property' : 'Post New Property'}</h2>
        <p>{isEditMode ? 'Update your property details' : 'Add a new property to your portfolio'}</p>
      </div>

      <form onSubmit={handleSubmit} className="post-property-form">
        <div className="form-grid">
          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>

            <div className="form-group">
              <label htmlFor="title">Property Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={errors.title ? "error" : ""}
                placeholder="Enter property title"
                required
              />
              {errors.title && (
                <span className="error-message">{errors.title}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                placeholder="Describe the property features and amenities"
                required
              />
              {errors.description && (
                <span className="error-message">{errors.description}</span>
              )}
            </div>

            <div className="form-row three-columns">
              <div className="form-group">
                <label htmlFor="min_price">Minimum Price *</label>
                <input
                  type="number"
                  id="min_price"
                  name="min_price"
                  value={formData.min_price}
                  onChange={handleInputChange}
                  className={errors.min_price ? "error" : ""}
                  placeholder="0"
                  step="1"
                  required
                />
                {errors.min_price && (
                  <span className="error-message">{errors.min_price}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="max_price">Maximum Price *</label>
                <input
                  type="number"
                  id="max_price"
                  name="max_price"
                  value={formData.max_price}
                  onChange={handleInputChange}
                  className={errors.max_price ? "error" : ""}
                  placeholder="0"
                  step="1"
                  required
                />
                {errors.max_price && (
                  <span className="error-message">{errors.max_price}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="property_type">Property Type *</label>
                <select
                  id="property_type"
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleInputChange}
                  className={errors.property_type ? "error" : ""}
                  required
                >
                  <option value="">Select type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="studio">Studio</option>
                  <option value="commercial">Commercial</option>
                </select>
                {errors.property_type && (
                  <span className="error-message">{errors.property_type}</span>
                )}
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="form-section">
            <h3>Property Details</h3>

            <div className="form-group">
              <label htmlFor="address">Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={errors.address ? "error" : ""}
                placeholder="Enter full address"
                required
              />
              {errors.address && (
                <span className="error-message">{errors.address}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="nearest_landmark">Nearest Landmark *</label>
              <input
                type="text"
                id="nearest_landmark"
                name="nearest_landmark"
                value={formData.nearest_landmark}
                onChange={handleInputChange}
                className={errors.nearest_landmark ? "error" : ""}
                placeholder="e.g., Metro Station - 5 mins walk"
                required
              />
              {errors.nearest_landmark && (
                <span className="error-message">{errors.nearest_landmark}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bedrooms">Bedrooms *</label>
                <select
                  id="bedrooms"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  className={errors.bedrooms ? "error" : ""}
                  required
                >
                  <option value="">Select</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                {errors.bedrooms && (
                  <span className="error-message">{errors.bedrooms}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="bathrooms">Bathrooms *</label>
                <select
                  id="bathrooms"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  required
                  className={errors.bathrooms ? "error" : ""}
                >
                  <option value="">Select</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                {errors.bathrooms && (
                  <span className="error-message">{errors.bathrooms}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="area">Area (sq ft) *</label>
                <input
                  type="number"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  placeholder="0"
                  required
                  className={errors.area ? "error" : ""}
                />
                {errors.area && (
                  <span className="error-message">{errors.area}</span>
                )}
              </div>
            </div>
          </div>

          {/* Owner Information */}
          <div className="form-section">
            <h3>Owner Information</h3>

            <div className="form-row two-columns">
              <div className="form-group">
                <label htmlFor="owner_name">Owner Name *</label>
                <input
                  type="text"
                  id="owner_name"
                  name="owner_name"
                  value={formData.owner_name}
                  onChange={handleInputChange}
                  className={errors.owner_name ? "error" : ""}
                  placeholder="Enter owner's name"
                  required
                />
                {errors.owner_name && (
                  <span className="error-message">{errors.owner_name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="owner_phone">Owner Phone *</label>
                <input
                  type="tel"
                  id="owner_phone"
                  name="owner_phone"
                  value={formData.owner_phone}
                  onChange={handleInputChange}
                  className={errors.owner_phone ? "error" : ""}
                  placeholder="Enter owner's phone number"
                  required
                />
                {errors.owner_phone && (
                  <span className="error-message">{errors.owner_phone}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Media Upload */}
        <div className="form-section">
          <h3>Property Media</h3>

          {/* Image Upload */}
          <div className="upload-section">
            <h4>Property Images</h4>
            {isProcessingImages && (
              <div className="processing-indicator">
                <div className="spinner"></div>
                <p>Processing images...</p>
              </div>
            )}
            <div
              className={`file-upload-area ${
                isImageDragOver ? "drag-over" : ""
              }`}
              onDragOver={handleImageDragOver}
              onDragLeave={handleImageDragLeave}
              onDrop={handleImageDrop}
            >
              <div className="upload-content">
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
                <h4>Upload Property Images</h4>
                <p>Drag and drop image files here, or click to select</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input"
                />
              </div>
            </div>

            {/* Image Preview Grid */}
            {imageFiles.length > 0 && (
              <div className="media-preview-grid">
                {imageFiles.map((file, index) => (
                  <div key={`img-${index}`} className="media-preview-item">
                    <div className="media-preview">
                      <img
                        src={file.existingUrl || URL.createObjectURL(file) || "/placeholder.svg"}
                        alt={`Image ${index + 1}`}
                      />
                      {file.existingUrl && (
                        <div className="existing-photo-badge">
                          <span>Existing</span>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      className="remove-media-btn"
                      onClick={() => removeImage(index)}
                      aria-label={`Remove ${file.name}`}
                      title={`Remove ${file.existingUrl ? 'existing' : 'new'} image`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                    <span className="file-name">{file.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Posting Property...
              </>
            ) : (
              <>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7,10 12,15 17,10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {isEditMode ? 'Update Property' : 'Post Property'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostProperty;
