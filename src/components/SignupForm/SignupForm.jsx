import { useState } from "react";
import "./SignupForm.css";
import "../Admin/AddClient.css";
import { API_ENDPOINTS } from "../../config/api";
import { locations } from "../../constants/locations";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    email: "",
    office_address: "",
    shop_name: "",
    location: "",
    sub_location: "",
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
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    // Email validation
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Office address validation
    if (!formData.office_address.trim()) {
      newErrors.office_address = "Office address is required";
    }

    // Shop name validation
    if (!formData.shop_name.trim()) {
      newErrors.shop_name = "Shop name is required";
    }

    // Location validation
    if (!formData.location) {
      newErrors.location = "Please select a location";
    }

    // Sub location validation
    if (!formData.sub_location.trim()) {
      newErrors.sub_location = "Sub location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

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
      const response = await fetch(
        API_ENDPOINTS.REGISTER,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Network response was not ok");
      }

      const data = await response.json();
      console.log("Signup successful:", data);
      
      // Reset form
      setFormData({
        name: "",
        phone: "",
        password: "",
        email: "",
        office_address: "",
        shop_name: "",
        location: "",
        sub_location: "",
      });

      // Clear errors
      setErrors({});

      alert("Dealer added successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Error: ${error.message || "Failed to add dealer. Please try again."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-client-container">
      <h3 className="add-client-title">Add Dealer</h3>
      <form onSubmit={handleSubmit} className="add-client-form" noValidate>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          autoComplete="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        {errors.name && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '0.25rem'}}>{errors.name}</div>}

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          autoComplete="tel"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        {errors.phone && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '0.25rem'}}>{errors.phone}</div>}

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '0.25rem'}}>{errors.email}</div>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {errors.password && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '0.25rem'}}>{errors.password}</div>}

        <input
          type="text"
          name="office_address"
          placeholder="Office Address"
          autoComplete="street-address"
          value={formData.office_address}
          onChange={handleChange}
          required
        />
        {errors.office_address && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '0.25rem'}}>{errors.office_address}</div>}

        <input
          type="text"
          name="shop_name"
          placeholder="Shop Name"
          value={formData.shop_name}
          onChange={handleChange}
          required
        />
        {errors.shop_name && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '0.25rem'}}>{errors.shop_name}</div>}

        <select
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          className="add-client-form select"
        >
          <option value="">Select Location</option>
          {locations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>
        {errors.location && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '0.25rem'}}>{errors.location}</div>}

        <input
          type="text"
          name="sub_location"
          placeholder="Sub Location"
          value={formData.sub_location}
          onChange={handleChange}
          required
        />
        {errors.sub_location && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '0.25rem'}}>{errors.sub_location}</div>}

        <button 
          type="submit" 
          className="add-client-submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding Dealer..." : "Submit"}
        </button>
      </form>
    </div>
  );
}