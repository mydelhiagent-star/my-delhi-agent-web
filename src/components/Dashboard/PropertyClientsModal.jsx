"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { API_ENDPOINTS } from "../../config/api";
import AddClientModal from "./AddClientModal";
import Pagination from "../common/Pagination";
import "../common/Pagination.css";

const PropertyClientsModal = ({ isOpen, onClose, property }) => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingClient, setViewingClient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  const fetchPropertyClients = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      console.log(property.id)
      // Request 11 items instead of 10 to check if there are more
      const response = await fetch(`${API_ENDPOINTS.DEALER_CLIENTS}?properties_property_id=${property.id}&array_filters=properties_property_id&aggregation=true&page=${page}&limit=${itemsPerPage}&sort=properties_created_at`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();
      
      if (result.success) {
        // Check if there are more pages
        const hasMorePages = result.data.length === itemsPerPage + 1;
        const actualClients = hasMorePages
          ? result.data.slice(0, itemsPerPage)  // Show only 10 if more exist
          : result.data;               // Show all if this is the last page

        // Update clients
        setClients(actualClients);
        setCurrentPage(page);

        // Set pagination info
        if (hasMorePages) {
          // There are more pages
          setTotalPages(Math.max(totalPages, page + 1));
          console.log(`Page ${page}: ${actualClients.length} clients, hasMore: true, totalPages: ${Math.max(totalPages, page + 1)}`);
        } else {
          // This is the last page
          setTotalPages(page);
          console.log(`Page ${page}: ${actualClients.length} clients (last page), totalPages: ${page}`);
        }
      } else {
        console.error("Failed to fetch clients:", result.message);
        setClients([]);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  }, [property?.id, totalPages]);

  // Fetch clients when modal opens or page changes
  useEffect(() => {
    if (isOpen && property?.id) {
      fetchPropertyClients(currentPage);
    }
  }, [isOpen, property?.id, currentPage, fetchPropertyClients]);

  const handleClose = () => {
    setClients([]); // Reset clients when closing
    setCurrentPage(1); // Reset to page 1
    setTotalPages(1); // Reset total pages
    onClose();
  };

  // Pagination functions
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages && clients.length > 0) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleViewClient = (client) => {
    setViewingClient(client);
    setShowViewModal(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setShowEditModal(true);
  };

  const handleDeleteClient = async (client) => {
    if (window.confirm(`Are you sure you want to delete ${client.name}?`)) {
      try {
        const response = await fetch(`${API_ENDPOINTS.DEALER_CLIENTS}/${client.id}/properties/${client.properties[0].property_id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (response.ok) {
          // Remove client from local state
          setClients(prevClients => prevClients.filter(c => c.id !== client.id));
          alert('Client deleted successfully');
        } else {
          alert('Failed to delete client');
        }
      } catch (error) {
        console.error('Error deleting client:', error);
        alert('Failed to delete client');
      }
    }
  };

  const handleEditClientSubmit = async (clientData) => {
    try {
      // Check if any data has changed
      console.log('Editing Client:', editingClient);
      console.log('Client Data:', clientData);
      
      const hasChanges = 
        editingClient?.properties?.[0]?.note !== clientData.notes ||
        editingClient?.properties?.[0]?.status !== clientData.status;

      if (!hasChanges) {
        alert('No changes detected. Nothing to update.');
        setShowEditModal(false);
        setEditingClient(null);
        return;
      }

      const response = await fetch(`${API_ENDPOINTS.DEALER_CLIENTS}/${editingClient.id}/properties/${editingClient.properties[0].property_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          note: clientData.notes,
          status: clientData.status
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Update client in local state - CORRECTLY update the properties array
        setClients(prevClients => 
          prevClients.map(c => 
            c.id === editingClient.id 
              ? { 
                  ...c, 
                  properties: c.properties.map(prop => 
                    prop.property_id === editingClient.properties[0].property_id
                      ? { ...prop, note: clientData.notes, status: clientData.status }
                      : prop
                  )
                }
              : c
          )
        );
        alert('Client updated successfully');
        setShowEditModal(false);
        setEditingClient(null);
      } else {
        alert(result.message || 'Failed to update client');
      }
    } catch (error) {
      console.error('Error updating client:', error);
      alert('Failed to update client');
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl mx-2 sm:mx-4 animate-in fade-in duration-300 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between !p-4 border-b border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-white">Clients</h2>
          </div>
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
        <div className="!p-4 sm:!p-6">
          {/* Clients List */}
          <div>
            {/* <h3 className="text-lg font-semibold text-slate-200 mb-4">
              Assigned Clients ({clients.length})
            </h3> */}

            {/* Loading State */}
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                <p className="text-slate-400 mt-2">Loading clients...</p>
              </div>
            ) : (
              /* Clients Display */
              clients.length > 0 ? (
                <div className="overflow-x-auto">
                              {/* Table Header */}
                              <div className="!bg-slate-800/60 !border !border-slate-600/30 !rounded-t-xl !p-3 sm:!p-4 !grid !grid-cols-12 !gap-2 sm:!gap-4 !text-slate-300 !font-semibold !text-xs sm:!text-sm">
                                <div className="col-span-3 sm:col-span-4">Name</div>
                                <div className="col-span-3 sm:col-span-3">Phone</div>
                                <div className="col-span-3 sm:col-span-3">Status</div>
                                <div className="col-span-3 sm:col-span-2">Actions</div>
                              </div>
                  
                  {/* Client Rows */}
                  {clients.map((client, index) => (
                    <div key={index} className={`!border-l !border-r !border-b !border-slate-600/30 !p-3 sm:!p-4 !grid !grid-cols-12 !gap-2 sm:!gap-4 !transition-all !duration-200 ${
                      client.status === 'marked' 
                        ? '!bg-red-900/40 !border-red-500/60 !shadow-red-500/20 hover:!bg-red-900/50' 
                        : '!bg-slate-700/20 hover:!bg-slate-700/30'
                    } ${index === clients.length - 1 ? '!rounded-b-xl' : ''}`}>
                      
                      {/* Name Column */}
                      <div className="col-span-3 sm:col-span-4 !flex !items-center !min-w-0">
                        <div className="!w-6 !h-6 sm:!w-8 sm:!h-8 !bg-gradient-to-br !from-cyan-500 !to-cyan-600 !rounded-full !flex !items-center !justify-center !text-white !font-semibold !text-xs !mr-2 sm:!mr-3 !flex-shrink-0">
                          {client.name ? client.name.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <span className="!text-white !font-medium !text-xs sm:!text-sm !truncate !min-w-0">
                          {client.name || `Client ${index + 1}`}
                        </span>
                      </div>
                      
                      {/* Phone Column */}
                      <div className="col-span-3 sm:col-span-3 !flex !items-center !min-w-0">
                        <span className="!text-slate-300 !text-xs sm:!text-sm !truncate">
                          {client.phone || 'No phone'}
                        </span>
                      </div>
                      
                      {/* Status Column */}
                      <div className="col-span-3 sm:col-span-3 !flex !items-center !min-w-0">
                        <select
                          value={client?.properties?.[0]?.status || 'unmarked'}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            try {
                              const response = await fetch(`${API_ENDPOINTS.DEALER_CLIENTS}${client.id}/status`, {
                                method: 'PUT',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                },
                                body: JSON.stringify({ status: newStatus }),
                              });
                              
                              if (response.ok) {
                                setClients(prevClients => 
                                  prevClients.map(c => 
                                    c.id === client.id ? { ...c, status: newStatus } : c
                                  )
                                );
                              } else {
                                alert('Failed to update status');
                              }
                            } catch (error) {
                              console.error('Error updating status:', error);
                              alert('Failed to update status');
                            }
                          }}
                          className={`!px-2 sm:!px-3 !py-1.5 sm:!py-1 !rounded-lg !text-xs sm:!text-sm !font-semibold !border-0 !outline-none !transition-all !duration-200 !cursor-pointer !w-full ${
                            client?.properties?.[0]?.status === 'marked'
                              ? '!bg-red-500 !text-white hover:!bg-red-600'
                              : '!bg-green-500 !text-white hover:!bg-green-600'
                          }`}
                        >
                          <option value="unmarked">Unmarked</option>
                          <option value="marked">Marked</option>
                        </select>
                      </div>
                      
                      {/* Actions Column */}
                      <div className="col-span-3 sm:col-span-2 !flex !items-center !justify-center !gap-2 sm:!flex-row !flex-col">
                        <button
                          onClick={() => handleViewClient(client)}
                          className="!p-1.5 sm:!p-2 !bg-green-500 hover:!bg-green-600 !text-white !rounded-lg !transition-all !duration-200 hover:!scale-105 !min-w-0 !flex-shrink-0"
                          title="View client details"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-4 sm:h-4">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => handleEditClient(client)}
                          className="!p-1.5 sm:!p-2 !bg-blue-500 hover:!bg-blue-600 !text-white !rounded-lg !transition-all !duration-200 hover:!scale-105 !min-w-0 !flex-shrink-0"
                          title="Edit client"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-4 sm:h-4">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteClient(client)}
                          className="!p-1.5 sm:!p-2 !bg-red-500 hover:!bg-red-600 !text-white !rounded-lg !transition-all !duration-200 hover:!scale-105 !min-w-0 !flex-shrink-0"
                          title="Delete client"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-4 sm:h-4">
                            <polyline points="3,6 5,6 21,6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="!text-center !py-8 !text-slate-400">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="!mx-auto !mb-4 !text-slate-500">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <p className="!text-slate-400 !text-base">No clients assigned to this property</p>
                </div>
              )
            )}
          </div>

          {/* Pagination Controls */}
          {!isLoading && clients.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onPreviousPage={handlePreviousPage}
              onNextPage={handleNextPage}
              itemsPerPage={itemsPerPage}
              totalItems={clients.length}
              showItemsInfo={false}
            />
          )}
        </div>
      </div>

      {/* Edit Client Modal */}
      <AddClientModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingClient(null);
        }}
        onSubmit={handleEditClientSubmit}
        initialData={editingClient ? {
          name: editingClient.name,
          phone: editingClient.phone,
          notes: editingClient?.properties?.[0]?.note,
          status: editingClient?.properties?.[0]?.status
        } : null}
        title="Edit Client"
      />

      {/* View Client Modal */}
      {showViewModal && viewingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setShowViewModal(false);
              setViewingClient(null);
            }}
          />
          
          {/* Modal */}
          <div className="relative bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md mx-2 sm:mx-4 animate-in fade-in duration-300 max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between !p-4 sm:!p-6 border-b border-slate-700">
              <h2 className="text-lg sm:text-xl font-bold text-white">Client Details</h2>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setViewingClient(null);
                }}
                className="text-slate-400 hover:text-white transition-colors duration-200 p-1 rounded-lg hover:bg-slate-700"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="!p-4 sm:!p-6">
              {/* Client Avatar and Name */}
              <div className="!flex !items-center !mb-4 sm:!mb-6">
                <div className="!w-12 !h-12 sm:!w-16 sm:!h-16 !bg-gradient-to-br !from-cyan-500 !to-cyan-600 !rounded-full !flex !items-center !justify-center !text-white !font-bold !text-lg sm:!text-2xl !mr-3 sm:!mr-4">
                  {viewingClient.name ? viewingClient.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div className="!flex-1 !min-w-0">
                  <h3 className="!text-white !font-bold !text-lg sm:!text-xl !mb-1 !truncate">
                    {viewingClient.name || 'Unknown Client'}
                  </h3>
                  {/* <p className="!text-slate-400 !text-sm">
                    Client ID: {viewingClient.id || 'N/A'}
                  </p> */}
                </div>
              </div>

              {/* Client Information */}
              <div className="!space-y-3 sm:!space-y-4">
                {/* Phone */}
                <div className="!bg-slate-700/30 !rounded-xl !p-3 sm:!p-4">
                  <div className="!flex !items-center !mb-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="!text-cyan-400 !mr-2 sm:w-5 sm:h-5">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span className="!text-slate-300 !font-semibold !text-xs sm:!text-sm">Phone Number</span>
                  </div>
                  <p className="!text-white !text-sm sm:!text-lg !font-medium !break-all">
                    {viewingClient.phone || 'No phone number provided'}
                  </p>
                </div>

                {/* Notes */}
                <div className="!bg-slate-700/30 !rounded-xl !p-3 sm:!p-4">
                  <div className="!flex !items-center !mb-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="!text-cyan-400 !mr-2 sm:w-5 sm:h-5">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14,2 14,8 20,8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10,9 9,9 8,9" />
                    </svg>
                    <span className="!text-slate-300 !font-semibold !text-xs sm:!text-sm">Notes</span>
                  </div>
                  <div className="!bg-slate-800/50 !rounded-lg !p-2 sm:!p-3 !max-h-24 sm:!max-h-32 !overflow-y-auto">
                    <p className="!text-white !text-xs sm:!text-sm !leading-relaxed !break-words !whitespace-pre-wrap !word-wrap !overflow-wrap">
                      {viewingClient?.properties?.[0]?.note || 'No notes provided'}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="!bg-slate-700/30 !rounded-xl !p-3 sm:!p-4">
                  <div className="!flex !items-center !mb-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="!text-cyan-400 !mr-2 sm:w-5 sm:h-5">
                      <path d="M9 12l2 2 4-4" />
                      <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.5 0 2.91.37 4.15 1.02" />
                    </svg>
                    <span className="!text-slate-300 !font-semibold !text-xs sm:!text-sm">Status</span>
                  </div>
                  <div className={`!inline-flex !items-center !px-2 sm:!px-3 !py-1 !rounded-full !text-xs sm:!text-sm !font-semibold ${
                    viewingClient?.properties?.[0]?.status === 'marked' 
                      ? '!bg-red-500 !text-white' 
                      : '!bg-green-500 !text-white'
                  }`}>
                    {viewingClient?.properties?.[0]?.status === 'marked' ? 'Marked' : 'Unmarked'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
};

export default PropertyClientsModal;
