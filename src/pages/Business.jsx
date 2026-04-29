import { useEffect, useState } from "react";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Widgets from "../components/Widgets";
import { supabase } from "../services/supabase";

export default function Business() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    loadBusiness();
  }, []);

  async function loadBusiness() {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .or(
        "title.ilike.%business%,title.ilike.%economy%,title.ilike.%market%,title.ilike.%bank%,title.ilike.%finance%,title.ilike.%trade%"
      )
      .order("id", { ascending: false })
      .limit(12);

    if (data) setPosts(data);
  }

  const hero = posts[0];
  const others = posts.slice(1);

  return (
    <div className="site-shell">
      <Header />
      <NavBar />

      <div className="breaking-bar">
        <span>BUSINESS LIVE</span>
        <marquee>
          Cedi exchange updates • Fuel prices • Stock market moves • Bank rates • Corporate headlines
        </marquee>
      </div>

      <main className="homepage-grid">
        <section className="main-content">
          {hero && (
            <article className="hero-card">
              <img
                src={hero.image_url || "https://picsum.photos/900/500?business"}
                alt=""
              />
              <div className="overlay">
                <h1>{hero.title}</h1>
                <p>{hero.content}</p>
              </div>
            </article>
          )}

          <div className="card-row">
            {others.map((post) => (
              <article className="news-card" key={post.id}>
                <img
                  src={
                    post.image_url ||
                    "https://picsum.photos/400/220?finance"
                  }
                  alt=""
                />
                <h3>{post.title}</h3>
                <p>{post.content?.slice(0, 90)}...</p>
              </article>
            ))}
          </div>
        </section>

        <aside>
          <Widgets />
        </aside>
      </main>

      <Footer />
    </div>
  );
}