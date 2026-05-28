import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { useAuth } from "../context/AuthContext";

import Header from "../components/Header";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

import "../styles/bookmarks.css";

export default function Bookmarks() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD BOOKMARKS
  ========================= */
  useEffect(() => {
    if (!user) return;

    const loadBookmarks = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) {
        setBookmarks(data);
      }

      setLoading(false);
    };

    loadBookmarks();
  }, [user]);

  /* =========================
     REMOVE BOOKMARK
  ========================= */
  const removeBookmark = async (id) => {
    await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id);

    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  /* =========================
     OPEN ARTICLE
  ========================= */
  const openArticle = (article) => {
    navigate("/article", { state: { article } });
  };

  if (!user) {
    return <div className="container">Please login to view bookmarks</div>;
  }

  return (
    <div className="site-shell">
      <Header />
      <NavBar />

      <div className="container bookmarks-page">

        <h2>🔖 Saved Articles</h2>

        {loading && <p>Loading bookmarks...</p>}

        {!loading && bookmarks.length === 0 && (
          <p>No saved articles yet</p>
        )}

        <div className="bookmarks-grid">

          {bookmarks.map((b, i) => {
            const article = b.article_data;

            return (
              <div key={i} className="bookmark-card">

                <div
                  className="bookmark-image"
                  style={{
                    backgroundImage: `url(${article?.image})`
                  }}
                  onClick={() => openArticle(article)}
                />

                <div className="bookmark-content">

                  <h3 onClick={() => openArticle(article)}>
                    {article?.title}
                  </h3>

                  <div className="bookmark-meta">
                    {article?.source || "DanoNews"}
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeBookmark(b.id)}
                  >
                    Remove
                  </button>

                </div>

              </div>
            );
          })}

        </div>

      </div>

      <Footer />
    </div>
  );
}