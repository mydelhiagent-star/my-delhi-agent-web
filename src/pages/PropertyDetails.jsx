import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const preloaded =
    location.state && location.state.property ? location.state.property : null;

  const [property, setProperty] = useState(preloaded);
  const [loading, setLoading] = useState(!preloaded);
  const [error, setError] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (preloaded) return;

    const fetchProperty = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_ENDPOINTS.PROPERTIES}${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
          throw new Error("Failed to load property");
        }
        const data = await res.json();
        setProperty(data);
      } catch (err) {
        setError("Unable to load property. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, preloaded]);

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

  if (loading) {
    return <div style={{ padding: "2rem", color: "#fff" }}>Loading...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", color: "#fff" }}>
        <p>{error}</p>
        <button onClick={() => navigate(-1)} style={{ marginTop: 12 }}>
          Go Back
        </button>
      </div>
    );
  }

  if (!property) {
    return (
      <div style={{ padding: "2rem", color: "#fff" }}>
        <p>Property not found.</p>
        <button onClick={() => navigate(-1)} style={{ marginTop: 12 }}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: "#0d1a26", minHeight: "100vh", color: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", padding: "1rem" }}>
        <button onClick={() => navigate(-1)} style={{ marginRight: 12 }}>
          ← Back
        </button>
        <h2 style={{ margin: 0 }}>{property.title}</h2>
      </div>

      {/* Single-item wide media viewer */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "70vh",
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
                }}
              />
            ) : (
              <video controls style={{ maxHeight: "100%", maxWidth: "100%" }}>
                <source src={activeMedia.src} type="video/mp4" />
              </video>
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
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#fff",
                padding: "8px 10px",
                borderRadius: 8,
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
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#fff",
                padding: "8px 10px",
                borderRadius: 8,
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

      {/* Details Toggle */}
      <div style={{ padding: "1rem 1.5rem" }}>
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
        <div
          style={{
            padding: "0 1.5rem 2rem",
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "1rem",
          }}
        >
          <div>
            <h3 style={{ margin: "0 0 .5rem" }}>Overview</h3>
            <p style={{ margin: 0, color: "#b0bec5" }}>
              {property.description}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            <Info label="Address" value={property.address} />
            <Info label="Nearest Landmark" value={property.nearest_landmark} />
            {property.price !== undefined && (
              <Info
                label="Price"
                value={`₹${Number(property.price).toLocaleString()}`}
              />
            )}
            {property.status && <Info label="Status" value={property.status} />}
            {property.owner_name && (
              <Info label="Owner" value={property.owner_name} />
            )}
            {property.owner_phone && (
              <Info label="Owner Phone" value={property.owner_phone} />
            )}
            {property.location && (
              <Info label="Location" value={property.location} />
            )}
            {property.sub_location && (
              <Info label="Sub Location" value={property.sub_location} />
            )}
          </div>
        </div>
      )}
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
