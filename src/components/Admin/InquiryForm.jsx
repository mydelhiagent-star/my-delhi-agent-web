import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../config/api";

export default function InquiryForm() {
  console.log("InquiryForm component rendered");
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInquiries = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_ENDPOINTS.INQUIRIES, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (result.success) {
        const list = Array.isArray(result.data) ? result.data : [];
        setInquiries(list);
      } else {
        setInquiries([]);
        alert(result.message || "Failed to fetch inquiries");
      }
    } catch (err) {
      console.error("Error fetching inquiries:", err);
      setError("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  if (loading) return <p>Loading inquiries...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>All Inquiries</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Requirement</th>
            <th>Source</th>
            <th>Dealer ID</th>
            <th>Created At</th>
          </tr>
        </thead>

        <tbody>
          {inquiries.map((item) => (
            <tr key={item._id?.$oid}>
              <td>{item.name}</td>
              <td>{item.phone}</td>
              <td>{item.requirement}</td>
              <td>{item.source}</td>
              <td>{item.dealer_id?.$oid}</td>
              <td>
                {item.created_at?.$date
                  ? new Date(item.created_at.$date).toLocaleString()
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
