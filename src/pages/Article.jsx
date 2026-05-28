import "./article.css";
import { useLocation, useNavigate } from "react-router-dom";

export default function Article() {

  const location = useLocation();
  const navigate = useNavigate();

  const article =
    location.state?.article ||
    JSON.parse(localStorage.getItem("currentArticle"));

  if (!article) {
    return (
      <div className="article-page">
        <div className="article-not-found">
          <h2>Article not found</h2>

          <button onClick={() => navigate("/")}>
            Back Home
          </button>
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

      <div className="article-wrapper">

        <button
          className="back-btn"
          onClick={() => navigate("/")}
        >
          ← Back Home
        </button>

        <img
          src={image}
          alt={article.title}
          className="article-main-image"
        />

        <h1 className="article-title">
          {article.title}
        </h1>

        <p className="article-description">
          {article.description}
        </p>

        <div className="article-content">

          <p>
            {article.content ||
              article.description ||
              "Full story coming soon on DanoNews."}
          </p>

        </div>

        {article.url && (

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="source-btn"
          >
            Read Original Source
          </a>

        )}

      </div>

    </div>
  );
}