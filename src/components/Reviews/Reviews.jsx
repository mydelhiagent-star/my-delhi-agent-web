import React, { useEffect, useState } from "react";
import "./Reviews.css";

export default function Reviews() {
  const reviews = [
    {
      id: 1,
      name: "Rahul Sharma",
      location: "Delhi",
      rating: 5,
      comment: "My Delhi Agent helped me find my dream home in just 2 weeks! The brokers were very professional and responsive.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      verified: true
    },
    {
      id: 2,
      name: "Priya Patel",
      location: "Gurgaon",
      rating: 5,
      comment: "Excellent platform for property search. I got multiple options within my budget and the verification process was smooth.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      verified: true
    },
    {
      id: 3,
      name: "Amit Kumar",
      location: "Noida",
      rating: 4,
      comment: "Great experience finding a rental property. The brokers were verified and trustworthy. Highly recommended!",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      verified: true
    },
    {
      id: 4,
      name: "Neha Singh",
      location: "Delhi",
      rating: 5,
      comment: "As a broker, this platform has increased my client base significantly. The interface is user-friendly and efficient.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      verified: true
    },
    {
      id: 5,
      name: "Vikram Malhotra",
      location: "Faridabad",
      rating: 5,
      comment: "Found my perfect investment property through My Delhi Agent. The market insights and broker recommendations were spot on!",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      verified: true
    },
    {
      id: 6,
      name: "Anjali Gupta",
      location: "Ghaziabad",
      rating: 4,
      comment: "Smooth experience from start to finish. The platform's verification system gives me confidence in dealing with brokers.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      verified: true
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Adjust items per slide based on viewport
  useEffect(() => {
    const computeItemsPerSlide = () => {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    };
    const update = () => setItemsPerSlide(computeItemsPerSlide());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const next = prevIndex + itemsPerSlide;
        return next >= reviews.length ? 0 : next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [itemsPerSlide, isAutoPlaying, reviews.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const next = prevIndex + itemsPerSlide;
      return next >= reviews.length ? 0 : next;
    });
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const prev = prevIndex - itemsPerSlide;
      if (prev < 0) {
        const remainder = reviews.length % itemsPerSlide;
        const lastFullStart = remainder === 0 ? reviews.length - itemsPerSlide : reviews.length - remainder;
        return Math.max(0, lastFullStart);
      }
      return prev;
    });
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index * itemsPerSlide);
    setIsAutoPlaying(false);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? 'filled' : 'empty'}`}>
        ★
      </span>
    ));
  };

  const visibleReviews = reviews.slice(currentIndex, currentIndex + itemsPerSlide);
  const totalSlides = Math.ceil(reviews.length / itemsPerSlide);
  const currentSlide = Math.floor(currentIndex / itemsPerSlide);

  return (
    <section className="reviews" id="testimonials">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">
            <span className="badge-icon">⭐</span>
            <span className="badge-text">Testimonials</span>
          </div>
          <h2 className="section-title">What Our Clients Say</h2>
          <p className="section-subtitle">
            Discover why thousands of brokers and clients trust My Delhi Agent for their real estate needs
          </p>
        </div>

        <div className="reviews-carousel">
          <button 
            className="carousel-btn prev-btn" 
            onClick={prevSlide}
            aria-label="Previous reviews"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <div className="reviews-container">
            <div className="reviews-grid">
              {visibleReviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">
                        <img src={review.avatar} alt={review.name} />
                        {review.verified && (
                          <div className="verified-badge">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="reviewer-details">
                        <h4 className="reviewer-name">{review.name}</h4>
                        <p className="reviewer-location">
                          <span className="location-icon">📍</span>
                          {review.location}
                        </p>
                      </div>
                    </div>
                    <div className="rating">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <div className="review-content">
                    <p className="review-comment">"{review.comment}"</p>
                  </div>
                  <div className="review-footer">
                    <div className="review-date">Verified Purchase</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            className="carousel-btn next-btn" 
            onClick={nextSlide}
            aria-label="Next reviews"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="carousel-indicators">
          {Array.from({ length: totalSlides }, (_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="reviews-stats">
          <div className="stats-item">
            <span className="stats-number">4.9</span>
            <span className="stats-label">Average Rating</span>
          </div>
          <div className="stats-item">
            <span className="stats-number">500+</span>
            <span className="stats-label">Happy Clients</span>
          </div>
          <div className="stats-item">
            <span className="stats-number">98%</span>
            <span className="stats-label">Satisfaction Rate</span>
          </div>
        </div>
      </div>
    </section>
  );
}