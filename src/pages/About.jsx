import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Users, 
  Star, 
  Headphones,
  Leaf, 
  Lightbulb, 
  Handshake, 
  ArrowRight, 
  Play, 
  Phone,
  X,
  CalendarCheck,
  BadgeCheck,
  Settings,
  Camera,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  HardHat,
  Sparkles,
  CheckCircle2,
  MapPin,
  Building2,
  Clock
} from 'lucide-react';
import './About.css';
import RevealOnScroll from '../components/RevealOnScroll';
import AnimatedCounter from '../components/AnimatedCounter';

// Dữ liệu hình ảnh theo đúng bố cục mẫu: AEON Mall Đà Nẵng
const AEON_POSTER_HERO = {
  title: 'AEON Mall Đà Nẵng',
  subtitle: 'Hệ cửa xếp trượt uốn cong & cửa cuốn Polycarbonate',
  src: '/about_project_result_1.jpg'
};

const AEON_POSTER_CARDS = [
  {
    id: 1,
    title: 'Lắp đặt hệ ray uốn cong trên cao',
    src: '/about_project_install_1.jpg'
  },
  {
    id: 2,
    title: 'Đo đạc & ghép nan cửa cuốn',
    src: '/about_project_install_3.jpg'
  },
  {
    id: 3,
    title: 'Căn chỉnh trục cuốn & nan bảo hộ',
    src: '/about_project_install_2.jpg'
  },
  {
    id: 4,
    title: 'Đội ngũ kỹ thuật thi công đồng bộ',
    src: '/about_project_install_4.jpg'
  }
];

const AEON_POSTER_VALUES = [
  {
    icon: ShieldCheck,
    title: 'AN TOÀN',
    desc: 'Thi công chuẩn kỹ thuật, đảm bảo an toàn tuyệt đối'
  },
  {
    icon: Sparkles,
    title: 'THẨM MỸ',
    desc: 'Đường cong liền mạch, hiện đại & tinh tế'
  },
  {
    icon: Clock,
    title: 'HIỆU QUẢ',
    desc: 'Tiến độ nhanh chóng, đáp ứng yêu cầu vận hành'
  },
  {
    icon: Handshake,
    title: 'ĐỒNG HÀNH',
    desc: 'Cam kết chất lượng, đồng hành dài lâu'
  }
];

// Danh sách ảnh thực tế cho Lightbox phóng to xem đầy đủ
const ALL_AEON_IMAGES = [
  {
    src: '/about_project_result_1.jpg',
    title: 'AEON Mall Đà Nẵng',
    desc: 'Hệ cửa xếp trượt uốn cong bo góc mềm mại màu trắng sữa'
  },
  {
    src: '/about_project_result_3.jpg',
    title: 'Toàn cảnh mặt tiền dự án rực rỡ',
    desc: 'Mặt tiền kết hợp hài hòa giữa cửa cuốn trong suốt và cửa xếp bo góc màu vàng sang trọng'
  },
  {
    src: '/about_project_result_2.jpg',
    title: 'Cửa cuốn trong suốt Polycarbonate',
    desc: 'Hệ nan trong suốt xuyên sáng 24/7 sang trọng, chịu lực va đập cao'
  },
  {
    src: '/about_project_install_1.jpg',
    title: 'Lắp đặt hệ ray uốn cong trên cao',
    desc: 'Đội ngũ kỹ thuật viên lắp đặt hệ ray cong 3D theo bán kính vòm kiến trúc'
  },
  {
    src: '/about_project_install_3.jpg',
    title: 'Đo đạc & ghép nan cửa cuốn',
    desc: 'Công đoạn định hình và ghép nối nan cửa tỉ mỉ tại mặt bằng TTTM'
  },
  {
    src: '/about_project_install_2.jpg',
    title: 'Căn chỉnh trục cuốn & nan bảo hộ',
    desc: 'Thắt đai an toàn trên giàn giáo, kiểm tra và cân chỉnh trục truyền động'
  },
  {
    src: '/about_project_install_4.jpg',
    title: 'Đội ngũ kỹ thuật thi công đồng bộ',
    desc: 'Tập thể kỹ sư & thợ thi công phối hợp nhịp nhàng, kiểm soát an toàn tuyệt đối'
  }
];

