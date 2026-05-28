import "./home.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNews } from "../services/newsApi";

export default function Politics() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadNews();
  }, []);

  async function loadNews() {
    try {
      const data = await getNews("politics");
      setArticles(data || []);
    } catch (err) {
      console.error(err);
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
    return <div className="loader">Loading Politics News...</div>;
  }

  const hero = articles[0];
  const latest = articles.slice(1);

  return (
    <div className="container">
      <div className="main-content">

        <div className="content-left">

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
                <span className="badge red">POLITICS</span>
                <h1>{hero.title}</h1>
              </div>
            </div>
          )}

          <div className="section">
            <div className="section-header">
              <h2>Latest Politics News</h2>
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
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="sidebar">
          <div className="sidebar-widget">
            <h3>Trending Politics</h3>

            {articles.map((article, i) => (
              <div
                key={i}
                className="trending-item"
                onClick={() => openArticle(article)}
              >
                <div className="trend-number">{i + 1}</div>
                <div>{article.title}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}