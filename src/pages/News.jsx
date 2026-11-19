import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, ArrowRight } from 'lucide-react';
import RevealOnScroll from '../components/RevealOnScroll';
import { getNewsSlug } from '../utils/slug';
import { sortByNewest } from '../utils/sortHelper';
import './News.css';

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      let localNews = [];
      try {
        const stored = localStorage.getItem("boss_admin_news");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) localNews = parsed;
        }
      } catch (_) {}

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/news`);
        if (response.ok) {
          const json = await response.json();
          if (json.success && Array.isArray(json.data)) {
            const merged = [...json.data];
            localNews.forEach((ln) => {
              if (!ln) return;
              const lnId = String(ln._id || ln.id || "");
              const exists = merged.some((m) => String(m._id || m.id || "") === lnId || (m.slug && m.slug === ln.slug));
              if (!exists) merged.push(ln);
            });
            merged.sort(sortByNewest);
            setNewsList(merged);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('API fetch news error, checking local storage:', err);
      }

      if (localNews.length > 0) {
        localNews.sort(sortByNewest);
        setNewsList(localNews);
      } else {
        setError('Không thể tải dữ liệu tin tức lúc này. Vui lòng thử lại sau.');
      }
      setLoading(false);
    };

    fetchNews();
  }, []);

  return (
    <div className="boss-news-page site-293-style">
      {/* 1. TOP BANNER HEADER */}
      <div className="news-top-banner">
        <div className="news-banner-overlay"></div>
        <div className="container relative-z">
          <RevealOnScroll animation="fade-down" className="news-banner-text">
            <h1>TIN TỨC & SỰ KIỆN</h1>
            <p>Cập nhật những thông tin mới nhất về ngành cửa tự động, kinh nghiệm bảo trì và các công trình nổi bật.</p>
          </RevealOnScroll>
        </div>
      </div>

      {/* 2. BREADCRUMB */}
      <div className="news-breadcrumb">
        <div className="container">
          <a href="/" title="Trang chủ">Trang chủ <ChevronRight size={14} /></a>
          <span className="current-page">Tin tức</span>
        </div>
      </div>

      {/* 3. MAIN NEWS LIST SECTION */}
      <main className="site293-main-content section-space">
        <div className="container">
          <RevealOnScroll animation="fade-left" className="news-title-box">
            <h2>Tin Mới Nhất</h2>
            <div className="title-underline"></div>
          </RevealOnScroll>

          {loading ? (
            <div className="news-loading">Đang tải tin tức...</div>
          ) : error ? (
            <div className="news-error">{error}</div>
          ) : newsList.length === 0 ? (
            <div className="news-loading">Chưa có bài viết nào.</div>
          ) : (
            <div className="news-page-grid">
              {newsList.map((item, index) => (
                <RevealOnScroll
                  key={item._id || index}
                  animation="fade-up"
                  delay={(index % 3) * 120}
                  duration={650}
                >
                  <div className="news-page-card">
                    <div className="news-img-wrap">
                      <Link to={`/tin-tuc/${getNewsSlug(item)}`}>
                        <img src={item.image} alt={item.title} />
                      </Link>
                      <span className="news-date-badge">
                        <Calendar size={13} /> {item.date}
                      </span>
                    </div>
                    <div className="news-card-content">
                      <h3 className="news-card-title">
                        <Link to={`/tin-tuc/${getNewsSlug(item)}`}>
                          {item.title}
                        </Link>
                      </h3>
                      <div className="news-card-summary">
                        {item.summary || (item.content ? item.content.substring(0, 150) + '...' : '')}
                      </div>
                      <Link to={`/tin-tuc/${getNewsSlug(item)}`} className="btn-news-readmore">
                        Đọc tiếp <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default News;
