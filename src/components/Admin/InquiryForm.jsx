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
      <p className="text-center text-gray-600 text-lg py-6">Loading inquiries...</p>
    );
  if (error)
    return (
      <p className="text-center text-red-500 text-lg py-6">{error}</p>
    );

  return (
    <div className="p-6">
      

      <div className="overflow-x-auto shadow-md rounded-lg">
        {/* table-fixed makes column widths predictable so long content won't expand table */}
        <table className="min-w-full table-fixed bg-white border border-gray-200">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-40">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-36">
                Phone
              </th>

              {/* Give requirement a fixed max width so it wraps */}
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Requirement
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-44">
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
                <td className="px-4 py-3 text-sm text-gray-800 min-w-0">
                  {item.name}
                </td>

                <td className="px-4 py-3 text-sm text-gray-800 min-w-0">
                  {item.phone}
                </td>

                {/* Important classes here:
                    - min-w-0 : allows the cell to shrink (needed inside table-fixed)
                    - max-w-[20rem] : limit width (arbitrary JIT value — change as needed)
                    - break-words + break-all : ensures even long unbroken strings wrap
                    - whitespace-normal : allow normal wrapping
                */}
                <td className="px-4 py-3 text-sm text-gray-800 min-w-0 max-w-[20rem] break-words break-all whitespace-normal">
                  {item.requirement}
                </td>

                <td className="px-4 py-3 text-sm text-gray-600 min-w-0">
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
