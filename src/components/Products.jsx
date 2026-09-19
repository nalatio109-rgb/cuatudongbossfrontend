import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, Home, AlignJustify, ArrowRightLeft, Columns, ShieldCheck, CheckCircle2, Star, HeadphonesIcon, X, Check, Eye } from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function Products() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    });

    const cards = document.querySelectorAll(".new-product-card, .features-bottom-bar, .section-header-flex, .product-category-tabs");
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [activeTab]);

  const categories = [
    { id: "all", label: "TẤT CẢ" },
    { id: "cuacuon", label: "CỬA CUỐN" },
    { id: "cuatudong", label: "CỬA TỰ ĐỘNG" },
    { id: "barrier", label: "BARRIER & CỔNG" },
    { id: "nhomkinh", label: "NHÔM KÍNH" },
  ];

  const products = [
    {
      id: 1,
      category: "cuacuon",
      image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=800&q=80",
      title: "CỬA CUỐN",
      description: "Vận hành bền bỉ, an toàn tuyệt đối",
      details: "Hệ thống cửa cuốn công nghệ Đức, thân cửa hợp kim nhôm cao cấp 6063-T5, tích hợp công biến đảo chiều thông minh khi gặp vật cản.",
      specs: ["Hợp kim nhôm cao cấp", "Độ dày: 1.2 - 2.4 mm", "Tích hợp cảm biến an toàn", "Bảo hành 5 năm"],
      icon: <Home size={24} />,
      isNew: true
    },
    {
      id: 2,
      category: "cuacuon",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      title: "CỬA KHE\nTHOÁNG",
      description: "Thoáng khí tối ưu, bảo vệ toàn diện",
      details: "Thiết kế lỗ thoáng nghệ thuật điều chỉnh đón ánh sáng & gió tự nhiên, sơn tĩnh điện ngoài trời cao cấp bảo vệ bề mặt lên tới 10 năm.",
      specs: ["Kết cấu khe thoáng kép", "Giảm âm siêu êm", "Màu sắc: Ghi xám, Vàng kem", "Điều khiển từ xa qua Wi-Fi"],
      icon: <AlignJustify size={24} />,
      isNew: true
    },
    {
      id: 3,
      category: "cuatudong",
      image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=800&q=80",
      title: "CỬA TRƯỢT\nTỰ ĐỘNG",
      description: "Đóng mở êm ái, hiện đại và tiện nghi",
      details: "Động cơ DC không chổi than mạnh mẽ, mắt thần radar vi sóng phát hiện chuyển động siêu nhạy, phù hợp cho trung tâm thương mại và văn phòng.",
      specs: ["Động cơ DC Brushless", "Tải trọng: 150kg x 2 cánh", "Tốc độ mở: 15-50 cm/s", "Tuổi thọ > 2.000.000 lần"],
      icon: <ArrowRightLeft size={24} />,
      isNew: false
    },
    {
      id: 4,
      category: "barrier",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      title: "CỔNG\nTỰ ĐỘNG",
      description: "An ninh vượt trội, khẳng định đẳng cấp",
      details: "Mô tơ âm sàn / tay co thủy lực nhập khẩu Ý, chịu lực tốt, chống nước IP67 tiêu chuẩn Châu Âu, tích hợp nhận diện biển số xe.",
      specs: ["Tiêu chuẩn chống nước IP67", "Tích hợp thẻ từ & Remote", "Góc mở rộng 110°-180°", "Công nghệ Ý chính hãng"],
      icon: <Columns size={24} />,
      isNew: true
    },
    {
      id: 5,
      category: "barrier",
      image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
      title: "BARRIER\nTỰ ĐỘNG",
      description: "Kiểm soát an ninh, quản lý ra vào",
      details: "Thanh chắn Barrier tốc độ cao 1.5s - 6s, lý tưởng cho khu đô thị, bãi xe thông minh, tòa nhà và cơ quan hành chính.",
      specs: ["Chiều dài cần: 2m - 6m", "Tốc độ đóng mở: 1.5s - 6s", "Đèn LED cảnh báo ban đêm", "Chống va đập thông minh"],
      icon: <AlignJustify size={24} />,
      isNew: false
    },
    {
      id: 6,
      category: "nhomkinh",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      title: "CỬA NHÔM\nKÍNH",
      description: "Cách âm, cách nhiệt, sang trọng",
      details: "Hệ nhôm Xingfa nhập khẩu kết hợp kính cường lực 2 lớp hút chân không cách âm cách nhiệt hoàn hảo, kiến tạo vẻ đẹp kiến trúc đẳng cấp.",
      specs: ["Nhôm Xingfa Quảng Đông", "Kính hộp 2-3 lớp an toàn", "Phụ kiện Cmech / Kinlong", "Cách âm lên đến 95%"],
      icon: <Home size={24} />,
      isNew: true
    },
  ];

  const filteredProducts = activeTab === "all" 
    ? products 
    : products.filter(p => p.category === activeTab);

  // 3D Parallax Tilt Handler
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)`;
  };

  return (
    <>
      {/* ================= PRODUCTS ================= */}
      <section ref={sectionRef} className="products-section" id="products">
        <div className="container">
          <div className="section-header-flex">
            <div className="section-title-left">
              <div className="section-subtitle">
                <span>SẢN PHẨM NỔI BẬT</span>
                <div className="subtitle-line"></div>
              </div>
              <h2>DANH MỤC SẢN PHẨM</h2>
            </div>
            <a href="#products" className="btn-outline">
              XEM TẤT CẢ <ArrowRight size={14} />
            </a>
          </div>

          {/* Interactive Category Filter Tabs */}
          <div className="product-category-tabs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-tab-btn ${activeTab === cat.id ? "active" : ""}`}
                onClick={() => setActiveTab(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
          
          <div className="new-product-grid" key={activeTab}>
            {filteredProducts.map((product, index) => (
              <div 
                className="new-product-card" 
                key={product.id}
                style={{ "--card-index": index }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={() => {
                  const { icon, ...serializableProduct } = product;
                  navigate(`/san-pham/${product.id}`, { state: { product: serializableProduct } });
                }}
              >
                <div className="new-product-content">
                  <div className="product-icon-badge">{product.icon}</div>
                  {product.isNew && <span className="badge-new">MỚI</span>}
                  <h3 dangerouslySetInnerHTML={{ __html: product.title.replace(/\n/g, '<br/>') }}></h3>
                  <div className="title-underline"></div>
                  <p className="product-desc">{product.description}</p>
                  <button className="btn-explore" onClick={(e) => {
                    e.stopPropagation();
                    const { icon, ...serializableProduct } = product;
                    navigate(`/san-pham/${product.id}`, { state: { product: serializableProduct } });
                  }}>
                    KHÁM PHÁ NGAY <ArrowRight size={14} />
                  </button>
                </div>
                <div className="new-product-img">
                  <img src={product.image} alt={product.title.replace(/\n/g, ' ')} />
                  <div className="img-shimmer"></div>
                  <div className="img-hover-overlay">
                    <Eye size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Features Bottom Bar */}
          <div className="features-bottom-bar">
            <div className="feature-item">
              <div className="feat-icon"><ShieldCheck size={28} /></div>
              <div className="feat-text">
                <h4>AN TOÀN</h4>
                <p>Đảm bảo an toàn<br/>trong mọi vận hành</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feat-icon yellow"><CheckCircle2 size={28} /></div>
              <div className="feat-text">
                <h4>BỀN BỈ</h4>
                <p>Chất liệu cao cấp,<br/>độ bền vượt thời gian</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feat-icon red"><Star size={28} /></div>
              <div className="feat-text">
                <h4>THẨM MỸ</h4>
                <p>Thiết kế tinh tế,<br/>nâng tầm không gian</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feat-icon"><HeadphonesIcon size={28} /></div>
              <div className="feat-text">
                <h4>HỖ TRỢ 24/7</h4>
                <p>Tư vấn nhanh chóng,<br/>hỗ trợ tận tâm</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}

