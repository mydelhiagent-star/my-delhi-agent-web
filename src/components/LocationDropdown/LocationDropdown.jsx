import { useState } from "react";
import { locations } from "../../constants/locations";
import "./LocationDropdown.css";

export default function LocationDropdown({ onSelect }) {
  const [activeLocation, setActiveLocation] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="location-dropdown">
      <button
        className="dropdown-toggle"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        Select Location
      </button>

      {showDropdown && (
        <div className="dropdown-menu">
          {locations.map((loc, idx) => (
            <div key={idx} className="main-location">
              <div
                className="main-title"
                onClick={() =>
                  setActiveLocation(
                    activeLocation === loc.location ? null : loc.location
                  )
                }
              >
                {loc.location}
              </div>
              {activeLocation === loc.location && (
                <ul className="sub-location-list">
                  {loc.subLocation.map((subloc, subIdx) => (
                    <li
                      key={subIdx}
                      onClick={() => {
                        onSelect({
                          location: loc.location,
                          sub_location: subloc,
                        });
                        setShowDropdown(false);
                      }}
                    >
                      {subloc}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
