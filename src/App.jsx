import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Products from "./components/Products";
import ProjectsSection from "./components/Projects";
import WhyChooseUs from "./components/WhyChooseUs";
import Workflow from "./components/Workflow";
import NewsSection from "./components/News";
import Footer from "./components/Footer";

// Pages
import About from "./pages/About";
import Services from "./pages/Services";
import ProjectsPage from "./pages/Projects";
import Pricing from "./pages/Pricing";
import NewsPage from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Contact from "./pages/Contact";

// Helper component to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

import TechMeshes from "./components/TechMeshes";

// Landing / Home page view
function HomePage() {
  return (
    <div className="home-page-wrapper">
      <Hero />
      <div className="tech-mesh-section-wrapper">
        <TechMeshes />
        <Products />
        <ProjectsSection />
      </div>
      <WhyChooseUs />
      <NewsSection />
    </div>
  );
}

import ProductsPage from "./pages/ProductsPage";
import ProductDetail from "./pages/ProductDetail";

import Admin from "./pages/Admin";

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gioi-thieu" element={<About />} />
        <Route path="/san-pham" element={<ProductsPage />} />
        <Route path="/san-pham/:id" element={<ProductDetail />} />
        <Route path="/dich-vu" element={<Services />} />
        <Route path="/du-an" element={<ProjectsPage />} />
        <Route path="/bao-gia" element={<Pricing />} />
        <Route path="/tin-tuc" element={<NewsPage />} />
        <Route path="/tin-tuc/:id" element={<NewsDetail />} />
        <Route path="/lien-he" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      {!isAdmin && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

