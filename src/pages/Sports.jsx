import { useEffect, useState } from 'react';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Widgets from '../components/Widgets';
import { supabase } from '../services/supabase';

export default function Sports() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    loadSports();
  }, []);

  async function loadSports() {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .or('title.ilike.%sport%,title.ilike.%football%,title.ilike.%match%,title.ilike.%black stars%')
      .order('id', { ascending: false });

    if (data && data.length > 0) {
      setPosts(data);
    } else {
      const { data: fallback } = await supabase
        .from('posts')
        .select('*')
        .order('id', { ascending: false })
        .limit(8);

      if (fallback) setPosts(fallback);
    }
  }

  const hero = posts[0];
  const stories = posts.slice(1);

  return (
    <div className="site-shell">
      <Header />
      <NavBar />

      <div className="breaking-bar ticker-shadow">
        <span>SPORTS LIVE</span>
        <marquee>
          Black Stars updates • Premier League headlines • Transfer rumours • Matchday reports
        </marquee>
      </div>

      <main className="homepage-grid">
        <section className="lead-grid">
          {hero && (
            <article className="hero-card">
              <img
                src={hero.image_url || 'https://picsum.photos/900/520?sports'}
                alt=""
              />
              <div className="overlay">
                <h1>{hero.title}</h1>
                <p>{hero.content}</p>
              </div>
            </article>
          )}

          <div className="stack-cards">
            {stories.slice(0, 2).map((post) => (
              <article className="mini-card" key={post.id}>
                <img
                  src={post.image_url || 'https://picsum.photos/420/250?football'}
                  alt=""
                />
                <h3>{post.title}</h3>
              </article>
            ))}
          </div>
        </section>

        <aside>
          <Widgets />
        </aside>
      </main>

      <section className="news-strip">
        <h2>Latest Sports</h2>

        <div className="card-row">
          {stories.map((post) => (
            <article className="news-card" key={post.id}>
              <img
                src={post.image_url || 'https://picsum.photos/400/220?stadium'}
                alt=""
              />
              <h3>{post.title}</h3>
              <p>{post.content?.slice(0, 80)}...</p>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}