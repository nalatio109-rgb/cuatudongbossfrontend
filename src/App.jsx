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
import CompanyProfile from "./pages/CompanyProfile";
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

// ErrorBoundary with automatic route reset and developer diagnostics
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

  componentDidUpdate(prevProps) {
    // Tự động giải phóng trạng thái lỗi khi người dùng bấm chuyển sang trang khác
    if (this.state.hasError && this.props.location?.pathname !== prevProps.location?.pathname) {
      this.setState({ hasError: false, error: null });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "80px 20px", textAlign: "center", minHeight: "55vh", maxWidth: "620px", margin: "0 auto" }}>
          <div style={{
            width: "56px",
            height: "56px",
            background: "rgba(234, 179, 8, 0.15)",
            color: "#d97706",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px auto",
            fontSize: "26px"
          }}>
            ⚠️
          </div>
          <h2 style={{ color: "#004d32", marginBottom: "12px", fontSize: "22px", fontWeight: "850" }}>
            Không thể hiển thị nội dung này
          </h2>
          <p style={{ color: "#64748b", marginBottom: "26px", lineHeight: "1.6", fontSize: "14.5px" }}>
            Hệ thống ghi nhận sự cố hiển thị tạm thời trên trang này. Quý khách vui lòng bấm thử lại hoặc quay về Trang chủ.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={this.handleReset}
              style={{
                padding: "11px 24px",
                background: "#004d32",
                color: "#ffffff",
                border: "none",
                borderRadius: "30px",
                fontWeight: "750",
                fontSize: "14px",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(0, 77, 50, 0.3)"
              }}
            >
              Thử tải lại nội dung
            </button>
            <a
              href="/"
              style={{
                padding: "11px 24px",
                background: "#f1f5f9",
                color: "#334155",
                borderRadius: "30px",
                textDecoration: "none",
                fontWeight: "750",
                fontSize: "14px",
                border: "1px solid #cbd5e1"
              }}
            >
              Về Trang chủ
            </a>
          </div>

          {import.meta.env.DEV && this.state.error && (
            <details style={{ marginTop: "24px", textAlign: "left", background: "#fef2f2", border: "1px solid #fecaca", padding: "14px", borderRadius: "10px", fontSize: "12px", color: "#991b1b" }}>
              <summary style={{ cursor: "pointer", fontWeight: "bold" }}>Chi tiết lỗi phát triển (Dev Diagnostics):</summary>
              <pre style={{ whiteSpace: "pre-wrap", marginTop: "10px", overflowX: "auto" }}>
                {this.state.error.toString()}
                {"\n"}
                {this.state.error.stack}
              </pre>
            </details>
          )}
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
      <ErrorBoundary key={location.pathname} location={location}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gioi-thieu" element={<About />} />
          <Route path="/ho-so-nang-luc" element={<CompanyProfile />} />
          <Route path="/profile" element={<Navigate to="/ho-so-nang-luc" replace />} />
          <Route path="/company-profile" element={<Navigate to="/ho-so-nang-luc" replace />} />
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
