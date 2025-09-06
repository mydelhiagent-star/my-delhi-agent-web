"use client"

import { useState } from "react"
import "./PostProperty.css"
import { API_ENDPOINTS } from "../../config/api"

const PostProperty = () => {
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
  })

  const [errors, setErrors] = useState({})
  const [imageFiles, setImageFiles] = useState([])
  const [videoFiles, setVideoFiles] = useState([])
  const [isImageDragOver, setIsImageDragOver] = useState(false)
  const [isVideoDragOver, setIsVideoDragOver] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).filter(file => file.type.startsWith('image/'))
    setImageFiles((prev) => [...prev, ...files])
  }

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files).filter(file => file.type.startsWith('video/'))
    setVideoFiles((prev) => [...prev, ...files])
  }

  const handleImageDragOver = (e) => {
    e.preventDefault()
    setIsImageDragOver(true)
  }

  const handleImageDragLeave = (e) => {
    e.preventDefault()
    setIsImageDragOver(false)
  }

  const handleImageDrop = (e) => {
    e.preventDefault()
    setIsImageDragOver(false)
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'))
    setImageFiles((prev) => [...prev, ...files])
  }

  const handleVideoDragOver = (e) => {
    e.preventDefault()
    setIsVideoDragOver(true)
  }

  const handleVideoDragLeave = (e) => {
    e.preventDefault()
    setIsVideoDragOver(false)
  }

  const handleVideoDrop = (e) => {
    e.preventDefault()
    setIsVideoDragOver(false)
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('video/'))
    setVideoFiles((prev) => [...prev, ...files])
  }

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const removeVideo = (index) => {
    setVideoFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    
    // Validate required fields
    const newErrors = {}
    if (!formData.title) newErrors.title = "Title is required"
    if (!formData.address) newErrors.address = "Address is required"
    if (!formData.min_price) newErrors.min_price = "Minimum price is required"
    if (!formData.max_price) newErrors.max_price = "Maximum price is required"
    if (!formData.property_type) newErrors.property_type = "Property type is required"
    if (!formData.nearest_landmark) newErrors.nearest_landmark = "Nearest landmark is required"
    
    // Validate price range
    if (formData.min_price && formData.max_price && parseInt(formData.min_price) > parseInt(formData.max_price)) {
      newErrors.max_price = "Maximum price must be greater than minimum price"
    }
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      // Prepare data for API submission
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
        photos: imageFiles, // Image files
        videos: videoFiles  // Video files
      }
      
      console.log("Form submitted:", propertyData, { imageFiles, videoFiles })
      // TODO: Implement API submission logic here
      try {
        const response = await fetch(API_ENDPOINTS.PROPERTIES_DEALER, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(propertyData),
        })
        const result = await response.json()
        if (!result.success) {
          alert(result.message || "Failed to post property")
          return
        }
        alert(result.message || "Property posted successfully")
        setFormData({
          title: "",
          description: "",
          address: "",
          min_price: "",
          max_price: "",
        })
        setImageFiles([])
        setVideoFiles([])
        setErrors({})

      } catch (error) {
        console.error("Error submitting property:", error)
        alert("Failed to post property. Please try again.")
        setErrors({})
      }
    }
  }

  return (
    <div className="post-property-container">
      <div className="post-property-header">
        <h2>Post New Property</h2>
        <p>Add a new property to your portfolio</p>
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
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                placeholder="Describe the property features and amenities"
              />
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
                  required
                />
                {errors.min_price && <span className="error-message">{errors.min_price}</span>}
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
                  required
                />
                {errors.max_price && <span className="error-message">{errors.max_price}</span>}
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
                {errors.property_type && <span className="error-message">{errors.property_type}</span>}
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
              {errors.address && <span className="error-message">{errors.address}</span>}
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
              {errors.nearest_landmark && <span className="error-message">{errors.nearest_landmark}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bedrooms">Bedrooms</label>
                <input
                  type="number"
                  id="bedrooms"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="bathrooms">Bathrooms</label>
                <input
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="0.5"
                />
              </div>

              <div className="form-group">
                <label htmlFor="area">Area (sq ft)</label>
                <input
                  type="number"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Owner Information */}
          <div className="form-section">
            <h3>Owner Information</h3>

            <div className="form-row two-columns">
              <div className="form-group">
                <label htmlFor="owner_name">Owner Name</label>
                <input
                  type="text"
                  id="owner_name"
                  name="owner_name"
                  value={formData.owner_name}
                  onChange={handleInputChange}
                  className={errors.owner_name ? "error" : ""}
                  placeholder="Enter owner's name"
                />
                {errors.owner_name && <span className="error-message">{errors.owner_name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="owner_phone">Owner Phone</label>
                <input
                  type="tel"
                  id="owner_phone"
                  name="owner_phone"
                  value={formData.owner_phone}
                  onChange={handleInputChange}
                  className={errors.owner_phone ? "error" : ""}
                  placeholder="Enter owner's phone number"
                />
                {errors.owner_phone && <span className="error-message">{errors.owner_phone}</span>}
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
            <div
              className={`file-upload-area ${isImageDragOver ? "drag-over" : ""}`}
              onDragOver={handleImageDragOver}
              onDragLeave={handleImageDragLeave}
              onDrop={handleImageDrop}
            >
              <div className="upload-content">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21,15 16,10 5,21"/>
                </svg>
                <h4>Upload Property Images</h4>
                <p>Drag and drop image files here, or click to select</p>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="file-input" />
              </div>
            </div>

            {/* Image Preview Grid */}
            {imageFiles.length > 0 && (
              <div className="media-preview-grid">
                {imageFiles.map((file, index) => (
                  <div key={`img-${index}`} className="media-preview-item">
                    <div className="media-preview">
                      <img src={URL.createObjectURL(file) || "/placeholder.svg"} alt={`Image ${index + 1}`} />
                    </div>
                    <button
                      type="button"
                      className="remove-media-btn"
                      onClick={() => removeImage(index)}
                      aria-label={`Remove ${file.name}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

          {/* Video Upload */}
          <div className="upload-section">
            <h4>Property Videos</h4>
            <div
              className={`file-upload-area ${isVideoDragOver ? "drag-over" : ""}`}
              onDragOver={handleVideoDragOver}
              onDragLeave={handleVideoDragLeave}
              onDrop={handleVideoDrop}
            >
              <div className="upload-content">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polygon points="23,7 16,12 23,17 23,7"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
                <h4>Upload Property Videos</h4>
                <p>Drag and drop video files here, or click to select</p>
                <input type="file" multiple accept="video/*" onChange={handleVideoUpload} className="file-input" />
              </div>
            </div>

            {/* Video Preview Grid */}
            {videoFiles.length > 0 && (
              <div className="media-preview-grid">
                {videoFiles.map((file, index) => (
                  <div key={`vid-${index}`} className="media-preview-item">
                    <div className="media-preview">
                      <div className="video-preview">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="remove-media-btn"
                      onClick={() => removeVideo(index)}
                      aria-label={`Remove ${file.name}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
          <button type="submit" className="submit-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7,10 12,15 17,10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Post Property
          </button>
        </div>
      </form>
    </div>
  )
}

export default PostProperty
