"use client";

const PropertyClientsModal = ({ isOpen, onClose, property }) => {
  const handleClose = () => {
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
      <div className="relative bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 animate-in fade-in duration-300 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between !p-4 border-b border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-white">Property Clients</h2>
            <p className="text-sm text-slate-400 mt-1">{property?.title}</p>
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
            <h3 className="text-lg font-semibold text-slate-200 mb-4">
              Assigned Clients ({property?.clients?.length || 0})
            </h3>

            {/* Clients Display */}
            {property?.clients && property.clients.length > 0 ? (
              <div className="space-y-3">
                {property.clients.map((client, index) => (
                  <div key={index} className="!bg-slate-700/40 !border !border-slate-600/30 !rounded-xl !p-4 !transition-all !duration-200 hover:!bg-slate-700/60">
                    <div className="flex items-start space-x-3">
                      <div className="!w-10 !h-10 !bg-gradient-to-br !from-cyan-500 !to-cyan-600 !rounded-full !flex !items-center !justify-center !text-white !font-semibold !text-sm">
                        {client.name ? client.name.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <div className="flex-1">
                        <h4 className="!text-white !font-semibold !text-base !mb-1">
                          {client.name || `Client ${index + 1}`}
                        </h4>
                        <p className="!text-slate-300 !text-sm !mb-2">
                          {client.phone || 'No phone number'}
                        </p>
                        {client.notes && (
                          <p className="!text-slate-400 !text-sm !italic">
                            "{client.notes}"
                          </p>
                        )}
                      </div>
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyClientsModal;
