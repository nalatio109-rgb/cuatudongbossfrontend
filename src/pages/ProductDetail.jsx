import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate, Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  Star,
  HeadphonesIcon,
  Tag,
  Clock,
  ChevronDown,
  Send,
  X,
  MessageCircle,
  Sparkles,
  ShoppingBag,
  HelpCircle,
  Compass
} from "lucide-react";
import { getProductExtendedDetails } from "../data/productDetailsData";
import { DEFAULT_PRODUCT_ARTICLES } from "../data/defaultProductArticles";
import { getProductSlug } from "../utils/slug.js";
import { useAuth } from "../context/AuthContext";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { currentUser } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Product base state
  const [product, setProduct] = useState(location.state?.product || null);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState(0); // Accordion state for FAQ

  // Product Article State (WYSIWYG Word-like content)
  const [productArticle, setProductArticle] = useState(null);

  // Quote Request Modal State
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteFormData, setQuoteFormData] = useState({
    fullName: currentUser?.fullName || "",
    phone: currentUser?.phone || "",
    dimensions: "",
    address: "",
    note: ""
  });
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  // Auto pre-fill if user logs in or is already authenticated
  useEffect(() => {
    if (currentUser) {
      setQuoteFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || currentUser.fullName || "",
        phone: prev.phone || currentUser.phone || ""
      }));
    }
  }, [currentUser]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedImageIndex(0);
    setQuoteSubmitted(false);
  }, [id]);

  // Load product from API if not passed via location state
  useEffect(() => {
    if (import.meta.env.VITE_API_URL) {
      // 1. Fetch current product if missing
      if (!product && id) {
        fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.data) {
              setProduct(data.data);
            }
          })
          .catch((err) => console.log("Detail fetch error:", err));
      }

      // 2. Fetch all products for related products section
      fetch(`${import.meta.env.VITE_API_URL}/api/products`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setAllProducts(data.data);
          }
        })
        .catch((err) => console.log("All products fetch error:", err));
    }
  }, [id, product]);

  // Combine product with extended technical and commercial details
  const extendedDetails = useMemo(() => {
    const initialProduct = product || {
      id: id,
      code: id,
      title: `Sản phẩm ${id}`
    };
    return getProductExtendedDetails(initialProduct);
  }, [product, id]);

  // Tự động đồng bộ hoá URL trên thanh địa chỉ sang dạng Slug không dấu chuẩn SEO (ví dụ: /san-pham/cua-cuon-khe-thoang-duc-bossdoor-bd-900)
  useEffect(() => {
    if (extendedDetails) {
      const canonicalSlug = getProductSlug(extendedDetails);
      if (canonicalSlug && id !== canonicalSlug) {
        navigate(`/san-pham/${canonicalSlug}`, { replace: true, state: location.state });
      }
    }
  }, [id, extendedDetails, navigate, location.state]);

  // Load product article from API, localStorage, or fallback
  useEffect(() => {
    const code = extendedDetails?.code;
    if (!code) return;

    let isMounted = true;

    const fetchArticle = async () => {
      let foundArticle = null;

      // 1. Fetch from Backend API
      if (import.meta.env.VITE_API_URL) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/product-articles/${code}`);
          const json = await res.json();
          if (json.success && json.data) {
            foundArticle = json.data;
          }
        } catch (e) {
          console.log("Could not load product article from API:", e.message);
        }
      }

      // 2. Fallback to localStorage
      if (!foundArticle) {
        const local = localStorage.getItem("boss_admin_product_articles");
        if (local) {
          try {
            const list = JSON.parse(local);
            foundArticle = list.find((a) => a.productCode.toUpperCase() === code.toUpperCase());
          } catch (e) {
            console.error(e);
          }
        }
      }

      // 3. Fallback to DEFAULT_PRODUCT_ARTICLES
      if (!foundArticle) {
        foundArticle = DEFAULT_PRODUCT_ARTICLES.find(
          (a) => a.productCode.toUpperCase() === code.toUpperCase()
        );
      }

      if (isMounted) {
        setProductArticle(foundArticle);
      }
    };

    fetchArticle();

    return () => {
      isMounted = false;
    };
  }, [extendedDetails?.code]);

  // Dynamic SEO meta updates
  useEffect(() => {
    if (extendedDetails) {
      const seoTitle = productArticle?.seo?.title || `${extendedDetails.title} | Báo Giá & Thông Số Kỹ Thuật Chuẩn Boss Đà Nẵng`;
      const seoDesc = productArticle?.seo?.description || `${extendedDetails.title} (Mã: ${extendedDetails.code}). Giá: ${extendedDetails.price || "Liên hệ báo giá"}. Phân phối chính hãng Boss Đà Nẵng, bảo hành dài hạn, khảo sát tận nơi miễn phí.`;

      document.title = seoTitle;
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = seoDesc;
    }
  }, [extendedDetails, productArticle]);

  // Related products (same category, excluding current product)
  const relatedProducts = useMemo(() => {
    const currentCode = extendedDetails?.code;
    const pool = allProducts.length > 0 ? allProducts : [
      {
        id: 101,
        code: "CK-SR1",
        category: "cuakeo",
        title: "Cửa kéo công nghệ Đức SR1",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
        price: "1.120.000đ/m²"
      },
      {
        id: 102,
        code: "CK-SR2",
        category: "cuakeo",
        title: "Cửa kéo công nghệ Đức SR2",
        image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=600&q=80",
        price: "1.030.000đ/m²"
      },
      {
        id: 1,
        code: "BEC.5810",
        category: "cuacuon",
        title: "Cửa cuốn Bossdoor ECO BEC.5810",
        image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=600&q=80",
        price: "1.500.000đ/m²"
      },
      {
        id: 3,
        code: "DL-75",
        category: "cuacuon",
        title: "Cửa cuốn Đài Loan giá rẻ DL-75",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80",
        price: "420.000đ/m²"
      }
    ];

    return pool
      .filter((p) => p.code !== currentCode)
      .slice(0, 4);
  }, [allProducts, extendedDetails]);

  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    if (!quoteFormData.phone.trim()) {
      alert("Vui lòng nhập số điện thoại để chuyên viên gọi tư vấn.");
      return;
    }
    setQuoteSubmitted(true);
    setTimeout(() => {
      setIsQuoteModalOpen(false);
      setQuoteSubmitted(false);
      setQuoteFormData({
        fullName: currentUser?.fullName || "",
        phone: currentUser?.phone || "",
        dimensions: "",
        address: "",
        note: ""
      });
    }, 2500);
  };

  const getCategoryName = (cat) => {
    switch (cat) {
      case "cuakeo":
        return "Cửa Kéo";
      case "cuacuon":
        return "Cửa Cuốn";
      case "phukien":
        return "Phụ Kiện Cửa";
      case "cuatudong":
        return "Cổng & Cửa Tự Động";
      default:
        return "Sản Phẩm";
    }
  };

  // Fallback article content generator if not yet created in admin
  const defaultArticleContent = useMemo(() => {
    if (productArticle?.content) return productArticle.content;

    return `
<h2>1. Giới thiệu tổng quan về ${extendedDetails.title}</h2>
<p>${extendedDetails.sectionA?.intro || extendedDetails.description || "Sản phẩm chính hãng chất lượng cao phân phối và bảo hành bởi Boss Đà Nẵng."}</p>

<div class="editor-callout-box">
  <h4>💡 Tiêu chuẩn kỹ thuật Boss Đà Nẵng:</h4>
  <p>Toàn bộ sản phẩm được kiểm tra độ kín khít, chịu lực gió bão và khả năng vận hành êm ái trước khi lắp đặt hoàn thiện tại công trình.</p>
</div>

<figure class="editor-image-figure align-center" style="max-width: 85%;">
  <img src="${extendedDetails.image}" alt="${extendedDetails.title}" />
  <figcaption>Hình 1: ${extendedDetails.title} lắp đặt thực tế tại công trình</figcaption>
</figure>

<h2>2. Đặc điểm cấu tạo chi tiết</h2>
<p>${extendedDetails.details || "Thân cửa làm từ vật liệu tuyển chọn cao cấp, sơn tĩnh điện chống phai màu và ăn mòn."}</p>

<h2>3. Bảng thông số kỹ thuật</h2>
<table class="editor-content-table">
  <thead>
    <tr>
      <th style="width: 35%;">Hạng mục thông số</th>
      <th style="width: 65%;">Quy cách tiêu chuẩn</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Mã sản phẩm</strong></td>
      <td>${extendedDetails.code}</td>
    </tr>
    <tr>
      <td><strong>Tên sản phẩm</strong></td>
      <td>${extendedDetails.title}</td>
    </tr>
    <tr>
      <td><strong>Giá niêm yết</strong></td>
      <td>${extendedDetails.price || "Liên hệ báo giá"}</td>
    </tr>
    <tr>
      <td><strong>Bảo hành chính hãng</strong></td>
      <td>2 - 5 năm tận nơi tại Đà Nẵng & Miền Trung</td>
    </tr>
  </tbody>
</table>

<h2>4. Ưu điểm nổi bật và Ứng dụng thực tế</h2>
<ul>
  <li>Vận hành êm ái, nhẹ nhàng, độ bền cơ học cao.</li>
  <li>Chống rỉ sét, chịu được khí hậu ven biển Đà Nẵng.</li>
  <li>Thẩm mỹ hiện đại, nâng tầm giá trị ngôi nhà.</li>
</ul>
    `;
  }, [productArticle, extendedDetails]);

  if (!extendedDetails) {
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

  const activeImage =
    extendedDetails.gallery && extendedDetails.gallery[selectedImageIndex]
      ? extendedDetails.gallery[selectedImageIndex]
      : extendedDetails.image;

  return (
    <div className="ecommerce-product-detail-page">
      {/* 1. BREADCRUMB NAVIGATION */}
      <nav className="detail-breadcrumb-bar">
        <div className="container">
          <Link to="/" className="crumb-link">Trang chủ</Link>
          <span className="crumb-sep">/</span>
          <Link to="/san-pham" className="crumb-link">Sản phẩm</Link>
          <span className="crumb-sep">/</span>
          <Link
            to={`/san-pham?cat=${extendedDetails.category}`}
            className="crumb-link"
          >
            {getCategoryName(extendedDetails.category)}
          </Link>
          <span className="crumb-sep">/</span>
          <span className="crumb-active">{extendedDetails.title}</span>
        </div>
      </nav>

      <main className="container detail-content-container">
        {/* ========================================================= */}
        {/* 1. KHU VỰC THÔNG TIN TỔNG QUAN SẢN PHẨM (HERO OVERVIEW) */}
        {/* ========================================================= */}
        <section className="product-overview-hero-card">
          {/* CỘT TRÁI: HÌNH ẢNH SẢN PHẨM & GALLERY THUMBNAILS */}
          <div className="hero-gallery-column">
            {/* Ảnh chính lớn sắc nét */}
            <div className="hero-main-image-frame">
              <img
                key={activeImage}
                src={activeImage}
                alt={extendedDetails.title}
                className="main-view-image"
                loading="eager"
              />
              {extendedDetails.badge && (
                <span className="badge-tag-floating hot-tag">
                  {extendedDetails.badge}
                </span>
              )}
              <span className="badge-tag-floating warranty-tag">
                <ShieldCheck size={13} /> BẢO HÀNH 5 NĂM
              </span>
            </div>

            {/* Thư viện ảnh nhỏ chuyển đổi mượt mà */}
            {extendedDetails.gallery && extendedDetails.gallery.length > 1 && (
              <div className="gallery-thumbnail-strip">
                {extendedDetails.gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`thumb-btn-card ${selectedImageIndex === idx ? "active" : ""}`}
                    onClick={() => setSelectedImageIndex(idx)}
                  >
                    <img src={imgUrl} alt={`${extendedDetails.title} góc ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}

            {/* Banner đại lý chính hãng bên dưới ảnh */}
            <div className="authorized-dealer-banner">
              <div className="dealer-brand">
                <span className="brand-badge-boss">BOSS</span>
                <span className="brand-subtext">ĐÀ NẴNG</span>
              </div>
              <div className="dealer-info">
                <strong>CÔNG TY TNHH MTV TM &amp; DV BOSS ĐÀ NẴNG</strong>
                <span>MST: 0401872174 • Khảo sát &amp; Lắp đặt trọn gói</span>
              </div>
              <a href="tel:0904678323" className="dealer-hotline-pill">
                <PhoneCall size={14} /> 0904.678.323
              </a>
            </div>
          </div>

          {/* CỘT PHẢI: THÔNG TIN TỔNG QUAN, BẢNG TÓM TẮT & CÁC NÚT HÀNH ĐỘNG */}
          <div className="hero-summary-column">
            {/* Meta rating & Trạng thái */}
            <div className="summary-top-meta">
              <div className="rating-stars-badge">
                <div className="stars-row">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="star-fill" />
                  ))}
                </div>
                <span className="rating-score">5.0</span>
                <span className="review-count">({extendedDetails.reviewCount || 38} đánh giá đã xác thực)</span>
              </div>

              <div className="business-status-pill">
                <span className="pulse-dot"></span>
                <span>{extendedDetails.businessStatus || "Sẵn hàng tại Đà Nẵng • Khảo sát 24h"}</span>
              </div>
            </div>

            {/* Tiêu đề sản phẩm H1 */}
            <h1 className="product-main-h1">{extendedDetails.title}</h1>

            {/* Mã sản phẩm & Danh mục */}
            <div className="code-category-row">
              <span className="meta-tag-code">
                MÃ SP: <strong>{extendedDetails.code}</strong>
              </span>
              <span className="meta-tag-cat">
                DANH MỤC: <strong>{getCategoryName(extendedDetails.category)}</strong>
              </span>
            </div>

            {/* Hộp giá bán nổi bật */}
            <div className="product-pricing-box">
              <div className="price-label">Giá niêm yết tại xưởng:</div>
              <div className="price-amount-highlight">
                {extendedDetails.price && extendedDetails.price !== "Liên hệ"
                  ? extendedDetails.price
                  : "Liên hệ để nhận báo giá"}
              </div>
              <div className="price-promise-note">
                ⚡ Giá xuất xưởng - Khảo sát đo đạc thực tế <strong>0 đồng</strong> tại chân công trình
              </div>
            </div>

            {/* BẢNG TÓM TẮT THÔNG SỐ NHANH */}
            <div className="quick-specs-summary-card">
              <div className="quick-specs-title">
                <Compass size={15} /> THÔNG SỐ CƠ BẢN NHANH
              </div>
              <table className="quick-specs-table">
                <tbody>
                  {(extendedDetails.quickSpecs || []).map((spec, sIdx) => (
                    <tr key={sIdx}>
                      <td className="spec-label-col">{spec.label}</td>
                      <td className="spec-value-col">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MÔ TẢ NGẮN */}
            {extendedDetails.description && (
              <p className="product-short-description">
                {extendedDetails.description}
              </p>
            )}

            {/* NHÓM NÚT HÀNH ĐỘNG MUA HÀNG & BÁO GIÁ */}
            <div className="product-action-buttons-group">
              {/* Nút 1: Yêu cầu báo giá */}
              <button
                type="button"
                className="btn-action-primary btn-quote-now"
                onClick={() => setIsQuoteModalOpen(true)}
              >
                <ShoppingBag size={18} />
                <span>YÊU CẦU BÁO GIÁ NHANH</span>
              </button>

              {/* Nút 2: Xem bảng giá chi tiết */}
              <button
                type="button"
                className="btn-action-secondary btn-pricing-sheet"
                onClick={() => {
                  const { icon, ...serializableProduct } = extendedDetails;
                  navigate(extendedDetails.pricingUrl || `/bang-gia/${extendedDetails.code}`, {
                    state: { product: serializableProduct }
                  });
                }}
              >
                <Tag size={18} />
                <span>XEM BẢNG GIÁ CHI TIẾT</span>
                <ArrowRight size={16} />
              </button>

              {/* Nhóm gọi điện & Zalo */}
              <div className="contact-quick-buttons-row">
                <a href="tel:0904678323" className="btn-call-hotline">
                  <PhoneCall size={16} />
                  <span>Gọi 0904.678.323</span>
                </a>
                <a
                  href="https://zalo.me/0904678323"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-chat-zalo"
                >
                  <MessageCircle size={16} />
                  <span>Chat Zalo tư vấn</span>
                </a>
              </div>
            </div>

            {/* CAM KẾT CHÍNH HÃNG 4 ĐIỂM */}
            <div className="quick-guarantee-grid">
              <div className="qg-item">
                <ShieldCheck size={18} className="qg-icon" />
                <span>Chính hãng 100% C/O, C/Q</span>
              </div>
              <div className="qg-item">
                <Clock size={18} className="qg-icon" />
                <span>Lắp đặt nhanh trong 24h</span>
              </div>
              <div className="qg-item">
                <CheckCircle2 size={18} className="qg-icon" />
                <span>Bảo hành tận nơi 5 - 10 năm</span>
              </div>
              <div className="qg-item">
                <HeadphonesIcon size={18} className="qg-icon" />
                <span>Tư vấn đo đạc miễn phí</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 2. BÀI VIẾT GIỚI THIỆU CHI TIẾT SẢN PHẨM (LIÊN TỤC, KHÔNG TAB) */}
        {/* YÊU CẦU QUAN TRỌNG: KHÔNG DÙNG TAB, KHÔNG ACCORDION ẨN NỘI DUNG CHÍNH */}
        {/* ========================================================= */}
        <section className="product-article-continuous-card">
          <div className="article-continuous-header">
            <span className="article-header-tag">
              <Sparkles size={14} /> CHI TIẾT SẢN PHẨM &amp; THÔNG SỐ KỸ THUẬT
            </span>
            <h2 className="article-main-title">
              {productArticle?.seo?.title || `Bài viết giới thiệu chi tiết ${extendedDetails.title}`}
            </h2>
            <div className="article-meta-subline">
              <span>Được biên tập &amp; kiểm định bởi kỹ sư Boss Đà Nẵng</span>
              <span className="sep-dot">•</span>
              <span>Cập nhật mới nhất 2026</span>
              <span className="sep-dot">•</span>
              <span>Hình ảnh công trình thực tế</span>
            </div>
          </div>

          {/* DÒNG NỘI DUNG BÀI VIẾT HIỂN THỊ LIÊN TỤC TRÊN CÙNG MỘT TRANG */}
          <div
            className="product-article-rendered-stream"
            dangerouslySetInnerHTML={{ __html: defaultArticleContent }}
          />
        </section>

        {/* ========================================================= */}
        {/* 3. KHU VỰC BẢNG GIÁ SẢN PHẨM (CALLOUT BANNER TO PRICING) */}
        {/* ========================================================= */}
        <section className="dedicated-pricing-callout-card">
          <div className="pricing-callout-left">
            <span className="callout-pill-tag">
              <Tag size={14} /> BẢNG BÁO GIÁ KỸ THUẬT CHÍNH THỨC
            </span>
            <h3>Bảng báo giá chi tiết theo kích thước cho {extendedDetails.title}</h3>
            <p>
              Tra cứu đơn giá minh bạch theo diện tích công trình (trên 8m², từ 6m² đến 8m², từ 4m² đến 6m²), tùy chọn nâng cấp Ray Inox đặc và chi phí vận chuyển lắp đặt trọn gói.
            </p>
          </div>
          <div className="pricing-callout-right">
            <button
              type="button"
              className="btn-callout-view-pricing"
              onClick={() => {
                const { icon, ...serializableProduct } = extendedDetails;
                navigate(extendedDetails.pricingUrl || `/bang-gia/${extendedDetails.code}`, {
                  state: { product: serializableProduct }
                });
              }}
            >
              <Tag size={18} />
              <span>XEM BẢNG BÁO GIÁ KỸ THUẬT</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. CÂU HỎI THƯỜNG GẶP (FAQ ACCORDION) */}
        {/* ========================================================= */}
        {extendedDetails.faq && extendedDetails.faq.length > 0 && (
          <section className="product-faq-accordion-section">
            <div className="faq-section-header">
              <span className="sub-badge">GIẢI ĐÁP THẮC MẮC</span>
              <h2>Câu hỏi thường gặp về {extendedDetails.title}</h2>
              <p>Tổng hợp những giải đáp hữu ích nhất từ đội ngũ kỹ sư Boss Đà Nẵng</p>
            </div>

            <div className="faq-accordion-list">
              {extendedDetails.faq.map((item, fIdx) => {
                const isOpen = openFaqIndex === fIdx;
                return (
                  <div
                    key={fIdx}
                    className={`faq-accordion-item ${isOpen ? "open" : ""}`}
                  >
                    <button
                      type="button"
                      className="faq-question-button"
                      onClick={() => setOpenFaqIndex(isOpen ? -1 : fIdx)}
                    >
                      <span className="q-icon-wrap">
                        <HelpCircle size={18} />
                      </span>
                      <span className="q-text">{item.q}</span>
                      <ChevronDown size={18} className="chevron-toggle" />
                    </button>
                    {isOpen && (
                      <div className="faq-answer-pane">
                        <p>{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* 5. SẢN PHẨM LIÊN QUAN (RELATED PRODUCTS) */}
        {/* ========================================================= */}
        {relatedProducts.length > 0 && (
          <section className="related-products-section">
            <div className="related-section-header">
              <div>
                <span className="sub-badge">GỢI Ý THÊM</span>
                <h2>Sản phẩm liên quan cùng danh mục</h2>
              </div>
              <Link to="/san-pham" className="view-all-link">
                <span>Xem toàn bộ danh mục</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="related-products-grid">
              {relatedProducts.map((relProd) => (
                <div key={relProd.code || relProd.id} className="related-product-card">
                  <div className="rel-card-image">
                    <img src={relProd.image} alt={relProd.title} loading="lazy" />
                    <span className="rel-code-pill">MÃ: {relProd.code}</span>
                  </div>
                  <div className="rel-card-body">
                    <h3 className="rel-title">
                      <Link
                        to={`/san-pham/${getProductSlug(relProd)}`}
                        state={{ product: relProd }}
                      >
                        {relProd.title}
                      </Link>
                    </h3>
                    <div className="rel-price-row">
                      <span className="rel-price-num">
                        {relProd.price && relProd.price !== "Liên hệ"
                          ? relProd.price
                          : "Liên hệ báo giá"}
                      </span>
                    </div>
                    <div className="rel-action-buttons">
                      <Link
                        to={`/san-pham/${getProductSlug(relProd)}`}
                        state={{ product: relProd }}
                        className="btn-rel-view-detail"
                      >
                        Xem chi tiết
                      </Link>
                      <button
                        type="button"
                        className="btn-rel-pricing"
                        onClick={() => {
                          const { icon, ...serializableProduct } = relProd;
                          navigate(`/bang-gia/${relProd.code || relProd.id}`, {
                            state: { product: serializableProduct }
                          });
                        }}
                        title="Xem bảng giá sản phẩm này"
                      >
                        <Tag size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* 6. KÊU GỌI LIÊN HỆ (CTA FINAL BANNER) */}
        {/* ========================================================= */}
        <section className="final-consultation-cta-banner">
          <div className="cta-banner-content">
            <span className="cta-highlight-badge">TƯ VẤN CÔNG TRÌNH MIỄN PHÍ</span>
            <h2>Bạn đang tìm giải pháp phù hợp cho công trình của mình?</h2>
            <p>
              Kỹ sư chuyên môn của Boss Đà Nẵng luôn sẵn sàng đến tận chân công trình khảo sát đo đạc thực tế, tư vấn quy cách kỹ thuật và gửi dự toán chính xác hoàn toàn <strong>MIỄN PHÍ</strong> trong vòng 24h.
            </p>
            <div className="cta-action-buttons-row">
              <a href="tel:0904678323" className="cta-btn-phone">
                <PhoneCall size={18} />
                <span>GỌI NGAY: 0904.678.323</span>
              </a>
              <a
                href="https://zalo.me/0904678323"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-btn-zalo"
              >
                <MessageCircle size={18} />
                <span>CHAT ZALO TƯ VẤN</span>
              </a>
              <button
                type="button"
                className="cta-btn-form"
                onClick={() => setIsQuoteModalOpen(true)}
              >
                <Send size={18} />
                <span>NHẬN DỰ TOÁN BÁO GIÁ</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================= */}
      {/* POPUP MODAL: YÊU CẦU BÁO GIÁ NHANH */}
      {/* ========================================================= */}
      {isQuoteModalOpen && (
        <div className="quote-modal-backdrop" onClick={() => setIsQuoteModalOpen(false)}>
          <div
            className="quote-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setIsQuoteModalOpen(false)}
            >
              <X size={20} />
            </button>

            <div className="modal-header">
              <div className="modal-icon-badge">
                <ShoppingBag size={24} />
              </div>
              <h3>Đăng Ký Nhận Báo Giá Nhanh</h3>
              <p>
                Dành cho sản phẩm: <strong>{extendedDetails.title}</strong> (Mã: {extendedDetails.code})
              </p>
            </div>

            {quoteSubmitted ? (
              <div className="modal-success-state">
                <CheckCircle2 size={54} className="success-icon" />
                <h4>Gửi Yêu Cầu Thành Công!</h4>
                <p>
                  Cảm ơn bạn đã quan tâm. Kỹ sư Boss Đà Nẵng sẽ liên hệ lại qua số điện thoại của bạn trong ít phút để tư vấn và gửi bảng giá chi tiết.
                </p>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="quote-modal-form">
                <div className="form-group">
                  <label>Họ và tên của bạn:</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Nguyễn Văn An"
                    value={quoteFormData.fullName}
                    onChange={(e) =>
                      setQuoteFormData({ ...quoteFormData, fullName: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>
                    Số điện thoại liên hệ <span className="req">*</span>:
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ví dụ: 0904 123 456"
                    value={quoteFormData.phone}
                    onChange={(e) =>
                      setQuoteFormData({ ...quoteFormData, phone: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Kích thước dự kiến (Rộng x Cao mét):</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Rộng 3.5m x Cao 3.2m (hoặc chưa rõ)"
                    value={quoteFormData.dimensions}
                    onChange={(e) =>
                      setQuoteFormData({ ...quoteFormData, dimensions: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Địa chỉ công trình lắp đặt:</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Quận Hải Châu, TP. Đà Nẵng"
                    value={quoteFormData.address}
                    onChange={(e) =>
                      setQuoteFormData({ ...quoteFormData, address: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Yêu cầu hoặc ghi chú thêm:</label>
                  <textarea
                    rows={3}
                    placeholder="Ghi chú thêm về yêu cầu khảo sát, màu sắc mong muốn..."
                    value={quoteFormData.note}
                    onChange={(e) =>
                      setQuoteFormData({ ...quoteFormData, note: e.target.value })
                    }
                  />
                </div>

                <button type="submit" className="btn-modal-submit">
                  <Send size={16} /> GỬI YÊU CẦU BÁO GIÁ MIỄN PHÍ
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
