import { createContext, useContext, useEffect, useState } from "react";

const NewsContext = createContext();

const API_KEY = "3caa77d07a04533bc8ced8ba887119e";
const BASE_URL = "https://newsapi.org/v2";

// ⚠️ TEMP proxy (dev only)
const PROXY = "https://cors-anywhere.herokuapp.com/";

export const NewsProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async (category = "general") => {
    setLoading(true);
    try {
      const res = await fetch(
        `${PROXY}${BASE_URL}/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`
      );
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (err) {
      console.error("News fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const searchNews = async (query) => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${PROXY}${BASE_URL}/everything?q=${query}&apiKey=${API_KEY}`
      );
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(); // default load
  }, []);

  return (
    <NewsContext.Provider value={{ articles, loading, fetchNews, searchNews }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => useContext(NewsContext);