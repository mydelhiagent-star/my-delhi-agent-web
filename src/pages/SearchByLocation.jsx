import { useState, useEffect } from "react";
import LocationDropdown from "../components/LocationDropdown/LocationDropdown";
// keep using static for now
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import SearchProperties from "../components/Admin/SearchProperty"; // import your SearchProperty component
import "./SearchByLocation.css";
import { API_ENDPOINTS } from "../config/api";

export default function SearchByLocation() {
  const [selected, setSelected] = useState({ location: "", sub_location: "" });
  const [locations, setLocations] = useState([]);
  const [dealers, setDealers] = useState([]); // dealers from API

  // 🔹 Fetch location → sub_location mapping from API
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const res = await fetch(
          API_ENDPOINTS.ADMIN_DEALERS_LOCATIONS
        );
        const data = await res.json();
        setLocations(data); // [{location: "...", sub_location: ["..",".."]}]
      } catch (err) {
        console.error("Error fetching locations:", err);
      }
    };

    loadLocations();
  }, []);

  // 🔹 Fetch dealers AND their properties when sub_location changes
  useEffect(() => {
    const fetchDealersAndProperties = async () => {
      if (!selected.sub_location) return;

      const token = localStorage.getItem("token");

      try {
        const res = await fetch(
          `${API_ENDPOINTS.ADMIN_DEALERS_WITH_PROPERTIES}?subLocation=${selected.sub_location}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          // Handle error response
          const errData = await res.json();
          console.error("Backend error:", errData.error || "Unknown error");
          setDealers([]); // ensure dealers is always an array
          return;
        }

        const dealersData = await res.json();

        if (Array.isArray(dealersData)) {
          setDealers(dealersData);
        } else {
          setDealers([]); // fallback safeguard
        }
      } catch (err) {
        console.error("Error fetching dealers:", err);
        setDealers([]);
      }
    };

    fetchDealersAndProperties();
  }, [selected.sub_location]);

  return (
    <div className="search-location-container">
      <h2 className="search-location-title">Search Dealers & Properties</h2>

      {/* 🔹 Pass API data into dropdown */}
      <LocationDropdown
        locations={locations}
        onSelect={(sel) => setSelected(sel)}
      />

      {/* Dealers */}
      {selected.location && selected.sub_location && (
        <>
          <h3 className="search-location-dealers-title">Dealers</h3>
          {dealers.length > 0 ? (
            <table className="search-location-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Office Address</th>
                  <th>Shop Name</th>
                  <th>Location</th>
                  <th>Sub Location</th>
                </tr>
              </thead>
              <tbody>
                {dealers.map((dealer, idx) => (
                  <tr key={idx}>
                    <td>{dealer.name}</td>
                    <td>{dealer.phone}</td>
                    <td>{dealer.email}</td>
                    <td>{dealer.office_address}</td>
                    <td>{dealer.shop_name}</td>
                    <td>{dealer.location}</td>
                    <td>{dealer.sub_location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="search-location-no-dealers">No dealers found.</p>
          )}

          {/* Properties */}
          {dealers.map((dealer) => (
            <div key={dealer.id} className="search-location-dealer-section">
              <h3 className="search-location-dealer-properties-title">{dealer.name} – Properties</h3>
              <SearchProperties
                properties={
                  Array.isArray(dealer.properties) ? dealer.properties : []
                }
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
}
