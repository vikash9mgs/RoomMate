import React from 'react';
import { Card, Row, Col, ProgressBar, Badge } from 'react-bootstrap';
import { BsShieldCheck, BsSoundwave, BsTrainFront, BsGraphUp, BsLightbulb, BsCameraVideo } from 'react-icons/bs';

const LocalityDashboard = ({ location }) => {
    // Mock Data based on location (randomized for demo)
    const safetyScore = 85;
    const noiseLevel = 30; // Low is good
    const connectivity = 92;
    const livability = 88;

    return (
        <Card className="glass-card border-0 mb-4">
            <Card.Body className="p-4">
                <h5 className="fw-bold mb-4">
                    <BsGraphUp className="me-2 text-primary" /> Locality Intelligence: <span className="text-gradient">{location}</span>
                </h5>

                <Row className="g-4">
                    {/* Safety Score */}
                    <Col md={6} lg={3}>
                        <div className="p-3 rounded bg-white bg-opacity-5 h-100 border border-white border-opacity-10">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <small className="text-muted text-uppercase fw-bold">Night Safety</small>
                                <BsShieldCheck className="text-success fs-5" />
                            </div>
                            <h2 className="fw-bold mb-0">{safetyScore}/100</h2>
                            <small className="text-success">Safe neighborhood</small>
                        </div>
                    </Col>

                    {/* Noise Level */}
                    <Col md={6} lg={3}>
                        <div className="p-3 rounded bg-white bg-opacity-5 h-100 border border-white border-opacity-10">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <small className="text-muted text-uppercase fw-bold">Noise Level</small>
                                <BsSoundwave className="text-info fs-5" />
                            </div>
                            <h2 className="fw-bold mb-0">{noiseLevel} dB</h2>
                            <small className="text-info">Quiet residential area</small>
                        </div>
                    </Col>

                    {/* Connectivity */}
                    <Col md={6} lg={3}>
                        <div className="p-3 rounded bg-white bg-opacity-5 h-100 border border-white border-opacity-10">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <small className="text-muted text-uppercase fw-bold">Connectivity</small>
                                <BsTrainFront className="text-warning fs-5" />
                            </div>
                            <h2 className="fw-bold mb-0">{connectivity}/100</h2>
                            <small className="text-warning">Excellent transport</small>
                        </div>
                    </Col>

                    {/* Livability */}
                    <Col md={6} lg={3}>
                        <div className="p-3 rounded bg-white bg-opacity-5 h-100 border border-white border-opacity-10">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <small className="text-muted text-uppercase fw-bold">Livability Index</small>
                                <BsGraphUp className="text-primary fs-5" />
                            </div>
                            <h2 className="fw-bold mb-0">{livability}/100</h2>
                            <small className="text-primary">Highly recommended</small>
                        </div>
                    </Col>
                </Row>

                {/* Safety Insights */}
                <div className="mt-4 pt-4 border-top border-white border-opacity-10">
                    <h6 className="fw-bold mb-3">Safety & Neighbourhood Insights</h6>
                    <div className="d-flex flex-wrap gap-3">
                        <Badge bg="dark" className="p-2 border border-secondary fw-normal d-flex align-items-center gap-2">
                            <BsLightbulb className="text-warning" /> Well Lit Streets
                        </Badge>
                        <Badge bg="dark" className="p-2 border border-secondary fw-normal d-flex align-items-center gap-2">
                            <BsCameraVideo className="text-danger" /> 24/7 CCTV Coverage
                        </Badge>
                        <Badge bg="dark" className="p-2 border border-secondary fw-normal d-flex align-items-center gap-2">
                            <BsShieldCheck className="text-success" /> High Female Safety Score
                        </Badge>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default LocalityDashboard;
