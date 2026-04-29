export default function Widgets() {
  return (
    <div>

      <div className="widget-box">
        <h3>🔥 Trending</h3>
        <p>Fuel prices expected to drop this week</p>
        <p>Black Stars squad announced</p>
        <p>Cedi strengthens against dollar</p>
        <p>Parliament debates reforms</p>
      </div>

      <div className="widget-box">
        <h3>📺 Video News</h3>

        <div style={{
          background:"#071738",
          color:"#fff",
          padding:"40px 20px",
          textAlign:"center",
          borderRadius:"12px",
          marginTop:"10px"
        }}>
          ▶ Watch Live Updates
        </div>
      </div>

      <div className="widget-box">
        <h3>🌍 Follow Us</h3>
        <p>Facebook</p>
        <p>Instagram</p>
        <p>X</p>
        <p>YouTube</p>
      </div>

      <div className="widget-box">
        <h3>Sponsored</h3>

        <div style={{
          background:"#eef2f7",
          padding:"50px 20px",
          textAlign:"center",
          borderRadius:"12px"
        }}>
          300 x 250 Ad Space
        </div>
      </div>

    </div>
  );
}