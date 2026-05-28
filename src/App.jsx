import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Article from "./pages/Article";

import Politics from "./pages/Politics";
import Sports from "./pages/Sports";
import Business from "./pages/Business";
import Entertainment from "./pages/Entertainment";
import World from "./pages/World";
import Videos from "./pages/Videos";

import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Careers from "./pages/Careers";
import Advertise from "./pages/Advertise";

import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";

import Profile from "./pages/Profile";
import Bookmarks from "./pages/Bookmarks";

import NotFound from "./pages/NotFound";

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>

      {/* GLOBAL HEADER */}
      <Header />

      {/* MAIN ROUTES */}
      <Routes>

        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* ARTICLE */}
        <Route path="/article/:slug" element={<Article />} />

        {/* CATEGORIES */}
        <Route path="/politics" element={<Politics />} />
        <Route path="/sports" element={<Sports />} />
        <Route path="/business" element={<Business />} />
        <Route path="/entertainment" element={<Entertainment />} />
        <Route path="/world" element={<World />} />
        <Route path="/videos" element={<Videos />} />

        {/* STATIC PAGES */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/advertise" element={<Advertise />} />

        {/* USER PAGES */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/bookmarks" element={<Bookmarks />} />

        {/* ADMIN */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>

      {/* GLOBAL FOOTER */}
      <Footer />

    </BrowserRouter>
  );
}