import React from "react";
import { Phone, MapPin, ArrowUp, PhoneCall, MessageCircle, ShieldCheck, Clock, Sparkles } from "lucide-react";

const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const YoutubeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const ZaloIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.14 2 11.25c0 2.93 1.462 5.543 3.754 7.265-.165 1.492-.818 3.233-1.462 4.392a.5.5 0 0 0 .629.707c2.186-.935 4.178-2.242 5.371-3.098.553.092 1.123.144 1.708.144 5.523 0 10-4.14 10-9.25S17.523 2 12 2zm-3.8 12.25v-.96l2.866-3.49H8.5V8.75h4.3v.92l-2.92 3.53h3.02v1.05H8.2zm5.3 0V8.75h1.3v4.55h2.65v1.05H13.5zm5.25 0V8.75h1.3v5.5h-1.3z" />
  </svg>
);

export default function Footer() {
  return (
    <>
      {/* ================= FOOTER ================= */}
      <footer id="contact">
        <div className="container footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <a className="logo footer-logo" href="#home">
              <img src="/logo.png" alt="BOSS" style={{ height: "45px", objectFit: "contain" }} />
            </a>

            <p className="footer-text">
              BOSS chuyên cung cấp và thi công các loại cửa cuốn, cửa tự động, barrier & nhôm kính cao cấp chất lượng vượt trội tại Đà Nẵng và miền Trung.
            </p>

            <div className="socials">
              <a
                href="https://www.facebook.com/cuacuoncuacongtudongdanang"
                target="_blank"
                rel="noreferrer"
                className="social"
                aria-label="Facebook"
              >
                <FacebookIcon size={16} />
              </a>
              <a
                href="https://www.youtube.com/@cuatudongbossdanang"
                target="_blank"
                rel="noreferrer"
                className="social"
                aria-label="YouTube"
              >
                <YoutubeIcon size={16} />
              </a>
              <a
                href="https://zalo.me/0904678323"
                target="_blank"
                rel="noreferrer"
                className="social"
                aria-label="Zalo"
              >
                <ZaloIcon size={17} />
              </a>
              <a href="tel:0904678323" className="social" aria-label="Hotline">
                <Phone size={15} />
              </a>
            </div>

            {/* Mobile Trust Badges */}
            <div className="footer-trust-pills">
              <div className="footer-trust-pill">
                <ShieldCheck size={16} />
                <span>Chính hãng 100%</span>
              </div>
              <div className="footer-trust-pill">
                <Clock size={16} />
                <span>Khảo sát 24/7</span>
              </div>
              <div className="footer-trust-pill">
                <Sparkles size={16} />
                <span>Bảo hành uy tín</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column footer-links-col">
            <h4>LIÊN KẾT NHANH</h4>
            <a href="/">Trang chủ</a>
            <a href="/gioi-thieu">Giới thiệu</a>
            <a href="/san-pham">Sản phẩm</a>
            <a href="/bang-gia">Bảng giá</a>
            <a href="/tin-tuc">Tin tức</a>
            <a href="/lien-he">Liên hệ</a>
          </div>

          {/* Categories */}
          <div className="footer-column footer-products-col">
            <h4>DANH MỤC SẢN PHẨM</h4>
            <a href="/san-pham">Cửa cuốn BossDoor</a>
            <a href="/san-pham">Cửa trượt tự động</a>
            <a href="/san-pham">Barrier & Cổng tự động</a>
            <a href="/san-pham">Cửa nhôm kính Xingfa</a>
            <a href="/san-pham">Phụ kiện chính hãng</a>
          </div>

          {/* Contact Details */}
          <div className="footer-column footer-contact-col">
            <h4>THÔNG TIN LIÊN HỆ</h4>

            <a href="tel:0904678323" className="contact-item contact-item-link">
              <div className="contact-icon-box">
                <Phone size={16} />
              </div>
              <div className="contact-item-info">
                <strong>Hotline / Zalo 24/7:</strong>
                <span className="contact-highlight">0904.678.323</span>
              </div>
            </a>

            <div className="contact-item">
              <div className="contact-icon-box">
                <MapPin size={16} />
              </div>
              <div className="contact-item-info">
                <strong>Địa chỉ xưởng:</strong>
                <span>647 Ngô Quyền, Sơn Trà, Đà Nẵng</span>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon-box">
                <MapPin size={16} />
              </div>
              <div className="contact-item-info">
                <strong>Showroom trưng bày:</strong>
                <span>267 Tô Hiệu, Hòa Khánh, Đà Nẵng</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="copyright">
          <div className="container copyright-inner">
            <div className="copyright-brand">
              © 2026 <strong>BOSS</strong> • Trang web được bảo mật tại{" "}
              <a href="https://latio.vn/" target="_blank" rel="noopener noreferrer">
                Latio
              </a>
            </div>

            <div className="copyright-links">
              <a href="#contact">Chính sách bảo mật</a>
              <span className="copyright-divider">|</span>
              <a href="#contact">Điều khoản sử dụng</a>
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
