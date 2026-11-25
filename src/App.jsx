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
import Pricing from "./pages/Pricing";
import ProductPricing from "./pages/ProductPricing";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
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

// Protected Route for Admin - STRICTLY for admin@boss.vn
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an uncaught runtime error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "60px 20px", textAlign: "center", minHeight: "50vh", maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ color: "#004d32", marginBottom: "12px" }}>Không thể hiển thị nội dung này</h2>
          <p style={{ color: "#64748b", marginBottom: "24px", lineHeight: "1.6" }}>
            Hệ thống đã ghi nhận sự cố hiển thị. Quý khách vui lòng thử tải lại trang hoặc bấm quay lại danh mục bảng giá.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "10px 20px",
                background: "#004d32",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "700",
                cursor: "pointer"
              }}
            >
              Tải lại trang
            </button>
            <a
              href="/bang-gia"
              style={{
                padding: "10px 20px",
                background: "#f1f5f9",
                color: "#334155",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "700"
              }}
            >
              Xem tất cả bảng giá
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AdminRoute({ children }) {
  const { currentUser, isAdmin } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login?redirect=/admin" replace />;
  }

  // Phân quyền tuyệt đối: Chỉ có admin@boss.vn mới được phép truy cập
  if (!isAdmin || currentUser.email?.toLowerCase().trim() !== "admin@boss.vn") {
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
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gioi-thieu" element={<About />} />
          <Route path="/san-pham" element={<ProductsPage />} />
          <Route path="/san-pham/:id" element={<ProductDetail />} />
          <Route path="/bang-gia" element={<Pricing />} />
          <Route path="/bang-gia/:id" element={<ProductPricing />} />
          <Route path="/bao-gia/:id" element={<ProductPricing />} />
          <Route path="/bang-gia-cap-nhat-cua-keo-cong-nghe-duc-2026-tai-da-nang" element={<ProductPricing />} />
          <Route path="/bang-gia-cap-nhat-cua-keo-cong-nghe-duc-2026-tai-da-nang.html" element={<ProductPricing />} />
          <Route path="/dich-vu" element={<Services />} />
          <Route path="/dich-vu/:id" element={<ServiceDetail />} />
          <Route path="/cong-trinh" element={<Projects />} />
          <Route path="/cong-trinh/:id" element={<ProjectDetail />} />
          <Route path="/du-an" element={<Navigate to="/cong-trinh" replace />} />
          <Route path="/du-an/:id" element={<ProjectDetail />} />
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
          {/* Chuyển hướng các đường dẫn không tồn tại về trang chủ */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
      {!hideNavAndFooter && <Footer />}
    </>
  );
}
