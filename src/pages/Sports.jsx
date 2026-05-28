import "./home.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function Sports() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadSports();
  }, []);

  async function loadSports() {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .or(
          "title.ilike.%sport%,title.ilike.%football%,title.ilike.%black stars%,title.ilike.%ghana%"
        )
        .order("id", { ascending: false })
        .limit(12);

      if (error) {
        console.error(error);
      }

      if (data && data.length > 0) {
        setPosts(data);
      } else {
        setPosts(getDemoSports());
      }
    } catch (err) {
      console.error(err);
      setPosts(getDemoSports());
    }

    setLoading(false);
  }

  const getDemoSports = () => [
    {
      id: 1,
      title: "Black Stars Begin Training Ahead of AFCON Qualifiers",
      content:
        "Ghana’s national team has begun preparations with key players arriving in camp.",
      image_url:
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Asante Kotoko Edge Hearts in Super Clash",
      content:
        "Kotoko secured a dramatic late winner in Kumasi during the Ghana Premier League showdown.",
      image_url:
        "https://images.unsplash.com/photo-1518604666860-9ed391f76460?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Mohammed Kudus Linked With Major EPL Move",
      content:
        "The Ghanaian midfielder continues attracting attention from Europe’s top clubs.",
      image_url:
        "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop",
    },
  ];

  const openArticle = (post) => {
    const slug = post.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");

    navigate(`/article/${slug}`, {
      state: {
        article: {
          title: post.title,
          description: post.content,
          image: post.image_url,
          content: post.content,
          url: post.url,
          source: {
            name: "DanoNews",
          },
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="loader">
        Loading Sports News...
      </div>
    );
  }

  const hero = posts[0];
  const latest = posts.slice(1);

  return (
    <div className="container">

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
        SPORTS LIVE • Black Stars • Premier League • Transfers
      </div>

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
                  backgroundImage: `url(${hero.image_url})`,
                  height: "500px",
                }}
              />

              <div className="hero-overlay">
                <span className="badge red">SPORTS</span>
                <h1>{hero.title}</h1>

                <p
                  style={{
                    marginTop: "15px",
                    color: "#eee",
                    fontSize: "16px",
                    maxWidth: "700px",
                  }}
                >
                  {hero.content}
                </p>
              </div>
            </div>
          )}

          <div className="section">
            <div className="section-header">
              <h2>Latest Sports News</h2>
            </div>

            <div className="featured-grid">
              {latest.map((post) => (
                <div
                  key={post.id}
                  className="card"
                  onClick={() => openArticle(post)}
                >
                  <div
                    className="card-image"
                    style={{
                      backgroundImage: `url(${post.image_url})`,
                    }}
                  />

                  <div className="card-content">
                    <h3>{post.title}</h3>

                    <p
                      style={{
                        marginTop: "10px",
                        color: "#666",
                        lineHeight: "1.6",
                      }}
                    >
                      {post.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="sidebar">

          <div className="sidebar-widget">
            <h3>Trending Sports</h3>

            {posts.map((post, i) => (
              <div
                key={i}
                className="trending-item"
                onClick={() => openArticle(post)}
              >
                <div className="trend-number">{i + 1}</div>

                <div>{post.title}</div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}