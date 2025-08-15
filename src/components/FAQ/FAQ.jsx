import "./FAQ.css";

export default function FAQ() {
  return (
    <section className="mda-faq">
      <div className="mda-faq-inner">
        <h2>Frequently Asked Questions</h2>

        <details>
          <summary>How do I register as a broker?</summary>
          <p>
            Click Sign Up (coming soon) and fill your details to get verified.
          </p>
        </details>

        <details>
          <summary>Is there a listing fee?</summary>
          <p>Currently, listing properties on My Delhi Agent is free.</p>
        </details>

        <details>
          <summary>Can buyers contact brokers directly?</summary>
          <p>
            Yes. Once logged in, buyers can directly connect with
            brokers/builders.
          </p>
        </details>
      </div>
    </section>
  );
}
