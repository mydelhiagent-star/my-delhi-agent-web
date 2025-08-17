import { useState, useEffect } from "react";
import LocationDropdown from "../components/LocationDropdown/LocationDropdown";
// keep using static for now
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import SearchProperties from "../components/Admin/SearchProperty"; // import your SearchProperty component

export default function SearchByLocation() {
  const [selected, setSelected] = useState({ location: "", sub_location: "" });
  const [locations, setLocations] = useState([]);
  const [dealers, setDealers] = useState([]); // dealers from API

  // 🔹 Fetch location → sub_location mapping from API
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/admin/dealers/locations/sublocations"
        );
        const data = await res.json();
        setLocations(data); // [{location: "...", sub_location: ["..",".."]}]
      } catch (err) {
        console.error("Error fetching locations:", err);
      }
    };

    loadLocations();
  }, []);

  // 🔹 Fetch dealers when sub_location changes
  useEffect(() => {
    const fetchDealers = async () => {
      if (selected.sub_location) {
        try {
          const res = await fetch(
            `http://localhost:8080/admin/dealers/by-sublocation?subLocation=${selected.sub_location}`
          );
          const data = await res.json();
          setDealers(data); // response from your Go API
        } catch (err) {
          console.error("Error fetching dealers:", err);
          setDealers([]);
        }
      } else {
        setDealers([]);
      }
    };

    fetchDealers();
  }, [selected.sub_location]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Search Dealers & Properties</h2>

      {/* 🔹 Pass API data into dropdown */}
      <LocationDropdown
        locations={locations}
        onSelect={(sel) => setSelected(sel)}
      />

      {/* Dealers */}
      {selected.location && selected.sub_location && (
        <>
          <h3 style={{ marginTop: "20px" }}>Dealers</h3>
          {dealers.length > 0 ? (
            <table
              border="1"
              cellPadding="8"
              style={{ width: "100%", marginBottom: "30px" }}
            >
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
            <p>No dealers found.</p>
          )}

          {/* Properties */}
          <SearchProperties />
        </>
      )}
    </div>
  );
}
