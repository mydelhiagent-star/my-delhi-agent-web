import React, { useState } from "react";
import "./AddClient.css";

export default function AddClient() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    requirement: "",
    aadhar_number: "",
    aadhar_photo: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "aadhar_photo") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.phone) {
      alert("Name and phone are required!");
      return;
    }

    // Create lead data without status field
    const leadData = {
      name: formData.name,
      phone: formData.phone,
      requirement: formData.requirement,
      aadhar_number: formData.aadhar_number,
      aadhar_photo: formData.aadhar_photo,
    };

    try {
      const response = await fetch("http://localhost:8080/leads/admin/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(leadData),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Lead created successfully! Lead ID: ${result.lead_id}`);
        
        // Reset form
        setFormData({
          name: "",
          phone: "",
          requirement: "",
          aadhar_number: "",
          aadhar_photo: "",
        });
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "Failed to create lead"}`);
      }
    } catch (error) {
      console.error("Error creating lead:", error);
      alert("Failed to create lead. Please try again.");
    }
  };

  return (
    <div className="add-client-container">
      <h3 className="add-client-title">Add Client</h3>

      <form onSubmit={handleSubmit} className="add-client-form">
        <input
          type="text"
          name="name"
          placeholder="Client Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="requirement"
          placeholder="Requirement"
          value={formData.requirement}
          onChange={handleChange}
        />

        <input
          type="text"
          name="aadhar_number"
          placeholder="Aadhar Number"
          value={formData.aadhar_number}
          onChange={handleChange}
        />

        <label>Aadhar Photo:</label>
        <input
          type="file"
          name="aadhar_photo"
          accept="image/*"
          onChange={handleChange}
        />

        <button type="submit" className="add-client-submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
}