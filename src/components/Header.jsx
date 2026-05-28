import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const options = {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      };

      setCurrentTime(
        now.toLocaleDateString("en-US", options)
      );
    };

    updateTime();

    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* TOP BAR */}
      <div className="top-header">

        <div className="container top-header-content">

          {/* LEFT */}
          <div className="top-left">
            <span>{currentTime}</span>
            <span>📍 Accra, Ghana</span>
            <span>🌡️ 29°C</span>
          </div>

          {/* CENTER */}
          <div className="top-center">
            <span className="live-badge">LIVE</span>

            <span>
              Parliament debates 2026 budget amid economic concerns
            </span>
          </div>

          {/* RIGHT */}
          <div className="top-right">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/advertise">Advertise</Link>
            <Link to="/careers">Careers</Link>
          </div>

        </div>

      </div>

      {/* MAIN HEADER */}
      <header className="main-header">

        <div className="container main-header-content">

          {/* LOGO */}
          <Link to="/" className="logo-area">

            <h1 className="logo-text">
              <span className="logo-dark">Dano</span>
              <span className="logo-red">News</span>
            </h1>

            <p className="logo-slogan">
              CREDIBLE NEWS WITHOUT BORDERS
            </p>

          </Link>

          {/* SEARCH */}
          <div className="search-area">

            <input
              type="text"
              placeholder="Search DanoNews..."
            />

            <button>
              🔍
            </button>

          </div>

          {/* LIVE TV */}
          <button className="live-tv-btn">
            LIVE TV
          </button>

        </div>
        {/* NAVBAR */}
<nav className="nav-menu">

  <div className="container nav-links">

    <Link to="/">NEWS</Link>
    <Link to="/politics">POLITICS</Link>
    <Link to="/business">BUSINESS</Link>
    <Link to="/sports">SPORTS</Link>
    <Link to="/entertainment">ENTERTAINMENT</Link>
    <Link to="/lifestyle">LIFESTYLE</Link>
    <Link to="/world">WORLD</Link>
    <Link to="/videos">VIDEOS</Link>

  </div>

</nav>

      </header>
    </>
  );
}