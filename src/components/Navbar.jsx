import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { 
  Menu, X, ChevronDown, PhoneCall, ArrowRight, ShieldCheck, ChevronRight, 
  DoorClosed, Cpu, Sliders, Zap, Sparkles 
} from "lucide-react";

export const FLYOUT_PRODUCT_NAV_DATA = [
  {
    categoryKey: "cuacuon",
    title: "Cửa Cuốn",
    subtitle: "Công nghệ Đức & Úc cao cấp",
    badgeCount: "5 dòng",
    icon: <DoorClosed size={18} />,
    items: [
      { name: "Cửa cuốn khe thoáng Đức", tag: "HOT", desc: "Cách âm, thoáng khí, hợp kim nhôm 6063", query: "Khe thoáng Đức" },
      { name: "Cửa cuốn BossDoor cao cấp AI", tag: "CÔNG NGHỆ AI", desc: "Cảm biến chống xô, báo động qua điện thoại", query: "Cao cấp" },
      { name: "Cửa cuốn tấm liền Úc siêu êm", tag: "BÁN CHẠY", desc: "Vận hành êm ái 99%, có còi báo động", query: "Tấm liền Úc" },
      { name: "Cửa cuốn công nghệ Đài Loan", tag: "", desc: "Chi phí tối ưu, tôn mạ màu bền đẹp", query: "Đài Loan" },
      { name: "Cửa cuốn song ngang - mắc võng", tag: "", desc: "Thông thoáng tối đa cho TTTM, Showroom", query: "Song ngang" },
    ]
  },
  {
    categoryKey: "phukien",
    title: "Phụ Kiện Cửa Cuốn",
    subtitle: "Đồng bộ chính hãng 100%",
    badgeCount: "4 linh kiện",
    icon: <Cpu size={18} />,
    items: [
      { name: "Mô tơ cửa cuốn lõi đồng 100%", tag: "BH 5 NĂM", desc: "Tải trọng từ 300kg - 1000kg cực khỏe", query: "Mô tơ" },
      { name: "Bình lưu điện UPS dự phòng 72h", tag: "KHUYÊN DÙNG", desc: "Tự sạc xả thông minh, không lo mất điện", query: "Bình lưu điện" },
      { name: "Bộ điều khiển qua Smartphone", tag: "SMART", desc: "Đóng mở cửa từ xa mọi lúc mọi nơi qua app", query: "Điều khiển qua điện thoại" },
      { name: "Tay remote & hộp mã nhảy Rolling Code", tag: "AN TOÀN", desc: "Mã hóa chống sao chép và chống dò sóng", query: "Tay điều khiển" },
    ]
  },
  {
    categoryKey: "cuakeo",
    title: "Cửa Kéo",
    subtitle: "Cửa kéo Đài Loan & CN Đức",
    badgeCount: "4 mẫu",
    icon: <Sliders size={18} />,
    items: [
      { name: "Cửa kéo CN Đức sơn AkzoNobel", tag: "CAO CẤP", desc: "Thanh nhôm định hình phủ sơn tĩnh điện", query: "Cửa kéo CN Đức" },
      { name: "Cửa kéo Đài Loan có/không lá", tag: "BÁN CHẠY", desc: "Tôn mạ màu nhập khẩu Đài Loan cao cấp", query: "Cửa kéo Đài Loan" },
      { name: "Cửa kéo không lá lấy sáng 95%", tag: "THÔNG THOÁNG", desc: "Đón gió mát & ánh sáng tự nhiên", query: "Cửa kéo không lá" },
      { name: "Cửa kéo Inox 304 cao cấp", tag: "SIÊU BỀN", desc: "Không gỉ sét, sáng bóng theo thời gian", query: "Cửa kéo Inox" },
    ]
  },
  {
    categoryKey: "cuatudong",
    title: "Cổng & Cửa Tự Động",
    subtitle: "Nhập khẩu Italia & Nhật Bản",
    badgeCount: "4 giải pháp",
    icon: <Zap size={18} />,
    items: [
      { name: "Cổng mở tự động âm sàn Italia IP67", tag: "NHẬP KHẨU", desc: "Tải trọng 800kg/cánh, kháng nước tuyệt đối", query: "Cổng tự động" },
      { name: "Cửa trượt tự động Kaba/Nabco Nhật", tag: "SMART", desc: "Cảm biến mắt thần hồng ngoại nhạy bén", query: "Cửa tự động" },
      { name: "Mái hiên & rèm che tự động Nắng Gió", tag: "MỚI", desc: "Cảm biến mưa gió tự cuốn thông minh", query: "Mái hiên, rèm che tự động" },
      { name: "Cửa kính thủy lực lề sàn Häfele Đức", tag: "SANG TRỌNG", desc: "Bản lề sàn chịu lực, kẹp kính inox 304", query: "Cửa kính lề sàn" },
    ]
  }
];

