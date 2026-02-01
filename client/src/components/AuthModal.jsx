import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import "./AuthModal.css";

// Icons
const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const AuthModal = ({ show, handleClose, isLogin, onSwitch, onLoginSuccess }) => {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const payload = isLogin ? { email, password } : { name, email, password, role };

    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        login(data, data.token); // Use context login
        // alert(isLogin ? "✅ Login Successful!" : "✅ Registration Successful!"); // Removing intrusive alert for better UX
        if (onLoginSuccess) onLoginSuccess(true);
        handleClose();
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Registration Error:", err);
      setError("Failed to connect to server. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered contentClassName="auth-modal-content">
      <Modal.Header closeButton className="auth-modal-header">
        <Modal.Title className="auth-modal-title">
          {isLogin ? "Welcome Back" : "Create Account"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="auth-modal-body">
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <Form.Group className="custom-input-group">
                <Form.Label className="custom-input-label">Full Name</Form.Label>
                <Form.Control
                  className="custom-input"
                  type="text"
                  placeholder="e.g. Akash Singh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              <div className="mb-4">
                <label className="role-selector-label">I want to...</label>
                <div className="role-options">
                  <label className="role-card">
                    <input
                      type="radio"
                      name="role"
                      value="user"
                      checked={role === "user"}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    <div className="role-card-inner">
                      <div className="role-icon"><UserIcon /></div>
                      <div className="role-text">Find a Room</div>
                      <span className="role-subtext">Browse listings</span>
                    </div>
                  </label>

                  <label className="role-card">
                    <input
                      type="radio"
                      name="role"
                      value="member"
                      checked={role === "member"}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    <div className="role-card-inner">
                      <div className="role-icon"><HomeIcon /></div>
                      <div className="role-text">List a Room</div>
                      <span className="role-subtext">Post your property</span>
                    </div>
                  </label>
                </div>
              </div>
            </>
          )}

          <Form.Group className="custom-input-group">
            <Form.Label className="custom-input-label">Email Address</Form.Label>
            <Form.Control
              className="custom-input"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="custom-input-group">
            <Form.Label className="custom-input-label">Password</Form.Label>
            <Form.Control
              className="custom-input"
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            type="submit"
            className="w-100 auth-btn"
            disabled={loading}
          >
            {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
          </Button>

          <div className="text-center mt-4 auth-switch-text">
            {isLogin ? (
              <>
                New to RoomMate?{" "}
                <span className="auth-switch-link" onClick={onSwitch}>
                  Create an account
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span className="auth-switch-link" onClick={onSwitch}>
                  Sign in
                </span>
              </>
            )}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AuthModal;
