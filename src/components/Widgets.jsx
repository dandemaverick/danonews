import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function Widgets() {
  const [trending, setTrending] = useState([]);
  const [videos, setVideos] = useState([]);
  const [sponsored, setSponsored] = useState([]);

  useEffect(() => {
    fetchTrending();
    fetchVideos();
    fetchSponsored();
  }, []);

  /* FETCH TRENDING */
  async function fetchTrending() {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("views", { ascending: false })
      .limit(5);

    if (data) setTrending(data);
  }

  /* FETCH VIDEOS */
  async function fetchVideos() {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("type", "video")
      .limit(1);

    if (data) setVideos(data);
  }

  /* FETCH SPONSORED */
  async function fetchSponsored() {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("sponsored", true)
      .limit(1);

    if (data) setSponsored(data);
  }

  return (
    <div style={styles.wrapper}>

      {/* TRENDING */}
      <div style={styles.widget}>
        <h3 style={styles.title}>🔥 Trending</h3>

        {trending.map((item, i) => (
          <Link key={item.id} to={`/article/${item.id}`} style={styles.trendItem}>
            <span>{i + 1}</span>
            <p>{item.title}</p>
          </Link>
        ))}
      </div>

      {/* VIDEO */}
      <div style={styles.widget}>
        <h3 style={styles.title}>📺 Video News</h3>

        {videos.map((video) => (
          <Link key={video.id} to={`/article/${video.id}`} style={styles.videoBox}>
            ▶ {video.title}
          </Link>
        ))}
      </div>

      {/* SOCIAL */}
      <div style={styles.widget}>
        <h3 style={styles.title}>🌍 Follow Us</h3>

        <div style={styles.socials}>
          <a href="#" style={styles.socialItem}>Facebook</a>
          <a href="#" style={styles.socialItem}>Instagram</a>
          <a href="#" style={styles.socialItem}>X</a>
          <a href="#" style={styles.socialItem}>YouTube</a>
        </div>
      </div>

      {/* SPONSORED */}
      <div style={styles.widget}>
        <h3 style={styles.title}>Sponsored</h3>

        {sponsored.map((ad) => (
          <Link key={ad.id} to={`/article/${ad.id}`} style={styles.adBox}>
            {ad.title}
          </Link>
        ))}
      </div>

    </div>
  );
}

/* STYLES */
const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },

  widget: {
    background: "#fff",
    padding: "18px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
  },

  title: {
    marginBottom: "12px",
    borderLeft: "4px solid #e00000",
    paddingLeft: "10px"
  },

  trendItem: {
    display: "flex",
    gap: "10px",
    textDecoration: "none",
    color: "#000",
    marginBottom: "10px"
  },

  videoBox: {
    display: "block",
    background: "#020617",
    color: "#fff",
    padding: "20px",
    borderRadius: "8px",
    textDecoration: "none"
  },

  socials: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px"
  },

  socialItem: {
    background: "#f1f5f9",
    padding: "10px",
    textAlign: "center",
    borderRadius: "6px",
    textDecoration: "none",
    color: "#000"
  },

  adBox: {
    display: "block",
    background: "#f8fafc",
    padding: "25px",
    textAlign: "center",
    borderRadius: "8px",
    textDecoration: "none",
    color: "#000"
  }
};