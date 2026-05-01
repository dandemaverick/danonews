import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import AdSense from "../components/AdSense";
import Widgets from "../components/Widgets";
import { supabase } from "../services/supabase";
import "../styles/Home.css";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [apiNews, setApiNews] = useState([]);

  useEffect(() => {
    loadPosts();
    fetchNews();
  }, []);

  /* 🔵 FETCH FROM YOUR BACKEND (FIXED) */
  async function fetchNews() {
    try {
      const res = await fetch("http://localhost:5000/api/news");
      const data = await res.json();
      setApiNews(data.articles || []);
    } catch (err) {
      console.error("Backend error:", err);
    }
  }

  /* 🟢 LOAD SUPABASE */
  async function loadPosts() {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("id", { ascending: false })
      .limit(20);

    if (data) setPosts(data);
  }

  /* 🔥 MERGE DATA */
  const merged = [
    ...apiNews.map((a, i) => ({
      id: `api-${i}`,
      title: a.title,
      body: a.description,
      image: a.urlToImage,
      url: a.url,
      source: a.source?.name,
      isAPI: true
    })),
    ...posts
  ];

  const hero = merged.length > 0 ? merged[0] : {};
  const side = merged.slice(1, 3);
  const trending = merged.slice(0, 5);
  const grid = merged.slice(3, 11);

  /* 🧠 SAFE IMAGE */
  const safeImg = (img) =>
    img || "https://via.placeholder.com/600x400";

  return (
    <>
      <Helmet>
        <title>DanoNews - Premium News Platform</title>
      </Helmet>

      <Header />
      <NavBar />

      <div className="homepage">

        {/* HERO */}
        <div className="top-layout">

          {/* MAIN HERO */}
          <Link
            to={`/article/${hero.id}`}
            state={{ article: hero.isAPI ? hero : null }}
            onClick={() =>
              hero.isAPI &&
              localStorage.setItem("currentArticle", JSON.stringify(hero))
            }
          >
            <div
              className="hero-main"
              style={{
                backgroundImage: `url(${safeImg(hero.image)})`
              }}
            >
              <div className="overlay">
                <span className="badge">TOP STORY</span>
                <h1>{hero.title || "No title available"}</h1>
                <p>{hero.body ? hero.body.slice(0, 120) : ""}</p>
              </div>
            </div>
          </Link>

          {/* SIDE */}
          <div className="hero-middle">
            {side.map((item) => (
              <Link
                key={item.id}
                to={`/article/${item.id}`}
                state={{ article: item.isAPI ? item : null }}
                onClick={() =>
                  item.isAPI &&
                  localStorage.setItem("currentArticle", JSON.stringify(item))
                }
              >
                <div
                  className="mini-card"
                  style={{
                    backgroundImage: `url(${safeImg(item.image)})`
                  }}
                >
                  <div className="overlay">
                    <h3>{item.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* SIDEBAR */}
          <div className="right-sidebar">

            <div className="widget-box">
              <h3>Trending</h3>

              {trending.map((item, i) => (
                <Link
                  key={item.id}
                  to={`/article/${item.id}`}
                  state={{ article: item.isAPI ? item : null }}
                  className="trend-item"
                >
                  <span>{i + 1}</span>
                  {item.title}
                </Link>
              ))}
            </div>

            <div className="widget-box">
              <AdSense slot="2222222222" />
            </div>

            <Widgets />
          </div>
        </div>

        {/* GRID */}
        <section className="section-block">
          <h2>Latest News</h2>

          <div className="four-grid">
            {grid.map((item) => (
              <Link
                key={item.id}
                to={`/article/${item.id}`}
                state={{ article: item.isAPI ? item : null }}
                className="news-box"
                onClick={() =>
                  item.isAPI &&
                  localStorage.setItem("currentArticle", JSON.stringify(item))
                }
              >
                <img
                  src={safeImg(item.image)}
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/300")
                  }
                />
                <small>{item.source || item.cat}</small>
                <h4>{item.title}</h4>
              </Link>
            ))}
          </div>
        </section>

        {/* AD */}
        <div style={{ margin: "40px 0" }}>
          <AdSense slot="3333333333" />
        </div>

      </div>

      <Footer />
    </>
  );
}