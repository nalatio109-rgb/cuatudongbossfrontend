import React from "react";
import { Phone, Mail, MapPin, ArrowUp, Leaf, PhoneCall, MessageCircle } from "lucide-react";

const FacebookIcon = ({ size = 21 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export default function Footer() {

  return (
    <>
      {/* ================= FOOTER ================= */}

      <footer id="contact">

        <div className="container footer-grid">

          <div className="footer-brand">
            <a className="logo footer-logo" href="#home">
              <img src="/logo.png" alt="BOSS" style={{ height: '45px', objectFit: 'contain' }} />
            </a>

            <p className="footer-text">
              BOSS chuyên cung cấp và thi công các loại cửa cuốn, cửa tự động, barrier & nhôm kính cao cấp chất lượng vượt trội tại Đà Nẵng và miền Trung.
            </p>

            <div className="socials">
              <a href="https://www.facebook.com/cuacuoncuacongtudongdanang" target="_blank" rel="noreferrer" className="social">f</a>
              <a href="https://www.youtube.com/@cuatudongbossdanang" target="_blank" rel="noreferrer" className="social">▶</a>
              <a href="https://zalo.me/0904678323" target="_blank" rel="noreferrer" className="social">Z</a>
              <a href="tel:0904678323" className="social">📞</a>
            </div>
          </div>

          <div className="footer-column">
            <h4>LIÊN KẾT NHANH</h4>
            <a href="/">Trang chủ</a>
            <a href="/gioi-thieu">Giới thiệu</a>
            <a href="/san-pham">Sản phẩm</a>
            <a href="/du-an">Dự án</a>
            <a href="/tin-tuc">Tin tức</a>
            <a href="/lien-he">Liên hệ</a>
          </div>

          <div className="footer-column">
            <h4>DANH MỤC SẢN PHẨM</h4>
            <a href="/san-pham">Cửa cuốn BossDoor</a>
            <a href="/san-pham">Cửa trượt tự động</a>
            <a href="/san-pham">Barrier & Cổng tự động</a>
            <a href="/san-pham">Cửa nhôm kính Xingfa</a>
            <a href="/san-pham">Phụ kiện chính hãng</a>
          </div>

          <div className="footer-column">
            <h4>THÔNG TIN LIÊN HỆ</h4>

            <div className="contact-item">
              <Phone size={16} style={{ color: '#f5bd20', flexShrink: 0, marginTop: '2px' }} />
              <span>
                <strong>Hotline/Zalo:</strong> <a href="tel:0904678323" style={{ color: '#f5bd20', fontWeight: 'bold' }}>0904.678.323</a>
              </span>
            </div>

            <div className="contact-item">
              <MapPin size={16} style={{ color: '#f5bd20', flexShrink: 0, marginTop: '2px' }} />
              <span>
                <strong>Địa chỉ:</strong> 647 Ngô Quyền, Sơn Trà, Đà Nẵng
              </span>
            </div>

            <div className="contact-item">
              <MapPin size={16} style={{ color: '#f5bd20', flexShrink: 0, marginTop: '2px' }} />
              <span>
                <strong>Showroom:</strong> 267 Tô Hiệu, Hòa Khánh, Đà Nẵng
              </span>
            </div>
          </div>
        </div>

        <div className="copyright">
          <div className="container copyright-inner">
            <div>
              © 2026 BOSS| Trang web được bảo mật tại <a href="https://latio.vn/" target="_blank" rel="noopener noreferrer" style={{ color: '#f5bd20', fontWeight: 'bold', textDecoration: 'underline' }}>Latio</a>
            </div>

            <div>
              Chính sách bảo mật
              &nbsp;&nbsp; | &nbsp;&nbsp;
              Điều khoản sử dụng
            </div>

          </div>

        </div>

      </footer>

      {/* ================= FLOATING BUTTONS SYSTEM ================= */}
      <div className="floating-buttons-container">
        {/* Hotline Button */}
        <a 
          href="tel:0904678323" 
          className="floating-btn btn-hotline" 
          aria-label="Gọi ngay 0904.678.323"
        >
          <span className="floating-tooltip">Gọi ngay: 0904 678 323</span>
          <div className="pulse-ring"></div>
          <PhoneCall size={21} />
        </a>

        {/* Zalo / Chat Button */}
        <a 
          href="https://zalo.me/0904678323" 
          target="_blank" 
          rel="noreferrer" 
          className="floating-btn btn-zalo" 
          aria-label="Chat Zalo"
        >
          <span className="floating-tooltip">Chat Zalo hỗ trợ</span>
          <MessageCircle size={21} />
        </a>

        {/* Facebook Fanpage Button */}
        <a 
          href="https://www.facebook.com/cuacuoncuacongtudongdanang" 
          target="_blank" 
          rel="noreferrer" 
          className="floating-btn btn-facebook" 
          aria-label="Facebook Fanpage"
        >
          <span className="floating-tooltip">Fanpage Facebook</span>
          <FacebookIcon size={21} />
        </a>

        {/* Back To Top Button */}
        <a 
          href="#home" 
          className="floating-btn btn-top" 
          aria-label="Về đầu trang"
        >
          <span className="floating-tooltip">Về đầu trang</span>
          <ArrowUp size={21} />
        </a>
      </div>

    </>
  );
}
