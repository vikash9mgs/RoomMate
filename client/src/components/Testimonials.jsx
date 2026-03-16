import React from 'react';
import './Testimonials.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTheme } from '../context/ThemeContext';
import { BsQuote, BsPatchCheckFill } from 'react-icons/bs';

const testimonials = [
  {
    name: 'Manish Sharma',
    location: 'Bangalore',
    rating: 4,
    review: 'I was able to rent my apartment in Whitefield, Bangalore with the help of the platform. Good work folks!',
  },
  {
    name: 'Akash Singh',
    location: 'Hyderabad',
    rating: 5,
    review: 'I was able to find a PG in HSR Layout with the help of FindMyRoom. Easy to find PG and Coliving spaces.',
  },
  {
    name: 'Rohit Yadav',
    location: 'Bangalore',
    rating: 5,
    review: 'Awesome place to find short-term and long-term rentals at a reasonable price. No brokerage. Great team!',
  },
  {
    name: 'Pooja Deshmukh',
    location: 'Mumbai',
    rating: 5,
    review: 'Very helpful community. Easy to find roommates on this platform. Highly recommended!',
  },
  {
    name: 'Raj Sekar',
    location: 'Pune',
    rating: 5,
    review: 'Very good response. Easy to find roommates or tenants. The interface is smooth and quick.',
  },
  {
    name: 'Sumeet Sahu',
    location: 'Delhi',
    rating: 5,
    review: 'Nice page and easy to find a flatmate. Saved me a lot of brokerage money.',
  },
  {
    name: 'Tanya Joshi',
    location: 'Pune',
    rating: 4,
    review: 'Good options for people who are looking for flats or roommates. User verification is a plus.',
  },
  {
    name: 'Vishakha Singh',
    location: 'Ahmedabad',
    rating: 4,
    review: 'Better way to find flat and flatmates compared to other social media groups.',
  }
];

const Testimonials = () => {
  const { theme } = useTheme();

  return (
    <div className={`testimonials-section py-5 ${theme === 'dark' ? 'bg-dark' : 'bg-light'}`}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="section-title display-5">User Testimonials</h2>
          <p className={`section-subtitle ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
            Join thousands of happy users who found their perfect home or roommate with us.
          </p>
        </div>

        <div className="infinite-scroll-wrapper">
          <div className="scroll-track">
            {/* Duplicate array for seamless infinite scroll */}
            {[...testimonials, ...testimonials, ...testimonials].map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="quote-icon">
                  <BsQuote />
                </div>

                <div className="user-info">
                  <div className="user-avatar text-uppercase">
                    {testimonial.name.charAt(0)}{testimonial.name.split(' ')[1] ? testimonial.name.split(' ')[1].charAt(0) : ''}
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0">
                      {testimonial.name}
                      <BsPatchCheckFill className="verified-badge" title="Verified User" />
                    </h6>
                    <small className={theme === 'dark' ? 'text-muted' : 'text-secondary'} style={{ fontSize: '0.8rem' }}>
                      {testimonial.location}
                    </small>
                  </div>
                </div>

                <div className="star-rating mb-3">
                  {Array.from({ length: 5 }, (_, i) => (
                    <i
                      key={i}
                      className={`fa-star fa ${i < testimonial.rating ? 'fas text-warning' : 'far text-muted'}`}
                    ></i>
                  ))}
                </div>

                <p className="card-text">
                  "{testimonial.review}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
