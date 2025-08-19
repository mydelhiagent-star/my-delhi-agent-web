import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginModal.css";

export default function LoginModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    phone: "",
    password: "",
    general: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // allow only numbers
    if (value.length > 10) value = value.slice(0, 10); // limit to 10 digits
    setFormData({ ...formData, [e.target.name]: value });
    
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = { phone: "", password: "", general: "" };
    let isValid = true;

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (formData.phone.length !== 10) {
      newErrors.phone = "Phone number must be 10 digits";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({ phone: "", password: "", general: "" });

    try {
      const response = await fetch("http://localhost:8080/auth/dealers/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: formData.phone, password: formData.password }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (result.error) {
          if (result.error.toLowerCase().includes("phone")) {
            setErrors(prev => ({ ...prev, phone: result.error }));
          } else if (result.error.toLowerCase().includes("password")) {
            setErrors(prev => ({ ...prev, password: result.error }));
          } else {
            setErrors(prev => ({ ...prev, general: result.error }));
          }
        } else {
          setErrors(prev => ({ ...prev, general: "Login failed. Please try again." }));
        }
        return;
      }

      // Login successful
      console.log("Login successful:", result);
      
      // Save token
      localStorage.setItem("token", result.token);
      
      // Close modal and redirect to dashboard
      onClose();
      navigate("/dashboard");
      
    } catch (error) {
      console.error("Unexpected error:", error);
      setErrors(prev => ({ ...prev, general: "Something went wrong. Please try again." }));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="mda-modal-overlay" onClick={onClose}>
      <div className="mda-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="mda-modal-close" onClick={onClose}>
          ×
        </button>
        
        <div className="mda-modal-header">
          <h2>Broker Login</h2>
          <p>Sign in to access your dashboard</p>
        </div>

        <form className="mda-modal-form" onSubmit={handleSubmit}>
          <div className="mda-form-group">
            <label htmlFor="phone">Phone Number</label>
            <div className="mda-phone-input">
              <span className="mda-phone-prefix">+91</span>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Enter 10-digit phone number"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? "mda-input-error" : ""}
                required
              />
            </div>
            {errors.phone && <span className="mda-error-text">{errors.phone}</span>}
          </div>

          <div className="mda-form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (errors.password) {
                  setErrors(prev => ({ ...prev, password: "" }));
                }
              }}
              className={errors.password ? "mda-input-error" : ""}
              required
            />
            {errors.password && <span className="mda-error-text">{errors.password}</span>}
          </div>

          {errors.general && (
            <div className="mda-general-error">
              {errors.general}
            </div>
          )}

          <button 
            type="submit" 
            className="mda-signin-btn"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}