import { Link } from "react-router-dom";
import "../styles/not-found.css";

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-message">
          Sorry! The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">
            🏠 Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn btn-secondary"
          >
            ← Go Back
          </button>
        </div>

        <div className="not-found-suggestions">
          <h3>Popular Pages</h3>
          <nav className="suggestion-links">
            <Link to="/politics">Politics</Link>
            <Link to="/sports">Sports</Link>
            <Link to="/business">Business</Link>
            <Link to="/entertainment">Entertainment</Link>
            <Link to="/world">World</Link>
            <Link to="/videos">Videos</Link>
          </nav>
        </div>
      </div>
    </div>
  );
}