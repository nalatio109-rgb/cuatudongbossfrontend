import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  MessageCircle,
  ArrowUpRight,
  PenLine,
  Image as ImageIcon,
  Video as VideoIcon,
  X,
  CheckCircle2,
  BadgeCheck,
  Lock,
  User,
  Trash2,
  Sparkles,
} from "lucide-react";

import RevealOnScroll from "./RevealOnScroll";
import { useAuth } from "../context/AuthContext";
import "./Testimonials.css";

const formatReviewDate = (val) => {
  if (!val) return "";
  try {
    if (typeof val === "string" && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(val.trim())) {
      return val.trim();
    }
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    }
  } catch (_) {}
  return String(val);
};

const DEFAULT_REVIEWS = [
  {
    id: 1,
    name: "Anh Nguyễn Văn Hùng",
    role: "",
    avatar: "H",
    rating: 5,
    text: "Lắp cửa cuốn cho garage nhà mình, nhân viên tư vấn rất nhiệt tình và chuyên nghiệp. Thi công nhanh gọn chỉ trong 1 buổi sáng. Cửa vận hành êm, đẹp hơn mình tưởng. Rất hài lòng!",
    color: "#07522f",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    verified: true,
    createdAt: "2026-11-10",
  },
  {
    id: 2,
    name: "Chị Trần Thị Lan",
    role: "",
    avatar: "L",
    rating: 5,
    text: "Mình đã lắp cửa kéo inox cho shop thời trang. Chất lượng vượt kỳ vọng, inox sáng bóng, kéo rất nhẹ. Khách vào hay khen cửa đẹp. Boss Đà Nẵng làm việc uy tín, bảo hành chu đáo.",
    color: "#b45309",
    verified: true,
    createdAt: "2026-11-09",
  },
  {
    id: 3,
    name: "Anh Lê Minh Tú",
    role: "",
    avatar: "T",
    rating: 5,
    text: "Tôi giới thiệu Boss Đà Nẵng cho nhiều dự án rồi. Họ có đủ loại cửa từ phổ thông đến cao cấp, báo giá minh bạch, không phát sinh. Đặc biệt đội thi công làm đúng bản vẽ kỹ thuật.",
    color: "#1d4ed8",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80",
    verified: true,
    createdAt: "2026-11-08",
  },
  {
    id: 4,
    name: "Chị Phạm Thu Hà",
    role: "",
    avatar: "H",
    rating: 5,
    text: "Lắp cửa trượt tự động cho công ty, cảm biến rất nhạy và êm ái. Nhân viên kỹ thuật hướng dẫn sử dụng tận tình. Sau 6 tháng dùng vẫn hoạt động tốt. Sẽ tiếp tục ủng hộ Boss!",
    color: "#7c3aed",
    verified: true,
    createdAt: "2026-11-07",
  },
  {
    id: 5,
    name: "Anh Đặng Quốc Bảo",
    role: "",
    avatar: "B",
    rating: 5,
    text: "Boss tư vấn lắp barrier tự động cho bãi xe nhà hàng. Hệ thống chạy ổn định, dùng thẻ từ rất tiện. Giá cả cạnh tranh so với thị trường. Nhân viên phản hồi nhanh khi cần hỗ trợ.",
    color: "#0e7490",
    verified: true,
    createdAt: "2026-11-06",
  },
];

