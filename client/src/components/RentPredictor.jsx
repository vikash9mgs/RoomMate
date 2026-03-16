import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { BsCurrencyRupee, BsGraphUpArrow, BsCheckCircleFill, BsExclamationTriangleFill } from 'react-icons/bs';

const RentPredictor = ({ currentRent, location }) => {
    // Mock AI Prediction Logic
    const fairRent = Math.round(currentRent * 0.95); // Assume fair rent is slightly lower for demo
    const isOverpriced = currentRent > fairRent * 1.1;
    const isGoodDeal = currentRent <= fairRent;

    return (
        <Card className="glass-card border-0 mb-4">
            <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                        <h5 className="fw-bold mb-1">
                            <BsCurrencyRupee className="me-2 text-success" /> AI Rent Predictor
                        </h5>
                        <p className="text-muted small mb-0">Based on historical data in {location}</p>
                    </div>
                    {isGoodDeal ? (
                        <Badge bg="success" className="px-3 py-2">
                            <BsCheckCircleFill className="me-2" /> Great Deal
                        </Badge>
                    ) : isOverpriced ? (
                        <Badge bg="danger" className="px-3 py-2">
                            <BsExclamationTriangleFill className="me-2" /> Slightly Overpriced
                        </Badge>
                    ) : (
                        <Badge bg="info" className="px-3 py-2">Fair Price</Badge>
                    )}
                </div>

                <Row className="align-items-center g-4">
                    <Col md={5}>
                        <div className="text-center p-3 rounded bg-white bg-opacity-5 border border-white border-opacity-10">
                            <small className="text-muted text-uppercase fw-bold">Predicted Fair Rent</small>
                            <h2 className="text-success fw-bold display-6 my-2">₹{fairRent.toLocaleString()}</h2>
                            <small className="text-muted">Range: ₹{(fairRent - 1000).toLocaleString()} - ₹{(fairRent + 1000).toLocaleString()}</small>
                        </div>
                    </Col>

                    <Col md={7}>
                        <h6 className="fw-bold mb-3">Price Trend Forecast</h6>
                        {/* Simple CSS Bar Chart Mock */}
                        <div className="d-flex align-items-end gap-3" style={{ height: '100px' }}>
                            <div className="w-100 d-flex flex-column align-items-center gap-1">
                                <div className="bg-secondary w-100 rounded-top opacity-50" style={{ height: '60%' }}></div>
                                <small className="text-muted" style={{ fontSize: '10px' }}>3 Mo Ago</small>
                            </div>
                            <div className="w-100 d-flex flex-column align-items-center gap-1">
                                <div className="bg-secondary w-100 rounded-top opacity-75" style={{ height: '75%' }}></div>
                                <small className="text-muted" style={{ fontSize: '10px' }}>Last Mo</small>
                            </div>
                            <div className="w-100 d-flex flex-column align-items-center gap-1">
                                <div className="bg-primary w-100 rounded-top" style={{ height: '85%' }}></div>
                                <small className="fw-bold" style={{ fontSize: '10px' }}>Now</small>
                            </div>
                            <div className="w-100 d-flex flex-column align-items-center gap-1">
                                <div className="bg-success w-100 rounded-top opacity-50" style={{ height: '95%' }}></div>
                                <small className="text-muted" style={{ fontSize: '10px' }}>Next Mo</small>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-2 mt-3 text-success small">
                            <BsGraphUpArrow />
                            <span>Rents in {location} are expected to rise by 5% next month.</span>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default RentPredictor;
