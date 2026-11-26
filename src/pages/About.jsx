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
  Building2
} from 'lucide-react';
import './About.css';
import RevealOnScroll from '../components/RevealOnScroll';
import AnimatedCounter from '../components/AnimatedCounter';
import Workflow from '../components/Workflow';

// Danh sách 7 hình ảnh Bento Grid dự án AEON Mall Đà Nẵng (Chuỗi KKV)
const BENTO_AEON_GALLERY = [
  {
    id: 1,
    role: 'hero', // 2 cols x 2 rows lớn
    title: 'Toàn cảnh mặt tiền KKV – AEON Mall Đà Nẵng',
    subtitle: 'Đại siêu thị phụ kiện & làm đẹp KKV',
    description: 'Mặt tiền đại siêu thị KKV rực rỡ với sự kết hợp hài hòa giữa cửa cuốn trong suốt và cửa xếp bo góc màu vàng sang trọng, bàn giao hoàn thiện đúng tiến độ.',
    src: '/about_project_result_3.jpg',
    tag: '⭐ Bàn giao hoàn thiện'
  },
  {
    id: 2,
    role: 'normal',
    title: 'Cửa cuốn trong suốt Polycarbonate',
    subtitle: 'Xuyên sáng 24/7',
    description: 'Hệ nan trong suốt sang trọng, chịu lực va đập cao, giúp khách hàng quan sát toàn bộ sản phẩm bên trong ngay cả khi đóng cửa.',
    src: '/about_project_result_2.jpg',
    tag: 'Cửa cuốn trong suốt'
  },
  {
    id: 3,
    role: 'normal',
    title: 'Cửa xếp trượt uốn cong bo góc',
    subtitle: 'Màu trắng sữa trang nhã',
    description: 'Hệ cửa xếp trượt cong ôm trọn đường cung mặt tiền, đóng mở nhẹ nhàng, tối ưu 100% diện tích kinh doanh.',
    src: '/about_project_result_1.jpg',
    tag: 'Cửa xếp cong bo góc'
  },
  {
    id: 4,
    role: 'normal',
    title: 'Lắp đặt ray uốn cong trên cao',
    subtitle: 'Kỹ thuật định hình vòm 3D',
    description: 'Kỹ thuật viên căn chỉnh chính xác bán kính vòm kiến trúc. Trang bị đồ bảo hộ, mũ và giàn giáo đạt chuẩn an toàn TTTM.',
    src: '/about_project_install_1.jpg',
    tag: 'Kỹ thuật ray cong'
  },
  {
    id: 5,
    role: 'normal',
    title: 'Cân chỉnh trục cuốn & nan bảo hộ',
    subtitle: 'An toàn lao động khắt khe',
    description: 'Thắt đai an toàn trên giàn giáo, kiểm tra và cân chỉnh từng nan cửa cùng khớp truyền động để cửa vận hành êm ái.',
    src: '/about_project_install_2.jpg',
    tag: 'Quy chuẩn an toàn'
  },
  {
    id: 6,
    role: 'wide', // 2 cols span
    title: 'Đo đạc & ghép nan uốn cong tại mặt bằng',
    subtitle: 'Gia công tỉ mỉ từng chi tiết',
    description: 'Công đoạn đo đạc và định hình nan cửa uốn cong ngay tại mặt bằng trước khi lắp ráp vào hệ ray trượt bo góc mềm mại.',
    src: '/about_project_install_3.jpg',
    tag: 'Gia công tỉ mỉ'
  },
  {
    id: 7,
    role: 'wide', // 2 cols span
    title: 'Đội ngũ kỹ thuật thi công đồng bộ trên giàn giáo',
    subtitle: 'Đội ngũ thực chiến chuyên nghiệp',
    description: 'Tập thể kỹ sư & thợ thi công phối hợp nhịp nhàng trên hệ giàn giáo, kiểm soát chặt chẽ từng chi tiết kết cấu và thẩm mỹ.',
    src: '/about_project_install_4.jpg',
    tag: 'Đội ngũ thực chiến'
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
        setLightboxIndex((prev) => (prev + 1) % BENTO_AEON_GALLERY.length);
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev - 1 + BENTO_AEON_GALLERY.length) % BENTO_AEON_GALLERY.length);
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

      {/* 4.5. DỰ ÁN TIÊU BIỂU TẠI AEON MALL ĐÀ NẴNG (BENTO GRID NGHỆ THUẬT) */}
      <section className="aeon-bento-section" id="du-an-aeon-mall">
        <div className="exact-container">
          {/* Header thanh lịch, thoáng đãng, không đóng hộp */}
          <RevealOnScroll animation="fade-up" className="aeon-bento-header">
            <div className="aeon-bento-badge">
              <Sparkles size={15} /> DỰ ÁN TRỌNG ĐIỂM TIÊU BIỂU
            </div>
            <h2 className="aeon-bento-title">
              Hệ Cửa Cuốn & Cửa Xếp Trượt Bo Góc <br />
              <span>Gian Hàng KKV – TTTM AEON Mall Đà Nẵng</span>
            </h2>
            <p className="aeon-bento-lead">
              Minh chứng thực tế cho năng lực thi công kỹ thuật cao của BOSS Đà Nẵng tại đại trung tâm thương mại lớn, đáp ứng tiêu chuẩn an toàn lao động và độ tinh xảo kiến trúc khắt khe nhất.
            </p>
          </RevealOnScroll>

          {/* Bento Grid 7 ảnh nghệ thuật */}
          <div className="aeon-bento-grid">
            {BENTO_AEON_GALLERY.map((item, index) => (
              <RevealOnScroll
                animation="fade-up"
                delay={(index % 4) * 80}
                key={item.id}
                className={`aeon-bento-card-wrap role-${item.role}`}
              >
                <div
                  className={`aeon-bento-card role-${item.role}`}
                  onClick={() => setLightboxIndex(index)}
                  title={`Bấm xem ảnh to: ${item.title}`}
                >
                  <img src={item.src} alt={item.title} loading="lazy" />
                  
                  {/* Tag góc trên */}
                  <span className="bento-card-tag">{item.tag}</span>

                  {/* Gradient tối nhẹ ở đáy ảnh với phụ đề & tiêu đề */}
                  <div className="bento-card-content">
                    <span className="bento-card-subtitle">{item.subtitle}</span>
                    <h3 className="bento-card-title">{item.title}</h3>
                    <div className="bento-card-hover-hint">
                      <Maximize2 size={15} />
                      <span>Xem phóng to</span>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* 5. QUY TRÌNH LÀM VIỆC */}
      <Workflow />

      {/* 6. CTA BANNER */}
      <section className="exact-cta-section">
        <div className="exact-container">
          <RevealOnScroll animation="zoom-in" className="exact-cta-box">
            {/* Ambient Lighting in CTA */}
            <div className="exact-cta-glow"></div>

            <div className="exact-cta-left-img">
              <img src="/about_door_1.png" alt="Cửa nhựa cao cấp" />
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
      {lightboxIndex !== null && BENTO_AEON_GALLERY[lightboxIndex] && createPortal(
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
              onClick={() => setLightboxIndex((prev) => (prev - 1 + BENTO_AEON_GALLERY.length) % BENTO_AEON_GALLERY.length)}
              aria-label="Ảnh trước"
            >
              <ChevronLeft size={28} />
            </button>

            {/* Next Button */}
            <button 
              type="button" 
              className="about-lightbox-nav-btn next"
              onClick={() => setLightboxIndex((prev) => (prev + 1) % BENTO_AEON_GALLERY.length)}
              aria-label="Ảnh kế tiếp"
            >
              <ChevronRight size={28} />
            </button>

            {/* Main Image Frame */}
            <div className="about-lightbox-img-frame">
              <img 
                src={BENTO_AEON_GALLERY[lightboxIndex].src} 
                alt={BENTO_AEON_GALLERY[lightboxIndex].title} 
              />
            </div>

            {/* Image Details Caption */}
            <div className="about-lightbox-caption">
              <div className="about-lightbox-badge-row">
                <span className="about-lightbox-pill">
                  {BENTO_AEON_GALLERY[lightboxIndex].tag}
                </span>
                <span className="about-lightbox-counter">
                  Ảnh {lightboxIndex + 1} / {BENTO_AEON_GALLERY.length}
                </span>
              </div>
              <h3 className="about-lightbox-title">
                {BENTO_AEON_GALLERY[lightboxIndex].title}
              </h3>
              <p className="about-lightbox-desc">
                {BENTO_AEON_GALLERY[lightboxIndex].description}
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
