import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import AdSense from "../components/AdSense";
import { supabase } from "../supabase";

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
  const side1 = posts[1];
  const side2 = posts[2];
  const latest = posts.slice(3, 7);

  return (
    <>
      <Helmet>
        <title>DanoNews - Breaking News From Ghana & The World</title>
        <meta
          name="description"
          content="Latest breaking news from Ghana, Africa and the world."
        />
      </Helmet>

      <Header />
      <NavBar />

      {/* TOP ADS */}
      <div style={{ maxWidth: "1400px", margin: "15px auto", padding: "0 20px" }}>
        <AdSense slot="1111111111" />
      </div>

      {/* BREAKING BAR */}
      <div className="ticker">
        <div className="ticker-title">BREAKING NEWS</div>
        <marquee>
          {posts.map((item) => item.title).join(" • ")}
        </marquee>
      </div>

      <div className="container homepage">

        {/* HERO SECTION */}
        <div className="top-layout">

          {/* MAIN HERO */}
          <div className="hero-left">
            {hero && (
              <Link to={`/article/${hero.id}`} className="hero-link">
                <div
                  className="hero-main"
                  style={{
                    backgroundImage: `url(${hero.image})`
                  }}
                >
                  <div className="overlay">

                    {hero.sponsored && (
                      <span className="gold-badge">
                        PAID PROMOTION
                      </span>
                    )}

                    <span className="badge red">
                      TOP STORY
                    </span>

                    <h1>{hero.title}</h1>

                    <p>{hero.body?.slice(0, 130)}...</p>
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* SIDE STORIES */}
          <div className="hero-middle">

            {side1 && (
              <Link to={`/article/${side1.id}`} className="mini-link">
                <div
                  className="mini-card"
                  style={{
                    backgroundImage: `url(${side1.image})`
                  }}
                >
                  <div className="overlay">

                    {side1.sponsored && (
                      <span className="gold-badge-small">
                        SPONSORED
                      </span>
                    )}

                    <span className="badge blue">
                      {side1.cat}
                    </span>

                    <h3>{side1.title}</h3>
                  </div>
                </div>
              </Link>
            )}

            {side2 && (
              <Link to={`/article/${side2.id}`} className="mini-link">
                <div
                  className="mini-card"
                  style={{
                    backgroundImage: `url(${side2.image})`
                  }}
                >
                  <div className="overlay">

                    {side2.sponsored && (
                      <span className="gold-badge-small">
                        SPONSORED
                      </span>
                    )}

                    <span className="badge green">
                      {side2.cat}
                    </span>

                    <h3>{side2.title}</h3>
                  </div>
                </div>
              </Link>
            )}

          </div>

          {/* RIGHT SIDEBAR */}
          <div className="right-sidebar">

            <div className="widget-box">
              <h3>Trending Now</h3>

              {posts.slice(0, 5).map((item, index) => (
                <Link
                  key={item.id}
                  to={`/article/${item.id}`}
                  className="trend-item"
                >
                  <span>{index + 1}</span>
                  {item.title}
                </Link>
              ))}
            </div>

            <div className="widget-box">
              <AdSense slot="2222222222" />
            </div>

            <div className="widget-box">
              <h3>Stay Connected</h3>
              <p>Facebook</p>
              <p>Instagram</p>
              <p>X</p>
              <p>YouTube</p>
            </div>

          </div>
        </div>

        {/* LATEST NEWS */}
        <section className="section-block">
          <div className="section-head">
            <h2>Latest News</h2>
          </div>

          <div className="four-grid">
            {latest.map((item) => (
              <Link
                key={item.id}
                to={`/article/${item.id}`}
                className="news-box"
              >
                <img src={item.image} alt="" />

                {item.sponsored && (
                  <span className="gold-inline">
                    SPONSORED
                  </span>
                )}

                <small>{item.cat}</small>

                <h4>{item.title}</h4>
              </Link>
            ))}
          </div>
        </section>

        {/* INLINE ADS */}
        <div style={{ margin: "30px 0" }}>
          <AdSense slot="3333333333" />
        </div>

      </div>

      <Footer />
    </>
  );
}