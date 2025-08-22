import "./Footer.css";

export default function Footer() {
  const socialLinks = [
    {
      name: "Instagram",
      url: "https://instagram.com/mydelhiagent",
      icon: "📷",
      color: "#E4405F"
    },
    {
      name: "Facebook",
      url: "https://facebook.com/mydelhiagent",
      icon: "📘",
      color: "#1877F2"
    },
    {
      name: "YouTube",
      url: "https://youtube.com/@mydelhiagent",
      icon: "📺",
      color: "#FF0000"
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/company/mydelhiagent",
      icon: "💼",
      color: "#0A66C2"
    }
  ];

  return (
    <footer className="mda-footer">
      <div className="mda-footer-container">
        <div className="social-media-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                style={{ '--social-color': social.color }}
                aria-label={`Follow us on ${social.name}`}
              >
                <span className="icon">{social.icon}</span>
                <span className="tooltip">{social.name}</span>
              </a>
            ))}
          </div>
        </div>
        
        <div className="footer-divider"></div>
        
        <p className="mda-footer-text">© 2025 My Delhi Agent</p>
      </div>
    </footer>
  );
}
