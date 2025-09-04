import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";
import LoginModal from "../LoginModal/LoginModal";

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in as broker, clicking login should redirect
  }, []);

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

  return (
    <>
      <section className="mda-hero">
        <div className="mda-hero-overlay"></div>
        <div className="mda-hero-inner">
          <div className="mda-hero-content">
            <h1 className="mda-hero-title">My Delhi Agent</h1>
            <p className="mda-hero-subtitle">
              The premium network for brokers. 0% commission, 100% collaboration. It's a win-win for all.
            </p>
            <button className="mda-hero-cta" onClick={openModal}>
              Broker Login
            </button>
          </div>
        </div>
      </section>
      
      <LoginModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
