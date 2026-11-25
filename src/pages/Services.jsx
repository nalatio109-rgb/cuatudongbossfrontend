import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone, Calendar, ArrowRight, Shield, Clock, MapPin, CheckCircle2,
  Send, Wrench, Search, X, ChevronRight, FileText, Headphones, Tag,
  ShieldCheck, RotateCcw, Award, Loader2
} from 'lucide-react';
import { getServiceSlug } from '../utils/slug';
import './News.css';
import './Services.css';
import RevealOnScroll from '../components/RevealOnScroll';
import { DEFAULT_SERVICES } from '../data/defaultServices';
import { useAuth } from '../context/AuthContext';

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

const Services = () => {
  const { currentUser } = useAuth();
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
    district: 'Quận Hải Châu',
    service: 'Sửa chữa cửa cuốn 24/24',
    note: ''
  });

  // Tự động điền thông tin khách hàng nếu đã đăng nhập
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || currentUser.fullName || '',
        phone: prev.phone || currentUser.phone || ''
      }));
    }
  }, [currentUser]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const backendBase = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${backendBase}/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.name,
          phone: formData.phone,
          productCategory: `Dịch Vụ: ${formData.service} (${formData.district})`,
          message: formData.note || 'Yêu cầu tư vấn dịch vụ tận nơi'
        })
      });
      const data = await res.json();
      if (data.success) {
        setFormSubmitted(true);
      }
    } catch (err) {
      console.error('Submit service form error:', err);
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${apiUrl}/api/services`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setServicesData(data.data);
        } else {
          // Fallback to localStorage from Admin or DEFAULT_SERVICES
          const local = localStorage.getItem('boss_admin_services');
          if (local) {
            try {
              const parsed = JSON.parse(local);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setServicesData(parsed);
                setLoading(false);
                return;
              }
            } catch (_) {}
          }
          setServicesData(DEFAULT_SERVICES);
        }
      } catch (err) {
        console.warn('API error, using admin local/default services:', err);
        const local = localStorage.getItem('boss_admin_services');
        if (local) {
          try {
            const parsed = JSON.parse(local);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setServicesData(parsed);
              setLoading(false);
              return;
            }
          } catch (_) {}
        }
        setServicesData(DEFAULT_SERVICES);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="boss-services-page site-293-style">

      {/* 1. TOP BANNER HEADER (PHONG CÁCH TIN TỨC) */}
      <div className="news-top-banner">
        <div className="news-banner-overlay"></div>
        <div className="container relative-z">
          <RevealOnScroll animation="fade-down" className="news-banner-text">
            <h1>DỊCH VỤ BOSS ĐÀ NẴNG</h1>
            <p>Hệ thống phân phối, thi công & sửa chữa cửa cuốn, cửa kéo, cổng tự động chuyên nghiệp 24/7</p>
          </RevealOnScroll>
        </div>
      </div>

      {/* 2. BREADCRUMB */}
      <div className="news-breadcrumb">
        <div className="container">
          <Link to="/" title="Trang chủ">Trang chủ <ChevronRight size={14} /></Link>
          <span className="current-page">Dịch vụ</span>
        </div>
      </div>

      {/* 3. MAIN SERVICES LIST SECTION */}
      <main className="site293-main-content section-space">
        <div className="container">

          {/* Title Box */}
          <RevealOnScroll animation="fade-left" className="news-title-box">
            <h2>Dịch Vụ Nổi Bật</h2>
            <div className="title-underline"></div>
          </RevealOnScroll>

          {/* Service Cards Grid (Phong cách Tin tức) */}
          {loading ? (
            <div className="news-loading">Đang tải danh sách dịch vụ...</div>
          ) : servicesData.length === 0 ? (
            <div className="services-empty-state" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1', margin: '1rem 0' }}>
              <Wrench size={44} style={{ color: '#94a3b8', margin: '0 auto 1rem', display: 'block' }} />
              <h3 style={{ fontSize: '1.25rem', color: '#1e293b', fontWeight: 700, marginBottom: '0.5rem' }}>
                Đang cập nhật danh sách dịch vụ
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
                BOSS Đà Nẵng hiện đang cập nhật thêm các gói dịch vụ mới từ hệ thống. Quý khách vui lòng liên hệ hotline để nhận tư vấn và báo giá nhanh nhất!
              </p>
              <a href="tel:0904678323" className="btn-brand-red" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', textDecoration: 'none', color: '#fff', fontWeight: 700, borderRadius: '8px' }}>
                <Phone size={16} /> GỌI KỸ THUẬT: 0904.678.323
              </a>
            </div>
          ) : (
            <div className="news-page-grid">
              {servicesData.map((item, index) => (
                <RevealOnScroll
                  key={item._id || item.id || index}
                  animation="fade-up"
                  delay={(index % 3) * 120}
                  duration={650}
                >
                  <div className="news-page-card">
                    <div className="news-img-wrap">
                      <Link to={`/dich-vu/${getServiceSlug(item)}`}>
                        <img src={formatImgSrc(item.img)} alt={item.title} />
                      </Link>
                      <span className="news-date-badge">
                        <Calendar size={13} /> {item.date || 'Mới cập nhật'}
                      </span>
                    </div>
                    <div className="news-card-content">
                      <h3 className="news-card-title">
                        <Link to={`/dich-vu/${getServiceSlug(item)}`}>
                          {item.title}
                        </Link>
                      </h3>
                      <div className="news-card-summary">
                        {item.desc || (item.content ? item.content.replace(/<[^>]*>?/gm, '').substring(0, 140) + '...' : '')}
                      </div>
                      <Link to={`/dich-vu/${getServiceSlug(item)}`} className="btn-news-readmore">
                        Xem chi tiết <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          )}

        </div>
      </main>

      {/* 5. QUICK BOOKING FORM SECTION */}
      <section className="site293-booking-section" id="quote-form-section">
        <div className="container">
          <RevealOnScroll animation="zoom-in" className="site293-form-card">
            <div className="form-card-title text-center">
              <span>ĐẶT LỊCH KHẢO SÁT & SỬA CỬA TẬN NƠI</span>
              <h3>Đội ngũ kỹ thuật BOSS Đà Nẵng hỗ trợ sau 15-30 phút</h3>
            </div>

            {formSubmitted ? (
              <div className="booking-success-box text-center">
                <CheckCircle2 size={56} className="text-emerald" style={{ margin: '0 auto 1rem' }} />
                <h3>GỬI YÊU CẦU THÀNH CÔNG!</h3>
                <p>Kỹ thuật viên BOSS Đà Nẵng sẽ liên hệ lại cho bạn ngay lập tức.</p>
                <button 
                  className="btn-brand-red" 
                  onClick={() => {
                    setFormData({
                      name: currentUser?.fullName || '',
                      phone: currentUser?.phone || '',
                      district: 'Quận Hải Châu',
                      service: 'Sửa chữa cửa cuốn 24/24',
                      note: ''
                    });
                    setFormSubmitted(false);
                  }}
                >
                  GỬI YÊU CẦU KHÁC
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="site293-real-form">
                <div className="form-row-grid">
                  <div className="form-group-item">
                    <label>Họ và tên của bạn *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Anh Hoàng - Hải Châu"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group-item">
                    <label>Số điện thoại liên hệ *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Nhập SĐT của bạn..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row-grid">
                  <div className="form-group-item">
                    <label>Quận/Huyện tại Đà Nẵng</label>
                    <select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    >
                      <option value="Quận Hải Châu">Quận Hải Châu</option>
                      <option value="Quận Thanh Khê">Quận Thanh Khê</option>
                      <option value="Quận Sơn Trà">Quận Sơn Trà</option>
                      <option value="Quận Ngũ Hành Sơn">Quận Ngũ Hành Sơn</option>
                      <option value="Quận Liên Chiểu">Quận Liên Chiểu</option>
                      <option value="Quận Cẩm Lệ">Quận Cẩm Lệ</option>
                      <option value="Huyện Hòa Vang">Huyện Hòa Vang</option>
                    </select>
                  </div>

                  <div className="form-group-item">
                    <label>Dịch vụ cần tư vấn / sửa chữa</label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    >
                      <option value="Sửa chữa cửa cuốn 24/24">Sửa chữa cửa cuốn 24/24</option>
                      <option value="Lắp đặt cửa cuốn tại Đà Nẵng">Lắp đặt cửa cuốn tại Đà Nẵng</option>
                      <option value="Lắp đặt cửa kéo Đài Loan">Lắp đặt cửa kéo Đài Loan</option>
                      <option value="Sửa chữa cửa kéo, thay nhíp, đạn bạc">Sửa chữa cửa kéo, thay nhíp, đạn bạc</option>
                      <option value="Bảo trì phụ kiện, thay remote, bình UPS">Bảo trì phụ kiện, thay remote, bình UPS</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-item">
                  <label>Ghi chú hoặc mô tả tình trạng hư hỏng</label>
                  <textarea
                    rows="3"
                    placeholder="Nhập chi tiết yêu cầu..."
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  ></textarea>
                </div>

                <div className="text-center" style={{ marginTop: '1.5rem' }}>
                  <button type="submit" className="btn-brand-red">
                    <Send size={18} /> GỬI YÊU CẦU TƯ VẤN NGAY
                  </button>
                </div>
              </form>
            )}
          </RevealOnScroll>
        </div>
      </section>


    </div>
  );
};

export default Services;

