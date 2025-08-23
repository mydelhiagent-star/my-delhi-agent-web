// src/components/Dashboard/PostProperty.jsx
import React, { useState } from "react";
import "./PostProperty.css";

export default function PostProperty() {
  const [property, setProperty] = useState({
    title: "",
    description: "",
    address: "",
    price: "",
    photos: [],
    videos: [],
    owner_name: "",
    owner_phone: "",
    nearest_landmark: "",
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProperty({ ...property, [name]: value });
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    
    // Console log file names (as requested)
    console.log(`${type} files selected:`, files.map(file => file.name));
    
    // Store file objects directly in property state
    setProperty(prev => ({
      ...prev,
      [type]: files
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsUploading(true);
    
    try {
      // Count total files needed
      const totalPhotos = property.photos.length;
      const totalVideos = property.videos.length;
      const totalFiles = totalPhotos + totalVideos;
      
      let uploadedFileKeys = [];
      
      if (totalFiles > 0) {
        // Simple API call: Just request number of presigned URLs
        const response = await fetch("http://localhost:8080/cloudfare/presigned-urls", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
            count: totalFiles
          })
        });
        
        if (!response.ok) {
          throw new Error("Failed to get presigned URLs");
        }
        
        const { presignedUrls } = await response.json();
        
        // Upload photos first, then videos
        let urlIndex = 0;
        
        // Upload photos
        for (let i = 0; i < totalPhotos; i++) {
          const file = property.photos[i];
          const presignedUrl = presignedUrls[urlIndex].presignedUrl;
          
          const uploadResponse = await fetch(presignedUrl, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type }
          });
          console.log(uploadResponse);
          
          if (!uploadResponse.ok) {
            throw new Error(`Failed to upload ${file.name}`);
          }
          
          uploadedFileKeys.push({
            fileKey: presignedUrls[urlIndex].fileKey,
            category: 'photo'
          });
          urlIndex++;
        }
        
        // Upload videos
        for (let i = 0; i < totalVideos; i++) {
          const file = property.videos[i];
          const presignedUrl = presignedUrls[urlIndex].presignedUrl;
          
          const uploadResponse = await fetch(presignedUrl, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type }
          });
         
          
          if (!uploadResponse.ok) {
            throw new Error(`Failed to upload ${file.name}`);
          }
          
          uploadedFileKeys.push({
            fileKey: presignedUrls[urlIndex].fileKey,
            category: 'video'
          });
          urlIndex++;
        }
      }
      
      // Separate file keys by category
      const uploadedPhotoKeys = uploadedFileKeys
        .filter(file => file.category === 'photo')
        .map(file => file.fileKey);
      
      const uploadedVideoKeys = uploadedFileKeys
        .filter(file => file.category === 'video')
        .map(file => file.fileKey);
      
      // Create property object with uploaded file keys
      const propertyWithFileKeys = {
        ...property,
        photos: uploadedPhotoKeys,
        videos: uploadedVideoKeys,
        price: parseFloat(property.price), 
      };

      console.log(propertyWithFileKeys);
      
      // Send property to backend to add in database
      const propertyResponse = await fetch("http://localhost:8080/properties/dealer/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(propertyWithFileKeys)
      });
      
      if (!propertyResponse.ok) {
        throw new Error("Failed to create property in database");
      }

      alert("Property posted successfully!");
      
      // Reset form
      setProperty({
        title: "",
        description: "",
        address: "",
        price: "",
        photos: [],
        videos: [],
        owner_name: "",
        owner_phone: "",
        nearest_landmark: "",
      });
      
    } catch (error) {
      console.error("Failed to post property:", error);
      alert("Failed to post property. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-property-form">
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={property.title}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={property.description}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="address"
        placeholder="Address"
        value={property.address}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="price"
        placeholder="Price"
        value={property.price}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="owner_name"
        placeholder="Owner Name"
        value={property.owner_name}
        onChange={handleChange}
      />

      <input
        type="text"
        name="owner_phone"
        placeholder="Owner Phone"
        value={property.owner_phone}
        onChange={handleChange}
      />

      <input
        type="text"
        name="nearest_landmark"
        placeholder="Nearest Landmark"
        value={property.nearest_landmark}
        onChange={handleChange}
      />

      <label>Upload Photos (Optional):</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFileChange(e, "photos")}
      />
      {property.photos.length > 0 && (
        <div className="selected-files">
          Selected Photos: {property.photos.map(f => f.name).join(", ")}
        </div>
      )}

      <label>Upload Videos (Optional):</label>
      <input
        type="file"
        multiple
        accept="video/*"
        onChange={(e) => handleFileChange(e, "videos")}
      />
      {property.videos.length > 0 && (
        <div className="selected-files">
          Selected Videos: {property.videos.map(f => f.name).join(", ")}
        </div>
      )}

      <button type="submit" disabled={isUploading}>
        {isUploading ? "Uploading & Posting..." : "Post Property"}
      </button>
    </form>
  );
}