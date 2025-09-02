// src/components/Dashboard/PostProperty.jsx
import React, { useEffect, useRef, useState } from "react";
import "./PostProperty.css";
import { API_ENDPOINTS } from "../../config/api";

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
  const [previews, setPreviews] = useState({ photos: [], videos: [] });
  const previousObjectUrlsRef = useRef({ photos: [], videos: [] });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProperty({ ...property, [name]: value });
  };

  const handleFileChange = (e, type) => {
    const newFiles = Array.from(e.target.files || []);
    console.log(
      `${type} files selected:`,
      newFiles.map((file) => file.name)
    );

    // Create object URLs for new files only (append behavior)
    const newUrls = newFiles.map((file) => URL.createObjectURL(file));

    // Accumulate for cleanup later
    previousObjectUrlsRef.current[type] = [
      ...(previousObjectUrlsRef.current[type] || []),
      ...newUrls,
    ];

    // Append to existing state
    setProperty((prev) => ({
      ...prev,
      [type]: [...(prev[type] || []), ...newFiles],
    }));
    setPreviews((prev) => ({
      ...prev,
      [type]: [...(prev[type] || []), ...newUrls],
    }));
  };

  const handleRemoveMedia = (type, index) => {
    setPreviews((prev) => {
      const urls = [...prev[type]];
      const [removedUrl] = urls.splice(index, 1);
      if (removedUrl) URL.revokeObjectURL(removedUrl);
      previousObjectUrlsRef.current[type] = (
        previousObjectUrlsRef.current[type] || []
      ).filter((u) => u !== removedUrl);
      return { ...prev, [type]: urls };
    });
    setProperty((prev) => {
      const files = [...prev[type]];
      files.splice(index, 1);
      return { ...prev, [type]: files };
    });
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      previousObjectUrlsRef.current.photos.forEach((url) =>
        URL.revokeObjectURL(url)
      );
      previousObjectUrlsRef.current.videos.forEach((url) =>
        URL.revokeObjectURL(url)
      );
    };
  }, []);

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
        const response = await fetch(API_ENDPOINTS.PRESIGNED_URLS, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            count: totalFiles,
          }),
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
            headers: { "Content-Type": file.type },
          });

          if (!uploadResponse.ok) {
            throw new Error(`Failed to upload ${file.name}`);
          }

          uploadedFileKeys.push({
            fileKey: presignedUrls[urlIndex].fileKey,
            category: "photo",
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
            headers: { "Content-Type": file.type },
          });

          if (!uploadResponse.ok) {
            throw new Error(`Failed to upload ${file.name}`);
          }

          uploadedFileKeys.push({
            fileKey: presignedUrls[urlIndex].fileKey,
            category: "video",
          });
          urlIndex++;
        }
      }

      // Separate file keys by category
      const uploadedPhotoKeys = uploadedFileKeys
        .filter((file) => file.category === "photo")
        .map((file) => file.fileKey);

      const uploadedVideoKeys = uploadedFileKeys
        .filter((file) => file.category === "video")
        .map((file) => file.fileKey);

      // Create property object with uploaded file keys
      const propertyWithFileKeys = {
        ...property,
        photos: uploadedPhotoKeys,
        videos: uploadedVideoKeys,
        price: parseFloat(property.price),
      };

      console.log(propertyWithFileKeys);

      // Send property to backend to add in database
      const propertyResponse = await fetch(API_ENDPOINTS.PROPERTIES_DEALER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(propertyWithFileKeys),
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
      {previews.photos.length > 0 && (
        <div className="media-preview-grid">
          {previews.photos.map((src, idx) => (
            <div key={idx} className="media-preview-item">
              <button
                type="button"
                className="media-remove-btn"
                onClick={() => handleRemoveMedia("photos", idx)}
              >
                ×
              </button>
              <img src={src} alt={`preview-${idx}`} />
            </div>
          ))}
        </div>
      )}

      <label>Upload Videos (Optional):</label>
      <input
        type="file"
        multiple
        accept="video/*"
        onChange={(e) => handleFileChange(e, "videos")}
      />
      {previews.videos.length > 0 && (
        <div className="media-preview-grid">
          {previews.videos.map((src, idx) => (
            <div key={idx} className="media-preview-item">
              <button
                type="button"
                className="media-remove-btn"
                onClick={() => handleRemoveMedia("videos", idx)}
              >
                ×
              </button>
              <video controls>
                <source src={src} type="video/mp4" />
              </video>
            </div>
          ))}
        </div>
      )}

      <button type="submit" disabled={isUploading}>
        {isUploading ? "Uploading & Posting..." : "Post Property"}
      </button>
    </form>
  );
}
