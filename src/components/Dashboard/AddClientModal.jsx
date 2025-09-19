"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { API_ENDPOINTS } from "../../config/api";

const AddClientModal = ({ isOpen, onClose, onSubmit, initialData = null, title = "Add Client", propertyId = null }) => {
  const [clientForm, setClientForm] = useState({
    name: "",
    phone: "",
    notes: "",
    status: "unmarked",
    clientId: null
  });
  const [clientFormErrors, setClientFormErrors] = useState({});
  const [searchStep, setSearchStep] = useState("phone"); // "phone", "searching", "found", "notFound", "add"
  const [searchPhone, setSearchPhone] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Reset modal state when opening/closing
  useEffect(() => {
    if (isOpen) {
      // If we have initialData (edit mode), skip phone search and go directly to edit form
      if (initialData) {
        setSearchStep("found"); // Skip to the edit form
        setClientForm({
          name: initialData.name || "",
          phone: initialData.phone || "",
          notes: initialData.notes || "",
          status: initialData.status || "unmarked",
          clientId: initialData.clientId || null
        });
      } else {
        // Add mode - start with phone search
        setSearchStep("phone");
        setSearchPhone("");
        setClientForm({
          name: "",
          phone: "",
          notes: "",
          status: "unmarked",
          clientId: null
        });
      }
      setIsSearching(false);
      setClientFormErrors({});
    }
  }, [isOpen, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (clientFormErrors[name]) {
      setClientFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSearchClient = async () => {
    if (!searchPhone.trim()) {
      alert("Please enter a phone number");
      return;
    }

    // Validate phone number format
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(searchPhone.replace(/\D/g, ""))) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    setIsSearching(true);
    setSearchStep("searching");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_ENDPOINTS.DEALER_CLIENTS}?phone=${searchPhone}&properties_property_id=${propertyId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const result = await response.json();
      
      if (result.success && result.data && result.data.length > 0) {
        // Client found - populate form (data is an array, get first client)
        const client = result.data[0];
        console.log("Client found:", client);
        console.log("Setting form with:", {
          name: client.name || "",
          phone: client.phone || "",
          notes: client.note || client.notes || "",
          status: client.status || "unmarked"
        });
        setClientForm({
          name: client.name || "",
          phone: client.phone || "",
          notes: client.note || client.notes || "",
          status: client.status || "unmarked",
          clientId: client.id
        });
        setSearchStep("found");
      } else {
        // Client not found
        setSearchStep("notFound");
      }
    } catch (error) {
      console.error("Error searching client:", error);
      alert("Failed to search client. Please try again.");
      setSearchStep("phone");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddNewClient = () => {
    setSearchStep("add");
    setClientForm({
      name: "",
      phone: searchPhone,
      notes: "",
      status: "unmarked",
      clientId: null
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = {};
    if (!clientForm.name.trim()) {
      errors.name = "Client name is required";
    }
    if (!clientForm.phone.trim()) {
      errors.phone = "Phone number is required";
    } else {
      // Validate phone number format
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(clientForm.phone.replace(/\D/g, ""))) {
        errors.phone = "Please enter a valid 10-digit phone number";
      }
    }
    
    setClientFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      try {
        await onSubmit(clientForm);
        
        // Reset form
        setClientForm({
          name: "",
          phone: "",
          notes: "",
          status: "unmarked"
        });
        
        // Close modal
        onClose();
      } catch (error) {
        console.error("Error adding client:", error);
        alert("Failed to add client. Please try again.");
      }
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setClientForm({
      name: "",
      phone: "",
      notes: "",
      status: "unmarked"
    });
    setClientFormErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="flex items-center justify-center p-4" 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh',
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)'
      }}
      onClick={handleClose}
    >
      {/* Modal */}
      <div 
        className="relative bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in duration-300 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between !p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">
            {searchStep === "found" && !initialData ? "Edit Client" : title}
          </h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white transition-colors duration-200 p-1 rounded-lg hover:bg-slate-700"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="!p-6">
          {/* Step 1: Phone Number Input */}
          {searchStep === "phone" && (
            <div>
              <div className="!mb-6">
                <label htmlFor="searchPhone" className="!block !text-base !font-semibold !text-slate-200 !mb-3">
                  Enter Phone Number to Search Client *
                </label>
                <input
                  type="tel"
                  id="searchPhone"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  className="!w-full !px-4 !py-3 !bg-slate-700/60 !border !border-slate-400/20 !rounded-xl !text-slate-50 !text-base !transition-all !duration-200 !placeholder:text-slate-500 !focus:outline-none !focus:border-cyan-500 !focus:shadow-cyan-500/10 !focus:shadow-[0_0_0_3px] !focus:bg-slate-700/80"
                  placeholder="Enter 10-digit phone number"
                  required
                />
              </div>
              <div className="!flex !gap-4 !justify-end !pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="!px-6 !py-3 !bg-slate-600 hover:!bg-slate-500 !text-white !font-semibold !text-base !rounded-xl !transition-all !duration-200 hover:!-translate-y-0.5"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSearchClient}
                  className="!px-6 !py-3 !bg-gradient-to-r !from-cyan-500 !to-cyan-600 hover:!from-cyan-600 hover:!to-cyan-700 !text-white !font-semibold !text-base !rounded-xl !transition-all !duration-200 hover:!-translate-y-0.5 hover:!shadow-[0_10px_25px_rgba(6,182,212,0.3)]"
                >
                  Search Client
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Searching */}
          {searchStep === "searching" && (
            <div className="!text-center !py-8">
              <div className="!mb-4">
                <svg className="animate-spin !mx-auto !h-8 !w-8 !text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="!text-slate-300 !text-lg">Searching for client...</p>
            </div>
          )}

          {/* Step 3: Client Found */}
          {searchStep === "found" && (
            <form onSubmit={handleSubmit}>
              <div className="!mb-4 !p-4 !bg-green-900/20 !border !border-green-500/30 !rounded-xl">
                <p className="!text-green-300 !text-sm !font-medium">
                  ✓ Client found. Edit client information below.
                </p>
              </div>
              
              {/* Client Name */}
              <div className="!mb-6">
                <label htmlFor="clientName" className="!block !text-base !font-semibold !text-slate-200 !mb-3">
                  Client Name *
                </label>
                <input
                  type="text"
                  id="clientName"
                  name="name"
                  value={clientForm.name}
                  onChange={handleInputChange}
                  readOnly={!initialData} // Lock when client is found by search (not in direct edit mode)
                  className={`!w-full !px-4 !py-3 !bg-slate-700/60 !border !rounded-xl !text-slate-100 !text-base !font-medium !transition-all !duration-200 !placeholder:text-slate-500 !focus:outline-none !focus:border-cyan-500 !focus:shadow-cyan-500/10 !focus:shadow-[0_0_0_3px] !focus:bg-slate-700/80 ${
                    clientFormErrors.name ? "!border-red-500 !shadow-red-500/10" : "!border-slate-400/20"
                  } ${
                    !initialData ? "!border-slate-400/50 !cursor-not-allowed" : ""
                  }`}
                  placeholder="Client name"
                />
                {clientFormErrors.name && (
                  <span className="!block !text-red-300 !text-sm !mt-2">{clientFormErrors.name}</span>
                )}
              </div>

              {/* Phone Number */}
              <div className="!mb-6">
                <label htmlFor="clientPhone" className="!block !text-base !font-semibold !text-slate-200 !mb-3">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="clientPhone"
                  name="phone"
                  value={clientForm.phone}
                  onChange={handleInputChange}
                  readOnly={!initialData} // Lock when client is found by search (not in direct edit mode)
                  className={`!w-full !px-4 !py-3 !bg-slate-700/60 !border !rounded-xl !text-slate-100 !text-base !font-medium !transition-all !duration-200 !placeholder:text-slate-500 !focus:outline-none !focus:border-cyan-500 !focus:shadow-cyan-500/10 !focus:shadow-[0_0_0_3px] !focus:bg-slate-700/80 ${
                    clientFormErrors.phone ? "!border-red-500 !shadow-red-500/10" : "!border-slate-400/20"
                  } ${
                    !initialData ? "!border-slate-400/50 !cursor-not-allowed" : ""
                  }`}
                  placeholder="Phone number"
                />
                {clientFormErrors.phone && (
                  <span className="!block !text-red-300 !text-sm !mt-2">{clientFormErrors.phone}</span>
                )}
              </div>

              {/* Notes - Editable */}
              <div className="!mb-6">
                <label htmlFor="clientNotes" className="!block !text-base !font-semibold !text-slate-200 !mb-3">
                  Notes (Optional)
                </label>
                <textarea
                  id="clientNotes"
                  name="notes"
                  value={clientForm.notes}
                  onChange={handleInputChange}
                  rows="4"
                  className="!w-full !px-4 !py-3 !bg-slate-700/60 !border !border-slate-400/20 !rounded-xl !text-slate-50 !text-base !transition-all !duration-200 !placeholder:text-slate-500 !focus:outline-none !focus:border-cyan-500 !focus:shadow-cyan-500/10 !focus:shadow-[0_0_0_3px] !focus:bg-slate-700/80 !resize-vertical"
                  placeholder="Add any additional notes about this client..."
                />
              </div>

              {/* Status - Editable */}
              <div className="!mb-4">
                <label htmlFor="clientStatus" className="!block !text-base !font-semibold !text-slate-200 !mb-3">
                  Status
                </label>
                <select
                  id="clientStatus"
                  name="status"
                  value={clientForm.status}
                  onChange={handleInputChange}
                  className="!w-full !px-4 !py-3 !bg-slate-700/60 !border !border-slate-400/20 !rounded-xl !text-slate-50 !text-base !transition-all !duration-200 !focus:outline-none !focus:border-cyan-500 !focus:shadow-cyan-500/10 !focus:shadow-[0_0_0_3px] !focus:bg-slate-700/80 !appearance-none !cursor-pointer"
                >
                  <option value="unmarked" className="!bg-slate-700 !text-slate-50">Unmarked</option>
                  <option value="marked" className="!bg-slate-700 !text-slate-50">Marked</option>
                </select>
              </div>

              {/* Actions */}
              <div className="!flex !gap-4 !justify-end !pt-4">
                <button
                  type="button"
                  onClick={() => setSearchStep("phone")}
                  className="!px-6 !py-3 !bg-slate-600 hover:!bg-slate-500 !text-white !font-semibold !text-base !rounded-xl !transition-all !duration-200 hover:!-translate-y-0.5"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="!px-6 !py-3 !bg-gradient-to-r !from-cyan-500 !to-cyan-600 hover:!from-cyan-600 hover:!to-cyan-700 !text-white !font-semibold !text-base !rounded-xl !transition-all !duration-200 hover:!-translate-y-0.5 hover:!shadow-[0_10px_25px_rgba(6,182,212,0.3)]"
                >
                  {initialData ? "Update Client" : "Add Client to Property"}
                </button>
              </div>
            </form>
          )}

          {/* Step 4: Client Not Found */}
          {searchStep === "notFound" && (
            <div>
              <div className="!mb-6 !p-4 !bg-red-900/20 !border !border-red-500/30 !rounded-xl">
                <p className="!text-red-300 !text-sm !font-medium">✗ Please add client first with this phone number {searchPhone}</p>
              </div>
              <div className="!flex !gap-4 !justify-end !pt-4">
                <button
                  type="button"
                  onClick={() => setSearchStep("phone")}
                  className="!px-6 !py-3 !bg-slate-600 hover:!bg-slate-500 !text-white !font-semibold !text-base !rounded-xl !transition-all !duration-200 hover:!-translate-y-0.5"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Add New Client */}
          {searchStep === "add" && (
            <form onSubmit={handleSubmit}>
              <div className="!mb-4 !p-4 !bg-blue-900/20 !border !border-blue-500/30 !rounded-xl">
                <p className="!text-blue-300 !text-sm !font-medium">ℹ Adding new client with phone: {searchPhone}</p>
              </div>
              
              {/* Client Name */}
              <div className="!mb-6">
                <label htmlFor="clientName" className="!block !text-base !font-semibold !text-slate-200 !mb-3">
                  Client Name *
                </label>
                <input
                  type="text"
                  id="clientName"
                  name="name"
                  value={clientForm.name}
                  onChange={handleInputChange}
                  className={`!w-full !px-4 !py-3 !bg-slate-700/60 !border !rounded-xl !text-slate-50 !text-base !transition-all !duration-200 !placeholder:text-slate-500 !focus:outline-none !focus:border-cyan-500 !focus:shadow-cyan-500/10 !focus:shadow-[0_0_0_3px] !focus:bg-slate-700/80 ${
                    clientFormErrors.name ? "!border-red-500 !shadow-red-500/10" : "!border-slate-400/20"
                  }`}
                  placeholder="Enter client's full name"
                  required
                />
                {clientFormErrors.name && (
                  <span className="!block !text-red-300 !text-sm !mt-2">{clientFormErrors.name}</span>
                )}
              </div>

              {/* Phone Number - Pre-filled */}
              <div className="!mb-6">
                <label htmlFor="clientPhone" className="!block !text-base !font-semibold !text-slate-200 !mb-3">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="clientPhone"
                  name="phone"
                  value={clientForm.phone}
                  readOnly
                  className="!w-full !px-4 !py-3 !bg-slate-600/40 !border !border-slate-500/30 !rounded-xl !text-slate-300 !text-base !cursor-not-allowed"
                  placeholder="Phone number"
                />
              </div>

              {/* Notes */}
              <div className="!mb-6">
                <label htmlFor="clientNotes" className="!block !text-base !font-semibold !text-slate-200 !mb-3">
                  Notes (Optional)
                </label>
                <textarea
                  id="clientNotes"
                  name="notes"
                  value={clientForm.notes}
                  onChange={handleInputChange}
                  rows="4"
                  className="!w-full !px-4 !py-3 !bg-slate-700/60 !border !border-slate-400/20 !rounded-xl !text-slate-50 !text-base !transition-all !duration-200 !placeholder:text-slate-500 !focus:outline-none !focus:border-cyan-500 !focus:shadow-cyan-500/10 !focus:shadow-[0_0_0_3px] !focus:bg-slate-700/80 !resize-vertical"
                  placeholder="Add any additional notes about this client..."
                />
              </div>

              {/* Status */}
              <div className="!mb-4">
                <label htmlFor="clientStatus" className="!block !text-base !font-semibold !text-slate-200 !mb-3">
                  Status
                </label>
                <select
                  id="clientStatus"
                  name="status"
                  value={clientForm.status}
                  onChange={handleInputChange}
                  className="!w-full !px-4 !py-3 !bg-slate-700/60 !border !border-slate-400/20 !rounded-xl !text-slate-50 !text-base !transition-all !duration-200 !focus:outline-none !focus:border-cyan-500 !focus:shadow-cyan-500/10 !focus:shadow-[0_0_0_3px] !focus:bg-slate-700/80 !appearance-none !cursor-pointer"
                >
                  <option value="unmarked" className="!bg-slate-700 !text-slate-50">Unmarked</option>
                  <option value="marked" className="!bg-slate-700 !text-slate-50">Marked</option>
                </select>
              </div>

              {/* Actions */}
              <div className="!flex !gap-4 !justify-end !pt-4">
                <button
                  type="button"
                  onClick={() => setSearchStep("notFound")}
                  className="!px-6 !py-3 !bg-slate-600 hover:!bg-slate-500 !text-white !font-semibold !text-base !rounded-xl !transition-all !duration-200 hover:!-translate-y-0.5"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="!px-6 !py-3 !bg-gradient-to-r !from-cyan-500 !to-cyan-600 hover:!from-cyan-600 hover:!to-cyan-700 !text-white !font-semibold !text-base !rounded-xl !transition-all !duration-200 hover:!-translate-y-0.5 hover:!shadow-[0_10px_25px_rgba(6,182,212,0.3)]"
                >
                  Add Client to Property
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default AddClientModal;
