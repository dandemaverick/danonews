import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { searchNews } from "../services/newsApi";
import "./search.css";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const navigate = useNavigate();
  const containerRef = useRef();

  /* =========================
     LIVE SEARCH (DEBOUNCE)
  ========================= */
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShow(false);
      return;
    }

    let isActive = true;
    setLoading(true);

    const delay = setTimeout(async () => {
      try {
        const data = await searchNews(query);
        if (isActive) {
          setResults((data || []).slice(0, 6));
          setShow(true);
        }
      } catch (err) {
        console.error("❌ Search error:", err);
      } finally {
        if (isActive) setLoading(false);
      }
    }, 400);

    return () => {
      isActive = false;
      clearTimeout(delay);
    };
  }, [query]);

  /* =========================
     CLICK OUTSIDE
  ========================= */
  useEffect(() => {
    const handleClick = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* =========================
     KEYBOARD NAVIGATION
  ========================= */
  const handleKeyDown = (e) => {
    if (!show) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < results.length - 1 ? prev + 1 : 0
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : results.length - 1
      );
    }

    if (e.key === "Enter") {
      e.preventDefault();

      if (activeIndex >= 0) {
        openArticle(results[activeIndex]);
      }
    }
  };

  /* =========================
     OPEN ARTICLE (FIXED)
  ========================= */
  const openArticle = (article) => {
    if (!article) return;

    // Save fallback for refresh
    localStorage.setItem("currentArticle", JSON.stringify(article));

    // ✅ FIXED: wrap in { article }
    navigate("/article", { state: { article } });

    setShow(false);
    setQuery("");
    setActiveIndex(-1);
  };

  return (
    <div className="search-container" ref={containerRef}>

      <input
        type="text"
        placeholder="Search news..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActiveIndex(-1);
        }}
        onFocus={() => query && setShow(true)}
        onKeyDown={handleKeyDown}
      />

      {show && (
        <div className="search-dropdown">

          {/* LOADING */}
          {loading && (
            <div className="search-status">Searching...</div>
          )}

          {/* NO RESULTS */}
          {!loading && results.length === 0 && (
            <div className="search-status">No results found</div>
          )}

          {/* RESULTS */}
          {!loading &&
            results.map((r, i) => (
              <div
                key={i}
                className={`search-item ${
                  i === activeIndex ? "active" : ""
                }`}
                onClick={() => openArticle(r)}
              >
                <img
                  src={
                    r.image ||
                    "https://via.placeholder.com/80x60?text=No+Image"
                  }
                  alt=""
                />
                <p>{r.title}</p>
              </div>
            ))}

        </div>
      )}

    </div>
  );
}