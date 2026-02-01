import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Footer.css';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className={`custom-footer pt-5 pb-3 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <div className="container">
        <div className="row text-start">
          {/* Top Cities */}
          <div className="col-md-3 mb-4">
            <h6 className="text-uppercase mb-3">Top Cities</h6>
            <ul className="list-unstyled">
              <li><a href="#" className={theme === 'dark' ? 'text-light' : 'text-dark'}>Lucknow</a></li>
              <li><a href="#" className={theme === 'dark' ? 'text-light' : 'text-dark'}>Bangalore</a></li>
              <li><a href="#" className={theme === 'dark' ? 'text-light' : 'text-dark'}>Pune</a></li>
              <li><a href="#" className={theme === 'dark' ? 'text-light' : 'text-dark'}>Mumbai</a></li>
              <li><a href="#" className={theme === 'dark' ? 'text-light' : 'text-dark'}>Hyderabad</a></li>
              <li><a href="#" className={theme === 'dark' ? 'text-light' : 'text-dark'}>Ahmedabad</a></li>
              <li><a href="#" className={theme === 'dark' ? 'text-light' : 'text-dark'}>Delhi</a></li>
              <li><a href="#" className={theme === 'dark' ? 'text-light' : 'text-dark'}>Noida</a></li>
            </ul>
          </div>

          {/* Communities */}
          <div className="col-md-3 mb-4">
            <h6 className="text-uppercase mb-3">Communities</h6>
            <ul className="list-unstyled">
              <li><a href="#" className={theme === 'dark' ? 'text-light' : 'text-dark'}>Flat And Flatmates Bangalore</a></li>
              <li><a href="#" className={theme === 'dark' ? 'text-light' : 'text-dark'}>Flat And Flatmates Pune</a></li>
              <li><a href="#" className={theme === 'dark' ? 'text-light' : 'text-dark'}>Flat And Flatmates Mumbai</a></li>
              <li><a href="#" className={theme === 'dark' ? 'text-light' : 'text-dark'}>Flat And Flatmates Hyderabad</a></li>
              <li><a href="#" className={theme === 'dark' ? 'text-light' : 'text-dark'}>Flat And Flatmates Ahmedabad</a></li>
              <li><a href="#" className={theme === 'dark' ? 'text-light' : 'text-dark'}>Flat And Flatmates Delhi</a></li>
              <li><a href="#" className={theme === 'dark' ? 'text-light' : 'text-dark'}>Flat And Flatmates Noida</a></li>
              <li><a href="#" className={theme === 'dark' ? 'text-light' : 'text-dark'}>Flat And Flatmates Gurgaon</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-md-3 mb-4">
            <h6 className="text-uppercase mb-3">Services</h6>
            <ul className="list-unstyled">
              <li><a href="#" className={theme === 'dark' ? 'text-light' : 'text-dark'}>Find A Roommate</a></li>
              <li><a href="#" className={theme === 'dark' ? 'text-light' : 'text-dark'}>Advertise A Room</a></li>
              <li><a href="#" className={theme === 'dark' ? 'text-light' : 'text-dark'}>Post A Room Wanted Ad</a></li>
              <li><a href="#" className={theme === 'dark' ? 'text-light' : 'text-dark'}>Advertise A Full Apartment</a></li>
              <li><a href="#" className={theme === 'dark' ? 'text-light' : 'text-dark'}>Flat And Flatmates Communities</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-md-3 mb-4">
            <h6 className="text-uppercase mb-3">Company</h6>
            <ul className="list-unstyled">
              <li><a href="/contactus" className={theme === 'dark' ? 'text-light' : 'text-dark'}>Contact Us</a></li>
              <li><a href="/termsofuse" className={theme === 'dark' ? 'text-light' : 'text-dark'}>Terms Of Use</a></li>
              <li><a href="/privacy&policy" className={theme === 'dark' ? 'text-light' : 'text-dark'}>Privacy Policy</a></li>
              <li><a href="/refund" className={theme === 'dark' ? 'text-light' : 'text-dark'}>Refund Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Social Media */}
        <div className="text-center my-4">
          <h6 className="text-uppercase mb-3">Follow Us On</h6>
          <a href="https://www.facebook.com/profile.php?id=100052449636158" className={`mx-2 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>
            <i className="fab fa-facebook fa-lg" target="_blank"></i>
          </a>
          <a href="https://www.instagram.com/iamakashsingh9" className={`mx-2 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>
            <i className="fab fa-instagram fa-lg" target="_blank"></i>
          </a>
          <a href="https://x.com/AkashSingh57860" className={`mx-2 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>
            <i className="fab fa-twitter fa-lg" target="_blank"></i>
          </a>
          <a href="https://www.linkedin.com/in/iamakashsingh9/" className={`mx-2 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>
            <i className="fab fa-linkedin fa-lg" target="_blank"></i>
          </a>
        </div>

        {/* Footer Bottom */}
        <div className="text-center small">
          RoomMate © 2026. All Rights Reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;
