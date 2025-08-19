import { useState } from "react";
import "./Hero.css";
import LoginModal from "../LoginModal/LoginModal";

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
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
