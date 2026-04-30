import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

/* Pages */
import Home from "./pages/Home";
import Politics from "./pages/Politics";
import Sports from "./pages/Sports";
import Entertainment from "./pages/Entertainment";
import Business from "./pages/Business";
import World from "./pages/World";
import Videos from "./pages/Videos";
import Article from "./pages/Article";

import About from "./pages/About";
import Contact from "./pages/Contact";
import Advertise from "./pages/Advertise";
import Privacy from "./pages/Privacy";
import Careers from "./pages/Careers";

import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";

/* Layout Components (YOU MUST CREATE THESE FILES) */
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

/* Scroll to top on route change */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/* Protected Route */
function ProtectedRoute({ children }) {
  const loggedIn = localStorage.getItem("danoAdmin") === "yes";
  return loggedIn ? children : <Navigate to="/admin-login" replace />;
}

/* Layout Wrapper */
function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "80vh", padding: "1rem" }}>
        {children}
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/politics" element={<Layout><Politics /></Layout>} />
        <Route path="/sports" element={<Layout><Sports /></Layout>} />
        <Route path="/entertainment" element={<Layout><Entertainment /></Layout>} />
        <Route path="/business" element={<Layout><Business /></Layout>} />
        <Route path="/world" element={<Layout><World /></Layout>} />
        <Route path="/videos" element={<Layout><Videos /></Layout>} />
        <Route path="/article/:id" element={<Layout><Article /></Layout>} />

        {/* Static Pages */}
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/advertise" element={<Layout><Advertise /></Layout>} />
        <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
        <Route path="/careers" element={<Layout><Careers /></Layout>} />

        {/* Admin */}
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* 404 Page */}
        <Route path="*" element={<h1 style={{ textAlign: "center" }}>404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}