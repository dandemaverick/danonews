import "./Article.css";
import { useLocation, useNavigate } from "react-router-dom";

export default function Article() {

  const location = useLocation();
  const navigate = useNavigate();

  const article =
  location.state?.article ||
  JSON.parse(localStorage.getItem("currentArticle"));

  // Redirect if article missing
  if (!article) {
    return (
      <div className="article-page">
        <div className="article-container">

          <button
            className="back-btn"
            onClick={() => navigate("/")}
          >
            ← Back Home
          </button>

          <h1>Article Not Found</h1>

          <p>
            This article may have expired or was opened
            directly without homepage state.
          </p>

        </div>
      </div>
    );
  }

  const image =
    article.image ||
    article.urlToImage ||
    article.image_url ||
    "https://placehold.co/1200x700?text=DanoNews";

  return (
    <div className="article-page">

      <div className="article-container">

        <button
          className="back-btn"
          onClick={() => navigate("/")}
        >
          ← Back Home
        </button>

        <img
          src={image}
          alt={article.title}
          className="article-image"
        />

        <h1 className="article-title">
          {article.title}
        </h1>

        <p className="article-description">
          {article.description ||
            "No description available."}
        </p>

        <div className="article-content">

          {article.content ||
            article.description ||
            "Full article content unavailable."}

        </div>

        {article.url && (
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="read-more-btn"
          >
            Read Original Source
          </a>
        )}

      </div>
    </div>
  );
}