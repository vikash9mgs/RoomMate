import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BsSearch } from "react-icons/bs";
import "./HeroSection.css";

const HERO_IMAGE_URL =
  "https://plus.unsplash.com/premium_photo-1676823547752-1d24e8597047?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bGl2aW5nJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate();

  // Fetch suggestions from OpenStreetMap
  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${value}&addressdetails=1&limit=5&countrycodes=in`
      );
      setSuggestions(res.data);
    } catch (err) {
      console.error("Error fetching locations:", err);
    }
  };

  // Handle selecting a location
  const handleSelect = (place) => {
    const locationName = place.display_name.split(',')[0].trim();
    setQuery(locationName);
    setSuggestions([]);
    navigate(`/all-listings?location=${locationName}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query) {
      navigate(`/all-listings?location=${query}`);
    }
  };

  return (
    <div
      className="hero-section text-white"
      style={{ backgroundImage: `url('${HERO_IMAGE_URL}')` }}
    >
      <div className="hero-overlay"></div>

      <Container className="hero-content">
        <Row className="justify-content-center">
          <Col lg={8} md={10}>
            <h1 className="hero-title">
              Find Your Perfect <br />
              <span className="text-primary">RoomMate</span> Today
            </h1>
            <p className="hero-subtitle">
              Join 10,000+ happy users finding rooms and roommates across India.
              Simple, safe, and social.
            </p>

            <div className="position-relative">
              <div className="search-container d-flex align-items-center">
                <BsSearch className="ms-3 text-white opacity-75" size={20} />
                <input
                  type="text"
                  placeholder="Search by Locality (e.g., Koramangala, Bandra)"
                  value={query}
                  onChange={handleSearch}
                  onKeyDown={handleKeyDown}
                  className="hero-search-input form-control shadow-none"
                />
              </div>

              {/* Dropdown suggestions */}
              {suggestions.length > 0 && (
                <div className="search-suggestions">
                  {suggestions.map((place) => (
                    <div
                      key={place.place_id}
                      className="suggestion-item"
                      onClick={() => handleSelect(place)}
                    >
                      <div className="fw-bold">{place.display_name.split(',')[0]}</div>
                      <small className="text-muted">{place.display_name}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HeroSection;
