import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      style={{
        background:
          "linear-gradient(180deg,#021033,#031a4a)",
        color: "#fff",
        marginTop: "70px",
        paddingTop: "55px"
      }}
    >
      {/* MAIN FOOTER */}
      <div
        style={{
          maxWidth: "1450px",
          margin: "auto",
          padding: "0 25px 40px",
          display: "grid",
          gridTemplateColumns:
            "1.6fr 1fr 1fr 1fr 1.2fr",
          gap: "35px"
        }}
      >
        {/* BRAND */}
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "48px",
              fontWeight: "900",
              lineHeight: "1"
            }}
          >
            <span style={{ color: "#fff" }}>
              Dano
            </span>

            <span style={{ color: "#ff2a2a" }}>
              News
            </span>
          </h2>

          <p
            style={{
              marginTop: "12px",
              opacity: ".85",
              lineHeight: "1.8"
            }}
          >
            DanoNews is Ghana’s leading digital
            news platform delivering credible,
            fast and global news coverage
            around the clock.
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "18px"
            }}
          >
            <button
              style={{
                background: "#000",
                color: "#fff",
                border: "1px solid #444",
                padding: "10px 14px",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              ▶ Google Play
            </button>

            <button
              style={{
                background: "#000",
                color: "#fff",
                border: "1px solid #444",
                padding: "10px 14px",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
               App Store
            </button>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3
            style={{
              marginTop: 0,
              borderBottom: "2px solid red",
              paddingBottom: "8px"
            }}
          >
            Quick Links
          </h3>

          <FooterLink to="/">Home</FooterLink>
          <FooterLink to="/politics">Politics</FooterLink>
          <FooterLink to="/business">Business</FooterLink>
          <FooterLink to="/sports">Sports</FooterLink>
          <FooterLink to="/videos">Videos</FooterLink>
          <FooterLink to="/privacy">Privacy Policy</FooterLink>
        </div>

        {/* CATEGORIES */}
        <div>
          <h3
            style={{
              marginTop: 0,
              borderBottom: "2px solid red",
              paddingBottom: "8px"
            }}
          >
            Categories
          </h3>

          <FooterLink to="/politics">Politics</FooterLink>
          <FooterLink to="/business">Business</FooterLink>
          <FooterLink to="/sports">Sports</FooterLink>
          <FooterLink to="/entertainment">
            Entertainment
          </FooterLink>
          <FooterLink to="/world">World</FooterLink>
          <FooterLink to="/videos">Videos</FooterLink>
        </div>

        {/* ABOUT */}
        <div>
          <h3
            style={{
              marginTop: 0,
              borderBottom: "2px solid red",
              paddingBottom: "8px"
            }}
          >
            About Us
          </h3>

          <p style={{ lineHeight: "1.8", opacity: ".9" }}>
            DanoNews is committed to journalism
            that informs, educates and empowers
            the public with truth and integrity.
          </p>

          <FooterLink to="/about">
            Our Mission
          </FooterLink>

          <FooterLink to="/careers">
            Careers
          </FooterLink>

          <FooterLink to="/advertise">
            Advertise With Us
          </FooterLink>
        </div>

        {/* CONTACT */}
        <div>
          <h3
            style={{
              marginTop: 0,
              borderBottom: "2px solid red",
              paddingBottom: "8px"
            }}
          >
            Contact Us
          </h3>

          <p>📍 No.15 Ring Road, Accra</p>
          <p>📞 +233 54 059 3430</p>
          <p>✉ info@danonews.com</p>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "15px",
              fontSize: "20px"
            }}
          >
            <span>📘</span>
            <span>𝕏</span>
            <span>📸</span>
            <span>▶</span>
            <span>🎵</span>
          </div>
        </div>
      </div>

      {/* BOTTOM STRIP */}
      <div
        style={{
          borderTop:
            "1px solid rgba(255,255,255,.12)",
          padding: "18px 25px",
          fontSize: "14px"
        }}
      >
        <div
          style={{
            maxWidth: "1450px",
            margin: "auto",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px"
          }}
        >
          <span>
            © 2026 DanoNews. All Rights Reserved.
          </span>

          <span
            style={{
              opacity: ".85"
            }}
          >
            Proudly Ghanaian 🇬🇭 • Built for
            Africa • Connected to the World
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, children }) {
  return (
    <p style={{ margin: "10px 0" }}>
      <Link
        to={to}
        style={{
          color: "#fff",
          opacity: ".9",
          textDecoration: "none"
        }}
      >
        › {children}
      </Link>
    </p>
  );
}