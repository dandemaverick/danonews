import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Breaking News Ticker */}
      <div className="breaking-news-ticker">
        <marquee behavior="scroll" direction="left">Breaking News: Major event happening now...</marquee>
      </div>
      
      {/* Hero Section */}
      <div className="hero-section">
        <h1>Hero Section Title</h1>
        <div className="hero-content">Hero content goes here.</div>
      </div>

      {/* Content Grids */}
      <div className="content-grids">
        {/* Side Stories */}
        <div className="side-stories section">
          <h2>Side Stories</h2>
          <div className="stories-content">Side stories content goes here.</div>
        </div>

        {/* Featured Section */}
        <div className="featured section">
          <h2>Featured</h2>
          <div className="featured-content">Featured content goes here.</div>
        </div>

        {/* Latest News Section */}
        <div className="latest-news section">
          <h2>Latest News</h2>
          <div className="latest-content">Latest news content goes here.</div>
        </div>
      </div>

      {/* Videos Section */}
      <div className="videos section">
        <h2>Videos</h2>
        <div className="videos-content">Videos content goes here.</div>
      </div>

      {/* Sports Section */}
      <div className="sports section">
        <h2>Sports</h2>
        <div className="sports-content">Sports content goes here.</div>
      </div>

      {/* Entertainment Section */}
      <div className="entertainment section">
        <h2>Entertainment</h2>
        <div className="entertainment-content">Entertainment content goes here.</div>
      </div>

      {/* Politics Section */}
      <div className="politics section">
        <h2>Politics</h2>
        <div className="politics-content">Politics content goes here.</div>
      </div>

      {/* World News Section */}
      <div className="world-news section">
        <h2>World News</h2>
        <div className="world-content">World news content goes here.</div>
      </div>
    </div>
  );
};

export default Home;