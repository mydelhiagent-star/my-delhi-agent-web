import { useState } from "react";
import "./LoginModal.css";

export default function LoginModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // allow only numbers
    if (value.length > 10) value = value.slice(0, 10); // limit to 10 digits
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { phone, password } = formData;

    if (!phone || phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!password) {
      alert("Password is required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/auth/dealers/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Login failed");
        return;
      }

      console.log("Login successful:", result);

      // Save token and optionally redirect
      localStorage.setItem("token", result.token);
      alert("Login successful!");
      onClose();
      // window.location.href = "/dashboard"; // optional redirect
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Something went wrong. Please try again.");
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
                required
              />
            </div>
          </div>

          <div className="mda-form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="mda-signin-btn">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
