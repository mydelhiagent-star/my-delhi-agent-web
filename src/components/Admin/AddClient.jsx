import React, { useState } from "react";

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
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h3>Add Client</h3>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginTop: "15px",
        }}
      >
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

        <button
          type="submit"
          style={{
            padding: "10px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
