import React, { useState, useEffect } from "react";
import "./AllClientsPage.css";
import { API_ENDPOINTS } from "../../config/api";

export default function AllClientsPage() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [newClient, setNewClient] = useState({
    name: "",
    phone: "",
    notes: ""
  });

  // Dummy data for clients
  const dummyClients = [
    {
      id: 1,
      name: "Rajesh Kumar",
      phone: "9876543210",
      email: "rajesh.kumar@email.com",
      location: "Delhi",
      subLocation: "Connaught Place",
      propertyType: "Commercial",
      budget: "₹50,00,000 - ₹75,00,000",
      status: "active",
      lastContact: "2024-01-15",
      notes: "Looking for office space in CP area",
      assignedProperties: ["Property #123", "Property #456"],
      createdAt: "2024-01-10"
    },
    {
      id: 2,
      name: "Priya Sharma",
      phone: "8765432109",
      email: "priya.sharma@email.com",
      location: "Gurgaon",
      subLocation: "Sector 29",
      propertyType: "Residential",
      budget: "₹1,00,00,000 - ₹1,50,00,000",
      status: "active",
      lastContact: "2024-01-14",
      notes: "Interested in 3BHK apartment",
      assignedProperties: ["Property #789"],
      createdAt: "2024-01-08"
    },
    {
      id: 3,
      name: "Amit Singh",
      phone: "7654321098",
      email: "amit.singh@email.com",
      location: "Noida",
      subLocation: "Sector 62",
      propertyType: "Residential",
      budget: "₹80,00,000 - ₹1,20,00,000",
      status: "pending",
      lastContact: "2024-01-12",
      notes: "First-time buyer, needs guidance",
      assignedProperties: [],
      createdAt: "2024-01-05"
    },
    {
      id: 4,
      name: "Sunita Gupta",
      phone: "6543210987",
      email: "sunita.gupta@email.com",
      location: "Delhi",
      subLocation: "Karol Bagh",
      propertyType: "Commercial",
      budget: "₹30,00,000 - ₹50,00,000",
      status: "inactive",
      lastContact: "2024-01-01",
      notes: "Looking for retail space",
      assignedProperties: ["Property #321"],
      createdAt: "2023-12-28"
    },
    {
      id: 5,
      name: "Vikram Mehta",
      phone: "5432109876",
      email: "vikram.mehta@email.com",
      location: "Faridabad",
      subLocation: "Sector 15",
      propertyType: "Residential",
      budget: "₹60,00,000 - ₹90,00,000",
      status: "active",
      lastContact: "2024-01-13",
      notes: "Looking for investment property",
      assignedProperties: ["Property #654", "Property #987"],
      createdAt: "2024-01-03"
    },
    {
      id: 6,
      name: "Neha Agarwal",
      phone: "4321098765",
      email: "neha.agarwal@email.com",
      location: "Delhi",
      subLocation: "Lajpat Nagar",
      propertyType: "Residential",
      budget: "₹1,20,00,000 - ₹1,80,00,000",
      status: "active",
      lastContact: "2024-01-16",
      notes: "Looking for luxury apartment",
      assignedProperties: ["Property #147"],
      createdAt: "2024-01-11"
    },
    {
      id: 7,
      name: "Ravi Verma",
      phone: "3210987654",
      email: "ravi.verma@email.com",
      location: "Ghaziabad",
      subLocation: "Vaishali",
      propertyType: "Commercial",
      budget: "₹40,00,000 - ₹60,00,000",
      status: "pending",
      lastContact: "2024-01-09",
      notes: "Office space for startup",
      assignedProperties: [],
      createdAt: "2024-01-07"
    },
    {
      id: 8,
      name: "Kavita Joshi",
      phone: "2109876543",
      email: "kavita.joshi@email.com",
      location: "Delhi",
      subLocation: "Pitampura",
      propertyType: "Residential",
      budget: "₹70,00,000 - ₹1,00,00,000",
      status: "active",
      lastContact: "2024-01-14",
      notes: "Family looking for 2BHK",
      assignedProperties: ["Property #258"],
      createdAt: "2024-01-06"
    }
  ];

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(API_ENDPOINTS.DEALER_CLIENTS, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const result = await response.json();
        
        if (result.success) {
          setClients(result.data);
          setFilteredClients(result.data);
        } else {
          console.error("Failed to fetch clients:", result.message);
          setClients([]);
          setFilteredClients([]);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
        setClients([]);
        setFilteredClients([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    let filtered = clients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      (client.note || client.notes || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort clients
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "createdAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredClients(filtered);
  }, [clients, searchTerm, sortBy, sortOrder]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleView = (client) => {
    setSelectedClient(client);
    setModalType("view");
    setShowModal(true);
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setNewClient({
      name: client.name,
      phone: client.phone,
      notes: client.note || client.notes || ""
    });
    setIsEditMode(true);
    setShowAddModal(true);
  };

  const handleDelete = (client) => {
    setSelectedClient(client);
    setModalType("delete");
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_ENDPOINTS.DEALER_CLIENTS}/${selectedClient.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const result = await response.json();
      
      if (result.success) {
        // Remove from local state only after successful API call
        setClients(clients.filter(client => client.id !== selectedClient.id));
        alert("Client deleted successfully!");
      } else {
        alert(result.message || "Failed to delete client");
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      alert("Failed to delete client. Please try again.");
    }
    
    // Close modal and reset state
    setShowModal(false);
    setSelectedClient(null);
    setModalType("");
  };

  const handleAddClient = () => {
    setShowAddModal(true);
  };

  const handleNewClientChange = (e) => {
    const { name, value } = e.target;
    setNewClient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddClientSubmit = async (e) => {
    e.preventDefault();
    
    if (!newClient.name.trim() || !newClient.phone.trim()) {
      alert("Name and phone are required");
      return;
    }

    if (!/^\d{10}$/.test(newClient.phone)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      if (isEditMode && editingClient) {
        // Update existing client
        const response = await fetch(`${API_ENDPOINTS.DEALER_CLIENTS}/${editingClient.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newClient.name.trim(),
            phone: newClient.phone.trim(),
            note: newClient.notes.trim(),
          }),
        });

        const result = await response.json();
        
        if (!result.success) {
          alert(result.message || "Failed to update client");
          return;
        }

        // Update client in the list - create updated client object
        const updatedClientData = {
          id: editingClient.id,
          name: newClient.name.trim(),
          phone: newClient.phone.trim(),
          note: newClient.notes.trim(),
          created_at: editingClient.created_at || new Date().toISOString()
        };
        setClients(prev => prev.map(client => 
          client.id === editingClient.id ? updatedClientData : client
        ));
        
        alert("Client updated successfully!");
      } else {
        // Add new client
        const response = await fetch(API_ENDPOINTS.DEALER_CLIENTS, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newClient.name.trim(),
            phone: newClient.phone.trim(),
            note: newClient.notes.trim(),
          }),
        });

        const result = await response.json();
        
        if (!result.success) {
          alert(result.message || "Failed to add client");
          return;
        }

        // Add to clients list - create client object from response
        const newClientData = {
          id: result.data.id,
          name: newClient.name.trim(),
          phone: newClient.phone.trim(),
          note: newClient.notes.trim(),
          created_at: new Date().toISOString()
        };
        setClients(prev => [...prev, newClientData]);
        
        alert("Client added successfully!");
      }
      
      // Reset form and close modal
      handleCloseAddModal();
      
    } catch (error) {
      console.error("Error saving client:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setIsEditMode(false);
    setEditingClient(null);
    setNewClient({ name: "", phone: "", notes: "" });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "status-active";
      case "pending":
        return "status-pending";
      case "inactive":
        return "status-inactive";
      default:
        return "status-active";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Active";
      case "pending":
        return "Pending";
      case "inactive":
        return "Inactive";
      default:
        return "Active";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="all-clients-container">
      <div className="all-clients-header">
        <div className="header-content">
          <div className="header-text">
            <h2>All Clients</h2>
            <p>Manage your client database and track their property requirements</p>
          </div>
          <button className="add-client-btn" onClick={handleAddClient}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Client
          </button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="clients-controls">
        <div className="search-container">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search clients by name, phone, or notes..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </div>

      {/* Clients Table */}
      <div className="clients-table-container">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading clients...</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="clients-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("name")} className="sortable">
                    Name
                    {sortBy === "name" && (
                      <span className="sort-indicator">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th onClick={() => handleSort("phone")} className="sortable">
                    Phone
                    {sortBy === "phone" && (
                      <span className="sort-indicator">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th onClick={() => handleSort("note")} className="sortable">
                    Notes
                    {sortBy === "note" && (
                      <span className="sort-indicator">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id}>
                    <td>
                      <div className="client-name-cell">
                        <div className="client-avatar">
                          {client.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{client.name}</span>
                      </div>
                    </td>
                    <td>
                      <a href={`tel:${client.phone}`} className="phone-link">
                        {client.phone}
                      </a>
                    </td>
                    <td>
                      <span className="notes">{client.note || client.notes || 'No notes'}</span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn view-btn"
                          onClick={() => handleView(client)}
                          title="View Details"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEdit(client)}
                          title="Edit Client"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(client)}
                          title="Delete Client"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3,6 5,6 21,6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && filteredClients.length === 0 && (
          <div className="no-clients">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <h3>No clients found</h3>
            <p>Try adjusting your search terms or add new clients</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {modalType === "view" && "Client Details"}
                {modalType === "edit" && "Edit Client"}
                {modalType === "delete" && "Delete Client"}
              </h3>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
                aria-label="Close modal"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <div className="modal-content">
              {modalType === "view" && selectedClient && (
                <div className="client-details">
                  <div className="client-info-grid">
                    <div className="info-item">
                      <label>Name:</label>
                      <span>{selectedClient.name}</span>
                    </div>
                    <div className="info-item">
                      <label>Phone:</label>
                      <span>{selectedClient.phone}</span>
                    </div>
                    <div className="info-item full-width">
                      <label>Notes:</label>
                      <span>{selectedClient.note || selectedClient.notes || 'No notes'}</span>
                    </div>
                  </div>
                </div>
              )}


              {modalType === "delete" && selectedClient && (
                <div className="delete-confirmation">
                  <p>Are you sure you want to delete <strong>{selectedClient.name}</strong>?</p>
                  <p className="warning-text">This action cannot be undone.</p>
                  <div className="modal-actions">
                    <button className="btn-cancel" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button className="btn-delete" onClick={confirmDelete}>
                      Delete Client
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={handleCloseAddModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{isEditMode ? "Edit Client" : "Add New Client"}</h3>
              <button
                className="modal-close"
                onClick={handleCloseAddModal}
                aria-label="Close modal"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <div className="modal-content">
              <form onSubmit={handleAddClientSubmit} className="add-client-form">
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newClient.name}
                    onChange={handleNewClientChange}
                    placeholder="Enter client name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={newClient.phone}
                    onChange={handleNewClientChange}
                    placeholder="Enter 10-digit phone number"
                    maxLength="10"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Notes <span className="optional-text">(Optional)</span></label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={newClient.notes}
                    onChange={handleNewClientChange}
                    placeholder="Enter any additional notes about the client (optional)"
                    rows="4"
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={handleCloseAddModal}>
                    Cancel
                  </button>
                <button type="submit" className="btn-submit">
                  {isEditMode ? "Update Client" : "Add Client"}
                </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
