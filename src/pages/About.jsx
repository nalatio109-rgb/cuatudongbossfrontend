import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Users, 
  Star, 
  Leaf, 
  Lightbulb, 
  Handshake, 
  ArrowRight, 
  Play, 
  Phone,
  X
} from 'lucide-react';
import './About.css';
import RevealOnScroll from '../components/RevealOnScroll';
import Workflow from '../components/Workflow';

const About = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const videoSrc = "/BOSS%20YOUTUBE.mp4";
  return (
    <div className="about-page-exact">
      {/* 1. HERO BANNER */}
      <section className="exact-hero-section">
        <div className="exact-hero-bg">
          <img src="/hero_building.png" alt="Tòa nhà BOSS Đà Nẵng" />
        </div>

        <div className="exact-hero-right-slogan">
          Chất lượng tạo nên thương hiệu
        </div>

        <div className="exact-container">
          <div className="exact-hero-grid">
            <RevealOnScroll animation="fade-up" className="exact-hero-left">
              <div className="exact-hero-subtitle">VỀ CHÚNG TÔI</div>
              
              <h1 className="exact-hero-title">
                BOSS ĐÀ NẴNG <br />
                Kiến Tạo Không Gian Sống <br />
                <span className="gold-cursive cursive-font">Hiện Đại & Bền Vững</span>
              </h1>

              <p className="exact-hero-desc">
                BOSS Đà Nẵng tự hào là đơn vị chuyên cung cấp và thi công các sản phẩm cửa nhựa cao cấp, mang đến giải pháp hoàn hảo cho mọi công trình.
              </p>

              <Link to="/san-pham" className="exact-btn-yellow">
                Khám phá sản phẩm <ArrowRight size={18} />
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

              <h2>Thương hiệu cửa nhựa cao cấp hàng đầu</h2>

              <p>
                BOSS Đà Nẵng là đơn vị chuyên cung cấp và thi công các sản phẩm cửa nhựa cao cấp, chất lượng vượt trội và dịch vụ chuyên nghiệp nhất cho khách hàng. Với nhiều năm kinh nghiệm trong ngành, chúng tôi luôn đặt chất lượng sản phẩm và sự hài lòng của khách hàng lên hàng đầu.
              </p>

              {/* 3 KPI Stats Cards */}
              <div className="exact-kpi-cards">
                <RevealOnScroll animation="zoom-in" delay={100} className="exact-kpi-card">
                  <div className="exact-kpi-icon">
                    <ShieldCheck size={22} />
                  </div>
                  <div className="exact-kpi-number">+5000</div>
                  <div className="exact-kpi-text">Công trình đã thi công</div>
                </RevealOnScroll>

                <RevealOnScroll animation="zoom-in" delay={200} className="exact-kpi-card">
                  <div className="exact-kpi-icon">
                    <Users size={22} />
                  </div>
                  <div className="exact-kpi-number">+10 năm</div>
                  <div className="exact-kpi-text">Kinh nghiệm trong ngành</div>
                </RevealOnScroll>

                <RevealOnScroll animation="zoom-in" delay={300} className="exact-kpi-card">
                  <div className="exact-kpi-icon">
                    <Star size={22} />
                  </div>
                  <div className="exact-kpi-number">100%</div>
                  <div className="exact-kpi-text">Khách hàng hài lòng</div>
                </RevealOnScroll>
              </div>
            </RevealOnScroll>

            {/* Right Media */}
            <RevealOnScroll animation="fade-right" delay={200} className="exact-intro-right-media">
              <div className="exact-door-main-img">
                <video 
                  src={videoSrc} 
                  controls 
                  preload="metadata"
                  style={{ width: '100%', height: '420px', objectFit: 'cover', borderRadius: '20px', display: 'block' }}
                />
              </div>

              {/* Floating Top-Right Video Badge */}
              <div className="exact-video-badge" onClick={() => setIsVideoOpen(true)} title="Bấm để xem Video">
                <div className="exact-play-button">
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
          </div>
        </div>
      </section>

      {/* 3. HÀNH TRÌNH PHÁT TRIỂN */}
      <section className="exact-journey-section">
        <div className="exact-container">
          <div className="exact-journey-grid">
            {/* Left Photo with Green Badge */}
            <RevealOnScroll animation="fade-left" className="exact-factory-wrapper">
              <div className="exact-factory-img">
                <img src="/factory_worker.png" alt="Nhà xưởng sản xuất BOSS Đà Nẵng" />
              </div>
              <div className="exact-factory-badge">
                <span>Từ tâm huyết đến chất lượng</span>
              </div>
            </RevealOnScroll>

            {/* Right Content */}
            <RevealOnScroll animation="fade-right" delay={150} className="exact-journey-right">
              <div className="journey-sub">HÀNH TRÌNH PHÁT TRIỂN</div>
              <h2>TỪ ĐAM MÊ ĐẾN GIÁ TRỊ BỀN VỮNG</h2>

              <p>
                BOSS Đà Nẵng được thành lập với sứ mệnh mang đến những sản phẩm cửa nhựa cao cấp, chất lượng vượt trội và dịch vụ chuyên nghiệp nhất cho khách hàng. Chúng tôi không ngừng đổi mới, ứng dụng công nghệ hiện đại, nâng cao chất lượng sản phẩm và dịch vụ, nhằm đáp ứng tốt nhất nhu cầu của khách hàng trong và ngoài khu vực Đà Nẵng.
              </p>

              {/* Timeline */}
              <div className="exact-timeline-row">
                <div className="exact-timeline-item">
                  <div className="exact-timeline-dot"></div>
                  <div className="exact-timeline-year">2015</div>
                  <div className="exact-timeline-desc">Thành lập BOSS Đà Nẵng</div>
                </div>

                <div className="exact-timeline-item">
                  <div className="exact-timeline-dot"></div>
                  <div className="exact-timeline-year">2018</div>
                  <div className="exact-timeline-desc">Mở rộng nhà xưởng, đầu tư công nghệ hiện đại</div>
                </div>

                <div className="exact-timeline-item">
                  <div className="exact-timeline-dot"></div>
                  <div className="exact-timeline-year">2024</div>
                  <div className="exact-timeline-desc">Phát triển hệ thống đại lý trên toàn quốc</div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* 4. GIÁ TRỊ CỐT LÕI */}
      <section className="exact-values-section">
        <div className="exact-container">
          <RevealOnScroll animation="fade-up" className="exact-values-header">
            <div className="sub">GIÁ TRỊ CỐT LÕI</div>
            <h2>Vì một không gian sống tốt hơn</h2>
            <p>
              BOSS Đà Nẵng luôn nỗ lực mang đến những sản phẩm và dịch vụ tốt nhất, đồng hành cùng khách hàng kiến tạo không gian sống hiện đại, tiện nghi và bền vững.
            </p>
          </RevealOnScroll>

          <div className="exact-values-bottom-grid">
            {/* 5 Circular Feature Items */}
            <RevealOnScroll animation="fade-left" delay={150} className="exact-values-icons-row">
              <div className="exact-value-circle-item">
                <div className="exact-circle-icon">
                  <Leaf size={24} />
                </div>
                <div className="exact-value-label">Chất lượng<br />vượt trội</div>
              </div>

              <div className="exact-value-circle-item">
                <div className="exact-circle-icon">
                  <ShieldCheck size={24} />
                </div>
                <div className="exact-value-label">Uy tín<br />trách nhiệm</div>
              </div>

              <div className="exact-value-circle-item">
                <div className="exact-circle-icon">
                  <Users size={24} />
                </div>
                <div className="exact-value-label">Khách hàng<br />là trung tâm</div>
              </div>

              <div className="exact-value-circle-item">
                <div className="exact-circle-icon">
                  <Lightbulb size={24} />
                </div>
                <div className="exact-value-label">Sáng tạo<br />không ngừng</div>
              </div>

              <div className="exact-value-circle-item">
                <div className="exact-circle-icon">
                  <Handshake size={24} />
                </div>
                <div className="exact-value-label">Hợp tác<br />phát triển</div>
              </div>
            </RevealOnScroll>

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

      {/* 5. QUY TRÌNH LÀM VIỆC */}
      <Workflow />

      {/* 6. CTA BANNER */}
      <section className="exact-cta-section">
        <div className="exact-container">
          <RevealOnScroll animation="zoom-in" className="exact-cta-box">
            <div className="exact-cta-left-img">
              <img src="/about_door_1.png" alt="Cửa nhựa cao cấp" />
            </div>

            <div className="exact-cta-right-content">
              <div className="sub">BOSS ĐÀ NẴNG</div>
              <h2>Sẵn sàng đồng hành cùng bạn</h2>
              <p>
                Liên hệ ngay để được tư vấn miễn phí và nhận báo giá tốt nhất cho các sản phẩm cửa nhựa cao cấp.
              </p>

              <div className="exact-cta-footer-row">
                <a href="tel:0904678323" className="exact-btn-yellow">
                  <Phone size={18} /> Liên hệ ngay <ArrowRight size={18} />
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
              controls 
              autoPlay 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default About;
