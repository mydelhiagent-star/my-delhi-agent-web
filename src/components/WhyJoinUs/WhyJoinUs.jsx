import "./WhyJoinUs.css";

export default function WhyJoinUs() {
  return (
    <section className="mda-why-join">
      <div className="mda-why-join-container">
        <h2 className="mda-why-join-title">Why Join Us?</h2>
        <div className="mda-features-grid">
          <div className="mda-feature-card">
            <div className="mda-feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#00bcd4"/>
              </svg>
            </div>
            <h3 className="mda-feature-title">0% Commission</h3>
            <p className="mda-feature-description">
              Keep 100% of your earnings. No hidden fees, no surprises. What you earn is what you keep.
            </p>
          </div>
          
          <div className="mda-feature-card">
            <div className="mda-feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 4C16 5.10457 15.1046 6 14 6C12.8954 6 12 5.10457 12 4C12 2.89543 12.8954 2 14 2C15.1046 2 16 2.89543 16 4Z" fill="#00bcd4"/>
                <path d="M20 10C20 11.1046 19.1046 12 18 12C16.8954 12 16 11.1046 16 10C16 8.89543 16.8954 8 18 8C19.1046 8 20 8.89543 20 10Z" fill="#00bcd4"/>
                <path d="M8 10C8 11.1046 7.10457 12 6 12C4.89543 12 4 11.1046 4 10C4 8.89543 4.89543 8 6 8C7.10457 8 8 8.89543 8 10Z" fill="#00bcd4"/>
                <path d="M12 18C12 19.1046 11.1046 20 10 20C8.89543 20 8 19.1046 8 18C8 16.8954 8.89543 16 10 16C11.1046 16 12 16.8954 12 18Z" fill="#00bcd4"/>
                <path d="M16 18C16 19.1046 15.1046 20 14 20C12.8954 20 12 19.1046 12 18C12 16.8954 12.8954 16 14 16C15.1046 16 16 16.8954 16 18Z" fill="#00bcd4"/>
              </svg>
            </div>
            <h3 className="mda-feature-title">Vast Network</h3>
            <p className="mda-feature-description">
              Connect with brokers and opportunities across Delhi. Expand your reach and grow your business.
            </p>
          </div>
          
          <div className="mda-feature-card">
            <div className="mda-feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3M19 19H5V5H19V19M17 17H7V7H17V17M15 15H9V9H15V15Z" fill="#00bcd4"/>
              </svg>
            </div>
            <h3 className="mda-feature-title">Streamlined Tools</h3>
            <p className="mda-feature-description">
              Manage your portfolio with ease using our intuitive tools and dashboard. Everything you need in one place.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
