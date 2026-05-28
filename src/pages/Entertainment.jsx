import "./home.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNews } from "../services/newsApi";

export default function Entertainment() {

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadEntertainment();
  }, []);

  async function loadEntertainment() {

    try {

      const data = await getNews("entertainment");

      if (data && data.length > 0) {
        setArticles(data);
      }

    } catch (error) {

      console.log(error);

    }

    setLoading(false);
  }

  const openArticle = (article) => {

    const slug = article.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");

    navigate(`/article/${slug}`, {
      state: { article },
    });

  };

  if (loading) {

    return (
      <div className="loader">
        Loading Entertainment...
      </div>
    );

  }

  const hero = articles[0];
  const latest = articles.slice(1);

  return (

    <div className="container">

      {/* TOP BAR */}

      <div
        style={{
          background: "#e11d48",
          color: "#fff",
          padding: "12px",
          textAlign: "center",
          fontWeight: "600",
          marginBottom: "30px",
          borderRadius: "8px",
        }}
      >
        ENTERTAINMENT LIVE • Music • Movies • Celebrities
      </div>

      <div className="main-content">

        {/* LEFT CONTENT */}

        <div className="content-left">

          {/* HERO */}

          {hero && (

            <div
              className="hero-story"
              onClick={() => openArticle(hero)}
            >

              <div
                className="hero-image-link"
                style={{
                  backgroundImage: `url(${
                    hero.image ||
                    hero.image_url ||
                    "https://picsum.photos/1200/600"
                  })`,
                  height: "500px",
                }}
              />

              <div className="hero-overlay">

                <span className="badge red">
                  ENTERTAINMENT
                </span>

                <h1>{hero.title}</h1>

                <p
                  style={{
                    marginTop: "15px",
                    color: "#eee",
                    fontSize: "16px",
                    maxWidth: "700px",
                  }}
                >
                  {hero.description || hero.content}
                </p>

              </div>

            </div>

          )}

          {/* LATEST */}

          <div className="section">

            <div className="section-header">
              <h2>Latest Entertainment News</h2>
            </div>

            <div className="featured-grid">

              {latest.map((article, i) => (

                <div
                  key={i}
                  className="card"
                  onClick={() => openArticle(article)}
                >

                  <div
                    className="card-image"
                    style={{
                      backgroundImage: `url(${
                        article.image ||
                        article.image_url ||
                        "https://picsum.photos/600/400"
                      })`,
                    }}
                  />

                  <div className="card-content">

                    <h3>{article.title}</h3>

                    <p
                      style={{
                        marginTop: "10px",
                        color: "#666",
                        lineHeight: "1.6",
                      }}
                    >
                      {article.description || article.content}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* SIDEBAR */}

        <div className="sidebar">

          <div className="sidebar-widget">

            <h3>Trending Entertainment</h3>

            {articles.map((article, i) => (

              <div
                key={i}
                className="trending-item"
                onClick={() => openArticle(article)}
              >

                <div className="trend-number">
                  {i + 1}
                </div>

                <div>{article.title}</div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  );
}