import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BsHeart, BsHeartFill, BsGeoAlt, BsLightningCharge, BsShieldCheck } from "react-icons/bs";

const ListingCard = ({ listing }) => {
  const navigate = useNavigate();

  // Mock Match Score for now (random between 70-99%)
  const matchScore = Math.floor(Math.random() * (99 - 70 + 1)) + 70;

  const handleCardClick = () => {
    navigate(`/listing/${listing._id}`);
  };

  const handleImageError = (e) => {
    e.target.src = "https://placehold.co/600x400?text=RoomMate";
    e.target.onerror = null; // Prevent infinite loop if fallback fails
  };

  return (
    <div className="glass-card h-100 position-relative overflow-hidden group" onClick={handleCardClick} style={{ cursor: 'pointer', transition: 'transform 0.3s ease' }}>
      {/* Match Score Badge */}
      <div className="position-absolute top-0 start-0 m-3 z-2">
        <div className="badge-neon rounded-pill px-3 py-2 d-flex align-items-center gap-2 backdrop-blur-md">
          <BsLightningCharge className="text-primary" />
          <span className="fw-bold">{matchScore}% Match</span>
        </div>
      </div>

      {listing.isPremium && (
        <span className="position-absolute top-0 end-0 m-3 badge bg-gradient-primary border border-white border-opacity-25 shadow-lg z-2">
          Premium
        </span>
      )}

      {listing.status === "Booked" && (
        <span className="position-absolute top-0 end-0 m-3 badge bg-danger border border-white border-opacity-25 shadow-lg z-2">
          Booked
        </span>
      )}

      {/* Image Container */}
      <div className="position-relative" style={{ height: '240px' }}>
        <img
          src={listing.images && listing.images.length > 0 ? listing.images[0] : (listing.image || "https://placehold.co/600x400?text=No+Image")}
          className="w-100 h-100"
          style={{ objectFit: 'cover' }}
          alt={listing.title}
          loading="lazy"
          onError={handleImageError}
        />
        <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-gradient-to-t from-black/80 to-transparent">
          <h5 className="text-white mb-1 text-truncate fw-bold">{listing.title}</h5>
          <div className="d-flex align-items-center text-white-50 small">
            <BsGeoAlt className="me-1" /> {listing.location}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3">
        <div className="d-flex justify-content-between align-items-end mb-3">
          <div>
            <small className="text-primary text-uppercase fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
              {listing.type}
            </small>
            <div className="d-flex align-items-baseline gap-1">
              <h4 className="mb-0 fw-bold">₹{listing.price.toLocaleString()}</h4>
              <small className="text-muted">/mo</small>
            </div>
          </div>
        </div>

        {/* Amenities Tags */}
        <div className="d-flex flex-wrap gap-2 mb-3">
          {listing.amenities.slice(0, 3).map((amenity, idx) => (
            <span key={idx} className="badge bg-secondary bg-opacity-10 text-body fw-normal border border-secondary border-opacity-25">
              {amenity}
            </span>
          ))}
          {listing.amenities.length > 3 && (
            <span className="badge bg-secondary bg-opacity-10 text-body fw-normal border border-secondary border-opacity-25">
              +{listing.amenities.length - 3}
            </span>
          )}
        </div>

        {/* AI Insight */}
        <div className="d-flex align-items-center gap-2 pt-3 border-top border-secondary border-opacity-10">
          <BsShieldCheck className="text-success" />
          <small className="text-success fw-medium">Verified Owner</small>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;