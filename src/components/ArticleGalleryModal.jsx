import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Grid, Maximize2, Image as ImageIcon } from 'lucide-react';

export default function ArticleGalleryModal({
  isOpen,
  onClose,
  images = [],
  initialIndex = 0,
  initialViewMode = 'slide' // 'slide' hoặc 'grid'
}) {
  const [activeIndex, setActiveIndex] = useState(initialIndex || 0);
  const [viewMode, setViewMode] = useState(initialViewMode || 'slide');
  const [touchStart, setTouchStart] = useState(null);

  useEffect(() => {
    setActiveIndex(initialIndex || 0);
    setViewMode(initialViewMode || 'slide');
  }, [initialIndex, initialViewMode, isOpen]);

  // Hỗ trợ phím Escape và Mũi tên trái/phải
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, activeIndex, images.length]);

  if (!isOpen || !images || images.length === 0) return null;

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 45) handleNext(); // Vuốt sang trái -> Ảnh tiếp theo
    if (diff < -45) handlePrev(); // Vuốt sang phải -> Ảnh trước
    setTouchStart(null);
  };

  const currentImg = images[activeIndex] || images[0];

  return (
    <div className="article-gallery-modal-overlay" onClick={onClose}>
      <div className="article-gallery-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* TOP BAR: TIÊU ĐỀ, CHỌN CHẾ ĐỘ XEM & NÚT ĐÓNG */}
        <div className="gallery-modal-top-bar">
          <div className="gallery-modal-title-group">
            <span className="gallery-modal-badge">
              <ImageIcon size={13} /> {viewMode === 'grid' ? `Tất cả ${images.length} ảnh` : `Ảnh ${activeIndex + 1} / ${images.length}`}
            </span>
          </div>

          <div className="gallery-modal-actions">
            {images.length > 1 && (
              <div className="gallery-view-mode-switch">
                <button
                  type="button"
                  className={`btn-mode-toggle ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Xem nhiều ảnh cùng lúc trên màn hình"
                >
                  <Grid size={13} />
                  <span>Xem cùng lúc</span>
                </button>
                <button
                  type="button"
                  className={`btn-mode-toggle ${viewMode === 'slide' ? 'active' : ''}`}
                  onClick={() => setViewMode('slide')}
                  title="Xem từng ảnh phóng to với mũi tên chuyển ảnh"
                >
                  <Maximize2 size={13} />
                  <span>Phóng to</span>
                </button>
              </div>
            )}

            <button
              type="button"
              className="btn-gallery-close"
              onClick={onClose}
              aria-label="Đóng cửa sổ ảnh"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* NỘI DUNG 1: CHẾ ĐỘ XEM CÙNG LÚC (LƯỚI NHIỀU ẢNH CẠNH NHAU) */}
        {viewMode === 'grid' ? (
          <div className="gallery-grid-view-container">
            <p className="gallery-grid-hint">
              💡 Bấm vào bất kỳ ảnh nào để xem phóng to chi tiết:
            </p>
            <div className={`gallery-multi-images-grid ${images.length === 2 ? 'grid-cols-2' : ''}`}>
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`gallery-grid-item ${idx === activeIndex ? 'active-grid-item' : ''}`}
                  onClick={() => {
                    setActiveIndex(idx);
                    setViewMode('slide');
                  }}
                >
                  <div className="gallery-grid-img-wrap">
                    <img src={img.src} alt={img.alt || `Hình ${idx + 1}`} loading="lazy" />
                    <span className="grid-item-order-tag">{idx + 1}</span>
                  </div>
                  {img.caption && (
                    <p className="gallery-grid-caption">{img.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* NỘI DUNG 2: CHẾ ĐỘ XEM PHÓNG TO TỪNG ẢNH CÓ MŨI TÊN CHUYỂN TIẾP */
          <div
            className="gallery-slide-view-container"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="gallery-main-slide-stage">
              {/* MŨI TÊN TRÁI */}
              {images.length > 1 && (
                <button
                  type="button"
                  className="gallery-nav-arrow arrow-left"
                  onClick={handlePrev}
                  aria-label="Ảnh trước"
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              {/* ẢNH CHÍNH HIỂN THỊ */}
              <div className="gallery-current-img-holder">
                <img
                  key={currentImg.src}
                  src={currentImg.src}
                  alt={currentImg.alt || `Hình ${activeIndex + 1}`}
                  className="gallery-active-image animate-fade"
                />
              </div>

              {/* MŨI TÊN PHẢI */}
              {images.length > 1 && (
                <button
                  type="button"
                  className="gallery-nav-arrow arrow-right"
                  onClick={handleNext}
                  aria-label="Ảnh tiếp theo"
                >
                  <ChevronRight size={24} />
                </button>
              )}
            </div>

            {/* CHÚ THÍCH ẢNH DƯỚI ĐÁY */}
            {currentImg.caption && (
              <div className="gallery-slide-caption-bar">
                <span>{currentImg.caption}</span>
              </div>
            )}

            {/* CHẤM CHỈ SỐ HOẶC HÌNH NHỎ (THUMBNAILS) */}
            {images.length > 1 && (
              <div className="gallery-slide-dots-bar">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`gallery-nav-dot ${idx === activeIndex ? 'active' : ''}`}
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`Chuyển đến ảnh ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
