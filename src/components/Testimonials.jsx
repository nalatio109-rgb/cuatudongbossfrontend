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
import {
  getReviewsFromIndexedDB,
  saveReviewsToIndexedDB,
  putReviewToIndexedDB,
  safeSaveToLocalStorage
} from "../utils/reviewStorage";
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

  // Nạp danh sách đánh giá từ IndexedDB + MongoDB backend API + localStorage fallback
  useEffect(() => {
    const loadAllReviews = async () => {
      try {
        // 1. Nạp từ IndexedDB trước (nơi lưu trữ trọn vẹn tệp video/ảnh lớn mà không bị giới hạn 5MB)
        const idbReviews = await getReviewsFromIndexedDB();
        if (Array.isArray(idbReviews) && idbReviews.length > 0) {
          setReviews(idbReviews);
        }

        // 2. Fetch từ MongoDB backend API nếu khả dụng
        const backendBase = import.meta.env.VITE_API_URL || "";
        const res = await fetch(`${backendBase}/api/reviews`).catch(() => null);
        if (res && res.ok) {
          const json = await res.json().catch(() => null);
          if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
            const normalized = json.data.map((item) => ({
              ...item,
              id: item._id || item.id,
              role: "",
            }));

            // Smart Merge với IndexedDB và localStorage để không làm mất đánh giá mới
            setReviews((prevReviews) => {
              const currentList = idbReviews.length > 0 ? idbReviews : prevReviews;
              const unSynced = currentList.filter(
                (lr) => !normalized.some((br) => (br._id && br._id === lr._id) || br.id === lr.id || (br.text === lr.text && br.name === lr.name))
              );
              const merged = [...unSynced, ...normalized];
              saveReviewsToIndexedDB(merged);
              safeSaveToLocalStorage(merged);
              return merged;
            });
            return;
          }
        }

        // 3. Nếu chưa có backend, đồng bộ idbReviews vào localStorage
        if (idbReviews.length > 0) {
          safeSaveToLocalStorage(idbReviews);
        }
      } catch (err) {
        console.warn("Load reviews error:", err);
      }
    };

    loadAllReviews();
  }, []);

  // Lắng nghe sự kiện đồng bộ đánh giá thời gian thực từ Admin hoặc các tab khác
  useEffect(() => {
    const handleSync = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setReviews(e.detail);
      }
    };
    window.addEventListener("boss_customer_reviews_updated", handleSync);
    return () => window.removeEventListener("boss_customer_reviews_updated", handleSync);
  }, []);

  // Review Modal state
  const [showModal, setShowModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [lightboxMedia, setLightboxMedia] = useState(null);

  // Form fields - Hỗ trợ đính kèm 1 Video VÀ Nhiều Hình Ảnh
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [role, setRole] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [images, setImages] = useState([]);
  const [videoUrlInput, setVideoUrlInput] = useState("");
  const [isCompressingImages, setIsCompressingImages] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const modalBodyRef = useRef(null);

  // Tự động cuộn xuống khi đính kèm hình ảnh/video để người dùng nhìn thấy ngay
  useEffect(() => {
    if ((videoUrl || images.length > 0) && modalBodyRef.current) {
      setTimeout(() => {
        if (modalBodyRef.current) {
          modalBodyRef.current.scrollTo({
            top: modalBodyRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 80);
    }
  }, [videoUrl, images.length]);

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

  // Helper nén ảnh client-side bằng Canvas: giảm dung lượng từ 5-15MB xuống ~60-120KB
  // Giúp lưu vào localStorage không bao giờ bị dính QuotaExceededError (giới hạn 5MB của trình duyệt)
  const compressImageFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Nén chất lượng JPEG 0.78: sắc nét nhưng siêu nhẹ (dưới 100KB)
          const compressed = canvas.toDataURL("image/jpeg", 0.78);
          resolve(compressed);
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
    });
  };

  // Image Upload handler - Cho phép chọn nhiều ảnh công trình, tự động nén từng ảnh
  const handleImageFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > 10) {
      alert("Bạn có thể đính kèm tối đa 10 hình ảnh cho mỗi đánh giá.");
      return;
    }

    setIsCompressingImages(true);
    try {
      const newCompressed = [];
      for (const file of files) {
        if (file.size > 25 * 1024 * 1024) continue;
        const comp = await compressImageFile(file);
        if (comp) newCompressed.push(comp);
      }
      setImages((prev) => [...prev, ...newCompressed]);
    } catch (err) {
      console.warn("Compress images error:", err);
    } finally {
      setIsCompressingImages(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (idxToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  // Video Upload handler - Hỗ trợ tối đa 1 video clip từ máy (lưu IndexedDB)
  const handleVideoFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) {
      alert("Dung lượng video quá lớn (vui lòng chọn video dưới 100MB).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setVideoUrl(ev.target.result);
    };
    reader.readAsDataURL(file);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleRemoveVideo = () => {
    setVideoUrl("");
  };

  // Handle paste video link (YouTube / MP4 online)
  const handleAddVideoLink = () => {
    if (!videoUrlInput.trim()) return;
    setVideoUrl(videoUrlInput.trim());
    setVideoUrlInput("");
  };

  // Submit review với cơ chế lưu trữ bền vững IndexedDB (Hỗ trợ 1 Video + Nhiều Ảnh)
  const handleSubmitReview = async (e) => {
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

    const hasVideo = !!videoUrl;
    const hasImages = Array.isArray(images) && images.length > 0;
    const computedMediaType = hasVideo && hasImages ? "mixed" : (hasVideo ? "video" : (hasImages ? "image" : null));
    const primaryMediaUrl = videoUrl || (hasImages ? images[0] : "");

    const newReview = {
      id: Date.now(),
      name: userName,
      email: currentUser.email,
      role: role.trim() || "",
      avatar: initial,
      rating: rating,
      text: reviewText.trim(),
      color: randomColor,
      videoUrl: videoUrl || "",
      images: images || [],
      mediaType: computedMediaType,
      mediaUrl: primaryMediaUrl,
      verified: true,
      createdAt: new Date().toLocaleDateString("vi-VN"),
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);

    // 1. Lưu ngay vào IndexedDB (lưu trữ trọn vẹn cả video 25MB-50MB và toàn bộ ảnh)
    await putReviewToIndexedDB(newReview);
    saveReviewsToIndexedDB(updated);

    // 2. Lưu an toàn vào localStorage (tự động nén/tối ưu nếu quá giới hạn 5MB)
    safeSaveToLocalStorage(updated);

    // 3. Phát sự kiện thông báo để Admin cập nhật ngay lập tức nếu đang mở
    window.dispatchEvent(new CustomEvent("boss_customer_reviews_updated", { detail: updated }));

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
      setVideoUrl("");
      setImages([]);
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

                  {/* Hiển thị Hình ảnh hoặc Video đính kèm nếu có (Hỗ trợ cả 1 Video VÀ Nhiều Ảnh) */}
                  {(() => {
                    const revVideo = review.videoUrl || (review.mediaType === "video" ? review.mediaUrl : null);
                    const revImages = Array.isArray(review.images) && review.images.length > 0
                      ? review.images
                      : (review.mediaType === "image" && review.mediaUrl ? [review.mediaUrl] : []);

                    if (!revVideo && revImages.length === 0) return null;

                    return (
                      <div className="review-media-box">
                        {/* 1. Hiển thị Video nếu có */}
                        {revVideo && (
                          <div className="review-media-video">
                            {revVideo.includes("youtube.com") || revVideo.includes("youtu.be") ? (
                              <iframe
                                src={revVideo.replace("watch?v=", "embed/")}
                                title="Video đánh giá thực tế"
                                allowFullScreen
                              />
                            ) : (
                              <video src={revVideo} controls playsInline preload="metadata" />
                            )}
                            <span className="media-badge">
                              <VideoIcon size={12} /> Video thực tế
                            </span>
                          </div>
                        )}

                        {/* 2. Hiển thị Hình ảnh (Lưới ảnh nếu nhiều ảnh hoặc 1 ảnh đơn) */}
                        {revImages.length > 0 && (
                          <div className={`review-images-gallery ${revImages.length === 1 ? "single-image" : "multi-images"}`}>
                            {revImages.map((imgUrl, imgIdx) => (
                              <div
                                key={imgIdx}
                                className="review-media-image"
                                onClick={() => setLightboxMedia(imgUrl)}
                                title="Nhấn để xem ảnh phóng to"
                              >
                                <img src={imgUrl} alt={`Hình ảnh công trình ${imgIdx + 1}`} />
                                <span className="media-badge">
                                  <ImageIcon size={11} /> {revImages.length > 1 ? `Ảnh ${imgIdx + 1}/${revImages.length}` : "Ảnh thực tế (Xem lớn)"}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}

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

                  {/* THÊM 1 VIDEO VÀ NHIỀU HÌNH ẢNH THỰC TẾ */}
                  <div className="form-group-review media-attachment-section">
                    <label className="media-section-main-label">
                      Đính kèm hình ảnh & video thực tế (1 video và nhiều ảnh)
                    </label>

                    {/* KHỐI 1: ĐÍNH KÈM VIDEO (TỐI ĐA 1 VIDEO) */}
                    <div className="media-sub-block">
                      <div className="media-sub-header">
                        <span className="media-sub-title">
                          <VideoIcon size={14} color="#07522f" /> 1. Video công trình thực tế (Tối đa 1 video)
                        </span>
                      </div>

                      {videoUrl ? (
                        <div className="attached-media-preview">
                          <div className="media-preview-card">
                            <div className="preview-thumb-wrap">
                              {videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be") ? (
                                <iframe
                                  src={videoUrl.replace("watch?v=", "embed/")}
                                  title="Video preview"
                                  className="preview-thumb-media"
                                />
                              ) : (
                                <video src={videoUrl} className="preview-thumb-media" />
                              )}
                              <span className="thumb-type-tag">
                                <VideoIcon size={10} /> Video
                              </span>
                            </div>

                            <div className="preview-info-wrap">
                              <strong className="preview-title">
                                <CheckCircle2 size={13} color="#059669" /> Đã chọn video thực tế
                              </strong>
                              <span className="preview-sub">Video sẽ hiển thị cùng bài đánh giá của bạn</span>
                              <button
                                type="button"
                                className="btn-remove-media"
                                onClick={handleRemoveVideo}
                              >
                                <Trash2 size={12} /> Xóa video
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="video-input-options">
                          <button
                            type="button"
                            className="btn-media-opt"
                            onClick={() => videoInputRef.current?.click()}
                          >
                            <VideoIcon size={15} /> Tải video từ máy tính
                          </button>
                          <input
                            type="file"
                            ref={videoInputRef}
                            accept="video/*"
                            style={{ display: "none" }}
                            onChange={handleVideoFile}
                          />

                          <div className="video-link-input-row">
                            <input
                              type="url"
                              placeholder="Hoặc dán đường link video (YouTube / MP4 online)..."
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
                        </div>
                      )}
                    </div>

                    {/* KHỐI 2: ĐÍNH KÈM HÌNH ẢNH (NHIỀU ẢNH) */}
                    <div className="media-sub-block">
                      <div className="media-sub-header">
                        <span className="media-sub-title">
                          <ImageIcon size={14} color="#07522f" /> 2. Hình ảnh công trình thực tế ({images.length} ảnh đã chọn)
                        </span>
                        {images.length > 0 && (
                          <button
                            type="button"
                            className="btn-add-more-photos"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            + Thêm ảnh khác
                          </button>
                        )}
                      </div>

                      {/* Danh sách ảnh đã chọn */}
                      {images.length > 0 && (
                        <div className="attached-images-grid">
                          {images.map((imgSrc, idx) => (
                            <div key={idx} className="attached-img-item" title="Nhấn vào dấu X để xóa ảnh này">
                              <img src={imgSrc} alt={`Ảnh đã chọn ${idx + 1}`} onClick={() => setLightboxMedia(imgSrc)} />
                              <button
                                type="button"
                                className="btn-remove-single-img"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveImage(idx);
                                }}
                                title="Xóa ảnh này"
                              >
                                <X size={12} />
                              </button>
                              <span className="img-order-badge">#{idx + 1}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Nút thêm ảnh khi chưa có hoặc khi muốn thêm */}
                      {images.length === 0 && (
                        <div className="image-input-options">
                          <button
                            type="button"
                            className="btn-media-opt full-width"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isCompressingImages}
                          >
                            <ImageIcon size={15} /> {isCompressingImages ? "Đang xử lý ảnh..." : "Chọn ảnh công trình (Có thể chọn nhiều ảnh)"}
                          </button>
                        </div>
                      )}

                      <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleImageFiles}
                      />
                    </div>
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
