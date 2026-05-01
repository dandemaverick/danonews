import { createContext, useContext, useEffect, useState } from "react";

const NewsContext = createContext();

// ✅ YOUR LIVE BACKEND
const API_BASE = "https://danonews.onrender.com";

export const NewsProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 GET NEWS
  const fetchNews = async (category = "general") => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/news`);
      const data = await res.json();

      if (data.status === "ok") {
        setArticles(data.articles);
      } else {
        console.error("API Error:", data);
      }
    } catch (err) {
      console.error("News fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 SEARCH NEWS
  const searchNews = async (query) => {
    if (!query) return;
    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE}/api/search?q=${encodeURIComponent(query)}`
      );

      const data = await res.json();

      if (data.status === "ok") {
        setArticles(data.articles);
      } else {
        console.error("Search API Error:", data);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🚀 INITIAL LOAD
  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <NewsContext.Provider value={{ articles, loading, fetchNews, searchNews }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => useContext(NewsContext);