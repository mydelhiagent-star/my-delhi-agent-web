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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProperty({ ...property, [name]: value });
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files).map((file) =>
      URL.createObjectURL(file)
    );
    setProperty({ ...property, [type]: files });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let properties = JSON.parse(localStorage.getItem("myProperties")) || [];
    properties.push({ ...property, id: Date.now() });
    localStorage.setItem("myProperties", JSON.stringify(properties));

    alert("Property posted successfully!");
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

      <label>Upload Photos:</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFileChange(e, "photos")}
      />

      <label>Upload Videos:</label>
      <input
        type="file"
        multiple
        accept="video/*"
        onChange={(e) => handleFileChange(e, "videos")}
      />

      <button type="submit">
        Post Property
      </button>
    </form>
  );
}
