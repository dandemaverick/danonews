import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function World() {

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadWorld();
  }, []);

  async function loadWorld() {

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("id", { ascending: false })
      .limit(12);

    if (error) {
      console.log(error);
    }

    if (data) {
      setPosts(data);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="text-center py-24 text-xl font-semibold text-gray-600">
        Loading World News...
      </div>
    );
  }

  const hero = posts.length > 0 ? posts[0] : null;
  const latest = posts.length > 1 ? posts.slice(1) : [];

  return (
    <div className="bg-[#f4f6f9] min-h-screen">

      {/* TOP BAR */}
      <div className="bg-red-600 text-white py-3 text-center font-semibold tracking-wide">
        WORLD LIVE • Africa • International • Global Affairs
      </div>

      {/* PAGE CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* HERO */}
        {hero && (

          <div
            className="mb-14 relative rounded-3xl overflow-hidden shadow-xl group cursor-pointer"
            onClick={() =>
              navigate(
                `/article/${hero.title.toLowerCase().replace(/\s+/g, "-")}`
              )
            }
          >

            <img
              src={hero.image_url || "https://picsum.photos/1200/600?world"}
              alt={hero.title}
              className="w-full h-[500px] object-cover group-hover:scale-105 transition duration-500"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

            <div className="absolute bottom-0 left-0 p-10">

              <span className="bg-red-600 text-white px-4 py-2 text-sm font-bold rounded-full">
                WORLD
              </span>

              <h1 className="text-5xl font-bold text-white mt-5 leading-tight max-w-4xl">
                {hero.title}
              </h1>

            </div>

          </div>

        )}

        {/* SECTION TITLE */}
        <div className="flex items-center mb-8">

          <div className="w-1 h-10 bg-red-600 mr-4 rounded-full"></div>

          <h2 className="text-4xl font-bold text-[#071a52]">
            Latest World News
          </h2>

        </div>

        {/* NEWS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

          {latest.map((post) => (

            <div
              key={post.id}
              className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 cursor-pointer group"
              onClick={() =>
                navigate(
                  `/article/${post.title.toLowerCase().replace(/\s+/g, "-")}`
                )
              }
            >

              <div className="overflow-hidden">

                <img
                  src={post.image_url || "https://picsum.photos/600/380?global"}
                  alt={post.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
                />

              </div>

              <div className="p-6">

                <span className="inline-block bg-[#071a52] text-white text-xs px-3 py-1 rounded-full mb-4">
                  WORLD
                </span>

                <h3 className="font-bold text-2xl leading-snug text-[#071a52] group-hover:text-red-600 transition">
                  {post.title}
                </h3>

                <p className="text-gray-600 mt-4 leading-7 line-clamp-3">
                  {post.content || "Read full international coverage on DanoNews."}
                </p>

              </div>

            </div>

          ))}

        </div>

        {/* EMPTY STATE */}
        {latest.length === 0 && !hero && (

          <div className="text-center py-24">

            <h3 className="text-3xl font-bold text-[#071a52] mb-4">
              No World News Available
            </h3>

            <p className="text-gray-600 text-lg">
              World news articles will appear here once published.
            </p>

          </div>

        )}

      </div>

    </div>
  );
}