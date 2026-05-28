import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Article.css";

export default function Article() {

  const { slug } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticle();
  }, [slug]);

  function slugify(text) {
    return text
      ?.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  async function loadArticle() {

    try {

      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/news"
      );

      const result = await response.json();

      const posts = result.articles || [];

      const found = posts.find(
        (item) => slugify(item.title) === slug
      );

      if (found) {

        setArticle(found);

        const relatedPosts = posts
          .filter((item) => item.title !== found.title)
          .slice(0, 4);

        setRelated(relatedPosts);
      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="article-loading">
        Loading article...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="article-loading">
        Article not found
      </div>
    );
  }

  return (
    <div className="article-page">

      {/* HERO */}
      <div className="article-hero">

        <img
          src={
            article.image ||
            "https://picsum.photos/1400/700?news"
          }
          alt={article.title}
        />

        <div className="article-overlay">

          <div className="article-hero-content">

            <span className="article-badge">
              DANONEWS
            </span>

            <h1>{article.title}</h1>

            <div className="article-meta">

              <span>DanoNews Editorial</span>

              <span>•</span>

              <span>
                {new Date(
                  article.publishedAt
                ).toDateString()}
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* BODY */}
      <div className="article-container">

        {/* MAIN ARTICLE */}
        <div className="article-main">

          <div className="article-content">

            {(article.content ||
              article.description ||
              "")
              .split(". ")
              .map((paragraph, index) => (

                <p key={index}>
                  {paragraph}.
                </p>

              ))}

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

        {/* SIDEBAR */}
        <div className="article-sidebar">

          <h2>Related Stories</h2>

          {related.map((item, index) => (

            <div
              key={index}
              className="related-card"
              onClick={() =>
                navigate(
                  `/article/${slugify(item.title)}`
                )
              }
            >

              <img
                src={
                  item.image ||
                  "https://picsum.photos/500/300?news"
                }
                alt={item.title}
              />

              <h3>{item.title}</h3>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}