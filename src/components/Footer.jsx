import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      
      <div style={styles.container}>
        
        {/* BRAND */}
        <div>
          <h2 style={styles.logo}>
            Dano<span style={{ color: "#ff2a2a" }}>News</span>
          </h2>

          <p style={styles.text}>
            DanoNews delivers credible, fast and global news coverage
            across Ghana and beyond.
          </p>

          <div style={styles.storeButtons}>
            <button style={styles.storeBtn}>Google Play</button>
            <button style={styles.storeBtn}>App Store</button>
          </div>
        </div>

        {/* LINKS */}
        <div>
          <h3 style={styles.heading}>Quick Links</h3>
          <FooterLink to="/">Home</FooterLink>
          <FooterLink to="/politics">Politics</FooterLink>
          <FooterLink to="/business">Business</FooterLink>
          <FooterLink to="/sports">Sports</FooterLink>
        </div>

        {/* CATEGORIES */}
        <div>
          <h3 style={styles.heading}>Categories</h3>
          <FooterLink to="/entertainment">Entertainment</FooterLink>
          <FooterLink to="/world">World</FooterLink>
          <FooterLink to="/videos">Videos</FooterLink>
        </div>

        {/* ABOUT */}
        <div>
          <h3 style={styles.heading}>About</h3>
          <FooterLink to="/about">Our Mission</FooterLink>
          <FooterLink to="/careers">Careers</FooterLink>
          <FooterLink to="/advertise">Advertise</FooterLink>
        </div>

        {/* CONTACT */}
        <div>
          <h3 style={styles.heading}>Contact</h3>

          <p style={styles.text}>📍 Accra, Ghana</p>
          <p style={styles.text}>📞 +233 54 059 3430</p>
          <p style={styles.text}>✉ info@danonews.com</p>

          <div style={styles.socials}>
            <span style={styles.icon}>📘</span>
            <span style={styles.icon}>𝕏</span>
            <span style={styles.icon}>📸</span>
            <span style={styles.icon}>▶</span>
          </div>
        </div>

      </div>

      {/* BOTTOM */}
      <div style={styles.bottom}>
        <span>© {new Date().getFullYear()} DanoNews</span>
        <span style={{ opacity: 0.7 }}>Built in Ghana 🇬🇭</span>
      </div>
    </footer>
  );
}

/* LINK COMPONENT */
function FooterLink({ to, children }) {
  return (
    <Link to={to} style={styles.link}>
      {children}
    </Link>
  );
}

/* STYLES */
const styles = {
  footer: {
    background: "#020617",
    color: "#fff",
    marginTop: "60px"
  },

  container: {
    maxWidth: "1200px",
    margin: "auto",
    padding: "50px 20px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "30px"
  },

  logo: {
    fontSize: "32px",
    fontWeight: "900"
  },

  text: {
    opacity: 0.8,
    fontSize: "14px",
    lineHeight: "1.6"
  },

  heading: {
    marginBottom: "12px",
    fontSize: "16px",
    borderBottom: "2px solid #e00000",
    display: "inline-block"
  },

  link: {
    display: "block",
    margin: "8px 0",
    color: "#cbd5f5",
    textDecoration: "none",
    fontSize: "14px",
    transition: "0.2s"
  },

  storeButtons: {
    display: "flex",
    gap: "10px",
    marginTop: "15px"
  },

  storeBtn: {
    background: "#111827",
    color: "#fff",
    border: "1px solid #333",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  socials: {
    display: "flex",
    gap: "10px",
    marginTop: "10px"
  },

  icon: {
    fontSize: "18px",
    cursor: "pointer"
  },

  bottom: {
    borderTop: "1px solid #1e293b",
    padding: "15px 20px",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    fontSize: "13px"
  }
};