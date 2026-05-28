import { Link, useLocation } from "react-router-dom";

export default function NavBar() {
  const location = useLocation();

  const navItems = [
    { name: "NEWS", path: "/" },
    { name: "POLITICS", path: "/politics" },
    { name: "BUSINESS", path: "/business" },
    { name: "SPORTS", path: "/sports" },
    { name: "ENTERTAINMENT", path: "/entertainment" },
    { name: "LIFESTYLE", path: "/lifestyle" },
    { name: "WORLD", path: "/world" },
    { name: "OPINION", path: "/opinion" },
    { name: "VIDEOS", path: "/videos" },
  ];

  return (
    <nav className="bg-[#071a52] text-white sticky top-0 z-50 shadow-md border-b border-white/10">

      <div className="max-w-7xl mx-auto px-4">

        <div className="flex items-center justify-between h-[58px]">

          {/* LEFT SIDE */}
          <div className="flex items-center overflow-x-auto scrollbar-hide">

            {navItems.map((item) => (

              <Link
                key={item.name}
                to={item.path}
                className={`relative px-4 lg:px-5 py-5 text-[13px] lg:text-sm font-semibold tracking-wide transition-all duration-300 whitespace-nowrap hover:text-red-400 ${
                  location.pathname === item.path
                    ? "text-white"
                    : "text-white/90"
                }`}
              >

                {item.name}

                {location.pathname === item.path && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-red-600 rounded-full"></span>
                )}

              </Link>

            ))}

          </div>

          {/* RIGHT SIDE */}
          <div className="hidden md:flex items-center gap-2">

            <Link
              to="/bookmarks"
              className="px-4 py-2 rounded-full text-sm font-medium bg-white/5 hover:bg-white/10 transition"
            >
              🔖 Bookmarks
            </Link>

            <Link
              to="/profile"
              className="px-4 py-2 rounded-full text-sm font-medium bg-red-600 hover:bg-red-700 transition"
            >
              👤 Account
            </Link>

          </div>

        </div>

      </div>

    </nav>
  );
}