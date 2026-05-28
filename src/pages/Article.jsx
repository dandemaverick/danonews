import "./Article.css";
import { useLocation, useNavigate } from "react-router-dom";

export default function Article() {

  const location = useLocation();
  const navigate = useNavigate();

  const article = location.state?.article;

  if (!article) {

    return (

      <div className="article-not-found">

        <h2>Article Not Found</h2>

        <button
          className="back-btn"
          onClick={() => navigate("/")}
        >
          ← Back Home
        </button>

      </div>

    );

  }

  return (

    <div className="article-page">

      <div className="article-container">

        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back Home
        </button>

        {/* IMAGE */}

        <img
          src={
            article.image ||
            article.image_url ||
            "https://picsum.photos/1200/700"
          }
          alt={article.title}
          className="article-image"
        />

        {/* CATEGORY */}

        <div className="article-category">
          {article.category || "NEWS"}
        </div>

        {/* TITLE */}

        <h1 className="article-title">
          {article.title}
        </h1>

        {/* META */}

        <div className="article-meta">

          <span>
            {article.source?.name || "DanoNews"}
          </span>

          <span>•</span>

          <span>
            {article.publishedAt
              ? new Date(article.publishedAt).toDateString()
              : "Latest Update"}
          </span>

        </div>

        {/* DESCRIPTION */}

        {article.description && (

          <p className="article-description">
            {article.description}
          </p>

        )}

        {/* CONTENT */}

        <div className="article-content">

          <p>
            {article.content ||
              "Full article content unavailable from source."}
          </p>

          <p>
            DanoNews continues to bring you reliable updates
            from Ghana and around the world. Stay connected for
            more breaking stories, politics, sports,
            entertainment, business and world headlines.
          </p>

          <p>
            This report is part of our developing coverage and
            may be updated as more information becomes available.
          </p>

        </div>

        {/* SOURCE BUTTON */}

        {article.url && (

          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="source-btn"
          >
            Read Original Source
          </a>

        )}

      </div>

    </div>

  );
}