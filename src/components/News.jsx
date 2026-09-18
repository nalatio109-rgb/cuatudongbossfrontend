import React from "react";
import { ArrowRight, Headphones, Phone } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";

export default function News() {
  const newsList = [
    {
      image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=600&q=80",
      date: "26/05/2024",
      title: "Cách chọn cửa cuốn phù hợp cho ngôi nhà của bạn",
    },
    {
      image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=600&q=80",
      date: "15/05/2024",
      title: "Ưu điểm của cửa tự động trong không gian hiện đại",
    },
    {
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80",
      date: "10/05/2024",
      title: "Cửa khe thoáng - Giải pháp lấy sáng và lưu thông khí",
    },
  ];

  return (
    <>
      {/* ================= NEWS ================= */}
      <section className="news-section" id="news">
        <div className="container news-grid-layout">
          <RevealOnScroll animation="fade-left" className="news-left">
            <h2 className="news-title">TIN TỨC - KIẾN THỨC</h2>
            <div className="news-cards">
              {newsList.map((news, index) => (
                <RevealOnScroll
                  key={index}
                  animation="fade-up"
                  delay={index * 130}
                  className="news-card"
                >
                  <img src={news.image} alt={news.title} />
                  <div className="news-content">
                    <span className="news-date">{news.date}</span>
                    <h3 className="news-card-title">{news.title}</h3>
                    <a href="#news" className="news-link">XEM THÊM <ArrowRight size={14} /></a>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </RevealOnScroll>

          <RevealOnScroll animation="fade-right" delay={200} className="news-right">
            <div className="newsletter-box consult-sidebar-box">
              <div className="consult-sidebar-icon">
                <Headphones size={32} strokeWidth={1.8} />
              </div>
              <h3>BẠN CẦN TƯ VẤN & BÁO GIÁ MIỄN PHÍ?</h3>
              <p>Đội ngũ kỹ sư & chuyên viên kinh nghiệm sẵn sàng hỗ trợ khảo sát tận nơi 24/7.</p>
              
              <a href="tel:0904678323" className="btn-consult-sidebar">
                <Phone size={16} /> LIÊN HỆ TƯ VẤN NGAY
              </a>

              <div className="follow-us">
                <span>Theo dõi chúng tôi</span>
                <div className="social-icons">
                  <a href="https://facebook.com" target="_blank" rel="noreferrer">f</a>
                  <a href="https://youtube.com" target="_blank" rel="noreferrer">▶</a>
                  <a href="https://zalo.me/0904678323" target="_blank" rel="noreferrer">Z</a>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}

