import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Tag,
  Search,
  Check,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Star,
  HeadphonesIcon,
  PhoneCall,
  Filter,
  Sparkles
} from "lucide-react";
import "./Pricing.css";

// Comprehensive catalog data for Boss Đà Nẵng pricing hub
const PRICING_CATALOG = [
  // 1. CỬA CUỐN
  {
    id: 1,
    code: "BD-900",
    category: "cuacuon",
    title: "CỬA CUỐN KHE THOÁNG ĐỨC BOSSDOOR",
    image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=800&q=80",
    price: "1.450.000đ/m2",
    badge: "BÁN CHẠY",
    description: "Thân cửa hợp kim nhôm 6063-T5 cao cấp, sơn tĩnh điện CHLB Đức bảo hành 10 năm.",
    specs: ["Hợp kim nhôm 6063-T5 siêu bền", "Độ dày nan: 1.4 - 2.2 mm", "Bảo hành mô-tơ 5 năm"]
  },
  {
    id: 2,
    code: "DL-75",
    category: "cuacuon",
    title: "CỬA CUỐN ĐÀI LOAN GIÁ RẺ",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    price: "420.000đ/m2",
    badge: "TIẾT KIỆM",
    description: "Thép mạ màu Đài Loan độ bền cao, giải pháp tối ưu chi phí cho nhà xưởng & cửa hàng.",
    specs: ["Tôn mạ màu Đài Loan 0.6 - 1.2mm", "Chống ăn mòn thời tiết", "Bảo hành 2 năm"]
  },
  {
    id: 3,
    code: "BD-L70",
    category: "cuacuon",
    title: "CỬA CUỐN TẤM LIỀN ÚC SIÊU ÊM",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    price: "980.000đ/m2",
    badge: "MỚI",
    description: "Đóng mở êm ái không tiếng ồn, hợp kim thép Colorbond Úc chống ăn mòn.",
    specs: ["Thép mạ kẽm Colorbond Úc", "Tích hợp chốt ly khai thoát hiểm", "Bảo hành 3 năm"]
  },
  {
    id: 4,
    code: "SN-100",
    category: "cuacuon",
    title: "CỬA CUỐN SONG NGANG - MẮC VÕNG INOX / SƠN TĨNH ĐIỆN",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    price: "1.200.000đ/m2",
    badge: "HOT",
    description: "Thông thoáng tối đa, góc quan sát rộng cho TTTM, ngân hàng, gara.",
    specs: ["Inox 304 / Sắt sơn tĩnh điện", "Ống phi 19 - 22mm dày 1.0 - 1.2mm", "Bảo hành 3 năm"]
  },
  {
    id: 5,
    code: "BD-LUX",
    category: "cuacuon",
    title: "CỬA CUỐN CAO CẤP THẾ HỆ MỚI BOSSDOOR",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
    price: "2.100.000đ/m2",
    badge: "LUXURY",
    description: "Dòng cửa cuốn siêu sang tích hợp AI, sơn tĩnh điện AkzoNobel CHLB Đức.",
    specs: ["Hợp kim nhôm hàng không 6063-T6", "Sơn AkzoNobel Đức bảo hành 10 năm", "Bảo hành 10 năm"]
  },
  {
    id: 6,
    code: "BEC.5810",
    category: "cuacuon",
    title: "Cửa cuốn Bossdoor ECO BEC.5810",
    image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=800&q=80",
    price: "1.500.000đ/m2",
    badge: "HOT",
    description: "Cửa cuốn Bossdoor ECO BEC.5810 là giải pháp tối ưu cho những ai đang tìm kiếm sự cân bằng giữa chất lượng và chi phí.",
    specs: ["Hợp kim nhôm 6063-T5", "Bảo hành 5 năm", "Sơn tĩnh điện chống muối mặn"]
  },

  // 2. PHỤ KIỆN
  {
    id: 7,
    code: "MT-500",
    category: "phukien",
    title: "MÔ TƠ CỬA CUỐN NHẬP KHẨU ĐÀI LOAN / ĐỨC",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    price: "3.500.000đ/bộ",
    badge: "CHÍNH HÃNG",
    description: "Động cơ dây đồng 100%, sức kéo mạnh mẽ 300kg - 1000kg, chống hành trình tràn.",
    specs: ["Lõi đồng 100% nguyên chất", "Sức kéo: 300kg - 1000kg", "Bảo hành 5 năm 1 đổi 1"]
  },
  {
    id: 8,
    code: "UPS-800",
    category: "phukien",
    title: "BÌNH LƯU ĐIỆN CỬA CUỐN (UPS DỰ PHÒNG)",
    image: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80",
    price: "2.800.000đ/bộ",
    badge: "NỔI BẬT",
    description: "Lưu điện dự phòng thông minh 48h - 72h khi xảy ra cúp điện lưới.",
    specs: ["Thời gian chờ: 48 - 72 giờ", "Công suất: 800W - 1500W", "Bảo hành 2 năm"]
  },
  {
    id: 9,
    code: "WF-APP",
    category: "phukien",
    title: "BỘ ĐIỀU KHIỂN CỬA CUỐN QUA ĐIỆN THOẠI (SMART WIFI)",
    image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=800&q=80",
    price: "1.200.000đ/bộ",
    badge: "SMART",
    description: "Đóng mở cửa từ xa mọi lúc mọi nơi qua Smartphone 4G/Wi-Fi, cảnh báo đột nhập.",
    specs: ["Kết nối Wi-Fi & 4G", "Cảnh báo mở cửa về điện thoại", "Bảo hành 2 năm"]
  },

  // 3. CỬA KÉO
  {
    id: 10,
    code: "CK-DL",
    category: "cuakeo",
    title: "CỬA KÉO ĐÀI LOAN CÓ LÁ / KHÔNG LÁ",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    price: "480.000đ/m2",
    badge: "BÁN CHẠY",
    description: "Thân cửa thép mạ màu Đài Loan, nhíp keo hoa văn sang trọng, kéo nhẹ êm.",
    specs: ["Độ dày U: 0.6mm - 1.4mm", "Nhíp sơn tĩnh điện hoa văn", "Bảo hành 2 năm"]
  },
  {
    id: 11,
    code: "CK-IX304",
    category: "cuakeo",
    title: "CỬA KÉO INOX 304 CAO CẤP",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    price: "1.850.000đ/m2",
    badge: "SIÊU BỀN",
    description: "100% Inox 304 sáng bóng không rỉ sét, chịu lực tối đa cho mặt phố & biệt thự.",
    specs: ["100% Inox 304 chuẩn", "Thanh U dày 1.0 - 1.5mm", "Bảo hành 10 năm"]
  },

  // 4. CỔNG & CỬA TỰ ĐỘNG
  {
    id: 12,
    code: "IT-GHOST",
    category: "cuatudong",
    title: "CỔNG TỰ ĐỘNG ÂM SÀN / TAY CO ITALIA",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    price: "32.000.000đ/bộ",
    badge: "VIP",
    description: "Mô-tơ âm sàn chống nước IP67, điều khiển Smartphone cho Biệt thự & Villa.",
    specs: ["Tiêu chuẩn IP67 Ý", "Tải trọng: 800kg / cánh", "Bảo hành 5 năm"]
  },
  {
    id: 13,
    code: "NAB-150",
    category: "cuatudong",
    title: "CỬA TRƯỢT TỰ ĐỘNG KABA / NABCO NHẬT BẢN",
    image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=800&q=80",
    price: "18.500.000đ/bộ",
    badge: "HOT",
    description: "Mắt thần cảm biến radar vi sóng siêu nhạy, vận hành êm ái cho TTTM, sảnh lớn.",
    specs: ["Động cơ DC Brushless", "Tải trọng: 150kg x 2 cánh", "Bảo hành 3 năm"]
  }
];

