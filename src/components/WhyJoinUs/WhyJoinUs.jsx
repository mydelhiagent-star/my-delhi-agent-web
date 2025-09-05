import React from "react";
import "./WhyJoinUs.css";

export default function WhyJoinUs() {
  const features = [
    {
      icon: "💰",
      title: "0% Commission",
      description: "Keep 100% of your earnings. No hidden fees, no surprises. What you earn is what you keep.",
      color: "var(--success-500)"
    },
    {
      icon: "🤝",
      title: "Vast Network",
      description: "Connect with brokers and opportunities across Delhi. Expand your reach and grow your business.",
      color: "var(--primary-500)"
    },
    {
      icon: "⚡",
      title: "Streamlined Tools",
      description: "Manage your portfolio with ease using our intuitive tools and dashboard. Everything you need in one place.",
      color: "var(--secondary-500)"
    },
    {
      icon: "📱",
      title: "Mobile App",
      description: "Access your business on the go with our mobile application. Stay connected wherever you are.",
      color: "var(--warning-500)"
    },
    {
      icon: "🔒",
      title: "Secure Platform",
      description: "Your data and transactions are protected with enterprise-grade security and encryption.",
      color: "var(--error-500)"
    },
    {
      icon: "📊",
      title: "Analytics & Insights",
      description: "Get detailed insights into your performance with comprehensive analytics and reporting tools.",
      color: "var(--primary-600)"
    }
  ];

  return (
    <section className="why-join-us" id="features">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">
            <span className="badge-icon">✨</span>
            <span className="badge-text">Why Choose Us</span>
          </div>
          <h2 className="section-title">
            The Ultimate Platform for Real Estate Professionals
          </h2>
          <p className="section-subtitle">
            Join thousands of successful brokers who trust My Delhi Agent for their business growth
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card" style={{ '--feature-color': feature.color }}>
              <div className="feature-icon-wrapper">
                <span className="feature-icon">{feature.icon}</span>
                <div className="feature-icon-bg"></div>
              </div>
              <div className="feature-content">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
              <div className="feature-hover-effect"></div>
            </div>
          ))}
        </div>

        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">🏆</div>
              <div className="stat-content">
                <span className="stat-number">500+</span>
                <span className="stat-label">Active Brokers</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🏠</div>
              <div className="stat-content">
                <span className="stat-number">10,000+</span>
                <span className="stat-label">Properties Listed</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <span className="stat-number">₹500Cr+</span>
                <span className="stat-label">Value Transacted</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <span className="stat-number">4.9/5</span>
                <span className="stat-label">User Rating</span>
              </div>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <div className="cta-content">
            <h3 className="cta-title">Ready to Transform Your Real Estate Business?</h3>
            <p className="cta-subtitle">Join the most trusted broker network in Delhi today</p>
            <div className="cta-buttons">
              <button className="btn btn-primary btn-lg">
                <span className="btn-icon">🚀</span>
                Get Started Free
              </button>
              <button className="btn btn-outline btn-lg">
                <span className="btn-icon">📞</span>
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}