import "./Header.css";
import logo from "../../assets/logo.png";

export default function Header() {
  return (
    <header className="mda-header">
      <div className="mda-header-left">
        <img src={logo} alt="My Delhi Agent" className="mda-logo" />
       
      </div>
    </header>
  );
}
