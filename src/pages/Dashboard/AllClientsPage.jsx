import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./AllClientsPage.css";
import { API_ENDPOINTS } from "../../config/api";
import Pagination from "../../components/common/Pagination";
import "../../components/common/Pagination.css";

export default function AllClientsPage() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(null);
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
  const [docFiles, setDocFiles] = useState([]);
  const [isDocDragOver, setIsDocDragOver] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [viewingDocs, setViewingDocs] = useState([]);
  const [isUploadingDocs, setIsUploadingDocs] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'marked', 'unmarked'
  const itemsPerPage = 20;

  

  useEffect(() => {
    const fetchClients = async () => {
    setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        
        // Request 21 items instead of 20 to check if there are more
        const response = await fetch(`${API_ENDPOINTS.DEALER_CLIENTS}?page=${currentPage}&limit=${itemsPerPage}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const result = await response.json();
        
        if (result.success) {
          // Check if there are more pages
          const hasMorePages = result.data.length === 21;
           
          const actualClients = hasMorePages
            ? result.data.slice(0, 20)  // Show only 20 if more exist
            : result.data;               // Show all if this is the last page
          

          // Update clients
          setClients(actualClients);
          setFilteredClients(actualClients);

          // Set pagination info
          if (hasMorePages) {
            // There are more pages
            setTotalPages(Math.max(totalPages, currentPage + 1));
            console.log(`Page ${currentPage}: ${actualClients.length} clients, hasMore: true, totalPages: ${Math.max(totalPages, currentPage + 1)}`);
          } else {
            // This is the last page
            setTotalPages(currentPage);
            console.log(`Page ${currentPage}: ${actualClients.length} clients (last page), totalPages: ${currentPage}`);
          }
        } 
        
        else {
          console.error("Failed to fetch clients:", result.message);
        }
        
          
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
      setIsLoading(false);
      }
    };

    fetchClients();
  }, [currentPage]);

  useEffect(() => {
    // For server-side pagination, we only filter the current page's data
    let filtered = clients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      (client.note || client.notes || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort clients only if sortBy is set
    if (sortBy) {
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
    }

    setFilteredClients(filtered);
  }, [clients, searchTerm, sortBy, sortOrder]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    if (searchTerm) {
      setCurrentPage(1);
    }
  }, [searchTerm]);

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

  // Pagination functions for the new Pagination component
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
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
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
    
    // Populate existing documents if available (like PostProperty)
    if (client.docs && client.docs.length > 0) {
      // Convert document objects/URLs to File objects for display
      const existingDocuments = client.docs.map((doc, index) => {
        // Handle both old format (string URLs) and new format (objects with type)
        const docUrl = typeof doc === 'string' ? doc : doc.url;
        const docType = typeof doc === 'string' ? 'unknown' : doc.type;
        
        // Create a mock File object for existing documents
        const mockFile = new File([], `existing-doc-${index}`, {
          type: docType,
        });
        // Add the URL and type as properties for display
        mockFile.existingUrl = docUrl;
        mockFile.existingType = docType;
        return mockFile;
      });
      setDocFiles(existingDocuments);
    } else {
      setDocFiles([]);
    }
    
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
        // Check if this was the last item on current page
        const wasLastItemOnPage = clients.length === 1;
        
        // Remove from local state only after successful API call
    setClients(clients.filter(client => client.id !== selectedClient.id));
        alert("Client deleted successfully!");
        
        // Smart pagination adjustment
        if (wasLastItemOnPage && currentPage > 1) {
          // If this was the last item on current page, go to previous page
          setCurrentPage(currentPage - 1);
        } else {
          // Refetch current page to get updated data
          const fetchClients = async () => {
            setIsLoading(true);
            try {
              const token = localStorage.getItem("token");
              
              // Request 21 items instead of 20 to check if there are more
              const response = await fetch(`${API_ENDPOINTS.DEALER_CLIENTS}?page=${currentPage}&limit=${itemsPerPage}`, {
                headers: {
                  "Authorization": `Bearer ${token}`,
                },
              });

              const result = await response.json();
              
              if (result.success) {
                // Check if there are more pages
                const hasMorePages = result.data.length === 21;
                 
                const actualClients = hasMorePages
                  ? result.data.slice(0, 20)  // Show only 20 if more exist
                  : result.data;               // Show all if this is the last page
                

                // Update clients
                setClients(actualClients);
                setFilteredClients(actualClients);

                // Set pagination info
                if (hasMorePages) {
                  // There are more pages
                  setTotalPages(Math.max(totalPages, currentPage + 1));
                } else {
                  // This is the last page
                  setTotalPages(currentPage);
                }
                
                // Double-check: if current page is still empty after refetch, go to previous page
                if (actualClients.length === 0 && currentPage > 1) {
                  setCurrentPage(currentPage - 1);
                }
              } 
              
              else {
                console.error("Failed to fetch clients:", result.message);
              }
              
                
            } catch (error) {
              console.error("Error fetching clients:", error);
            } finally {
              setIsLoading(false);
            }
          };
          
          fetchClients();
        }
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

    if (newClient.name.trim().length < 3) {
      alert("Name must be at least 3 characters long");
      return;
    }

    if (newClient.name.trim().length > 20) {
      alert("Name must not exceed 20 characters");
      return;
    }

    if (!/^\d{10}$/.test(newClient.phone)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      // Separate existing and new documents
      const existingDocs = docFiles.filter(file => file.existingUrl);
      const newDocs = docFiles.filter(file => !file.existingUrl);
      
      // Upload new documents if any
      let uploadedDocs = [];
      if (newDocs.length > 0) {
        setIsUploadingDocs(true); // Show loader
        try {
          uploadedDocs = await uploadDocsToCloudflare(newDocs);
        } catch (error) {
          setIsUploadingDocs(false); // Hide loader on error
          throw error; // Re-throw to be caught by outer try-catch
        }
      }
      
      // Combine existing docs (that weren't removed) with new uploaded docs
      const finalDocs = [
        ...existingDocs.map(file => ({ url: file.existingUrl, type: 'unknown' })), 
        ...uploadedDocs
      ];
      
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
            docs: finalDocs,
          }),
        });

        const result = await response.json();
        
        if (!result.success) {
          alert(result.message || "Failed to update client");
          return;
        }

        // Update client in the list - create updated client object with docs
        const updatedClientData = {
          id: editingClient.id,
          name: newClient.name.trim(),
          phone: newClient.phone.trim(),
          note: newClient.notes.trim(),
          docs: finalDocs, // Include updated documents
          created_at: editingClient.created_at || new Date().toISOString()
        };
        setClients(prev => prev.map(client => 
          client.id === editingClient.id ? updatedClientData : client
        ));
        
        alert("Client updated successfully!");
        setIsUploadingDocs(false); // Hide loader
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
            docs: finalDocs,
          }),
        });

        const result = await response.json();
        
        if (!result.success) {
          alert(result.message || "Failed to add client");
          return;
        }

        // New client added successfully - always redirect to Page 1
        alert("Client added successfully!");
        setIsUploadingDocs(false); // Hide loader
        
        if (currentPage === 1) {
          // If already on Page 1, add to current page
          const newClientData = {
            id: result.data.id,
            name: newClient.name.trim(),
            phone: newClient.phone.trim(),
            note: newClient.notes.trim(),
            docs: finalDocs, // Include documents
            created_at: new Date().toISOString()
          };
          
          setClients(prev => [newClientData, ...prev]);
        } else {
          // If on any other page, redirect to Page 1 to show the new client
          setCurrentPage(1);
        }
      }
      
      // Reset form and close modal
      handleCloseAddModal();
      
    } catch (error) {
      console.error("Error saving client:", error);
      setIsUploadingDocs(false); // Hide loader on error
      alert("Something went wrong. Please try again.");
    }
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setIsEditMode(false);
    setEditingClient(null);
    setNewClient({ name: "", phone: "", notes: "" });
    setDocFiles([]);
    setIsUploadingDocs(false); // Reset upload state
  };

  // Document upload functions
  const validateFile = (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain', 'text/csv'
    ];
    
    if (file.size > maxSize) {
      alert(`File ${file.name} is too large. Maximum size is 10MB.`);
      return false;
    }
    
    if (!allowedTypes.includes(file.type)) {
      alert(`File ${file.name} has an unsupported format. Please upload images, PDFs, or documents.`);
      return false;
    }
    
    return true;
  };

  const handleDocUpload = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(validateFile);
    
    if (validFiles.length === 0) return;
    
    if (docFiles.length + validFiles.length > 5) {
      alert("Maximum 5 documents allowed. Please remove some files first.");
      return;
    }
    
    setDocFiles(prev => [...prev, ...validFiles]);
  };

  const handleDocDrop = (e) => {
    e.preventDefault();
    setIsDocDragOver(false);
    const files = e.dataTransfer.files;
    handleDocUpload(files);
  };

  const handleDocDragOver = (e) => {
    e.preventDefault();
    setIsDocDragOver(true);
  };

  const handleDocDragLeave = (e) => {
    e.preventDefault();
    setIsDocDragOver(false);
  };

  const removeDoc = (index) => {
    setDocFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadDocsToCloudflare = async (files) => {
    try {
      // Step 1: Get presigned URLs
      const response = await fetch(API_ENDPOINTS.PRESIGNED_URLS, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ count: files.length }),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || "Failed to get upload URLs");
      }

      const { presignedUrls } = result.data;

      // Step 2: Upload files to Cloudflare
      const uploadPromises = files.map(async (file, index) => {
        const { presignedUrl, fileKey } = presignedUrls[index];

        const uploadResponse = await fetch(presignedUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        // Return file data with type information
        return {
          url: `https://assets.mydelhiagent.in/${fileKey}`,
          type: file.type,
          size: file.size
        };
      });

      // Wait for all uploads to complete
      const uploadedDocs = await Promise.all(uploadPromises);
      return uploadedDocs;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleViewDocs = (client) => {
    console.log('handleViewDocs called with client:', client);
    console.log('Client docs:', client.docs);
    setViewingDocs(client.docs || []);
    setShowDocModal(true);
    console.log('Modal should be opening now');
  };

  const openDocInNewTab = (docUrl) => {
    // Ensure URL has proper prefix before opening
    const fullUrl = docUrl.startsWith('http') ? docUrl : `https://assets.mydelhiagent.in/${docUrl}`;
    window.open(fullUrl, '_blank');
  };

  const openPropertyPreview = (propertyId) => {
    // Open property preview page in new tab
    const previewUrl = `/preview/${propertyId}`;
    window.open(previewUrl, '_blank');
  };

  const handleStatusFilter = async (filter) => {
    console.log('Status filter changed to:', filter);
    setStatusFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      let apiUrl;
      if (filter === 'all') {
        // Use the same API call as page rendering for "All Clients"
        apiUrl = `${API_ENDPOINTS.DEALER_CLIENTS}?page=1&limit=${itemsPerPage}`;
      } else {
        // Use filtered API call for specific status
        apiUrl = `${API_ENDPOINTS.DEALER_CLIENTS}?properties_status=${filter}&array_filters=properties_status&aggregation=true&page=1&limit=${itemsPerPage}`;
      }
      
      const response = await fetch(apiUrl, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      const result = await response.json();
      
      if (result.success) {
        if (filter === 'all') {
          // Handle pagination for "all" filter
          const hasMorePages = result.data.length === 21;
          const actualClients = hasMorePages
            ? result.data.slice(0, 20)
            : result.data;
          
          setClients(actualClients);
          setTotalPages(hasMorePages ? 2 : 1);
        } else {
          // Handle filtered results
          setClients(result.data);
          setTotalPages(1); // Reset pagination for filtered results
        }
        setFilteredClients(result.data);
      } else {
        console.error("Error fetching clients:", result.message);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="all-clients-container">
      <div className="all-clients-header">
        <div className="header-content">
          <div className="header-text">
        <h2>All Clients</h2>
            <p>Manage your client and track their property requirements</p>
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
        
        <div className="filter-container">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
          </svg>
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Clients</option>
            <option value="marked">Marked</option>
            <option value="unmarked">Unmarked</option>
          </select>
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
                    Requirement
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
                {filteredClients
                  
                  .map((client) => (
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
                        {(client.docs && client.docs.length > 0) && (
                          <button
                            className="action-btn docs-btn"
                            onClick={() => {
                              console.log('View Documents button clicked for client:', client);
                              handleViewDocs(client);
                            }}
                            title="View Documents"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14,2 14,8 20,8" />
                              <line x1="16" y1="13" x2="8" y2="13" />
                              <line x1="16" y1="17" x2="8" y2="17" />
                              <polyline points="10,9 9,9 8,9" />
                            </svg>
                          </button>
                        )}
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

      {/* Pagination Controls */}
      {!isLoading && filteredClients.length > 0 && (
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

      {/* Modal */}
      {showModal && createPortal(
        <div 
          className="modal-overlay" 
          onClick={() => setShowModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {modalType === "view" && "Properties"}
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
                  {/* Properties List */}
                  <div className="properties-section">
                    {selectedClient.properties && selectedClient.properties.length > 0 ? (
                      <div className="properties-list">
                        {selectedClient.properties.map((property, index) => (
                          <div 
                            key={index} 
                            className="property-item"
                            onClick={() => openPropertyPreview(property.property_id)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="property-info">
                              <span className="property-number">{property.property_number || 'N/A'}</span>
                              <span className={`property-status status-${property.status}`}>
                                {property.status || 'unmarked'}
                      </span>
                    </div>
                            {property.note && (
                              <div className="property-note">
                                <span className="note-label">Note:</span>
                                <span className="note-text">{property.note}</span>
                    </div>
                            )}
                    </div>
                        ))}
                    </div>
                    ) : (
                      <div className="no-properties">
                        <p>No properties assigned to this client.</p>
                </div>
              )}
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
        </div>,
        document.body
      )}

      {/* Document Upload Loader */}
      {isUploadingDocs && createPortal(
        <div 
          className="modal-overlay" 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
          }}
        >
          <div className="modal-container" style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="loading-spinner" style={{
              width: '50px',
              height: '50px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #06b6d4',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}></div>
            <h3 style={{ color: '#06b6d4', margin: '0' }}>Uploading Documents...</h3>
            <p style={{ color: '#666', margin: '0.5rem 0 0' }}>Please wait while we upload your documents</p>
        </div>
        </div>,
        document.body
      )}

      {/* Add Client Modal */}
      {showAddModal && !isUploadingDocs && createPortal(
        <div 
          className="modal-overlay" 
          onClick={handleCloseAddModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
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
                <div className="form-content">
                  <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={newClient.name}
                      onChange={handleNewClientChange}
                      placeholder="Enter client name (3-20 characters)"
                      minLength="3"
                      maxLength="20"
                      required
                    />
                    <div className="character-counter">
                      {newClient.name.length}/20 characters
                    </div>
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
                      maxLength="500"
                    />
                    <div className="character-counter">
                      {newClient.notes.length}/500 characters
                  </div>
                </div>

                  {/* Document Upload Section */}
                  <div className="form-group">
                    <label>Documents <span className="optional-text">(Max 5 files, 10MB each)</span></label>
                    <div 
                      className={`doc-upload-area ${isDocDragOver ? 'drag-over' : ''}`}
                      onDrop={handleDocDrop}
                      onDragOver={handleDocDragOver}
                      onDragLeave={handleDocDragLeave}
                    >
                      <div className="doc-upload-content">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="upload-icon">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14,2 14,8 20,8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10,9 9,9 8,9" />
                        </svg>
                        <p className="upload-text">
                          Drag & drop documents here or <span className="upload-link" onClick={() => document.querySelector('.file-input').click()}>browse files</span>
                        </p>
                        <p className="upload-subtext">
                          Supports: Images, PDFs, Word docs, Excel files (Max 10MB each)
                        </p>
                        <input
                          type="file"
                          multiple
                          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
                          onChange={(e) => handleDocUpload(e.target.files)}
                          className="file-input"
                          style={{ display: 'none' }}
                        />
                      </div>
                    </div>

                    {/* Document Preview */}
                    {docFiles.length > 0 ? (
                      <div className="doc-preview-grid">
                        {docFiles.map((file, index) => (
                          <div key={index} className="doc-preview-item">
                            <div 
                              className="doc-preview doc-preview-clickable"
                              onClick={() => {
                                const url = file.existingUrl || URL.createObjectURL(file);
                                // Ensure URL has proper prefix before opening
                                const fullUrl = url.startsWith('http') ? url : `https://assets.mydelhiagent.in/${url}`;
                                window.open(fullUrl, '_blank');
                              }}
                              title="Click to open document in new tab"
                            >
                              {file.existingUrl ? (
                                // Show existing document with type-based preview
                                file.existingType === 'application/pdf' ? (
                                  <div className="doc-pdf-preview">
                                    <iframe
                                      src={`${file.existingUrl.startsWith('http') ? file.existingUrl : `https://assets.mydelhiagent.in/${file.existingUrl}`}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                                      className="doc-pdf-iframe"
                                      title={`PDF Preview ${index + 1}`}
                                    />
                                  </div>
                                ) : file.existingType.startsWith('image/') ? (
                                  <img
                                    src={file.existingUrl.startsWith('http') ? file.existingUrl : `https://assets.mydelhiagent.in/${file.existingUrl}`}
                                    alt={`Document ${index + 1}`}
                                    className="doc-thumbnail"
                                  />
                                ) : (
                                  <div className="doc-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                      <polyline points="14,2 14,8 20,8" />
                                    </svg>
                                  </div>
                                )
                              ) : (
                                // Show new document
                                file.type.startsWith('image/') ? (
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Document ${index + 1}`}
                                    className="doc-thumbnail"
                                  />
                                ) : file.type === 'application/pdf' ? (
                                  <div className="doc-pdf-preview">
                                    <iframe
                                      src={`${URL.createObjectURL(file)}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                                      className="doc-pdf-iframe"
                                      title={`PDF Preview ${index + 1}`}
                                    />
                                  </div>
                                ) : (
                                  <div className="doc-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                      <polyline points="14,2 14,8 20,8" />
                                    </svg>
                                  </div>
                                )
                              )}
                              {/* Fallback icon for when image fails */}
                              <div className="doc-icon" style={{ display: 'none' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                  <polyline points="14,2 14,8 20,8" />
                                </svg>
                      </div>
                              {/* Click indicator overlay */}
                              <div className="doc-click-overlay">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                    </div>
                  </div>
                            <button
                              type="button"
                              className="remove-doc-btn"
                              onClick={() => removeDoc(index)}
                              title={`Remove ${file.name}`}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </button>
                </div>
                        ))}
                  </div>
                    ) : (
                      <div style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8' }}>
                        No documents uploaded yet
                </div>
              )}
                  </div>
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
        </div>,
        document.body
      )}

     
      {showDocModal && createPortal(
        <div 
          className="modal-overlay" 
          onClick={() => setShowDocModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div 
            className="modal-container" 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              backgroundColor: '#1e293b',
              borderRadius: '1rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              width: '100%',
              maxWidth: '48rem',
              margin: '0 1rem',
              animation: 'fadeIn 0.3s ease-in-out',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            {/* Header */}
            <div className="modal-header">
              <h3>Client Documents</h3>
              <button
                className="modal-close"
                onClick={() => setShowDocModal(false)}
                aria-label="Close modal"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="modal-content">
              {viewingDocs.length > 0 ? (
                <div className="docs-grid">
                  {viewingDocs.map((doc, index) => {
                    // Handle both old format (string URLs) and new format (objects with type)
                    let docUrl = typeof doc === 'string' ? doc : doc.url;
                    const docType = typeof doc === 'string' ? 'unknown' : doc.type;
                    
                    // Ensure URL has proper prefix (fix for old format URLs)
                    if (docUrl && !docUrl.startsWith('http')) {
                      docUrl = `https://assets.mydelhiagent.in/${docUrl}`;
                    }
                    
                    const fileName = docUrl.split('/').pop();
                    
                    console.log('Document:', doc);
                    console.log('URL:', docUrl);
                    console.log('Type:', docType);
                    
                    return (
                      <div key={index} className="doc-item" onClick={() => openDocInNewTab(docUrl)}>
                        <div className="doc-preview-large">
                          {/* PDF Preview */}
                          {docType === 'application/pdf' ? (
                            <div className="doc-pdf-preview-large">
                              <iframe
                                src={`${docUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                                className="doc-pdf-iframe-large"
                                title={`PDF Preview ${fileName}`}
                              />
          </div>
                          ) : 
                          
                          /* Image Preview */
                          docType.startsWith('image/') ? (
                            <img
                              src={docUrl}
                              alt={fileName}
                              className="doc-image-large"
                            />
                          ) : 
                          
                          /* Document Icon for everything else */
                          (
                            <div className="doc-icon-large">
                              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14,2 14,8 20,8" />
                              </svg>
                              <span>Document</span>
        </div>
                          )}
                        </div>
                        <div className="doc-actions">
                          <button
                            className="btn-view-doc"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDocInNewTab(docUrl);
                            }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            View Document
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="no-docs">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="no-docs-icon">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14,2 14,8 20,8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10,9 9,9 8,9" />
                  </svg>
                  <p>No documents uploaded for this client</p>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
