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

export default function Footer() {
  const socialLinks = [
    { name: "Instagram", url: "https://instagram.com/mydelhiagent", color: "#E4405F", Icon: InstagramIcon },
    { name: "Facebook", url: "https://facebook.com/mydelhiagent", color: "#1877F2", Icon: FacebookIcon },
    { name: "YouTube", url: "https://youtube.com/@mydelhiagent", color: "#FF0000", Icon: YouTubeIcon },
    { name: "LinkedIn", url: "https://linkedin.com/company/mydelhiagent", color: "#0A66C2", Icon: LinkedInIcon }
  ];

  return (
    <footer className="mda-footer" id="contact">
      <div className="mda-footer-container">
        <div className="contact-section">
          <h3>Contact Us</h3>
          <div className="contact-details">
            <p>
              <span className="contact-label">Address:</span>
              <span> 123, Connaught Place, New Delhi, Delhi 110001</span>
            </p>
            <p>
              <span className="contact-label">Phone:</span>
              <a href="tel:+919876543210"> +91 98765 43210</a>
            </p>
            <p>
              <span className="contact-label">Email:</span>
              <a href="mailto:contact@mydelhiagent.com"> contact@mydelhiagent.com</a>
            </p>
          </div>
        </div>

        <div className="social-media-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            {socialLinks.map(({ name, url, color, Icon }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                style={{ '--social-color': color }}
                aria-label={`Follow us on ${name}`}
              >
                <span className="icon" aria-hidden="true"><Icon /></span>
                <span className="tooltip">{name}</span>
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
