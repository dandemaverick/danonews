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

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("id", { ascending: false })
      .limit(30);

    if (data) setPosts(data);
  }

  const hero = posts[0];
  const side = posts.slice(1, 3);

  return (
    <>
      <Helmet>
        <title>DanoNews - Premium News Platform</title>
      </Helmet>

      <Header />
      <NavBar />

      <div className="homepage">

        {/* HERO SECTION */}
        <div className="top-layout">

          {/* MAIN HERO */}
          <div>
            {hero && (
              <Link to={`/article/${hero.id}`}>
                <div
                  className="hero-main"
                  style={{ backgroundImage: `url(${hero.image})` }}
                >
                  <div className="overlay">
                    <span className="badge">TOP STORY</span>
                    <h1>{hero.title}</h1>
                    <p>{hero.body?.slice(0, 120)}...</p>
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* SIDE STORIES */}
          <div className="hero-middle">
            {side.map((item) => (
              <Link key={item.id} to={`/article/${item.id}`}>
                <div
                  className="mini-card"
                  style={{ backgroundImage: `url(${item.image})` }}
                >
                  <div className="overlay">
                    <small>{item.cat}</small>
                    <h3>{item.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="right-sidebar">

            <div className="widget-box">
              <h3>Trending Now</h3>

              {posts.slice(0, 5).map((item, i) => (
                <Link
                  key={item.id}
                  to={`/article/${item.id}`}
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

        {/* LATEST NEWS */}
        <section className="section-block">
          <h2>Latest News</h2>

          <div className="four-grid">
            {posts.slice(3, 11).map((item) => (
              <Link
                key={item.id}
                to={`/article/${item.id}`}
                className="news-box"
              >
                <img src={item.image} />
                <small>{item.cat}</small>
                <h4>{item.title}</h4>
              </Link>
            ))}
          </div>
        </section>
{/* CATEGORY SECTIONS */}

{/* SPORTS */}
<section className="category-block">
  <div className="section-head">
    <h2>Sports</h2>
  </div>

  <div className="category-grid">
    
    {/* FEATURE */}
    {posts
      .filter(p => p.cat === "sports")
      .slice(0, 1)
      .map(item => (
        <Link key={item.id} to={`/article/${item.id}`} className="category-feature">
          <img src={item.image} />
          <h3>{item.title}</h3>
        </Link>
      ))}

    {/* LIST */}
    <div className="category-list">
      {posts
        .filter(p => p.cat === "sports")
        .slice(1, 5)
        .map(item => (
          <Link key={item.id} to={`/article/${item.id}`} className="category-item">
            <img src={item.image} />
            <p>{item.title}</p>
          </Link>
        ))}
    </div>

  </div>
</section>


{/* POLITICS */}
<section className="category-block">
  <div className="section-head">
    <h2>Politics</h2>
  </div>

  <div className="category-grid">
    
    {posts
      .filter(p => p.cat === "politics")
      .slice(0, 1)
      .map(item => (
        <Link key={item.id} to={`/article/${item.id}`} className="category-feature">
          <img src={item.image} />
          <h3>{item.title}</h3>
        </Link>
      ))}

    <div className="category-list">
      {posts
        .filter(p => p.cat === "politics")
        .slice(1, 5)
        .map(item => (
          <Link key={item.id} to={`/article/${item.id}`} className="category-item">
            <img src={item.image} />
            <p>{item.title}</p>
          </Link>
        ))}
    </div>

  </div>
</section>
        {/* INLINE AD */}
        <div style={{ margin: "40px 0" }}>
          <AdSense slot="3333333333" />
        </div>

      </div>

      <Footer />
    </>
  );
}