import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import Header from "../components/Header";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Widgets from "../components/Widgets";
import { supabase } from "../services/supabase";

export default function Article() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [apiArticle, setApiArticle] = useState(null);

  useEffect(() => {
    // ✅ 1. Try state
    if (state?.article) {
      setApiArticle(state.article);
      return;
    }

    // ✅ 2. Try localStorage (refresh fix)
    const saved = localStorage.getItem("currentArticle");
    if (saved) {
      setApiArticle(JSON.parse(saved));
      return;
    }

    // ✅ 3. Fallback to DB
    loadPost();
    incrementViews();
  }, [id]);

  async function loadPost() {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (data) setPost(data);
  }

  async function incrementViews() {
    const viewedKey = `viewed_${id}`;
    if (sessionStorage.getItem(viewedKey)) return;

    sessionStorage.setItem(viewedKey, "true");

    await supabase.rpc("increment_views", {
      post_id: id
    });
  }

  /* =========================
     🟡 API ARTICLE (PREMIUM UI)
  ========================== */
  if (apiArticle) {
    const image =
      apiArticle.urlToImage || "https://via.placeholder.com/1200x600";

    return (
      <div className="site-shell">
        <Header />
        <NavBar />

        <div style={styles.container}>
          <Helmet>
            <title>{apiArticle.title} | DanoNews</title>
          </Helmet>

          {/* HERO IMAGE */}
          <div style={styles.hero}>
            <img
              src={image}
              onError={(e) =>
                (e.target.src = "https://via.placeholder.com/1200x600")
              }
            />
          </div>

          {/* CONTENT */}
          <div style={styles.content}>
            <h1 style={styles.title}>{apiArticle.title}</h1>

            <div style={styles.meta}>
              <span>{apiArticle.source?.name}</span>
              <span>•</span>
              <span>
                {new Date(apiArticle.publishedAt).toDateString()}
              </span>
            </div>

            <p style={styles.lead}>
              {apiArticle.description}
            </p>

            <div style={styles.body}>
              {apiArticle.content || apiArticle.description}
            </div>

            <a
              href={apiArticle.url}
              target="_blank"
              style={styles.readMore}
            >
              Continue reading on source →
            </a>

            <button style={styles.backBtn} onClick={() => navigate(-1)}>
              ← Back
            </button>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  /* =========================
     🔵 DATABASE ARTICLE
  ========================== */

  if (!post) {
    return <h2 style={{ padding: "40px" }}>Loading...</h2>;
  }

  const rawText = post.content || "";
  const paragraphs = rawText.split("\n").filter(p => p.trim());

  const imageUrl =
    post.image_url || "https://picsum.photos/1200/600";

  return (
    <div className="site-shell">
      <Header />
      <NavBar />

      <div style={styles.container}>
        <div style={styles.hero}>
          <img src={imageUrl} />
        </div>

        <div style={styles.content}>
          <h1 style={styles.title}>{post.title}</h1>

          <p style={styles.meta}>
            👁 {post.views || 0} views
          </p>

          <div style={styles.body}>
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

/* 🎨 PREMIUM STYLES */
const styles = {
  container: {
    maxWidth: "1000px",
    margin: "auto",
    padding: "20px"
  },

  hero: {
    marginBottom: "20px"
  },

  content: {
    background: "#fff",
    padding: "30px",
    borderRadius: "14px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
  },

  title: {
    fontSize: "42px",
    lineHeight: "1.2",
    marginBottom: "15px"
  },

  meta: {
    display: "flex",
    gap: "10px",
    fontSize: "14px",
    color: "#777",
    marginBottom: "20px"
  },

  lead: {
    fontSize: "20px",
    fontWeight: "500",
    marginBottom: "20px"
  },

  body: {
    fontSize: "18px",
    lineHeight: "1.8"
  },

  readMore: {
    display: "block",
    marginTop: "30px",
    color: "#e00000",
    fontWeight: "bold"
  },

  backBtn: {
    marginTop: "20px",
    padding: "10px 15px",
    border: "none",
    background: "#000",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer"
  }
};