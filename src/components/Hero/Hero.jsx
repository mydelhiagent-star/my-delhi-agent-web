import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";
import LoginModal from "../LoginModal/LoginModal";

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const heroSlides = [
    {
      title: "Premium Real Estate Network",
      subtitle: "Connect with Delhi's top brokers. Zero commission, maximum collaboration.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80"
    },
    {
      title: "Exclusive Property Listings",
      subtitle: "Access premium properties across Delhi NCR with our trusted broker network.",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80"
    },
    {
      title: "Smart Broker Solutions",
      subtitle: "Advanced tools and analytics to grow your real estate business.",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2053&q=80"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const openModal = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.role === "dealer") {
          navigate("/dashboard");
          return;
        }
      } catch (_) {}
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleScrollToFeatures = () => {
    const section = document.getElementById("features");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <section className="hero">
        {/* Background Slides */}
        <div className="hero-background">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentSlide ? "active" : ""}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            />
          ))}
          <div className="hero-overlay"></div>
        </div>

        {/* Hero Content */}
        <div className="hero-content">
          <div className="container">
            <div className="hero-inner">
              <div className="hero-text">
                <div className="hero-badge">
                  <span className="badge-icon">🏆</span>
                  <span className="badge-text">Delhi's #1 Broker Network</span>
                </div>
                
                <h1 className="hero-title">
                  {heroSlides[currentSlide].title}
                </h1>
                
                <p className="hero-subtitle">
                  {heroSlides[currentSlide].subtitle}
                </p>

                <div className="hero-stats">
                  <div className="stat-item">
                    <span className="stat-number">500+</span>
                    <span className="stat-label">Active Brokers</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">10,000+</span>
                    <span className="stat-label">Properties Listed</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">₹500Cr+</span>
                    <span className="stat-label">Value Transacted</span>
                  </div>
                </div>

                <div className="hero-actions">
                  <button className="btn btn-primary btn-lg" onClick={openModal}>
                    <span className="btn-icon">🚀</span>
                    Join as Broker
                  </button>
                  <button className="btn btn-outline btn-lg" onClick={handleSignup}>
                    <span className="btn-icon">📋</span>
                    Get Started Free
                  </button>
                </div>

                <div className="hero-features">
                  <div className="feature-item">
                    <span className="feature-icon">✅</span>
                    <span className="feature-text">Zero Commission</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🤝</span>
                    <span className="feature-text">Collaborative Network</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">📱</span>
                    <span className="feature-text">Mobile App</span>
                  </div>
                </div>
              </div>

              <div className="hero-visual">
                <div className="hero-card">
                  <div className="card-header">
                    <div className="card-avatar">
                      <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Broker" />
                    </div>
                    <div className="card-info">
                      <h4>Rajesh Kumar</h4>
                      <p>Premium Broker</p>
                    </div>
                    <div className="card-status">
                      <span className="status-dot"></span>
                      <span>Online</span>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="property-item">
                      <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Property" />
                      <div className="property-info">
                        <h5>Luxury Apartment</h5>
                        <p>₹2.5Cr - ₹3Cr</p>
                        <span className="property-location">📍 Greater Kailash</span>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer">
                    <button className="btn btn-primary btn-sm">View Details</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="hero-indicators">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator" onClick={handleScrollToFeatures}>
          <div className="scroll-text">Discover More</div>
          <div className="scroll-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </section>
      
      <LoginModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}