import "./Footer.css";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";

// Footer Component
const Footer = () => {
  const scrollToHome = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        {/* Left Section */}
        <div className="footer-content-left">
          <Link to="/" onClick={scrollToHome}>
            <img src={assets.bag_icon} alt="Authentic Naija Logo" />
          </Link>
          <p>
            Fidian Cakes & More brings you the best of Nigeria's richest
            delicacies right to your doorstep. Our meals are made with fresh,
            locally-sourced ingredients, offering you an authentic taste of
            Naija cuisine. Whether you crave jollof, pounded yam, or suya, we
            promise to deliver both quality and satisfaction. Enjoy the true
            flavor of Nigeria, one bite at a time.
          </p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="Facebook" />
            <img src={assets.twitter_icon} alt="Twitter" />
            <img src={assets.linkedin_icon} alt="LinkedIn" />
          </div>
        </div>

        {/* Center Section */}
        <div className="footer-content-center">
          <h2>Company</h2>
          <ul>
            <li>
              <Link to="/" onClick={scrollToHome}>
                Home
              </Link>
            </li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="footer-content-right">
          <h2>Get in Touch</h2>
          <ul>
            <li>Phone: +2348035204716</li>
            <li>Email: Sunexx@gmail.com</li>
          </ul>
        </div>
      </div>

      <hr />
      <p className="footer-copyright">
        Copyright 2024 © All Rights Reserved. Lot Sunday FullStack DEV
      </p>
    </div>
  );
};

export default Footer;
