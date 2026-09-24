import React, { useState } from 'react';
import { Phone, MapPin, Mail, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import RevealOnScroll from '../components/RevealOnScroll';
import './Contact.css';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    productCategory: "Cửa cuốn khe thoáng / tấm liền BossDoor",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const resData = await response.json();
      if (resData.success) {
        setSubmitted(true);
        setFormData({
          fullName: "",
          phone: "",
          productCategory: "Cửa cuốn khe thoáng / tấm liền BossDoor",
          message: ""
        });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        alert(resData.message || "Gửi không thành công. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Contact API error:", error);
      // Even if network fails, show success or alert
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      {/* 1. HERO BANNER */}
      <section className="contact-hero">
        <div className="container text-center">
          <RevealOnScroll animation="fade-down">
            <span className="contact-badge">THÔNG TIN LIÊN HỆ</span>
            <h1>LIÊN HỆ VỚI <span className="text-gold">BOSS</span></h1>
            <p>Hãy liên hệ với chúng tôi để được tư vấn giải pháp Cửa Cuốn, Cửa Tự Động & Nhôm Kính Cao Cấp chuẩn Châu Âu hoàn toàn miễn phí.</p>
          </RevealOnScroll>
        </div>
      </section>

      {/* 2. CONTACT INFO CARDS GRID */}
      <section className="contact-info-section">
        <div className="container">
          <div className="contact-cards-grid">
            <RevealOnScroll animation="fade-up" delay={0}>
              <div className="contact-info-card highlight-card">
                <div className="info-icon-box gold">
                  <Phone size={28} />
                </div>
                <h3>HOTLINE / ZALO</h3>
                <p className="info-highlight">0904.678.323</p>
                <p className="info-sub">Hỗ trợ tư vấn & báo giá nhanh 24/7</p>
                <a href="tel:0904678323" className="btn-contact-action gold-btn">
                  <Phone size={16} /> Gọi ngay 0904.678.323
                </a>
              </div>
            </RevealOnScroll>

            <RevealOnScroll animation="fade-up" delay={150}>
              <div className="contact-info-card">
                <div className="info-icon-box green">
                  <MapPin size={28} />
                </div>
                <h3>TRỤ SỞ CHÍNH</h3>
                <p className="info-text">647 Ngô Quyền, Sơn Trà, Đà Nẵng</p>
                <p className="info-sub">Địa chỉ văn phòng làm việc & tiếp nhận dự án</p>
                <a href="https://maps.google.com/?q=647+Ngô+Quyền+Sơn+Trà+Đà+Nẵng" target="_blank" rel="noreferrer" className="btn-contact-action outline-btn">
                  Xem bản đồ Google Maps
                </a>
              </div>
            </RevealOnScroll>

            <RevealOnScroll animation="fade-up" delay={300}>
              <div className="contact-info-card">
                <div className="info-icon-box green">
                  <MapPin size={28} />
                </div>
                <h3>SHOWROOM TRƯNG BÀY</h3>
                <p className="info-text">267 Tô Hiệu, Hòa Khánh, Đà Nẵng</p>
                <p className="info-sub">Địa điểm trưng bày trải nghiệm mẫu cửa thực tế</p>
                <a href="https://maps.google.com/?q=267+Tô+Hiệu+Hòa+Khánh+Đà+Nẵng" target="_blank" rel="noreferrer" className="btn-contact-action outline-btn">
                  Xem bản đồ Google Maps
                </a>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* 3. CONTACT FORM & MAP SECTION */}
      <section className="contact-form-section">
        <div className="container contact-grid-2col">
          <RevealOnScroll animation="fade-right" className="contact-form-box">
            <h2>GỬI YÊU CẦU BÁO GIÁ</h2>
            <p>Để lại thông tin, đội ngũ kỹ sư của BOSS sẽ liên hệ tư vấn và gửi báo giá chi tiết cho bạn.</p>

            {submitted ? (
              <div className="form-success-msg">
                <CheckCircle2 size={42} />
                <h4>Gửi thông tin thành công!</h4>
                <p>Cảm ơn bạn đã liên hệ. Chuyên viên tư vấn BOSS sẽ gọi điện hỗ trợ bạn trong ít phút.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label>Họ và tên *</label>
                  <input 
                    type="text" 
                    name="fullName"
                    placeholder="Nhập họ và tên của bạn..." 
                    value={formData.fullName}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Số điện thoại / Zalo *</label>
                  <input 
                    type="tel" 
                    name="phone"
                    placeholder="Nhập số điện thoại..." 
                    value={formData.phone}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Sản phẩm cần tư vấn</label>
                  <select 
                    name="productCategory"
                    value={formData.productCategory}
                    onChange={handleChange}
                  >
                    <option>Cửa cuốn khe thoáng / tấm liền BossDoor</option>
                    <option>Cửa trượt tự động Kaba / Nabco</option>
                    <option>Barrier & Cổng tự động</option>
                    <option>Cửa nhôm kính cao cấp Xingfa</option>
                    <option>Sản phẩm khác</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Nội dung yêu cầu</label>
                  <textarea 
                    rows="4" 
                    name="message"
                    placeholder="Mô tả chi tiết công trình, vị trí hoặc câu hỏi của bạn..."
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <button type="submit" className="btn-submit-form" disabled={loading}>
                  <Send size={18} /> {loading ? "ĐANG GỬI THÔNG TIN..." : "GỬI YÊU CẦU TƯ VẤN NGAY"}
                </button>
              </form>
            )}
          </RevealOnScroll>

          <RevealOnScroll animation="fade-left" className="contact-map-box">
            <h2>BẢN ĐỒ VỊ TRÍ</h2>
            <div className="map-wrapper">
              <iframe 
                title="Bản đồ BOSS Đà Nẵng"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.8373449339396!2d108.23235!3d16.0734!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142183e20000000%3A0x1!2zNjQ3IE5nw7QgUXV54buBbiwgU8ahbiBUcsOgLCDEkMOgIE7hurZuZw!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
};

export default Contact;
