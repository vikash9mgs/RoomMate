import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Container, Form, Button, Card, Row, Col, Alert, Spinner, InputGroup } from "react-bootstrap";
import NavbarComponent from "../components/NavbarComponent";
import Footer from "../components/Footer";
import { BsArrowLeft } from "react-icons/bs";

const PostListing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // Get ID from URL if present (used for room type selection flow)

  // Check if we are in Edit Mode (passed via state)
  const editListing = location.state?.listing;
  const isEditMode = !!editListing;

  // State for form
  const [roomType, setRoomType] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    contactPhone: "",
    amenities: "",
    aadhar: "",
    imageUrls: [],
  });
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Check auth
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") {
      alert("Please login first!");
      navigate("/");
    }
  }, [navigate]);

  // Initialize form data
  useEffect(() => {
    if (isEditMode) {
      // Pre-fill form for editing
      setRoomType(editListing.type);
      setFormData({
        title: editListing.title,
        description: editListing.description,
        price: editListing.price,
        location: editListing.location,
        contactPhone: editListing.contactPhone,
        amenities: editListing.amenities.join(", "),
        aadhar: editListing.aadhar || "",
        imageUrls: editListing.images || [],
      });
    } else if (location.state?.roomTypeTitle) {
      // New listing from card selection
      setRoomType(location.state.roomTypeTitle);
    } else if (id) {
      // Fallback for ID-based room type selection
      const typeMap = {
        1: "1 BHK", 2: "2 BHK", 3: "Flat", 4: "Shared Room", 5: "Luxury House", 6: "PG Accommodation"
      };
      setRoomType(typeMap[id] || "Room");
    }
  }, [location.state, id, isEditMode, editListing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);

    try {
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append("image", file);
          const config = {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          };
          const { data } = await axios.post("http://localhost:3000/api/upload", formData, config);
          return `http://localhost:3000${data}`;
        })
      );

      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...uploadedUrls],
      }));
    } catch (error) {
      console.error("Error uploading images", error);
      setError("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      imageUrls: [...prev.imageUrls, imageUrlInput.trim()],
    }));
    setImageUrlInput("");
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem("token");
    const url = isEditMode
      ? `http://localhost:3000/api/listings/${editListing._id}`
      : "http://localhost:3000/api/listings";

    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          type: roomType,
          amenities: formData.amenities ? formData.amenities.split(",").map(item => item.trim()).filter(i => i) : [],
          images: formData.imageUrls,
          aadhar: formData.aadhar,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(isEditMode ? "Listing updated successfully!" : "Listing posted successfully!");
        setTimeout(() => {
          if (isEditMode) {
            navigate(`/listing/${editListing._id}`);
          } else {
            navigate("/all-listings");
          }
        }, 2000);
      } else {
        setError(data.message || "Failed to save listing");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  // Data for the room type cards
  const cards = [
    { id: 1, title: "1 BHK", description: "Cozy single room for one person.", img: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=2340" },
    { id: 2, title: "2 BHK", description: "Spacious room for two people.", img: "https://plus.unsplash.com/premium_photo-1661962340349-6ea59fff7e7b?auto=format&fit=crop&q=80&w=1974" },
    { id: 3, title: "Flat", description: "Flat for families or groups.", img: "https://images.unsplash.com/photo-1702014862053-946a122b920d?auto=format&fit=crop&q=80&w=2340" },
    { id: 4, title: "Shared Room", description: "Share accommodation.", img: "https://images.unsplash.com/photo-1758524942559-a74c7a64b6b1?auto=format&fit=crop&q=80&w=2832" },
    { id: 5, title: "Luxury House", description: "High-end amenities.", img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800" },
    { id: 6, title: "PG Accommodation", description: "Paying guest option.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdytXG7N5Jbxz-DXmPjAdNScCbrDwIJ2dzeA&s" },
  ];

  const handleCardClick = (id, title) => {
    navigate(`/listing-details/${id}`, { state: { roomTypeTitle: title } });
  };

  // Render Form if ID is present OR if in Edit Mode
  if (id || isEditMode) {
    return (
      <>
        <NavbarComponent />
        <Container className="py-5 mt-5">
          <Button variant="link" className="text-dark mb-3 p-0" onClick={() => navigate(isEditMode ? -1 : "/postlisting")}>
            <BsArrowLeft className="me-2" /> {isEditMode ? "Cancel Edit" : "Back to Room Types"}
          </Button>

          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <h2 className="mb-4">{isEditMode ? "Edit Listing" : `Post a ${roomType} Listing`}</h2>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        placeholder="e.g., Spacious 1BHK in Downtown"
                        required
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Price (per month)</Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        value={formData.price}
                        placeholder="e.g., 15000"
                        required
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    placeholder="Describe the property..."
                    required
                    onChange={handleChange}
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Location</Form.Label>
                      <Form.Control
                        type="text"
                        name="location"
                        value={formData.location}
                        placeholder="City, Area"
                        required
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Contact Phone</Form.Label>
                      <Form.Control
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        placeholder="Your contact number"
                        required
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Aadhar Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="aadhar"
                    value={formData.aadhar}
                    placeholder="Enter Aadhar Number"
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Amenities (comma separated)</Form.Label>
                  <Form.Control
                    type="text"
                    name="amenities"
                    value={formData.amenities}
                    placeholder="WiFi, AC, Parking, Gym"
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Upload Images</Form.Label>
                  <div className="d-flex flex-column gap-3">
                    <div>
                      <Form.Label className="text-muted small">Option 1: Upload from Device</Form.Label>
                      <Form.Control
                        type="file"
                        multiple
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                    </div>

                    <div className="text-center position-relative my-2">
                      <hr className="position-absolute w-100 top-50 start-0 translate-middle-y" />
                      <span className="bg-white px-2 position-relative text-muted small">OR</span>
                    </div>

                    <div>
                      <Form.Label className="text-muted small">Option 2: Add Image URL</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          placeholder="https://example.com/image.jpg"
                          value={imageUrlInput}
                          onChange={(e) => setImageUrlInput(e.target.value)}
                        />
                        <Button variant="outline-primary" onClick={handleAddImageUrl} type="button">
                          Add URL
                        </Button>
                      </InputGroup>
                    </div>
                  </div>
                  {uploading && <div className="mt-2"><Spinner animation="border" size="sm" /> Uploading...</div>}
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {formData.imageUrls.map((url, index) => (
                      <div key={index} className="position-relative">
                        <img src={url} alt="Uploaded" style={{ width: "100px", height: "100px", objectFit: "cover" }} className="rounded" />
                        <Button
                          variant="danger"
                          size="sm"
                          className="position-absolute top-0 end-0 p-0"
                          style={{ width: "20px", height: "20px", fontSize: "12px", lineHeight: "1" }}
                          onClick={() => handleRemoveImage(index)}
                        >
                          &times;
                        </Button>
                      </div>
                    ))}
                  </div>
                </Form.Group>

                <div className="d-grid">
                  <Button variant="primary" size="lg" type="submit" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : (isEditMode ? "Update Listing" : "Post Listing")}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Container>
        <Footer />
      </>
    );
  }

  // Render Room Type Selection
  return (
    <>
      <NavbarComponent />
      <div className="container my-5 py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">🏠 Choose Your Room Type</h2>
          <p className="text-muted">Select a room type to post your listing.</p>
        </div>

        <div className="row g-4">
          {cards.map((card) => (
            <div className="col-lg-4 col-md-6" key={card.id}>
              <div
                className="card h-100 shadow-sm card-hover"
                onClick={() => handleCardClick(card.id, card.title)}
                style={{ cursor: "pointer" }}
              >
                <div className="card-img-wrapper">
                  <img src={card.img} className="card-img-top" alt={card.title} />
                </div>
                <div className="card-body">
                  <h5 className="card-title">{card.title}</h5>
                  <p className="card-text text-muted">{card.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PostListing;