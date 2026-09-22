import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Calendar, ArrowLeft } from 'lucide-react';
import RevealOnScroll from '../components/RevealOnScroll';
import './News.css'; // Reusing styles from News if applicable, or we can add custom inline/new css

const NewsDetail = () => {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const response = await fetch(`https://cuatudongbossbackend-production.up.railway.app/api/news/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch news detail');
        }
        const json = await response.json();
        if (json.success) {
          setNewsItem(json.data);
        } else {
          throw new Error(json.message || 'Failed to fetch news detail');
        }
      } catch (err) {
        console.error('Error fetching news detail:', err);
        setError('Không thể tải chi tiết tin tức lúc này. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id]);

  if (loading) {
    return <div className="news-loading" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Đang tải chi tiết tin tức...</div>;
  }

  if (error || !newsItem) {
    return <div className="news-error" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{error || 'Không tìm thấy tin tức.'}</div>;
  }

  return (
    <div className="boss-news-page site-293-style">
      {/* 1. TOP BANNER HEADER */}
      <div className="news-top-banner">
        <div className="news-banner-overlay"></div>
        <div className="container relative-z">
          <RevealOnScroll animation="fade-down" className="news-banner-text">
            <h1>TIN TỨC & SỰ KIỆN</h1>
          </RevealOnScroll>
        </div>
      </div>

      {/* 2. BREADCRUMB */}
      <div className="news-breadcrumb">
        <div className="container">
          <Link to="/" title="Trang chủ">Trang chủ <ChevronRight size={14} /></Link>
          <Link to="/tin-tuc" title="Tin tức">Tin tức <ChevronRight size={14} /></Link>
          <span className="current-page">{newsItem.title}</span>
        </div>
      </div>

      {/* 3. MAIN CONTENT */}
      <main className="site293-main-content section-space" style={{ padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <RevealOnScroll animation="fade-up">
            <Link to="/tin-tuc" className="back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginBottom: '20px', color: '#019444', textDecoration: 'none', fontWeight: '500' }}>
              <ArrowLeft size={16} /> Quay lại tin tức
            </Link>
            
            <h1 className="news-detail-title" style={{ fontSize: '2rem', color: '#333', marginBottom: '15px' }}>{newsItem.title}</h1>
            
            <div className="news-detail-meta" style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#666', marginBottom: '30px', fontSize: '0.9rem' }}>
              <span className="news-date" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Calendar size={14} /> {newsItem.date || new Date(newsItem.createdAt).toLocaleDateString('vi-VN')}
              </span>
            </div>

            {newsItem.image && (
              <div className="news-detail-image" style={{ marginBottom: '30px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                <img src={newsItem.image} alt={newsItem.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            )}

            <div className="news-detail-content" style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#444' }}>
              {/* If content is HTML, use dangerouslySetInnerHTML, otherwise just display it */}
              <div dangerouslySetInnerHTML={{ __html: newsItem.content }} />
            </div>
          </RevealOnScroll>
        </div>
      </main>
    </div>
  );
};

export default NewsDetail;
