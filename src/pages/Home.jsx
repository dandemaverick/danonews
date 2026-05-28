import "./home.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNews } from "../services/newsApi";

export default function Home() {

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {

    const loadNews = async () => {

      try {

        setLoading(true);

        const data = await getNews("general");

        if (data && data.length > 0) {

          // PRIORITIZE GHANA NEWS
          const ghanaFirst = [...data].sort((a, b) => {

            const aGhana =
              a.title?.toLowerCase().includes("ghana") ||
              a.description?.toLowerCase().includes("ghana");

            const bGhana =
              b.title?.toLowerCase().includes("ghana") ||
              b.description?.toLowerCase().includes("ghana");

            return bGhana - aGhana;
          });

          setArticles(ghanaFirst);

        } else {

          setArticles(getDemoArticles());

        }

      } catch (err) {

        console.warn(
          "Using demo data due to error:",
          err.message
        );

        setArticles(getDemoArticles());

      } finally {

        setLoading(false);

      }
    };

    loadNews();

  }, []);

  /* =========================
     DEMO FALLBACK ARTICLES
  ========================= */

  const getDemoArticles = () => [

    {
      title: "Mahama Unveils Bold 24-Hour Economy Policy",
      description:
        "President John Dramani Mahama introduces comprehensive plan to transform Ghana’s economy.",
      image:
        "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop",
    },

    {
      title:
        "Black Stars Squad Announced for World Cup Qualifiers",
      description:
        "Otto Addo names strong 26-man squad ahead of crucial matches.",
      image:
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop",
    },

    {
      title:
        "Ghana Cedi Gains 2.3% Against US Dollar",
      description:
        "Local currency shows strong performance in forex market.",
      image:
        "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1200&auto=format&fit=crop",
    },

    {
      title:
        "Fuel Prices Expected to Drop by 8% Next Month",
      description:
        "Good news for motorists as global oil prices stabilize.",
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop",
    },

  ];

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