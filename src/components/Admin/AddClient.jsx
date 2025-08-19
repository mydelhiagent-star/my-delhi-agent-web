import React, { useState } from "react";
import "./AddClient.css";

export default function AddClient() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    requirement: "",
    status: "",
    aadhar_number: "",
    aadhar_photo: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "aadhar_photo") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Client Data Submitted:", formData);

    // ✅ later you can send to backend:
    // fetch("/api/clients", { method: "POST", body: JSON.stringify(formData) })

    alert("Client Added Successfully!");
    setFormData({
      name: "",
      phone: "",
      requirement: "",
      status: "",
      aadhar_number: "",
      aadhar_photo: "",
    });
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

        <input
          type="text"
          name="status"
          placeholder="Status"
          value={formData.status}
          onChange={handleChange}
        />

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
