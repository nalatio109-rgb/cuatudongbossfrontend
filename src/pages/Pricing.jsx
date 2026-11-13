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
  Sparkles,
  Layers,
  ArrowUpRight,
  Award
} from "lucide-react";
import { matchKeywords, extractSearchableText } from "../utils/searchHelper";
import "./Pricing.css";

// Comprehensive catalog data for Boss Đà Nẵng pricing hub
const PRICING_CATALOG = [
  // 1. CỬA KÉO CÔNG NGHỆ ĐỨC (Mẫu bảng báo giá kỹ thuật SR3, SR2, SR1, VIP)
  {
    id: 1,
    code: "CK-DE",
    category: "cuakeo",
    title: "CỬA KÉO CÔNG NGHỆ ĐỨC BOSSDOOR (SR3, SR2, SR1, VIP)",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    price: "Từ 980.000đ/m²",
    badge: "BÁN CHẠY NHẤT",
    businessStatus: "Đang kinh doanh • Sẵn hàng tại Đà Nẵng",
    description: "Thân cửa kéo U dày từ 0.9mm - 1.5mm sơn tĩnh điện AkzoNobel công nghệ Đức, máng đúc bi treo siêu êm, nhíp đặc lập là gia cố chắc chắn chống xô lệch.",
    specs: ["U dày 0.9mm - 1.5mm sơn AkzoNobel", "Máng đúc bi treo chịu lực siêu êm", "Nhíp đặc lập là gia cố an toàn", "Bảo hành chính hãng 5 năm"]
  },

  // 2. CỬA CUỐN KHE THOÁNG ECO BEC.5810
  {
    id: 2,
    code: "BEC.5810",
    category: "cuacuon",
    title: "CỬA CUỐN KHE THOÁNG BOSSDOOR ECO BEC.5810",
    image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=800&q=80",
    price: "1.500.000đ/m²",
    badge: "HOT",
    businessStatus: "Đang kinh doanh • Sẵn hàng tại kho Đà Nẵng",
    description: "Cửa cuốn Bossdoor ECO BEC.5810 là giải pháp tối ưu cho những ai đang tìm kiếm sự cân bằng giữa chất lượng cao, thẩm mỹ hiện đại và chi phí đầu tư hợp lý.",
    specs: ["Hợp kim nhôm 6063-T5 cao cấp", "Sơn tĩnh điện chống muối mặn", "Bảo hành thân cửa 5 năm"]
  },

  // 3. CỬA CUỐN ĐÀI LOAN GIÁ RẺ DL-75
  {
    id: 3,
    code: "DL-75",
    category: "cuacuon",
    title: "CỬA CUỐN ĐÀI LOAN BẢN 7.5CM GIÁ RẺ",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    price: "420.000đ/m²",
    badge: "TIẾT KIỆM",
    businessStatus: "Đang kinh doanh • Thi công nhanh trong 24h",
    description: "Thép mạ màu Đài Loan độ bền cao, giải pháp tối ưu chi phí cho nhà xưởng, ki-ốt, cửa hàng kinh doanh và gara gia đình.",
    specs: ["Tôn mạ màu Đài Loan 0.6 - 1.2mm", "Chống ăn mòn thời tiết miền Trung", "Kéo tay hoặc mô tơ", "Bảo hành 2 năm"]
  },

  // 4. CỬA CUỐN CAO CẤP THẾ HỆ MỚI BD-LUX
  {
    id: 4,
    code: "BD-LUX",
    category: "cuacuon",
    title: "CỬA CUỐN SIÊU SANG THẾ HỆ MỚI BOSSDOOR LUXURY",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
    price: "2.100.000đ/m²",
    badge: "LUXURY",
    businessStatus: "Đang kinh doanh • Sản xuất theo kích thước",
    description: "Phiên bản đỉnh cao của BossDoor với thiết kế nan chèn cao su giảm chấn 2 chiều, sơn bột tĩnh điện AkzoNobel Đức gia nhiệt cao cấp, tích hợp điều khiển thông minh qua Smartphone.",
    specs: ["Hợp kim nhôm hàng không 6063-T6", "Sơn AkzoNobel Đức bảo hành 10 năm", "Giảm chấn 2 chiều siêu êm"]
  },

  // 5. CỬA CUỐN KHE THOÁNG TRUYỀN THỐNG BD-900
  {
    id: 5,
    code: "BD-900",
    category: "cuacuon",
    title: "Cửa cuốn khe thoáng Đức BossDoor BD-900",
    image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=800&q=80",
    price: "1.450.000đ/m²",
    badge: "BÁN CHẠY",
    businessStatus: "Đang kinh doanh • Sẵn hàng tại Đà Nẵng",
    description: "Thân cửa hợp kim nhôm 6063-T5 cao cấp, thiết kế nan kép chống bão, sơn tĩnh điện CHLB Đức bảo hành 10 năm không phai màu.",
    specs: ["Hợp kim nhôm 6063-T5 siêu bền", "Độ dày nan: 1.4 - 2.2 mm", "Bảo hành mô-tơ 5 năm"]
  },

  // 6. CỬA CUỐN TẤM LIỀN ÚC BD-L70
  {
    id: 6,
    code: "BD-L70",
    category: "cuacuon",
    title: "CỬA CUỐN TẤM LIỀN CÔNG NGHỆ ÚC SIÊU ÊM",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    price: "980.000đ/m²",
    badge: "MỚI",
    businessStatus: "Đang kinh doanh • Sẵn hàng tại Đà Nẵng",
    description: "Đóng mở êm ái không tiếng ồn nhờ dây polyguide giảm chấn, hợp kim thép mạ Colorbond Úc chống ăn mòn muối biển vượt trội.",
    specs: ["Thép mạ kẽm Colorbond Úc", "Tích hợp chốt ly khai thoát hiểm", "Tốc độ đóng mở 15-20cm/s"]
  },

  // 7. CỬA CUỐN SONG NGANG - MẮC VÕNG SN-100
  {
    id: 7,
    code: "SN-100",
    category: "cuacuon",
    title: "CỬA CUỐN SONG NGANG - MẮC VÕNG INOX / SƠN TĨNH ĐIỆN",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    price: "1.200.000đ/m²",
    badge: "HOT",
    businessStatus: "Đang kinh doanh • Sẵn hàng thi công",
    description: "Thông thoáng tối đa, góc quan sát rộng cho TTTM, ngân hàng, gara ô tô. Vật liệu Inox 304 hoặc sắt sơn tĩnh điện cao cấp.",
    specs: ["Inox 304 / Sắt sơn tĩnh điện", "Ống phi 19 - 22mm dày 1.0 - 1.2mm", "Tầm nhìn thông thoáng 90%"]
  },

  // 8. CỬA KÉO ĐÀI LOAN CK-DL
  {
    id: 8,
    code: "CK-DL",
    category: "cuakeo",
    title: "CỬA KÉO ĐÀI LOAN CÓ LÁ / KHÔNG LÁ",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    price: "480.000đ/m²",
    badge: "KINH TẾ",
    businessStatus: "Đang kinh doanh • Sản xuất nhanh 24h",
    description: "Thân cửa thép mạ màu Đài Loan, nhíp dập hoa văn sang trọng, bạc đạn bạc inox giúp kéo nhẹ êm không tốn sức.",
    specs: ["Độ dày U: 0.6mm - 1.4mm", "Nhíp sơn tĩnh điện hoa văn", "Bạc đạn inox chống kẹt", "Bảo hành 2 năm"]
  },

  // 9. CỬA KÉO INOX 304 CK-IX304
  {
    id: 9,
    code: "CK-IX304",
    category: "cuakeo",
    title: "CỬA KÉO 100% INOX 304 CAO CẤP CHỐNG RỈ SÉT",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    price: "1.850.000đ/m²",
    badge: "SIÊU BỀN",
    businessStatus: "Đang kinh doanh • Gia công theo quy cách",
    description: "100% Inox 304 sáng bóng không rỉ sét trước gió biển miền Trung, chịu lực va đập tối đa cho nhà mặt phố, biệt thự & ngân hàng.",
    specs: ["100% Inox 304 chuẩn mác", "Thanh U dày 1.0 - 1.5mm", "Bảo hành chống rỉ 10 năm"]
  },

  // 10. MÔ TƠ CỬA CUỐN MT-500
  {
    id: 10,
    code: "MT-500",
    category: "phukien",
    title: "MÔ TƠ CỬA CUỐN NHẬP KHẨU ĐỒNG BỘ ĐÀI LOAN / ĐỨC",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    price: "3.500.000đ/bộ",
    badge: "CHÍNH HÃNG",
    businessStatus: "Đang kinh doanh • Sẵn hàng tại kho Đà Nẵng",
    description: "Động cơ dây đồng 100%, sức kéo mạnh mẽ từ 300kg - 1000kg, tích hợp phanh đĩa kép an toàn và bộ tự ngắt khi quá nhiệt.",
    specs: ["Lõi đồng 100% nguyên chất", "Sức kéo: 300kg - 1000kg", "Bảo hành 5 năm 1 đổi 1"]
  },

  // 11. BÌNH LƯU ĐIỆN CỬA CUỐN UPS-800
  {
    id: 11,
    code: "UPS-800",
    category: "phukien",
    title: "BÌNH LƯU ĐIỆN CỬA CUỐN (UPS DỰ PHÒNG 48H - 72H)",
    image: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80",
    price: "2.800.000đ/bộ",
    badge: "TIÊU CHUẨN",
    businessStatus: "Đang kinh doanh • Sẵn hàng tại Đà Nẵng",
    description: "Bộ lưu điện dự phòng thông minh bảo đảm cửa cuốn luôn đóng mở bình thường trong 48h - 72h khi xảy ra cúp điện lưới.",
    specs: ["Thời gian chờ: 48 - 72 giờ", "Công suất: 800W - 1500W", "Tự động ngắt nạp bảo vệ bình"]
  },

  // 12. BỘ ĐIỀU KHIỂN WIFI QUA SMARTPHONE WF-APP
  {
    id: 12,
    code: "WF-APP",
    category: "phukien",
    title: "BỘ ĐIỀU KHIỂN CỬA CUỐN QUA ĐIỆN THOẠI (SMART WIFI / 4G)",
    image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=800&q=80",
    price: "1.200.000đ/bộ",
    badge: "SMART",
    businessStatus: "Đang kinh doanh • Lắp đặt nhanh 30 phút",
    description: "Đóng mở cửa cuốn từ xa mọi lúc mọi nơi qua Smartphone, cảnh báo trạng thái cửa tức thì khi có người cạy phá hoặc mở cửa.",
    specs: ["Kết nối Wi-Fi & 4G toàn cầu", "Cảnh báo chống trộm qua App", "Bảo hành 2 năm"]
  },

  // 13. CỔNG TỰ ĐỘNG ÂM SÀN ITALIA IT-GHOST
  {
    id: 13,
    code: "IT-GHOST",
    category: "cuatudong",
    title: "MÔ TƠ CỔNG TỰ ĐỘNG ÂM SÀN / TAY CO ITALIA",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    price: "32.000.000đ/bộ",
    badge: "VIP",
    businessStatus: "Đang kinh doanh • Khảo sát & lên phương án miễn phí",
    description: "Mô-tơ âm sàn chống nước tiêu chuẩn IP67 nhập khẩu Ý, chịu tải trọng lớn, điều khiển qua Smartphone cho Biệt thự & Villa cao cấp.",
    specs: ["Tiêu chuẩn chống ngập IP67 Ý", "Tải trọng: 800kg / cánh", "Bảo hành 5 năm"]
  },

  // 14. CỬA TRƯỢT TỰ ĐỘNG NAB-150
  {
    id: 14,
    code: "NAB-150",
    category: "cuatudong",
    title: "CỬA KÍNH TRƯỢT TỰ ĐỘNG KABA / NABCO NHẬT BẢN",
    image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=800&q=80",
    price: "18.500.000đ/bộ",
    badge: "HOT",
    businessStatus: "Đang kinh doanh • Sẵn hàng thi công",
    description: "Mắt thần cảm biến radar vi sóng siêu nhạy, động cơ DC Brushless vận hành siêu êm cho TTTM, sảnh khách sạn và bệnh viện.",
    specs: ["Động cơ DC Brushless Nhật Bản", "Tải trọng: 150kg x 2 cánh", "Bảo hành 3 năm"]
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
            const map = new Map();
            PRICING_CATALOG.forEach((p) => map.set(p.code, p));
            resData.data.forEach((p) => {
              if (p.code) {
                const existing = map.get(p.code);
                map.set(p.code, {
                  ...existing,
                  ...p,
                  businessStatus: existing?.businessStatus || "Đang kinh doanh • Sẵn hàng tại Đà Nẵng"
                });
              }
            });
            setProductsList(Array.from(map.values()));
          }
        })
        .catch((err) => console.log("Pricing hub fetch error:", err));
    }
  }, []);

  const categories = [
    { id: "all", label: "TẤT CẢ SẢN PHẨM" },
    { id: "cuakeo", label: "CỬA KÉO ĐỨC & ĐÀI LOAN" },
    { id: "cuacuon", label: "CỬA CUỐN KHE THOÁNG" },
    { id: "phukien", label: "PHỤ KIỆN & MÔ TƠ" },
    { id: "cuatudong", label: "CỔNG & CỬA TỰ ĐỘNG" }
  ];

  const getCategoryName = (cat) => {
    switch (cat) {
      case "cuakeo":
        return "Cửa Kéo";
      case "cuacuon":
        return "Cửa Cuốn";
      case "phukien":
        return "Phụ Kiện Cửa";
      case "cuatudong":
        return "Cổng & Cửa Tự Động";
      default:
        return "Sản phẩm chính hãng";
    }
  };

  const pricingSearchFields = [
    "title",
    "code",
    "category",
    "description",
    "specs",
    "badge",
    "price",
    "businessStatus"
  ];

  const filteredProducts = (() => {
    const hasSearch = Boolean(searchQuery && searchQuery.trim());
    if (!hasSearch) {
      return activeCategory === "all"
        ? productsList
        : productsList.filter((p) => p.category === activeCategory);
    }

    // Khi có từ khóa tìm kiếm:
    // 1. Khớp trong danh mục hiện tại trước
    const categoryFiltered = activeCategory === "all"
      ? productsList
      : productsList.filter((p) => p.category === activeCategory);

    const matchesInCat = categoryFiltered.filter((prod) => {
      const text = extractSearchableText(prod, pricingSearchFields);
      return matchKeywords(text, searchQuery);
    });

    if (matchesInCat.length > 0 || activeCategory === "all") {
      return matchesInCat;
    }

    // 2. Tìm kiếm trên toàn bộ catalog nếu danh mục hiện tại không có, tránh tình trạng bị chặn kết quả
    return productsList.filter((prod) => {
      const text = extractSearchableText(prod, pricingSearchFields);
      return matchKeywords(text, searchQuery);
    });
  })();

  // Scroll reveal observer: elements start appearing only when scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("is-visible");
            }, Math.min(index * 75, 300));
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    const elements = document.querySelectorAll(
      ".pricing-horizontal-card, .pricing-fast-cta, .pricing-hub-guarantee, .catalog-status-bar"
    );
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [filteredProducts, activeCategory]);

  return (
    <div className="pricing-hub-page">
      {/* 1. HERO BANNER */}
      <section className="pricing-hero-banner">
        <div className="container">
          <div className="pricing-hero-content">
            <span className="hero-subtag">
              <Sparkles size={14} /> BẢNG BÁO GIÁ NIÊM YẾT CHÍNH HÃNG 2026
            </span>
            <h1>BẢNG GIÁ SẢN PHẨM</h1>
            
            {/* Desktop Description (Giữ nguyên 100% cho máy tính) */}
            <p className="hero-desc-desktop">
              Tra cứu đơn giá minh bạch, thông số kỹ thuật và chính sách bảo hành của từng dòng sản phẩm cửa cuốn, cửa kéo và cổng tự động tại Boss Đà Nẵng.
            </p>

            {/* Mobile View (Gọn gàng, thanh cam kết 3 cột viền kim sang trọng) */}
            <div className="hero-mobile-summary">
              <p className="hero-desc-mobile">
                Báo giá niêm yết trực tiếp từ nhà máy Boss Đà Nẵng
              </p>
              <div className="pricing-hero-strip">
                <div className="hero-strip-col">
                  <ShieldCheck size={18} />
                  <span>Giá tại xưởng</span>
                </div>
                <div className="strip-sep" />
                <div className="hero-strip-col">
                  <CheckCircle2 size={18} />
                  <span>Khảo sát 0đ</span>
                </div>
                <div className="strip-sep" />
                <div className="hero-strip-col">
                  <Award size={18} />
                  <span>Bảo hành chính hãng</span>
                </div>
              </div>
            </div>

            {/* Search Box */}
            <div className="pricing-search-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Nhập mã sản phẩm hoặc tên (Ví dụ: SR3, CK-DE, BEC.5810, DL-75, BD-LUX...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-btn" onClick={() => setSearchQuery("")} title="Xóa tìm kiếm">
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
          {categories.map((cat, catIdx) => (
            <button
              key={cat.id}
              className={`pricing-tab-btn ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
              style={{ animationDelay: `${catIdx * 60}ms` }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Status Bar */}
        <div className="catalog-status-bar">
          <div className="status-bar-left">
            <Layers size={16} className="status-icon" />
            <span>
              Hiển thị <strong>{filteredProducts.length}</strong> dòng sản phẩm báo giá
            </span>
          </div>
          <span className="live-pricing-note">
            ⚡ Giá niêm yết tại xưởng - Khảo sát đo đạc thực tế miễn phí tại công trình
          </span>
        </div>

        {/* PRODUCT LIST VIEW - CARD NGANG CHUYÊN NGHIỆP HIỆN ĐẠI (Yêu cầu mục A) */}
        <div className="pricing-products-horizontal-list">
          {filteredProducts.map((prod) => (
            <article
              key={prod.id || prod._id || prod.code}
              className="pricing-horizontal-card"
            >
              {/* Cột 1: Ảnh sản phẩm (bên trái) */}
              <div className="card-thumb-column">
                <div className="card-image-box">
                  <img src={prod.image} alt={prod.title} loading="lazy" />
                  {prod.badge && <span className="card-badge-pill">{prod.badge}</span>}
                  <span className="card-code-pill">MÃ: {prod.code}</span>
                </div>
              </div>

              {/* Cột 2: Thông tin chi tiết sản phẩm (ở giữa) */}
              <div className="card-info-column">
                <div className="card-meta-row">
                  <span className="card-cat-badge">{getCategoryName(prod.category)}</span>
                  <div className="card-business-status">
                    <span className="status-pulse-dot"></span>
                    <span className="status-text-label">
                      {prod.businessStatus || "Đang kinh doanh • Sẵn hàng tại Đà Nẵng"}
                    </span>
                  </div>
                </div>

                <h3 className="card-prod-title">
                  <Link
                    to={`/bang-gia/${prod.code || prod.id}`}
                    state={{ product: prod }}
                    className="title-link"
                  >
                    {prod.title}
                  </Link>
                </h3>

                <p className="card-prod-desc">{prod.description}</p>

                {prod.specs && prod.specs.length > 0 && (
                  <div className="card-specs-list">
                    {prod.specs.map((sp, idx) => (
                      <span key={idx} className="spec-tag-item">
                        <Check size={13} className="spec-check-icon" />
                        <span>{sp}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Cột 3: Giá & Nút xem bảng giá chi tiết (bên phải) */}
              <div className="card-action-column">
                <div className="price-box-wrapper">
                  <span className="price-title-caption">Giá niêm yết tham khảo:</span>
                  <div className="price-main-highlight">
                    {prod.price && prod.price !== "Liên hệ" ? prod.price : "Liên hệ để nhận báo giá"}
                  </div>
                  <span className="price-subnote-text">
                    Khảo sát &amp; đo đạc miễn phí
                  </span>
                </div>

                <button
                  type="button"
                  className="btn-open-pricing-detail"
                  onClick={() => {
                    const { icon, ...serializableProduct } = prod;
                    navigate(`/bang-gia/${prod.code || prod.id}`, { state: { product: serializableProduct } });
                  }}
                >
                  <Tag size={16} />
                  <span>Xem bảng giá chi tiết</span>
                  <ArrowRight size={16} className="btn-arrow" />
                </button>

                <a href="tel:0904678323" className="quick-call-link">
                  <PhoneCall size={13} />
                  <span>Tư vấn nhanh: 0904.678.323</span>
                </a>
              </div>
            </article>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="empty-search-state">
            <Search size={40} className="empty-icon" />
            <h3>Không tìm thấy sản phẩm phù hợp với "{searchQuery}"</h3>
            <p>Vui lòng thử từ khóa khác hoặc liên hệ hotline để nhận báo giá trực tiếp.</p>
            <button className="btn-reset-filter" onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}>
              Xem toàn bộ sản phẩm
            </button>
          </div>
        )}

        {/* 3. FAST QUOTE CTA BANNER */}
        <section className="pricing-fast-cta">
          <div className="cta-inner">
            <div className="cta-left">
              <h3>Bạn cần báo giá chi tiết theo kích thước công trình?</h3>
              <p>
                Kỹ sư chuyên môn của Boss Đà Nẵng sẵn sàng đến tận chân công trình đo đạc thực tế và lên bảng dự toán hoàn toàn <strong>MIỄN PHÍ</strong> trong vòng 24h.
              </p>
            </div>
            <div className="cta-right">
              <a href="tel:0904678323" className="btn-cta-hotline">
                <PhoneCall size={18} /> GỌI NGAY: 0904.678.323
              </a>
              <a href="https://zalo.me/0904678323" target="_blank" rel="noopener noreferrer" className="btn-cta-contact">
                CHAT ZALO TƯ VẤN
              </a>
            </div>
          </div>
        </section>

        {/* 4. GUARANTEE BAR */}
        <section className="pricing-hub-guarantee">
          <div className="g-item">
            <ShieldCheck size={32} className="g-icon" />
            <div>
              <h4>CHÍNH HÃNG 100%</h4>
              <p>Nhập khẩu có chứng nhận C/O, C/Q đầy đủ</p>
            </div>
          </div>
          <div className="g-item">
            <CheckCircle2 size={32} className="g-icon gold" />
            <div>
              <h4>BẢO HÀNH 5 NĂM</h4>
              <p>Bảo trì tận nơi, hỗ trợ kỹ thuật 24/7</p>
            </div>
          </div>
          <div className="g-item">
            <Star size={32} className="g-icon red" />
            <div>
              <h4>LẮP ĐẶT 24H</h4>
              <p>Thi công nhanh gọn, chuẩn quy trình kĩ thuật</p>
            </div>
          </div>
          <div className="g-item">
            <HeadphonesIcon size={32} className="g-icon" />
            <div>
              <h4>TƯ VẤN MIỄN PHÍ</h4>
              <p>Khảo sát tận công trình hoàn toàn miễn phí</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}