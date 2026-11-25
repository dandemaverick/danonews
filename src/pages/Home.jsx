import "./home.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNews } from "../services/newsApi";

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

export default function Home() {

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    let refreshTimer;

    const loadNews = async () => {
      const data = await getNews("general");
      if (!active) return;

      if (data.length > 0) {
        const latestFirst = [...data].sort(
          (a, b) =>
            (Date.parse(b.publishedAt) || 0) -
            (Date.parse(a.publishedAt) || 0)
        );
        setArticles(latestFirst);
      }

      setLoading(false);
      refreshTimer = window.setTimeout(loadNews, REFRESH_INTERVAL_MS);
    };

    loadNews();

    return () => {
      active = false;
      window.clearTimeout(refreshTimer);
    };
  }, []);

  /* =========================
     IMAGE FALLBACKS
  ========================= */

  const getImage = (article) => {

    return (
      article?.image ||
      article?.urlToImage ||
      article?.image_url ||
      article?.url ||
      "https://placehold.co/600x400?text=DanoNews"
    );
  };

  /* =========================
     OPEN ARTICLE
  ========================= */

  const openArticle = (article) => {

    const slug = article.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");

    // SAVE ARTICLE FOR REFRESH SUPPORT
    localStorage.setItem(
      "currentArticle",
      JSON.stringify(article)
    );

    navigate(`/article/${slug}`, {
      state: { article },
    });
  };

  /* =========================
     LOADING SCREEN
  ========================= */

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#071a52] text-white text-2xl">
        Loading DanoNews...
      </div>
    );
  }

  if (!articles.length) {
    return <div className="container">News is temporarily unavailable. Retrying automatically.</div>;
  }

  const hero = articles[0];
  const sideStories = articles.slice(1, 3);
  const latest = articles.slice(3);

  return (

    <div className="container">

      <div className="main-content">

        {/* LEFT CONTENT */}

        <div className="content-left">

          {/* HERO SECTION */}

          <div className="hero-section">

            {hero && (

              <div
                className="hero-story"
                onClick={() => openArticle(hero)}
              >

                <div
                  className="hero-image-link"
                  style={{
                    backgroundImage:
                      `url(${getImage(hero)})`,
                  }}
                />

                <div className="hero-overlay">

                  <span className="badge red">
                    TOP STORY
                  </span>

                  <h1>{hero.title}</h1>

                  <p>
                    {hero.description?.slice(0, 120)}...
                  </p>

                </div>

              </div>
            )}

            {/* SIDE STORIES */}

            <div className="side-hero">

              {sideStories.map((article, i) => (

                <div
                  key={i}
                  className="side-card"
                  style={{
                    backgroundImage:
                      `url(${getImage(article)})`,
                  }}
                  onClick={() => openArticle(article)}
                >

                  <div className="side-card-overlay">
                    {article.title}
                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* LATEST NEWS */}

          <div className="section">

            <div className="section-header">
              <h2>Latest News</h2>
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
                      backgroundImage:
                        `url(${getImage(article)})`,
                    }}
                  />

                  <div className="card-content">

                    <h3>{article.title}</h3>

                    <p>
                      {article.description
                        ?.slice(0, 100)}
                      ...
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

            <h3>Trending Now</h3>

            {articles.slice(0, 10).map((article, i) => (

              <div
                key={i}
                className="trending-item"
                onClick={() => openArticle(article)}
              >

                <div className="trend-number">
                  {i + 1}
                </div>

                <div>
                  {article.title}
                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}