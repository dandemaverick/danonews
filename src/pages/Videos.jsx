import { useState } from "react";
import "./videos.css";

export default function Videos() {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const videos = [
    {
      id: 1,
      title: "Mahama Unveils 24-Hour Economy Policy",
      thumb: "https://picsum.photos/800/500?news1",
      embed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      category: "Politics",
    },

    {
      id: 2,
      title: "Black Stars Training Session Ahead Of AFCON",
      thumb: "https://picsum.photos/800/500?sports",
      embed: "https://www.youtube.com/embed/ysz5S6PUM-U",
      category: "Sports",
    },

    {
      id: 3,
      title: "Cedi Exchange Rate Update And Market Analysis",
      thumb: "https://picsum.photos/800/500?economy",
      embed: "https://www.youtube.com/embed/tgbNymZ7vqY",
      category: "Business",
    },

    {
      id: 4,
      title: "Entertainment Stars Shine At Ghana Music Awards",
      thumb: "https://picsum.photos/800/500?music",
      embed: "https://www.youtube.com/embed/kXYiU_JCYtU",
      category: "Entertainment",
    },

    {
      id: 5,
      title: "Flood Situation Hits Parts Of Accra",
      thumb: "https://picsum.photos/800/500?flood",
      embed: "https://www.youtube.com/embed/oHg5SJYRHA0",
      category: "News",
    },

    {
      id: 6,
      title: "Technology And AI Changing African Journalism",
      thumb: "https://picsum.photos/800/500?tech",
      embed: "https://www.youtube.com/embed/ScMzIvxBSi4",
      category: "Technology",
    },
  ];

  return (
    <div className="videos-page">

      {/* LIVE BAR */}
      <div className="videos-banner">
        <div className="videos-banner-content">
          <span className="live-dot"></span>
          DANONEWS TV • LIVE REPORTS • BREAKING NEWS • EXCLUSIVE INTERVIEWS
        </div>
      </div>

      {/* PAGE HEADER */}
      <div className="videos-header">
        <h1>DanoNews Videos</h1>

        <p>
          Watch breaking news, politics, sports,
          entertainment and exclusive reports
          from Ghana and beyond.
        </p>
      </div>

      {/* FEATURED VIDEO */}
      {selectedVideo && (
        <div className="featured-video-section">

          <div className="featured-video-container">
            <iframe
              src={selectedVideo.embed}
              title={selectedVideo.title}
              allowFullScreen
            ></iframe>

            <h2>{selectedVideo.title}</h2>
          </div>

        </div>
      )}

      {/* VIDEO GRID */}
      <div className="videos-container">

        <div className="videos-grid">

          {videos.map((video) => (
            <div
              key={video.id}
              className="video-card"
              onClick={() => setSelectedVideo(video)}
            >

              <div className="video-thumbnail">

                <img
                  src={video.thumb}
                  alt={video.title}
                />

                <div className="play-button">
                  ▶
                </div>

                <div className="video-category">
                  {video.category}
                </div>

              </div>

              <div className="video-content">

                <h3>{video.title}</h3>

                <p>
                  Watch full coverage on DanoNews TV.
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}