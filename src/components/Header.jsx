import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Header() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      };
      setTime(now.toLocaleDateString(undefined, options));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        
        {/* LEFT - DATE */}
        <div style={styles.left}>
          <span style={styles.date}>{time}</span>
        </div>

        {/* CENTER - LOGO */}
        <div style={styles.center}>
          <Link to="/" style={styles.logo}>
            Dano<span style={{ color: "#e00000" }}>News</span>
          </Link>
        </div>

        {/* RIGHT - ACTIONS */}
        <div style={styles.right}>
          <button style={styles.subscribe}>Subscribe</button>
        </div>
      </div>

      {/* BREAKING NEWS BAR */}
      <div style={styles.breakingBar}>
        <span style={styles.breakingLabel}>BREAKING</span>
        <span style={styles.breakingText}>
          Latest updates from around the world — stay informed with DanoNews
        </span>
      </div>
    </header>
  );
}

/* STYLES */
const styles = {
  header: {
    background: "#ffffff",
    borderBottom: "1px solid #e5e7eb"
  },

  container: {
    maxWidth: "1300px",
    margin: "auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    flexWrap: "wrap"
  },

  left: {
    fontSize: "13px",
    color: "#64748b"
  },

  date: {
    fontWeight: "500"
  },

  center: {
    textAlign: "center"
  },

  logo: {
    fontSize: "28px",
    fontWeight: "900",
    textDecoration: "none",
    color: "#020617",
    letterSpacing: "1px"
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },

  subscribe: {
    background: "#e00000",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "4px",
    fontWeight: "600",
    cursor: "pointer"
  },

  breakingBar: {
    background: "#020617",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 20px",
    fontSize: "14px",
    overflow: "hidden"
  },

  breakingLabel: {
    background: "#e00000",
    padding: "4px 8px",
    fontWeight: "700",
    fontSize: "12px"
  },

  breakingText: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  }
};