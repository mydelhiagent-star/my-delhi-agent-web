import React, { useState } from "react";
import "./FAQ.css";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "How do I register as a broker?",
      answer: "Click on 'Get Started' and fill in your details to get verified. Our team will review your application and approve it within 24-48 hours. You'll need to provide valid business documents and proof of identity.",
      icon: "🏢"
    },
    {
      question: "Is there a listing fee?",
      answer: "Currently, listing properties on My Delhi Agent is completely free. We believe in providing value to our broker network without any upfront costs. Our revenue model is based on successful transactions.",
      icon: "💰"
    },
    {
      question: "Can buyers contact brokers directly?",
      answer: "Yes! Once logged in, buyers can directly connect with verified brokers and builders through our secure messaging system. All communications are tracked and monitored for quality assurance.",
      icon: "💬"
    },
    {
      question: "How do I verify my broker account?",
      answer: "We verify brokers through a multi-step process including document verification, business license check, and reference validation. This ensures only legitimate and trustworthy brokers join our platform.",
      icon: "✅"
    },
    {
      question: "What areas do you cover?",
      answer: "We currently cover all major areas in Delhi NCR including Greater Kailash, Lajpat Nagar, Karol Bagh, Connaught Place, South Delhi, Gurgaon, Noida, and Faridabad. We're constantly expanding our coverage.",
      icon: "📍"
    },
    {
      question: "How do I get support?",
      answer: "Our support team is available 24/7 through WhatsApp, email, and phone. You can also access our comprehensive help center with guides, tutorials, and best practices for brokers.",
      icon: "🆘"
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely! We use enterprise-grade encryption and security measures to protect your data. All transactions are secure, and we comply with data protection regulations to ensure your privacy.",
      icon: "🔒"
    },
    {
      question: "Can I manage multiple properties?",
      answer: "Yes! Our platform allows you to manage unlimited properties with advanced tools for tracking, analytics, and client management. You can organize properties by location, type, or status.",
      icon: "📊"
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="faq" id="faq">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">
            <span className="badge-icon">❓</span>
            <span className="badge-text">FAQ</span>
          </div>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Find answers to common questions about our platform and services
          </p>
        </div>

        <div className="faq-container">
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item ${openIndex === index ? 'open' : ''}`}
                onClick={() => toggleFAQ(index)}
              >
                <div className="faq-question">
                  <div className="faq-icon">{faq.icon}</div>
                  <h3 className="faq-question-text">{faq.question}</h3>
                  <div className="faq-toggle">
                    <svg 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none"
                      className={`toggle-icon ${openIndex === index ? 'rotated' : ''}`}
                    >
                      <path 
                        d="M6 9L12 15L18 9" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <div className={`faq-answer ${openIndex === index ? 'open' : ''}`}>
                  <p className="faq-answer-text">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="faq-cta">
          <div className="cta-content">
            <h3 className="cta-title">Still have questions?</h3>
            <p className="cta-subtitle">Our support team is here to help you 24/7</p>
            <div className="cta-buttons">
              <a href="https://wa.me/919876543210" className="btn btn-primary btn-lg" target="_blank" rel="noopener noreferrer">
                <span className="btn-icon">💬</span>
                Chat on WhatsApp
              </a>
              <a href="mailto:support@mydelhiagent.com" className="btn btn-outline btn-lg">
                <span className="btn-icon">✉️</span>
                Email Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}