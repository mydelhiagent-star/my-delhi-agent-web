import React, { useState } from "react";
import "./AddClient.css";
import { API_ENDPOINTS } from "../../config/api";

export default function AddClient() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    requirement: "",
    aadhar_number: "",
    aadhar_photo: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      newErrors.name = "Name can only contain letters and spaces";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = "Phone number must start with 6, 7, 8, or 9";
    }

    // Requirement validation
    if (formData.requirement.trim() && formData.requirement.trim().length < 5) {
      newErrors.requirement = "Requirement must be at least 5 characters";
    }

    // Aadhar validation
    if (formData.aadhar_number && formData.aadhar_number.trim()) {
      if (!/^\d{12}$/.test(formData.aadhar_number.trim())) {
        newErrors.aadhar_number = "Aadhar number must be exactly 12 digits";
      }
    }

    // Aadhar photo validation
    if (formData.aadhar_photo) {
      const fileSize = formData.aadhar_photo.size / 1024 / 1024; // Size in MB
      if (fileSize > 5) {
        newErrors.aadhar_photo = "File size must be less than 5MB";
      }
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(formData.aadhar_photo.type)) {
        newErrors.aadhar_photo = "Only JPEG, JPG, and PNG files are allowed";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "aadhar_photo") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const leadData = {
        name: formData.name,
        phone: formData.phone,
        requirement: formData.requirement,
        aadhar_number: formData.aadhar_number,
        aadhar_photo: formData.aadhar_photo,
      };

      const response = await fetch(API_ENDPOINTS.LEADS_ADMIN, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(leadData),
      });

      const result = await response.json();

      if (result.success) {
        alert(`Lead created successfully! Lead ID: ${result.data?.lead_id || result.data?.id || 'N/A'}`);
        
        // Reset form
        setFormData({
          name: "",
          phone: "",
          requirement: "",
          aadhar_number: "",
          aadhar_photo: "",
        });

        // Clear errors
        setErrors({});

        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
          fileInput.value = '';
        }
      } else {
        alert(`Error: ${result.message || "Failed to create lead"}`);
      }
    } catch (error) {
      console.error("Error creating lead:", error);
      alert("Failed to create lead. Please try again.");
    } finally {
      setIsSubmitting(false);
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
        {errors.name && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '0.25rem'}}>{errors.name}</div>}

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        {errors.phone && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '0.25rem'}}>{errors.phone}</div>}

        <input
          type="text"
          name="requirement"
          placeholder="Requirement"
          value={formData.requirement}
          onChange={handleChange}
        />
        {errors.requirement && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '0.25rem'}}>{errors.requirement}</div>}

        <input
          type="text"
          name="aadhar_number"
          placeholder="Aadhar Number (12 digits)"
          value={formData.aadhar_number}
          onChange={handleChange}
          maxLength="12"
        />
        {errors.aadhar_number && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '0.25rem'}}>{errors.aadhar_number}</div>}

        <label>Aadhar Photo:</label>
        <input
          type="file"
          name="aadhar_photo"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleChange}
        />
        {errors.aadhar_photo && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '0.25rem'}}>{errors.aadhar_photo}</div>}

        <button 
          type="submit" 
          className="add-client-submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Lead..." : "Submit"}
        </button>
      </form>
    </div>
  );
}