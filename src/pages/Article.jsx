import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import Header from "../components/Header";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Widgets from "../components/Widgets";
import AdSense from "../components/AdSense";
import { supabase } from "../services/supabase";

export default function Article() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    loadPost();
    incrementViews();
  }, [id]);

  /* LOAD POST */
  async function loadPost() {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (data) setPost(data);
  }

  /* ✅ TRACK VIEWS (PRO VERSION) */
  async function incrementViews() {
    const viewedKey = `viewed_${id}`;

    // prevent duplicate views per session
    if (sessionStorage.getItem(viewedKey)) return;

    sessionStorage.setItem(viewedKey, "true");

    // use RPC (fast + safe)
    await supabase.rpc("increment_views", {
      post_id: id
    });
  }

  if (!post) {
    return (
      <div style={{ padding: "50px", fontSize: "22px" }}>
        Loading article...
      </div>
    );
  }

  const rawText = post.content || post.body || "";

  const cleanText = rawText
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const paragraphs = rawText
    .split("\n")
    .filter((p) => p.trim() !== "");

  const imageUrl =
    post.image_url ||
    post.image ||
    "https://picsum.photos/900/500?news";

  return (
    <div className="site-shell">

      {/* SEO */}
      <Helmet>
        <title>{post.title} | DanoNews</title>
        <meta name="description" content={cleanText.slice(0, 160)} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={cleanText.slice(0, 160)} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={cleanText.slice(0, 160)} />
        <meta name="twitter:image" content={imageUrl} />
      </Helmet>

      <Header />
      <NavBar />

      {/* TOP AD */}
      <div style={{ maxWidth: "1400px", margin: "18px auto", padding: "0 20px" }}>
        <AdSense slot="4444444444" />
      </div>

      <div className="breaking-bar">
        <span>FULL STORY</span>
        <marquee>
          DanoNews trusted reporting • Stay informed • Breaking updates daily
        </marquee>
      </div>

      <main className="homepage-grid">
        <section className="main-content">

          {/* IMAGE */}
          <article className="hero-card">
            <img src={imageUrl} alt={post.title} />
          </article>

          {/* CONTENT */}
          <section className="news-strip">

            {/* SPONSORED */}
            {post.sponsored && (
              <div style={styles.sponsored}>
                Sponsored Content • Paid Promotion
              </div>
            )}

            <h1 style={styles.title}>{post.title}</h1>

            {/* ✅ NEW: VIEW COUNT */}
            <p style={styles.views}>
              👁 {post.views || 0} views
            </p>

            <div style={styles.articleBox}>
              {paragraphs.length > 0 ? (
                paragraphs.map((para, index) => (
                  <div key={index}>
                    <p>{para}</p>

                    {index === 1 && (
                      <div style={{ margin: "28px 0" }}>
                        <AdSense slot="5555555555" />
                      </div>
                    )}

                    {index === 4 && (
                      <div style={{ margin: "28px 0" }}>
                        <AdSense slot="6666666666" />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>{cleanText}</p>
              )}

              <div style={{ marginTop: "35px" }}>
                <AdSense slot="7777777777" />
              </div>

              <hr style={styles.hr} />

              <p><strong>Source:</strong> DanoNews Editorial Desk</p>
              <p><strong>Published:</strong> Today</p>

              {post.sponsored && (
                <p style={styles.sponsoredText}>
                  This article contains paid promotional content.
                </p>
              )}
            </div>
          </section>
        </section>

        {/* SIDEBAR */}
        <aside>
          <Widgets />

          <div style={{ marginTop: "20px" }}>
            <AdSense slot="8888888888" />
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  );
}

/* STYLES */
const styles = {
  title: {
    fontSize: "42px",
    margin: "10px 0 10px",
    lineHeight: "1.2"
  },

  views: {
    fontSize: "14px",
    opacity: 0.6,
    marginBottom: "15px"
  },

  articleBox: {
    background: "#fff",
    padding: "32px",
    borderRadius: "14px",
    lineHeight: "1.95",
    fontSize: "19px",
    boxShadow: "0 10px 24px rgba(0,0,0,.06)"
  },

  hr: {
    margin: "30px 0",
    border: "none",
    borderTop: "1px solid #eee"
  },

  sponsored: {
    background: "#fff6d6",
    color: "#8a6500",
    padding: "14px 18px",
    borderRadius: "10px",
    fontWeight: "800",
    marginTop: "20px",
    marginBottom: "20px",
    border: "1px solid #f0d46a"
  },

  sponsoredText: {
    marginTop: "20px",
    color: "#8a6500",
    fontWeight: "700"
  }
};