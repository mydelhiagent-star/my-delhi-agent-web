import "./Header.css";
import logo from "../../assets/My_Delhi_Agent.png";

export default function Header() {
  return (
    <header className="mda-header">
      <div className="mda-header-left">
        {/* <img src={logo} alt="My Delhi Agent" className="mda-logo" /> */}
        <div className="mda-header-right">
          <h1>My Delhi Agent</h1>
          
        </div>
      </div>
    </header>
  );
}
