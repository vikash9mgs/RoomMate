import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { BsPeopleFill, BsBuilding, BsGeoAltFill } from 'react-icons/bs';
import community from '../assets/community.webp';
import './CommunityStats.css';

const Counter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count.toLocaleString()}+</span>;
};

const CommunityStats = () => {
  return (
    <div className="stats-section" style={{ backgroundImage: `url(${community})` }}>
      <div className="stats-overlay"></div>

      <Container className="stats-content">
        <h2 className="stats-heading">Join Our Growing Community</h2>

        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-icon"><BsPeopleFill /></div>
            <h3 className="stat-number"><Counter target={250000} /></h3>
            <p className="stat-label">Happy Users</p>
          </div>

          <div className="stat-item">
            <div className="stat-icon"><BsBuilding /></div>
            <h3 className="stat-number"><Counter target={80000} /></h3>
            <p className="stat-label">Active Listings</p>
          </div>

          <div className="stat-item">
            <div className="stat-icon"><BsGeoAltFill /></div>
            <h3 className="stat-number"><Counter target={100} /></h3>
            <p className="stat-label">Cities Covered</p>
          </div>
        </div>

        <button className="stats-btn">Get Started Now</button>
      </Container>
    </div>
  );
};

export default CommunityStats;
