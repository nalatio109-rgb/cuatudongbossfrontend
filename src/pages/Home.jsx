import React from 'react';
import { ArrowRight, Shield, Zap, Wrench, Headphones, Leaf, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="green-door-layout">
      {/* 1. Hero Section (Dark Green Base) */}
      <section className="hero-gd">
        <div className="hero-gd-container">
          <div className="hero-gd-content">
            <h1 className="hero-gd-title">
              CỬA TỰ ĐỘNG <br />
              <span className="text-gd-yellow">HIỆN ĐẠI – AN TOÀN – TIỆN LỢI</span>
            </h1>
            <p className="hero-gd-desc">
              Giải pháp tối ưu cho mọi công trình, mang đến sự tiện nghi, sang trọng và tiết kiệm năng lượng.
            </p>
            
            <div className="hero-gd-features">
              <div className="h-feat-item">
                <div className="h-feat-icon"><CheckCircle2 size={24} /></div>
                <div className="h-feat-text">
                  <strong>Vận hành êm ái</strong>
                  <span>Độ ồn cực thấp</span>
                </div>
              </div>
              <div className="h-feat-item">
                <div className="h-feat-icon"><Shield size={24} /></div>
                <div className="h-feat-text">
                  <strong>An toàn tuyệt đối</strong>
                  <span>Cảm biến thông minh</span>
                </div>
              </div>
              <div className="h-feat-item">
                <div className="h-feat-icon"><Leaf size={24} /></div>
                <div className="h-feat-text">
                  <strong>Tiết kiệm năng lượng</strong>
                  <span>Thân thiện môi trường</span>
                </div>
              </div>
            </div>

            <div className="hero-gd-actions">
              <Link to="/san-pham" className="btn-gd btn-gd-red">
                XEM SẢN PHẨM <ArrowRight size={18} />
              </Link>
              <Link to="/bao-gia" className="btn-gd btn-gd-yellow">
                NHẬN BÁO GIÁ <ArrowRight size={18} />
              </Link>
            </div>
          </div>
          <div className="hero-gd-image">
            <div className="hero-img-wrapper">
              <img src="/hero_bg.png" alt="Cửa tự động" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats Banner (Dark Green Box) */}
      <section className="stats-gd-wrapper container">
        <div className="stats-gd">
          <div className="stat-gd-item">
            <div className="stat-icon-gd"><CheckCircle2 size={36} /></div>
            <div className="stat-text-gd">
              <h3>1000+</h3>
              <p>Khách hàng tin tưởng trên toàn quốc</p>
            </div>
          </div>
          <div className="stat-gd-item">
            <div className="stat-icon-gd"><CheckCircle2 size={36} /></div>
            <div className="stat-text-gd">
              <h3>1500+</h3>
              <p>Dự án đã triển khai thành công</p>
            </div>
          </div>
          <div className="stat-gd-item">
            <div className="stat-icon-gd"><CheckCircle2 size={36} /></div>
            <div className="stat-text-gd">
              <h3>5+</h3>
              <p>Năm kinh nghiệm trong lĩnh vực</p>
            </div>
          </div>
          <div className="stat-gd-item">
            <div className="stat-icon-gd"><Headphones size={36} /></div>
            <div className="stat-text-gd">
              <h3>24/7</h3>
              <p>Hỗ trợ kỹ thuật mọi lúc, mọi nơi</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Products Section (White Background) */}
      <section className="products-gd section-padding">
        <div className="container">
          <div className="section-title-gd text-center">
            <span className="subtitle-gd">SẢN PHẨM</span>
            <h2>DANH MỤC SẢN PHẨM</h2>
          </div>
          
          <div className="products-gd-grid">
            {/* Product 1 */}
            <div className="product-card-gd">
              <div className="badge-gd red">BÁN CHẠY</div>
              <div className="product-img-gd">
                <img src="/project_1.png" alt="Cửa trượt tự động" />
              </div>
              <div className="product-info-gd">
                <h3>CỬA TRƯỢT TỰ ĐỘNG</h3>
                <p>Thiết kế hiện đại, vận hành êm ái, phù hợp cho mọi công trình.</p>
                <Link to="/san-pham" className="card-link-gd">
                  XEM CHI TIẾT <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Product 2 */}
            <div className="product-card-gd">
              <div className="product-img-gd">
                <img src="/hero_bg.png" alt="Cửa mở tự động" />
              </div>
              <div className="product-info-gd">
                <h3>CỬA MỞ TỰ ĐỘNG</h3>
                <p>Độ bền cao, đóng mở linh hoạt, an toàn và tiện lợi.</p>
                <Link to="/san-pham" className="card-link-gd">
                  XEM CHI TIẾT <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Product 3 */}
            <div className="product-card-gd">
              <div className="product-img-gd">
                <img src="/project_1.png" alt="Cửa cong tự động" />
              </div>
              <div className="product-info-gd">
                <h3>CỬA CONG TỰ ĐỘNG</h3>
                <p>Sang trọng, đẳng cấp, tối ưu không gian và hiệu quả sử dụng.</p>
                <Link to="/san-pham" className="card-link-gd">
                  XEM CHI TIẾT <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Product 4 */}
            <div className="product-card-gd">
              <div className="badge-gd yellow">NEW</div>
              <div className="product-img-gd">
                <img src="/hero_bg.png" alt="Cửa cuốn tốc độ cao" />
              </div>
              <div className="product-info-gd">
                <h3>CỬA CUỐN TỐC ĐỘ CAO</h3>
                <p>Đóng mở nhanh chóng, bền bỉ, phù hợp cho nhà xưởng, kho bãi.</p>
                <Link to="/san-pham" className="card-link-gd">
                  XEM CHI TIẾT <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us Section (Dark Green Background) */}
      <section className="why-gd bg-gd-dark section-padding">
        <div className="container">
          <div className="why-gd-grid">
            <div className="why-gd-left">
              <span className="subtitle-gd text-white">VÌ SAO CHỌN CHÚNG TÔI?</span>
              <h2 className="text-gd-yellow">CHẤT LƯỢNG TẠO NÊN <br/> NIỀM TIN</h2>
              <p className="text-white">BOSS Đà Nẵng cam kết mang đến sản phẩm chất lượng cao, dịch vụ chuyên nghiệp và giải pháp tối ưu cho khách hàng.</p>
              <Link to="/gioi-thieu" className="btn-gd btn-gd-red" style={{marginTop: '1rem'}}>
                TÌM HIỂU THÊM <ArrowRight size={18} />
              </Link>
            </div>
            
            <div className="why-gd-right">
              <div className="why-feat">
                <div className="why-icon"><Shield size={32} /></div>
                <h4>SẢN PHẨM CHẤT LƯỢNG</h4>
                <p>Nhập khẩu chính hãng, đảm bảo độ bền và hiệu suất cao.</p>
              </div>
              <div className="why-feat">
                <div className="why-icon"><Wrench size={32} /></div>
                <h4>LẮP ĐẶT CHUYÊN NGHIỆP</h4>
                <p>Đội ngũ kỹ thuật giàu kinh nghiệm, thi công nhanh chóng, chuẩn xác.</p>
              </div>
              <div className="why-feat">
                <div className="why-icon"><Zap size={32} /></div>
                <h4>BẢO HÀNH UY TÍN</h4>
                <p>Chính sách bảo hành dài hạn, bảo trì định kỳ, hỗ trợ kịp thời.</p>
              </div>
              <div className="why-feat">
                <div className="why-icon"><Headphones size={32} /></div>
                <h4>HỖ TRỢ 24/7</h4>
                <p>Luôn sẵn sàng giải đáp, hỗ trợ khách hàng mọi lúc, mọi nơi.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
