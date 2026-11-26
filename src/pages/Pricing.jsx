import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  Calendar,
  Folder,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Star,
  HeadphonesIcon,
  PhoneCall,
  Sparkles,
  ChevronRight,
  Clock,
  RotateCcw
} from "lucide-react";
import { PRICING_ARTICLES } from "../data/pricingArticlesData";
import { DEFAULT_PRICE_QUOTES } from "../data/defaultPriceQuotes";
import { matchKeywords } from "../utils/searchHelper";
import RevealOnScroll from "../components/RevealOnScroll";
import "./Pricing.css";

export default function Pricing() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(urlQuery);

  useEffect(() => {
    if (urlQuery) {
      setSearchQuery(urlQuery);
    }
  }, [urlQuery]);

  useEffect(() => {
    document.title = "Bảng giá cửa cuốn, cửa kéo Đà Nẵng chính hãng 2026 | BossDoor";
    window.scrollTo(0, 0);
  }, []);

  const [adminPriceQuotes, setAdminPriceQuotes] = useState(() => {
    try {
      const local = localStorage.getItem("boss_admin_price_quotes");
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_PRICE_QUOTES;
  });

  useEffect(() => {
    let isMounted = true;
    const fetchQuotes = async () => {
      if (import.meta.env.VITE_API_URL) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/price-quotes`);
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0 && isMounted) {
            setAdminPriceQuotes(json.data);
            try {
              localStorage.setItem("boss_admin_price_quotes", JSON.stringify(json.data));
            } catch (e) {}
            return;
          }
        } catch (e) {}
      }
      try {
        const local = localStorage.getItem("boss_admin_price_quotes");
        if (local && isMounted) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAdminPriceQuotes(parsed);
          }
        }
      } catch (e) {}
    };

    fetchQuotes();

    const handleUpdate = () => {
      try {
        const local = localStorage.getItem("boss_admin_price_quotes");
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) setAdminPriceQuotes(parsed);
        }
      } catch (e) {}
    };

    window.addEventListener("priceQuotesUpdated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("priceQuotesUpdated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const allArticlesList = useMemo(() => {
    if (adminPriceQuotes && adminPriceQuotes.length > 0) {
      return adminPriceQuotes.map((q) => {
        const title = q.productTitle || q.title || "Bảng giá cửa cuốn BossDoor 2026";
        const excerpt =
          q.articleAbove ||
          q.articleBelow ||
          "Bảng báo giá kỹ thuật chi tiết phân tầng theo diện tích thi công tại Đà Nẵng.";
        const thumb =
          q.image ||
          q.items?.find((it) => it.image || it.imageUrl)?.image ||
          q.items?.find((it) => it.image || it.imageUrl)?.imageUrl ||
          "/project_1.png";

        return {
          id: q.productCode,
          title: title,
          shortTitle: title,
          excerpt: excerpt,
          brandCode: q.productCode,
          category: q.category === "cuakeo" ? "Cửa kéo" : "Cửa cuốn",
          publishDate: q.effectiveDate || "Năm 2026",
          image: thumb,
          path: `/bang-gia/${q.productCode}`
        };
      });
    }
    return PRICING_ARTICLES;
  }, [adminPriceQuotes]);

  // Lọc danh sách bài viết theo từ khóa tìm kiếm
  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allArticlesList;

    return allArticlesList.filter((article) => {
      const combinedText = `${article.title} ${article.shortTitle} ${article.excerpt} ${article.brandCode} ${article.category}`;
      return matchKeywords(combinedText, q);
    });
  }, [searchQuery, allArticlesList]);

  return (
    <div className="pricing-hub-page site-293-style">
      {/* 1. TOP BANNER HEADER (Khung giống 100% Ảnh Dịch Vụ người dùng yêu cầu) */}
      <div className="site293-top-banner">
        <div className="banner-overlay"></div>
        <div className="container relative-z">
          <RevealOnScroll animation="fade-down" className="banner-text-box">
            {/* Desktop Banner View (Khớp 100% Ảnh 2) */}
            <div className="desktop-svc-banner">
              <h1>BẢNG GIÁ BOSS ĐÀ NẴNG</h1>
              <p className="banner-sub-desc">
                Chuyên mục bảng giá cửa cuốn Đà Nẵng tại BossDoor Đà Nẵng cung cấp đầy đủ thông tin giá cả, chất liệu và tính năng cửa cuốn chất lượng cao              </p>

            </div>

            {/* Mobile Banner View */}
            <div className="mobile-svc-banner">
              <h1>BẢNG GIÁ BOSS ĐÀ NẴNG</h1>
              <p className="mobile-sub-desc">
                Bảng giá cửa cuốn, cửa kéo & cổng tự động chuyên nghiệp 2026
              </p>
              <div className="mobile-svc-badges">
                <div className="svc-badge-pill">
                  <ShieldCheck size={14} />
                  <span>Bảo hành 5 – 10 năm</span>
                </div>
                <div className="svc-badge-pill">
                  <Clock size={14} />
                  <span>Cứu hộ 24/7</span>
                </div>
                <div className="svc-badge-pill">
                  <RotateCcw size={14} />
                  <span>Mô tơ 1 đổi 1</span>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>

      {/* 2. BREADCRUMB */}
      <div className="site293-breadcrumb">
        <div className="container">
          <Link to="/" title="Trang chủ">Trang chủ <ChevronRight size={14} /></Link>
          <span className="current-page">Bảng giá</span>
        </div>
      </div>

      {/* 3. MAIN PRICING CONTENT SECTION */}
      <main className="container pricing-hub-main-container">
        {/* Article Cards Stream (Khớp 100% Ảnh 3) */}
        <div className="pricing-article-cards-stream">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              className="pricing-article-list-card"
              onClick={() => navigate(article.path)}
            >
              {/* Bên trái: Thumbnail kèm watermark BOSS ** ĐÀ NẴNG ** */}
              <div className="card-thumb-column">
                <div className="card-thumb-wrapper">
                  <img
                    src={article.image}
                    alt={article.title}
                    loading="lazy"
                    className="card-thumb-image"
                  />
                  {/* Watermark logo góc trên bên trái khớp Ảnh 3 */}
                  <div className="thumb-boss-watermark">
                    <span className="wm-title">BOSS</span>
                    <span className="wm-sub">★ ĐÀ NẴNG ★</span>
                  </div>
                </div>
              </div>

              {/* Bên phải: Tiêu đề H3, mô tả trích dẫn, Meta row */}
              <div className="card-content-column">
                <h3 className="card-article-title">
                  <Link
                    to={article.path}
                    className="article-title-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {article.title}
                  </Link>
                </h3>

                <p className="card-article-excerpt">{article.excerpt}</p>

                <div className="card-article-meta-row">
                  <div className="card-meta-left">
                    <span className="meta-date">
                      <Calendar size={13} className="meta-icon" />
                      <span>{article.publishDate}</span>
                    </span>
                    <span className="meta-category">
                      <Folder size={13} className="meta-icon" />
                      <span>{article.category}</span>
                    </span>
                  </div>
                  <span className="card-article-read-more">
                    <span>Xem bảng giá</span>
                    <ArrowRight size={14} className="arrow-icon" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty Search State */}
        {filteredArticles.length === 0 && (
          <div className="empty-search-state">
            <Search size={44} className="empty-icon" />
            <h3>Không tìm thấy bảng giá phù hợp với "{searchQuery}"</h3>
            <p>Vui lòng kiểm tra lại từ khóa hoặc chọn xem lại toàn bộ chuyên mục báo giá bên dưới.</p>
            <button
              type="button"
              className="btn-reset-search"
              onClick={() => setSearchQuery("")}
            >
              Xem tất cả bảng giá
            </button>
          </div>
        )}

        {/* 4. FAST QUOTE CTA BANNER */}
        <section className="pricing-fast-cta">
          <div className="cta-inner">
            <div className="cta-left">
              <h3>Bạn cần bảng dự toán chính xác theo kích thước công trình?</h3>
              <p>
                Kỹ sư Boss Đà Nẵng sẵn sàng đến trực tiếp công trình đo đạc thực tế và lên bảng dự toán hoàn toàn <strong>MIỄN PHÍ</strong> trong 30 phút.
              </p>
            </div>
            <div className="cta-right">
              <a href="tel:0904678323" className="btn-cta-hotline">
                <PhoneCall size={18} /> GỌI NGAY: 0904.678.323
              </a>
              <a
                href="https://zalo.me/0904678323"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cta-contact"
              >
                CHAT ZALO TƯ VẤN
              </a>
            </div>
          </div>
        </section>

        {/* 5. GUARANTEE BAR */}
        <section className="pricing-hub-guarantee">
          <div className="g-item">
            <ShieldCheck size={32} className="g-icon" />
            <div>
              <h4>CHÍNH HÃNG 100%</h4>
              <p>Nhập khẩu có chứng nhận C/O, C/Q đầy đủ</p>
            </div>
          </div>
          <div className="g-item">
            <CheckCircle2 size={32} className="g-icon gold" />
            <div>
              <h4>BẢO HÀNH 10 NĂM</h4>
              <p>Bảo trì tận nơi, hỗ trợ kỹ thuật 24/7</p>
            </div>
          </div>
          <div className="g-item">
            <Star size={32} className="g-icon red" />
            <div>
              <h4>LẮP ĐẶT 24H</h4>
              <p>Thi công nhanh gọn, chuẩn quy trình kĩ thuật</p>
            </div>
          </div>
          <div className="g-item">
            <HeadphonesIcon size={32} className="g-icon" />
            <div>
              <h4>TƯ VẤN MIỄN PHÍ</h4>
              <p>Khảo sát tận công trình hoàn toàn miễn phí</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
