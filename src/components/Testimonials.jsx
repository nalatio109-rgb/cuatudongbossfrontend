import React, { useState, useEffect, useRef } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";
import "./Testimonials.css";

const reviews = [
  {
    id: 1,
    name: "Anh Nguyễn Văn Hùng",
    role: "Chủ căn hộ, Quận Hải Châu",
    avatar: "H",
    rating: 5,
    text: "Lắp cửa cuốn cho garage nhà mình, nhân viên tư vấn rất nhiệt tình và chuyên nghiệp. Thi công nhanh gọn chỉ trong 1 buổi sáng. Cửa vận hành êm, đẹp hơn mình tưởng. Rất hài lòng!",
    color: "#07522f",
  },
  {
    id: 2,
    name: "Chị Trần Thị Lan",
    role: "Chủ tiệm, Quận Thanh Khê",
    avatar: "L",
    rating: 5,
    text: "Mình đã lắp cửa kéo inox cho shop thời trang. Chất lượng vượt kỳ vọng, inox sáng bóng, kéo rất nhẹ. Khách vào hay khen cửa đẹp. Boss Đà Nẵng làm việc uy tín, bảo hành chu đáo.",
    color: "#b45309",
  },
  {
    id: 3,
    name: "Anh Lê Minh Tú",
    role: "Kiến trúc sư, Quận Sơn Trà",
    avatar: "T",
    rating: 5,
    text: "Tôi giới thiệu Boss Đà Nẵng cho nhiều dự án rồi. Họ có đủ loại cửa từ phổ thông đến cao cấp, báo giá minh bạch, không phát sinh. Đặc biệt đội thi công làm đúng bản vẽ kỹ thuật.",
    color: "#1d4ed8",
  },
  {
    id: 4,
    name: "Chị Phạm Thu Hà",
    role: "Chủ văn phòng, Quận Ngũ Hành Sơn",
    avatar: "H",
    rating: 5,
    text: "Lắp cửa trượt tự động cho công ty, cảm biến rất nhạy và êm ái. Nhân viên kỹ thuật hướng dẫn sử dụng tận tình. Sau 6 tháng dùng vẫn hoạt động tốt. Sẽ tiếp tục ủng hộ Boss!",
    color: "#7c3aed",
  },
  {
    id: 5,
    name: "Anh Đặng Quốc Bảo",
    role: "Chủ nhà hàng, Quận Cẩm Lệ",
    avatar: "B",
    rating: 5,
    text: "Boss tư vấn lắp barrier tự động cho bãi xe nhà hàng. Hệ thống chạy ổn định, dùng thẻ từ rất tiện. Giá cả cạnh tranh so với thị trường. Nhân viên phản hồi nhanh khi cần hỗ trợ.",
    color: "#0e7490",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoRef = useRef(null);

  const goTo = (idx) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((idx + reviews.length) % reviews.length);
    setTimeout(() => setIsAnimating(false), 400);
  };

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  useEffect(() => {
    autoRef.current = setInterval(next, 5000);
    return () => clearInterval(autoRef.current);
  }, [current]);

  const review = reviews[current];

  return (
    <section className="testimonials-section">
      {/* Background decoration */}
      <div className="testimonials-bg-deco" aria-hidden="true">
        <div className="deco-circle deco-1" />
        <div className="deco-circle deco-2" />
      </div>

      <div className="container">
        <RevealOnScroll animation="fade-up" className="testimonials-header">
          <div className="testimonials-subtitle">
            <span>KHÁCH HÀNG NÓI GÌ</span>
          </div>
          <h2 className="testimonials-title">
            ĐÁNH GIÁ TỪ <span className="text-gold">KHÁCH HÀNG</span>
          </h2>
          <p className="testimonials-desc">
            Hơn 10,000 khách hàng đã tin tưởng và hài lòng với sản phẩm & dịch vụ của chúng tôi.
          </p>
        </RevealOnScroll>

        {/* Stars summary bar */}
        <RevealOnScroll animation="fade-up" delay={100} className="rating-summary">
          <div className="rating-score">4.9</div>
          <div className="rating-stars-big">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={22} fill="#f5bd20" color="#f5bd20" />
            ))}
          </div>
          <div className="rating-count">Từ 10,000+ đánh giá</div>
        </RevealOnScroll>

        {/* Main Card */}
        <RevealOnScroll animation="fade-up" delay={150} className="testimonials-card-wrapper">
          <div className={`testimonials-card ${isAnimating ? "fading" : ""}`}>
            {/* Quote Icon */}
            <div className="quote-icon">
              <Quote size={32} fill="#07522f" color="#07522f" strokeWidth={0} />
            </div>

            {/* Review Text */}
            <p className="review-text">"{review.text}"</p>

            {/* Stars */}
            <div className="review-stars">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} size={18} fill="#f5bd20" color="#f5bd20" />
              ))}
            </div>

            {/* Reviewer Info */}
            <div className="reviewer-info">
              <div
                className="reviewer-avatar"
                style={{ background: review.color }}
              >
                {review.avatar}
              </div>
              <div className="reviewer-meta">
                <strong>{review.name}</strong>
                <span>{review.role}</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="testimonials-nav">
            <button className="nav-btn" onClick={prev} aria-label="Trước">
              <ChevronLeft size={20} />
            </button>
            <div className="nav-dots">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  className={`nav-dot ${i === current ? "active" : ""}`}
                  onClick={() => goTo(i)}
                  aria-label={`Đánh giá ${i + 1}`}
                />
              ))}
            </div>
            <button className="nav-btn" onClick={next} aria-label="Tiếp">
              <ChevronRight size={20} />
            </button>
          </div>
        </RevealOnScroll>

        {/* Mini cards row */}
        <RevealOnScroll animation="fade-up" delay={200} className="mini-reviews-row">
          {reviews.map((r, i) => (
            <button
              key={r.id}
              className={`mini-review-card ${i === current ? "active" : ""}`}
              onClick={() => goTo(i)}
            >
              <div className="mini-avatar" style={{ background: r.color }}>
                {r.avatar}
              </div>
              <div className="mini-meta">
                <strong>{r.name.split(" ").slice(-2).join(" ")}</strong>
                <div className="mini-stars">
                  {[...Array(5)].map((_, si) => (
                    <Star key={si} size={10} fill="#f5bd20" color="#f5bd20" />
                  ))}
                </div>
              </div>
            </button>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
