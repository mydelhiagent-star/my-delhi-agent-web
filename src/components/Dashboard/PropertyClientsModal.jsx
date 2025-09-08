"use client";

import { useState, useEffect, useCallback } from "react";
import { API_ENDPOINTS } from "../../config/api";
import AddClientModal from "./AddClientModal";

const PropertyClientsModal = ({ isOpen, onClose, property }) => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const fetchPropertyClients = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.DEALER_CLIENTS}${property.id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();
      
      if (result.success) {
        setClients(result.data || []);
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
  }, [property?.id]);

  // Fetch clients when modal opens
  useEffect(() => {
    if (isOpen && property?.id) {
      fetchPropertyClients();
    }
  }, [isOpen, property?.id, fetchPropertyClients]);

  const handleClose = () => {
    setClients([]); // Reset clients when closing
    onClose();
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setShowEditModal(true);
  };

  const handleDeleteClient = async (client) => {
    if (window.confirm(`Are you sure you want to delete ${client.name}?`)) {
      try {
        const response = await fetch(`${API_ENDPOINTS.DEALER_CLIENTS}${client.id}`, {
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
      const response = await fetch(`${API_ENDPOINTS.DEALER_CLIENTS}${editingClient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: clientData.name,
          phone: clientData.phone,
          notes: clientData.notes,
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Update client in local state
        setClients(prevClients => 
          prevClients.map(c => 
            c.id === editingClient.id 
              ? { ...c, name: clientData.name, phone: clientData.phone, notes: clientData.notes }
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 animate-in fade-in duration-300 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between !p-4 border-b border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-white">{property?.title} Clients</h2>
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
        <div className="!p-6">
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
                              <div className="!bg-slate-800/60 !border !border-slate-600/30 !rounded-t-xl !p-4 !grid !grid-cols-12 !gap-4 !text-slate-300 !font-semibold !text-sm">
                                <div className="col-span-3">Name</div>
                                <div className="col-span-2">Phone</div>
                                <div className="col-span-3">Notes</div>
                                <div className="col-span-2">Status</div>
                                <div className="col-span-2">Actions</div>
                              </div>
                  
                  {/* Client Rows */}
                  {clients.map((client, index) => (
                    <div key={index} className={`!border-l !border-r !border-b !border-slate-600/30 !p-4 !grid !grid-cols-12 !gap-4 !transition-all !duration-200 hover:!bg-slate-700/30 ${
                      client.status === 'marked' 
                        ? '!bg-red-900/20 !border-red-500/30' 
                        : '!bg-slate-700/20'
                    } ${index === clients.length - 1 ? '!rounded-b-xl' : ''}`}>
                      
                      {/* Name Column */}
                      <div className="col-span-3 !flex !items-center">
                        <div className="!w-8 !h-8 !bg-gradient-to-br !from-cyan-500 !to-cyan-600 !rounded-full !flex !items-center !justify-center !text-white !font-semibold !text-xs !mr-3">
                          {client.name ? client.name.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <span className="!text-white !font-medium !text-sm">
                          {client.name || `Client ${index + 1}`}
                        </span>
                      </div>
                      
                      {/* Phone Column */}
                      <div className="col-span-2 !flex !items-center">
                        <span className="!text-slate-300 !text-sm">
                          {client.phone || 'No phone'}
                        </span>
                      </div>
                      
                      {/* Notes Column */}
                      <div className="col-span-3 !flex !items-center">
                        <span className="!text-slate-400 !text-sm !italic">
                          {client.note || 'No notes'}
                        </span>
                      </div>
                      
                      {/* Status Column */}
                      <div className="col-span-2 !flex !items-center">
                        <select
                          value={client.status || 'unmarked'}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            try {
                              // Here you would make an API call to update status
                              const response = await fetch(`${API_ENDPOINTS.DEALER_CLIENTS}${client.id}/status`, {
                                method: 'PATCH',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                },
                                body: JSON.stringify({ status: newStatus }),
                              });
                              
                              if (response.ok) {
                                // Update local state
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
                          className={`!px-2 !py-1 !rounded !text-xs !font-semibold !border-0 !outline-none !transition-all !duration-200 ${
                            client.status === 'marked'
                              ? '!bg-red-500 !text-white hover:!bg-red-600'
                              : '!bg-green-500 !text-white hover:!bg-green-600'
                          }`}
                        >
                          <option value="unmarked">Unmarked</option>
                          <option value="marked">Marked</option>
                        </select>
                      </div>
                      
                      {/* Actions Column */}
                      <div className="col-span-2 !flex !items-center !justify-center !gap-3">
                        <button
                          onClick={() => handleEditClient(client)}
                          className="!p-2 !bg-blue-500 hover:!bg-blue-600 !text-white !rounded-lg !transition-all !duration-200 hover:!scale-105"
                          title="Edit client"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteClient(client)}
                          className="!p-2 !bg-red-500 hover:!bg-red-600 !text-white !rounded-lg !transition-all !duration-200 hover:!scale-105"
                          title="Delete client"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
          notes: editingClient.notes
        } : null}
        title="Edit Client"
      />
    </div>
  );
};

export default PropertyClientsModal;
