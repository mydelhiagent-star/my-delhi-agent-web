import { useState } from "react";
import "./Reviews.css";

export default function Reviews() {
  const reviews = [
    {
      id: 1,
      name: "Rahul Sharma",
      location: "Delhi",
      rating: 5,
      comment: "My Delhi Agent helped me find my dream home in just 2 weeks! The brokers were very professional and responsive."
    },
    {
      id: 2,
      name: "Priya Patel",
      location: "Gurgaon",
      rating: 5,
      comment: "Excellent platform for property search. I got multiple options within my budget and the verification process was smooth."
    },
    {
      id: 3,
      name: "Amit Kumar",
      location: "Noida",
      rating: 4,
      comment: "Great experience finding a rental property. The brokers were verified and trustworthy. Highly recommended!"
    },
    {
      id: 4,
      name: "Neha Singh",
      location: "Delhi",
      rating: 5,
      comment: "As a broker, this platform has increased my client base significantly. The interface is user-friendly and efficient."
    },
    {
      id: 5,
      name: "Vikram Malhotra",
      location: "Faridabad",
      rating: 5,
      comment: "Found my perfect investment property through My Delhi Agent. The market insights and broker recommendations were spot on!"
    },
    {
      id: 6,
      name: "Anjali Gupta",
      location: "Ghaziabad",
      rating: 4,
      comment: "Smooth experience from start to finish. The platform's verification system gives me confidence in dealing with brokers."
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 3 >= reviews.length ? 0 : prevIndex + 3
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 3 < 0 ? Math.max(0, reviews.length - 3) : prevIndex - 3
    );
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? 'filled' : 'empty'}`}>
        ★
      </span>
    ));
  };

  const visibleReviews = reviews.slice(currentIndex, currentIndex + 3);

  return (
    <section className="mda-reviews">
      <div className="mda-reviews-inner">
        <h2>What People Say About Us</h2>
        <p className="reviews-subtitle">Discover why thousands trust My Delhi Agent for their property needs</p>
        
        <div className="reviews-carousel">
          <button 
            className="carousel-btn prev-btn" 
            onClick={prevSlide}
            aria-label="Previous reviews"
          >
            ‹
          </button>
          
          <div className="reviews-container">
            <div className="reviews-grid">
              {visibleReviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <h4>{review.name}</h4>
                      <p className="location">{review.location}</p>
                    </div>
                    <div className="rating">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>

          <button 
            className="carousel-btn next-btn" 
            onClick={nextSlide}
            aria-label="Next reviews"
          >
            ›
          </button>
        </div>

        <div className="carousel-indicators">
          {Array.from({ length: Math.ceil(reviews.length / 3) }, (_, index) => (
            <button
              key={index}
              className={`indicator ${index === Math.floor(currentIndex / 3) ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index * 3)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