export default function Pricing() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [productsList, setProductsList] = useState(PRICING_CATALOG);

  // Sync with DB products if available
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Bảng Báo Giá Cửa Cuốn, Cửa Kéo, Cửa Tự Động 2026 | Boss Đà Nẵng";

    if (import.meta.env.VITE_API_URL) {
      fetch(`${import.meta.env.VITE_API_URL}/api/products`)
        .then((res) => res.json())
        .then((resData) => {
          if (resData.success && resData.data && resData.data.length > 0) {
            // Merge with local fallback
            const map = new Map();
            PRICING_CATALOG.forEach((p) => map.set(p.code, p));
            resData.data.forEach((p) => {
              if (p.code) map.set(p.code, { ...map.get(p.code), ...p });
            });
            setProductsList(Array.from(map.values()));
          }
        })
        .catch((err) => console.log("Pricing hub fetch error:", err));
    }
  }, []);

  const categories = [
    { id: "all", label: "TẤT CẢ" },
    { id: "cuacuon", label: "CỬA CUỐN" },
    { id: "phukien", label: "PHỤ KIỆN CỬA" },
    { id: "cuakeo", label: "CỬA KÉO" },
    { id: "cuatudong", label: "CỔNG & CỬA" }
  ];

  const filteredProducts = productsList.filter((prod) => {
    const matchCat = activeCategory === "all" || prod.category === activeCategory;
    const matchQuery =
      searchQuery === "" ||
      prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.code && prod.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (prod.description && prod.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchQuery;
  });

  return (
    <div className="pricing-hub-page">
      {/* 1. HERO BANNER */}
      <section className="pricing-hero-banner">
        <div className="container">
          <div className="pricing-hero-content">
            <span className="hero-subtag">
              <Sparkles size={14} /> BẢNG BÁO GIÁ NIÊM YẾT CHÍNH HÃNG 2026
            </span>
            <h1>BẢNG GIÁ SẢN PHẨM BOSS ĐÀ NẴNG</h1>
            <p>
              Tra cứu đơn giá minh bạch, chính sách bảo hành và chi phí lắp đặt trọn gói của từng dòng cửa cuốn, cửa kéo và cổng tự động tại Đà Nẵng & Miền Trung.
            </p>

            {/* Search Box */}
            <div className="pricing-search-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Nhập mã sản phẩm hoặc tên (Ví dụ: BEC.5810, DL-75, BD-LUX...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-btn" onClick={() => setSearchQuery("")}>
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN CATALOG BODY */}
      <main className="container pricing-hub-container">
        {/* Category Tabs */}
        <div className="pricing-tabs-row">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`pricing-tab-btn ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="catalog-status-bar">
          <span>
            Tìm thấy <strong>{filteredProducts.length}</strong> bảng giá sản phẩm
          </span>
          <span className="live-pricing-note">
            ⚡ Giá niêm yết tại xưởng - Khảo sát đo đạc miễn phí
          </span>
        </div>

        {/* Product Cards Grid */}
        <div className="pricing-cards-grid">
          {filteredProducts.map((prod) => (
            <div key={prod.id || prod._id || prod.code} className="pricing-card">
              <div className="card-thumb-box">
                <img src={prod.image} alt={prod.title} />
                {prod.badge && <span className="card-badge-pill">{prod.badge}</span>}
                <span className="card-code-pill">MÃ: {prod.code}</span>
              </div>

              <div className="card-body-content">
                <h3 className="card-prod-title">{prod.title}</h3>

                <div className="card-price-row">
                  <span className="price-tag-title">Đơn giá:</span>
                  <span className="price-tag-num">
                    {prod.price && prod.price !== "Liên hệ" ? prod.price : "Liên hệ để nhận báo giá"}
                  </span>
                </div>

                <p className="card-prod-desc">{prod.description}</p>

                {prod.specs && prod.specs.length > 0 && (
                  <div className="card-specs-list">
                    {prod.specs.slice(0, 2).map((sp, idx) => (
                      <div key={idx} className="spec-item">
                        <Check size={13} className="check-icon" /> {sp}
                      </div>
                    ))}
                  </div>
                )}

                <div className="card-action-box">
                  <button
                    className="btn-open-pricing-page"
                    onClick={() => {
                      const { icon, ...serializableProduct } = prod;
                      navigate(`/bang-gia/${prod.code || prod.id}`, { state: { product: serializableProduct } });
                    }}
                  >
                    <Tag size={15} /> XEM BẢNG GIÁ CHI TIẾT <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3. FAST QUOTE CTA BANNER */}
        <section className="pricing-fast-cta">
          <div className="cta-inner">
            <div className="cta-left">
              <h3>Bạn cần báo giá riêng theo kích thước công trình?</h3>
              <p>
                Kỹ sư Boss Đà Nẵng sẵn sàng đến tận chân công trình đo đạc thực tế và lên bảng dự toán hoàn toàn <strong>MIỄN PHÍ</strong>.
              </p>
            </div>
            <div className="cta-right">
              <a href="tel:0904678323" className="btn-cta-hotline">
                <PhoneCall size={18} /> GỌI NGAY: 0904.678.323
              </a>
              <Link to="/lien-he" className="btn-cta-contact">
                ĐẶT LỊCH KHẢO SÁT
              </Link>
            </div>
          </div>
        </section>

        {/* 4. GUARANTEE BAR */}
        <section className="pricing-hub-guarantee">
          <div className="g-item">
            <ShieldCheck size={32} className="g-icon" />
            <div>
              <h4>CHÍNH HÃNG 100%</h4>
              <p>Đầy đủ C/O, C/Q từ nhà máy BossDoor</p>
            </div>
          </div>
          <div className="g-item">
            <CheckCircle2 size={32} className="g-icon gold" />
            <div>
              <h4>BẢO HÀNH 5 - 10 NĂM</h4>
              <p>Cam kết bảo trì tận nơi nhanh nhất Đà Nẵng</p>
            </div>
          </div>
          <div className="g-item">
            <Star size={32} className="g-icon red" />
            <div>
              <h4>LẮP ĐẶT 24H</h4>
              <p>Kỹ thuật viên lành nghề chuẩn chỉ</p>
            </div>
          </div>
          <div className="g-item">
            <HeadphonesIcon size={32} className="g-icon" />
            <div>
              <h4>TƯ VẤN 24/7 MIỄN PHÍ</h4>
              <p>Khảo sát tận chân công trình</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
