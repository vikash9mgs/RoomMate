import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import NavbarComponent from "../components/NavbarComponent";
import Footer from "../components/Footer";
import ListingCard from "../components/ListingCard";
import ListingMap from "../components/ListingMap";
import { Spinner, Alert, Form, InputGroup, Button, Offcanvas, Badge } from "react-bootstrap";
import { BsSearch, BsFilter, BsSliders, BsCheckCircle, BsX } from "react-icons/bs";
import { useTheme } from "../context/ThemeContext";
import "./AllListingPage.css";

const AllListingsPage = () => {
  const { theme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const typeParam = searchParams.get("type");
  const locationParam = searchParams.get("location");

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Smart Filters State
  const [filters, setFilters] = useState({
    petFriendly: false,
    smoking: false,
    drinking: false,
    dietary: "Any",
    cleanliness: "Any",
  });

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/listings");
        const data = await response.json();
        if (response.ok) {
          setListings(data);
        } else {
          setError(data.message || "Failed to fetch listings");
        }
      } catch (err) {
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = !typeParam || listing.type === typeParam;

    const matchesLocation = !locationParam || listing.location.toLowerCase().includes(locationParam.toLowerCase());

    const matchesLifestyle =
      (!filters.petFriendly || listing.lifestyle?.petFriendly) &&
      (!filters.smoking || listing.lifestyle?.smoking) &&
      (!filters.drinking || listing.lifestyle?.drinking) &&
      (filters.dietary === "Any" || listing.lifestyle?.dietary === filters.dietary) &&
      (filters.cleanliness === "Any" || listing.lifestyle?.cleanliness === filters.cleanliness);

    return matchesSearch && matchesType && matchesLocation && matchesLifestyle;
  });

  const clearCategoryFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('type');
    setSearchParams(params);
  };

  const clearLocationFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('location');
    setSearchParams(params);
  };

  return (
    <>
      <NavbarComponent />

      <div className="container-fluid listing-page-container pt-5 mt-4">
        <div className="row h-100">
          {/* Left Column: Listings and Search */}
          <div className={`col-lg-7 col-md-12 listing-cards-column ${showMap ? 'd-none d-lg-block' : ''} p-4`}>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="fw-bold mb-1">Find Your <span className="text-gradient">Perfect Match</span></h2>
                <p className="text-muted small">AI-powered recommendations based on your lifestyle.</p>
              </div>
              <div className="d-flex gap-2">
                <Button
                  variant="outline-primary"
                  className="d-lg-none"
                  onClick={() => setShowMap(!showMap)}
                >
                  {showMap ? "Show List" : "Show Map"}
                </Button>
                <Button variant="outline-secondary" onClick={() => setShowFilters(true)}>
                  <BsSliders className="me-2" /> Smart Filters
                </Button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <InputGroup size="lg" className="glass-card border-0">
                <InputGroup.Text className="bg-transparent border-0 text-primary">
                  <BsSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search by location, title..."
                  className="bg-transparent border-0 shadow-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
            </div>

            {/* Active Category and Location Filter Badges */}
            {(typeParam || locationParam) && (
              <div className="mb-3 d-flex gap-2 flex-wrap">
                {typeParam && (
                  <Badge
                    bg="primary"
                    className="px-3 py-2 d-inline-flex align-items-center gap-2"
                    style={{ fontSize: '0.9rem' }}
                  >
                    <span>Category: {typeParam}</span>
                    <BsX
                      size={20}
                      style={{ cursor: 'pointer' }}
                      onClick={clearCategoryFilter}
                      title="Clear category filter"
                    />
                  </Badge>
                )}
                {locationParam && (
                  <Badge
                    bg="info"
                    className="px-3 py-2 d-inline-flex align-items-center gap-2"
                    style={{ fontSize: '0.9rem' }}
                  >
                    <span>Location: {locationParam}</span>
                    <BsX
                      size={20}
                      style={{ cursor: 'pointer' }}
                      onClick={clearLocationFilter}
                      title="Clear location filter"
                    />
                  </Badge>
                )}
              </div>
            )}

            <p className="text-muted mb-4">
              Showing <span className="text-primary fw-bold">{filteredListings.length}</span> matches
            </p>

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Analyzing compatibility...</p>
              </div>
            ) : error ? (
              <Alert variant="danger">{error}</Alert>
            ) : filteredListings.length === 0 ? (
              <div className="text-center py-5 glass-card">
                <h5>No matches found</h5>
                <p className="text-muted">Try adjusting your filters to see more results.</p>
                <Button variant="link" onClick={() => setFilters({
                  petFriendly: false,
                  smoking: false,
                  drinking: false,
                  dietary: "Any",
                  cleanliness: "Any",
                })}>Clear Filters</Button>
              </div>
            ) : (
              <div className="row g-4 pb-5">
                {filteredListings.map((listing) => (
                  <div className="col-md-12" key={listing._id}>
                    <ListingCard listing={listing} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Map */}
          <div className={`col-lg-5 map-column ${showMap ? 'd-block' : 'd-none d-lg-block'}`}>
            <div className="map-container h-100 position-sticky top-0" style={{ paddingTop: '80px' }}>
              {!loading && <ListingMap listings={filteredListings} />}
            </div>
          </div>
        </div>
      </div>

      {/* Smart Filters Offcanvas */}
      <Offcanvas
        show={showFilters}
        onHide={() => setShowFilters(false)}
        placement="end"
        className={`${theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark'} border-start border-secondary`}
      >
        <Offcanvas.Header closeButton closeVariant={theme === 'dark' ? 'white' : undefined}>
          <Offcanvas.Title className="fw-bold"><BsFilter className="me-2 text-primary" /> Smart Filters</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <h6 className="text-uppercase text-muted small fw-bold mb-3">Lifestyle Preferences</h6>

          <div className="d-grid gap-3">
            <Form.Check
              type="switch"
              id="pet-friendly"
              label="Pet Friendly"
              checked={filters.petFriendly}
              onChange={(e) => handleFilterChange("petFriendly", e.target.checked)}
              className="custom-switch"
            />
            <Form.Check
              type="switch"
              id="smoking"
              label="Smoking Allowed"
              checked={filters.smoking}
              onChange={(e) => handleFilterChange("smoking", e.target.checked)}
              className="custom-switch"
            />
            <Form.Check
              type="switch"
              id="drinking"
              label="Drinking Allowed"
              checked={filters.drinking}
              onChange={(e) => handleFilterChange("drinking", e.target.checked)}
              className="custom-switch"
            />

            <hr className="border-secondary my-2" />

            <Form.Group>
              <Form.Label className="small text-muted text-uppercase fw-bold">Dietary Preference</Form.Label>
              <Form.Select
                value={filters.dietary}
                onChange={(e) => handleFilterChange("dietary", e.target.value)}
                className={theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-light text-dark border-secondary'}
              >
                <option value="Any">Any</option>
                <option value="Veg">Vegetarian</option>
                <option value="Non-Veg">Non-Vegetarian</option>
                <option value="Vegan">Vegan</option>
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label className="small text-muted text-uppercase fw-bold">Cleanliness Level</Form.Label>
              <Form.Select
                value={filters.cleanliness}
                onChange={(e) => handleFilterChange("cleanliness", e.target.value)}
                className={theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-light text-dark border-secondary'}
              >
                <option value="Any">Any</option>
                <option value="Strict">Strict</option>
                <option value="Moderate">Moderate</option>
                <option value="Relaxed">Relaxed</option>
              </Form.Select>
            </Form.Group>
          </div>

          <div className="mt-5 p-3 glass-card rounded">
            <div className="d-flex align-items-center gap-2 mb-2">
              <BsCheckCircle className="text-success" />
              <small className="fw-bold">AI Recommendation</small>
            </div>
            <p className="small text-muted mb-0">
              Based on your filters, we'll prioritize listings with high compatibility scores.
            </p>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default AllListingsPage;