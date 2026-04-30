import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const items = [
    { name: "News", path: "/" },
    { name: "Politics", path: "/politics" },
    { name: "Business", path: "/business" },
    { name: "Sports", path: "/sports" },
    { name: "Entertainment", path: "/entertainment" },
    { name: "Lifestyle", path: "/lifestyle" },
    { name: "World", path: "/world" },
    { name: "Opinion", path: "/opinion" },
    { name: "Videos", path: "/videos" }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        
        {/* LEFT */}
        <div style={styles.left}>
          {/* LOGO */}
          <Link to="/" style={styles.logo}>
            DanoNews
          </Link>

          {/* DESKTOP MENU */}
          <div style={styles.menuDesktop}>
            {items.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                style={{
                  ...styles.link,
                  color: isActive(item.path) ? "#e00000" : "#fff"
                }}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div style={styles.right}>
          <span style={styles.search}>🔍</span>

          <Link to="/videos" style={styles.liveBtn}>
            LIVE
          </Link>

          {/* HAMBURGER */}
          <div
            style={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          {items.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              style={styles.mobileLink}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

/* STYLES */
const styles = {
  nav: {
    background: "#020617",
    borderBottom: "2px solid #e00000",
    position: "sticky",
    top: 0,
    zIndex: 999
  },

  container: {
    maxWidth: "1300px",
    margin: "auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    minHeight: "64px"
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: "25px"
  },

  logo: {
    color: "#fff",
    fontSize: "22px",
    fontWeight: "800",
    textDecoration: "none"
  },

  menuDesktop: {
    display: "flex",
    gap: "18px"
  },

  link: {
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
    transition: "0.2s"
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "15px"
  },

  search: {
    color: "#fff",
    fontSize: "18px",
    cursor: "pointer"
  },

  liveBtn: {
    background: "#e00000",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: "5px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "13px"
  },

  hamburger: {
    display: "none",
    fontSize: "22px",
    color: "#fff",
    cursor: "pointer"
  },

  mobileMenu: {
    display: "flex",
    flexDirection: "column",
    background: "#020617",
    padding: "15px"
  },

  mobileLink: {
    color: "#fff",
    textDecoration: "none",
    padding: "10px 0",
    borderBottom: "1px solid #1e293b"
  }
};

/* RESPONSIVE (inject via JS) */
if (typeof window !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    @media (max-width: 900px) {
      .menuDesktop {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(style);
}