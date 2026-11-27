import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Phone, 
  ShieldCheck, 
  Building2, 
  Award, 
  Clock, 
  ArrowRight,
  Maximize2,
  CheckCircle2
} from "lucide-react";
import RevealOnScroll from "../components/RevealOnScroll";
import "./CompanyProfile.css";

const GOOGLE_DRIVE_VIEW_URL = "https://drive.google.com/file/d/1IxLIKEYCc_RVlHsyq8nCDEMXVp0cLvAr/view?pli=1";
const GOOGLE_DRIVE_PREVIEW_URL = "https://drive.google.com/file/d/1IxLIKEYCc_RVlHsyq8nCDEMXVp0cLvAr/preview";
const GOOGLE_DRIVE_DOWNLOAD_URL = "https://drive.google.com/uc?export=download&id=1IxLIKEYCc_RVlHsyq8nCDEMXVp0cLvAr";

export default function CompanyProfile() {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  return (
    <div className="company-profile-page">
      {/* 1. HERO HEADER */}
      <section className="profile-hero-section">
        <div className="container">
          <RevealOnScroll animation="fade-up">
            <nav className="profile-breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Trang chủ</Link>
              <span className="bc-sep">/</span>
              <Link to="/gioi-thieu">Giới thiệu</Link>
              <span className="bc-sep">/</span>
              <span className="bc-current">Hồ sơ năng lực</span>
            </nav>

            <div className="profile-hero-content">
              <div className="profile-badge">
                <span className="profile-badge-dot"></span>
                <span>TÀI LIỆU NĂNG LỰC DOANH NGHIỆP</span>
              </div>
              <h1 className="profile-title">
                HỒ SƠ NĂNG LỰC CÔNG TY <br />
                <span className="profile-title-gold">BOSS ĐÀ NẴNG (COMPANY PROFILE)</span>
              </h1>
              <p className="profile-desc">
                Cung cấp đầy đủ thông tin pháp lý, cơ cấu tổ chức, năng lực trang thiết bị máy móc, 
                đội ngũ kỹ sư và danh mục các công trình tiêu biểu đã triển khai tại miền Trung. 
                Sẵn sàng phục vụ công tác thẩm định, chào thầu và hợp tác chiến lược cùng Quý khách hàng & Đối tác.
              </p>

              {/* Action Buttons Row */}
              <div className="profile-actions-row">
                <a 
                  href={GOOGLE_DRIVE_DOWNLOAD_URL} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-profile-primary"
                  title="Tải file PDF Hồ sơ năng lực về máy"
                >
                  <Download size={18} />
                  <span>Tải Bản PDF Về Máy</span>
                </a>

                <a 
                  href={GOOGLE_DRIVE_VIEW_URL} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-profile-secondary"
                  title="Mở toàn màn hình trong tab mới"
                >
                  <ExternalLink size={17} />
                  <span>Mở Tab Mới</span>
                </a>

                <a 
                  href="tel:0904678323" 
                  className="btn-profile-outline"
                >
                  <Phone size={17} />
                  <span>Tư Vấn Dự Án 24/7</span>
                </a>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* 2. INTERACTIVE PDF VIEWER SECTION */}
      <section className="profile-viewer-section">
        <div className="container">
          <RevealOnScroll animation="fade-up" delay={100}>
            <div className="profile-viewer-wrapper">
              {/* Viewer Control Bar */}
              <div className="profile-viewer-bar">
                <div className="viewer-bar-left">
                  <div className="viewer-doc-icon">
                    <FileText size={20} />
                  </div>
                  <div className="viewer-doc-info">
                    <span className="viewer-doc-name">Ho_So_Nang_Luc_BOSS_Da_Nang_2026.pdf</span>
                    <span className="viewer-doc-meta">Tài liệu chính thức • Cập nhật 2026</span>
                  </div>
                </div>

                <div className="viewer-bar-right">
                  <a 
                    href={GOOGLE_DRIVE_VIEW_URL} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="viewer-btn-icon" 
                    title="Mở toàn màn hình"
                  >
                    <Maximize2 size={16} /> <span>Xem Toàn Màn Hình</span>
                  </a>
                  <a 
                    href={GOOGLE_DRIVE_DOWNLOAD_URL} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="viewer-btn-icon download" 
                    title="Tải về máy"
                  >
                    <Download size={16} /> <span>Tải Về</span>
                  </a>
                </div>
              </div>

              {/* Iframe Document Frame */}
              <div className="profile-iframe-container">
                {!iframeLoaded && (
                  <div className="profile-loading-skeleton">
                    <div className="profile-spinner"></div>
                    <p>Đang tải tài liệu Hồ sơ năng lực BOSS Đà Nẵng...</p>
                    <small>Nếu tải chậm, bạn có thể <a href={GOOGLE_DRIVE_VIEW_URL} target="_blank" rel="noreferrer">nhấn vào đây để xem trực tiếp</a></small>
                  </div>
                )}
                <iframe
                  src={GOOGLE_DRIVE_PREVIEW_URL}
                  title="Hồ sơ năng lực Công ty Cổ phần Cửa tự động BOSS Đà Nẵng"
                  className={`profile-iframe ${iframeLoaded ? "loaded" : ""}`}
                  onLoad={() => setIframeLoaded(true)}
                  allow="autoplay"
                />
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* 3. NĂNG LỰC CỐT LÕI (HIGHLIGHT PILLARS) */}
      <section className="profile-pillars-section">
        <div className="container">
          <RevealOnScroll animation="fade-up">
            <div className="profile-pillars-header">
              <span className="pillars-sub">NĂNG LỰC THỰC THI</span>
              <h2>VÌ SAO ĐỐI TÁC LỰA CHỌN BOSS ĐÀ NẴNG?</h2>
              <p>Khẳng định vị thế nhà thầu cửa tự động và cơ khí kiến trúc số 1 tại Đà Nẵng & miền Trung</p>
            </div>
          </RevealOnScroll>

          <div className="profile-pillars-grid">
            <RevealOnScroll animation="fade-up" delay={80} className="pillar-card">
              <div className="pillar-icon">
                <ShieldCheck size={26} />
              </div>
              <h3>Pháp Lý Minh Bạch</h3>
              <p>Đầy đủ tư cách pháp nhân, hồ sơ năng lực, chứng nhận tiêu chuẩn chất lượng ISO & CO-CQ xuất xứ rõ ràng cho mọi dòng sản phẩm.</p>
            </RevealOnScroll>

            <RevealOnScroll animation="fade-up" delay={160} className="pillar-card">
              <div className="pillar-icon">
                <Building2 size={26} />
              </div>
              <h3>Nhà Xưởng & Thiết Bị</h3>
              <p>Sở hữu xưởng sản xuất hiện đại, trang bị máy cắt CNC, đột dập và dây chuyền lắp ráp chuẩn kỹ thuật cao, đáp ứng tiến độ dự án lớn.</p>
            </RevealOnScroll>

            <RevealOnScroll animation="fade-up" delay={240} className="pillar-card">
              <div className="pillar-icon">
                <Award size={26} />
              </div>
              <h3>Kinh Nghiệm Thực Chiến</h3>
              <p>Hơn 10 năm thi công hàng trăm công trình tiêu biểu: Chuỗi KKV AEON Mall Đà Nẵng, showroom ô tô, trung tâm thương mại, biệt thự & khách sạn cao cấp.</p>
            </RevealOnScroll>

            <RevealOnScroll animation="fade-up" delay={320} className="pillar-card">
              <div className="pillar-icon">
                <Clock size={26} />
              </div>
              <h3>Hỗ Trợ Dự Án 24/7</h3>
              <p>Đội ngũ kỹ thuật túc trực 24/7, cam kết có mặt xử lý sự cố trong 30-45 phút, bảo hành dài hạn và đồng hành cùng công trình suốt dòng đời.</p>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* 4. CTA BANNER CUỐI TRANG */}
      <section className="profile-cta-section">
        <div className="container">
          <RevealOnScroll animation="zoom-in" className="profile-cta-box">
            <div className="profile-cta-content">
              <span className="cta-sub">HỢP TÁC CHIẾN LƯỢC</span>
              <h2>Cần hồ sơ dự thầu hoặc tư vấn thiết kế chuyên sâu?</h2>
              <p>
                Đội ngũ kỹ sư trưởng BOSS Đà Nẵng luôn sẵn sàng phối hợp bóc tách khối lượng, 
                tư vấn giải pháp kỹ thuật tối ưu và cung cấp báo giá chi tiết cho từng dự án.
              </p>
              <div className="profile-cta-btns">
                <a href="tel:0904678323" className="btn-cta-phone">
                  <Phone size={18} />
                  <span>Hotline: 0904.678.323</span>
                </a>
                <Link to="/lien-he" className="btn-cta-contact">
                  <span>Gửi Yêu Cầu Báo Giá</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
