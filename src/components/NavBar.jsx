import { Link } from "react-router-dom";

export default function NavBar() {
  const items = [
    { name: "News", path: "/" },
    { name: "Politics", path: "/politics" },
    { name: "Business", path: "/business" },
    { name: "Sports", path: "/sports" },
    { name: "Entertainment", path: "/entertainment" },
    { name: "Lifestyle", path: "/lifestyle" },
    { name: "World", path: "/world" },
    { name: "Opinion", path: "/opinion" },
    { name: "Videos", path: "/videos" },
    { name: "More", path: "/more" }
  ];

  return (
    <nav
      style={{
        background: "#031a4a",
        borderBottom: "3px solid #e00000",
        position: "sticky",
        top: 0,
        zIndex: 999
      }}
    >
      <div
        style={{
          maxWidth: "1450px",
          margin: "auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 18px",
          minHeight: "62px",
          gap: "20px",
          flexWrap: "wrap"
        }}
      >
        {/* LEFT MENU */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "22px",
            flexWrap: "wrap"
          }}
        >
          {/* HOME ICON */}
          <Link
            to="/"
            style={{
              color: "#fff",
              fontSize: "22px",
              textDecoration: "none"
            }}
          >
            🏠
          </Link>

          {items.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              style={{
                color: "#fff",
                textDecoration: "none",
                fontWeight: "700",
                fontSize: "15px",
                letterSpacing: ".3px",
                textTransform: "uppercase"
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px"
          }}
        >
          {/* SEARCH */}
          <span
            style={{
              color: "#fff",
              fontSize: "20px",
              cursor: "pointer"
            }}
          >
            🔍
          </span>

          {/* LIVE TV */}
          <Link
            to="/videos"
            style={{
              background: "#e00000",
              color: "#fff",
              padding: "10px 18px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "800",
              fontSize: "14px"
            }}
          >
            LIVE TV 📡
          </Link>
        </div>
      </div>
    </nav>
  );
}