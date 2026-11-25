import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Calendar, ArrowLeft, ArrowRight, Phone, ShieldCheck, Clock, Wrench } from 'lucide-react';
import RevealOnScroll from '../components/RevealOnScroll';
import ArticleGalleryModal from '../components/ArticleGalleryModal';
import { enhanceArticleImages } from '../utils/enhanceArticleImages';
import { getServiceSlug, slugify } from '../utils/slug';
import { DEFAULT_SERVICES } from '../data/defaultServices';
import './News.css';
import './Services.css';
import './ProjectDetail.css';

const formatImgSrc = (src) => {
  if (!src) return '/service_repair_247.png';
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src;
  }
  if (src.startsWith('/uploads')) {
    const backendBase = import.meta.env.VITE_API_URL || '';
    return `${backendBase}${src}`;
  }
  return src;
};

const ServiceDetail = () => {
  const { id } = useParams();
  const [serviceItem, setServiceItem] = useState(null);
  const [allServices, setAllServices] = useState([]);
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

    const fetchServiceDetail = async () => {
      setLoading(true);
      setError(null);

      let list = [];
      try {
        const backendBase = import.meta.env.VITE_API_URL || "";
        const endpoint = backendBase ? `${backendBase}/api/services` : `/api/services`;
        const response = await fetch(endpoint);
        if (response.ok) {
          const json = await response.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            list = json.data;
          }
        }
      } catch (err) {
        console.warn('API fetch services detail error, trying fallback:', err.message);
      }

      // Hợp nhất với localStorage từ Admin
      let localList = [];
      try {
        const stored = localStorage.getItem("boss_admin_services");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) localList = parsed;
        }
      } catch (_) {}

      const merged = [...list];
      localList.forEach((ls) => {
        if (!ls) return;
        const lsId = String(ls._id || ls.id || "");
        const exists = merged.some((m) => String(m._id || m.id || "") === lsId || (m.slug && m.slug === ls.slug));
        if (!exists) merged.push(ls);
      });

      // Fallback thêm danh sách mẫu tiêu chuẩn nếu còn thiếu
      DEFAULT_SERVICES.forEach((sample) => {
        const sampleId = String(sample._id || sample.id || "");
        const exists = merged.some((m) => String(m._id || m.id || "") === sampleId || m.title === sample.title);
        if (!exists) merged.push(sample);
      });

      setAllServices(merged);

      // Tìm dịch vụ hiện tại theo slug hoặc id hoặc title
      const rawParam = id || "";
      let decodedParam = "";
      try {
        decodedParam = decodeURIComponent(rawParam).toLowerCase().trim();
      } catch (e) {
        decodedParam = rawParam.toLowerCase().trim();
      }
      const slugifiedParam = slugify(decodedParam);
      const normalizedParam = rawParam.toLowerCase().trim();

      const foundService = merged.find((s) => {
        const canonical = getServiceSlug(s).toLowerCase();
        const slug = (s.slug || slugify(s.title || s.name || "")).toLowerCase();
        const sid = String(s._id || s.id || "").toLowerCase();
        const titleLower = (s.title || s.name || "").toLowerCase();

        return (
          canonical === normalizedParam ||
          canonical === slugifiedParam ||
          canonical === decodedParam ||
          slug === normalizedParam ||
          slug === slugifiedParam ||
          slug === decodedParam ||
          sid === normalizedParam ||
          titleLower === decodedParam ||
          (slug && normalizedParam && slug.includes(normalizedParam)) ||
          (canonical && slugifiedParam && canonical.includes(slugifiedParam))
        );
      });

      if (foundService) {
        setServiceItem(foundService);

        // Tự động đồng bộ URL trên trình duyệt sang dạng slug không dấu chuẩn SEO
        const canonicalSlug = getServiceSlug(foundService);
        if (canonicalSlug && id !== canonicalSlug) {
          window.history.replaceState(null, "", `/dich-vu/${canonicalSlug}`);
        }
      } else {
        setError('Không tìm thấy thông tin dịch vụ yêu cầu.');
      }

      setLoading(false);
    };

    fetchServiceDetail();
  }, [id]);

  // Tự động gắn thuộc tính title để khi rê chuột vào bất kỳ link nào sẽ hiện URL đầy đủ
  // và Tự động nâng cấp các cụm nhiều ảnh liên tiếp thành Slider mượt mà trên mobile
  useEffect(() => {
    if (serviceItem?.content) {
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
  }, [serviceItem?.content]);

  // Danh sách dịch vụ khác / liên quan (loại trừ bài hiện tại, lấy tối đa 3 dịch vụ)
  const relatedServices = useMemo(() => {
    if (!serviceItem || !Array.isArray(allServices) || allServices.length <= 1) return [];
    const currentId = String(serviceItem._id || serviceItem.id || '').trim();
    const currentTitle = String(serviceItem.title || '').trim().toLowerCase();

    return allServices
      .filter((s) => {
        if (!s || typeof s !== 'object') return false;
        const sId = String(s._id || s.id || '').trim();
        const sTitle = String(s.title || '').trim().toLowerCase();
        if (currentId && sId && currentId === sId) return false;
        if (currentTitle && sTitle && currentTitle === sTitle) return false;
        return true;
      })
      .slice(0, 3);
  }, [serviceItem, allServices]);

  if (loading) {
    return (
      <div className="news-loading" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Đang tải thông tin dịch vụ...
      </div>
    );
  }

  if (error || !serviceItem) {
    return (
      <div className="news-error" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {error || 'Không tìm thấy dịch vụ.'}
      </div>
    );
  }

  const rawPhone = String(serviceItem.phone || '0904.678.323');
  const phoneCall = rawPhone.replace(/[^0-9]/g, '') || '0904678323';

  return (
    <div className="boss-news-page site-293-style">
      {/* 1. TOP BANNER HEADER (PHONG CÁCH TIN TỨC) */}
      <div className="news-top-banner">
        <div className="news-banner-overlay"></div>
        <div className="container relative-z">
          <RevealOnScroll animation="fade-down" className="news-banner-text">
            <h1>DỊCH VỤ BOSS ĐÀ NẴNG</h1>
            <p>Hệ thống thi công, bảo trì & sửa chữa cửa cuốn, cửa kéo, cổng tự động chuyên nghiệp 24/7</p>
          </RevealOnScroll>
        </div>
      </div>

      {/* 2. BREADCRUMB */}
      <div className="news-breadcrumb">
        <div className="container">
          <Link to="/" title="Trang chủ">Trang chủ <ChevronRight size={14} /></Link>
          <Link to="/dich-vu" title="Dịch vụ">Dịch vụ <ChevronRight size={14} /></Link>
          <span className="current-page">{serviceItem.title}</span>
        </div>
      </div>

      {/* 3. MAIN CONTENT CHI TIẾT DỊCH VỤ */}
      <main className="site293-main-content section-space news-detail-main">
        <div className="container news-detail-container">
          <RevealOnScroll animation="fade-up" delay={50}>
            <Link to="/dich-vu" className="back-link">
              <ArrowLeft size={16} /> Quay lại danh sách dịch vụ
            </Link>
          </RevealOnScroll>

          <RevealOnScroll animation="fade-up" delay={100}>
            <h1 className="news-detail-title">{serviceItem.title}</h1>
          </RevealOnScroll>

          <RevealOnScroll animation="fade-up" delay={150}>
            <div className="news-detail-meta service-detail-meta">
              <span className="news-date">
                <Calendar size={18} /> {serviceItem.date || 'Cập nhật mới'}
              </span>
              <a href={`tel:${phoneCall}`} className="service-meta-hotline">
                <Phone size={15} /> Hotline: {serviceItem.phone || '0904.678.323'}
              </a>
            </div>
          </RevealOnScroll>

          {serviceItem.img && (
            <RevealOnScroll animation="zoom-in" delay={200}>
              <div className="news-detail-image">
                <img src={formatImgSrc(serviceItem.img)} alt={serviceItem.title} />
              </div>
            </RevealOnScroll>
          )}

          {serviceItem.desc && (
            <RevealOnScroll animation="fade-up" delay={250}>
              <div className="service-detail-lead-desc">
                {serviceItem.desc}
              </div>
            </RevealOnScroll>
          )}

          <RevealOnScroll animation="fade-up" delay={300}>
            <div className="news-detail-content project-article-rendered-content">
              {serviceItem.content && serviceItem.content.includes('<') ? (
                <div dangerouslySetInnerHTML={{ __html: serviceItem.content }} />
              ) : (
                (serviceItem.content || '').split('\n').map((line, idx) => (
                  <p key={idx} className="service-detail-plain-p">
                    {line}
                  </p>
                ))
              )}
            </div>
          </RevealOnScroll>

          {/* BOX LIÊN HỆ CỨU HỘ & BẢO TRÌ NHANH */}
          <RevealOnScroll animation="zoom-in" delay={200}>
            <div className="service-detail-cta-box">
              <div className="cta-box-text">
                <h4 className="cta-box-title">
                  CẦN HỖ TRỢ KỸ THUẬT & BÁO GIÁ NHANH?
                </h4>
                <p className="cta-box-desc">
                  Đội ngũ kỹ thuật viên BOSS Đà Nẵng sẵn sàng có mặt sau 15 – 30 phút trên toàn địa bàn.
                </p>
              </div>

              <div className="cta-box-btns">
                <a href={`tel:${phoneCall}`} className="cta-btn-call">
                  <Phone size={16} /> GỌI THỢ NGAY: {serviceItem.phone || '0904.678.323'}
                </a>
                <a
                  href="https://zalo.me/0904678323"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-btn-zalo"
                >
                  💬 Zalo tư vấn
                </a>
              </div>
            </div>
          </RevealOnScroll>
        </div>

        {/* 4. CÁC DỊCH VỤ LIÊN QUAN */}
        {relatedServices.length > 0 && (
          <div className="container news-related-wrapper">
            <section className="related-news-section">
              <RevealOnScroll animation="fade-up">
                <div className="related-news-header">
                  <div>
                    <h3 className="related-news-title">Các Dịch Vụ Khác Từ BOSS Đà Nẵng</h3>
                    <p className="related-news-desc">
                      Tham khảo thêm các gói giải pháp thi công, lắp đặt và cứu hộ cửa chuyên nghiệp
                    </p>
                  </div>
                  <Link to="/dich-vu" className="related-news-view-all">
                    Xem tất cả dịch vụ <ChevronRight size={16} />
                  </Link>
                </div>

                <div className="related-news-grid">
                  {relatedServices.map((item, index) => (
                    <RevealOnScroll
                      key={item._id || item.id || index}
                      animation="fade-up"
                      delay={index * 140}
                      className="related-news-card-reveal-wrapper"
                    >
                      <div className="related-news-card">
                        <div className="related-news-img-holder">
                          <Link to={`/dich-vu/${getServiceSlug(item)}`}>
                            <img src={formatImgSrc(item.img)} alt={item.title} />
                          </Link>
                          <span className="related-news-badge">
                            <Calendar size={11} /> {item.date || 'Mới cập nhật'}
                          </span>
                        </div>
                        <div className="related-news-info">
                          <h4 className="related-news-item-title">
                            <Link to={`/dich-vu/${getServiceSlug(item)}`}>
                              {item.title}
                            </Link>
                          </h4>
                          <p className="related-news-excerpt">
                            {item.desc || (item.content ? item.content.substring(0, 110) + '...' : '')}
                          </p>
                          <Link to={`/dich-vu/${getServiceSlug(item)}`} className="related-news-link">
                            Xem chi tiết <ArrowRight size={13} />
                          </Link>
                        </div>
                      </div>
                    </RevealOnScroll>
                  ))}
                </div>
              </RevealOnScroll>
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

export default ServiceDetail;
