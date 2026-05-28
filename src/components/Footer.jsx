import "./Footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-brand">
          <h2>
            <span className="footer-dano">Dano</span>
            <span className="footer-news">News</span>
          </h2>

          <p>
            Credible news without borders. Delivering fast, accurate,
            and independent journalism from Ghana, Africa, and the world.
          </p>

          <div className="footer-socials">
            <a href="/">Facebook</a>
            <a href="/">X</a>
            <a href="/">Instagram</a>
            <a href="/">YouTube</a>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-links">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/politics">Politics</Link>
          <Link to="/business">Business</Link>
          <Link to="/sports">Sports</Link>
          <Link to="/entertainment">Entertainment</Link>
        </div>

        {/* CATEGORIES */}
        <div className="footer-links">
          <h3>Categories</h3>

          <Link to="/world">World</Link>
          <Link to="/videos">Videos</Link>
          <Link to="/lifestyle">Lifestyle</Link>
          <Link to="/opinion">Opinion</Link>
        </div>

        {/* CONTACT */}
        <div className="footer-contact">
          <h3>Contact Us</h3>

          <p>No. BG 77 Helsinki st</p>
          <p>Accra, Ghana</p>

          <p className="footer-contact-space">
            📞 +233 54 059 3430
          </p>

          <p>✉ info@danonews.com</p>

          <button className="footer-button">
            Advertise With Us
          </button>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        <p>
          © 2026 DanoNews. All Rights Reserved.
        </p>

        <div className="footer-bottom-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/about">About Us</Link>
        </div>
      </div>
    </footer>
  );
}