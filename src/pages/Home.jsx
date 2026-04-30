import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import AdSense from "../components/AdSense";
import Widgets from "../components/Widgets";
import { supabase } from "../supabase";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("id", { ascending: false })
      .limit(30);

    if (data) setPosts(data);
  }

  const hero = posts[0];
  const side = posts.slice(1, 5);

  return (
    <>
      <Helmet>
        <title>DanoNews - Premium News Platform</title>
      </Helmet>

      <Header />
      <NavBar />

      <div style={styles.page}>

        {/* HERO */}
        <div style={styles.heroGrid}>

          {/* MAIN HERO */}
          {hero && (
            <Link to={`/article/${hero.id}`} style={styles.heroMain}>
              <img src={hero.image} style={styles.heroImg} />

              <div style={styles.overlay}>
                <span style={styles.badge}>TOP STORY</span>
                <h1>{hero.title}</h1>
                <p>{hero.body?.slice(0, 140)}...</p>
              </div>
            </Link>
          )}

          {/* SIDE */}
          <div style={styles.sideGrid}>
            {side.map((item) => (
              <Link key={item.id} to={`/article/${item.id}`} style={styles.sideCard}>
                <img src={item.image} />
                <div>
                  <small>{item.cat}</small>
                  <h3>{item.title}</h3>
                </div>
              </Link>
            ))}
          </div>

        </div>

        {/* MAIN CONTENT */}
        <div style={styles.mainLayout}>

          {/* LEFT */}
          <div>

            {/* LATEST */}
            <section style={styles.section}>
              <h2>Latest News</h2>

              <div style={styles.grid}>
                {posts.slice(0, 10).map((item) => (
                  <Link key={item.id} to={`/article/${item.id}`} style={styles.card}>
                    <img src={item.image} />

                    <div style={{ padding: "12px" }}>
                      <small>{item.cat}</small>
                      <h4>{item.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* ADS */}
            <div style={{ margin: "40px 0" }}>
              <AdSense slot="3333333333" />
            </div>

          </div>

          {/* RIGHT SIDEBAR */}
          <div style={styles.sidebar}>
            <Widgets />
          </div>

        </div>

      </div>

      <Footer />
    </>
  );
}

/* STYLES */
const styles = {
  page: {
    maxWidth: "1300px",
    margin: "auto",
    padding: "20px"
  },

  heroGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "20px"
  },

  heroMain: {
    position: "relative",
    height: "450px",
    borderRadius: "12px",
    overflow: "hidden",
    textDecoration: "none",
    color: "#fff"
  },

  heroImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "0.4s"
  },

  overlay: {
    position: "absolute",
    bottom: 0,
    padding: "25px",
    background: "linear-gradient(transparent, rgba(0,0,0,0.9))"
  },

  badge: {
    background: "#e00000",
    padding: "6px 12px",
    fontSize: "12px",
    fontWeight: "700"
  },

  sideGrid: {
    display: "grid",
    gap: "15px"
  },

  sideCard: {
    display: "flex",
    gap: "10px",
    textDecoration: "none",
    color: "#000",
    background: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 3px 10px rgba(0,0,0,0.05)"
  },

  mainLayout: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "30px",
    marginTop: "40px"
  },

  sidebar: {
    position: "sticky",
    top: "90px",
    height: "fit-content"
  },

  section: {
    marginBottom: "30px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px,1fr))",
    gap: "20px"
  },

  card: {
    textDecoration: "none",
    color: "#000",
    borderRadius: "10px",
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
    transition: "0.3s"
  }
};