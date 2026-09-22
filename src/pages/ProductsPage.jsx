import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { 
  ArrowRight, Search, ShieldCheck, CheckCircle2, Star, HeadphonesIcon, 
  Home, AlignJustify, ArrowRightLeft, Columns, Eye, X, Check, Filter, Sparkles, PhoneCall
} from "lucide-react";
import "./ProductsPage.css";

export default function ProductsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const catFromUrl = searchParams.get("cat");
  const searchFromUrl = searchParams.get("search");

  const [activeCategory, setActiveCategory] = useState(catFromUrl || "all");
  const [searchQuery, setSearchQuery] = useState(searchFromUrl || "");
  const [dbProducts, setDbProducts] = useState([]);

  useEffect(() => {
    if (catFromUrl) {
      setActiveCategory(catFromUrl);
    } else if (searchFromUrl === null) {
      setActiveCategory("all");
    }
    if (searchFromUrl !== null) {
      setSearchQuery(searchFromUrl);
    } else {
      setSearchQuery("");
    }
  }, [catFromUrl, searchFromUrl]);

  useEffect(() => {
    fetch("https://cuatudongbossbackend-production.up.railway.app/api/products")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data && resData.data.length > 0) {
          setDbProducts(resData.data);
        }
      })
      .catch((err) => console.error("Products API error:", err));
  }, []);

  const categories = [
    { id: "all", label: "TẤT CẢ SẢN PHẨM" },
    { id: "cuacuon", label: "CỬA CUỐN" },
    { id: "phukien", label: "PHỤ KIỆN CỬA CUỐN" },
    { id: "cuakeo", label: "CỬA KÉO" },
    { id: "cuatudong", label: "CỔNG & CỬA TỰ ĐỘNG" },
    { id: "nhomkinh", label: "NHÔM KÍNH" },
  ];

  const products = [
    // 1. CỬA CUỐN
    {
      id: 1,
      category: "cuacuon",
      image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=800&q=80",
      title: "CỬA CUỐN KHE THOÁNG ĐỨC BOSSDOOR",
      code: "BD-900",
      description: "Thân cửa hợp kim nhôm 6063-T5 cao cấp, sơn tĩnh điện CHLB Đức bảo hành 10 năm.",
      details: "Dòng cửa cuốn cao cấp thế hệ mới BossDoor tích hợp công nghệ chống sao chép mã khoá, cảm biến tự dừng khi gặp vật cản và điều khiển qua Smartphone từ xa.",
      specs: ["Hợp kim nhôm 6063-T5 siêu bền", "Độ dày nan: 1.4 - 2.2 mm", "Cảm biến hồng ngoại an toàn", "Bảo hành mô-tơ 5 năm"],
      badge: "BÁN CHẠY",
      icon: <Home size={22} />
    },
    {
      id: 2,
      category: "cuacuon",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      title: "CỬA CUỐN ĐÀI LOAN GIÁ RẺ",
      code: "DL-75",
      description: "Thép mạ màu Đài Loan độ bền cao, giải pháp tối ưu chi phí cho nhà xưởng & cửa hàng.",
      details: "Cửa cuốn công nghệ Đài Loan chất liệu tôn mạ màu nhập khẩu, chống rỉ sét tốt, vận hành bằng lò xo trợ lực hoặc mô tơ điện kéo êm ái.",
      specs: ["Tôn mạ màu Đài Loan 0.6 - 1.2mm", "Chống ăn mòn thời tiết", "Kéo tay hoặc chạy mô tơ", "Bảo hành 2 năm"],
      badge: "TIẾT KIỆM",
      icon: <AlignJustify size={22} />
    },
    {
      id: 3,
      category: "cuacuon",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      title: "CỬA CUỐN TẤM LIỀN ÚC SIÊU ÊM",
      code: "BD-L70",
      description: "Đóng mở êm ái không tiếng ồn, hợp kim thép Colorbond Úc chống ăn mòn.",
      details: "Cửa cuốn tấm liền bằng thép hợp kim mạ nhôm kẽm Colorbond của Úc, tích hợp dây cao su polyguide giảm chấn giúp vận hành cực kỳ êm ái.",
      specs: ["Thép mạ kẽm Colorbond Úc", "Tích hợp chốt ly khai thoát hiểm", "Tốc độ đóng mở 15-20 cm/s", "Bảo hành 3 năm"],
      badge: "MỚI",
      icon: <Home size={22} />
    },
    {
      id: 4,
      category: "cuacuon",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      title: "CỬA CUỐN SONG NGANG - MẮC VÕNG INOX / SƠN TĨNH ĐIỆN",
      code: "SN-100",
      description: "Thông thoáng tối đa, góc quan sát rộng cho TTTM, ngân hàng, gara.",
      details: "Cửa cuốn song ngang mắc võng chất liệu Inox 304 hoặc sắt sơn tĩnh điện cao cấp, đảm bảo an toàn tuyệt đối mà vẫn giữ không gian thông thoáng.",
      specs: ["Inox 304 / Sắt sơn tĩnh điện", "Ống phi 19 - 22mm dày 1.0 - 1.2mm", "Tầm nhìn thông thoáng 90%", "Bảo hành 3 năm"],
      badge: "HOT",
      icon: <AlignJustify size={22} />
    },
    {
      id: 5,
      category: "cuacuon",
      image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
      title: "CỬA CUỐN CAO CẤP THẾ HỆ MỚI BOSSDOOR",
      code: "BD-LUX",
      description: "Dòng cửa cuốn siêu sang tích hợp AI, sơn tĩnh điện AkzoNobel CHLB Đức.",
      details: "Phiên bản đỉnh cao của BossDoor với thiết kế nan chèn cao su giảm chấn 2 chiều, sơn bột tĩnh điện AkzoNobel Đức gia nhiệt cao cấp.",
      specs: ["Hợp kim nhôm hàng không 6063-T6", "Sơn AkzoNobel Đức bảo hành 10 năm", "Kết nối Smarthome thông minh", "Bảo hành 10 năm"],
      badge: "LUXURY",
      icon: <Star size={22} />
    },

    // 2. PHỤ KIỆN CỬA CUỐN
    {
      id: 6,
      category: "phukien",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      title: "MÔ TƠ CỬA CUỐN NHẬP KHẨU ĐÀI LOAN / ĐỨC",
      code: "MT-500",
      description: "Động cơ dây đồng 100%, sức kéo mạnh mẽ 300kg - 1000kg, chống hành trình tràn.",
      details: "Mô tơ cửa cuốn chính hãng tích hợp rơ-le nhiệt tự ngắt khi quá tải, phanh đĩa kép an toàn và bộ tự dừng khi gặp chướng ngại vật.",
      specs: ["Lõi đồng 100% nguyên chất", "Sức kéo: 300kg - 1000kg", "Tích hợp đảo chiều an toàn", "Bảo hành 5 năm 1 đổi 1"],
      badge: "CHÍNH HÃNG",
      icon: <Sparkles size={22} />
    },
    {
      id: 7,
      category: "phukien",
      image: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80",
      title: "BÌNH LƯU ĐIỆN CỬA CUỐN (UPS DỰ PHÒNG)",
      code: "UPS-800",
      description: "Lưu điện dự phòng thông minh 48h - 72h khi xảy ra cúp điện lưới.",
      details: "Bộ lưu điện UPS chuyên dụng cho cửa cuốn sử dụng ắc quy khô tích điện công nghệ Gel, mạch sạc tự động bảo vệ bình không bị chai.",
      specs: ["Thời gian chờ: 48 - 72 giờ", "Công suất: 800W - 1500W", "Tự động chuyển nguồn khi cúp điện", "Bảo hành 2 năm"],
      badge: "NỔI BẬT",
      icon: <ShieldCheck size={22} />
    },
    {
      id: 8,
      category: "phukien",
      image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=800&q=80",
      title: "BỘ ĐIỀU KHIỂN CỬA CUỐN QUA ĐIỆN THOẠI (SMART WIFI)",
      code: "WF-APP",
      description: "Đóng mở cửa từ xa mọi lúc mọi nơi qua Smartphone 4G/Wi-Fi, cảnh báo đột nhập.",
      details: "Module điều khiển thông minh kết nối ứng dụng Tuya/Smart Life, phân quyền người dùng gia đình, lưu lịch sử đóng mở và camera giám sát real-time.",
      specs: ["Kết nối Wi-Fi & 4G toàn cầu", "Cảnh báo mở cửa về điện thoại", "Chia sẻ quyền quản lý gia đình", "Bảo hành 2 năm"],
      badge: "SMART",
      icon: <ArrowRightLeft size={22} />
    },
    {
      id: 9,
      category: "phukien",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      title: "TAY ĐIỀU KHIỂN & HỘP ĐIỀU KHIỂN CHỐNG DÒ MÃ",
      code: "RF-433",
      description: "Tay remote inox chống nước, công nghệ Rolling Code mã nhảy chống sao chép.",
      details: "Bộ hộp thu phát tín hiệu sóng RF 433MHz tần số mã nhảy tự đổi hàng tỉ mã sau mỗi lần bấm, ngăn chặn hoàn toàn thiết bị dò sóng.",
      specs: ["Mã nhảy Rolling Code an toàn", "Khoảng cách điều khiển: 50 - 100m", "Tay remote chống nước IP65", "Bảo hành 2 năm"],
      badge: "AN TOÀN",
      icon: <CheckCircle2 size={22} />
    },

    // 3. CỬA KÉO
    {
      id: 10,
      category: "cuakeo",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      title: "CỬA KÉO ĐÀI LOAN CÓ LÁ / KHÔNG LÁ",
      code: "CK-DL",
      description: "Thân cửa thép mạ màu Đài Loan, nhíp keo hoa văn sang trọng, kéo nhẹ êm.",
      details: "Cửa kéo Đài Loan chất liệu tôn mạ màu nhập khẩu, nhíp ép thủy lực chắc chắn, bạc đạn bạc inox giúp đóng mở siêu nhẹ nhàng.",
      specs: ["Độ dày U: 0.6mm - 1.4mm", "Nhíp sơn tĩnh điện hoa văn", "Bạc đạn inox chống kẹt", "Bảo hành 2 năm"],
      badge: "BÁN CHẠY",
      icon: <Columns size={22} />
    },
    {
      id: 11,
      category: "cuakeo",
      image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
      title: "CỬA KÉO CÔNG NGHỆ ĐỨC (CN ĐỨC SƠN TĨNH ĐIỆN)",
      code: "CK-DE",
      description: "Thanh U hợp kim nhôm sơn tĩnh điện CHLB Đức, kiểu dáng hiện đại bền đẹp 15 năm.",
      details: "Cửa kéo CN Đức cao cấp sản xuất từ hợp kim nhôm sơn tĩnh điện ngoài trời AkzoNobel, không han gỉ, vận hành êm nhẹ gấp 3 lần cửa sắt thông thường.",
      specs: ["Hợp kim nhôm Đức siêu nhẹ", "Sơn AkzoNobel bền màu 15 năm", "Nhíp lá nhôm đúc định hình", "Bảo hành 5 năm"],
      badge: "CAO CẤP",
      icon: <Star size={22} />
    },
    {
      id: 12,
      category: "cuakeo",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      title: "CỬA KÉO INOX 304 CAO CẤP",
      code: "CK-IX304",
      description: "100% Inox 304 sáng bóng không rỉ sét, chịu lực tối đa cho mặt phố & biệt thự.",
      details: "Dòng cửa kéo cao cấp bằng Inox 304 nguyên chất chống ăn mòn hóa chất và nước biển, cực kỳ thích hợp cho thời tiết ven biển Đà Nẵng.",
      specs: ["100% Inox 304 chuẩn", "Thanh U dày 1.0 - 1.5mm", "Không gỉ sét dưới mọi thời tiết", "Bảo hành 10 năm"],
      badge: "SIÊU BỀN",
      icon: <ShieldCheck size={22} />
    },
    {
      id: 13,
      category: "cuakeo",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      title: "CỬA KÉO KHÔNG LÁ THÔNG THOÁNG",
      code: "CK-KL",
      description: "Thiết kế tối ưu lấy ánh sáng & gió tự nhiên cho cổng nhà, nhà xe, chung cư.",
      details: "Cửa kéo không lá giúp tối ưu hóa không gian gió và ánh sáng xuyên qua, tạo cảm giác thông thoáng rộng rãi đồng thời bảo vệ an ninh vững chắc.",
      specs: ["Khung U mạ màu / sơn tĩnh điện", "Thiết kế không lá lấy sáng 95%", "Khóa âm sàn / chốt ngang an toàn", "Bảo hành 3 năm"],
      badge: "THÔNG THOÁNG",
      icon: <AlignJustify size={22} />
    },

    // 4. CỔNG CỬA TỰ ĐỘNG
    {
      id: 14,
      category: "cuatudong",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      title: "CỔNG TỰ ĐỘNG ÂM SÀN / TAY CO ITALIA",
      code: "IT-GHOST",
      description: "Mô-tơ âm sàn chống nước IP67, điều khiển Smartphone cho Biệt thự & Villa.",
      details: "Hệ thống cổng mở xoay âm sàn nhập khẩu Ý 100%, động cơ đúc nguyên khối chống ngập nước tiêu chuẩn IP67, chịu tải nặng tới 800kg/cánh.",
      specs: ["Tiêu chuẩn chống nước IP67 Ý", "Tải trọng: 800kg / cánh", "Góc mở: 110° - 180°", "Bảo hành 5 năm"],
      badge: "VIP",
      icon: <Columns size={22} />
    },
    {
      id: 15,
      category: "cuatudong",
      image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=800&q=80",
      title: "CỬA TRƯỢT TỰ ĐỘNG KABA / NABCO NHẬT BẢN",
      code: "NAB-150",
      description: "Mắt thần cảm biến radar vi sóng siêu nhạy, vận hành êm ái cho TTTM, sảnh lớn.",
      details: "Cửa kính trượt tự động cao cấp nhập khẩu Nhật Bản / Thụy Sĩ. Động cơ DC không chổi than êm ái, hoạt động liên tục với tuổi thọ > 2.000.000 lần đóng mở.",
      specs: ["Động cơ DC Brushless 120W", "Tải trọng: 150kg x 2 cánh", "Cảm biến an toàn chống kẹp người", "Bảo hành 3 năm"],
      badge: "HOT",
      icon: <ArrowRightLeft size={22} />
    },
    {
      id: 16,
      category: "cuatudong",
      image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
      title: "MÁI HIÊN & RÈM CHE NẮNG TỰ ĐỘNG TÍCH HỢP REMOTE",
      code: "MH-AUTO",
      description: "Động cơ bạt xếp kéo rèm / mái hiên di động tự động thu vươn khi mưa nắng.",
      details: "Giải pháp mái hiên bạt xếp & rèm cuốn ngoài trời tích hợp cảm biến gió/mưa tự động thu mái bạt lại khi có gió lớn hoặc mưa bão.",
      specs: ["Động cơ bạt xếp 100W", "Cảm biến nắng gió tự động", "Bạt Hàn Quốc / Tây Ban Nha", "Bảo hành 3 năm"],
      badge: "MỚI",
      icon: <Home size={22} />
    },
    {
      id: 17,
      category: "cuatudong",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      title: "CỬA KÍNH LỀ SÀN (BẢN LỀ THỦY LỰC) VVF / HAFELE",
      code: "KS-100",
      description: "Kính cường lực 10 - 12mm kết hợp phụ kiện bản lề sàn inox 304 CHLB Đức.",
      details: "Cửa kính thủy lực lề sàn đóng mở 2 chiều êm ái, định vị góc 90 độ, linh kiện bản lề thủy lực Häfele / VVF nhập khẩu Đức chống chảy dầu.",
      specs: ["Kính cường lực 10 - 12mm an toàn", "Bản lề sàn Häfele / VVF Đức", "Phụ kiện Inox 304 mạ PVD", "Bảo hành 5 năm"],
      badge: "SANG TRỌNG",
      icon: <Columns size={22} />
    },

    // 5. NHÔM KÍNH
    {
      id: 18,
      category: "nhomkinh",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      title: "CỬA NHÔM XINGFA QUẢNG ĐÔNG TEM ĐỎ CHÍNH HÃNG",
      code: "XF-55",
      description: "Nhôm Xingfa nhập khẩu tem đỏ Quảng Đông, phụ kiện CMECH / Kinlong cao cấp.",
      details: "Hệ cửa nhôm kính cao cấp với bề mặt sơn tĩnh điện dạng kim xám/trắng/vàng kim, kính hộp 2 lớp hút chân không cách âm cách nhiệt lên tới 95%.",
      specs: ["Nhôm Xingfa Quảng Đông tem đỏ", "Độ dày thanh nhôm: 1.4 - 2.0 mm", "Kính hộp cách âm cách nhiệt", "Bảo hành 10 năm"],
      badge: "NỔI BẬT",
      icon: <Home size={22} />
    }
  ];

  const productList = dbProducts.length > 0 ? dbProducts : products;

  const filteredProducts = productList.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Optional: Add a slight delay based on the index of the intersected batch
          // so if multiple items enter at once, they stagger slightly
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    const elements = document.querySelectorAll('.product-page-card');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [filteredProducts]);

  // 3D Parallax Tilt Handler
  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
  };

  const handleCardMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)`;
  };

  return (
    <div className="products-page-container">
      {/* 1. HERO PAGE BANNER */}
      <section className="products-hero-banner">
        <div className="container hero-banner-content">
          <div className="banner-badge">
            <Sparkles size={16} /> DẢI SẢN PHẨM CHÍNH HÃNG 100%
          </div>
          <h1>DANH MỤC <span className="text-gold">SẢN PHẨM</span></h1>
          <p>
            Cung cấp giải pháp Cửa Cuốn – Cửa Tự Động – Barrier & Cổng – Nhôm Kính Cao Cấp chuẩn Châu Âu cho mọi kiến trúc Việt.
          </p>

          {/* Search Box inside Hero */}
          <div className="search-filter-box">
            <div className="search-input-wrapper">
              <Search size={20} className="search-icon" />
              <input 
                type="text" 
                placeholder="Tìm kiếm sản phẩm (Ví dụ: Cửa cuốn, Cửa trượt, Xingfa)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-btn" onClick={() => setSearchQuery("")}>
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN CATALOG SECTION */}
      <section className="products-catalog-section section-padding">
        <div className="container">
          
          {/* Category Filter Pills */}
          <div className="catalog-category-bar">
            <div className="category-pills">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`pill-btn ${activeCategory === cat.id ? "active" : ""}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="results-count">
              Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="products-page-grid" key={activeCategory + searchQuery}>
              {filteredProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className="product-page-card" 
                  style={{ "--card-index": index }}
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                  onClick={() => {
                    const { icon, ...serializableProduct } = product;
                    navigate(`/san-pham/${product.id}`, { state: { product: serializableProduct } });
                  }}
                >
                  <div className="card-image-wrap">
                    <img src={product.image} alt={product.title} />
                    <span className="product-badge">{product.badge}</span>
                    <span className="product-code-tag">{product.code}</span>
                    <div className="card-overlay-btn">
                      <Eye size={20} /> Xem chi tiết
                    </div>
                  </div>

                  <div className="card-details">
                    <div className="card-header-icon">
                      <div className="icon-box">{product.icon}</div>
                      <h3>{product.title}</h3>
                    </div>
                    {product.price && <div className="product-price">{product.price}</div>}
                    <p className="card-desc">{product.description}</p>
                    
                    <div className="card-specs-mini">
                      {product.specs.slice(0, 2).map((s, idx) => (
                        <div key={idx} className="mini-spec-tag">
                          <Check size={13} /> {s}
                        </div>
                      ))}
                    </div>

                    <div className="card-footer-actions">
                      <button className="btn-detail-view" onClick={(e) => {
                        e.stopPropagation();
                        const { icon, ...serializableProduct } = product;
                        navigate(`/san-pham/${product.id}`, { state: { product: serializableProduct } });
                      }}>
                        XEM CHI TIẾT <ArrowRight size={14} />
                      </button>
                      <a 
                        href="tel:0904678323" 
                        className="btn-quick-call"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <PhoneCall size={14} /> Báo giá
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-products-found">
              <Search size={48} className="empty-icon" />
              <h3>Không tìm thấy sản phẩm phù hợp</h3>
              <p>Thử tìm kiếm với từ khoá khác hoặc chọn lại danh mục sản phẩm.</p>
              <button className="btn-reset-filter" onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}>
                Xem tất cả sản phẩm
              </button>
            </div>
          )}

          {/* 3. GUARANTEE BAR */}
          <div className="catalog-guarantee-bar">
            <div className="guarantee-item">
              <ShieldCheck size={32} className="g-icon" />
              <div>
                <h4>CHÍNH HÃNG 100%</h4>
                <p>Nhập khẩu có chứng nhận C/O, C/Q đầy đủ</p>
              </div>
            </div>
            <div className="guarantee-item">
              <CheckCircle2 size={32} className="g-icon gold" />
              <div>
                <h4>BẢO HÀNH 5 NĂM</h4>
                <p>Bảo trì tận nơi, hỗ trợ kỹ thuật 24/7</p>
              </div>
            </div>
            <div className="guarantee-item">
              <Star size={32} className="g-icon red" />
              <div>
                <h4>LẮP ĐẶT 24H</h4>
                <p>Thi công nhanh gọn, chuẩn quy trình kĩ thuật</p>
              </div>
            </div>
            <div className="guarantee-item">
              <HeadphonesIcon size={32} className="g-icon" />
              <div>
                <h4>TƯ VẤN MIỄN PHÍ</h4>
                <p>Khảo sát tận công trình hoàn toàn miễn phí</p>
              </div>
            </div>
          </div>

        </div>
      </section>


    </div>
  );
}
