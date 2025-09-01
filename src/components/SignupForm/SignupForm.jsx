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
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Signup successful:", data);
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

      alert("Signup successful!");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    
    // TODO: API call here
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

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          autoComplete="tel"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="office_address"
          placeholder="Office Address"
          autoComplete="street-address"
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

        <input
          type="text"
          name="sub_location"
          placeholder="Sub Location"
          value={formData.sub_location}
          onChange={handleChange}
          required
        />

        <button type="submit" className="add-client-submit-btn">Submit</button>
      </form>
    </div>
  );
}
