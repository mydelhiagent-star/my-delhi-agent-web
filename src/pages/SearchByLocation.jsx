import { useState } from "react";
import LocationDropdown from "../components/LocationDropdown/LocationDropdown";
import { dealers } from "../constants/dealers";

export default function SearchByLocation() {
  const [selected, setSelected] = useState({ location: "", sub_location: "" });

  const filteredDealers = dealers.filter(
    (dealer) =>
      dealer.location === selected.location &&
      dealer.sub_location === selected.sub_location
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>Search Dealers by Location</h2>
      <LocationDropdown onSelect={(sel) => setSelected(sel)} />

      {selected.location && selected.sub_location && (
        <div style={{ marginTop: "20px" }}>
          <h3>
            Showing Dealers in {selected.location} - {selected.sub_location}
          </h3>
          {filteredDealers.length > 0 ? (
            <table border="1" cellPadding="8">
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
                {filteredDealers.map((dealer, idx) => (
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
            <p>No dealers found for this location.</p>
          )}
        </div>
      )}
    </div>
  );
}
