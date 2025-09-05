import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/My_Delhi_Agent.png";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToContact = () => {
    const section = document.getElementById("contact");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogin = () => {
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const handleSignup = () => {
    navigate("/signup");
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? "header-scrolled" : ""}`}>
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <div className="header-logo" onClick={() => navigate("/")}>
            <img src={logo} alt="My Delhi Agent" className="logo-img" />
            <div className="logo-text">
              <h1 className="logo-title">My Delhi Agent</h1>
              <p className="logo-subtitle">Premium Real Estate Solutions</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className={`header-nav ${isMobileMenuOpen ? "nav-open" : ""}`}>
            <ul className="nav-list">
              <li className="nav-item">
                <a href="#about" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                  About Us
                </a>
              </li>
              <li className="nav-item">
                <a href="#services" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                  Services
                </a>
              </li>
              <li className="nav-item">
                <a href="#properties" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                  Properties
                </a>
              </li>
              <li className="nav-item">
                <a href="#testimonials" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                  Testimonials
                </a>
              </li>
              <li className="nav-item">
                <a href="#contact" className="nav-link" onClick={handleScrollToContact}>
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          {/* Actions */}
          <div className="header-actions">
            <button className="btn btn-ghost" onClick={handleLogin}>
              Login
            </button>
            <button className="btn btn-primary" onClick={handleSignup}>
              Get Started
            </button>
            
            {/* Mobile Menu Button */}
            <button 
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <span className={`hamburger ${isMobileMenuOpen ? "hamburger-open" : ""}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
            <nav className="mobile-nav">
              <ul className="mobile-nav-list">
                <li className="mobile-nav-item">
                  <a href="#about" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                    About Us
                  </a>
                </li>
                <li className="mobile-nav-item">
                  <a href="#services" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                    Services
                  </a>
                </li>
                <li className="mobile-nav-item">
                  <a href="#properties" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                    Properties
                  </a>
                </li>
                <li className="mobile-nav-item">
                  <a href="#testimonials" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                    Testimonials
                  </a>
                </li>
                <li className="mobile-nav-item">
                  <a href="#contact" className="mobile-nav-link" onClick={handleScrollToContact}>
                    Contact
                  </a>
                </li>
              </ul>
              
              <div className="mobile-actions">
                <button className="btn btn-ghost btn-lg" onClick={handleLogin}>
                  Login
                </button>
                <button className="btn btn-primary btn-lg" onClick={handleSignup}>
                  Get Started
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}