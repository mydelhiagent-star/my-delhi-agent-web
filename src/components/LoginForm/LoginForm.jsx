import { useState } from "react";
import "./LoginForm.css";
import { API_ENDPOINTS } from "../../config/api";

export default function LoginForm() {
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
    console.log("Login form submitted");
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
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, password }),
      });

      const result = await response.json();

      if (!result.success) {
        alert(result.message || "Login failed");
        return;
      }

      console.log("Login successful:", result);

      // Save token and optionally redirect
      localStorage.setItem("token", result.data.token);
    
      window.location.href = "/dashboard"; // optional redirect
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleForgotPassword = () => {
    alert("Please contact us on WhatsApp for password recovery assistance. Our support team will help you reset your password.");
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="broker-notice">
        This login is only for registered brokers. If you want to register as a broker, contact us.
      </div>
      <h2>Broker / Builder Login</h2>

      <div className="phone-input-wrapper">
        <span className="phone-prefix">+91</span>
        <input
          type="tel"
          name="phone"
          placeholder="Enter 10-digit phone number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />

      <button type="submit">Login</button>
      
      <div className="forgot-password-section">
        <button 
          type="button" 
          className="forgot-password-btn"
          onClick={handleForgotPassword}
        >
          Forgot Password? Contact us on WhatsApp
        </button>
      </div>
    </form>
  );
}
