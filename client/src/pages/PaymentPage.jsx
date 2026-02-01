import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form, Spinner, Alert } from "react-bootstrap";
import NavbarComponent from "../components/NavbarComponent";
import Footer from "../components/Footer";
import { BsCheckCircle, BsShieldLock, BsPerson, BsCreditCard, BsCalendar, BsLock, BsWallet2, BsBank } from "react-icons/bs";
import { useTheme } from "../context/ThemeContext";
import "./PaymentPage.css";

const PaymentPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { bookingData, listing } = location.state || {};
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);


    const [paymentMethod, setPaymentMethod] = useState("card");

    // Form inputs state
    const [cardName, setCardName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [upiId, setUpiId] = useState("");

    useEffect(() => {
        if (!bookingData || !listing) {
            navigate("/all-listings");
        }
    }, [bookingData, listing, navigate]);

    // Validation Handlers
    const handleNameChange = (e) => {
        const value = e.target.value;
        // Allow alphabets and spaces only
        if (/^[a-zA-Z\s]*$/.test(value)) {
            setCardName(value);
        }
    };

    const handleCardNumberChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove non-digits

        // Add space every 4 digits for readability
        let formattedValue = '';
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }

        if (value.length <= 16) {
            setCardNumber(formattedValue);
        }
    };

    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-digits

        if (value.length > 4) return; // MMYY is max 4 digits

        if (value.length >= 2) {
            // Insert slash
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        setExpiryDate(value);
    };

    const handleCvvChange = (e) => {
        const value = e.target.value;
        // Allow numbers only, max 4 digits
        if (/^[0-9]*$/.test(value) && value.length <= 4) {
            setCvv(value);
        }
    };

    const handlePayment = async () => {
        setLoading(true);
        setError(null);

        // Basic validation before submit
        if (paymentMethod === "card") {
            if (!cardName || cardNumber.replace(/\s/g, '').length < 16 || expiryDate.length < 5 || cvv.length < 3) {
                setError("Please fill in all card details correctly.");
                setLoading(false);
                return;
            }
        } else {
            if (!upiId) {
                setError("Please enter a valid UPI ID.");
                setLoading(false);
                return;
            }
        }

        // Simulate payment processing delay
        setTimeout(async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:3000/api/listings/${id}/book`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ...bookingData,
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    setSuccess(true);
                    setTimeout(() => {
                        navigate("/profile");
                    }, 3000);
                } else {
                    setError(data.message || "Payment failed. Please try again.");
                }
            } catch (err) {
                setError("Failed to connect to server.");
            } finally {
                setLoading(false);
            }
        }, 2000);
    };

    if (!listing) return null;

    if (success) {
        return (
            <>
                <NavbarComponent />
                <Container className={`py-5 mt-5 text-center ${theme === 'dark' ? 'text-light' : ''}`} style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div className="mb-4 text-success animate__animated animate__bounceIn">
                        <BsCheckCircle size={80} />
                    </div>
                    <h2 className="fw-bold mb-3">Payment Successful!</h2>
                    <p className="lead text-muted mb-4">Your room has been successfully booked.</p>
                    <p>Redirecting you to your profile...</p>
                </Container>
                <Footer />
            </>
        );
    }

    return (
        <>
            <NavbarComponent />
            <div className={`payment-page-container pt-5 mt-5 ${theme === 'dark' ? 'dark-mode text-light' : ''}`}>
                <Container className="py-5">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold display-6">Secure Checkout</h2>
                        <p className="text-muted lead">Complete your booking securely</p>
                    </div>

                    <Row className="g-5">
                        {/* Left Column: Payment Details */}
                        <Col lg={7}>
                            <div className="glass-card p-4 p-md-5 mb-4">
                                <h4 className="fw-bold mb-4">Select Payment Method</h4>

                                <div className="row g-3 mb-5">
                                    <div className="col-md-6">
                                        <div
                                            className={`payment-method-card p-3 d-flex align-items-center ${paymentMethod === "card" ? "active" : ""}`}
                                            onClick={() => setPaymentMethod("card")}
                                        >
                                            <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                                                <BsCreditCard className="text-primary" size={24} />
                                            </div>
                                            <div>
                                                <h6 className="mb-0 fw-bold">Card</h6>
                                                <small className="text-muted">Credit / Debit</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div
                                            className={`payment-method-card p-3 d-flex align-items-center ${paymentMethod === "upi" ? "active" : ""}`}
                                            onClick={() => setPaymentMethod("upi")}
                                        >
                                            <div className="bg-success bg-opacity-10 p-2 rounded-circle me-3">
                                                <BsWallet2 className="text-success" size={24} />
                                            </div>
                                            <div>
                                                <h6 className="mb-0 fw-bold">UPI / Netbanking</h6>
                                                <small className="text-muted">GPay, PhonePe, etc.</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <h5 className="fw-bold mb-3">Payment Details</h5>
                                <Alert variant={theme === 'dark' ? "dark" : "light"} className="d-flex align-items-center border-0 bg-opacity-50 mb-4">
                                    <BsShieldLock className="text-success me-3" size={24} />
                                    <div>
                                        <small className="text-muted d-block">Bank Level Security</small>
                                        <strong>256-bit SSL Encrypted Payment</strong>
                                    </div>
                                </Alert>

                                <Form>
                                    {paymentMethod === "card" ? (
                                        <div className="animate__animated animate__fadeIn">
                                            <Form.Group className="mb-4" controlId="cardName">
                                                <Form.Label className="fw-medium">Name on Card</Form.Label>
                                                <div className="input-icon-wrapper">
                                                    <BsPerson className="input-icon" />
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="John Doe"
                                                        className="modern-input with-icon"
                                                        value={cardName}
                                                        onChange={handleNameChange}
                                                    />
                                                </div>
                                            </Form.Group>

                                            <Form.Group className="mb-4" controlId="cardNumber">
                                                <Form.Label className="fw-medium">Card Number</Form.Label>
                                                <div className="input-icon-wrapper">
                                                    <BsCreditCard className="input-icon" />
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="0000 0000 0000 0000"
                                                        className="modern-input with-icon"
                                                        value={cardNumber}
                                                        onChange={handleCardNumberChange}
                                                        maxLength="19"
                                                    />
                                                </div>
                                            </Form.Group>

                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-4" controlId="expiryDate">
                                                        <Form.Label className="fw-medium">Expiry Date</Form.Label>
                                                        <div className="input-icon-wrapper">
                                                            <BsCalendar className="input-icon" />
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="MM/YY"
                                                                className="modern-input with-icon"
                                                                value={expiryDate}
                                                                onChange={handleExpiryChange}
                                                                maxLength="5"
                                                            />
                                                        </div>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-4" controlId="cvv">
                                                        <Form.Label className="fw-medium">CVV</Form.Label>
                                                        <div className="input-icon-wrapper">
                                                            <BsLock className="input-icon" />
                                                            <Form.Control
                                                                type="password"
                                                                placeholder="123"
                                                                className="modern-input with-icon"
                                                                value={cvv}
                                                                onChange={handleCvvChange}
                                                                maxLength="4"
                                                            />
                                                        </div>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </div>
                                    ) : (
                                        <div className="animate__animated animate__fadeIn">
                                            <Form.Group className="mb-4" controlId="upiId">
                                                <Form.Label className="fw-medium">UPI ID</Form.Label>
                                                <div className="input-icon-wrapper">
                                                    <BsBank className="input-icon" />
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="username@upi"
                                                        className="modern-input with-icon"
                                                        value={upiId}
                                                        onChange={(e) => setUpiId(e.target.value)}
                                                    />
                                                </div>
                                                <Form.Text className="text-muted ms-2">
                                                    Enter your UPI ID (e.g., Google Pay, PhonePe, Paytm)
                                                </Form.Text>
                                            </Form.Group>
                                        </div>
                                    )}
                                </Form>
                            </div>
                        </Col>

                        {/* Right Column: Order Summary */}
                        <Col lg={5}>
                            <div className="glass-card p-4 sticky-top" style={{ top: "100px" }}>
                                <h5 className="fw-bold mb-4 border-bottom pb-3">Order Summary</h5>

                                <div className="d-flex align-items-center mb-4 p-3 rounded" style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
                                    <img
                                        src={listing.images[0] || "https://via.placeholder.com/150"}
                                        alt={listing.title}
                                        className="rounded me-3 shadow-sm"
                                        style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                    />
                                    <div>
                                        <h6 className="fw-bold mb-1">{listing.title}</h6>
                                        <div className="d-flex align-items-center">
                                            <BsCheckCircle className="text-success me-1" size={12} />
                                            <small className="text-success fw-bold">Verified Listing</small>
                                        </div>
                                        <small className="text-muted d-block mt-1">{listing.location}</small>
                                    </div>
                                </div>

                                <div className="summary-item d-flex justify-content-between">
                                    <span className="text-muted">Rent per month</span>
                                    <span className="fw-bold">₹{listing.price.toLocaleString()}</span>
                                </div>
                                <div className="summary-item d-flex justify-content-between">
                                    <span className="text-muted">Service Fee</span>
                                    <span className="fw-bold text-success">Free</span>
                                </div>
                                <div className="summary-item d-flex justify-content-between mb-3">
                                    <span className="text-muted">Booking Fee</span>
                                    <span className="fw-bold">₹0</span>
                                </div>

                                <div className="d-flex justify-content-between align-items-center p-3 rounded mb-4 mt-2" style={{ background: 'rgba(13, 110, 253, 0.1)' }}>
                                    <span className="h6 mb-0 fw-bold text-primary">Total Amount</span>
                                    <span className="h4 mb-0 fw-bold text-primary">₹{listing.price.toLocaleString()}</span>
                                </div>

                                {error && <Alert variant="danger" className="mb-3 rounded-3 border-0 shadow-sm">{error}</Alert>}

                                <Button
                                    className="w-100 py-3 pay-btn-gradient"
                                    size="lg"
                                    onClick={handlePayment}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner animation="border" size="sm" className="me-2" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Pay ₹{listing.price.toLocaleString()} <span className="ms-1 opacity-75">Securely</span>
                                        </>
                                    )}
                                </Button>

                                <div className="text-center mt-3">
                                    <small className="text-muted d-inline-flex align-items-center">
                                        <BsLock className="me-1" size={12} /> 100% Secure Payment
                                    </small>
                                </div>
                            </div>
                        </Col >
                    </Row >
                </Container >
            </div>
            <Footer />
        </>
    );
};

export default PaymentPage;
