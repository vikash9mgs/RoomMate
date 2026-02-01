import React from "react";
import { Container, Card, ListGroup, Button, Form } from "react-bootstrap";
import NavbarComponent from "../components/NavbarComponent";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { BsShieldLock, BsBell, BsTrash, BsArrowLeft, BsMoon, BsSun } from "react-icons/bs";
import { useTheme } from "../context/ThemeContext";

const SettingsPage = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const handleDeleteAccount = () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            alert("Account deletion request submitted.");
        }
    };

    return (
        <>
            <NavbarComponent />
            <Container className="py-5 mt-5" style={{ maxWidth: "800px" }}>
                <div className="d-flex align-items-center mb-4">
                    <Button variant="link" className="text-dark p-0 me-3" onClick={() => navigate("/profile")}>
                        <BsArrowLeft size={24} />
                    </Button>
                    <h2 className="mb-0">Settings</h2>
                </div>

                <Card className="shadow-sm border-0 mb-4">
                    <Card.Header className="bg-body-tertiary fw-bold py-3">Appearance</Card.Header>
                    <ListGroup variant="flush">
                        <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
                            <div className="d-flex align-items-center">
                                {theme === "dark" ? <BsMoon className="me-3 text-primary" size={20} /> : <BsSun className="me-3 text-warning" size={20} />}
                                <div>
                                    <div className="fw-medium">Dark Mode</div>
                                    <small className="text-muted">Switch between light and dark themes.</small>
                                </div>
                            </div>
                            <Form.Check
                                type="switch"
                                id="theme-switch"
                                checked={theme === "dark"}
                                onChange={toggleTheme}
                            />
                        </ListGroup.Item>
                    </ListGroup>
                </Card>

                <Card className="shadow-sm border-0 mb-4">
                    <Card.Header className="bg-body-tertiary fw-bold py-3">Account Security</Card.Header>
                    <ListGroup variant="flush">
                        <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
                            <div className="d-flex align-items-center">
                                <BsShieldLock className="me-3 text-primary" size={20} />
                                <div>
                                    <div className="fw-medium">Change Password</div>
                                    <small className="text-muted">Update your password regularly to keep your account secure.</small>
                                </div>
                            </div>
                            <Button variant="outline-primary" size="sm" onClick={() => navigate("/profile")}>
                                Update
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>

                <Card className="shadow-sm border-0 mb-4">
                    <Card.Header className="bg-body-tertiary fw-bold py-3">Notifications</Card.Header>
                    <ListGroup variant="flush">
                        <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
                            <div className="d-flex align-items-center">
                                <BsBell className="me-3 text-warning" size={20} />
                                <div>
                                    <div className="fw-medium">Push Notifications</div>
                                    <small className="text-muted">Receive updates about new listings and messages.</small>
                                </div>
                            </div>
                            <Form.Check type="switch" id="push-notifications" defaultChecked />
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
                            <div className="d-flex align-items-center">
                                <BsBell className="me-3 text-secondary" size={20} />
                                <div>
                                    <div className="fw-medium">Email Notifications</div>
                                    <small className="text-muted">Receive weekly newsletters and account alerts.</small>
                                </div>
                            </div>
                            <Form.Check type="switch" id="email-notifications" defaultChecked />
                        </ListGroup.Item>
                    </ListGroup>
                </Card>

                <Card className="shadow-sm border-0 border-danger">
                    <Card.Header className="bg-danger text-white fw-bold py-3">Danger Zone</Card.Header>
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <div className="fw-medium text-danger">Delete Account</div>
                                <small className="text-muted">Permanently remove your account and all data.</small>
                            </div>
                            <Button variant="danger" size="sm" onClick={handleDeleteAccount}>
                                <BsTrash className="me-2" /> Delete Account
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
            <Footer />
        </>
    );
};

export default SettingsPage;
