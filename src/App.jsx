import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Politics from "./pages/Politics";
import Sports from "./pages/Sports";
import Entertainment from "./pages/Entertainment";
import Business from "./pages/Business";
import World from "./pages/World";
import Videos from "./pages/Videos";
import Article from "./pages/Article";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";

import About from "./pages/About";
import Contact from "./pages/Contact";
import Advertise from "./pages/Advertise";
import Privacy from "./pages/Privacy";
import Careers from "./pages/Careers";

function ProtectedRoute({ children }) {
  const loggedIn =
    localStorage.getItem("danoAdmin") === "yes";

  return loggedIn ? children : <AdminLogin />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/politics" element={<Politics />} />
        <Route path="/sports" element={<Sports />} />
        <Route path="/entertainment" element={<Entertainment />} />
        <Route path="/business" element={<Business />} />
        <Route path="/world" element={<World />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/article/:id" element={<Article />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/advertise" element={<Advertise />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/careers" element={<Careers />} />

        <Route path="/admin-login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}