export default function Navbar() {
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [megaOpen, setMegaOpen] = useState(false);
  const [hoveredCatKey, setHoveredCatKey] = useState(null);
  const [mobileProdExpanded, setMobileProdExpanded] = useState(false);

  const navRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const lastActiveCatRef = useRef(FLYOUT_PRODUCT_NAV_DATA[0]);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mega menu on route changes
  useEffect(() => {
    setMegaOpen(false);
    setMenu(false);
    setHoveredCatKey(null);
  }, [location]);

  useEffect(() => {
    const updatePill = () => {
      if (navRef.current) {
        const activeLink = navRef.current.querySelector("a.nav-link-item.active");
        if (activeLink) {
          const navRect = navRef.current.getBoundingClientRect();
          const linkRect = activeLink.getBoundingClientRect();
          setPillStyle({
            left: `${linkRect.left - navRect.left}px`,
            width: `${linkRect.width}px`,
            opacity: 1,
          });
        } else {
          setPillStyle((prev) => ({ ...prev, opacity: 0 }));
        }
      }
    };

    updatePill();
    window.addEventListener("resize", updatePill);
    const timeout = setTimeout(updatePill, 50);
    return () => {
      window.removeEventListener("resize", updatePill);
      clearTimeout(timeout);
    };
  }, [location.pathname, megaOpen]);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setMegaOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setMegaOpen(false);
      setHoveredCatKey(null);
    }, 220);
  };

  if (hoveredCatKey) {
    const found = FLYOUT_PRODUCT_NAV_DATA.find((c) => c.categoryKey === hoveredCatKey);
    if (found) lastActiveCatRef.current = found;
  }
  const activeCatData = hoveredCatKey
    ? FLYOUT_PRODUCT_NAV_DATA.find((c) => c.categoryKey === hoveredCatKey)
    : lastActiveCatRef.current;

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container nav-inner">

        <Link className="logo" to="/" onClick={() => setMenu(false)}>
          <img src="/logo.png" alt="BOSS Đà Nẵng" className="logo-img" />
          <span className="logo-badge-dot"></span>
        </Link>

        <button
          className="mobile-menu"
          onClick={() => setMenu(!menu)}
          aria-label="Toggle Navigation"
        >
          {menu ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`nav ${menu ? "open" : ""}`} ref={navRef}>
          {/* Smooth Sliding Pill Indicator */}
          <div
            className="nav-sliding-pill"
            style={{
              left: pillStyle.left,
              width: pillStyle.width,
              opacity: pillStyle.opacity,
            }}
          />

          <NavLink 
            to="/" 
            onClick={() => setMenu(false)} 
            end 
            className={({ isActive }) => (isActive ? "nav-link-item active" : "nav-link-item")}
          >
            <span>TRANG CHỦ</span>
          </NavLink>

          <NavLink 
            to="/gioi-thieu" 
            onClick={() => setMenu(false)} 
            className={({ isActive }) => (isActive ? "nav-link-item active" : "nav-link-item")}
          >
            <span>GIỚI THIỆU</span>
          </NavLink>

          {/* SẢN PHẨM WITH ULTRA LUXURY E-COMMERCE FLYOUT DROPDOWN */}
          <div 
            className={`nav-dropdown-wrapper ${megaOpen ? "is-active" : ""}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <NavLink 
              to="/san-pham" 
              onClick={() => setMenu(false)} 
              className={({ isActive }) => (isActive ? "nav-link-item active has-dropdown" : "nav-link-item has-dropdown")}
            >
              <span>SẢN PHẨM</span>
              <ChevronDown size={14} className={`nav-arrow ${megaOpen ? "rotate" : ""}`} />
            </NavLink>

            <button 
              className="mobile-expand-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMobileProdExpanded(!mobileProdExpanded);
              }}
              aria-label="Expand products list"
            >
              <ChevronDown size={16} className={mobileProdExpanded ? "rotate" : ""} />
            </button>

            {/* DESKTOP ULTRA LUXURY FLYOUT DROPDOWN MENU */}
            <div className={`flyout-dropdown-menu ${megaOpen ? "show" : ""}`}>
              {/* Top Metallic Gold Accent Bar */}
              <div className="flyout-top-bar"></div>

              <div className={`flyout-container ${hoveredCatKey ? "has-sub" : ""}`} onMouseLeave={() => setHoveredCatKey(null)}>
                
                {/* Left Panel: 4 Categories */}
                <div className="flyout-main-list">
                  <div className="flyout-panel-title">DANH MỤC SẢN PHẨM</div>

                  {FLYOUT_PRODUCT_NAV_DATA.map((cat) => (
                    <div
                      key={cat.categoryKey}
                      className={`flyout-cat-item ${hoveredCatKey === cat.categoryKey ? "active" : ""}`}
                      onMouseEnter={() => setHoveredCatKey(cat.categoryKey)}
                    >
                      <Link 
                        to={`/san-pham?cat=${cat.categoryKey}`}
                        onClick={() => setMegaOpen(false)}
                        className="flyout-cat-link"
                      >
                        <span className="cat-icon-box">{cat.icon}</span>
                        <div className="cat-info-group">
                          <span className="cat-title-text">{cat.title}</span>
                          <span className="cat-sub-text">{cat.subtitle}</span>
                        </div>
                        <span className="cat-badge-count">{cat.badgeCount}</span>
                        <ChevronRight size={14} className="cat-chevron" />
                      </Link>
                    </div>
                  ))}

                  <div className="flyout-divider"></div>
                  
                  <Link 
                    to="/san-pham" 
                    onClick={() => setMegaOpen(false)}
                    onMouseEnter={() => setHoveredCatKey(null)}
                    className="flyout-all-link"
                  >
                    <div className="flyout-all-inner">
                      <Sparkles size={14} className="sparkle-gold" />
                      <span>Xem toàn bộ Catalog Sản Phẩm</span>
                    </div>
                    <ArrowRight size={14} />
                  </Link>
                </div>

                {/* Right Panel: Active Sub-items (Appears only on hovering a category) */}
                <div className={`flyout-sub-panel ${hoveredCatKey ? "active" : ""}`}>
                  <div className="flyout-sub-inner">
                    <div className="flyout-sub-header">
                      <div className="flyout-sub-title-wrap">
                        <span className="gold-accent-dot"></span>
                        <strong>{activeCatData.title}</strong>
                        <span className="gold-tag-sub">{activeCatData.subtitle}</span>
                      </div>
                    </div>

                    <div className="flyout-sub-grid">
                      {activeCatData.items.map((sub, sIdx) => (
                        <Link
                          key={sIdx}
                          to={`/san-pham?search=${encodeURIComponent(sub.query)}`}
                          onClick={() => setMegaOpen(false)}
                          className="flyout-sub-item"
                        >
                          <div className="sub-item-content">
                            <div className="sub-item-header">
                              <span className="sub-item-name">{sub.name}</span>
                              {sub.tag && <span className="sub-item-badge">{sub.tag}</span>}
                            </div>
                            {sub.desc && <span className="sub-item-desc">{sub.desc}</span>}
                          </div>
                          <div className="sub-arrow-box">
                            <ChevronRight size={14} className="sub-arrow-icon" />
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Sleek Bottom CTA Banner Inside Dropdown */}
                    <div className="flyout-sub-footer">
                      <div className="flyout-footer-text">
                        <ShieldCheck size={16} className="shield-icon" />
                        <span>Khảo sát & Báo giá tận nơi trọn gói tại Đà Nẵng</span>
                      </div>
                      <a href="tel:0904678323" className="flyout-call-pill">
                        <span>Hotline 0904 678 323</span>
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* MOBILE ACCORDION SUBLIST */}
          {mobileProdExpanded && (
            <div className="mobile-sub-accordion">
              {FLYOUT_PRODUCT_NAV_DATA.map((cat, cIdx) => (
                <div key={cIdx} className="mobile-acc-group">
                  <div className="mobile-acc-title">{cat.title}</div>
                  <div className="mobile-acc-items">
                    {cat.items.map((sub, sIdx) => (
                      <Link 
                        key={sIdx}
                        to={`/san-pham?search=${encodeURIComponent(sub.query)}`}
                        onClick={() => {
                          setMenu(false);
                          setMobileProdExpanded(false);
                        }}
                        className="mobile-acc-link"
                      >
                        • {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <NavLink 
            to="/du-an" 
            onClick={() => setMenu(false)} 
            className={({ isActive }) => (isActive ? "nav-link-item active" : "nav-link-item")}
          >
            <span>DỰ ÁN</span>
          </NavLink>

          <NavLink 
            to="/dich-vu" 
            onClick={() => setMenu(false)} 
            className={({ isActive }) => (isActive ? "nav-link-item active" : "nav-link-item")}
          >
            <span>DỊCH VỤ</span>
          </NavLink>

          <NavLink 
            to="/tin-tuc" 
            onClick={() => setMenu(false)} 
            className={({ isActive }) => (isActive ? "nav-link-item active" : "nav-link-item")}
          >
            <span>TIN TỨC</span>
          </NavLink>

          <NavLink 
            to="/lien-he" 
            onClick={() => setMenu(false)} 
            className={({ isActive }) => (isActive ? "nav-link-item active" : "nav-link-item")}
          >
            <span>LIÊN HỆ</span>
          </NavLink>

        </nav>

        <a className="call-btn" href="tel:0904678323">
          <span className="call-btn-pulse"></span>
          <PhoneCall size={17} className="call-icon" />
          <span className="call-number">0904 678 323</span>
        </a>

      </div>
    </header>
  );
}