const About = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const videoSrc = "/boss_intro.mp4";

  // Điều khiển phím bàn phím khi mở Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev + 1) % ALL_AEON_IMAGES.length);
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev - 1 + ALL_AEON_IMAGES.length) % ALL_AEON_IMAGES.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  const renderKpiCards = () => (
    <>
      <RevealOnScroll animation="zoom-in" delay={100} className="exact-kpi-card">
        <div className="exact-kpi-icon">
          <Users size={22} />
        </div>
        <div className="exact-kpi-number">
          <AnimatedCounter end={10000} suffix="+" />
        </div>
        <div className="exact-kpi-text">
          <strong>KHÁCH HÀNG</strong>
          <span>Đã phục vụ</span>
        </div>
      </RevealOnScroll>

      <RevealOnScroll animation="zoom-in" delay={200} className="exact-kpi-card">
        <div className="exact-kpi-icon">
          <CalendarCheck size={22} />
        </div>
        <div className="exact-kpi-number">
          <AnimatedCounter end={10} suffix="+" />
        </div>
        <div className="exact-kpi-text">
          <strong>NĂM</strong>
          <span>Kinh nghiệm</span>
        </div>
      </RevealOnScroll>

      <RevealOnScroll animation="zoom-in" delay={300} className="exact-kpi-card">
        <div className="exact-kpi-icon">
          <BadgeCheck size={22} />
        </div>
        <div className="exact-kpi-number">
          <AnimatedCounter end={100} suffix="%" />
        </div>
        <div className="exact-kpi-text">
          <strong>SẢN PHẨM</strong>
          <span>Chính hãng</span>
        </div>
      </RevealOnScroll>

      <RevealOnScroll animation="zoom-in" delay={400} className="exact-kpi-card">
        <div className="exact-kpi-icon">
          <Settings size={22} />
        </div>
        <div className="exact-kpi-number">
          <AnimatedCounter end={24} suffix="/7" />
        </div>
        <div className="exact-kpi-text">
          <strong>HỖ TRỢ</strong>
          <span>Bảo hành tận tâm</span>
        </div>
      </RevealOnScroll>
    </>
  );
  return (
    <div className="about-page-exact">
      {/* 1. HERO BANNER */}
      <section className="exact-hero-section">
        {/* Ambient Decorative Lighting */}
        <div className="exact-hero-glow-1"></div>
        <div className="exact-hero-glow-2"></div>

        <RevealOnScroll animation="fade-left" delay={200} className="exact-hero-bg-reveal">
          <div className="exact-hero-bg">
            <img className="about-desktop-hero-img" src="/boss_team_hero.jpg" alt="Showroom & Đội ngũ BOSS Đà Nẵng" />
            <img className="about-mobile-hero-img" src="/about_team.jpg" alt="Showroom & Đội ngũ BOSS Đà Nẵng" />
          </div>
        </RevealOnScroll>

        <RevealOnScroll animation="fade-down" delay={350} className="exact-hero-slogan-reveal">
          <div className="exact-hero-right-slogan">
            Chất lượng tạo nên thương hiệu
          </div>
        </RevealOnScroll>

        <div className="exact-container">
          <div className="exact-hero-grid">
            <RevealOnScroll animation="fade-up" className="exact-hero-left">
              <div className="exact-hero-subtitle">
                <span className="hero-live-dot"></span> VỀ CHÚNG TÔI
              </div>
              
              <h1 className="exact-hero-title">
                BOSS ĐÀ NẴNG <br />
                Kiến Tạo Không Gian Sống <br />
                <span className="gold-cursive cursive-font">Hiện Đại & Bền Vững</span>
              </h1>

              <p className="exact-hero-desc">
                <span className="about-desktop-text">
                  BOSS Đà Nẵng tự hào là đơn vị chuyên cung cấp và thi công các sản phẩm cửa nhựa cao cấp, mang đến giải pháp hoàn hảo cho mọi công trình.
                </span>
                <span className="about-mobile-text">
                  Chuyên cung cấp & thi công cửa cuốn, cửa kéo, cửa tự động cao cấp tại Đà Nẵng.
                </span>
              </p>

              <Link to="/san-pham" className="exact-btn-yellow">
                <span>Khám phá sản phẩm</span> <ArrowRight size={18} />
              </Link>
            </RevealOnScroll>
          </div>
        </div>

        <div className="exact-hero-dots">
          <span className="active"></span>
          <span></span>
          <span></span>
        </div>
      </section>

      {/* 2. GIỚI THIỆU VỀ BOSS ĐÀ NẴNG */}
      <section className="exact-intro-section">
        <div className="exact-container">
          <div className="exact-intro-grid">
            {/* Left Content */}
            <RevealOnScroll animation="fade-left" className="exact-intro-left">
              <div className="exact-intro-left-label">
                GIỚI THIỆU VỀ BOSS ĐÀ NẴNG
              </div>

              <h2>
                <span className="about-desktop-text">Thương hiệu cửa nhựa cao cấp hàng đầu</span>
                <span className="about-mobile-text">Thương hiệu cửa hàng đầu</span>
              </h2>

              <p>
                <span className="about-desktop-text">
                  BOSS Đà Nẵng là đơn vị chuyên cung cấp và thi công các sản phẩm cửa nhựa cao cấp, chất lượng vượt trội và dịch vụ chuyên nghiệp nhất cho khách hàng. Với nhiều năm kinh nghiệm trong ngành, chúng tôi luôn đặt chất lượng sản phẩm và sự hài lòng của khách hàng lên hàng đầu.
                </span>
                <span className="about-mobile-text">
                  Chuyên cung cấp & thi công cửa cao cấp chính hãng, cam kết chất lượng vượt trội và dịch vụ bảo hành tận tâm.
                </span>
              </p>

              {/* 4 KPI Stats Cards (Desktop) */}
              <div className="exact-kpi-cards about-desktop-kpi">
                {renderKpiCards()}
              </div>
            </RevealOnScroll>

            {/* Right Media (Ảnh 1) */}
            <RevealOnScroll animation="fade-right" delay={200} className="exact-intro-right-media">
              <div className="exact-media-backdrop-glow"></div>
              <div className="exact-door-main-img">
                <video 
                  src={videoSrc} 
                  poster="/boss_intro_poster.jpg"
                  controls 
                  preload="metadata"
                />
              </div>

              {/* Floating Top-Right Video Badge */}
              <div className="exact-video-badge" onClick={() => setIsVideoOpen(true)} title="Bấm để xem Video">
                <div className="exact-play-button">
                  <span className="play-pulse-ring"></span>
                  <Play size={16} fill="#ffffff" />
                </div>
                <div className="exact-video-info">
                  <strong>Tìm hiểu về BOSS</strong>
                  <span>2 phút</span>
                </div>
              </div>

              {/* Bottom-Right Handwriting Callout */}
              <div className="exact-handwriting-callout">
                <span className="exact-handwriting-text">Chất lượng là cam kết!</span>
                <div className="exact-handwriting-flourish"></div>
              </div>
            </RevealOnScroll>

            {/* 4 KPI Stats Cards (Mobile - Đặt bên dưới Video theo yêu cầu: Video ở trên 4 KPI) */}
            <div className="exact-kpi-cards about-mobile-kpi">
              {renderKpiCards()}
            </div>
          </div>
        </div>
      </section>

      {/* 3. HÀNH TRÌNH PHÁT TRIỂN */}
      <section className="exact-journey-section">
        <div className="exact-container">
          <div className="exact-journey-grid">
            {/* Left Photo with Green Badge (Desktop) */}
            <div className="about-desktop-factory">
              <RevealOnScroll animation="fade-left" className="exact-factory-wrapper">
                <div className="exact-factory-img">
                  <img src="/about_meeting.jpg" alt="Đội ngũ BOSS Đà Nẵng họp triển khai kế hoạch" />
                </div>
                <div className="exact-factory-badge">
                  <span>Từ tâm huyết đến chất lượng</span>
                </div>
              </RevealOnScroll>
            </div>

            {/* Right Content */}
            <RevealOnScroll animation="fade-right" delay={150} className="exact-journey-right">
              <div className="journey-sub">HÀNH TRÌNH PHÁT TRIỂN</div>
              <h2>Từ đam mê đến giá trị bền vững</h2>

              <p>
                <span className="about-desktop-text">
                  BOSS Đà Nẵng được thành lập với sứ mệnh mang đến những sản phẩm cửa nhựa cao cấp, chất lượng vượt trội và dịch vụ chuyên nghiệp nhất cho khách hàng. Chúng tôi không ngừng đổi mới, ứng dụng công nghệ hiện đại, nâng cao chất lượng sản phẩm và dịch vụ, nhằm đáp ứng tốt nhất nhu cầu của khách hàng trong và ngoài khu vực Đà Nẵng.
                </span>
                <span className="about-mobile-text">
                  Không ngừng đổi mới công nghệ và nâng cao chất lượng dịch vụ để mang đến sản phẩm an toàn, bền bỉ nhất.
                </span>
              </p>

              {/* Photo with Green Badge (Mobile - Đặt dưới Tiêu đề & Giới thiệu) */}
              <div className="about-mobile-factory">
                <RevealOnScroll animation="fade-up" className="exact-factory-wrapper">
                  <div className="exact-factory-img">
                    <img src="/about_meeting.jpg" alt="Đội ngũ BOSS Đà Nẵng họp triển khai kế hoạch" />
                  </div>
                  <div className="exact-factory-badge">
                    <span>Từ tâm huyết đến chất lượng</span>
                  </div>
                </RevealOnScroll>
              </div>

              {/* Timeline */}
              <div className="exact-timeline-row">
                <div className="exact-timeline-item">
                  <div className="exact-timeline-dot"></div>
                  <div className="exact-timeline-year">2015</div>
                  <div className="exact-timeline-desc">
                    <span className="about-desktop-text">Thành lập BOSS Đà Nẵng</span>
                    <span className="about-mobile-text">Thành lập thương hiệu</span>
                  </div>
                </div>

                <div className="exact-timeline-item">
                  <div className="exact-timeline-dot"></div>
                  <div className="exact-timeline-year">2018</div>
                  <div className="exact-timeline-desc">
                    <span className="about-desktop-text">Mở rộng nhà xưởng, đầu tư công nghệ hiện đại</span>
                    <span className="about-mobile-text">Mở rộng xưởng sản xuất hiện đại</span>
                  </div>
                </div>

                <div className="exact-timeline-item">
                  <div className="exact-timeline-dot"></div>
                  <div className="exact-timeline-year">2024</div>
                  <div className="exact-timeline-desc">
                    <span className="about-desktop-text">Phát triển hệ thống đại lý trên toàn quốc</span>
                    <span className="about-mobile-text">Hệ thống đại lý toàn quốc</span>
                  </div>
                </div>

                <div className="exact-timeline-item current-milestone">
                  <div className="exact-timeline-dot">
                    <span className="dot-ripple"></span>
                  </div>
                  <div className="exact-timeline-year">2026</div>
                  <div className="exact-timeline-desc">
                    <span className="about-desktop-text">Ra mắt showroom hiện đại & mở rộng thị trường miền Trung</span>
                    <span className="about-mobile-text">Showroom mới & mở rộng miền Trung</span>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* 4. GIÁ TRỊ CỐT LÕI */}
      <section className="exact-values-section">
        <div className="exact-container">
          {/* Top Grid: Tiêu đề bên trái & Ảnh đội ngũ họp ở góc trên bên phải */}
          <div className="exact-values-top-grid">
            <RevealOnScroll animation="fade-up" className="exact-values-header">
              <div className="sub">GIÁ TRỊ CỐT LÕI</div>
              <h2>Vì một không gian sống tốt hơn</h2>
              <p>
                <span className="about-desktop-text">
                  BOSS Đà Nẵng luôn nỗ lực mang đến những sản phẩm và dịch vụ tốt nhất, đồng hành cùng khách hàng kiến tạo không gian sống hiện đại, tiện nghi và bền vững.
                </span>
                <span className="about-mobile-text">
                  Đồng hành kiến tạo không gian sống an toàn, hiện đại và bền vững.
                </span>
              </p>
            </RevealOnScroll>

            <RevealOnScroll animation="fade-left" delay={150} className="exact-values-top-img-wrapper">
              <div className="exact-values-top-img">
                <img src="/about_technician_install.jpg" alt="Kỹ thuật viên BOSS Đà Nẵng thi công lắp đặt cửa chuyên nghiệp" />
              </div>
            </RevealOnScroll>
          </div>

          <div className="exact-values-bottom-grid">
            {/* 5 Circular Feature Items */}
            <div className="exact-values-icons-row">
              <RevealOnScroll animation="fade-up" delay={80} className="exact-value-circle-item">
                <div className="exact-circle-icon">
                  <Leaf size={24} />
                </div>
                <div className="exact-value-label">Chất lượng<br />vượt trội</div>
              </RevealOnScroll>

              <RevealOnScroll animation="fade-up" delay={160} className="exact-value-circle-item">
                <div className="exact-circle-icon">
                  <ShieldCheck size={24} />
                </div>
                <div className="exact-value-label">Uy tín<br />trách nhiệm</div>
              </RevealOnScroll>

              <RevealOnScroll animation="fade-up" delay={240} className="exact-value-circle-item">
                <div className="exact-circle-icon">
                  <Users size={24} />
                </div>
                <div className="exact-value-label">Khách hàng<br />là trung tâm</div>
              </RevealOnScroll>

              <RevealOnScroll animation="fade-up" delay={320} className="exact-value-circle-item">
                <div className="exact-circle-icon">
                  <Lightbulb size={24} />
                </div>
                <div className="exact-value-label">Sáng tạo<br />không ngừng</div>
              </RevealOnScroll>

              <RevealOnScroll animation="fade-up" delay={400} className="exact-value-circle-item">
                <div className="exact-circle-icon">
                  <Handshake size={24} />
                </div>
                <div className="exact-value-label">Hợp tác<br />phát triển</div>
              </RevealOnScroll>
            </div>

            {/* Quote Box Card */}
            <RevealOnScroll animation="fade-right" delay={250} className="exact-quote-card">
              <div className="exact-quote-icon">“</div>
              <div className="exact-quote-text">
                Chúng tôi tin rằng, mỗi cánh cửa không chỉ là lối đi, mà còn là khởi đầu cho một không gian sống tốt đẹp hơn.
              </div>
              <div className="exact-quote-author">BOSS Đà Nẵng</div>
              <div className="exact-quote-line"></div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* 4.5. BỐ CỤC CHUẨN AEON MALL ĐÀ NẴNG - CHUỖI KKV (THEO MẪU YÊU CẦU) */}
      <section className="aeon-poster-section" id="du-an-aeon-mall">
        <div className="exact-container">
          <div className="aeon-poster-container">
            {/* 1. HERO BANNER LỚN Ở TRÊN */}
            <RevealOnScroll animation="fade-up" delay={0} className="aeon-poster-hero-wrap">
              <div 
                className="aeon-poster-hero"
                onClick={() => setLightboxIndex(0)}
                title="Bấm để xem ảnh phóng to"
              >
                <img 
                  src={AEON_POSTER_HERO.src} 
                  alt={AEON_POSTER_HERO.title} 
                  loading="lazy" 
                />
                <div className="aeon-poster-hero-overlay">
                  <h2 className="aeon-poster-hero-title">{AEON_POSTER_HERO.title}</h2>
                  <p className="aeon-poster-hero-subtitle">{AEON_POSTER_HERO.subtitle}</p>
                </div>
              </div>
            </RevealOnScroll>

            {/* 2. HÀNG 4 ẢNH THI CÔNG Ở GIỮA */}
            <div className="aeon-poster-cards-grid">
              {AEON_POSTER_CARDS.map((item, idx) => (
                <RevealOnScroll 
                  animation="fade-up" 
                  delay={idx * 120 + 80} 
                  key={item.id}
                  className="aeon-poster-card-col"
                >
                  <div 
                    className="aeon-poster-card"
                    onClick={() => {
                      const foundIdx = ALL_AEON_IMAGES.findIndex(img => img.src === item.src);
                      setLightboxIndex(foundIdx >= 0 ? foundIdx : idx);
                    }}
                    title={`Bấm xem ảnh phóng to: ${item.title}`}
                  >
                    <div className="aeon-poster-card-img">
                      <img src={item.src} alt={item.title} loading="lazy" />
                    </div>
                    <div className="aeon-poster-card-body">
                      <div className="aeon-poster-gold-line"></div>
                      <span className="aeon-poster-card-title">{item.title}</span>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>

            {/* 3. THANH 4 CAM KẾT / GIÁ TRỊ Ở DƯỚI CÙNG */}
            <RevealOnScroll animation="fade-up" delay={200} className="aeon-poster-values-wrap">
              <div className="aeon-poster-values-bar">
                {AEON_POSTER_VALUES.map((val, idx) => {
                  const IconComp = val.icon;
                  return (
                    <div key={idx} className="aeon-poster-value-item">
                      <div className="aeon-poster-value-icon">
                        <IconComp size={24} />
                      </div>
                      <div className="aeon-poster-value-text">
                        <h4>{val.title}</h4>
                        <p>{val.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* 5. CTA BANNER */}
      <section className="exact-cta-section">
        <div className="exact-container">
          <RevealOnScroll animation="zoom-in" className="exact-cta-box">
            {/* Ambient Lighting in CTA */}
            <div className="exact-cta-glow"></div>

            <div className="exact-cta-left-img">
              <img src="/about_cta_technicians.jpg" alt="Đội ngũ kỹ thuật viên BOSS Đà Nẵng thi công chuyên nghiệp" />
            </div>

            <div className="exact-cta-right-content">
              <div className="sub">BOSS ĐÀ NẴNG</div>
              <h2>Sẵn sàng đồng hành cùng bạn</h2>
              <p>
                <span className="about-desktop-text">
                  Liên hệ ngay để được tư vấn miễn phí và nhận báo giá tốt nhất cho các sản phẩm cửa nhựa cao cấp.
                </span>
                <span className="about-mobile-text">
                  Liên hệ ngay để nhận tư vấn và báo giá ưu đãi tốt nhất.
                </span>
              </p>

              <div className="exact-cta-footer-row">
                <a href="tel:0904678323" className="exact-btn-yellow">
                  <Phone size={18} className="cta-phone-icon" /> <span>Liên hệ ngay</span> <ArrowRight size={18} />
                </a>

                <div className="exact-cta-footer-text">
                  BOSS Đà Nẵng | Kiến tạo giá trị bền vững
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* VIDEO POPUP LIGHTBOX MODAL */}
      {isVideoOpen && createPortal(
        <div className="video-modal-backdrop" onClick={() => setIsVideoOpen(false)}>
          <div className="video-modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={() => setIsVideoOpen(false)}>
              <X size={20} />
            </button>
            <video 
              src={videoSrc} 
              poster="/boss_intro_poster.jpg"
              controls 
              autoPlay 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        </div>,
        document.body
      )}

      {/* IMAGE LIGHTBOX POPUP MODAL */}
      {lightboxIndex !== null && ALL_AEON_IMAGES[lightboxIndex] && createPortal(
        <div 
          className="about-lightbox-backdrop" 
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="about-lightbox-content" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button 
              type="button" 
              className="about-lightbox-close-btn"
              onClick={() => setLightboxIndex(null)}
              aria-label="Đóng ảnh"
            >
              <X size={22} />
            </button>

            {/* Prev Button */}
            <button 
              type="button" 
              className="about-lightbox-nav-btn prev"
              onClick={() => setLightboxIndex((prev) => (prev - 1 + ALL_AEON_IMAGES.length) % ALL_AEON_IMAGES.length)}
              aria-label="Ảnh trước"
            >
              <ChevronLeft size={28} />
            </button>

            {/* Next Button */}
            <button 
              type="button" 
              className="about-lightbox-nav-btn next"
              onClick={() => setLightboxIndex((prev) => (prev + 1) % ALL_AEON_IMAGES.length)}
              aria-label="Ảnh kế tiếp"
            >
              <ChevronRight size={28} />
            </button>

            {/* Main Image Frame */}
            <div className="about-lightbox-img-frame">
              <img 
                src={ALL_AEON_IMAGES[lightboxIndex].src} 
                alt={ALL_AEON_IMAGES[lightboxIndex].title} 
              />
            </div>

            {/* Image Details Caption */}
            <div className="about-lightbox-caption">
              <div className="about-lightbox-badge-row">
                <span className="about-lightbox-pill">
                  Dự án AEON Mall Đà Nẵng
                </span>
                <span className="about-lightbox-counter">
                  Ảnh {lightboxIndex + 1} / {ALL_AEON_IMAGES.length}
                </span>
              </div>
              <h3 className="about-lightbox-title">
                {ALL_AEON_IMAGES[lightboxIndex].title}
              </h3>
              <p className="about-lightbox-desc">
                {ALL_AEON_IMAGES[lightboxIndex].desc}
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default About;
