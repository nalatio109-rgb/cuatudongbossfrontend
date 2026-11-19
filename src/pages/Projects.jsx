import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  ArrowUpRight,
  CheckCircle2,
  PhoneCall,
  MessageCircle,
  Search,
  SlidersHorizontal,
  Layers,
  ShieldCheck,
  Sparkles,
  Clock,
  ChevronRight,
  X,
  Ruler,
  Award,
  Wrench,
  Building2,
  Eye
} from 'lucide-react';
import './Projects.css';
import RevealOnScroll from '../components/RevealOnScroll';
import AnimatedCounter from '../components/AnimatedCounter';
import { getProjectSlug } from '../utils/slug';
import { sortByNewest } from '../utils/sortHelper';

const formatImgSrc = (src) => {
  if (!src) return '/project_1.png';
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src;
  }
  if (src.startsWith('/uploads')) {
    const backendBase = import.meta.env.VITE_API_URL || '';
    return `${backendBase}${src}`;
  }
  return src;
};

// Component trình chiếu ảnh tự động chuyển sang ảnh tiếp theo sau 3 giây
function ProjectCardSlider({ proj, getProjectSlug, formatImgSrc }) {
  const imagesList = useMemo(() => {
    let list = [];
    if (Array.isArray(proj.images) && proj.images.length > 0) {
      list = proj.images;
    } else if (Array.isArray(proj.gallery) && proj.gallery.length > 0) {
      list = proj.gallery;
    } else if (proj.image) {
      list = [proj.image];
    }
    const unique = [];
    list.forEach((img) => {
      if (img && typeof img === 'string' && img.trim() && !unique.includes(img.trim())) {
        unique.push(img.trim());
      }
    });
    return unique.length > 0 ? unique : ['/project_1.png'];
  }, [proj.images, proj.gallery, proj.image]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (imagesList.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % imagesList.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [imagesList.length, isPaused]);

  return (
    <Link
      to={`/cong-trinh/${getProjectSlug(proj)}`}
      className="card-media-wrapper"
      style={{ textDecoration: "none", display: "block" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div
        className="card-slider-track"
        style={{ transform: `translateX(-${activeIdx * 100}%)` }}
      >
        {imagesList.map((imgSrc, i) => (
          <img
            key={i}
            src={formatImgSrc(imgSrc)}
            alt={`${proj.title} - ảnh ${i + 1}`}
            loading="lazy"
            className="card-media-img"
          />
        ))}
      </div>

      <div className="card-media-overlay">
        <span className="view-detail-badge">
          <Eye size={16} /> Xem bài viết công trình
        </span>
      </div>

      {/* Category Tag */}
      {proj.category && (
        <div className="card-badge-category">
          {proj.category}
        </div>
      )}

      {/* Số lượng hình ảnh nếu có nhiều ảnh */}
      {imagesList.length > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            background: "rgba(0, 0, 0, 0.75)",
            color: "#fff",
            padding: "3px 8px",
            borderRadius: "12px",
            fontSize: "0.72rem",
            fontWeight: 600,
            backdropFilter: "blur(4px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            zIndex: 2,
            transition: "all 0.2s ease"
          }}
        >
          📷 {activeIdx + 1}/{imagesList.length} ảnh
        </div>
      )}
    </Link>
  );
}

