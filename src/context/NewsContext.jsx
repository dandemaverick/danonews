import { createContext, useContext, useCallback, useState, useEffect } from "react";

// ✅ EXPORT CONTEXT (CRITICAL FIX)
export const NewsContext = createContext();

// ✅ USE ENVIRONMENT VARIABLE
const API_BASE = import.meta.env.VITE_API_URL || "https://danonews.onrender.com";

console.log("📡 API Base URL:", API_BASE);

export const NewsProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // =========================
  // FETCH NEWS
  // =========================
  const fetchNews = useCallback(async (category = "general") => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/news?category=${category}`);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      if (data?.status === "ok" && Array.isArray(data.articles)) {
        setArticles(data.articles);

        // ✅ SAVE FOR RELATED ARTICLES SYSTEM
        localStorage.setItem("allArticles", JSON.stringify(data.articles));
      } else {
        throw new Error("Invalid API response");
      }

    } catch (err) {
      setError(err.message);
      console.error("📛 News fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // SEARCH NEWS
  // =========================
  const searchNews = useCallback(async (query) => {
    if (!query || query.trim().length === 0) {
      setError("Search query cannot be empty");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const encodedQuery = encodeURIComponent(query.trim());
      const res = await fetch(`${API_BASE}/api/search?q=${encodedQuery}`);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      if (data?.status === "ok" && Array.isArray(data.articles)) {
        setArticles(data.articles);
      } else {
        throw new Error("Invalid API response");
      }

    } catch (err) {
      setError(err.message);
      console.error("📛 Search error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    fetchNews("general");
  }, [fetchNews]);

  return (
    <NewsContext.Provider
      value={{
        articles,
        loading,
        error,
        fetchNews,
        searchNews
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

// =========================
// CUSTOM HOOK (BEST PRACTICE)
// =========================
export const useNews = () => {
  const context = useContext(NewsContext);

  if (!context) {
    throw new Error("useNews must be used within a NewsProvider");
  }

  return context;
};