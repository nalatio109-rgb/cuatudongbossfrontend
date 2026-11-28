import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  PhoneCall,
  MessageCircle,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Eye,
  Camera,
  Award,
  Wrench,
  Check,
  ArrowUpRight,
  Building2,
  Sliders
} from 'lucide-react';
import RevealOnScroll from '../components/RevealOnScroll';
import ArticleGalleryModal from '../components/ArticleGalleryModal';
import { enhanceArticleImages } from '../utils/enhanceArticleImages';
import { getProjectSlug, slugify } from '../utils/slug';
import { SAMPLE_PROJECT_TEMPLATE } from '../components/AdminProjectArticleEditor';
import { HOMEPAGE_PROJECTS } from '../components/Projects';
import { sortByNewest } from '../utils/sortHelper';
import './ProjectDetail.css';

const formatImgSrc = (src) => {
  if (!src || typeof src !== 'string') return '/project_1.png';
  const clean = src.trim();
  if (!clean) return '/project_1.png';
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:')) {
    return clean;
  }
  if (clean.startsWith('/uploads')) {
    const backendBase = import.meta.env.VITE_API_URL || '';
    return `${backendBase}${clean}`;
  }
  return clean;
};

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [withTransition, setWithTransition] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const [articleGalleryModal, setArticleGalleryModal] = useState({
    isOpen: false,
    images: [],
    initialIndex: 0,
    initialViewMode: 'slide'
  });

  const handleOpenArticleGallery = (images, index = 0, mode = 'slide') => {
    setArticleGalleryModal({
      isOpen: true,
      images: images,
      initialIndex: index,
      initialViewMode: mode
    });
  };

  // Bộ sưu tập hình ảnh của công trình (Ảnh bìa + Gallery + Ảnh trong nội dung bài viết)
  const galleryPhotos = useMemo(() => {
    if (!project) return ['/project_1.png'];
    let photos = [];
    if (Array.isArray(project.images) && project.images.length > 0) {
      photos = [...project.images];
    } else if (Array.isArray(project.gallery) && project.gallery.length > 0) {
      photos = [...project.gallery];
    } else if (project.image) {
      photos = [project.image];
    }

    // Tự động quét trích xuất thêm các ảnh trong content HTML nếu có
    if (project.content && typeof project.content === 'string') {
      const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
      let match;
      while ((match = imgRegex.exec(project.content)) !== null) {
        if (match[1] && typeof match[1] === 'string' && !photos.includes(match[1])) {
          photos.push(match[1]);
        }
      }
    }

    const validPhotos = photos.filter((p) => typeof p === 'string' && p.trim().length > 0);
    return validPhotos.length > 0 ? validPhotos : ['/project_1.png'];
  }, [project]);

  // Chuẩn bị danh sách ảnh có bản sao đầu/cuối để trượt vô tận mượt mà từ phải sang trái
  const extendedPhotos = useMemo(() => {
    if (!galleryPhotos || galleryPhotos.length <= 1) return galleryPhotos;
    const first = galleryPhotos[0];
    const last = galleryPhotos[galleryPhotos.length - 1];
    return [last, ...galleryPhotos, first];
  }, [galleryPhotos]);

  // Vị trí ảnh thật đang hiển thị (0..length-1) để kích hoạt badge & thumbnail
  const activePhotoIdx = useMemo(() => {
    if (!galleryPhotos || galleryPhotos.length <= 1) return 0;
    if (currentIndex <= 0) return galleryPhotos.length - 1;
    if (currentIndex >= galleryPhotos.length + 1) return 0;
    return currentIndex - 1;
  }, [currentIndex, galleryPhotos]);

  // Khởi tạo vị trí slider khi đổi project hoặc tải xong
  useEffect(() => {
    if (galleryPhotos && galleryPhotos.length > 1) {
      setCurrentIndex(1);
    } else {
      setCurrentIndex(0);
    }
    setWithTransition(false);
  }, [project]);

  // Tự động chuyển qua ảnh khác từ phải sang trái sau mỗi 3 giây
  useEffect(() => {
    if (!galleryPhotos || galleryPhotos.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setWithTransition(true);
      setCurrentIndex((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(timer);
  }, [galleryPhotos.length, isPaused]);

  // Bật lại hiệu ứng chuyển động mượt mà sau khi snap vị trí vô tận
  useEffect(() => {
    if (!withTransition) {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setWithTransition(true);
        });
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [withTransition]);

  // Tự động nâng cấp các cụm nhiều ảnh liên tiếp trong bài viết thành Slider mượt mà trên mobile
  useEffect(() => {
    if (project?.content) {
      const container = document.querySelector('.project-article-rendered-content');
      if (container) {
        const cleanup = enhanceArticleImages(container, handleOpenArticleGallery);
        return () => {
          if (cleanup) cleanup();
        };
      }
    }
  }, [project?.content]);

  // Xử lý snap vị trí vô tận không giật lag khi chuyển hết chu kỳ ảnh
  const handleTransitionEnd = () => {
    if (!galleryPhotos || galleryPhotos.length <= 1) return;
    if (currentIndex >= galleryPhotos.length + 1) {
      // Đã trượt đến clone của ảnh 1 -> snap về ảnh 1 thật không hiệu ứng
      setWithTransition(false);
      setCurrentIndex(1);
    } else if (currentIndex <= 0) {
      // Đã trượt lùi đến clone của ảnh cuối -> snap về ảnh cuối thật
      setWithTransition(false);
      setCurrentIndex(galleryPhotos.length);
    }
  };

  const handlePrevPhoto = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!galleryPhotos || galleryPhotos.length <= 1) return;
    setWithTransition(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNextPhoto = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!galleryPhotos || galleryPhotos.length <= 1) return;
    setWithTransition(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSelectPhoto = (pIdx) => {
    if (!galleryPhotos || galleryPhotos.length <= 1) return;
    setWithTransition(true);
    setCurrentIndex(pIdx + 1);
  };

  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      setTouchStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null || !e.changedTouches || !e.changedTouches[0]) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 45) {
      // Vuốt tay từ phải sang trái -> ảnh kế tiếp
      handleNextPhoto();
    } else if (diff < -45) {
      // Vuốt tay từ trái sang phải -> ảnh trước
      handlePrevPhoto();
    }
    setTouchStartX(null);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    let isMounted = true;

    const fetchProjectData = async () => {
      setLoading(true);

      try {
        let apiList = [];
        try {
          const backendBase = import.meta.env.VITE_API_URL || '';
          if (backendBase) {
            const res = await fetch(`${backendBase}/api/projects`);
            if (res.ok) {
              const json = await res.json();
              if (json && json.success && Array.isArray(json.data)) {
                apiList = json.data;
              }
            }
          }
        } catch (err) {
          console.warn('API error, using local fallback:', err.message);
        }

        let localList = [];
        try {
          const saved = localStorage.getItem('boss_admin_projects');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              localList = parsed;
            }
          }
        } catch (_) {}

        // Lọc các phần tử hợp lệ
        const validApi = apiList.filter((p) => p && typeof p === 'object');
        const validLocal = localList.filter((p) => p && typeof p === 'object');

        // Hàm helper so khớp an toàn
        const getSafeId = (p) => String(p?._id || p?.id || '').trim();
        const getSafeTitle = (p) => (typeof p?.title === 'string' ? p.title.trim().toLowerCase() : '');

        const isSameProject = (a, b) => {
          if (!a || !b) return false;
          const idA = getSafeId(a);
          const idB = getSafeId(b);
          if (idA && idB && idA === idB) return true;
          const titleA = getSafeTitle(a);
          const titleB = getSafeTitle(b);
          if (titleA && titleB && titleA === titleB) return true;
          return false;
        };

        const combinedList = [];

        // Hợp nhất dữ liệu từ API và LocalStorage
        validApi.forEach((apiP) => {
          const localMatch = validLocal.find((lp) => isSameProject(lp, apiP));
          if (localMatch) {
            combinedList.push({
              ...apiP,
              ...localMatch,
              content: (typeof localMatch.content === 'string' && localMatch.content.trim())
                ? localMatch.content
                : (typeof apiP.content === 'string' ? apiP.content : '')
            });
          } else {
            combinedList.push(apiP);
          }
        });

        // Bổ sung các dự án chỉ có trên localStorage
        validLocal.forEach((lp) => {
          const exists = combinedList.some((p) => isSameProject(p, lp));
          if (!exists) combinedList.push(lp);
        });

        // Thêm dự án bài mẫu làm mặc định nếu danh sách chưa có công trình Anh Đô
        const sampleItem = {
          _id: 'sample-anh-do-le-lai',
          id: 'sample-anh-do-le-lai',
          slug: 'thi-cong-cua-cuon-khe-thoang-cho-anh-do-le-lai',
          title: SAMPLE_PROJECT_TEMPLATE.title,
          category: SAMPLE_PROJECT_TEMPLATE.category,
          location: SAMPLE_PROJECT_TEMPLATE.location,
          image: SAMPLE_PROJECT_TEMPLATE.image,
          images: [SAMPLE_PROJECT_TEMPLATE.image],
          gallery: [SAMPLE_PROJECT_TEMPLATE.image],
          description: SAMPLE_PROJECT_TEMPLATE.description,
          content: SAMPLE_PROJECT_TEMPLATE.content,
          completedDate: '2024'
        };

        const hasAnhDo = combinedList.some((p) => {
          const t = getSafeTitle(p);
          return t.includes('đô') || t.includes('do') || t.includes('lê lai') || t.includes('le lai');
        });
        if (!hasAnhDo) {
          combinedList.push(sampleItem);
        }

        // Bổ sung thêm các dự án trang chủ
        if (Array.isArray(HOMEPAGE_PROJECTS)) {
          HOMEPAGE_PROJECTS.forEach((hp) => {
            if (hp && !combinedList.some((p) => isSameProject(p, hp))) {
              combinedList.push(hp);
            }
          });
        }

        // Sắp xếp bài viết / công trình mới nhất lên đầu tiên
        combinedList.sort(sortByNewest);

        if (!isMounted) return;
        setAllProjects(combinedList);

        // Tìm kiếm project khớp với tham số :id trên URL
        const normalizedParam = String(id || '').toLowerCase().trim();
        let matched = null;

        if (normalizedParam) {
          matched = combinedList.find((p) => {
            if (!p || typeof p !== 'object') return false;
            const pId = getSafeId(p).toLowerCase();
            const s = (typeof getProjectSlug === 'function' ? getProjectSlug(p) : '').toLowerCase();
            const pTitleSlug = slugify(p.title || '').toLowerCase();

            if (pId && pId === normalizedParam) return true;
            if (s && s === normalizedParam) return true;
            if (pTitleSlug && pTitleSlug === normalizedParam) return true;

            // Partial match nếu độ dài đủ lớn
            if (s && s.length >= 6 && normalizedParam.includes(s)) return true;
            if (s && normalizedParam.length >= 6 && s.includes(normalizedParam)) return true;
            return false;
          });
        }

        if (!matched && (normalizedParam.includes('do-le-lai') || normalizedParam.includes('anh-do') || normalizedParam.includes('le-lai'))) {
          matched = combinedList.find((p) => {
            const t = getSafeTitle(p);
            return t.includes('đô') || t.includes('do') || t.includes('lê lai') || t.includes('le lai');
          }) || sampleItem;
        }

        if (matched) {
          setProject(matched);
        } else if (combinedList.length > 0) {
          setProject(combinedList[0]);
        } else {
          setProject(sampleItem);
        }
      } catch (e) {
        console.error('ProjectDetail fetchProjectData error:', e);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProjectData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Tự động gắn thuộc tính title để khi rê chuột vào bất kỳ link nào sẽ hiện URL đầy đủ
  useEffect(() => {
    if (project?.content) {
      const container = document.querySelector(".project-article-rendered-content");
      if (container) {
        const anchors = container.querySelectorAll("a");
        anchors.forEach((a) => {
          const href = a.getAttribute("href");
          if (href && !a.getAttribute("title")) {
            a.setAttribute("title", `Đến trang: ${href}`);
          }
        });
      }
    }
  }, [project?.content]);

  // Các công trình liên quan khác
  const relatedProjects = useMemo(() => {
    if (!project || !Array.isArray(allProjects) || allProjects.length <= 1) return [];
    const currentId = String(project._id || project.id || '').trim();
    const currentTitle = String(project.title || '').trim().toLowerCase();

    return allProjects
      .filter((p) => {
        if (!p || typeof p !== 'object') return false;
        const pId = String(p._id || p.id || '').trim();
        const pTitle = String(p.title || '').trim().toLowerCase();
        if (currentId && pId && currentId === pId) return false;
        if (currentTitle && pTitle && currentTitle === pTitle) return false;
        return true;
      })
      .slice(0, 3);
  }, [project, allProjects]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: project?.title || 'Công trình BOSS Đà Nẵng',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="project-detail-loading-screen">
        <Building2 size={46} className="spin-slow" color="#10b981" />
        <p>Đang tải bài viết công trình thực tế...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-detail-notfound-container">
        <Building2 size={56} color="#94a3b8" />
        <h2>Không tìm thấy bài viết công trình</h2>
        <p>Công trình này có thể đã được gỡ bỏ hoặc đường dẫn chưa chính xác.</p>
        <Link to="/cong-trinh" className="btn-back-projects">
          <ArrowLeft size={16} /> Quay lại danh mục công trình
        </Link>
      </div>
    );
  }

  const activePhoto = galleryPhotos[activePhotoIdx] || galleryPhotos[0] || project.image;

  return (
    <div className="project-detail-page-wrapper">
      {/* 1. BREADCRUMB NAVIGATION */}
      <div className="project-detail-breadcrumb-bar">
        <div className="container">
          <nav className="breadcrumb-nav" aria-label="Breadcrumb">
            <Link to="/">Trang chủ</Link>
            <ChevronRight size={14} />
            <Link to="/cong-trinh">Công trình thực tế</Link>
            <ChevronRight size={14} />
            <span className="breadcrumb-current">{project.title}</span>
          </nav>
        </div>
      </div>

      <div className="container project-detail-main-container">
        {/* NÚT QUAY LẠI & CHIA SẺ */}
        <div className="detail-top-controls">
          <Link to="/cong-trinh" className="btn-back-link">
            <ArrowLeft size={16} />
            <span className="btn-ctrl-text-desktop">Danh sách công trình</span>
            <span className="btn-ctrl-text-mobile">Công trình</span>
          </Link>
          <button type="button" onClick={handleShare} className="btn-share-link">
            <Share2 size={15} />
            <span className="btn-ctrl-text-desktop">{copied ? 'Đã sao chép link!' : 'Chia sẻ bài viết'}</span>
            <span className="btn-ctrl-text-mobile">{copied ? 'Đã chép link!' : 'Chia sẻ'}</span>
          </button>
        </div>

        {/* 2. TIÊU ĐỀ & THÔNG TIN TỔNG QUAN */}
        <header className="project-detail-header">
          <div className="header-badge-row">
            <span className="badge-category">{project.category || 'Công trình tiêu biểu'}</span>
            {project.completedDate && (
              <span className="badge-year">
                <Calendar size={13} />
                <span className="badge-year-text-desktop">Hoàn thiện: </span>
                {project.completedDate}
              </span>
            )}
            <span className="badge-verified">
              <ShieldCheck size={14} />
              <span className="badge-verified-desktop">Kỹ thuật BOSS Đà Nẵng thi công 100%</span>
              <span className="badge-verified-mobile">Thi công 100%</span>
            </span>
          </div>

          <h1 className="project-main-title">{project.title}</h1>

          <div className="project-meta-strip">
            <div className="meta-strip-item">
              <MapPin size={17} className="meta-icon" />
              <span>
                <strong>Địa điểm:</strong> {project.location || 'Đà Nẵng'}
              </span>
            </div>
            <div className="meta-strip-item">
              <PhoneCall size={17} className="meta-icon" />
              <span>
                <strong>Hotline tư vấn:</strong>{' '}
                <a href="tel:0904678323" style={{ color: '#07522f', fontWeight: 700 }}>
                  0904.678.323
                </a>
              </span>
            </div>
          </div>
        </header>

        {/* 3. BỐ CỤC 2 CỘT: BÀI VIẾT CHÍNH & SIDEBAR LIÊN HỆ */}
        <div className="project-detail-layout-grid">
          {/* CỘT TRÁI: BÀI VIẾT NỘI DUNG CHI TIẾT */}
          <main className="project-content-column">
            {/* ẢNH ĐẠI DIỆN CHÍNH & GALLERY ALBUM (TRƯỢT MƯỢT MÀ TỪ PHẢI SANG TRÁI MỖI 3 GIÂY) */}
            <div
              className="project-hero-gallery-box"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div
                className="hero-main-photo-holder"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {/* TRACK TRƯỢT ẢNH TỪ PHẢI SANG TRÁI VÔ TẬN */}
                <div
                  className="hero-slider-track"
                  onTransitionEnd={handleTransitionEnd}
                  style={{
                    transform: `translateX(-${(galleryPhotos.length > 1 ? currentIndex : 0) * 100}%)`,
                    transition: withTransition
                      ? 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)'
                      : 'none'
                  }}
                >
                  {extendedPhotos.map((photo, pIdx) => (
                    <div key={pIdx} className="hero-slide-item">
                      <img
                        src={formatImgSrc(photo)}
                        alt={`${project.title} - ảnh ${pIdx + 1}`}
                        className="hero-main-photo"
                        loading={pIdx === 1 ? 'eager' : 'lazy'}
                      />
                    </div>
                  ))}
                </div>

                {/* Thanh tiến trình tự động chạy 3 giây */}
                {galleryPhotos.length > 1 && !isPaused && (
                  <div key={`prog-${activePhotoIdx}`} className="hero-slideshow-progress-bar" />
                )}

                {/* Nút bấm chuyển ảnh trước / sau */}
                {galleryPhotos.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="hero-nav-btn prev"
                      onClick={handlePrevPhoto}
                      aria-label="Ảnh trước"
                      title="Ảnh trước"
                    >
                      <ChevronLeft size={22} />
                    </button>
                    <button
                      type="button"
                      className="hero-nav-btn next"
                      onClick={handleNextPhoto}
                      aria-label="Ảnh kế tiếp"
                      title="Ảnh kế tiếp"
                    >
                      <ChevronRight size={22} />
                    </button>
                  </>
                )}

                <div className="hero-photo-counter">
                  <Camera size={14} />
                  <span>
                    Ảnh {activePhotoIdx + 1} / {galleryPhotos.length}
                  </span>
                </div>
              </div>

              {/* THUMBNAIL ROW (Nếu có từ 2 ảnh trở lên) */}
              {galleryPhotos.length > 1 && (
                <div className="hero-thumbs-carousel">
                  {galleryPhotos.map((photo, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => handleSelectPhoto(pIdx)}
                      className={`hero-thumb-btn ${activePhotoIdx === pIdx ? 'active' : ''}`}
                      title={`Xem ảnh ${pIdx + 1}`}
                    >
                      <img src={formatImgSrc(photo)} alt={`Ảnh thi công ${pIdx + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* NỘI DUNG BÀI VIẾT (RICH HTML ARTICLE) */}
            <article className="project-article-body-wrapper">
              {project.content && typeof project.content === 'string' && project.content.trim() ? (
                <div
                  className="project-article-rendered-content"
                  dangerouslySetInnerHTML={{ __html: project.content }}
                />
              ) : (
                /* FALLBACK CHO CÁC DỰ ÁN CŨ CHƯA CÓ BÀI VIẾT HTML */
                <div className="legacy-project-content-block">
                  {/* BẢNG THÔNG SỐ KỸ THUẬT */}
                  {(project.scale || project.motor || (Array.isArray(project.specs) && project.specs.length > 0)) && (
                    <div className="legacy-specs-card">
                      <h3 className="legacy-heading">
                        <Sliders size={18} /> Thông số kỹ thuật & Cấu hình lắp đặt
                      </h3>
                      <ul className="legacy-specs-list">
                        {project.scale && (
                          <li>
                            <strong>Quy mô / Kích thước:</strong> {project.scale}
                          </li>
                        )}
                        {project.motor && (
                          <li>
                            <strong>Động cơ & Điều khiển:</strong> {project.motor}
                          </li>
                        )}
                        {Array.isArray(project.specs) &&
                          project.specs.map((sp, idx) => (
                            <li key={idx}>
                              <strong>{typeof sp === 'object' ? sp?.label : 'Thông số'}:</strong>{' '}
                              {typeof sp === 'object' ? sp?.val : String(sp || '')}
                            </li>
                          ))}
                        {Array.isArray(project.features) &&
                          project.features.map((feat, fIdx) => (
                            <li key={fIdx}>
                              <CheckCircle2 size={15} color="#10b981" /> {String(feat || '')}
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}

                  {/* MÔ TẢ QUÁ TRÌNH THI CÔNG */}
                  <div className="legacy-desc-card">
                    <h3 className="legacy-heading">
                      <Wrench size={18} /> Mô tả quá trình thi công & Bàn giao
                    </h3>
                    {Array.isArray(project.articleContent) && project.articleContent.length > 0 ? (
                      project.articleContent.map((paragraph, pgIdx) => (
                        <p key={pgIdx} className="legacy-paragraph">
                          {paragraph}
                        </p>
                      ))
                    ) : (
                      <p className="legacy-paragraph">
                        {project.description ||
                          'Công trình được thi công lắp đặt hoàn thiện bởi đội ngũ kỹ thuật lành nghề của BOSS Đà Nẵng, cam kết vật tư chính hãng 100%.'}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </article>

            {/* BANNER KÊU GỌI HÀNH ĐỘNG DƯỚI BÀI VIẾT */}
            <div className="project-article-cta-box">
              <div className="cta-box-text">
                <h3>Bạn muốn lắp đặt giải pháp tương tự cho công trình của mình?</h3>
                <p>
                  Đội ngũ kỹ sư BOSS Đà Nẵng sẵn sàng có mặt tận nơi sau 30 phút để khảo sát mặt bằng,
                  tư vấn giải pháp và báo giá miễn phí 100%.
                </p>
              </div>
              <div className="cta-box-buttons">
                <a href="tel:0904678323" className="btn-cta-phone">
                  <PhoneCall size={18} /> Gọi Kỹ Sư: 0904.678.323
                </a>
                <a
                  href="https://zalo.me/0904678323"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-cta-zalo"
                >
                  <MessageCircle size={18} /> Nhận Báo Giá Qua Zalo
                </a>
              </div>
            </div>
          </main>

          {/* CỘT PHẢI: SIDEBAR LIÊN HỆ & THÔNG TIN NHANH */}
          <aside className="project-sidebar-column">
            {/* THẺ TƯ VẤN KHẢO SÁT MIỄN PHÍ */}
            <div className="sidebar-sticky-widget">
              <div className="sidebar-card contact-card">
                <div className="contact-card-header">
                  <Award size={22} className="card-badge-icon" />
                  <h4>Tư Vấn & Khảo Sát Tận Nhà</h4>
                  <p>Miễn phí 100% tại Đà Nẵng & Quảng Nam</p>
                </div>

                <div className="contact-card-body">
                  <div className="contact-feature-item">
                    <CheckCircle2 size={16} className="text-green" />
                    <span>Khảo sát thực tế trong vòng 30 phút</span>
                  </div>
                  <div className="contact-feature-item">
                    <CheckCircle2 size={16} className="text-green" />
                    <span>Vật tư, động cơ 100% chính hãng</span>
                  </div>
                  <div className="contact-feature-item">
                    <CheckCircle2 size={16} className="text-green" />
                    <span>Bảo hành tận nơi lên đến 5 năm</span>
                  </div>
                  <div className="contact-feature-item">
                    <CheckCircle2 size={16} className="text-green" />
                    <span>Hỗ trợ bảo trì kỹ thuật 24/7</span>
                  </div>

                  <a href="tel:0904678323" className="btn-sidebar-call">
                    <PhoneCall size={18} />
                    <span>Hotline: 0904.678.323</span>
                  </a>

                  <a
                    href="https://zalo.me/0904678323"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-sidebar-zalo"
                  >
                    <MessageCircle size={18} />
                    <span>Chat Zalo Với Kỹ Thuật</span>
                  </a>

                  <Link to="/lien-he" className="btn-sidebar-quote">
                    <span>Đăng Ký Khảo Sát Báo Giá</span>
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              </div>

              {/* DỊCH VỤ THI CÔNG TRỌN GÓI */}
              <div className="sidebar-card services-card">
                <h4>Hạng Mục BOSS Nhận Thi Công:</h4>
                <ul className="services-mini-list">
                  <li>
                    <ChevronRight size={14} color="#10b981" /> Cửa cuốn khe thoáng công nghệ Đức
                  </li>
                  <li>
                    <ChevronRight size={14} color="#10b981" /> Cửa cuốn tấm liền Úc siêu êm
                  </li>
                  <li>
                    <ChevronRight size={14} color="#10b981" /> Cổng tự động âm sàn & tay đòn Italia
                  </li>
                  <li>
                    <ChevronRight size={14} color="#10b981" /> Cửa kéo công nghệ Đức, Inox 304
                  </li>
                  <li>
                    <ChevronRight size={14} color="#10b981" /> Sửa chữa, bảo trì cửa cuốn 24/7
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>

        {/* 4. CÁC CÔNG TRÌNH TIÊU BIỂU LIÊN QUAN */}
        {relatedProjects.length > 0 && (
          <section className="related-projects-section">
            <div className="related-header-row">
              <div>
                <h3 className="related-section-title">Công Trình Tiêu Biểu Khác</h3>
                <p className="related-section-desc">
                  Xem thêm các công trình cửa cuốn, cổng tự động thực tế đã bàn giao cho khách hàng
                </p>
              </div>
              <Link to="/cong-trinh" className="related-view-all">
                <span>Xem tất cả công trình</span>
                <ChevronRight size={16} />
              </Link>
            </div>

            <div className="related-projects-grid">
              {relatedProjects.map((relProj, rIdx) => {
                const relSlug = getProjectSlug(relProj);
                return (
                  <Link
                    to={`/cong-trinh/${relSlug}`}
                    key={rIdx}
                    className="related-project-card"
                  >
                    <div className="related-card-img-holder">
                      <img
                        src={formatImgSrc(relProj.image)}
                        alt={relProj.title}
                        loading="lazy"
                      />
                      <span className="related-badge-cat">{relProj.category}</span>
                    </div>
                    <div className="related-card-content">
                      <div className="related-loc">
                        <MapPin size={13} /> {relProj.location}
                      </div>
                      <h4 className="related-card-title">{relProj.title}</h4>
                      <span className="related-read-more">
                        Xem chi tiết bài viết <ArrowUpRight size={14} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* CỬA SỔ PHÓNG TO & XEM CÙNG LÚC TẤT CẢ ẢNH TRONG BÀI VIẾT */}
      <ArticleGalleryModal
        isOpen={articleGalleryModal.isOpen}
        onClose={() => setArticleGalleryModal((prev) => ({ ...prev, isOpen: false }))}
        images={articleGalleryModal.images}
        initialIndex={articleGalleryModal.initialIndex}
        initialViewMode={articleGalleryModal.initialViewMode}
      />
    </div>
  );
}

