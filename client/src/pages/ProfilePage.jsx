import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Nav, Tab, Badge, Form, Alert, Spinner, Modal } from "react-bootstrap";
import NavbarComponent from "../components/NavbarComponent";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { BsPencilSquare, BsGear, BsGeoAlt, BsEnvelope, BsPhone, BsSave, BsXCircle, BsCardHeading, BsPlusLg, BsZoomIn, BsZoomOut } from "react-icons/bs";
import ListingCard from "../components/ListingCard"; // Import ListingCard
import { useTheme } from "../context/ThemeContext";
import "./ProfilePage.css";
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropUtils';

const ProfilePage = () => {
    const { theme } = useTheme();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [aadhar, setAadhar] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    // New state for listings
    const [myListings, setMyListings] = useState([]);
    const [loadingListings, setLoadingListings] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Cropper State
    const [itemImageSrc, setItemImageSrc] = useState(null);
    const [isCropping, setIsCropping] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const navigate = useNavigate();

    const fetchUserProfile = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:3000/api/auth/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setUser(data);
                localStorage.setItem("userInfo", JSON.stringify(data));

                setName(data.name);
                setEmail(data.email);
                setPhone(data.phone || "");
                setLocation(data.location || "");
                setAadhar(data.aadhar || "");
                setProfilePicture(data.profilePicture || "");
            }
        } catch (err) {
            console.error("Failed to fetch user profile", err);
        }
    };

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            const parsedUser = JSON.parse(userInfo);
            setUser(parsedUser);
            setName(parsedUser.name);
            setEmail(parsedUser.email);
            setPhone(parsedUser.phone || "");
            setLocation(parsedUser.location || "");
            setAadhar(parsedUser.aadhar || "");
            setProfilePicture(parsedUser.profilePicture || "");

            fetchMyListings();
            fetchUserProfile();
        } else {
            navigate("/");
        }
    }, [navigate]);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const uploadFileHandler = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setItemImageSrc(reader.result);
                setIsCropping(true);
            });
            reader.readAsDataURL(file);
        }
    };

    const handleCropSave = async () => {
        setIsCropping(false);
        setUploading(true);
        try {
            const croppedImageBlob = await getCroppedImg(itemImageSrc, croppedAreaPixels);
            const fileName = `profile-${Date.now()}.jpg`;
            const file = new File([croppedImageBlob], fileName, { type: "image/jpeg" });

            const formData = new FormData();
            formData.append("image", file);

            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };

            const { data } = await axios.post("http://localhost:3000/api/upload", formData, config);

            setProfilePicture(`http://localhost:3000${data}`);
            setUploading(false);
            setItemImageSrc(null);
            setZoom(1);
        } catch (error) {
            console.error(error);
            setUploading(false);
            setError("Failed to crop/upload image");
        }
    };

    const handleRemovePicture = () => {
        setProfilePicture("");
    };

    const fetchMyListings = async () => {
        setLoadingListings(true);
        const token = localStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:3000/api/listings/my-listings", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setMyListings(data);
            }
        } catch (err) {
            console.error("Failed to fetch listings", err);
        } finally {
            setLoadingListings(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:3000/api/auth/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, email, phone, location, aadhar, profilePicture, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("userInfo", JSON.stringify(data));
                localStorage.setItem("token", data.token);
                setUser(data);
                setIsEditing(false);
                setMessage("Profile Updated Successfully");
                setPassword("");
            } else {
                setError(data.message || "Update failed");
            }
        } catch (err) {
            setError("Failed to connect to server");
        }
    };

    if (!user) return null;

    return (
        <>
            <NavbarComponent />
            <Container className={`py-5 mt-5 pt-5 ${theme === 'dark' ? 'text-light' : ''}`}> {/* Increased top margin and padding */}
                {/* Header Section */}
                <div className="profile-header">
                    <div className="cover-image"></div>
                    <div className="profile-avatar-container">
                        <img
                            src={
                                user.profilePicture
                                    ? (user.profilePicture.startsWith("http")
                                        ? user.profilePicture
                                        : `http://localhost:3000${user.profilePicture}`)
                                    : `https://ui-avatars.com/api/?name=${user.name}&background=random&size=200`
                            }
                            alt="Profile"
                            className="profile-avatar"
                            onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${user.name}&background=random&size=200`;
                            }}
                        />
                    </div>
                    <div className="profile-info-header">
                        <h1 className={`profile-name ${theme === 'dark' ? 'text-light' : ''}`}>{user.name}</h1>
                        <span className="profile-role">
                            {user.isAdmin ? (
                                <Badge bg="danger" className="me-2">Admin</Badge>
                            ) : (
                                <Badge bg="primary" className="me-2">Member</Badge>
                            )}
                            RoomMate User
                        </span>
                    </div>
                </div>

                <Row className="mt-5 pt-3">
                    {/* Left Sidebar - Info */}
                    <Col lg={4} className="mb-4">
                        <Card className={`shadow-sm border-0 mb-4 ${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}`}>
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="mb-0 fw-bold">About</h5>
                                    {!isEditing && (
                                        <Button
                                            variant="light"
                                            size="sm"
                                            className="rounded-circle"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            <BsPencilSquare />
                                        </Button>
                                    )}
                                </div>

                                {message && <Alert variant="success">{message}</Alert>}
                                {error && <Alert variant="danger">{error}</Alert>}

                                {isEditing ? (
                                    <Form onSubmit={handleUpdateProfile}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Phone</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="Enter phone number"
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Location</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                placeholder="Enter city, country"
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Aadhar Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={aadhar}
                                                onChange={(e) => setAadhar(e.target.value)}
                                                placeholder="Enter Aadhar number"
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Profile Picture</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter image URL"
                                                value={profilePicture}
                                                onChange={(e) => setProfilePicture(e.target.value)}
                                                className="mb-2"
                                            />
                                            <Form.Control
                                                type="file"
                                                onChange={uploadFileHandler}
                                            />
                                            {uploading && <Spinner animation="border" size="sm" />}
                                            {profilePicture && (
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    className="mt-2"
                                                    onClick={handleRemovePicture}
                                                >
                                                    Remove Picture
                                                </Button>
                                            )}
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>New Password (optional)</Form.Label>
                                            <Form.Control
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Leave blank to keep current"
                                            />
                                        </Form.Group>
                                        <div className="d-flex gap-2">
                                            <Button variant="success" type="submit" size="sm" className="flex-grow-1">
                                                <BsSave className="me-1" /> Save
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setName(user.name);
                                                    setEmail(user.email);
                                                    setPhone(user.phone || "");
                                                    setLocation(user.location || "");
                                                    setAadhar(user.aadhar || "");
                                                    setProfilePicture(user.profilePicture || "");
                                                    setError(null);
                                                }}
                                            >
                                                <BsXCircle />
                                            </Button>
                                        </div>
                                    </Form>
                                ) : (
                                    <>
                                        <div className="mb-3">
                                            <div className="d-flex align-items-center text-muted mb-1">
                                                <BsEnvelope className="me-2" /> Email
                                            </div>
                                            <div className="fw-medium">{user.email}</div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="d-flex align-items-center text-muted mb-1">
                                                <BsPhone className="me-2" /> Phone
                                            </div>
                                            <div className="fw-medium">{user.phone || "Not set"}</div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="d-flex align-items-center text-muted mb-1">
                                                <BsGeoAlt className="me-2" /> Location
                                            </div>
                                            <div className="fw-medium">{user.location || "Not set"}</div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="d-flex align-items-center text-muted mb-1">
                                                <BsCardHeading className="me-2" /> Aadhar
                                            </div>
                                            <div className="fw-medium">{user.aadhar || "Not set"}</div>
                                        </div>
                                    </>
                                )}

                                <hr />

                                {!isEditing && (
                                    <Button
                                        variant="outline-primary"
                                        className="w-100 mb-2"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Edit Profile
                                    </Button>
                                )}
                                <Button
                                    variant="outline-secondary"
                                    className="w-100"
                                    onClick={() => navigate("/settings")}
                                >
                                    <BsGear className="me-2" /> Settings
                                </Button>
                            </Card.Body>
                        </Card>

                        {/* Stats Card */}
                        <Card className={`shadow-sm border-0 ${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}`}>
                            <Card.Body>
                                <h6 className="fw-bold mb-3">Community Stats</h6>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Listings Posted</span>
                                    <span className="fw-bold">{myListings.length}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Reviews</span>
                                    <span className="fw-bold">0</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>Member Since</span>
                                    <span className="fw-bold">Nov 2023</span>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Right Content - Tabs */}
                    <Col lg={8}>
                        <Tab.Container defaultActiveKey="listings">
                            <Card className={`shadow-sm border-0 ${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}`}>
                                <Card.Header className={`border-bottom-0 p-0 ${theme === 'dark' ? 'bg-dark' : ''}`}>
                                    <Nav variant="tabs" className="nav-tabs-custom">
                                        <Nav.Item>
                                            <Nav.Link eventKey="listings">My Listings</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="saved">Saved Homes</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="activity">Recent Activity</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Card.Header>
                                <Card.Body className="p-4">
                                    <Tab.Content>
                                        <Tab.Pane eventKey="listings">
                                            <div className="d-flex justify-content-between align-items-center mb-4">
                                                <h5 className="mb-0">My Listings</h5>
                                                <Button variant="primary" size="sm" onClick={() => navigate("/postlisting")}>
                                                    <BsPlusLg className="me-2" /> Add Room
                                                </Button>
                                            </div>
                                            {loadingListings ? (
                                                <div className="text-center py-5">
                                                    <Spinner animation="border" variant="primary" />
                                                </div>
                                            ) : myListings.length > 0 ? (
                                                <div className="listings-scroll-container">
                                                    <div className="row g-4">
                                                        {myListings.map((listing) => (
                                                            <div className="col-md-12" key={listing._id}>
                                                                <ListingCard listing={listing} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="listing-placeholder">
                                                    <img
                                                        src="https://cdn-icons-png.flaticon.com/512/6009/6009864.png"
                                                        alt="No listings"
                                                        width="80"
                                                        className={`mb-3 opacity-50 ${theme === 'dark' ? 'invert-filter' : ''}`}
                                                    />
                                                    <h5>No Listings Yet</h5>
                                                    <p className={theme === 'dark' ? 'text-light opacity-75' : 'text-muted'}>You haven't posted any rooms yet.</p>
                                                    <Button variant="primary" onClick={() => navigate("/postlisting")}>
                                                        Post a New Listing
                                                    </Button>
                                                </div>
                                            )}
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="saved">
                                            {user.favorites && user.favorites.length > 0 ? (
                                                <div className="listings-scroll-container">
                                                    <div className="row g-4">
                                                        {user.favorites
                                                            .filter(fav => typeof fav === 'object' && fav !== null && fav._id)
                                                            .map((listing) => (
                                                                <div className="col-md-12" key={listing._id}>
                                                                    <ListingCard listing={listing} />
                                                                </div>
                                                            ))}
                                                        {user.favorites.some(fav => typeof fav !== 'object') && (
                                                            <div className="col-12 text-center py-3">
                                                                <small className="text-muted">Loading other saved homes...</small>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="listing-placeholder">
                                                    <h5>No Saved Homes</h5>
                                                    <p className="text-muted">Homes you save will appear here.</p>
                                                    <Button variant="outline-primary" onClick={() => navigate("/all-listings")}>
                                                        Browse Homes
                                                    </Button>
                                                </div>
                                            )}
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="activity">
                                            <p className="text-muted text-center py-5">No recent activity to show.</p>
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Card.Body>
                            </Card>
                        </Tab.Container>
                    </Col>
                </Row>

                {/* Cropping Modal */}
                <Modal show={isCropping} onHide={() => setIsCropping(false)} backdrop="static" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Crop Profile Picture</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ position: 'relative', height: 400, width: '100%', backgroundColor: '#333' }}>
                        <Cropper
                            image={itemImageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </Modal.Body>
                    <Modal.Footer className="d-block" style={{ backgroundColor: '#fff' }}>
                        <div className="d-flex align-items-center mb-3">
                            <BsZoomOut className="text-muted" />
                            <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e) => {
                                    setZoom(e.target.value)
                                }}
                                className="form-range mx-2"
                            />
                            <BsZoomIn className="text-muted" />
                        </div>
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => { setIsCropping(false); setItemImageSrc(null); }}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleCropSave}>
                                Save Crop
                            </Button>
                        </div>
                    </Modal.Footer>
                </Modal>
            </Container>
            <Footer />
        </>
    );
};

export default ProfilePage;
