"use client";

import { useState } from "react";

const AddClientModal = ({ isOpen, onClose, onSubmit }) => {
  const [clientForm, setClientForm] = useState({
    name: "",
    phone: "",
    notes: ""
  });
  const [clientFormErrors, setClientFormErrors] = useState({});

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
          notes: ""
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
      notes: ""
    });
    setClientFormErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-in fade-in duration-300 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between !p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Add Client</h2>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="!p-6">
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
              className={`!w-full !px-4 !py-3 !bg-slate-700/60 !border !rounded-xl !text-slate-50 !text-base !transition-all !duration-200 !placeholder:text-slate-500 !focus:outline-none !focus:border-cyan-500 !focus:shadow-cyan-500/10 !focus:shadow-[0_0_0_3px] !focus:bg-slate-700/80 ${
                clientFormErrors.phone ? "!border-red-500 !shadow-red-500/10" : "!border-slate-400/20"
              }`}
              placeholder="Enter 10-digit phone number"
              required
            />
            {clientFormErrors.phone && (
              <span className="!block !text-red-300 !text-sm !mt-2">{clientFormErrors.phone}</span>
            )}
          </div>

          {/* Notes */}
          <div className="!mb-4">
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

          {/* Actions */}
          <div className="!flex !gap-4 !justify-end !pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="!px-6 !py-3 !bg-slate-600 hover:!bg-slate-500 !text-white !font-semibold !text-base !rounded-xl !transition-all !duration-200 hover:!-translate-y-0.5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="!px-6 !py-3 !bg-gradient-to-r !from-cyan-500 !to-cyan-600 hover:!from-cyan-600 hover:!to-cyan-700 !text-white !font-semibold !text-base !rounded-xl !transition-all !duration-200 hover:!-translate-y-0.5 hover:!shadow-[0_10px_25px_rgba(6,182,212,0.3)]"
            >
              Add Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClientModal;
