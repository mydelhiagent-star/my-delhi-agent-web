import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../config/api";

export default function InquiryForm() {
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
        setInquiries(Array.isArray(result.data) ? result.data : []);
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

  if (loading)
    return (
      <p className="text-center text-gray-600 text-lg py-6">
        Loading inquiries...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-500 text-lg py-6">
        {error}
      </p>
    );

  return (
    <div className="p-6">
      

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Requirement
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Created At
              </th>
            </tr>
          </thead>

          <tbody>
            {inquiries.map((item, index) => (
              <tr
                key={item.id || index}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 text-sm text-gray-800">
                  {item.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-800">
                  {item.phone}
                </td>
                <td className="px-4 py-3 text-sm text-gray-800">
                  {item.requirement}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {new Date(item.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
