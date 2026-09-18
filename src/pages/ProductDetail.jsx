import React, { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, Check, PhoneCall, ShieldCheck, CheckCircle2, Star, HeadphonesIcon 
} from "lucide-react";
import "./ProductDetail.css";

export default function ProductDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!product) {
    return (
      <div className="product-not-found">
        <div className="container text-center py-20">
          <h2>Không tìm thấy sản phẩm</h2>
          <p>Sản phẩm này có thể đã bị xóa hoặc đường dẫn không hợp lệ.</p>
          <button className="btn-back" onClick={() => navigate("/san-pham")}>
            <ArrowLeft size={16} /> QUAY LẠI DANH MỤC
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      {/* Breadcrumb / Top Bar */}
      <div className="detail-breadcrumb">
        <div className="container">
          <Link to="/" className="crumb-link">Trang chủ</Link>
          <span className="crumb-separator">/</span>
          <Link to="/san-pham" className="crumb-link">Sản phẩm</Link>
          <span className="crumb-separator">/</span>
          <span className="crumb-current">{product.title.replace(/\n/g, " ")}</span>
        </div>
      </div>

      <div className="container detail-main-content">
        <div className="detail-layout">
          {/* Left Column - Image */}
          <div className="detail-image-col">
            <div className="image-wrapper">
              <img src={product.image} alt={product.title.replace(/\n/g, " ")} />
              {(product.badge || product.isNew) && (
                <span className="detail-badge-float">
                  {product.badge || (product.isNew ? "MỚI" : "")}
                </span>
              )}
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="detail-info-col">
            <div className="detail-header">
              <div className="detail-icon-badge">{product.icon}</div>
              <div>
                <h1 className="detail-title">{product.title.replace(/\n/g, " ")}</h1>
                <div style={{ display: "flex", gap: "15px", alignItems: "center", flexWrap: "wrap", marginTop: "10px" }}>
                  {product.code && (
                    <span className="detail-code">Mã hiệu: {product.code}</span>
                  )}
                  {product.price && (
                    <span className="detail-price">{product.price}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="detail-divider"></div>

            <div className="detail-description">
              <h3>MÔ TẢ SẢN PHẨM</h3>
              <p>{product.details}</p>
            </div>

            <div className="detail-specs">
              <h3>THÔNG SỐ & ĐẶC ĐIỂM NỔI BẬT</h3>
              <ul className="specs-list">
                {product.specs && product.specs.map((spec, i) => (
                  <li key={i}>
                    <Check size={18} className="spec-check-icon" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="detail-actions">
              <a href="tel:0904678323" className="btn-call-action">
                <PhoneCall size={20} /> LIÊN HỆ NHẬN BÁO GIÁ
              </a>
              <button className="btn-secondary-action" onClick={() => navigate(-1)}>
                QUAY LẠI
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Guarantee Section */}
      <section className="detail-guarantee-section">
        <div className="container">
          <div className="catalog-guarantee-bar">
            <div className="guarantee-item">
              <ShieldCheck size={32} className="g-icon" />
              <div>
                <h4>CHÍNH HÃNG 100%</h4>
                <p>Nhập khẩu có chứng nhận đầy đủ</p>
              </div>
            </div>
            <div className="guarantee-item">
              <CheckCircle2 size={32} className="g-icon gold" />
              <div>
                <h4>BẢO HÀNH DÀI HẠN</h4>
                <p>Bảo trì tận nơi, hỗ trợ nhanh chóng</p>
              </div>
            </div>
            <div className="guarantee-item">
              <Star size={32} className="g-icon red" />
              <div>
                <h4>LẮP ĐẶT CHUYÊN NGHIỆP</h4>
                <p>Thi công nhanh gọn, chuẩn kỹ thuật</p>
              </div>
            </div>
            <div className="guarantee-item">
              <HeadphonesIcon size={32} className="g-icon" />
              <div>
                <h4>TƯ VẤN MIỄN PHÍ</h4>
                <p>Hỗ trợ 24/7, khảo sát tận nơi</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
