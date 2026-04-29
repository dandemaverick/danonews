import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const nav = useNavigate();

  function login(e) {
    e.preventDefault();

    if (user === "admin" && pass === "1234") {
      localStorage.setItem("danoAdmin", "yes");
      nav("/admin");
    } else {
      alert("Invalid login details");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "20px"
      }}
    >
      <form
        onSubmit={login}
        style={{
          background: "#fff",
          padding: "35px",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 12px 30px rgba(0,0,0,.08)"
        }}
      >
        <h1 style={{ marginBottom: "20px" }}>
          Admin Login
        </h1>

        <input
          placeholder="Username"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          style={box}
        />

        <input
          type="password"
          placeholder="Password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          style={box}
        />

        <button style={btn}>
          Login
        </button>
      </form>
    </div>
  );
}

const box = {
  width: "100%",
  padding: "14px",
  marginBottom: "14px",
  borderRadius: "10px",
  border: "1px solid #ddd"
};

const btn = {
  width: "100%",
  padding: "14px",
  background: "#0d47a1",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold"
};