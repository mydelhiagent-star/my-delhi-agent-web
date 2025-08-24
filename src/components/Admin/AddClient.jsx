import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./AddClient.css";

export default function AddClient() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    requirement: "",
    status: "",
    aadhar_number: "",
    aadhar_photo: "",
  });

  // ← GET property_id and dealer_id from URL query params
  useEffect(() => {
    const propertyId = searchParams.get("property_id");
    const dealerId = searchParams.get("dealer_id");
    
    // Store in formData for submission (hidden from user)
    if (propertyId && dealerId) {
      setFormData(prev => ({
        ...prev,
        property_id: propertyId,
        dealer_id: dealerId,
      }));
    }
  }, [searchParams]);

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

    // Check if we have property info
    if (!formData.property_id || !formData.dealer_id) {
      alert("Property information is missing!");
      return;
    }

    // ← TRANSFORM data to match your backend Lead model
    const leadData = {
      name: formData.name,
      phone: formData.phone,
      properties: [
        {
          property_id: formData.property_id,
          dealer_id: formData.dealer_id,
          status: formData.status,
        }
      ],
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
          status: "",
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
      
      {/* ← SHOW property info if from URL (optional) */}
      {searchParams.get("property_id") && (
        <div className="property-info">
          <p>Creating lead for Property ID: {searchParams.get("property_id")}</p>
        </div>
      )}

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

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="status-dropdown"
        >
          <option value="">Select Status</option>
          <option value="viewed">Viewed</option>
          <option value="processing">Processing</option>
          <option value="purchased">Purchased</option>
          <option value="not_interested">Not Interested</option>
        </select>

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