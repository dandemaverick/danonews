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
          "title.ilike.%sport%,title.ilike.%football%,title.ilike.%black stars%,title.ilike.%premier league%,title.ilike.%ghana%"
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
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
          fontWeight: "bold",
        }}
      >
        Loading Sports News...
      </div>
    );
  }

  const hero = posts[0];
  const latest = posts.slice(1);

  return (
    <div style={{ background: "#f3f4f6", minHeight: "100vh" }}>

      {/* TOP BAR */}
      <div
        style={{
          background: "#dc2626",
          color: "white",
          padding: "14px",
          textAlign: "center",
          fontWeight: "bold",
          letterSpacing: "0.5px",
        }}
      >
        SPORTS LIVE • Black Stars • Premier League • Transfers
      </div>

      {/* MAIN CONTAINER */}
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >

        {/* HERO */}
        {hero && (
          <div
            onClick={() => openArticle(hero)}
            style={{
              position: "relative",
              borderRadius: "24px",
              overflow: "hidden",
              cursor: "pointer",
              marginBottom: "50px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            }}
          >
            <img
              src={hero.image_url}
              alt={hero.title}
              style={{
                width: "100%",
                height: "520px",
                objectFit: "cover",
                display: "block",
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.1))",
                display: "flex",
                alignItems: "flex-end",
              }}
            >
              <div style={{ padding: "40px" }}>
                <span
                  style={{
                    background: "#dc2626",
                    color: "white",
                    padding: "8px 18px",
                    borderRadius: "50px",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  SPORTS
                </span>

                <h1
                  style={{
                    color: "white",
                    fontSize: "48px",
                    marginTop: "20px",
                    lineHeight: "1.2",
                    maxWidth: "850px",
                    fontWeight: "800",
                  }}
                >
                  {hero.title}
                </h1>

                <p
                  style={{
                    color: "#e5e7eb",
                    marginTop: "18px",
                    fontSize: "18px",
                    maxWidth: "700px",
                  }}
                >
                  {hero.content}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TITLE */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "38px",
              background: "#dc2626",
              borderRadius: "10px",
              marginRight: "14px",
            }}
          ></div>

          <h2
            style={{
              fontSize: "36px",
              fontWeight: "800",
              color: "#111827",
            }}
          >
            Latest Sports News
          </h2>
        </div>

        {/* GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "30px",
          }}
        >
          {latest.map((post) => (
            <div
              key={post.id}
              onClick={() => openArticle(post)}
              style={{
                background: "white",
                borderRadius: "22px",
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                transition: "0.3s",
              }}
            >
              <img
                src={post.image_url}
                alt={post.title}
                style={{
                  width: "100%",
                  height: "240px",
                  objectFit: "cover",
                }}
              />

              <div style={{ padding: "24px" }}>
                <h3
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    lineHeight: "1.4",
                    color: "#111827",
                    marginBottom: "14px",
                  }}
                >
                  {post.title}
                </h3>

                <p
                  style={{
                    color: "#6b7280",
                    lineHeight: "1.7",
                    fontSize: "16px",
                  }}
                >
                  {post.content}
                </p>

                <div
                  style={{
                    marginTop: "20px",
                    color: "#dc2626",
                    fontWeight: "bold",
                  }}
                >
                  Read More →
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}