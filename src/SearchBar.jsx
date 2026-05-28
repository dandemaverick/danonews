import { useState } from "react";
import { useNews } from "../context/NewsContext";

export default function SearchBar() {
  const { searchNews } = useNews();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      const res = await fetch(
        `https://danonews.onrender.com/api/search?q=${value}`
      );
      const data = await res.json();
      setSuggestions(data.articles.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="search-box">
      <input
        placeholder="Search news..."
        value={query}
        onChange={handleChange}
      />

      {suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.map((item, i) => (
            <div key={i} onClick={() => searchNews(item.title)}>
              {item.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}