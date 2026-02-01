import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { BsPeople, BsHouseDoor, BsGeoAlt, BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";
import NavbarComponent from "../components/NavbarComponent";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";


const AboutUs = () => {
    const { theme } = useTheme();

    const styles = {
        container: {
            background: theme === 'dark'
                ? '#000000'
                : '#f8f9fa',
            backgroundImage: theme === 'dark'
                ? `radial-gradient(circle at top left, rgba(62, 166, 255, 0.15), transparent 50%),
                   radial-gradient(circle at bottom right, rgba(255, 107, 107, 0.15), transparent 50%)`
                : `radial-gradient(circle at top left, rgba(62, 166, 255, 0.1), transparent 40%),
                   radial-gradient(circle at bottom right, rgba(255, 107, 107, 0.1), transparent 40%)`,
            minHeight: '100vh',
            color: theme === 'dark' ? '#ffffff' : '#212529',
            transition: 'all 0.3s ease'
        },
        hero: {
            position: 'relative',
            height: '60vh',
            minHeight: '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: 'white',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            marginTop: '76px',
            backgroundImage: 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2070")'
        },
        heroOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: theme === 'dark'
                ? 'linear-gradient(to bottom, rgba(0, 0, 0, 0.3), #000000)'
                : 'linear-gradient(to bottom, rgba(0, 0, 0, 0.2), #f8f9fa)'
        },
        heroTitle: {
            fontSize: '3.5rem',
            fontWeight: '800',
            marginBottom: '1.5rem',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
            background: '-webkit-linear-gradient(45deg, #ffffff, #cce5ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
        },
        glassCard: {
            borderRadius: '20px',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            height: '100%',
            padding: '2rem',
            textAlign: 'center',
            background: theme === 'dark' ? 'rgba(30, 30, 30, 0.85)' : 'rgba(255, 255, 255, 0.85)',
            border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(255, 255, 255, 0.6)',
            boxShadow: theme === 'dark' ? '0 10px 30px rgba(0, 0, 0, 0.6)' : '0 10px 30px rgba(31, 38, 135, 0.1)',
            color: theme === 'dark' ? '#ffffff' : 'inherit'
        },
        valueIcon: {
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            background: theme === 'dark'
                ? 'linear-gradient(135deg, rgba(13, 110, 253, 0.2), rgba(13, 202, 240, 0.2))'
                : 'linear-gradient(135deg, rgba(13, 110, 253, 0.1), rgba(13, 202, 240, 0.1))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            color: '#0d6efd',
            fontSize: '1.8rem',
            boxShadow: theme === 'dark' ? '0 0 20px rgba(13, 110, 253, 0.2)' : '0 10px 20px rgba(13, 110, 253, 0.1)'
        },
        cta: {
            background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)',
            borderRadius: '30px',
            padding: '5rem 2rem',
            color: 'white',
            boxShadow: '0 20px 60px rgba(13, 110, 253, 0.3)'
        },
        statNumber: {
            fontSize: '2.5rem',
            fontWeight: '800',
            color: '#0d6efd',
            marginBottom: '0.25rem'
        }
    };

    return (
        <>
            <NavbarComponent />

            <div style={styles.container}>

                {/* Hero Section */}
                <div style={styles.hero}>
                    <div style={styles.heroOverlay}></div>
                    <div className="position-relative z-2 px-3" style={{ maxWidth: '800px' }}>
                        <h1 style={styles.heroTitle}>We Connect People & Homes</h1>
                        <p className="mb-5 opacity-90 fs-5 text-shadow">Making room hunting simple, safe, and social. Join the community that cares.</p>
                        <Button variant="primary" size="lg" className="rounded-pill px-4 py-2 fw-bold" as={Link} to="/all-listings">
                            Explore Listings <BsArrowRight className="ms-2" />
                        </Button>
                    </div>
                </div>

                {/* Mission Section */}
                <Container className="py-5 my-5">
                    <Row className="align-items-center">
                        <Col lg={6} className="mb-5 mb-lg-0">
                            <img
                                src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=2070"
                                alt="Friends in apartment"
                                className="img-fluid rounded-4 shadow-lg border border-3 border-light opacity-85"
                            />
                        </Col>
                        <Col lg={6} className="ps-lg-5">
                            <h6 className="text-primary text-uppercase fw-bold mb-3">Our Mission</h6>
                            <h2 className="display-5 fw-bold mb-4">
                                Finding the perfect roommate shouldn't be hard.
                            </h2>
                            <p className="fs-5 mb-4 opacity-75">
                                At RoomMate, we believe that who you live with is just as important as where you live.
                                Our platform is designed to help you find not just a room, but a home and a community.
                            </p>
                            <p className="mb-5 opacity-75">
                                We verify every listing and user to ensure a safe and trusted environment.
                                Whether you're a student, a young professional, or new to the city, we're here to make your transition smooth.
                            </p>

                            <div className="d-flex gap-4 flex-wrap">
                                <div className="text-center p-3">
                                    <h3 style={styles.statNumber}>50k+</h3>
                                    <p className="text-uppercase small letter-spacing-1 opacity-75">Happy Users</p>
                                </div>
                                <div className="text-center p-3">
                                    <h3 style={styles.statNumber}>12k+</h3>
                                    <p className="text-uppercase small letter-spacing-1 opacity-75">Listings</p>
                                </div>
                                <div className="text-center p-3">
                                    <h3 style={styles.statNumber}>100+</h3>
                                    <p className="text-uppercase small letter-spacing-1 opacity-75">Cities</p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>

                {/* Values Section */}
                <Container className="py-5">
                    <div className="text-center mb-5">
                        <h6 className="text-primary text-uppercase fw-bold">Why Choose Us</h6>
                        <h2 className="fw-bold display-6">
                            Redefining the Rental Experience
                        </h2>
                    </div>
                    <Row className="g-4">
                        <Col md={4}>
                            <div style={styles.glassCard} className="glass-hover-effect">
                                <div style={styles.valueIcon}>
                                    <BsPeople />
                                </div>
                                <h3 className="fw-bold mb-3 h4">Community First</h3>
                                <p className="opacity-75">
                                    We focus on compatibility and shared interests to help you find roommates you'll actually get along with.
                                </p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div style={styles.glassCard} className="glass-hover-effect">
                                <div style={styles.valueIcon}>
                                    <BsHouseDoor />
                                </div>
                                <h3 className="fw-bold mb-3 h4">Verified Listings</h3>
                                <p className="opacity-75">
                                    Every listing is manually reviewed to prevent scams and ensure you get exactly what you see.
                                </p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div style={styles.glassCard} className="glass-hover-effect">
                                <div style={styles.valueIcon}>
                                    <BsGeoAlt />
                                </div>
                                <h3 className="fw-bold mb-3 h4">Prime Locations</h3>
                                <p className="opacity-75">
                                    Find homes in the most desirable neighborhoods, close to work, universities, and nightlife.
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Container>

                {/* CTA Section */}
                <Container className="py-5 my-5 text-center">
                    <div style={styles.cta} className="position-relative overflow-hidden">
                        <div className="position-relative z-1">
                            <h2 className="fw-bold mb-3 display-5">Ready to find your new home?</h2>
                            <p className="fs-5 mb-4 opacity-90">Join thousands of others who have found their perfect match on RoomMate.</p>
                            <Button variant="light" size="lg" className="fw-bold text-primary rounded-pill px-5 py-3 shadow" as={Link} to="/postlisting">
                                Post a Listing
                            </Button>
                        </div>
                    </div>
                </Container>

            </div>

            <Footer />
        </>
    );
};

export default AboutUs;
