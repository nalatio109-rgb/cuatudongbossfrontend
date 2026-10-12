import React, { useEffect } from "react";
import "./App.css";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useAuth } from "./context/AuthContext";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import ProductsPage from "./pages/ProductsPage";
import ProductDetail from "./pages/ProductDetail";
import Projects from "./pages/Projects";
import Services from "./pages/Services";
import NewsPage from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Protected Route for Admin
function AdminRoute({ children }) {
  const { currentUser, isAdmin } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login?redirect=/admin" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isAuth = location.pathname.startsWith("/login") || location.pathname.startsWith("/register");
  const hideNavAndFooter = isAdmin || isAuth;

  useEffect(() => {
    if (hideNavAndFooter) {
      document.body.classList.add("no-navbar-pad");
    } else {
      document.body.classList.remove("no-navbar-pad");
    }
    return () => {
      document.body.classList.remove("no-navbar-pad");
    };
  }, [hideNavAndFooter]);

  return (
    <>
      <ScrollToTop />
      {!hideNavAndFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gioi-thieu" element={<About />} />
        <Route path="/san-pham" element={<ProductsPage />} />
        <Route path="/san-pham/:id" element={<ProductDetail />} />
        <Route path="/du-an" element={<Projects />} />
        <Route path="/dich-vu" element={<Services />} />
        <Route path="/tin-tuc" element={<NewsPage />} />
        <Route path="/tin-tuc/:id" element={<NewsDetail />} />
        <Route path="/lien-he" element={<Contact />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          } 
        />
      </Routes>
      {!hideNavAndFooter && <Footer />}
    </>
  );
}
