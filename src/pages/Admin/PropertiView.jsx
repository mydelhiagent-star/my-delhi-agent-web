import React, { useEffect, useState } from "react";

// Dummy properties (you can later fetch from backend or use properties.js)
const dummyProperties = [
  {
    title: "Luxury Apartment in Sector 62",
    description: "3BHK fully furnished apartment with modern amenities.",
    address: "Tower 4, Residency Complex, Sector 62, Noida",
    price: 8500000,
    photos: [
      "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg",
      "https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg",
    ],
    videos: ["https://www.w3schools.com/html/mov_bbb.mp4"],
    owner_name: "Ravi Kumar",
    owner_phone: "+91 9876543210",
    nearest_landmark: "Electronic City Metro",
    location: "Noida Electronic City",
    sub_location: "sector 18",
  },
  {
    title: "Luxury Apartment in Sector 62",
    description: "3BHK fully furnished apartment with modern amenities.",
    address: "Tower 4, Residency Complex, Sector 62, Noida",
    price: 8500000,
    photos: [
      "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg",
      "https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg",
    ],
    videos: ["https://www.w3schools.com/html/mov_bbb.mp4"],
    owner_name: "Ravi Kumar",
    owner_phone: "+91 9876543210",
    nearest_landmark: "Electronic City Metro",
    location: "Noida",
    sub_location: "Sector 62",
  },
  {
    title: "Luxury Apartment in Sector 62",
    description: "3BHK fully furnished apartment with modern amenities.",
    address: "Tower 4, Residency Complex, Sector 62, Noida",
    price: 8500000,
    photos: [
      "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg",
      "https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg",
    ],
    videos: ["https://www.w3schools.com/html/mov_bbb.mp4"],
    owner_name: "Ravi Kumar",
    owner_phone: "+91 9876543210",
    nearest_landmark: "Electronic City Metro",
    location: "Noida",
    sub_location: "Sector 62",
  },
];

export default function SearchProperty() {
  const [properties, setProperties] = useState(dummyProperties);
  const [showOwner, setShowOwner] = useState({});

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem("token"); // assuming JWT is stored here
        const response = await fetch(
          "http://localhost:8080/properties/dealer/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }

        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  const toggleOwner = (index) => {
    setShowOwner((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Property Listings
      </h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        {properties.map((prop, index) => (
          <div
            key={index}
            style={{
              width: "320px",
              background: "#fff",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Carousel */}
            <div style={{ position: "relative", height: "200px" }}>
              <div
                style={{
                  display: "flex",
                  overflowX: "auto",
                  scrollSnapType: "x mandatory",
                  height: "100%",
                }}
              >
                {prop.photos.map((photo, i) => (
                  <img
                    key={i}
                    src={photo}
                    alt={`Property ${i}`}
                    style={{
                      minWidth: "100%",
                      objectFit: "cover",
                      scrollSnapAlign: "center",
                    }}
                  />
                ))}
                {prop.videos.map((video, i) => (
                  <video
                    key={i}
                    controls
                    style={{
                      minWidth: "100%",
                      objectFit: "cover",
                      scrollSnapAlign: "center",
                    }}
                  >
                    <source src={video} type="video/mp4" />
                  </video>
                ))}
              </div>
            </div>

            {/* Property Details */}
            <div style={{ padding: "15px" }}>
              <h3>{prop.title}</h3>
              <p style={{ color: "#555" }}>{prop.description}</p>
              <p>
                <b>Address:</b> {prop.address}
              </p>
              <p>
                <b>Nearest Landmark:</b> {prop.nearest_landmark}
              </p>
              <p
                style={{
                  fontSize: "18px",
                  color: "#007bff",
                  fontWeight: "bold",
                }}
              >
                ₹{prop.price.toLocaleString()}
              </p>

              {/* Owner Details */}
              {showOwner[index] ? (
                <div
                  style={{
                    marginTop: "10px",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    background: "#f9f9f9",
                  }}
                >
                  <p>
                    <b>Owner:</b> {prop.owner_name}
                  </p>
                  <p>
                    <b>Phone:</b> {prop.owner_phone}
                  </p>
                </div>
              ) : null}

              <button
                onClick={() => toggleOwner(index)}
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "5px",
                  background: "#28a745",
                  color: "#fff",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                {showOwner[index] ? "Hide Details" : "Show Owner Details"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
