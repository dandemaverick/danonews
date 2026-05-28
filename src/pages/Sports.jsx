import { useEffect, useState } from 'react';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { supabase } from '../services/supabase';

export default function Sports() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSports();
  }, []);

  async function loadSports() {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .or('title.ilike.%sport%,title.ilike.%football%,title.ilike.%black stars%,title.ilike.%match%')
      .order('id', { ascending: false })
      .limit(12);

    if (data) setPosts(data);
    setLoading(false);
  }

  if (loading) return <div className="text-center py-20">Loading Sports News...</div>;

  const hero = posts[0];
  const latest = posts.slice(1);

  return (
    <div>
      <Header />
      <NavBar />

      <div className="bg-red-600 text-white py-3 text-center font-medium">
        SPORTS LIVE • Black Stars • Premier League • Transfers
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {hero && (
          <div className="mb-12 relative rounded-3xl overflow-hidden">
            <img 
              src={hero.image_url || "https://picsum.photos/1200/600?sports"} 
              alt={hero.title}
              className="w-full h-[460px] object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 p-10">
              <span className="bg-white text-red-600 px-4 py-1 text-sm font-bold">SPORTS</span>
              <h1 className="text-4xl font-bold text-white mt-4">{hero.title}</h1>
            </div>
          </div>
        )}

        <h2 className="text-3xl font-bold mb-8 border-l-4 border-red-600 pl-4">Latest Sports News</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latest.map((post) => (
            <div 
              key={post.id} 
              className="group cursor-pointer"
              onClick={() => window.location.href = `/article/${post.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <img 
                src={post.image_url || "https://picsum.photos/600/380?football"} 
                alt="" 
                className="w-full h-56 object-cover rounded-2xl mb-4 group-hover:scale-105 transition"
              />
              <h3 className="font-semibold text-xl leading-tight group-hover:text-red-600">
                {post.title}
              </h3>
              <p className="text-gray-600 mt-3 line-clamp-3">{post.content}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}