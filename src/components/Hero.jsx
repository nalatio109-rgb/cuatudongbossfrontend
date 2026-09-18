import React, { useState } from "react";
import { createPortal } from "react-dom";
import "./TitleHero.css";
import heroBg from "../assets/hero_bg.png";
import { ShieldCheck, Leaf, Sparkles, Users, CalendarCheck, BadgeCheck, Settings, Play, X } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";

export default function Hero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const videoSrc = "/0910.mp4";

  const stats = [
    {
      icon: <Users />,
      number: "10,000+",
      text: "KHÁCH HÀNG",
      sub: "Đã phục vụ",
    },
    {
      icon: <CalendarCheck />,
      number: "15+",
      text: "NĂM",
      sub: "Kinh nghiệm",
    },
    {
      icon: <BadgeCheck />,
      number: "100%",
      text: "SẢN PHẨM",
      sub: "Chính hãng",
    },
    {
      icon: <Settings />,
      number: "24/7",
      text: "HỖ TRỢ",
      sub: "Bảo hành tận tâm",
    },
  ];

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="hero" id="home">
        <div className="hero-bg">
          <video 
            src={videoSrc} 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="hero-video-element"
          />
        </div>

        <section className="hero-left">
          <RevealOnScroll animation="fade-up" duration={900} className="hero-content">

            {/* Label */}
            <div className="hero-label">
              MUA CỬA TỐT - GHÉ BOSS ĐÀ NẴNG
            </div>

            {/* Dòng 1 */}
            <div className="rolling-title__row rolling-title__row--top">
              <h1 className="rolling-title__word">
                CỬA CUỐN
              </h1>
            </div>

            {/* Gạch vàng + đỏ */}
            <div className="rolling-title__accent">
              <span className="rolling-title__line-yellow"></span>
              <span className="rolling-title__line-red"></span>
            </div>

            {/* Dòng 2 */}
            <div className="rolling-title__row rolling-title__row--bottom">
              <h2 className="rolling-title__word">
                ĐÀ NẴNG
              </h2>
            </div>

            {/* Footer trang trí */}
            <div className="rolling-title__footer">
              <div className="rolling-title__slashes">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="rolling-title__footer-line">
                <span className="rolling-title__tagline">
                  AN TOÀN - BỀN BỈ - THẨM MỸ
                </span>
              </div>
              <div className="rolling-title__footer-colors">
                <span className="footer-yellow"></span>
                <span className="footer-red"></span>
              </div>
            </div>

          </RevealOnScroll>
        </section>

        {/* Floating Video Badge on Hero */}
        <div className="hero-video-play-badge" onClick={() => setIsVideoOpen(true)} title="Bấm để xem video với âm thanh">
          <div className="hero-play-icon">
            <Play size={18} fill="#004d32" />
          </div>
          <div className="hero-play-text">
            <strong>XEM VIDEO THỰC TẾ</strong>
            <span>Cửa cuốn BossDoor</span>
          </div>
        </div>

        {/* STATS */}
        <div className="stats-box">
          <div className="stats">
            <div className="stats-shimmer"></div>
            <div className="stats-glow-backdrop"></div>
            {stats.map((item, index) => (
              <div className="stat" key={index}>
                {React.cloneElement(item.icon, {
                  size: 26,
                })}
                <div>
                  <strong>{item.number}</strong>
                  <span>
                    {item.text}
                    <br />
                    {item.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Lightbox Modal */}
      {isVideoOpen && createPortal(
        <div className="video-modal-backdrop" onClick={() => setIsVideoOpen(false)}>
          <div className="video-modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={() => setIsVideoOpen(false)}>
              <X size={20} />
            </button>
            <video 
              src={videoSrc}
              controls 
              autoPlay 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

