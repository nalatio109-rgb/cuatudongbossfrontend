import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
import RevealOnScroll from '../components/RevealOnScroll';
import ArticleGalleryModal from '../components/ArticleGalleryModal';
import { enhanceArticleImages, initMobileAutoScroll } from '../utils/enhanceArticleImages';
import { getNewsSlug, slugify } from '../utils/slug';
import { sortByNewest } from '../utils/sortHelper';
import { DEFAULT_NEWS } from '../data/defaultNews';
import './News.css';

const NewsDetail = () => {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [allNews, setAllNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [galleryModal, setGalleryModal] = useState({
    isOpen: false,
    images: [],
    initialIndex: 0,
    initialViewMode: 'slide'
  });

  const handleOpenGallery = (images, index = 0, mode = 'slide') => {
    setGalleryModal({
      isOpen: true,
      images: images,
      initialIndex: index,
      initialViewMode: mode
    });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchNewsDetail = async () => {
      setLoading(true);
      setError(null);

      let list = [];
      // 1. Thử gọi API Backend lấy danh sách tin tức
      try {
        const backendBase = import.meta.env.VITE_API_URL || "";
        const endpoint = backendBase ? `${backendBase}/api/news` : `/api/news`;
        const response = await fetch(endpoint);
        if (response.ok) {
          const json = await response.json();
          if (json.success && Array.isArray(json.data)) {
            list = json.data;
          }
        }
      } catch (err) {
        console.warn('API fetch news detail error, trying fallback:', err.message);
      }

      // 2. Hợp nhất với localStorage
      let localList = [];
      try {
        const stored = localStorage.getItem("boss_admin_news");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) localList = parsed;
        }
      } catch (_) {}

      const merged = [...list];
      localList.forEach((ln) => {
        if (!ln) return;
        const lnId = String(ln._id || ln.id || "");
        const exists = merged.some((m) => String(m._id || m.id || "") === lnId || (m.slug && m.slug === ln.slug));
        if (!exists) merged.push(ln);
      });

      // 3. Fallback thêm danh sách mẫu nếu còn thiếu
      DEFAULT_NEWS.forEach((sample) => {
        const exists = merged.some((m) => String(m._id || m.id || "") === sample._id || m.slug === sample.slug);
        if (!exists) merged.push(sample);
      });

      merged.sort(sortByNewest);
      setAllNews(merged);

      // 4. Tìm bài viết chi tiết hiện tại theo slug hoặc id
      const normalizedParam = id.toLowerCase().trim();
      const foundArticle = merged.find((n) => {
        const s = (n.slug || slugify(n.title)).toLowerCase();
        const sid = String(n._id || n.id || "").toLowerCase();
        return s === normalizedParam || sid === normalizedParam || s.includes(normalizedParam);
      });

      if (foundArticle) {
        setNewsItem(foundArticle);

        // 5. Tự động đồng bộ URL trên trình duyệt sang dạng slug không dấu chuẩn SEO
        const canonicalSlug = getNewsSlug(foundArticle);
        if (canonicalSlug && id !== canonicalSlug) {
          window.history.replaceState(null, "", `/tin-tuc/${canonicalSlug}`);
        }
      } else {
        setError('Không tìm thấy bài viết tin tức.');
      }

      setLoading(false);
    };

    fetchNewsDetail();
  }, [id]);

  // Tự động gắn thuộc tính title để khi rê chuột vào bất kỳ link nào sẽ hiện URL đầy đủ
  // và Tự động nâng cấp các cụm nhiều ảnh liên tiếp thành Slider mượt mà trên mobile
  useEffect(() => {
    if (newsItem?.content) {
      const container = document.querySelector(".news-detail-content");
      if (container) {
        const anchors = container.querySelectorAll("a");
        anchors.forEach((a) => {
          const href = a.getAttribute("href");
          if (href && !a.getAttribute("title")) {
            a.setAttribute("title", `Đến trang: ${href}`);
          }
        });

        // Nâng cấp cụm nhiều ảnh thành Mobile Carousel / Modal Gallery
        const cleanupImages = enhanceArticleImages(container, handleOpenGallery);
        return () => {
          if (cleanupImages) cleanupImages();
        };
      }
    }
  }, [newsItem?.content]);

  // Danh sách bài viết liên quan (loại trừ bài hiện tại, lấy tối đa 3 bài)
  const relatedNews = useMemo(() => {
    if (!newsItem || !Array.isArray(allNews) || allNews.length <= 1) return [];
    const currentId = String(newsItem._id || newsItem.id || '').trim();
    const currentTitle = String(newsItem.title || '').trim().toLowerCase();

    return allNews
      .filter((n) => {
        if (!n || typeof n !== 'object') return false;
        const nId = String(n._id || n.id || '').trim();
        const nTitle = String(n.title || '').trim().toLowerCase();
        if (currentId && nId && currentId === nId) return false;
        if (currentTitle && nTitle && currentTitle === nTitle) return false;
        return true;
      })
      .slice(0, 3);
  }, [newsItem, allNews]);

  // Tự động chạy thẻ hàng ngang từ trái sang phải trên điện thoại
  useEffect(() => {
    if (relatedNews && relatedNews.length > 1) {
      const gridEl = document.querySelector('.related-news-grid');
      if (gridEl) {
        const cleanupScroll = initMobileAutoScroll(gridEl);
        return () => {
          if (cleanupScroll) cleanupScroll();
        };
      }
    }
  }, [relatedNews]);

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
      <main className="site293-main-content section-space news-detail-main">
        <div className="container news-detail-container">
          <RevealOnScroll animation="fade-up" delay={50}>
            <Link to="/tin-tuc" className="back-link">
              <ArrowLeft size={16} /> Quay lại tin tức
            </Link>
          </RevealOnScroll>
          
          <RevealOnScroll animation="fade-up" delay={100}>
            <h1 className="news-detail-title">{newsItem.title}</h1>
          </RevealOnScroll>
          
          <RevealOnScroll animation="fade-up" delay={150}>
            <div className="news-detail-meta">
              <span className="news-date">
                <Calendar size={19} /> {newsItem.date || (newsItem.createdAt ? new Date(newsItem.createdAt).toLocaleDateString('vi-VN') : "")}
              </span>
            </div>
          </RevealOnScroll>

          {newsItem.image && (
            <RevealOnScroll animation="zoom-in" delay={200}>
              <div className="news-detail-image">
                <img src={newsItem.image} alt={newsItem.title} />
              </div>
            </RevealOnScroll>
          )}

          <RevealOnScroll animation="fade-up" delay={250}>
            <div className="news-detail-content">
              {/* If content is HTML, use dangerouslySetInnerHTML, otherwise just display it */}
              <div dangerouslySetInnerHTML={{ __html: newsItem.content }} />
            </div>
          </RevealOnScroll>
        </div>

        {/* 4. CÁC BÀI VIẾT LIÊN QUAN */}
        {relatedNews.length > 0 && (
          <div className="container news-related-wrapper">
            <section className="related-news-section">
              <RevealOnScroll animation="fade-up">
                <div className="related-news-header">
                  <div>
                    <h3 className="related-news-title">Bài Viết & Tin Tức Liên Quan</h3>
                    <p className="related-news-desc">
                      Khám phá thêm các cẩm nang tư vấn, kinh nghiệm chọn cửa và tin tức mới nhất từ BOSS Đà Nẵng
                    </p>
                  </div>
                  <Link to="/tin-tuc" className="related-news-view-all">
                    Xem tất cả tin tức <ChevronRight size={16} />
                  </Link>
                </div>
              </RevealOnScroll>

              <div className="related-news-grid">
                {relatedNews.map((relItem, idx) => (
                  <RevealOnScroll
                    key={relItem._id || relItem.id || idx}
                    animation="fade-up"
                    delay={idx * 150}
                    className="related-news-card-reveal-wrapper"
                  >
                    <Link
                      to={`/tin-tuc/${getNewsSlug(relItem)}`}
                      className="related-news-card"
                    >
                      <div className="related-news-img-holder">
                        <img
                          src={relItem.image || "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80"}
                          alt={relItem.title}
                          loading="lazy"
                        />
                        <span className="related-news-badge">
                          {relItem.category || "Tin tức"}
                        </span>
                      </div>
                      <div className="related-news-card-body">
                        <div className="related-news-date">
                          <Calendar size={14} />
                          <span>{relItem.date || (relItem.createdAt ? new Date(relItem.createdAt).toLocaleDateString('vi-VN') : "")}</span>
                        </div>
                        <h4 className="related-news-card-title">{relItem.title}</h4>
                        <p className="related-news-card-summary">
                          {relItem.summary || (relItem.content ? relItem.content.replace(/<[^>]+>/g, " ").substring(0, 110) + "..." : "")}
                        </p>
                        <span className="related-news-read-more">
                          Đọc tiếp <ArrowRight size={14} />
                        </span>
                      </div>
                    </Link>
                  </RevealOnScroll>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* 5. CỬA SỔ PHÓNG TO & XEM CÙNG LÚC TẤT CẢ ẢNH TRONG BÀI VIẾT */}
      <ArticleGalleryModal
        isOpen={galleryModal.isOpen}
        onClose={() => setGalleryModal((prev) => ({ ...prev, isOpen: false }))}
        images={galleryModal.images}
        initialIndex={galleryModal.initialIndex}
        initialViewMode={galleryModal.initialViewMode}
      />
    </div>
  );
};

export default NewsDetail;
