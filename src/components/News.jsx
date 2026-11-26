import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Headphones, Phone } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";
import { getNewsSlug } from "../utils/slug";
import { sortByNewest } from "../utils/sortHelper";
import { DEFAULT_NEWS } from "../data/defaultNews";

export default function News() {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    const loadNews = async () => {
      let localNews = [];
      try {
        const stored = localStorage.getItem("boss_admin_news");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            localNews = parsed.filter((n) => n && typeof n === "object");
          }
        }
      } catch (_) {}

      // 1. Nạp ngay từ LocalStorage nếu có để hiển thị tức thì
      if (localNews.length > 0) {
        const mergedInitial = [...localNews];
        DEFAULT_NEWS.forEach((sample) => {
          const exists = mergedInitial.some(
            (m) => String(m._id || m.id || "") === sample._id || m.slug === sample.slug
          );
          if (!exists) mergedInitial.push(sample);
        });
        mergedInitial.sort(sortByNewest);
        setNewsList(mergedInitial);
      } else {
        setNewsList(DEFAULT_NEWS);
      }

      // 2. Fetch từ API Backend để đồng bộ dữ liệu mới nhất
      try {
        const backendBase = import.meta.env.VITE_API_URL || "";
        const endpoint = backendBase ? `${backendBase}/api/news` : `/api/news`;
        const response = await fetch(endpoint);
        if (response.ok) {
          const json = await response.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            const merged = [...json.data];
            localNews.forEach((ln) => {
              if (!ln) return;
              const lnId = String(ln._id || ln.id || "");
              const exists = merged.some(
                (m) => String(m._id || m.id || "") === lnId || (m.slug && m.slug === ln.slug)
              );
              if (!exists) merged.push(ln);
            });
            DEFAULT_NEWS.forEach((sample) => {
              const exists = merged.some(
                (m) => String(m._id || m.id || "") === sample._id || m.slug === sample.slug
              );
              if (!exists) merged.push(sample);
            });
            merged.sort(sortByNewest);
            setNewsList(merged);
          }
        }
      } catch (_) {
        // API offline -> đã có LocalStorage / DEFAULT_NEWS fallback an toàn
      }
    };

    loadNews();

    // Lắng nghe sự kiện cập nhật tin tức từ Admin hoặc từ tab khác
    const handleNewsUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        const sorted = [...e.detail].sort(sortByNewest);
        setNewsList(sorted);
      } else {
        loadNews();
      }
    };

    const handleStorageChange = (e) => {
      if (e.key === "boss_admin_news") {
        loadNews();
      }
    };

    window.addEventListener("boss_news_updated", handleNewsUpdate);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("boss_news_updated", handleNewsUpdate);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Lấy 3 bài viết mới nhất hiển thị trên Trang Chủ
  const sourceList = newsList && newsList.length > 0 ? newsList : DEFAULT_NEWS;
  const displayNews = sourceList.slice(0, 3);
  // Nhân đôi mảng để hỗ trợ hiệu ứng marquee chạy vòng tuần hoàn mượt mà trên mobile
  const marqueeNews = [...displayNews, ...displayNews];

  return (
    <>
      {/* ================= NEWS ================= */}
      <section className="news-section" id="news">
        <div className="container news-grid-layout">
          <RevealOnScroll animation="fade-left" className="news-left">
            <div className="news-header-wrap">
              <h2 className="news-title">TIN TỨC - KIẾN THỨC</h2>
              <Link to="/tin-tuc" className="news-view-all-btn" title="Xem tất cả tin tức">
                Xem tất cả tin tức <ArrowRight size={14} />
              </Link>
            </div>

            <div className="news-cards-wrapper">
              <div className="news-cards">
                {marqueeNews.map((news, index) => {
                  const slug = getNewsSlug(news);
                  const isDuplicate = index >= displayNews.length;

                  return (
                    <div
                      key={`${news._id || news.id || index}-${index}`}
                      className={`news-card ${isDuplicate ? "news-card-duplicate" : ""}`}
                    >
                      <Link to={`/tin-tuc/${slug}`} className="news-card-img-link" title={news.title}>
                        <img
                          src={
                            news.image ||
                            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80"
                          }
                          alt={news.title}
                          loading="lazy"
                        />
                      </Link>
                      <div className="news-content">
                        <span className="news-date">{news.date || "Mới cập nhật"}</span>
                        <h3 className="news-card-title">
                          <Link to={`/tin-tuc/${slug}`} title={news.title}>
                            {news.title}
                          </Link>
                        </h3>
                        <Link to={`/tin-tuc/${slug}`} className="news-link">
                          XEM THÊM <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll animation="fade-right" delay={200} className="news-right">
            <div className="newsletter-box consult-sidebar-box">
              <div className="consult-sidebar-icon">
                <Headphones size={32} strokeWidth={1.8} />
              </div>
              <h3>BẠN CẦN TƯ VẤN & BÁO GIÁ MIỄN PHÍ?</h3>
              <p>Đội ngũ kỹ sư & chuyên viên kinh nghiệm sẵn sàng hỗ trợ khảo sát tận nơi 24/7.</p>

              <a href="tel:0904678323" className="btn-consult-sidebar">
                <Phone size={16} /> LIÊN HỆ TƯ VẤN NGAY
              </a>

              <div className="follow-us">
                <span>Theo dõi chúng tôi</span>
                <div className="social-icons">
                  <a href="https://www.facebook.com/cuacuoncuacongtudongdanang" target="_blank" rel="noreferrer">
                    f
                  </a>
                  <a href="https://www.youtube.com/@cuatudongbossdanang" target="_blank" rel="noreferrer">
                    ▶
                  </a>
                  <a href="https://zalo.me/0904678323" target="_blank" rel="noreferrer">
                    Z
                  </a>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
