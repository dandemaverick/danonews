import { useEffect, useState } from "react";

export default function Profile() {

  const [userData, setUserData] = useState(null);

  useEffect(() => {

    const storedUser = localStorage.getItem("user");

    if (storedUser) {

      setUserData(JSON.parse(storedUser));

    }

  }, []);

  return (

    <div
      style={{
        minHeight: "70vh",
        padding: "40px 20px",
        background: "#f4f5f7",
      }}
    >

      <div
        style={{
          maxWidth: "900px",
          margin: "auto",
          background: "#fff",
          padding: "40px",
          borderRadius: "14px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >

        <h1
          style={{
            marginBottom: "25px",
            color: "#071a52",
          }}
        >
          My Profile
        </h1>

        {!userData ? (

          <div>

            <p
              style={{
                fontSize: "18px",
                marginBottom: "20px",
              }}
            >
              No user logged in.
            </p>

            <button
              style={{
                background: "#d50000",
                color: "#fff",
                border: "none",
                padding: "12px 20px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Login
            </button>

          </div>

        ) : (

          <div>

            <div
              style={{
                marginBottom: "20px",
              }}
            >

              <h3>Name</h3>

              <p>
                {userData.name || "DanoNews User"}
              </p>

            </div>

            <div
              style={{
                marginBottom: "20px",
              }}
            >

              <h3>Email</h3>

              <p>
                {userData.email || "No email"}
              </p>

            </div>

            <div
              style={{
                marginBottom: "20px",
              }}
            >

              <h3>Membership</h3>

              <p>
                Premium Reader
              </p>

            </div>

            <button
              onClick={() => {

                localStorage.removeItem("user");

                window.location.reload();

              }}
              style={{
                background: "#071a52",
                color: "#fff",
                border: "none",
                padding: "12px 20px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>

          </div>

        )}

      </div>

    </div>
  );
}