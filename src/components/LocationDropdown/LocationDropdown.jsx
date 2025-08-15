import { useState } from "react";

const locationData = {
  Noida: ["Sector 62", "Sector 61", "Sector 52"],
  "Mayur Vihar": ["Extension", "Pocket-I"],
  Delhi: ["Laxmi Nagar", "Preet Vihar"],
};

export default function LocationDropdown({ onSelect }) {
  const [location, setLocation] = useState("");
  const [subLocation, setSubLocation] = useState("");

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
    setSubLocation("");
    onSelect({ location: e.target.value, sub_location: "" });
  };

  const handleSubLocationChange = (e) => {
    setSubLocation(e.target.value);
    onSelect({ location, sub_location: e.target.value });
  };

  return (
    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
      <select value={location} onChange={handleLocationChange}>
        <option value="">Select Location</option>
        {Object.keys(locationData).map((loc, idx) => (
          <option key={idx} value={loc}>
            {loc}
          </option>
        ))}
      </select>

      <select
        value={subLocation}
        onChange={handleSubLocationChange}
        disabled={!location}
      >
        <option value="">Select Sub Location</option>
        {location &&
          locationData[location].map((sub, idx) => (
            <option key={idx} value={sub}>
              {sub}
            </option>
          ))}
      </select>
    </div>
  );
}
