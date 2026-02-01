import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Footer.css";
import { useTheme } from "../context/ThemeContext";

const listings = [
  {
    title: "Roommate",
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600",
  },
  {
    title: "Coliving",
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600",
  },
  {
    title: "PG",
    img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=600",
  },
  {
    title: "Flatmate",
    img: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=600",
  },
  {
    title: "Room",
    img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600",
  },
  {
    title: "Entire House",
    img: "https://houzone.com/wp-content/uploads/2023/10/2-bedroom-small-house-design-as-per-vastu-customized-house-design-order-online-indiahousedesign-houzone.jpg",
  },
];

const Listings = () => {
  const { theme } = useTheme();

  return (
    <section className={`listings-section py-5 ${theme === 'dark' ? 'bg-dark' : 'bg-white'}`}>
      <div className="container">
        <div className="row align-items-center">
          {/* LEFT TEXT SECTION */}
          <div className="col-lg-4 mb-5 mb-lg-0 text-center text-lg-start">
            <h5 className="text-secondary fw-semibold mb-2">
              Explore The Latest
            </h5>
            <h2 className={`fw-bold display-6 mb-3 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>
              Room<span className="text-primary">Mate</span> <br />
              Listings
            </h2>
            <p className={`small ${theme === 'dark' ? 'text-light opacity-75' : 'text-muted'}`}>
              Discover verified roommates, coliving spaces, and properties
              curated just for you.
            </p>
          </div>

          {/* RIGHT GRID SECTION */}
          <div className="col-lg-8">
            <div className="row g-4">
              {listings.map((item, index) => (
                <div key={index} className="col-6 col-md-4">
                  <Link
                    to={`/all-listings?type=${encodeURIComponent(item.title)}&location=Lucknow`}
                    className="text-decoration-none"
                  >
                    <div className="listing-card rounded-4 overflow-hidden shadow-sm" style={{ cursor: 'pointer', transition: 'transform 0.3s ease' }}>
                      <img
                        src={item.img}
                        alt={item.title}
                        className="img-fluid w-100 listing-img"
                      />
                      <div className="listing-overlay d-flex align-items-end">
                        <h5 className="text-white fw-semibold px-3 pb-3 mb-0">
                          {item.title}
                        </h5>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Listings;
