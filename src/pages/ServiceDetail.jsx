import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Calendar, ArrowLeft, ArrowRight, Phone, ShieldCheck, Clock, Wrench } from 'lucide-react';
import RevealOnScroll from '../components/RevealOnScroll';
import { getServiceSlug, slugify } from '../utils/slug';
import { DEFAULT_SERVICES } from '../data/defaultServices';
import './News.css';
import './Services.css';

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

      // Tìm dịch vụ hiện tại theo slug hoặc id
      const normalizedParam = (id || "").toLowerCase().trim();
      const foundService = merged.find((s) => {
        const slug = (s.slug || slugify(s.title)).toLowerCase();
        const sid = String(s._id || s.id || "").toLowerCase();
        return slug === normalizedParam || sid === normalizedParam || slug.includes(normalizedParam);
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

  const phoneCall = serviceItem.phone ? serviceItem.phone.replace(/[^0-9]/g, '') : '0904678323';

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
          <RevealOnScroll animation="fade-up">
            <Link to="/dich-vu" className="back-link">
              <ArrowLeft size={16} /> Quay lại danh sách dịch vụ
            </Link>

            <h1 className="news-detail-title">{serviceItem.title}</h1>

            <div className="news-detail-meta" style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span className="news-date">
                <Calendar size={18} /> {serviceItem.date || 'Cập nhật mới'}
              </span>
              <a
                href={`tel:${phoneCall}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#dc2626',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textDecoration: 'none'
                }}
              >
                <Phone size={16} /> Hotline: {serviceItem.phone || '0904.678.323'}
              </a>
            </div>

            {serviceItem.img && (
              <div className="news-detail-image">
                <img src={formatImgSrc(serviceItem.img)} alt={serviceItem.title} />
              </div>
            )}

            {serviceItem.desc && (
              <div
                style={{
                  background: '#f8fafc',
                  borderLeft: '4px solid #043c23',
                  padding: '16px 20px',
                  margin: '20px 0 28px 0',
                  borderRadius: '0 8px 8px 0',
                  color: '#1e293b',
                  fontSize: '1.02rem',
                  lineHeight: 1.7,
                  fontWeight: 500
                }}
              >
                {serviceItem.desc}
              </div>
            )}

            <div className="news-detail-content project-article-rendered-content">
              {serviceItem.content && serviceItem.content.includes('<') ? (
                <div dangerouslySetInnerHTML={{ __html: serviceItem.content }} />
              ) : (
                (serviceItem.content || '').split('\n').map((line, idx) => (
                  <p key={idx} style={{ lineHeight: 1.8, marginBottom: '14px', color: '#334155' }}>
                    {line}
                  </p>
                ))
              )}
            </div>

            {/* BOX LIÊN HỆ CỨU HỘ & BẢO TRÌ NHANH */}
            <div
              style={{
                marginTop: '3rem',
                padding: '24px',
                background: 'linear-gradient(135deg, #043c23 0%, #065f46 100%)',
                color: '#ffffff',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                boxShadow: '0 10px 25px rgba(4, 60, 35, 0.25)'
              }}
            >
              <div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', color: '#f5bd20', fontWeight: 800 }}>
                  CẦN HỖ TRỢ KỸ THUẬT & BÁO GIÁ NHANH?
                </h4>
                <p style={{ margin: 0, fontSize: '0.92rem', color: '#e2e8f0' }}>
                  Đội ngũ kỹ thuật viên BOSS Đà Nẵng sẵn sàng có mặt sau 15 – 30 phút trên toàn địa bàn.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <a
                  href={`tel:${phoneCall}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 22px',
                    background: '#dc2626',
                    color: '#ffffff',
                    fontWeight: 700,
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '0.92rem',
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.35)'
                  }}
                >
                  <Phone size={16} /> GỌI THỢ NGAY: {serviceItem.phone || '0904.678.323'}
                </a>
                <a
                  href="https://zalo.me/0904678323"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    background: '#ffffff',
                    color: '#043c23',
                    fontWeight: 700,
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '0.92rem'
                  }}
                >
                  💬 Zalo tư vấn
                </a>
              </div>
            </div>
          </RevealOnScroll>
        </div>

        {/* 4. CÁC DỊCH VỤ LIÊN QUAN */}
        {relatedServices.length > 0 && (
          <div className="container news-related-wrapper" style={{ marginTop: '3.5rem' }}>
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
                    <div key={item._id || item.id || index} className="related-news-card">
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
                  ))}
                </div>
              </RevealOnScroll>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default ServiceDetail;
