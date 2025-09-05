import React from "react";
import "./Footer.css";

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
    <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3zm11 1.5a1 1 0 100 2 1 1 0 000-2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
    <path d="M22 12.06C22 6.48 17.52 2 11.94 2 6.36 2 2 6.48 2 12.06 2 17.08 5.66 21.2 10.44 22v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34V22C18.34 21.2 22 17.08 22 12.06z"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
    <path d="M23.5 6.2a3.2 3.2 0 00-2.25-2.26C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.25.44A3.2 3.2 0 00.5 6.2 33.7 33.7 0 00.06 12a33.7 33.7 0 00.44 5.8 3.2 3.2 0 002.25 2.26C4.5 20.5 12 20.5 12 20.5s7.5 0 9.25-.44a3.2 3.2 0 002.25-2.26c.29-1.92.44-3.86.44-5.8s-.15-3.88-.44-5.8zM9.75 15.5v-7l6 3.5-6 3.5z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.6v-5.59c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.69h-3.6V9h3.46v1.56h.05c.48-.9 1.65-1.85 3.4-1.85 3.64 0 4.31 2.4 4.31 5.51v6.23zM5.34 7.44a2.1 2.1 0 110-4.2 2.1 2.1 0 010 4.2zM7.14 20.45H3.54V9h3.6v11.45z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
  </svg>
);

export default function Footer() {
  const socialLinks = [
    { name: "Instagram", url: "https://instagram.com/mydelhiagent", color: "#E4405F", Icon: InstagramIcon },
    { name: "Facebook", url: "https://facebook.com/mydelhiagent", color: "#1877F2", Icon: FacebookIcon },
    { name: "YouTube", url: "https://youtube.com/@mydelhiagent", color: "#FF0000", Icon: YouTubeIcon },
    { name: "LinkedIn", url: "https://linkedin.com/company/mydelhiagent", color: "#0A66C2", Icon: LinkedInIcon },
    { name: "Twitter", url: "https://twitter.com/mydelhiagent", color: "#1DA1F2", Icon: TwitterIcon },
    { name: "WhatsApp", url: "https://wa.me/919876543210", color: "#25D366", Icon: WhatsAppIcon }
  ];

  const quickLinks = [
    { name: "About Us", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Properties", href: "#properties" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" }
  ];

  const services = [
    "Property Listing",
    "Broker Network",
    "Market Analysis",
    "Investment Advisory",
    "Legal Support"
  ];

  const locations = [
    "Greater Kailash",
    "Lajpat Nagar",
    "Karol Bagh",
    "Connaught Place",
    "South Delhi"
  ];

  return (
    <footer className="footer" id="contact">
      <div className="footer-background">
        <div className="footer-pattern"></div>
      </div>
      
      <div className="container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-logo">
              <h3 className="logo-title">My Delhi Agent</h3>
              <p className="logo-subtitle">Premium Real Estate Solutions</p>
            </div>
            <p className="footer-description">
              Connecting Delhi's top brokers with premium properties. Zero commission, maximum collaboration, 
              and unmatched service quality for all your real estate needs.
            </p>
            <div className="footer-contact">
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div className="contact-details">
                  <span className="contact-label">Address</span>
                  <span className="contact-value">123, Connaught Place, New Delhi, Delhi 110001</span>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div className="contact-details">
                  <span className="contact-label">Phone</span>
                  <a href="tel:+919876543210" className="contact-value">+91 98765 43210</a>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <div className="contact-details">
                  <span className="contact-label">Email</span>
                  <a href="mailto:contact@mydelhiagent.com" className="contact-value">contact@mydelhiagent.com</a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="footer-link">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4 className="footer-title">Our Services</h4>
            <ul className="footer-links">
              {services.map((service, index) => (
                <li key={index}>
                  <span className="footer-link">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div className="footer-section">
            <h4 className="footer-title">Popular Locations</h4>
            <ul className="footer-links">
              {locations.map((location, index) => (
                <li key={index}>
                  <span className="footer-link">{location}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-section">
            <h4 className="footer-title">Stay Updated</h4>
            <p className="newsletter-description">
              Subscribe to get the latest property updates and market insights.
            </p>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="newsletter-input"
              />
              <button className="newsletter-btn">
                <span>Subscribe</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="footer-social">
          <h4 className="social-title">Follow Us</h4>
          <div className="social-links">
            {socialLinks.map(({ name, url, color, Icon }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                style={{ '--social-color': color }}
                aria-label={`Follow us on ${name}`}
              >
                <Icon />
                <span className="social-tooltip">{name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © 2025 My Delhi Agent. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <a href="#privacy" className="bottom-link">Privacy Policy</a>
              <a href="#terms" className="bottom-link">Terms of Service</a>
              <a href="#cookies" className="bottom-link">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}