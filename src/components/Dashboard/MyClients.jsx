import React, { useState, useEffect } from "react";
import "./MyClients.css";
import { API_ENDPOINTS } from "../../config/api";

export default function MyClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientProperties, setClientProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(false);

  useEffect(() => {
    fetchMyClients();
  }, []);

  useEffect(()=>{
    console.log("clientProperties");
    console.log(clientProperties);
  },[clientProperties])

  



  const fetchMyClients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_ENDPOINTS.LEADS_SEARCH}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }

      const data = await response.json();
      
      const brokerClients = data.leads;
      
      const clientsWithProperties = brokerClients.filter(client => 
        client.properties && client.properties.length > 0
      );
      
      setClients(clientsWithProperties);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (client) => {
    console.log(client);
    console.log("Selected client for view:", client);
    setSelectedClient(client);
    setShowClientModal(true);
    await fetchClientProperties(client.id);
  };

  const fetchClientProperties = async (id) => {
    console.log(id);
    try{
      setLoadingProperties(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_ENDPOINTS.LEADS}${id}/property-details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if(response.ok)
      {
        const data = await response.json();
        console.log(data);
        data != null ? setClientProperties(data) : setClientProperties([]);
      }
      else
      {
        console.error("Error fetching client properties:", response.status);
        setClientProperties([]);
      }
    }
    catch(error)
    {
      console.error("Error fetching client properties:", error);
      setClientProperties([]);
    }
    finally {
        setLoadingProperties(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="my-clients-loading">Loading your clients...</div>;
  }

  return (
    <div className="my-clients-container">
      <h3 className="my-clients-title">My Clients</h3>
      
      {clients.length === 0 ? (
        <div className="no-clients">
          <p>You don't have any clients yet.</p>
          <p>Clients will appear here when they view your properties.</p>
        </div>
      ) : (
        <div className="clients-grid">
          {clients.map((client) => (
            <div key={client.id} className="client-card">
              <div className="client-info">
                <h4 className="client-name">{client.name}</h4>
                <p className="client-phone">{client.phone}</p>
                {client.email && (
                  <p className="client-email">{client.email}</p>
                )}
                {client.requirement && (
                  <p className="client-requirement">
                    <strong>Requirement:</strong> {client.requirement}
                  </p>
                )}
                
              </div>
              
              <div className="client-actions">
                <button
                  className="client-view-btn"
                  onClick={() => handleView(client)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Client View Modal */}
      {showClientModal && selectedClient && (
        <div className="client-modal-overlay">
          <div className="client-modal-content">
            <div className="client-modal-header">
              <h3>Client Details</h3>
              <button
                className="client-modal-close"
                onClick={() => {
                  setShowClientModal(false);
                  setClientProperties([]);
                }}
              >
                ✕
              </button>
            </div>
            
            <div className="client-details">
              <div className="client-detail-row">
                <strong>Name:</strong> {selectedClient.name || 'N/A'}
              </div>
              <div className="client-detail-row">
                <strong>Requirement:</strong> {selectedClient.requirement || 'N/A'}
              </div>
            </div>

           
            {selectedClient.properties && selectedClient.properties.length > 0 && (
              <div className="client-properties">
                <h4>Properties</h4>
                
                {loadingProperties ? (
                  <div className="properties-loading">Loading properties...</div>
                ) : clientProperties.length > 0 ? (
                    
                  <div className="properties-grid">
                    {clientProperties.map((property, index) => (
                      <div key={property.id || index} className="property-card">
                        {/* Carousel */}
                        <div className="property-carousel">
                          <div className="property-carousel-content">
                            {property.photos &&
                              property.photos.map((photo, i) => (
                                <img
                                  key={i}
                                  src={photo}
                                  alt={`Property ${i}`}
                                />
                              ))}
                            {property.videos &&
                              property.videos.map((video, i) => (
                                <video key={i} controls>
                                  <source src={video} type="video/mp4" />
                                </video>
                              ))}
                          </div>
                        </div>

                        {/* Property Details */}
                        <h4 className="property-title">{property.title}</h4>
                        <p className="property-description">{property.description}</p>
                        <p className="property-detail">
                          <b>Address:</b> {property.address}
                        </p>
                        <p className="property-detail">
                          <b>Price:</b> ₹{property.price}
                        </p>
                        <p className="property-detail">
                          <b>Nearest Landmark:</b> {property.nearest_landmark}
                        </p>
                        <p className="property-detail">
                          <b>Date:</b> {formatDate(property.created_at)}
                        </p>
                        {property.status && (
                          <p className="property-status">
                            Status: {property.status}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-properties">No property details found</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}