import { useState } from "react";

export default function LocationDropdown({ locations = [], onSelect }) {
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

  // Handle both direct array and API response object
  // API response structure: { success: true, data: [...], curTime: "..." }
  // Direct array structure: [{ location: "Noida", sub_location: [...] }, ...]
  const locationsArray = locations.data || locations;
  
  // Convert locations array into a map for easy lookup
  const locationMap = {};
  locationsArray.forEach((loc) => {
    locationMap[loc.location] = loc.sub_location;
  });

  return (
    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
      <select value={location} onChange={handleLocationChange}>
        <option value="">Select Location</option>
        {Object.keys(locationMap).map((loc, idx) => (
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
          locationMap[location]?.map((sub, idx) => (
            <option key={idx} value={sub}>
              {sub}
            </option>
          ))}
      </select>
    </div>
  );
}
