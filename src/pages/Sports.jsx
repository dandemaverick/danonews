import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function Sports() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadSports();
  }, []);

  async function loadSports() {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .or(
          "title.ilike.%sport%,title.ilike.%football%,title.ilike.%black stars%,title.ilike.%premier league%,title.ilike.%ghana%"
        )
        .order("id", { ascending: false })
        .limit(12);

      if (error) {
        console.error(error);
      }

      if (data && data.length > 0) {
        setPosts(data);
      } else {
        setPosts(getDemoSports());
      }
    } catch (err) {
      console.error(err);
      setPosts(getDemoSports());
    }

    setLoading(false);
  }

  const getDemoSports = () => [
    {
      id: 1,
      title: "Black Stars Begin Training Ahead of AFCON Qualifiers",
      content:
        "Ghana’s national team has begun preparations with key players arriving in camp.",
      image_url:
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Asante Kotoko Edge Hearts in Super Clash",
      content:
        "Kotoko secured a dramatic late winner in Kumasi during the Ghana Premier League showdown.",
      image_url:
        "https://images.unsplash.com/photo-1518604666860-9ed391f76460?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Mohammed Kudus Linked With Major EPL Move",
      content:
        "The Ghanaian midfielder continues attracting attention from Europe’s top clubs.",
      image_url:
        "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop",
    },
  ];

  const openArticle = (post) => {
    const slug = post.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");

    navigate(`/article/${slug}`, {
      state: {
        article: {
          title: post.title,
          description: post.content,
          image: post.image_url,
          content: post.content,
          url: post.url,
          source: {
            name: "DanoNews",
          },
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-semibold">
        Loading Sports News...
      </div>
    );
  }

  const hero = posts[0];
  const latest = posts.slice(1);

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* TOP STRIP */}
      <div className="bg-red-600 text-white py-3 text-center font-semibold tracking-wide">
        SPORTS LIVE • Black Stars • Premier League • Transfers
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 w-full">

        {/* HERO SECTION */}
        {hero && (
          <div
            onClick={() => openArticle(hero)}
            className="relative rounded-3xl overflow-hidden cursor-pointer mb-14 shadow-xl mx-auto max-w-6xl"
          >
            <img
              src={
                hero.image_url ||
                "https://picsum.photos/1200/600?sports"
              }
              alt={hero.title}
              className="w-full h-[500px] object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end">
              <div className="p-10">
                <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                  SPORTS
                </span>

                <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-5 max-w-4xl leading-tight">
                  {hero.title}
                </h1>

                <p className="text-gray-200 mt-4 max-w-2xl text-lg">
                  {hero.content?.slice(0, 140)}...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION TITLE */}
        <div className="flex items-center mb-8 max-w-6xl mx-auto">
          <div className="w-2 h-10 bg-red-600 mr-4 rounded-full"></div>

          <h2 className="text-3xl font-bold text-gray-900">
            Latest Sports News
          </h2>
        </div>

        {/* NEWS GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {latest.map((post) => (
            <div
              key={post.id}
              onClick={() => openArticle(post)}
              className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 cursor-pointer group"
            >
              <div className="overflow-hidden">
                <img
                  src={
                    post.image_url ||
                    "https://picsum.photos/600/400?football"
                  }
                  alt={post.title}
                  className="w-full h-60 object-cover group-hover:scale-110 transition duration-500"
                />
              </div>

              <div className="p-6">
                <h3 className="font-bold text-xl leading-tight group-hover:text-red-600 transition">
                  {post.title}
                </h3>

                <p className="text-gray-600 mt-4 line-clamp-3">
                  {post.content}
                </p>

                <button className="mt-5 text-red-600 font-semibold">
                  Read More →
                </button>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}