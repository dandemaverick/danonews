import Header from "../components/Header";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Widgets from "../components/Widgets";

export default function Videos() {
  const videos = [
    {
      id: 1,
      title: "Breaking News Bulletin",
      thumb: "https://picsum.photos/600/340?video1",
      embed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
      id: 2,
      title: "Sports Highlights Today",
      thumb: "https://picsum.photos/600/340?video2",
      embed: "https://www.youtube.com/embed/ysz5S6PUM-U",
    },
    {
      id: 3,
      title: "Business Market Update",
      thumb: "https://picsum.photos/600/340?video3",
      embed: "https://www.youtube.com/embed/tgbNymZ7vqY",
    },
    {
      id: 4,
      title: "World Headlines Roundup",
      thumb: "https://picsum.photos/600/340?video4",
      embed: "https://www.youtube.com/embed/jNQXAC9IVRw",
    },
  ];

  return (
    <div className="site-shell">
      <Header />
      <NavBar />

      <div className="breaking-bar">
        <span>VIDEOS LIVE</span>
        <marquee>
          Watch latest reports • Interviews • Sports clips • World updates • Trending moments
        </marquee>
      </div>

      <main className="homepage-grid">
        <section className="main-content">
          <article className="hero-card">
            <iframe
              width="100%"
              height="520"
              src={videos[0].embed}
              title="featured video"
              frameBorder="0"
              allowFullScreen
            ></iframe>

            <div className="overlay">
              <h1>{videos[0].title}</h1>
              <p>Featured DanoNews video coverage.</p>
            </div>
          </article>

          <section className="news-strip">
            <h2>Latest Videos</h2>

            <div className="card-row">
              {videos.slice(1).map((video) => (
                <article className="news-card" key={video.id}>
                  <iframe
                    width="100%"
                    height="220"
                    src={video.embed}
                    title={video.title}
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>

                  <h3>{video.title}</h3>
                  <p>Watch now on DanoNews TV</p>
                </article>
              ))}
            </div>
          </section>
        </section>

        <aside>
          <Widgets />
        </aside>
      </main>

      <Footer />
    </div>
  );
}