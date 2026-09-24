import React, { useState, useEffect } from 'react';
import { ChevronRight, Calendar, ArrowRight } from 'lucide-react';
import RevealOnScroll from '../components/RevealOnScroll';
import './News.css';

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/news`);
        if (!response.ok) {
          throw new Error('Failed to fetch news data');
        }
        const json = await response.json();
        if (json.success) {
          setNewsList(json.data || []);
        } else {
          throw new Error(json.message || 'Failed to fetch news data');
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Không thể tải dữ liệu tin tức lúc này. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
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
                      <img src={item.image} alt={item.title} />
                      <span className="news-date-badge">
                        <Calendar size={13} /> {item.date}
                      </span>
                    </div>
                    <div className="news-card-content">
                      <h3 className="news-card-title">
                        <a href={`/tin-tuc/${item._id || item.slug || ''}`}>
                          {item.title}
                        </a>
                      </h3>
                      <div className="news-card-summary">
                        {item.summary || item.content.substring(0, 150) + '...'}
                      </div>
                      <a href={`/tin-tuc/${item._id || item.slug || ''}`} className="btn-news-readmore">
                        Đọc tiếp <ArrowRight size={14} />
                      </a>
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
