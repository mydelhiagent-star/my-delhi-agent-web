import React, { useMemo, useState } from "react";

export default function PropertyPreview({ property, onClose }) {
  const mediaItems = useMemo(() => {
    const photos = Array.isArray(property?.photos)
      ? property.photos.map((src) => ({ type: "image", src }))
      : [];
    const videos = Array.isArray(property?.videos)
      ? property.videos.map((src) => ({ type: "video", src }))
      : [];
    return [...photos, ...videos];
  }, [property]);

  const [mediaIndex, setMediaIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const canShowMedia = mediaItems.length > 0;
  const activeMedia = canShowMedia
    ? mediaItems[Math.max(0, Math.min(mediaIndex, mediaItems.length - 1))]
    : null;

  const goPrev = () =>
    setMediaIndex((i) =>
      mediaItems.length === 0
        ? 0
        : (i - 1 + mediaItems.length) % mediaItems.length
    );
  const goNext = () =>
    setMediaIndex((i) =>
      mediaItems.length === 0 ? 0 : (i + 1) % mediaItems.length
    );


  return (
    <div
      className="property-preview-overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        className="property-preview-content"
        style={{
          background: "#0d1a26",
          color: "#fff",
          width: "min(1200px, 98vw)",
          maxHeight: "95vh",
          borderRadius: 14,
          border: "1px solid rgba(0,188,212,0.2)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 14px",
            gap: 10,
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              color: "#00bcd4",
              border: "1px solid rgba(0,188,212,0.4)",
              padding: "8px 12px",
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            ← Back
          </button>
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {property?.title}
          </h2>
        </div>

        <div
          style={{
            position: "relative",
            width: "100%",
            height: "75vh",
            background: "#000",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            {activeMedia ? (
              activeMedia.type === "image" ? (
                <img
                  src={activeMedia.src}
                  alt="Property media"
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                    imageRendering: "high-quality",
                    filter: "none",
                  }}
                  loading="eager"
                />
              ) : (
                <iframe
                  src={
                    'https://www.youtube.com/embed/5ZemEgs3fFA'
                  }
                  title="Property video_89"
                  // style={{
                  //   width: "100%",
                  //   height: "100%",
                  //   border: "none",
                  //   borderRadius: "8px"
                  // }}
                  // allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  // allowFullScreen
                >
                </iframe>
              )
            ) : (
              <div style={{ color: "#90a4ae" }}>No media available</div>
            )}
          </div>

          {canShowMedia && (
            <>
              <button
                onClick={goPrev}
                aria-label="Previous"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 12,
                  transform: "translateY(-50%)",
                  background: "rgba(0,0,0,0.6)",
                  border: "1px solid rgba(255,255,255,0.4)",
                  color: "#fff",
                  padding: "12px 14px",
                  borderRadius: 8,
                  fontSize: "18px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(0,0,0,0.8)";
                  e.target.style.borderColor = "rgba(255,255,255,0.6)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(0,0,0,0.6)";
                  e.target.style.borderColor = "rgba(255,255,255,0.4)";
                }}
              >
                ‹
              </button>
              <button
                onClick={goNext}
                aria-label="Next"
                style={{
                  position: "absolute",
                  top: "50%",
                  right: 12,
                  transform: "translateY(-50%)",
                  background: "rgba(0,0,0,0.6)",
                  border: "1px solid rgba(255,255,255,0.4)",
                  color: "#fff",
                  padding: "12px 14px",
                  borderRadius: 8,
                  fontSize: "18px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(0,0,0,0.8)";
                  e.target.style.borderColor = "rgba(255,255,255,0.6)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(0,0,0,0.6)";
                  e.target.style.borderColor = "rgba(255,255,255,0.4)";
                }}
              >
                ›
              </button>
              <div
                style={{
                  position: "absolute",
                  bottom: 10,
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: 12,
                  color: "#cfd8dc",
                  background: "rgba(0,0,0,0.35)",
                  padding: "4px 8px",
                  borderRadius: 8,
                }}
              >
                {mediaIndex + 1} / {mediaItems.length}
              </div>
            </>
          )}
        </div>

        <div style={{ padding: "12px 14px" }}>
          <button
            onClick={() => setShowDetails((s) => !s)}
            style={{
              background: "#00bcd4",
              color: "#001018",
              border: "none",
              padding: "10px 14px",
              borderRadius: 10,
              fontWeight: 600,
            }}
          >
            {showDetails ? "Hide Details" : "Show Details"}
          </button>
        </div>

        {showDetails && (
          <div style={{ padding: "0 14px 16px" }}>
            <div style={{ marginBottom: 10 }}>
              <h3 style={{ margin: "0 0 .5rem" }}>Title</h3>
              <p style={{ margin: 0, color: "#b0bec5" }}>
                {property?.description}
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 12,
              }}
            >
              {(property?.min_price !== undefined || property?.max_price !== undefined) && (
                <Info
                  label="Price"
                  value={`₹${Number(property.min_price || 0).toLocaleString()} - ₹${Number(property.max_price || 0).toLocaleString()}`}
                />
              )}
              <Info label="Address" value={property?.address} />
              <Info
                label="Nearest Landmark"
                value={property?.nearest_landmark}
              />
              {property?.status && (
                <Info label="Status" value={property.status} />
              )}
              {property?.owner_name && (
                <Info label="Owner" value={property.owner_name} />
              )}
              {property?.owner_phone && (
                <Info label="Owner Phone" value={property.owner_phone} />
              )}
              {property?.location && (
                <Info label="Location" value={property.location} />
              )}
              {property?.sub_location && (
                <Info label="Sub Location" value={property.sub_location} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  if (!value) return null;
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(0,188,212,0.2)",
        borderRadius: 12,
        padding: "0.75rem 1rem",
      }}
    >
      <div style={{ fontSize: 12, color: "#90a4ae", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontWeight: 600 }}>{value}</div>
    </div>
  );
}
