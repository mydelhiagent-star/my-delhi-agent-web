import React, { useState } from "react";
import "./InquiryForm.css";
import { API_ENDPOINTS } from "../../config/api";

export default function InquiryForm({ variant = "broker" }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    requirement: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
      // Allow only numbers and limit to 10 digits
      const phoneValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, [name]: phoneValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation (only required for home page variant)
    if (variant === "home" && !formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim() && formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Phone validation (only required for home page variant)
    if (variant === "home" && !formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.trim() && !/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    // Requirement validation (always required)
    if (!formData.requirement.trim()) {
      newErrors.requirement = "Requirement is required";
    } else if (formData.requirement.trim().length < 10) {
      newErrors.requirement = "Please provide more details about your requirement (minimum 10 characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const response = await fetch(API_ENDPOINTS.INQUIRY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // If authentication is required
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          requirement: formData.requirement.trim(),
        })
      });
  
      const result = await response.json();
  
      if (response.ok && result.success) {
        alert("Thank you for your inquiry! We'll get back to you soon.");
        
        // Reset form
        setFormData({
          name: "",
          phone: "",
          requirement: "",
        });
        setErrors({});
      } else {
        throw new Error(result.message || 'Failed to submit inquiry');
      }
      
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      alert("Sorry, there was an error submitting your inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`inquiry-form-container ${variant}`}>
      <div className="inquiry-form-header">
        <h3>
          {variant === "broker" ? "Broker Inquiry" : "Get In Touch"}
        </h3>
        <p>
          {variant === "broker" 
            ? "Tell us about your property requirements and we'll help you find the perfect match."
            : "Fill out the form below and we'll contact you with the best property options."
          }
        </p>
      </div>

      <form className="inquiry-form" onSubmit={handleSubmit} noValidate>
        <div className="inquiry-form-group">
          <label htmlFor="name">
            Name {variant === "home" && <span className="required">*</span>}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "inquiry-input-error" : ""}
            required={variant === "home"}
          />
          {errors.name && <span className="inquiry-error-text">{errors.name}</span>}
        </div>

        <div className="inquiry-form-group">
          <label htmlFor="phone">
            Phone Number {variant === "home" && <span className="required">*</span>}
          </label>
          <div className="inquiry-phone-input">
            <span className="inquiry-phone-prefix">+91</span>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Enter 10-digit phone number"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? "inquiry-input-error" : ""}
              required={variant === "home"}
            />
          </div>
          {errors.phone && <span className="inquiry-error-text">{errors.phone}</span>}
        </div>

        <div className="inquiry-form-group">
          <label htmlFor="requirement">
            Property Requirement <span className="required">*</span>
          </label>
          <textarea
            id="requirement"
            name="requirement"
            placeholder="Describe your property requirements (location, budget, type, etc.)"
            value={formData.requirement}
            onChange={handleChange}
            className={errors.requirement ? "inquiry-input-error" : ""}
            rows="4"
            required
          />
          {errors.requirement && <span className="inquiry-error-text">{errors.requirement}</span>}
        </div>

        <button 
          type="submit" 
          className="inquiry-submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="inquiry-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Submitting...
            </>
          ) : (
            variant === "broker" ? "Submit Inquiry" : "Send Inquiry"
          )}
        </button>
      </form>

      <div className="inquiry-form-footer">
        <p>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          Need immediate assistance? Call us at{" "}
          <a href="tel:+919876543210" className="inquiry-phone-link">
            +91 98765 43210
          </a>
        </p>
      </div>
    </div>
  );
}
