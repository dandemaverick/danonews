import { Link } from "react-router-dom";

export default function Header() {
  return (
    <>
      {/* TOP INFO BAR */}
      <div
        style={{
          background: "#03153f",
          color: "#fff",
          padding: "10px 0"
        }}
      >
        <div
          style={{
            width: "95%",
            maxWidth: "1700px",
            margin: "auto",
            fontSize: "14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px"
          }}
        >
          {/* LEFT */}
          <div
            style={{
              display: "flex",
              gap: "18px",
              alignItems: "center",
              flexWrap: "wrap"
            }}
          >
            <span>Wednesday, April 24, 2026</span>
            <span>📍 Accra, Ghana</span>
            <span>🌤 29°C</span>

            <span
              style={{
                background: "red",
                padding: "4px 10px",
                borderRadius: "4px",
                fontWeight: "bold",
                fontSize: "12px"
              }}
            >
              LIVE
            </span>

            <span style={{ color: "#ddd" }}>
              Parliament debates 2026 budget amid reforms
            </span>
          </div>

          {/* RIGHT */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
              flexWrap: "wrap"
            }}
          >
            <Link to="/about" style={{ color: "#fff", textDecoration: "none" }}>
              About Us
            </Link>

            <Link to="/contact" style={{ color: "#fff", textDecoration: "none" }}>
              Contact Us
            </Link>

            <Link to="/advertise" style={{ color: "#fff", textDecoration: "none" }}>
              Advertise
            </Link>

            <Link to="/careers" style={{ color: "#fff", textDecoration: "none" }}>
              Careers
            </Link>

            <Link to="/privacy" style={{ color: "#fff", textDecoration: "none" }}>
              Privacy Policy
            </Link>

            <span style={{ cursor: "pointer" }}>📘</span>
            <span style={{ cursor: "pointer" }}>𝕏</span>
            <span style={{ cursor: "pointer" }}>📸</span>
            <span style={{ cursor: "pointer" }}>▶</span>
          </div>
        </div>
      </div>

      {/* LOGO + APP BANNER */}
      <div
        style={{
          background: "#fff",
          padding: "22px 0",
          borderBottom: "1px solid #eee"
        }}
      >
        <div
          style={{
            width: "95%",
            maxWidth: "1700px",
            margin: "auto",
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "25px",
            alignItems: "center"
          }}
        >
          {/* LOGO */}
          <Link
            to="/"
            style={{
              textDecoration: "none"
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "64px",
                  fontWeight: "900",
                  lineHeight: "1"
                }}
              >
                <span style={{ color: "#07256b" }}>Dano</span>
                <span style={{ color: "#e00000" }}>News</span>
              </h1>

              <p
                style={{
                  marginTop: "8px",
                  color: "#666",
                  fontWeight: "600",
                  letterSpacing: "1px"
                }}
              >
                CREDIBLE NEWS WITHOUT BORDERS
              </p>
            </div>
          </Link>

          {/* APP BANNER */}
          <div
            style={{
              background:
                "linear-gradient(90deg,#eef4ff,#ffffff)",
              border: "1px solid #dde7ff",
              borderRadius: "10px",
              padding: "18px 25px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap"
            }}
          >
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "34px",
                  color: "#0d2b6b"
                }}
              >
                DanoNews App
              </h3>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "#555",
                  fontSize: "18px"
                }}
              >
                Your news. Your way.
              </p>
            </div>

            <button
              style={{
                background: "#e00000",
                color: "#fff",
                border: "none",
                padding: "14px 28px",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "16px",
                cursor: "pointer"
              }}
            >
              Download Now!
            </button>
          </div>
        </div>
      </div>
    </>
  );
}