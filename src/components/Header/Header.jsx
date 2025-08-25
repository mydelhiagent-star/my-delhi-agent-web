import "./Header.css";
import logo from "../../assets/My_Delhi_Agent.png";

export default function Header() {
  const handleScrollToContact = () => {
    const section = document.getElementById("contact");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="mda-header">
      <div className="mda-header-left">
        {/* <img src={logo} alt="My Delhi Agent" className="mda-logo" /> */}
        <div className="mda-header-right">
          <h1>My Delhi Agent</h1>
          
        </div>
      </div>
      <div className="mda-header-actions">
        <button className="contact-btn" onClick={handleScrollToContact}>Contact Us</button>
      </div>
    </header>
  );
}