export default function Testimonials() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Reviews state with localStorage persistence
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem("boss_customer_reviews");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cleaned = parsed.map((item) => ({ ...item, role: "" }));
          try {
            localStorage.setItem("boss_customer_reviews", JSON.stringify(cleaned));
          } catch (_) { }
          return cleaned;
        }
      }
    } catch (_) { }
    return DEFAULT_REVIEWS;
  });

  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Tính toán điểm số trung bình và số lượng đánh giá thực tế từ dữ liệu
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / totalReviews).toFixed(1)
    : "5.0";

  const renderRealisticStars = (score) => {
    const numericScore = parseFloat(score) || 5;
    return (
      <div className="rating-stars" title={`${numericScore} / 5 sao`} aria-label={`${numericScore} trên 5 sao`}>
        {[0, 1, 2, 3, 4].map((index) => {
          const fillAmount = Math.max(0, Math.min(1, numericScore - index));
          return (
            <div
              key={index}
              style={{
                position: "relative",
                display: "inline-block",
                width: 15,
                height: 15,
                flexShrink: 0,
              }}
            >
              <Star
                size={15}
                color="#cbd5e1"
                fill="#e2e8f0"
                style={{ position: "absolute", top: 0, left: 0 }}
              />
              {fillAmount > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: `${fillAmount * 100}%`,
                    overflow: "hidden",
                    height: "100%",
                  }}
                >
                  <Star size={15} color="#f5bd20" fill="#f5bd20" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Nạp danh sách đánh giá từ MongoDB backend API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const backendBase = import.meta.env.VITE_API_URL || "";
        const res = await fetch(`${backendBase}/api/reviews`);
        const json = await res.json();
        if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
          const normalized = json.data.map((item) => ({
            ...item,
            id: item._id || item.id,
            role: "",
          }));
          setReviews(normalized);
          try {
            localStorage.setItem("boss_customer_reviews", JSON.stringify(normalized));
          } catch (_) { }
        }
      } catch (_) { }
    };
    fetchReviews();
  }, []);

  // Review Modal state
  const [showModal, setShowModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [lightboxMedia, setLightboxMedia] = useState(null);

  // Form fields
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [role, setRole] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [mediaType, setMediaType] = useState(null); // 'image' | 'video' | null
  const [mediaUrl, setMediaUrl] = useState("");
  const [videoUrlInput, setVideoUrlInput] = useState("");
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const modalBodyRef = useRef(null);

  // Tự động cuộn xuống khi đính kèm hình ảnh/video để người dùng nhìn thấy ngay
  useEffect(() => {
    if (mediaUrl && modalBodyRef.current) {
      setTimeout(() => {
        if (modalBodyRef.current) {
          modalBodyRef.current.scrollTo({
            top: modalBodyRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 80);
    }
  }, [mediaUrl]);

  const goTo = useCallback((idx) => {
    if (reviews.length === 0) return;
    setCurrent((idx + reviews.length) % reviews.length);
    setIsAnimating(true);
  }, [reviews.length]);

  const next = useCallback(() => {
    if (reviews.length === 0) return;
    setCurrent((prev) => (prev + 1) % reviews.length);
    setIsAnimating(true);
  }, [reviews.length]);

  const prev = useCallback(() => {
    if (reviews.length === 0) return;
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
    setIsAnimating(true);
  }, [reviews.length]);

  // Tự động chuyển đánh giá sau mỗi 6 giây (chỉ chạy khi modal đóng)
  useEffect(() => {
    if (showModal || showLoginPrompt || lightboxMedia) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, showModal, showLoginPrompt, lightboxMedia]);

  // Reset animation khi nội dung đánh giá thay đổi
  useEffect(() => {
    if (!isAnimating) return;
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [isAnimating, current]);

  // Handle open review form
  const handleOpenReview = () => {
    if (!currentUser) {
      setShowLoginPrompt(true);
    } else {
      setShowModal(true);
    }
  };

  // Image Upload handler
  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      alert("Dung lượng file ảnh quá lớn (vui lòng chọn dưới 15MB).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setMediaType("image");
      setMediaUrl(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Video Upload handler
  const handleVideoFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      alert("Dung lượng video quá lớn (vui lòng chọn dưới 50MB).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setMediaType("video");
      setMediaUrl(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle paste video link
  const handleAddVideoLink = () => {
    if (!videoUrlInput.trim()) return;
    setMediaType("video");
    setMediaUrl(videoUrlInput.trim());
    setVideoUrlInput("");
  };

  // Submit review
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!currentUser) {
      setShowLoginPrompt(true);
      return;
    }
    if (!reviewText.trim()) {
      alert("Vui lòng nhập nội dung đánh giá của bạn.");
      return;
    }

    const userName = currentUser.fullName || currentUser.email.split("@")[0];
    const initial = (currentUser.fullName || currentUser.email || "K")[0].toUpperCase();

    const brandColors = ["#07522f", "#1d4ed8", "#b45309", "#7c3aed", "#0e7490", "#047857"];
    const randomColor = brandColors[Math.floor(Math.random() * brandColors.length)];

    const newReview = {
      id: Date.now(),
      name: userName,
      email: currentUser.email,
      role: role.trim() || "",
      avatar: initial,
      rating: rating,
      text: reviewText.trim(),
      color: randomColor,
      mediaType: mediaType,
      mediaUrl: mediaUrl,
      verified: true,
      createdAt: new Date().toLocaleDateString("vi-VN"),
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem("boss_customer_reviews", JSON.stringify(updated));
    } catch (_) { }

    // Gửi đánh giá lên MongoDB backend
    try {
      const backendBase = import.meta.env.VITE_API_URL || "";
      fetch(`${backendBase}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json && json.success && json.data) {
            setReviews((prev) =>
              prev.map((r) =>
                r.id === newReview.id
                  ? { ...r, _id: json.data._id, id: json.data._id }
                  : r
              )
            );
          }
        })
        .catch(() => { });
    } catch (_) { }

    setCurrent(0);
    setIsAnimating(true);
    setSubmittedSuccess(true);

    setTimeout(() => {
      setSubmittedSuccess(false);
      setShowModal(false);
      setReviewText("");
      setRole("");
      setMediaType(null);
      setMediaUrl("");
    }, 1800);
  };

  const review = reviews[current] || reviews[0] || DEFAULT_REVIEWS[0];

  return (
    <section className="testimonials-section">
      {/* Background decoration */}
      <div className="testimonials-bg-deco" aria-hidden="true">
        <div className="testimonials-deco-circle deco-1" />
        <div className="testimonials-deco-circle deco-2" />
      </div>

      <div className="container testimonials-container">
        {/* Section heading */}
        <RevealOnScroll animation="fade-down" className="testimonials-heading">
          <span className="testimonials-eyebrow">
            <span className="eyebrow-line" />
            KHÁCH HÀNG CỦA CHÚNG TÔI
            <span className="eyebrow-line" />
          </span>

          <h2 className="testimonials-title">
            NIỀM TIN TỪ <span>TRẢI NGHIỆM THỰC TẾ</span>
          </h2>
        </RevealOnScroll>

        {/* Main two-column layout */}
        <div className="testimonials-layout">
          {/* LEFT COLUMN */}
          <RevealOnScroll animation="fade-left" className="testimonials-left-reveal">
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

              <div
                className="rating-overview"
                title={`Đánh giá trung bình ${avgRating}/5 từ ${totalReviews} nhận xét thực tế`}
              >
                <div className="rating-number">{avgRating}</div>

                <div className="rating-overview-info">
                  {renderRealisticStars(avgRating)}
                  <strong>Đánh giá thực tế</strong>
                  <span>Dựa trên {totalReviews} nhận xét khách hàng</span>
                </div>
              </div>

              <div className="intro-bottom">
                <div className="customer-stack">
                  {reviews.slice(0, 4).map((r) => (
                    <div
                      key={r.id}
                      className="stack-avatar"
                      style={{ background: r.color || "#07522f" }}
                    >
                      {r.avatar}
                    </div>
                  ))}
                </div>

                <span>Những khách hàng đã tin tưởng Boss</span>
              </div>

              {/* Nút Viết Đánh Giá Của Bạn */}
              <div className="write-review-action">
                <button
                  type="button"
                  className="btn-write-review"
                  onClick={handleOpenReview}
                >
                  <PenLine size={15} /> Viết đánh giá của bạn
                </button>
                {currentUser && (
                  <span className="logged-user-hint">
                    <User size={12} /> Đang đăng nhập: <strong>{currentUser.fullName || currentUser.email}</strong>
                  </span>
                )}
              </div>
            </div>
          </RevealOnScroll>

          {/* RIGHT COLUMN */}
          <RevealOnScroll animation="fade-right" className="testimonials-right-reveal">
            <div className="testimonial-feature">
              <div className="feature-card">
                <div className="feature-card-top">
                  <div className="quote-mark">
                    <Quote size={24} fill="currentColor" />
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
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <Star key={i} size={15} fill="#f5bd20" color="#f5bd20" />
                    ))}
                  </div>

                  <p className="feature-review-text">“{review.text}”</p>

                  {/* Hiển thị Hình ảnh hoặc Video đính kèm nếu có */}
                  {review.mediaUrl && (
                    <div className="review-media-box">
                      {review.mediaType === "video" ? (
                        <div className="review-media-video">
                          {review.mediaUrl.includes("youtube.com") || review.mediaUrl.includes("youtu.be") ? (
                            <iframe
                              src={review.mediaUrl.replace("watch?v=", "embed/")}
                              title="Video đánh giá thực tế"
                              allowFullScreen
                            />
                          ) : (
                            <video src={review.mediaUrl} controls playsInline preload="metadata" />
                          )}
                          <span className="media-badge">
                            <VideoIcon size={12} /> Video thực tế
                          </span>
                        </div>
                      ) : (
                        <div
                          className="review-media-image"
                          onClick={() => setLightboxMedia(review.mediaUrl)}
                          title="Nhấn để xem ảnh phóng to"
                        >
                          <img src={review.mediaUrl} alt="Hình ảnh công trình thực tế" />
                          <span className="media-badge">
                            <ImageIcon size={12} /> Ảnh thực tế (Nhấn xem lớn)
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="feature-reviewer">
                    <div
                      className="feature-avatar"
                      style={{ background: review.color || "#07522f" }}
                    >
                      {review.avatar}
                    </div>

                    <div className="feature-reviewer-info">
                      <div className="reviewer-name-row">
                        <strong>{review.name}</strong>
                      </div>
                      {review.createdAt && (
                        <span className="review-date-text">
                          {formatReviewDate(review.createdAt)}
                        </span>
                      )}
                    </div>

                    <div className="reviewer-arrow">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </div>

                <div className="feature-card-footer">
                  <span>
                    Đánh giá{" "}
                    <strong>{String(current + 1).padStart(2, "0")}</strong>
                    {" / "}
                    {String(reviews.length).padStart(2, "0")}
                  </span>

                  <div className="feature-controls">
                    <button
                      type="button"
                      onClick={prev}
                      aria-label="Đánh giá trước"
                    >
                      <ChevronLeft size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={next}
                      aria-label="Đánh giá tiếp theo"
                    >
                      <ChevronRight size={17} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>

      {/* MODAL 1: FORM VIẾT ĐÁNH GIÁ (CHỈ DÀNH CHO KHÁCH HÀNG ĐÃ ĐĂNG NHẬP) */}
      {showModal && currentUser && (
        <div className="review-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="review-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-icon"
              onClick={() => setShowModal(false)}
            >
              <X size={20} />
            </button>

            {submittedSuccess ? (
              <div className="review-success-state">
                <CheckCircle2 size={54} className="text-emerald" />
                <h3>GỬI ĐÁNH GIÁ THÀNH CÔNG!</h3>
                <p>Cảm ơn bạn đã đóng góp trải nghiệm thực tế quý báu cho cộng đồng khách hàng BOSS Đà Nẵng.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="review-submit-form">
                <div className="modal-form-header">
                  <span className="modal-tag">
                    <Sparkles size={14} /> CHIA SẺ TRẢI NGHIỆM THỰC TẾ
                  </span>
                  <h3>ĐÁNH GIÁ DỊCH VỤ BOSS</h3>
                </div>

                <div className="modal-form-body" ref={modalBodyRef}>
                  {/* THÔNG TIN NGƯỜI ĐÁNH GIÁ (HIỂN THỊ RÕ AI LÀ NGƯỜI ĐÁNH GIÁ) */}
                  <div className="reviewer-identity-banner">
                    <div className="identity-avatar">
                      {(currentUser.fullName || currentUser.email || "K")[0].toUpperCase()}
                    </div>
                    <div className="identity-info">
                      <div className="identity-name">
                        <strong>{currentUser.fullName || currentUser.email}</strong>
                        <span className="identity-badge">
                          <BadgeCheck size={13} /> Khách hàng đã xác thực
                        </span>
                      </div>
                      <span className="identity-email">{currentUser.email}</span>
                    </div>
                  </div>

                  {/* CHỌN SỐ SAO (RATING) */}
                  <div className="form-group-review">
                    <label>Mức độ hài lòng của bạn *</label>
                    <div className="rating-select-stars">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          type="button"
                          key={s}
                          className={`star-select-btn ${(hoverRating || rating) >= s ? "filled" : ""
                            }`}
                          onMouseEnter={() => setHoverRating(s)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(s)}
                        >
                          <Star size={24} fill={(hoverRating || rating) >= s ? "#f5bd20" : "none"} />
                        </button>
                      ))}
                      <span className="rating-text-label">
                        {rating === 5 && "5 sao - Cực kỳ hài lòng"}
                        {rating === 4 && "4 sao - Rất tốt"}
                        {rating === 3 && "3 sao - Bình thường"}
                        {rating === 2 && "2 sao - Cần cải thiện"}
                        {rating === 1 && "1 sao - Chưa hài lòng"}
                      </span>
                    </div>
                  </div>

                  {/* VAI TRÒ / DỰ ÁN */}
                  <div className="form-group-review">
                    <label>Khu vực hoặc loại công trình của bạn</label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Ví dụ: Chủ biệt thự Quận Sơn Trà, Chủ nhà phố Hải Châu..."
                    />
                  </div>

                  {/* NỘI DUNG ĐÁNH GIÁ */}
                  <div className="form-group-review">
                    <label>Nội dung nhận xét & cảm nhận thực tế *</label>
                    <textarea
                      rows={3}
                      required
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Chia sẻ trải nghiệm của bạn về độ êm, tính an toàn, thời gian thi công hoặc thái độ phục vụ của nhân viên BOSS..."
                      style={{ minHeight: "64px", resize: "vertical" }}
                    />
                  </div>

                  {/* THÊM HÌNH ẢNH HOẶC VIDEO THỰC TẾ (NẾU CÓ) */}
                  <div className="form-group-review">
                    <label>Đính kèm hình ảnh hoặc video thực tế (nếu có)</label>

                    {/* File previews if attached */}
                    {mediaUrl ? (
                      <div className="attached-media-preview">
                        <div className="media-preview-card">
                          <div className="preview-thumb-wrap">
                            {mediaType === "video" ? (
                              <video src={mediaUrl} className="preview-thumb-media" />
                            ) : (
                              <img src={mediaUrl} alt="Preview" className="preview-thumb-media" />
                            )}
                            <span className="thumb-type-tag">
                              {mediaType === "video" ? <VideoIcon size={10} /> : <ImageIcon size={10} />}
                              {mediaType === "video" ? "Video" : "Hình ảnh"}
                            </span>
                          </div>

                          <div className="preview-info-wrap">
                            <strong className="preview-title">
                              <CheckCircle2 size={13} color="#059669" /> Đã chọn {mediaType === "video" ? "video" : "ảnh"} thực tế
                            </strong>
                            <span className="preview-sub">Tệp sẽ hiển thị cùng bài đánh giá của bạn</span>
                            <button
                              type="button"
                              className="btn-remove-media"
                              onClick={() => {
                                setMediaUrl("");
                                setMediaType(null);
                              }}
                            >
                              <Trash2 size={12} /> Xóa {mediaType === "video" ? "video" : "ảnh"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="media-upload-options">
                        {/* Upload Image Button */}
                        <button
                          type="button"
                          className="btn-media-opt"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <ImageIcon size={15} /> Thêm ảnh công trình
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleImageFile}
                        />

                        {/* Upload Video Button */}
                        <button
                          type="button"
                          className="btn-media-opt"
                          onClick={() => videoInputRef.current?.click()}
                        >
                          <VideoIcon size={15} /> Tải video thực tế
                        </button>
                        <input
                          type="file"
                          ref={videoInputRef}
                          accept="video/*"
                          style={{ display: "none" }}
                          onChange={handleVideoFile}
                        />
                      </div>
                    )}

                    {/* Or paste video link */}
                    {!mediaUrl && (
                      <div className="video-link-input-row">
                        <input
                          type="url"
                          placeholder="Hoặc dán đường link video (YouTube / MP4)..."
                          value={videoUrlInput}
                          onChange={(e) => setVideoUrlInput(e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn-add-link"
                          onClick={handleAddVideoLink}
                          disabled={!videoUrlInput.trim()}
                        >
                          Thêm link
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* MODAL ACTIONS - GHIM CỐ ĐỊNH Ở ĐÁY FORM (LUÔN LUÔN NHÌN THẤY) */}
                <div className="modal-actions-sticky">
                  <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                    Hủy bỏ
                  </button>
                  <button type="submit" className="btn-submit-review">
                    <PenLine size={15} color="#f5bd20" /> Gửi đánh giá ngay
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: YÊU CẦU ĐĂNG NHẬP (NẾU CHƯA ĐĂNG NHẬP) */}
      {showLoginPrompt && !currentUser && (
        <div className="review-modal-backdrop" onClick={() => setShowLoginPrompt(false)}>
          <div className="review-login-prompt-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-icon"
              onClick={() => setShowLoginPrompt(false)}
            >
              <X size={20} />
            </button>

            <div className="login-prompt-icon-wrap">
              <Lock size={30} />
            </div>

            <h3>YÊU CẦU ĐĂNG NHẬP</h3>
            <p>
              Để đảm bảo tính xác thực và minh bạch, chỉ những khách hàng đã đăng nhập tài khoản mới có thể gửi đánh giá và chia sẻ hình ảnh/video công trình thực tế.
            </p>

            <div className="prompt-actions">
              <button
                type="button"
                className="btn-go-login"
                onClick={() => {
                  setShowLoginPrompt(false);
                  navigate("/auth");
                }}
              >
                Đăng nhập ngay
              </button>
              <button
                type="button"
                className="btn-close-prompt"
                onClick={() => setShowLoginPrompt(false)}
              >
                Để sau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: LIGHTBOX XEM ẢNH THỰC TẾ PHÓNG TO */}
      {lightboxMedia && (
        <div className="review-lightbox-overlay" onClick={() => setLightboxMedia(null)}>
          <button
            type="button"
            className="lightbox-close-btn"
            onClick={() => setLightboxMedia(null)}
          >
            <X size={28} />
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={lightboxMedia} alt="Ảnh thực tế phóng to" />
          </div>
        </div>
      )}
    </section>
  );
}
