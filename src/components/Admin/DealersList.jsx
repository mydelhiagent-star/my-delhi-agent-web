import React, { useEffect, useMemo, useState } from "react";
import "./ClientsList.css";
import { API_ENDPOINTS } from "../../config/api";
import { dealers as dummyDealers } from "../../constants/dealers";

export default function DealersList() {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editingDealer, setEditingDealer] = useState(null);
  const [passwordDealer, setPasswordDealer] = useState(null);

  useEffect(() => {
    fetchDealers();
  }, []);

  const fetchDealers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_ENDPOINTS.ADMIN_DEALERS}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch dealers");
      const data = await response.json();
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.dealers)
        ? data.dealers
        : [];
      if (list.length === 0) {
        // seed dummy with synthetic ids for actions
        setDealers(dummyDealers.map((d, i) => ({ id: i + 1, ...d })));
      } else {
        setDealers(list);
      }
    } catch (err) {
      console.error("Error fetching dealers:", err);
      setDealers(dummyDealers.map((d, i) => ({ id: i + 1, ...d })));
    } finally {
      setLoading(false);
    }
  };

  const filteredDealers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return dealers;
    return dealers.filter((d) => {
      const name = (d.name || "").toLowerCase();
      const phone = (d.phone || "").toLowerCase();
      const location = (d.location || "").toLowerCase();
      const subLocation = (d.sub_location || d.subLocation || "").toLowerCase();
      return (
        name.includes(q) ||
        phone.includes(q) ||
        location.includes(q) ||
        subLocation.includes(q)
      );
    });
  }, [dealers, query]);

  const onDelete = async (dealer) => {
    if (!window.confirm(`Delete dealer ${dealer.name}?`)) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_ENDPOINTS.ADMIN_DEALER_DELETE}${dealer.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Delete failed");
      setDealers((prev) => prev.filter((d) => d.id !== dealer.id));
      alert("Dealer deleted");
    } catch (err) {
      console.error(err);
      alert("Failed to delete dealer");
    }
  };

  const onSaveEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_ENDPOINTS.ADMIN_DEALER_UPDATE}${editingDealer.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editingDealer.name,
            phone: editingDealer.phone,
            location: editingDealer.location,
            sub_location: editingDealer.sub_location,
          }),
        }
      );
      if (!response.ok) throw new Error("Update failed");
      setDealers((prev) =>
        prev.map((d) => (d.id === editingDealer.id ? editingDealer : d))
      );
      setEditingDealer(null);
      alert("Dealer updated");
    } catch (err) {
      console.error(err);
      alert("Failed to update dealer");
    }
  };

  const onSavePassword = async () => {
    if (passwordDealer.newPassword.trim().length < 6) {
      alert("Please enter a new password with at least 6 characters");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_ENDPOINTS.ADMIN_DEALER_PASSWORD}${passwordDealer.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password: passwordDealer.newPassword }),
        }
      );
      if (!response.ok) throw new Error("Password update failed");
      setPasswordDealer(null);
      alert("Password updated");
    } catch (err) {
      console.error(err);
      alert("Failed to update password");
    }
  };

  if (loading) {
    return <div className="clients-loading">Loading dealers...</div>;
  }

  return (
    <div className="clients-container">
      <h3 className="clients-title">All Dealers</h3>

      <div className="status-filter-container" style={{ gap: "0.75rem" }}>
        <input
          type="text"
          placeholder="Search by name, phone, location, sub location"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="status-filter-dropdown"
          style={{ minWidth: 280 }}
        />
        <button className="client-btn" onClick={fetchDealers}>
          Refresh
        </button>
      </div>

      <div className="clients-table-container">
        <table className="clients-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Sub Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDealers.map((d) => (
              <tr key={d.id || d.phone} className="client-row">
                <td>{d.name}</td>
                <td>{d.phone}</td>
                <td>{d.location}</td>
                <td>{d.sub_location || d.subLocation}</td>
                <td className="client-actions">
                  <button
                    className="client-btn client-btn-edit"
                    onClick={() => setEditingDealer({ ...d })}
                  >
                    Edit
                  </button>
                  <button
                    className="client-btn"
                    onClick={() =>
                      setPasswordDealer({ id: d.id, newPassword: "" })
                    }
                  >
                    Change Password
                  </button>
                  <button
                    className="client-btn client-btn-delete"
                    onClick={() => onDelete(d)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingDealer && (
        <div className="client-edit-modal-overlay">
          <div className="client-edit-modal-content">
            <div className="client-edit-modal-header">
              <h3>Edit Dealer</h3>
              <button
                className="client-edit-modal-close"
                onClick={() => setEditingDealer(null)}
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSaveEdit();
              }}
            >
              <div className="client-edit-form">
                <input
                  type="text"
                  placeholder="Name"
                  value={editingDealer.name || ""}
                  onChange={(e) =>
                    setEditingDealer({ ...editingDealer, name: e.target.value })
                  }
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={editingDealer.phone || ""}
                  onChange={(e) =>
                    setEditingDealer({
                      ...editingDealer,
                      phone: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={editingDealer.location || ""}
                  onChange={(e) =>
                    setEditingDealer({
                      ...editingDealer,
                      location: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Sub Location"
                  value={editingDealer.sub_location || ""}
                  onChange={(e) =>
                    setEditingDealer({
                      ...editingDealer,
                      sub_location: e.target.value,
                    })
                  }
                />
              </div>
              <div className="client-edit-actions">
                <button
                  type="submit"
                  className="client-edit-btn client-edit-btn-save"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="client-edit-btn client-edit-btn-cancel"
                  onClick={() => setEditingDealer(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {passwordDealer && (
        <div className="client-edit-modal-overlay">
          <div className="client-edit-modal-content">
            <div className="client-edit-modal-header">
              <h3>Change Password</h3>
              <button
                className="client-edit-modal-close"
                onClick={() => setPasswordDealer(null)}
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSavePassword();
              }}
            >
              <div className="client-edit-form">
                <input
                  type="password"
                  placeholder="New Password"
                  value={passwordDealer.newPassword || ""}
                  onChange={(e) =>
                    setPasswordDealer({
                      ...passwordDealer,
                      newPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="client-edit-actions">
                <button
                  type="submit"
                  className="client-edit-btn client-edit-btn-save"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="client-edit-btn client-edit-btn-cancel"
                  onClick={() => setPasswordDealer(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
