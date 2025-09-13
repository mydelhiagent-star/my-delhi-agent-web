import React from "react";
import InquiryForm from "../../components/InquiryForm/InquiryForm";
import "./InquiryPage.css";

export default function InquiryPage() {
  return (
    <div className="inquiry-page-container">
      <div className="inquiry-page-header">
        <h2>Property Inquiry</h2>
        <p>Submit your property requirements and we'll help you find the perfect match from our network.</p>
      </div>
      
      <div className="inquiry-page-content">
        <InquiryForm variant="broker" />
      </div>
    </div>
  );
}
