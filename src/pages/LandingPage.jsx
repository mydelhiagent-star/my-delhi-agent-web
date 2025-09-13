import Header from "../components/Header/Header";
import Hero from "../components/Hero/Hero";
import InquiryForm from "../components/InquiryForm/InquiryForm";
import WhyJoinUs from "../components/WhyJoinUs/WhyJoinUs";
import Reviews from "../components/Reviews/Reviews";
import FAQ from "../components/FAQ/FAQ";
import Footer from "../components/Footer/Footer";
import WhatsAppButton from "../components/WhatsAppButton/WhatsAppButton";

export default function LandingPage() {
  return (
    <>
      <Header />
      <Hero />
      <WhyJoinUs />
      <Reviews />
      <FAQ />
      <section className="inquiry-section">
        <div className="inquiry-section-container">
          <InquiryForm variant="home" />
        </div>
      </section>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
