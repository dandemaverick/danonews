import "./article.css";
import { useLocation, useNavigate } from "react-router-dom";

export default function Article() {

  const location = useLocation();
  const navigate = useNavigate();

  // GET ARTICLE
  const article =
    location.state?.article ||
    JSON.parse(localStorage.getItem("currentArticle"));

  // IMAGE HANDLER
  const image =
    article?.image ||
    article?.urlToImage ||
    article?.image_url ||
    "https://placehold.co/1200x700?text=DanoNews";

  // LOADING / EMPTY
  if (!article) {
    return (
      <div className="article-container">
        <button onClick={() => navigate("/")}>
          ← Back Home
        </button>

        <h2>Article not found</h2>
      </div>
    );
  }

  return (

    <div className="article-page">

      <div className="article-container">

        {/* MAIN IMAGE */}

        <div className="article-image-wrap">

          <img
            src={image}
            alt={article.title}
            className="article-image"
          />

        </div>

        {/* ARTICLE CONTENT */}

        <div className="article-content">

          <button
            className="back-btn"
            onClick={() => navigate("/")}
          >
            ← Back Home
          </button>

          <h1>{article.title}</h1>

          <p className="article-description">
            {article.description}
          </p>

          <div className="article-body">

            <p>
              {article.content ||
                article.description ||
                "Full story coming soon on DanoNews."}
            </p>

          </div>

          {/* SOURCE LINK */}

          {article.url && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="source-link"
            >
              Read Original Source
            </a>
          )}

        </div>

      </div>

    </div>
  );
}