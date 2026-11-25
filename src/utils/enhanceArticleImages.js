/**
 * enhanceArticleImages.js
 * Tự động nâng cấp các cụm nhiều hình ảnh liên tiếp trong nội dung bài viết:
 * - Trên Desktop (> 768px): Giữ nguyên 100% giao diện ban đầu (2 ảnh ngang hàng 50% - 50%).
 * - Trên Mobile (<= 768px): Tự động chuyển thành Slider/Carousel có mũi tên điều hướng,
 *   huy hiệu số ảnh, nút xem cùng lúc, hỗ trợ vuốt chạm cảm ứng (touch swipe).
 * - Nhấn vào ảnh hoặc nút xem cùng lúc để mở cửa sổ phóng to / xem tất cả ảnh (Modal).
 */

export function enhanceArticleImages(containerEl, onOpenGallery) {
  if (!containerEl || typeof onOpenGallery !== 'function') return () => {};

  const cleanups = [];

  // Tìm tất cả các container chứa cụm 2 ảnh hoặc nhiều ảnh ngang hàng
  const candidateRows = containerEl.querySelectorAll(
    '.service-images-row-2col, .article-two-images-row, .project-two-images-row, .service-multi-images-row, [data-multi-images-row="true"]'
  );

  candidateRows.forEach((rowEl) => {
    // Tránh khởi tạo trùng lặp
    if (rowEl.getAttribute('data-slider-initialized') === 'true') return;

    // Lấy các thẻ figure hoặc img trực tiếp bên trong
    const figures = Array.from(rowEl.querySelectorAll(':scope > figure, :scope > .project-article-figure'));
    let images = [];

    if (figures.length >= 2) {
      images = figures.map((fig) => {
        const img = fig.querySelector('img');
        const capEl = fig.querySelector('figcaption');
        return {
          src: img ? (img.getAttribute('src') || '') : '',
          alt: img ? (img.getAttribute('alt') || '') : '',
          caption: capEl ? capEl.textContent.trim() : (img?.getAttribute('alt') || ''),
          element: fig
        };
      }).filter((item) => Boolean(item.src));
    } else {
      // Trường hợp không có figure, kiểm tra các thẻ img trực tiếp
      const directImgs = Array.from(rowEl.querySelectorAll(':scope > img'));
      if (directImgs.length >= 2) {
        images = directImgs.map((img) => ({
          src: img.getAttribute('src') || '',
          alt: img.getAttribute('alt') || '',
          caption: img.getAttribute('alt') || '',
          element: img
        })).filter((item) => Boolean(item.src));
      }
    }

    if (images.length < 2) return; // Nếu dưới 2 ảnh thì giữ nguyên mặc định

    rowEl.setAttribute('data-slider-initialized', 'true');
    rowEl.classList.add('mobile-carousel-enhanced');

    // 1. Tạo cấu trúc Viewport và Track cho Mobile Slider
    const viewport = document.createElement('div');
    viewport.className = 'mobile-slider-viewport';

    const track = document.createElement('div');
    track.className = 'mobile-slider-track';

    // Chuyển các phần tử ảnh/figure hiện tại vào bên trong track
    images.forEach((imgObj, idx) => {
      const itemEl = imgObj.element;
      itemEl.classList.add('mobile-slider-slide-item');
      itemEl.setAttribute('data-slide-index', String(idx));
      track.appendChild(itemEl);

      // Thêm sự kiện click vào ảnh để mở popup xem chi tiết/phóng to
      const handleImageClick = (e) => {
        // Chỉ kích hoạt nếu không phải đang kéo vuốt
        e.stopPropagation();
        onOpenGallery(images, idx, 'slide');
      };
      itemEl.addEventListener('click', handleImageClick);
      cleanups.push(() => itemEl.removeEventListener('click', handleImageClick));
    });

    viewport.appendChild(track);

    // 2. Tạo Header Controls (Huy hiệu đếm ảnh + Nút "Xem cùng lúc")
    const headerControls = document.createElement('div');
    headerControls.className = 'mobile-slider-header-controls';

    const counterBadge = document.createElement('span');
    counterBadge.className = 'mobile-slider-badge';
    counterBadge.innerHTML = `📷 1 / ${images.length}`;
    headerControls.appendChild(counterBadge);

    const btnViewGrid = document.createElement('button');
    btnViewGrid.type = 'button';
    btnViewGrid.className = 'mobile-slider-btn-grid';
    btnViewGrid.innerHTML = `
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-right:4px;">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
      </svg>
      Xem cùng lúc (${images.length})
    `;
    btnViewGrid.title = 'Xem nhiều ảnh cùng một lúc trên màn hình';

    const handleGridClick = (e) => {
      e.stopPropagation();
      onOpenGallery(images, currentSlideIndex, 'grid');
    };
    btnViewGrid.addEventListener('click', handleGridClick);
    cleanups.push(() => btnViewGrid.removeEventListener('click', handleGridClick));
    headerControls.appendChild(btnViewGrid);

    viewport.appendChild(headerControls);

    // 3. Tạo 2 Mũi Tên Chuyển Ảnh Trái & Phải
    const btnPrev = document.createElement('button');
    btnPrev.type = 'button';
    btnPrev.className = 'mobile-slider-arrow arrow-prev';
    btnPrev.setAttribute('aria-label', 'Xem ảnh trước');
    btnPrev.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    `;

    const btnNext = document.createElement('button');
    btnNext.type = 'button';
    btnNext.className = 'mobile-slider-arrow arrow-next';
    btnNext.setAttribute('aria-label', 'Xem ảnh tiếp theo');
    btnNext.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    `;

    viewport.appendChild(btnPrev);
    viewport.appendChild(btnNext);

    // 4. Tạo Dải Chấm Tròn Dots Indicator
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'mobile-slider-dots';

    const dots = images.map((_, idx) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `mobile-slider-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Chuyển tới ảnh ${idx + 1}`);
      const handleDotClick = (e) => {
        e.stopPropagation();
        goToSlide(idx);
      };
      dot.addEventListener('click', handleDotClick);
      cleanups.push(() => dot.removeEventListener('click', handleDotClick));
      dotsContainer.appendChild(dot);
      return dot;
    });

    viewport.appendChild(dotsContainer);

    // Thêm viewport vào trong row
    rowEl.appendChild(viewport);

    // 5. Logic chuyển Slide & cập nhật giao diện
    let currentSlideIndex = 0;

    const updateSliderUI = () => {
      // Cập nhật trượt track (chỉ có hiệu lực khi màn hình mobile theo CSS)
      track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
      // Cập nhật badge
      counterBadge.innerHTML = `📷 ${currentSlideIndex + 1} / ${images.length}`;
      // Cập nhật dots
      dots.forEach((d, idx) => {
        if (idx === currentSlideIndex) {
          d.classList.add('active');
        } else {
          d.classList.remove('active');
        }
      });
    };

    const goToSlide = (targetIndex) => {
      if (targetIndex < 0) {
        currentSlideIndex = images.length - 1;
      } else if (targetIndex >= images.length) {
        currentSlideIndex = 0;
      } else {
        currentSlideIndex = targetIndex;
      }
      updateSliderUI();
    };

    const handlePrev = (e) => {
      e.stopPropagation();
      goToSlide(currentSlideIndex - 1);
    };

    const handleNext = (e) => {
      e.stopPropagation();
      goToSlide(currentSlideIndex + 1);
    };

    btnPrev.addEventListener('click', handlePrev);
    btnNext.addEventListener('click', handleNext);
    cleanups.push(() => btnPrev.removeEventListener('click', handlePrev));
    cleanups.push(() => btnNext.removeEventListener('click', handleNext));

    // 6. Hỗ trợ Vuốt Chạm Cảm Ứng (Touch Swipe) trên Điện thoại
    let touchStartX = 0;
    let touchStartY = 0;
    let isSwiping = false;

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isSwiping = true;
    };

    const handleTouchEnd = (e) => {
      if (!isSwiping) return;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;

      // Chỉ kích hoạt lật slide nếu vuốt ngang nhiều hơn vuốt dọc
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 38) {
        if (diffX > 0) {
          goToSlide(currentSlideIndex + 1); // Vuốt sang trái -> Ảnh sau
        } else {
          goToSlide(currentSlideIndex - 1); // Vuốt sang phải -> Ảnh trước
        }
      }
      isSwiping = false;
    };

    viewport.addEventListener('touchstart', handleTouchStart, { passive: true });
    viewport.addEventListener('touchend', handleTouchEnd, { passive: true });
    cleanups.push(() => {
      viewport.removeEventListener('touchstart', handleTouchStart);
      viewport.removeEventListener('touchend', handleTouchEnd);
    });
  });

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}
