import "./Hero.css";
import LoginForm from "../LoginForm/LoginForm";
import AboutUs from "../AboutUs/AboutUs";

export default function Hero() {
  return (
    <section className="mda-hero">
      <div className="mda-hero-inner">
        <div className="mda-hero-left">
          <h2>Connecting Brokers, Builders, and Buyers</h2>
          <p>
            At <strong>My Delhi Agent</strong>, we simplify property deals by
            connecting top brokers and builders with genuine buyers in Delhi.
          </p>
          <AboutUs />
        </div>
        <div className="mda-hero-right">
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
