import React, { useState, useEffect, useCallback } from "react";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";

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

  const goTo = useCallback((idx) => {
    setCurrent((idx + reviews.length) % reviews.length);
    setIsAnimating(true);
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % reviews.length);
    setIsAnimating(true);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
    setIsAnimating(true);
  }, []);

  // Tự động chuyển đánh giá sau mỗi 6 giây
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  // Reset animation khi nội dung đánh giá thay đổi
  useEffect(() => {
    if (!isAnimating) return;

    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [isAnimating, current]);

  const review = reviews[current];

  return (
    <section className="testimonials-section">
      {/* Background decoration */}
      <div className="testimonials-bg-deco" aria-hidden="true">
        <div className="testimonials-deco-circle deco-1" />
        <div className="testimonials-deco-circle deco-2" />
      </div>

      <div className="container testimonials-container">
        {/* Section heading */}
        <RevealOnScroll
          animation="fade-up"
          className="testimonials-heading"
        >
          <span className="testimonials-eyebrow">
            <span className="eyebrow-line" />
            KHÁCH HÀNG CỦA CHÚNG TÔI
            <span className="eyebrow-line" />
          </span>

          <h2 className="testimonials-title">
            NIỀM TIN

            TỪ <span>TRẢI NGHIỆM THỰC TẾ</span>
          </h2>

          <p className="testimonials-desc">
            Sự hài lòng của khách hàng là động lực để Boss Đà Nẵng
            không ngừng nâng cao chất lượng sản phẩm và dịch vụ.
          </p>
        </RevealOnScroll>

        {/* Main two-column layout */}
        <div className="testimonials-layout">
          {/* LEFT COLUMN: slide in from left */}
          <RevealOnScroll
            animation="fade-left"
            className="testimonials-left-reveal"
          >
            <div className="testimonials-intro">
              <div className="intro-tag">
                <MessageCircle size={15} />
                CHIA SẺ TỪ KHÁCH HÀNG
              </div>

              <h3 className="intro-title">
                Mỗi công trình
                <br />
                là một <span>niềm tin.</span>
              </h3>

              <p className="intro-description">
                Không chỉ cung cấp sản phẩm, Boss Đà Nẵng còn mang đến
                giải pháp phù hợp và sự đồng hành lâu dài trong từng công trình.
              </p>

              <div className="rating-overview">
                <div className="rating-number">4.9</div>

                <div className="rating-overview-info">
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={17}
                        fill="#f5bd20"
                        color="#f5bd20"
                      />
                    ))}
                  </div>

                  <strong>Đánh giá tích cực</strong>
                  <span>Từ 10,000+ lượt đánh giá</span>
                </div>
              </div>

              <div className="intro-bottom">
                <div className="customer-stack">
                  {reviews.slice(0, 4).map((r) => (
                    <div
                      key={r.id}
                      className="stack-avatar"
                      style={{ background: r.color }}
                    >
                      {r.avatar}
                    </div>
                  ))}
                </div>

                <span>Những khách hàng đã tin tưởng Boss</span>
              </div>
            </div>
          </RevealOnScroll>

          {/* RIGHT COLUMN: slide in from right */}
          <RevealOnScroll
            animation="fade-right"
            className="testimonials-right-reveal"
          >
            <div className="testimonial-feature">
              <div className="feature-card">
                <div className="feature-card-top">
                  <div className="quote-mark">
                    <Quote size={29} fill="currentColor" />
                  </div>

                  <span className="verified-label">
                    <span className="verified-dot" />
                    KHÁCH HÀNG CHIA SẺ
                  </span>
                </div>

                <div
                  key={review.id}
                  className={`feature-review-content ${isAnimating ? "review-animate" : ""
                    }`}
                >
                  <div className="feature-stars">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={17}
                        fill="#f5bd20"
                        color="#f5bd20"
                      />
                    ))}
                  </div>

                  <p className="feature-review-text">
                    “{review.text}”
                  </p>

                  <div className="feature-reviewer">
                    <div
                      className="feature-avatar"
                      style={{ background: review.color }}
                    >
                      {review.avatar}
                    </div>

                    <div className="feature-reviewer-info">
                      <strong>{review.name}</strong>
                      <span>{review.role}</span>
                    </div>

                    <div className="reviewer-arrow">
                      <ArrowUpRight size={20} />
                    </div>
                  </div>
                </div>

                <div className="feature-card-footer">
                  <span>
                    Đánh giá{" "}
                    <strong>
                      {String(current + 1).padStart(2, "0")}
                    </strong>
                    {" / "}
                    {String(reviews.length).padStart(2, "0")}
                  </span>

                  <div className="feature-controls">
                    <button
                      type="button"
                      onClick={prev}
                      aria-label="Đánh giá trước"
                    >
                      <ChevronLeft size={19} />
                    </button>

                    <button
                      type="button"
                      onClick={next}
                      aria-label="Đánh giá tiếp theo"
                    >
                      <ChevronRight size={19} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>

        {/* Customer selection */}
        <RevealOnScroll
          animation="fade-up"
          delay={150}
          className="testimonials-list-section"
        >
          <div className="list-heading">
            <div>
              <span className="list-eyebrow">
                KHÁCH HÀNG TIÊU BIỂU
              </span>
              <h3>Lắng nghe những chia sẻ khác</h3>
            </div>

            <span className="list-count">
              {String(reviews.length).padStart(2, "0")} ĐÁNH GIÁ
            </span>
          </div>

          <div className="mini-reviews-row">
            {reviews.map((r, i) => (
              <button
                type="button"
                key={r.id}
                className={`mini-review-card ${i === current ? "active" : ""
                  }`}
                onClick={() => goTo(i)}
                aria-pressed={i === current}
                aria-label={`Xem đánh giá của ${r.name}`}
              >
                <div
                  className="mini-avatar"
                  style={{ background: r.color }}
                >
                  {r.avatar}
                </div>

                <div className="mini-meta">
                  <strong>{r.name}</strong>
                  <span>{r.role}</span>
                </div>

                <ChevronRight className="mini-arrow" size={17} />
              </button>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}