export default function Projects() {
  const [projectsList, setProjectsList] = useState(() => {
    try {
      const saved = localStorage.getItem("boss_admin_projects");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...parsed].sort(sortByNewest);
        }
      }
    } catch (_) {}
    return [];
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeModalImgIndex, setActiveModalImgIndex] = useState(0);

  // Tải danh sách công trình thực tế từ Backend API (Dữ liệu thật 100%)
  useEffect(() => {
    const fetchApiProjects = async () => {
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${apiUrl}/api/projects`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          let localProjects = [];
          try {
            const localSaved = localStorage.getItem("boss_admin_projects");
            if (localSaved) {
              const parsed = JSON.parse(localSaved);
              if (Array.isArray(parsed)) localProjects = parsed.filter(p => p && typeof p === 'object');
            }
          } catch (_) {}

          // Chuẩn hóa dữ liệu từ database thật, bảo toàn content đã viết
          const mappedApi = data.data.filter(item => item && typeof item === 'object').map((item, idx) => {
            const itemTitle = String(item.title || '').trim().toLowerCase();
            const itemId = String(item._id || item.id || '').trim();

            const localMatch = localProjects.find((lp) => {
              if (!lp) return false;
              const lpId = String(lp._id || lp.id || '').trim();
              const lpTitle = String(lp.title || '').trim().toLowerCase();
              if (itemId && lpId && itemId === lpId) return true;
              if (itemTitle && lpTitle && itemTitle === lpTitle) return true;
              return false;
            });

            const preservedContent = (typeof item.content === 'string' && item.content.trim())
              ? item.content
              : (localMatch && typeof localMatch.content === 'string' ? localMatch.content : '');

            return {
              id: item._id || `api-${idx}`,
              _id: item._id,
              title: item.title,
              category: item.category || 'Công trình thực tế',
              categoryKey: (item.category && item.category.toLowerCase().includes('cổng'))
                ? 'cong-tu-dong'
                : (item.category && item.category.toLowerCase().includes('kéo'))
                ? 'cua-keo'
                : (item.category && item.category.toLowerCase().includes('tấm liền'))
                ? 'tam-lien'
                : (item.category && (item.category.toLowerCase().includes('thương mại') || item.category.toLowerCase().includes('tttm')))
                ? 'commercial'
                : 'khe-thoang',
              image: formatImgSrc(item.image),
              images: Array.isArray(item.images) && item.images.length > 0
                ? item.images.map(formatImgSrc)
                : Array.isArray(item.gallery) && item.gallery.length > 0
                  ? item.gallery.map(formatImgSrc)
                  : [formatImgSrc(item.image)],
              gallery: Array.isArray(item.gallery) && item.gallery.length > 0
                ? item.gallery.map(formatImgSrc)
                : Array.isArray(item.images) && item.images.length > 0
                  ? item.images.map(formatImgSrc)
                  : [formatImgSrc(item.image)],
              location: item.location || 'Đà Nẵng',
              completedDate: item.completedDate || (item.createdAt ? new Date(item.createdAt).getFullYear().toString() : '2024'),
              scale: item.scale || 'Thi công theo kích thước khảo sát thực tế',
              motor: item.motor || 'Đồng bộ linh kiện chính hãng',
              features: item.features && Array.isArray(item.features) && item.features.length > 0
                ? item.features
                : [
                    'Vận hành êm ái, bền bỉ',
                    'Linh kiện nhập khẩu chính hãng',
                    'Bảo hành tận tâm 24/7'
                  ],
              description: item.description || 'Công trình thi công lắp đặt hoàn thiện bởi đội ngũ kỹ thuật BOSS Đà Nẵng.',
              content: preservedContent,
              createdAt: item.createdAt || (localMatch && localMatch.createdAt),
              updatedAt: item.updatedAt || (localMatch && localMatch.updatedAt)
            };
          });

          // Bổ sung các công trình chỉ có ở local
          localProjects.forEach((lp) => {
            if (!lp) return;
            const lpId = String(lp._id || lp.id || '').trim();
            const lpTitle = String(lp.title || '').trim().toLowerCase();
            const exists = mappedApi.some((p) => {
              if (!p) return false;
              const pId = String(p._id || p.id || '').trim();
              const pTitle = String(p.title || '').trim().toLowerCase();
              if (pId && lpId && pId === lpId) return true;
              if (pTitle && lpTitle && pTitle === lpTitle) return true;
              return false;
            });
            if (!exists) mappedApi.push(lp);
          });

          // Sắp xếp bài viết mới nhất lên đầu tiên, bài cũ đẩy xuống
          mappedApi.sort(sortByNewest);

          setProjectsList(mappedApi);
          localStorage.setItem("boss_admin_projects", JSON.stringify(mappedApi));
        } else {
          const localSaved = localStorage.getItem("boss_admin_projects");
          if (localSaved) {
            try {
              const parsed = JSON.parse(localSaved);
              if (Array.isArray(parsed)) {
                parsed.sort(sortByNewest);
                setProjectsList(parsed);
              }
            } catch (_) {}
          }
        }
      } catch (err) {
        console.warn('Projects API fetch error, checking localStorage:', err);
        const localSaved = localStorage.getItem("boss_admin_projects");
        if (localSaved) {
          try {
            const parsed = JSON.parse(localSaved);
            if (Array.isArray(parsed)) {
              parsed.sort(sortByNewest);
              setProjectsList(parsed);
            }
          } catch (_) {}
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApiProjects();
  }, []);

  // Lọc theo Danh mục và Ô tìm kiếm
  const filteredProjects = useMemo(() => {
    return projectsList.filter((proj) => {
      const matchTab = activeTab === 'all' || proj.categoryKey === activeTab;
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchTab;

      const titleMatch = proj.title?.toLowerCase().includes(query);
      const catMatch = proj.category?.toLowerCase().includes(query);
      const locMatch = proj.location?.toLowerCase().includes(query);
      const descMatch = proj.description?.toLowerCase().includes(query);

      return matchTab && (titleMatch || catMatch || locMatch || descMatch);
    });
  }, [projectsList, activeTab, searchQuery]);

  const openModal = (proj) => {
    setSelectedProject(proj);
    setActiveModalImgIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="projects-page-container">
      {/* 1. HERO HEADER (Đồng bộ nhận diện thương hiệu cao cấp chuẩn toàn website) */}
      <section className="projects-hero-banner">
        <div className="projects-hero-overlay"></div>
        <div className="container projects-hero-content">
          <span className="hero-subtag">
            <Sparkles size={14} /> DỰ ÁN & CÔNG TRÌNH TIÊU BIỂU
          </span>

          <h1 className="projects-main-title">
            CÔNG TRÌNH <span className="text-highlight">THỰC TẾ</span>
          </h1>

          <p className="projects-main-subtitle">
            Hơn <strong>2.000+ công trình</strong> cửa cuốn, cửa kéo & cổng tự động cao cấp đã hoàn thiện bàn giao tại Đà Nẵng & miền Trung.
          </p>

          {/* Trust Badges Row (Sang trọng, tinh tế, đồng bộ cùng trang Bảng giá & Dịch vụ) */}
          <div className="projects-trust-badges-row">
            <div className="trust-badge-pill">
              <Building2 size={15} />
              <span>2.000+ Công trình hoàn thành</span>
            </div>
            <div className="trust-badge-pill">
              <Award size={15} />
              <span>10+ Năm kinh nghiệm</span>
            </div>
            <div className="trust-badge-pill">
              <CheckCircle2 size={15} />
              <span>100% Nghiệm thu hài lòng</span>
            </div>
            <div className="trust-badge-pill">
              <Clock size={15} />
              <span>Khảo sát tận nơi miễn phí</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BREADCRUMB */}
      <div className="projects-breadcrumb-bar">
        <div className="container">
          <Link to="/" title="Trang chủ">
            Trang chủ <ChevronRight size={14} />
          </Link>
          <span className="current-page">Công trình thực tế</span>
        </div>
      </div>

      {/* 3. PROJECTS SHOWCASE GRID */}
      <section className="projects-grid-section">
        <div className="container">
          {loading && projectsList.length === 0 ? (
            <div className="projects-empty-state" style={{ padding: "4rem 1rem", textAlign: "center" }}>
              <Building2 size={42} className="empty-icon" style={{ margin: "0 auto 12px", color: "#f5bd20", opacity: 0.8 }} />
              <p style={{ color: "#94a3b8", fontSize: "1rem" }}>Đang tải danh sách công trình thực tế...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="projects-empty-state">
              <Building2 size={48} className="empty-icon" />
              <h3>Chưa có công trình nào</h3>
              <p>Danh sách công trình thực tế đang được cập nhật từ hệ thống.</p>
            </div>
          ) : (
            <div className="projects-modern-grid">
              {filteredProjects.map((proj, idx) => (
                <RevealOnScroll
                  key={proj.id || proj._id || idx}
                  animation="fade-up"
                  delay={(idx % 3) * 120}
                  className="project-card-reveal-wrapper"
                >
                  <div className="project-modern-card">
                    {/* Card Image Slider (Tự động nhảy ảnh sau 3 giây) */}
                    <ProjectCardSlider
                      proj={proj}
                      getProjectSlug={getProjectSlug}
                      formatImgSrc={formatImgSrc}
                    />

                    {/* Card Content */}
                  <div className="card-content-body">
                    {/* Location & Completed Date Frame */}
                    <div className="card-location-row">
                      <div className="card-location-item">
                        <MapPin size={15} className="location-pin" />
                        <span>{proj.location || "Đà Nẵng"}</span>
                      </div>
                      {proj.completedDate && (
                        <div className="card-date-badge">
                          <Calendar size={13} className="card-date-icon" />
                          <span>{proj.completedDate}</span>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="card-project-title">
                      <Link
                        to={`/cong-trinh/${getProjectSlug(proj)}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {proj.title}
                      </Link>
                    </h3>

                    {/* Description Snippet */}
                    <p className="card-description-snippet">
                      {proj.description}
                    </p>

                    {/* Card Actions Footer */}
                    <div className="card-action-footer">
                      <Link
                        to={`/cong-trinh/${getProjectSlug(proj)}`}
                        className="btn-card-details"
                        style={{ textDecoration: "none" }}
                      >
                        <span>Chi tiết công trình</span>
                        <ArrowUpRight size={16} />
                      </Link>

                      <a
                        href="tel:0904678323"
                        className="btn-card-call"
                        title="Tư vấn công trình tương tự: 0904.678.323"
                      >
                        <PhoneCall size={15} />
                      </a>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. REAL ON-SITE TECHNICAL GALLERY STRIP */}
      <section className="projects-gallery-section">
        <div className="container">
          <RevealOnScroll animation="fade-up">
            <div className="section-title-center">
              <span className="section-tag-gold">HÌNH ẢNH THỰC TẾ TẠI CÔNG TRƯỜNG</span>
              <h2>Đội Ngũ Kỹ Thuật BOSS Đà Nẵng Trực Tiếp Thi Công</h2>
              <p className="section-desc-center">
                Mỗi công trình đều được giám sát kỹ thuật nghiêm ngặt, thi công đúng bản vẽ và tiêu chuẩn an toàn cao nhất.
              </p>
            </div>
          </RevealOnScroll>

          <div className="onsite-gallery-grid">
            <RevealOnScroll animation="zoom-in" delay={100} className="onsite-gallery-card">
              <img src="/about_technician_install.jpg" alt="Kỹ thuật viên BOSS lắp đặt mô tơ trên giàn giáo" />
              <div className="onsite-gallery-caption">
                <strong>Lắp đặt trên cao an toàn</strong>
                <span>Kỹ thuật viên trang bị đầy đủ đai an toàn & bảo hộ lao động</span>
              </div>
            </RevealOnScroll>

            <RevealOnScroll animation="zoom-in" delay={200} className="onsite-gallery-card">
              <img src="/about_construction.jpg" alt="Hoàn thiện lắp đặt cửa cuốn TTTM Aeon Mall" />
              <div className="onsite-gallery-caption">
                <strong>Thi công hệ thống TTTM</strong>
                <span>Nghiệm thu song ngang inox khổ lớn tại Aeon Mall Đà Nẵng</span>
              </div>
            </RevealOnScroll>

            <RevealOnScroll animation="zoom-in" delay={300} className="onsite-gallery-card">
              <img src="/about_meeting.jpg" alt="Họp triển khai lịch lắp đặt công trình trong tuần" />
              <div className="onsite-gallery-caption">
                <strong>Kế hoạch thi công chi tiết</strong>
                <span>Phân công kỹ thuật viên theo từng tuyến đường & công trình</span>
              </div>
            </RevealOnScroll>

            <RevealOnScroll animation="zoom-in" delay={400} className="onsite-gallery-card">
              <img src="/factory_worker.png" alt="Xưởng gia công chế tác cửa cuốn BOSS" />
              <div className="onsite-gallery-caption">
                <strong>Gia công chuẩn xác tại xưởng</strong>
                <span>Hệ thống máy cắt, dập nan nhôm công nghệ CNC độ chính xác 100%</span>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* 5. WORKFLOW 5-STEP PROCESS */}
      <section className="projects-workflow-section">
        <div className="container">
          <RevealOnScroll animation="fade-up">
            <div className="section-title-center">
              <span className="section-tag-gold">QUY TRÌNH THI CÔNG</span>
              <h2>5 Bước Lắp Đặt Công Trình Tiêu Chuẩn BOSS Đà Nẵng</h2>
              <p className="section-desc-center">
                Cam kết thi công chuẩn kỹ thuật, đúng tiến độ bàn giao và an toàn tuyệt đối.
              </p>
            </div>
          </RevealOnScroll>

          <div className="workflow-steps-flex">
            <div className="workflow-step-box">
              <div className="step-badge-num">1</div>
              <div className="step-icon-wrap"><Ruler size={24} /></div>
              <h4>Khảo Sát & Đo Đạc</h4>
              <p>Có mặt sau 30 phút, đo đạc kích thước thực tế và kiểm tra kết cấu công trình hoàn toàn miễn phí.</p>
            </div>

            <div className="workflow-step-arrow">➔</div>

            <div className="workflow-step-box">
              <div className="step-badge-num">2</div>
              <div className="step-icon-wrap"><Award size={24} /></div>
              <h4>Tư Vấn & Lên Bản Vẽ</h4>
              <p>Tư vấn cấu hình vật liệu (độ dày nan, công suất mô tơ, lưu điện) tối ưu chi phí cho từng mặt bằng.</p>
            </div>

            <div className="workflow-step-arrow">➔</div>

            <div className="workflow-step-box">
              <div className="step-badge-num">3</div>
              <div className="step-icon-wrap"><Wrench size={24} /></div>
              <h4>Sản Xuất & Lắp Đặt</h4>
              <p>Gia công tại xưởng theo đúng kích thước, đội ngũ thợ lành nghề thi công nhanh chóng, an toàn.</p>
            </div>

            <div className="workflow-step-arrow">➔</div>

            <div className="workflow-step-box">
              <div className="step-badge-num">4</div>
              <div className="step-icon-wrap"><ShieldCheck size={24} /></div>
              <h4>Chạy Thử Cảm Biến</h4>
              <p>Kiểm tra nghiêm ngặt hệ thống chống xô, tự đảo chiều, còi báo động và tính năng điều khiển điện thoại.</p>
            </div>

            <div className="workflow-step-arrow">➔</div>

            <div className="workflow-step-box">
              <div className="step-badge-num">5</div>
              <div className="step-icon-wrap"><CheckCircle2 size={24} /></div>
              <h4>Nghiệm Thu & Bảo Hành</h4>
              <p>Bàn giao chìa khóa, hướng dẫn sử dụng chi tiết và kích hoạt thẻ bảo hành chính hãng tận nơi 24/7.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION CONSULTATION CARD */}
      <section className="projects-cta-section">
        <div className="container">
          <div className="projects-cta-card">
            <div className="cta-left-content">
              <span className="cta-badge">TƯ VẤN & KHẢO SÁT TẬN NƠI</span>
              <h2>Bạn Cần Giải Pháp Cửa Chuẩn Xác Cho Công Trình Của Mình?</h2>
              <p>
                Đội ngũ kỹ thuật BOSS Đà Nẵng sẵn sàng đến trực tiếp công trình của bạn trong vòng 
                <strong> 30 phút</strong> để khảo sát mặt bằng, đo đạc thông số và gửi báo giá tối ưu nhất.
              </p>
              <div className="cta-features-list">
                <div className="cta-feat-item">
                  <CheckCircle2 size={18} className="feat-check" />
                  <span>Khảo sát, tư vấn mẫu mã tận nhà miễn phí 100%</span>
                </div>
                <div className="cta-feat-item">
                  <CheckCircle2 size={18} className="feat-check" />
                  <span>Báo giá minh bạch, cam kết không phát sinh chi phí</span>
                </div>
                <div className="cta-feat-item">
                  <CheckCircle2 size={18} className="feat-check" />
                  <span>Bảo hành motor và thân cửa chính hãng lên đến 5 năm</span>
                </div>
              </div>
            </div>

            <div className="cta-right-actions">
              <div className="cta-hotline-box">
                <span className="hotline-sub">Hotline Kỹ Thuật & Khảo Sát 24/7</span>
                <a href="tel:0904678323" className="hotline-main-number">
                  <PhoneCall size={26} /> 0904.678.323
                </a>
                <span className="hotline-note">(Hỗ trợ tất cả các quận Đà Nẵng & Quảng Nam)</span>
              </div>

              <div className="cta-buttons-group">
                <a
                  href="https://zalo.me/0904678323"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-cta-zalo"
                >
                  <MessageCircle size={18} />
                  <span>Chat Zalo Nhận Báo Giá</span>
                </a>

                <Link to="/lien-he" className="btn-cta-contact">
                  <span>Gửi Yêu Cầu Khảo Sát</span>
                  <ArrowUpRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. MODAL CHI TIẾT CÔNG TRÌNH */}
      {selectedProject && (
        <div className="project-detail-modal-overlay" onClick={closeModal}>
          <div className="project-detail-modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-button"
              onClick={closeModal}
              aria-label="Đóng chi tiết công trình"
            >
              <X size={22} />
            </button>

            <div className="modal-scroll-inner">
              {/* Modal Image Header with Multi-image gallery */}
              {(() => {
                const modalImages = Array.isArray(selectedProject.images) && selectedProject.images.length > 0
                  ? selectedProject.images
                  : Array.isArray(selectedProject.gallery) && selectedProject.gallery.length > 0
                    ? selectedProject.gallery
                    : [selectedProject.image];
                const activeImg = modalImages[activeModalImgIndex] || selectedProject.image;

                return (
                  <div>
                    <div className="modal-image-holder">
                      <img
                        src={formatImgSrc(activeImg)}
                        alt={selectedProject.title}
                        className="modal-banner-img"
                      />
                      <div className="modal-category-pill">
                        {selectedProject.category}
                      </div>
                    </div>

                    {modalImages.length > 1 && (
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          padding: "10px 16px",
                          background: "rgba(15, 23, 42, 0.95)",
                          overflowX: "auto",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.08)"
                        }}
                      >
                        {modalImages.map((img, idx) => (
                          <img
                            key={idx}
                            src={formatImgSrc(img)}
                            alt={`Ảnh ${idx + 1}`}
                            onClick={() => setActiveModalImgIndex(idx)}
                            style={{
                              width: 65,
                              height: 48,
                              objectFit: "cover",
                              borderRadius: 6,
                              cursor: "pointer",
                              border: activeModalImgIndex === idx ? "2px solid #10b981" : "1px solid rgba(255, 255, 255, 0.2)",
                              opacity: activeModalImgIndex === idx ? 1 : 0.6,
                              transition: "all 0.2s ease"
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Modal Body Info */}
              <div className="modal-body-content">
                <div className="modal-meta-row">
                  <span className="meta-item">
                    <MapPin size={16} /> <strong>Địa điểm:</strong> {selectedProject.location}
                  </span>
                  {selectedProject.completedDate && (
                    <span className="meta-item">
                      <Calendar size={16} /> <strong>Năm bàn giao:</strong> {selectedProject.completedDate}
                    </span>
                  )}
                </div>

                <h2 className="modal-project-title">
                  {selectedProject.title}
                </h2>

                {/* Scale & Technical Specs (chỉ hiển thị nếu có specs riêng và chưa có bài viết chi tiết) */}
                {(!selectedProject.content && (selectedProject.scale || selectedProject.motor || (selectedProject.features && selectedProject.features.length > 0))) && (
                  <div className="modal-specs-box">
                    <h4>Thông Số Kỹ Thuật & Cấu Hình Lắp Đặt:</h4>
                    <ul>
                      {selectedProject.scale && (
                        <li>
                          <strong>Quy mô / Kích thước:</strong> {selectedProject.scale}
                        </li>
                      )}
                      {selectedProject.motor && (
                        <li>
                          <strong>Động cơ & Điều khiển:</strong> {selectedProject.motor}
                        </li>
                      )}
                      {selectedProject.features && selectedProject.features.map((feat, fIdx) => (
                        <li key={fIdx}>
                          <strong>Tính năng:</strong> {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Bài viết chi tiết thi công (Rich HTML Article) hoặc Mô tả ngắn fallback */}
                {selectedProject.content ? (
                  <div className="modal-article-rich-box">
                    <div 
                      className="project-article-rendered-content"
                      dangerouslySetInnerHTML={{ __html: selectedProject.content }}
                    />
                  </div>
                ) : (
                  <div className="modal-desc-box">
                    <h4>Mô Tả Quá Trình Thi Công:</h4>
                    <p>{selectedProject.description}</p>
                  </div>
                )}

                {/* Modal CTA Footer */}
                <div className="modal-cta-footer">
                  <div className="modal-cta-text">
                    <strong>Bạn muốn lắp đặt giải pháp tương tự cho công trình của mình?</strong>
                    <span>Liên hệ ngay kỹ sư BOSS Đà Nẵng để được khảo sát thực tế miễn phí</span>
                  </div>
                  <div className="modal-cta-actions">
                    <a href="tel:0904678323" className="btn-modal-call">
                      <PhoneCall size={18} /> Gọi Ngay: 0904.678.323
                    </a>
                    <a
                      href="https://zalo.me/0904678323"
                      target="_blank"
                      rel="noreferrer"
                      className="btn-modal-zalo"
                    >
                      <MessageCircle size={18} /> Chat Zalo
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
