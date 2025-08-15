import { useState } from "react";
import "./LoginForm.css";

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
      const response = await fetch("http://localhost:8080/auth/login", {
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
      // window.location.href = "/dashboard"; // optional redirect
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
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
      <a href="/forgot-password" className="forgot-link">
        Forgot Password?
      </a>
    </form>
  );
}
