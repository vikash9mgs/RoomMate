import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { BsEnvelope, BsTelephone, BsGeoAlt, BsSend } from 'react-icons/bs';
import NavbarComponent from '../components/NavbarComponent';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import './ContactUs.css';

const ContactUs = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', msg: 'Message sent successfully! We will get back to you soon.' });
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus({ type: 'danger', msg: data.message || 'Failed to send message. Please try again later.' });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus({ type: 'danger', msg: 'Failed to connect to server. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavbarComponent />

      <div className={`contact-container ${theme === 'dark' ? 'dark-mode' : ''}`}>
        <Container>
          <div className="contact-header-text text-center mb-5">
            <h1 className="display-4">Contact Us</h1>
            <p className="lead">We'd love to hear from you. Get in touch with our team.</p>
          </div>

          <Row className="g-4 g-lg-5 align-items-start">
            {/* Contact Info */}
            <Col lg={5}>
              <div className="contact-left-section pe-lg-4">
                <h2>Get in Touch</h2>
                <p className="lead-text">
                  Have questions about posting a listing or finding a room?
                  Our support team is here to help you 24/7.
                </p>

                <div className="contact-info-item">
                  <div className="contact-icon-wrapper">
                    <BsGeoAlt />
                  </div>
                  <div>
                    <h5 className="contact-label">Office Location</h5>
                    <p className="contact-value">123 Innovation Drive, Tech City, TC 90210</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon-wrapper">
                    <BsTelephone />
                  </div>
                  <div>
                    <h5 className="contact-label">Phone Number</h5>
                    <p className="contact-value">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon-wrapper">
                    <BsEnvelope />
                  </div>
                  <div>
                    <h5 className="contact-label">Email Address</h5>
                    <p className="contact-value">support@roommate.com</p>
                  </div>
                </div>
              </div>
            </Col>

            {/* Contact Form */}
            <Col lg={7}>
              <Card className="glass-card border-0">
                <Card.Body className="p-4 p-md-5">
                  <h3 className="contact-form-title">Send us a Message</h3>

                  {status && <Alert variant={status.type}>{status.msg}</Alert>}

                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Your Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                            className="contact-form-control"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email Address</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            required
                            className="contact-form-control"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        className="contact-form-control"
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Message</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        required
                        className="contact-form-control"
                      />
                    </Form.Group>

                    <div className="d-grid">
                      <Button variant="primary" size="lg" type="submit" disabled={loading} className="contact-submit-btn">
                        {loading ? 'Sending...' : <><BsSend className="me-2" /> Send Message</>}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <Footer />
    </>
  );
};

export default ContactUs;
