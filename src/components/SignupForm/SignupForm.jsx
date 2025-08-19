import { useState } from "react";
import "./signupForm.css";

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:8080/auth/dealers/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Signup successful:", data);
      alert("Signup successful!");
      window.location.href = "/";
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    console.log("Form Submitted", formData);
    // TODO: API call here
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <h2>Broker / Builder Sign Up</h2>

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleChange}
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="office_address"
        placeholder="Office Address"
        value={formData.office_address}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="shop_name"
        placeholder="Shop Name"
        value={formData.shop_name}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="sub_location"
        placeholder="Sub Location"
        value={formData.sub_location}
        onChange={handleChange}
        required
      />

      <button type="submit">Sign Up</button>
    </form>
  );
}
