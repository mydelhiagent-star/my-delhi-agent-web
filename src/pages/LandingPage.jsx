import Header from "../components/Header/Header";
import Hero from "../components/Hero/Hero";
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
      <Footer />
      <WhatsAppButton />
    </>
  );
}
