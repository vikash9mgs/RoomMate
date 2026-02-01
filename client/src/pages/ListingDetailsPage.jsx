import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Modal, Carousel, Form, Toast, ToastContainer } from "react-bootstrap";
import NavbarComponent from "../components/NavbarComponent";
import Footer from "../components/Footer";
import { BsGeoAlt, BsTelephone, BsArrowLeft, BsCheckCircle, BsTrash, BsPencil, BsHeart, BsHeartFill, BsShare } from "react-icons/bs";
import LocalityDashboard from "../components/LocalityDashboard";
import RentPredictor from "../components/RentPredictor";
import AIChatbot from "../components/AIChatbot";

const ListingDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingData, setBookingData] = useState({
        fullName: "",
        email: "",
        phone: "",
        aadharNumber: "",
        aadharPhoto: null,
        userImage: null,
        gender: "",
        dob: "",
        permanentAddress: "",
        moveInDate: "",
        duration: "",
        guests: 1,
    });
    const [showTourModal, setShowTourModal] = useState(false);
    const [tourData, setTourData] = useState({
        fullName: "",
        phone: "",
        tourDate: "",
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [tourValidationErrors, setTourValidationErrors] = useState({});
    const [isFavorite, setIsFavorite] = useState(false);
    const [favLoading, setFavLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success");

    const validateForm = () => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;
        const aadharRegex = /^\d{12}$/;

        if (!emailRegex.test(bookingData.email)) {
            errors.email = "Please enter a valid email address.";
        }
        if (!phoneRegex.test(bookingData.phone)) {
            errors.phone = "Phone number must be exactly 10 digits.";
        }
        if (!aadharRegex.test(bookingData.aadharNumber)) {
            errors.aadharNumber = "Aadhar number must be exactly 12 digits.";
        }
        if (!bookingData.moveInDate) {
            errors.moveInDate = "Please select a move-in date.";
        }
        if (!bookingData.duration || bookingData.duration < 1) {
            errors.duration = "Please enter a valid duration (at least 1 month).";
        }
        if (!bookingData.guests || bookingData.guests < 1) {
            errors.guests = "Please enter at least 1 guest.";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleBookingChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "aadharPhoto" || name === "userImage") {
            setBookingData({ ...bookingData, [name]: files[0] });
        } else {
            let newValue = value;
            // Restrict input length and type for phone and aadhar
            if (name === "phone") {
                newValue = value.replace(/\D/g, '').slice(0, 10);
            } else if (name === "aadharNumber") {
                newValue = value.replace(/\D/g, '').slice(0, 12);
            }

            setBookingData({ ...bookingData, [name]: newValue });

            // Clear error when user types
            if (validationErrors[name]) {
                setValidationErrors({ ...validationErrors, [name]: null });
            }
        }
    };

    const handleBookingSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setShowBookingModal(false);
        navigate(`/payment/${id}`, { state: { bookingData, listing } });
    };
    const validateTourForm = () => {
        const errors = {};
        const phoneRegex = /^\d{10}$/;

        if (!phoneRegex.test(tourData.phone)) {
            errors.phone = "Phone number must be exactly 10 digits.";
        }
        if (!tourData.fullName.trim()) {
            errors.fullName = "Full Name is required.";
        }
        if (!tourData.tourDate) {
            errors.tourDate = "Please select a preferred tour date.";
        }

        setTourValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleTourChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === "phone") {
            newValue = value.replace(/\D/g, '').slice(0, 10);
        }

        setTourData({ ...tourData, [name]: newValue });

        if (tourValidationErrors[name]) {
            setTourValidationErrors({ ...tourValidationErrors, [name]: null });
        }
    };

    const handleTourSubmit = async (e) => {
        e.preventDefault();
        if (!validateTourForm()) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/listings/${id}/tour`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(tourData),
            });

            const data = await response.json();

            if (response.ok) {
                setToastMessage("Tour request sent successfully!");
                setToastVariant("success");
                setShowToast(true);
                setShowTourModal(false);
                setTourData({ fullName: "", phone: "", tourDate: "" });
            } else {
                setToastMessage(data.message || "Failed to send tour request");
                setToastVariant("danger");
                setShowToast(true);
            }
        } catch (error) {
            console.error("Error scheduling tour:", error);
            setToastMessage("Failed to connect to server");
            setToastVariant("danger");
            setShowToast(true);
        }
    };

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            const user = JSON.parse(userInfo);
            setCurrentUser(user);
            if (user.favorites && user.favorites.some(fav => fav && (fav._id === id || fav === id))) {
                setIsFavorite(true);
            }
        }

        const fetchListing = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/listings/${id}`);
                const data = await response.json();
                if (response.ok) {
                    setListing(data);
                } else {
                    setError(data.message || "Failed to fetch listing details");
                }
            } catch (err) {
                setError("Failed to connect to server");
            } finally {
                setLoading(false);
            }
        };

        fetchListing();
    }, [id]);

    const handleDelete = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:3000/api/listings/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                navigate("/all-listings");
            } else {
                const data = await response.json();
                alert(data.message || "Failed to delete listing");
            }
        } catch (err) {
            alert("Failed to connect to server");
        }
    };

    const handleEdit = () => {
        navigate(`/postlisting`, { state: { listing } });
    };

    const handleFavorite = async () => {
        if (!currentUser) {
            setToastMessage("Please login to add favorites");
            setToastVariant("warning");
            setShowToast(true);
            return;
        }
        setFavLoading(true);
        const token = localStorage.getItem("token");
        const method = isFavorite ? "DELETE" : "PUT";

        try {
            const response = await fetch(`http://localhost:3000/api/auth/favorites/${id}`, {
                method: method,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const updatedFavorites = await response.json();
                setIsFavorite(!isFavorite);

                // Update local storage
                const updatedUser = { ...currentUser, favorites: updatedFavorites };
                localStorage.setItem("userInfo", JSON.stringify(updatedUser));
                setCurrentUser(updatedUser);

                setToastMessage(isFavorite ? "Removed from favorites" : "Added to favorites");
                setToastVariant("success");
                setShowToast(true);
            } else {
                setToastMessage("Failed to update favorites");
                setToastVariant("danger");
                setShowToast(true);
            }
        } catch (error) {
            console.error(error);
            setToastMessage("Error updating favorites");
            setToastVariant("danger");
            setShowToast(true);
        } finally {
            setFavLoading(false);
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                setToastMessage("Link copied to clipboard!");
                setToastVariant("success");
                setShowToast(true);
            })
            .catch(() => {
                setToastMessage("Failed to copy link");
                setToastVariant("danger");
                setShowToast(true);
            });
    };

    if (loading) {
        return (
            <>
                <NavbarComponent />
                <Container className="py-5 mt-5 text-center">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2 text-muted">Loading details...</p>
                </Container>
                <Footer />
            </>
        );
    }

    if (error || !listing) {
        return (
            <>
                <NavbarComponent />
                <Container className="py-5 mt-5">
                    <Alert variant="danger">{error || "Listing not found"}</Alert>
                    <Button variant="outline-primary" onClick={() => navigate("/all-listings")}>
                        <BsArrowLeft className="me-2" /> Back to Listings
                    </Button>
                </Container>
                <Footer />
            </>
        );
    }

    const isOwnerOrAdmin = currentUser && (currentUser._id === listing.user?._id || currentUser.isAdmin);

    return (
        <>
            <NavbarComponent />
            <Container className="py-5 mt-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Button variant="link" className="text-white p-0 text-decoration-none" onClick={() => navigate("/all-listings")}>
                        <BsArrowLeft className="me-2" /> Back to Listings
                    </Button>

                    {isOwnerOrAdmin && (
                        <div>
                            <Button variant="outline-primary" className="me-2" onClick={handleEdit}>
                                <BsPencil className="me-2" /> Edit
                            </Button>
                            <Button variant="outline-danger" onClick={() => setShowDeleteModal(true)}>
                                <BsTrash className="me-2" /> Delete
                            </Button>
                        </div>
                    )}
                </div>

                <Row>
                    {/* Left Column: Images and Details */}
                    <Col lg={8}>
                        {/* Main Image */}
                        <div className="mb-4 rounded-4 overflow-hidden shadow-neon" style={{ height: "450px" }}>
                            {listing.images && listing.images.length > 0 ? (
                                <Carousel>
                                    {listing.images.map((img, index) => (
                                        <Carousel.Item key={index} style={{ height: "450px" }}>
                                            <img
                                                className="d-block w-100 h-100 object-fit-cover"
                                                src={img}
                                                alt={`Slide ${index}`}
                                                onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/800x400?text=No+Image"; }}
                                            />
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                            ) : (
                                <img
                                    src="https://via.placeholder.com/800x400?text=No+Image"
                                    alt={listing.title}
                                    className="w-100 h-100 object-fit-cover"
                                />
                            )}
                        </div>

                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <h1 className="fw-bold mb-2 display-5">{listing.title}</h1>
                                <div className="d-flex align-items-center text-primary mb-4">
                                    <BsGeoAlt className="me-2" /> {listing.location}
                                </div>
                            </div>
                            <div className="badge-neon rounded-pill px-3 py-2">
                                <span className="fw-bold text-primary">92% Match</span>
                            </div>
                        </div>

                        {/* Compatibility Analysis Widget */}
                        <Card className="glass-card border-0 mb-4">
                            <Card.Body className="p-4">
                                <h5 className="fw-bold mb-3"><BsCheckCircle className="me-2 text-primary" /> Compatibility Analysis</h5>
                                <Row className="g-3">
                                    <Col md={6}>
                                        <div className="p-3 rounded bg-white bg-opacity-10">
                                            <small className="text-muted text-uppercase fw-bold">Lifestyle Match</small>
                                            <div className="d-flex align-items-center mt-2">
                                                <div className="progress flex-grow-1" style={{ height: '6px' }}>
                                                    <div className="progress-bar bg-success" role="progressbar" style={{ width: '90%' }}></div>
                                                </div>
                                                <span className="ms-2 text-success fw-bold">90%</span>
                                            </div>
                                            <p className="small text-muted mt-2 mb-0">Great match! You both prefer a quiet environment.</p>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="p-3 rounded bg-white bg-opacity-10">
                                            <small className="text-muted text-uppercase fw-bold">Budget Fit</small>
                                            <div className="d-flex align-items-center mt-2">
                                                <div className="progress flex-grow-1" style={{ height: '6px' }}>
                                                    <div className="progress-bar bg-primary" role="progressbar" style={{ width: '85%' }}></div>
                                                </div>
                                                <span className="ms-2 text-primary fw-bold">85%</span>
                                            </div>
                                            <p className="small text-muted mt-2 mb-0">Within your preferred price range.</p>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        <Card className="glass-card border-0 mb-4">
                            <Card.Body className="p-4">
                                <h5 className="fw-bold mb-3">Description</h5>
                                <p className="text-muted" style={{ whiteSpace: "pre-line", lineHeight: '1.8' }}>
                                    {listing.description}
                                </p>
                                {isOwnerOrAdmin && listing.aadhar && (
                                    <div className="mt-3 pt-3 border-top border-white border-opacity-10">
                                        <h6 className="fw-bold">Aadhar Number (Private)</h6>
                                        <p className="text-muted mb-0">{listing.aadhar}</p>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>

                        <Card className="glass-card border-0 mb-4">
                            <Card.Body className="p-4">
                                <h5 className="fw-bold mb-3">Amenities</h5>
                                <div className="d-flex flex-wrap gap-2">
                                    {listing.amenities.map((amenity, index) => (
                                        <Badge key={index} bg="dark" text="light" className="p-2 border border-secondary fw-normal">
                                            <BsCheckCircle className="me-1 text-primary" /> {amenity}
                                        </Badge>
                                    ))}
                                    {listing.amenities.length === 0 && <span className="text-muted">No amenities listed</span>}
                                </div>
                            </Card.Body>
                        </Card>

                        {/* Phase 2: Intelligence Dashboards */}
                        <RentPredictor currentRent={listing.price} location={listing.location} />
                        <LocalityDashboard location={listing.location} />
                    </Col>

                    {/* Right Column: Price and Contact */}
                    <Col lg={4}>
                        <Card className="glass-card border-0 sticky-top" style={{ top: "100px" }}>
                            <Card.Body className="p-4">
                                <div className="mb-4">
                                    <h6 className="text-muted text-uppercase small fw-bold">Rent per month</h6>
                                    <h2 className="fw-bold display-6">₹{listing.price.toLocaleString()}</h2>
                                </div>

                                <div className="mb-4">
                                    <h6 className="text-muted text-uppercase small fw-bold">Room Type</h6>
                                    <p className="fs-5">{listing.type}</p>
                                </div>

                                {!isOwnerOrAdmin && (
                                    <div className="d-grid gap-3">
                                        <Button variant="primary" size="lg" className="fw-bold py-3" onClick={() => setShowBookingModal(true)}>
                                            Book Now
                                        </Button>
                                        <Button variant="outline-primary" size="lg" onClick={() => setShowTourModal(true)}>
                                            Schedule Tour
                                        </Button>
                                        <div className="d-flex gap-2">
                                            <Button
                                                variant={isFavorite ? "danger" : "outline-secondary"}
                                                size="lg"
                                                className="flex-grow-1 d-flex align-items-center justify-content-center"
                                                onClick={handleFavorite}
                                                disabled={favLoading}
                                            >
                                                {isFavorite ? <BsHeartFill className="me-2" /> : <BsHeart className="me-2" />}
                                                {isFavorite ? "Saved" : "Save"}
                                            </Button>
                                            <Button
                                                variant="outline-secondary"
                                                size="lg"
                                                className="flex-grow-1 d-flex align-items-center justify-content-center"
                                                onClick={handleShare}
                                            >
                                                <BsShare className="me-2" /> Share
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                {isOwnerOrAdmin && (
                                    <div className="d-grid gap-3">
                                        <Button
                                            variant="outline-secondary"
                                            size="lg"
                                            className="w-100 d-flex align-items-center justify-content-center"
                                            onClick={handleShare}
                                        >
                                            <BsShare className="me-2" /> Share Listing
                                        </Button>
                                    </div>
                                )}

                                <hr className="my-4 border-white border-opacity-10" />

                                <div className="d-flex align-items-center">
                                    <div
                                        className="rounded-circle bg-gradient-primary d-flex align-items-center justify-content-center text-white fw-bold me-3 overflow-hidden shadow-sm"
                                        style={{ width: "50px", height: "50px" }}
                                    >
                                        {listing.user?.profilePicture ? (
                                            <img
                                                src={
                                                    listing.user.profilePicture.startsWith("http")
                                                        ? listing.user.profilePicture
                                                        : `http://localhost:3000${listing.user.profilePicture}`
                                                }
                                                alt={listing.user.name}
                                                className="w-100 h-100 object-fit-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(listing.user.name)}&background=random`;
                                                }}
                                            />
                                        ) : (
                                            listing.user?.name?.charAt(0) || "U"
                                        )}
                                    </div>
                                    <div>
                                        <div className="fw-bold">{listing.user?.name || "RoomMate User"}</div>
                                        <small className="text-primary">Verified Owner</small>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* AI Chatbot Overlay */}
            <AIChatbot listing={listing} />

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this listing? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete Listing
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Booking Request Modal */}
            <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Book Now</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-muted mb-4">Please fill in your details to request a booking for this room.</p>
                    <Form onSubmit={handleBookingSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="moveInDate">
                                    <Form.Label>Move-in Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="moveInDate"
                                        value={bookingData.moveInDate}
                                        onChange={handleBookingChange}
                                        isInvalid={!!validationErrors.moveInDate}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {validationErrors.moveInDate}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3" controlId="duration">
                                    <Form.Label>Duration (Months)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        name="duration"
                                        value={bookingData.duration}
                                        onChange={handleBookingChange}
                                        isInvalid={!!validationErrors.duration}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {validationErrors.duration}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3" controlId="guests">
                                    <Form.Label>Guests</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        name="guests"
                                        value={bookingData.guests}
                                        onChange={handleBookingChange}
                                        isInvalid={!!validationErrors.guests}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {validationErrors.guests}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3" controlId="fullName">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your full name"
                                name="fullName"
                                value={bookingData.fullName}
                                onChange={handleBookingChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="your.email@example.com"
                                name="email"
                                value={bookingData.email}
                                onChange={handleBookingChange}
                                isInvalid={!!validationErrors.email}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.email}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="phone">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="Enter your phone number"
                                name="phone"
                                value={bookingData.phone}
                                onChange={handleBookingChange}
                                isInvalid={!!validationErrors.phone}
                                required
                                maxLength={10}
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.phone}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="aadharNumber">
                            <Form.Label>Aadhar Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter 12-digit Aadhar number"
                                name="aadharNumber"
                                value={bookingData.aadharNumber}
                                onChange={handleBookingChange}
                                isInvalid={!!validationErrors.aadharNumber}
                                required
                                maxLength={12}
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.aadharNumber}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="aadharPhoto">
                            <Form.Label>Aadhar Photo</Form.Label>
                            <Form.Control
                                type="file"
                                name="aadharPhoto"
                                onChange={handleBookingChange}
                                accept="image/*"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="userImage">
                            <Form.Label>User Image</Form.Label>
                            <Form.Control
                                type="file"
                                name="userImage"
                                onChange={handleBookingChange}
                                accept="image/*"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="gender">
                            <Form.Label>Gender</Form.Label>
                            <Form.Select
                                name="gender"
                                value={bookingData.gender}
                                onChange={handleBookingChange}
                                required
                            >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="dob">
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control
                                type="date"
                                name="dob"
                                value={bookingData.dob}
                                onChange={handleBookingChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="permanentAddress">
                            <Form.Label>Permanent Address</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter your permanent address"
                                name="permanentAddress"
                                value={bookingData.permanentAddress}
                                onChange={handleBookingChange}
                                required
                            />
                        </Form.Group>

                        <div className="d-grid gap-2 mt-4">
                            <Button variant="primary" type="submit" size="lg">
                                Next
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Schedule Tour Modal */}
            <Modal show={showTourModal} onHide={() => setShowTourModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Schedule a Tour</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-muted mb-4">Fill in your details to schedule a tour of this room</p>
                    <Form onSubmit={handleTourSubmit}>
                        <Form.Group className="mb-3" controlId="tourFullName">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your full name"
                                name="fullName"
                                value={tourData.fullName}
                                onChange={handleTourChange}
                                isInvalid={!!tourValidationErrors.fullName}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {tourValidationErrors.fullName}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="tourPhone">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="Enter your phone number"
                                name="phone"
                                value={tourData.phone}
                                onChange={handleTourChange}
                                isInvalid={!!tourValidationErrors.phone}
                                required
                                maxLength={10}
                            />
                            <Form.Control.Feedback type="invalid">
                                {tourValidationErrors.phone}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="tourDate">
                            <Form.Label>Preferred Tour Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="tourDate"
                                value={tourData.tourDate}
                                onChange={handleTourChange}
                                isInvalid={!!tourValidationErrors.tourDate}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {tourValidationErrors.tourDate}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <div className="d-grid gap-2 mt-4">
                            <Button variant="primary" type="submit" size="lg" style={{ backgroundColor: '#008080', borderColor: '#008080' }}>
                                Schedule Tour
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1050 }}>
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide bg={toastVariant}>
                    <Toast.Header>
                        <strong className="me-auto">Notification</strong>
                    </Toast.Header>
                    <Toast.Body className={toastVariant === 'light' ? 'text-dark' : 'text-white'}>
                        {toastMessage}
                    </Toast.Body>
                </Toast>
            </ToastContainer>

            <Footer />
        </>
    );
};

export default ListingDetailsPage;
