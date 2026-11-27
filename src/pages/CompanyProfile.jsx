import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Phone, 
  Mail,
  MapPin,
  ShieldCheck, 
  Building2, 
  Award, 
  Clock, 
  ArrowRight,
  CheckCircle2,
  Users,
  HardHat,
  Factory,
  BarChart3,
  TrendingUp,
  Briefcase,
  ChevronRight,
  Sparkles,
  Zap,
  Sliders,
  DoorClosed,
  Cpu,
  BadgeCheck,
  Calendar,
  Compass
} from "lucide-react";
import RevealOnScroll from "../components/RevealOnScroll";
import "./CompanyProfile.css";

const GOOGLE_DRIVE_DOWNLOAD_URL = "https://drive.google.com/uc?export=download&id=1IxLIKEYCc_RVlHsyq8nCDEMXVp0cLvAr";
const GOOGLE_DRIVE_VIEW_URL = "https://drive.google.com/file/d/1IxLIKEYCc_RVlHsyq8nCDEMXVp0cLvAr/view?pli=1";

// Dữ liệu 6 Lĩnh Vực Kinh Doanh Cốt Lõi
const CORE_BUSINESS_AREAS = [
  {
    id: "cuacuon",
    title: "Cửa Cuốn Cao Cấp",
    subtitle: "Công nghệ Đức & Úc - BossDoor & Germandoor",
    desc: "Cung cấp và thi công cửa cuốn khe thoáng hợp kim nhôm 6063, cửa cuốn tấm liền công nghệ Úc siêu êm, cửa cuốn BossDoor tích hợp AI cảm biến chống xô, báo động thông minh.",
    icon: <DoorClosed size={24} />,
    tags: ["Khe thoáng Đức", "BossDoor AI", "Tấm liền Úc", "Đài Loan"],
    badge: "Thế mạnh #1"
  },
  {
    id: "cuakeo",
    title: "Cửa Kéo Đài Loan & CN Đức",
    subtitle: "Sơn tĩnh điện AkzoNobel - Inox 304",
    desc: "Sản xuất lắp đặt cửa kéo nhôm định hình CN Đức không gỉ sét, cửa kéo tôn mạ màu Đài Loan có lá và không lá, cửa kéo Inox 304 độ bền vĩnh cửu trong môi trường ven biển.",
    icon: <Sliders size={24} />,
    tags: ["Cửa kéo CN Đức", "Cửa kéo Đài Loan", "Inox 304", "Không lá đón sáng"],
    badge: "Bán chạy"
  },
  {
    id: "cong-tudong",
    title: "Cổng & Cửa Tự Động",
    subtitle: "Nhập khẩu 100% Italy, Đức, Nhật Bản, Đài Loan",
    desc: "Phân phối motor cổng trượt, cổng mở cánh tay đòn, cổng âm sàn IP67 Beninca, Roger, BFT Italy; cửa trượt mắt thần Kaba/Nabco Nhật Bản, Barie tự động và cổng xếp Inox cơ quan.",
    icon: <Zap size={24} />,
    tags: ["Cổng âm sàn Italy", "Cửa trượt Nabco Nhật", "Barie điện tử", "Cổng xếp Inox"],
    badge: "Nhập khẩu 100%"
  },
  {
    id: "giengtroi",
    title: "Giếng Trời Tự Động & Mái Che",
    subtitle: "Cảm biến mưa nắng thông minh",
    desc: "Hệ thống giếng trời tự động trượt mở đón ánh sáng tự nhiên và thông gió, tích hợp cảm biến mưa tự động đóng, rèm che trần tự cuốn điều khiển qua Smartphone tiện nghi.",
    icon: <Sparkles size={24} />,
    tags: ["Giếng trời trượt", "Cảm biến thời tiết", "Smart Control", "Đón gió 95%"],
    badge: "Hiện đại"
  },
  {
    id: "kinh-nhom",
    title: "Nhôm Kính Hệ & Cửa Thủy Lực",
    subtitle: "Kính cường lực an toàn - Bản lề sàn cao cấp",
    desc: "Gia công thi công vách kính cường lực, cửa kính bản lề sàn Häfele/VVP, cửa nhôm hệ Xingfa cao cấp, cửa thủy lực khung nhôm sang trọng cho showroom, văn phòng và biệt thự.",
    icon: <Building2 size={24} />,
    tags: ["Kính bản lề sàn", "Kính cường lực 10-15mm", "Nhôm Xingfa nhập khẩu", "Showroom"],
    badge: "Thẩm mỹ cao"
  },
  {
    id: "phukien",
    title: "Mô Tơ, UPS & Phụ Kiện Cửa",
    subtitle: "Tổng kho phân phối chính hãng miền Trung",
    desc: "Đại lý phân phối cấp 1 các dòng mô tơ YH, AC, BossRM tải trọng 300 - 1500kg dây đồng 100%, bình lưu điện UPS 800 - 1200W lưu trữ 72h, hộp điều khiển mã nhảy Rolling Code chống trộm.",
    icon: <Cpu size={24} />,
    tags: ["Mô tơ YH chính hãng", "Lưu điện UPS 72h", "Mã nhảy an toàn", "Bảo hành 5 năm"],
    badge: "Phân phối chính thức"
  }
];

// Danh mục dự án trọng điểm phân loại chi tiết
const FEATURED_PROJECTS = [
  {
    category: "Cơ quan & Ngân hàng",
    items: [
      {
        name: "Tòa nhà VOV Miền Trung",
        location: "42 Pasteur, Q. Hải Châu, TP. Đà Nẵng",
        scope: "Cung cấp và thi công toàn bộ hệ thống cửa cuốn tự động, cửa kính tự động sảnh chính.",
        year: "2020 - 2021",
        tag: "Công trình trọng điểm"
      },
      {
        name: "Hệ thống Ngân hàng Agribank & Eximbank",
        location: "Các chi nhánh tại TP. Đà Nẵng & Quảng Nam",
        scope: "Cung cấp lắp đặt cửa cuốn khe thoáng siêu an toàn, hộp khóa mã nhảy chống sao chép bảo mật cao.",
        year: "2021 - 2023",
        tag: "Bảo mật tài chính"
      }
    ]
  },
  {
    category: "Thương mại, Siêu thị & Showroom",
    items: [
      {
        name: "TTTM AEON Mall Đà Nẵng (Chuỗi KKV)",
        location: "TTTM AEON Mall, TP. Đà Nẵng",
        scope: "Sản xuất và lắp đặt cửa cuốn song ngang inox 304 thông thoáng tối đa cho gian hàng quốc tế.",
        year: "2024 - 2026",
        tag: "Chuỗi TTTM Quốc Tế"
      },
      {
        name: "Hệ thống Siêu thị Điện máy MediaMart",
        location: "Đà Nẵng & miền Trung",
        scope: "Thi công cửa cuốn khổ độ rộng, motor tải trọng lớn vận hành liên tục cho kho vận và mặt tiền siêu thị.",
        year: "2019 - 2022",
        tag: "Bán lẻ quy mô"
      },
      {
        name: "Chuỗi Showroom Thời trang SAVANI",
        location: "Đà Nẵng & Quảng Nam",
        scope: "Thi công toàn bộ cửa cuốn mặt tiền nhận diện thương hiệu và cửa kéo bảo vệ.",
        year: "2021 - 2023",
        tag: "Chuỗi cửa hàng"
      }
    ]
  },
  {
    category: "Dự án Công nghiệp & Nhà máy",
    items: [
      {
        name: "Khu liên hợp gang thép Hòa Phát Dung Quất",
        location: "KCN Dung Quất, Tỉnh Quảng Ngãi",
        scope: "Thi công toàn bộ hệ thống cửa cuốn khẩu độ siêu trường, siêu trọng công nghệ cao cho các phân xưởng.",
        year: "2020 - 2022",
        tag: "Đại công trình"
      },
      {
        name: "Nhà máy Sữa Vinamilk Đà Nẵng",
        location: "KCN Hòa Khánh, Q. Liên Chiểu, TP. Đà Nẵng",
        scope: "Thi công cửa cuốn công nghiệp và hệ thống cửa nhôm kính đạt chuẩn an toàn vệ sinh công nghiệp.",
        year: "2020 - 2021",
        tag: "Nhà máy chuẩn quốc tế"
      },
      {
        name: "Dự án Nhà máy nước Hòa Liên",
        location: "Hòa Liên, Hòa Vang, TP. Đà Nẵng",
        scope: "Lắp đặt cửa cuốn và cửa kéo kỹ thuật cho các khu nhà điều hành & xử lý nước.",
        year: "2021 - 2022",
        tag: "Công trình hạ tầng"
      },
      {
        name: "Nhà máy Xử lý Rác sinh hoạt Bắc Quảng Nam",
        location: "Bắc Quảng Nam",
        scope: "Hệ thống cửa cuốn chịu lực, kháng ăn mòn hóa chất và bền bỉ trong môi trường xử lý chất thải.",
        year: "2020",
        tag: "Môi trường"
      }
    ]
  },
  {
    category: "Khu đô thị, Biệt thự & Shophouse",
    items: [
      {
        name: "Dự án Công viên Văn hóa 'Ấn Tượng Hội An'",
        location: "TP. Hội An, Tỉnh Quảng Nam",
        scope: "Thi công hệ thống cửa cuốn nghệ thuật hòa quyện không gian kiến trúc cổ kính và hiện đại.",
        year: "2019 - 2020",
        tag: "Du lịch - Văn hóa"
      },
      {
        name: "Dãy 15 Căn Shophouse Golden Hills",
        location: "Khu đô thị sinh thái Golden Hills, TP. Đà Nẵng",
        scope: "Thi công đồng bộ 15 bộ cửa cuốn cao cấp cho khối shophouse thương mại mặt đường lớn.",
        year: "2020 - 2021",
        tag: "Khu đô thị cao cấp"
      },
      {
        name: "Quần thể Biệt thự Đảo Euro Villas 1 & Euro Villas 2",
        location: "Bên bờ sông Hàn, Q. Sơn Trà, TP. Đà Nẵng",
        scope: "Lắp đặt cổng tự động nhập khẩu Italy, cửa cuốn biệt thự cách âm và hệ thống cửa thông minh.",
        year: "2019 - 2025",
        tag: "Biệt thự siêu sang"
      },
      {
        name: "Shophouse Mặt tiền Đường Võ Chí Công & Chợ Bà Lê Hội An",
        location: "Đà Nẵng & Hội An",
        scope: "Cung cấp lắp đặt cửa cuốn tấm liền, cửa kéo công nghệ Đức độ bền cao.",
        year: "2021 - 2023",
        tag: "Thương mại dân sinh"
      }
    ]
  }
];

export default function CompanyProfile() {
  const [activeProjectTab, setActiveProjectTab] = useState(0);

  return (
    <div className="company-profile-page">
      {/* 1. HERO HEADER BANNER */}
      <section className="profile-hero-modern">
        <div className="container">
          <RevealOnScroll animation="fade-up">
            <nav className="profile-breadcrumb-nav" aria-label="Breadcrumb">
              <Link to="/">Trang chủ</Link>
              <span className="bc-separator">/</span>
              <Link to="/gioi-thieu">Giới thiệu</Link>
              <span className="bc-separator">/</span>
              <span className="bc-active">Hồ sơ năng lực</span>
            </nav>

            <div className="profile-hero-grid">
              <div className="profile-hero-text">
                <div className="hero-status-pill">
                  <span className="pulsing-status-dot"></span>
                  <span>HỒ SƠ NĂNG LỰC DOANH NGHIỆP 2026</span>
                </div>
                
                <h1 className="profile-hero-title">
                  CÔNG TY TNHH MTV THƯƠNG MẠI & DỊCH VỤ <br />
                  <span className="text-gradient-gold">BOSS ĐÀ NẴNG (COMPANY PROFILE)</span>
                </h1>

                <p className="profile-hero-lead">
                  Tổng thầu phân phối và thi công chuyên nghiệp các hạng mục <strong>Cửa Cuốn công nghệ cao</strong>, 
                  <strong> Cửa Kéo cao cấp</strong>, <strong>Cổng Tự Động nhập khẩu Châu Âu</strong>, 
                  <strong> Nhôm Kính Kiến Trúc</strong> và phụ kiện đồng bộ hàng đầu tại Đà Nẵng và miền Trung.
                </p>

                <div className="profile-hero-ctas">
                  <a 
                    href={GOOGLE_DRIVE_DOWNLOAD_URL} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-hero-primary"
                    title="Tải bản PDF gốc đầy đủ về máy"
                  >
                    <Download size={18} />
                    <span>Tải Hồ Sơ PDF Gốc (32MB)</span>
                  </a>

                  <a 
                    href={GOOGLE_DRIVE_VIEW_URL} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-hero-secondary"
                    title="Mở xem bản PDF trên Google Drive"
                  >
                    <ExternalLink size={17} />
                    <span>Xem Bản Drive Gốc</span>
                  </a>

                  <a 
                    href="tel:0904678323" 
                    className="btn-hero-call"
                  >
                    <Phone size={17} />
                    <span>Hotline: 0904 678 323</span>
                  </a>
                </div>
              </div>

              {/* Quick Legal Summary Box */}
              <div className="profile-hero-quick-card">
                <div className="quick-card-header">
                  <BadgeCheck size={24} className="gold-icon" />
                  <div>
                    <h4>HỒ SƠ PHÁP LÝ HỢP LỆ</h4>
                    <p>Sở KH&ĐT TP Đà Nẵng cấp</p>
                  </div>
                </div>

                <div className="quick-card-list">
                  <div className="qc-item">
                    <span className="qc-label">Mã số thuế:</span>
                    <strong className="qc-val">0401872174</strong>
                  </div>
                  <div className="qc-item">
                    <span className="qc-label">Đại diện pháp luật:</span>
                    <strong className="qc-val">Ông Hoàng Nhật Quỳnh</strong>
                  </div>
                  <div className="qc-item">
                    <span className="qc-label">Chức vụ:</span>
                    <strong className="qc-val">Giám đốc</strong>
                  </div>
                  <div className="qc-item">
                    <span className="qc-label">Trụ sở công ty:</span>
                    <span className="qc-val">647 Ngô Quyền, P. An Hải Bắc, Q. Sơn Trà, TP. Đà Nẵng</span>
                  </div>
                  <div className="qc-item">
                    <span className="qc-label">Hotline 24/7:</span>
                    <span className="qc-val highlight-gold">0904 678 323 - 02363 566 286</span>
                  </div>
                  <div className="qc-item">
                    <span className="qc-label">Email dự án:</span>
                    <span className="qc-val">bossdanangvn@gmail.com</span>
                  </div>
                </div>

                <div className="quick-card-badge">
                  <ShieldCheck size={16} />
                  <span>Sẵn sàng tham gia thẩm định & chào thầu dự án</span>
                </div>
              </div>
            </div>

            {/* Impressive Numbers Stats */}
            <div className="profile-metrics-strip">
              <div className="metric-box">
                <span className="metric-number">10+</span>
                <span className="metric-title">Năm hình thành & phát triển</span>
                <span className="metric-sub">Kinh nghiệm thi công thực chiến</span>
              </div>
              <div className="metric-box">
                <span className="metric-number">500+</span>
                <span className="metric-title">Công trình hoàn thành</span>
                <span className="metric-sub">Từ dân dụng đến dự án nghìn tỷ</span>
              </div>
              <div className="metric-box">
                <span className="metric-number">100%</span>
                <span className="metric-title">Chuẩn an toàn kỹ thuật</span>
                <span className="metric-sub">Không xảy ra sự cố lao động</span>
              </div>
              <div className="metric-box">
                <span className="metric-number">24/7</span>
                <span className="metric-title">Bảo hành & Hỗ trợ kỹ thuật</span>
                <span className="metric-sub">Đội phản ứng nhanh tại công trình</span>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* 2. THƯ NGỎ TỪ BAN GIÁM ĐỐC */}
      <section className="profile-section section-letter">
        <div className="container">
          <RevealOnScroll animation="fade-up">
            <div className="letter-wrapper">
              <div className="letter-decor-quote">“</div>
              <div className="letter-header">
                <span className="letter-tag">THƯ NGỎ TỪ BAN GIÁM ĐỐC</span>
                <h2 className="letter-title">Tăng Cường Hợp Tác – Kiến Tạo Giá Trị – Hướng Đến Thành Công</h2>
              </div>

              <div className="letter-body">
                <p>
                  <strong>Kính gửi Quý Khách hàng, Quý Chủ đầu tư và Đối tác chiến lược!</strong>
                </p>
                <p>
                  Lời đầu tiên, Ban Giám đốc cùng toàn thể cán bộ nhân viên <strong>Công ty TNHH MTV TM&DV BOSS Đà Nẵng</strong> xin 
                  gửi lời chào trân trọng nhất và lời cảm ơn sâu sắc vì sự tin tưởng, đồng hành của Quý vị trong suốt chặng đường phát triển vừa qua.
                </p>
                <p>
                  Trải qua hơn 10 năm xây dựng và phát triển, BOSS Đà Nẵng tự hào khẳng định vị thế là một trong những đơn vị tiên phong hàng đầu 
                  về phân phối, gia công và thi công trọn gói các giải pháp <em>Cửa cuốn khe thoáng BossDoor - Germandoor, Cửa kéo công nghệ Đức - Đài Loan, 
                  Cổng tự động nhập khẩu Italy - Đức - Nhật Bản, Giếng trời thông minh và Nhôm kính cao cấp</em> tại TP. Đà Nẵng, Quảng Nam, Quảng Ngãi và toàn miền Trung.
                </p>
                <p>
                  Chúng tôi vinh dự được đóng góp vào thành công của hàng loạt công trình quy mô lớn như <strong>Tòa nhà VOV Miền Trung, Dự án Nhà máy Hòa Phát Dung Quất, 
                  Nhà máy Sữa Vinamilk Đà Nẵng, Quần thể Biệt thự Euro Villas 1 & 2, Chuỗi Siêu thị MediaMart, Hệ thống Ngân hàng Agribank, Eximbank</strong> và chuỗi gian hàng 
                  quốc tế tại <strong>AEON Mall Đà Nẵng</strong>.
                </p>
                <p>
                  Mỗi công trình là một minh chứng cho tinh thần trách nhiệm, kỷ luật thi công và cam kết vàng: 
                  <strong className="text-green-gold"> "Uy tín - Chất lượng cao - Giá thành hợp lý - Đảm bảo tiến độ - An toàn tuyệt đối"</strong>. 
                  Chúng tôi rất mong tiếp tục được đồng hành cùng Quý đối tác trong các dự án tương lai!
                </p>
              </div>

              <div className="letter-sign-row">
                <div className="letter-company-stamp">
                  <div className="stamp-circle">BOSS ĐÀ NẴNG</div>
                  <div className="stamp-text">ĐẠI DIỆN PHÁP LUẬT CÔNG TY</div>
                </div>
                <div className="letter-signature-box">
                  <span className="sign-role">GIÁM ĐỐC CÔNG TY</span>
                  <div className="sign-signature-graphic">Hoàng Nhật Quỳnh</div>
                  <strong className="sign-name">Ông Hoàng Nhật Quỳnh</strong>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* 3. TẦM NHÌN - SỨ MỆNH - GIÁ TRỊ CỐT LÕI */}
      <section className="profile-section section-philosophy">
        <div className="container">
          <RevealOnScroll animation="fade-up">
            <div className="section-head text-center">
              <span className="section-subtitle-pill">KIM CHỈ NAM PHÁT TRIỂN</span>
              <h2 className="section-main-title">Tầm Nhìn, Sứ Mệnh & Giá Trị Cốt Lõi</h2>
              <p className="section-subtext">
                Nền tảng vững chắc định hướng mọi quyết định và chiến lược hành động của tập thể BOSS Đà Nẵng.
              </p>
            </div>

            <div className="philosophy-grid">
              <div className="philosophy-card card-vision">
                <div className="philosophy-icon-wrap">
                  <Compass size={28} />
                </div>
                <span className="card-tag">TẦM NHÌN CHIẾN LƯỢC</span>
                <h3 className="philosophy-title">Nhà Thầu Chuyên Biệt Số 1 Miền Trung</h3>
                <p className="philosophy-desc">
                  Trở thành tổng thầu và đối tác thi công hàng đầu với phương thức quản trị chất lượng hiện đại theo chuẩn mực quốc tế. 
                  Là sự lựa chọn ưu tiên số 1 của các Chủ đầu tư, Tổng thầu xây dựng khi có nhu cầu cung cấp và lắp đặt cửa thông minh, 
                  cổng tự động và kiến trúc nhôm kính tại miền Trung.
                </p>
              </div>

              <div className="philosophy-card card-mission">
                <div className="philosophy-icon-wrap">
                  <Award size={28} />
                </div>
                <span className="card-tag">SỨ MỆNH DOANH NGHIỆP</span>
                <h3 className="philosophy-title">Kiến Tạo Công Trình Vững Bền</h3>
                <p className="philosophy-desc">
                  Góp phần tạo nên những giá trị an toàn và trường tồn cho xã hội bằng những công trình đẳng cấp, bền bỉ, hài hòa kiến trúc. 
                  Mang lại lợi ích kinh tế thiết thực và sự an tâm trọn vẹn cho khách hàng; đồng thời tạo dựng môi trường làm việc năng động, 
                  phúc lợi công bằng cho toàn thể cán bộ nhân viên.
                </p>
              </div>

              <div className="philosophy-card card-motto">
                <div className="philosophy-icon-wrap">
                  <ShieldCheck size={28} />
                </div>
                <span className="card-tag">PHƯƠNG CHÂM VÀNG</span>
                <h3 className="philosophy-title">5 Chuẩn Mực Tuyệt Đối</h3>
                <ul className="motto-list">
                  <li><CheckCircle2 size={16} /> <strong>Uy tín:</strong> Giữ trọn lời hứa với khách hàng và đối tác.</li>
                  <li><CheckCircle2 size={16} /> <strong>Chất lượng cao:</strong> Sản phẩm chính hãng, kiểm định khắt khe.</li>
                  <li><CheckCircle2 size={16} /> <strong>Giá hợp lý:</strong> Tối ưu hóa chi phí trực tiếp từ xưởng.</li>
                  <li><CheckCircle2 size={16} /> <strong>Đảm bảo tiến độ:</strong> Đúng hạn bàn giao, thi công chuẩn kỹ thuật.</li>
                  <li><CheckCircle2 size={16} /> <strong>An toàn tuyệt đối:</strong> 100% bảo hộ và kiểm định vận hành.</li>
                </ul>
              </div>
            </div>

            {/* 3 Core Values Detailed */}
            <div className="core-values-detailed">
              <h4 className="cv-heading">3 GIÁ TRỊ CỐT LÕI NỀN TẢNG</h4>
              <div className="cv-grid">
                <div className="cv-item">
                  <div className="cv-number">01</div>
                  <div className="cv-content">
                    <h5>Sự Phát Triển Của Người Lao Động</h5>
                    <p>
                      Xây dựng môi trường làm việc năng động, công bằng, liên tục đào tạo nâng cao tay nghề và chứng chỉ an toàn để mỗi thành viên phát huy tối đa năng lực.
                    </p>
                  </div>
                </div>

                <div className="cv-item">
                  <div className="cv-number">02</div>
                  <div className="cv-content">
                    <h5>Sự Hài Lòng Của Khách Hàng</h5>
                    <p>
                      Lấy sự thỏa mãn và lợi ích của khách hàng làm thước đo cao nhất cho thành công của công việc. Lắng nghe và đồng hành trọn đời sản phẩm.
                    </p>
                  </div>
                </div>

                <div className="cv-item">
                  <div className="cv-number">03</div>
                  <div className="cv-content">
                    <h5>Sự Hoàn Thiện Của Từng Dự Án</h5>
                    <p>
                      Không ngừng cải tiến, trau chuốt từng chi tiết từ mối hàn, nan lá đến hệ thống điều khiển thông minh để tăng tính cạnh tranh và văn hóa doanh nghiệp.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* 4. LĨNH VỰC HOẠT ĐỘNG VÀ THẾ MẠNH SẢN PHẨM */}
      <section className="profile-section section-business">
        <div className="container">
          <RevealOnScroll animation="fade-up">
            <div className="section-head text-center">
              <span className="section-subtitle-pill">DANH MỤC NĂNG LỰC CUNG ỨNG</span>
              <h2 className="section-main-title">6 Lĩnh Vực Kinh Doanh & Phân Phối Cốt Lõi</h2>
              <p className="section-subtext">
                Hệ sinh thái sản phẩm và giải pháp cửa thông minh toàn diện, phục vụ từ nhà phố, biệt thự đến siêu dự án công nghiệp.
              </p>
            </div>

            <div className="business-grid">
              {CORE_BUSINESS_AREAS.map((area, index) => (
                <div key={area.id} className="business-card">
                  <div className="bc-top">
                    <div className="bc-icon">{area.icon}</div>
                    <span className="bc-badge">{area.badge}</span>
                  </div>
                  <h3 className="bc-title">{area.title}</h3>
                  <div className="bc-subtitle">{area.subtitle}</div>
                  <p className="bc-desc">{area.desc}</p>
                  <div className="bc-tags">
                    {area.tags.map((t, idx) => (
                      <span key={idx} className="bc-tag-item">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* 5. SƠ ĐỒ TỔ CHỨC & NĂNG LỰC NHÂN SỰ */}
      <section className="profile-section section-org">
        <div className="container">
          <RevealOnScroll animation="fade-up">
            <div className="section-head text-center">
              <span className="section-subtitle-pill">BỘ MÁY ĐIỀU HÀNH & KỸ THUẬT</span>
              <h2 className="section-main-title">Sơ Đồ Tổ Chức & Năng Lực Nhân Sự</h2>
              <p className="section-subtext">
                Bộ máy quản trị chuyên nghiệp, phân cấp rõ ràng, đảm bảo quy trình thi công an toàn và thông suốt.
              </p>
            </div>

            <div className="org-chart-wrapper">
              {/* Cấp 1: Ban Giám Đốc */}
              <div className="org-level level-board">
                <div className="org-node node-ceo">
                  <div className="node-badge">LÃNH ĐẠO CAO NHẤT</div>
                  <div className="node-title">BAN GIÁM ĐỐC CÔNG TY</div>
                  <div className="node-person">Ông Hoàng Nhật Quỳnh — Giám đốc</div>
                </div>
              </div>

              <div className="org-branch-line"></div>

              {/* Cấp 2: Phó Giám Đốc chuyên trách */}
              <div className="org-level level-vice">
                <div className="org-node node-vice">
                  <div className="node-role">PHÓ GIÁM ĐỐC DỰ ÁN & KỸ THUẬT</div>
                  <div className="node-desc">Chỉ đạo thi công, hồ sơ kỹ thuật & ATLĐ</div>
                </div>
                <div className="org-node node-vice">
                  <div className="node-role">PHÓ GIÁM ĐỐC KINH DOANH</div>
                  <div className="node-desc">Điều hành khối bán hàng, đối tác & thị trường</div>
                </div>
              </div>

              <div className="org-branch-line"></div>

              {/* Cấp 3: 6 Phòng Ban Chức Năng */}
              <div className="org-level level-departments">
                <div className="dept-card">
                  <div className="dept-icon"><Briefcase size={20} /></div>
                  <div className="dept-title">Phòng Dự Án</div>
                  <div className="dept-info">Khảo sát, lập dự toán, quản lý tiến độ thi công công trình</div>
                </div>

                <div className="dept-card">
                  <div className="dept-icon"><HardHat size={20} /></div>
                  <div className="dept-title">Phòng Kỹ Thuật & ATLĐ</div>
                  <div className="dept-info">Giám sát kỹ thuật, an toàn lao động, kiểm định chất lượng</div>
                </div>

                <div className="dept-card">
                  <div className="dept-icon"><Factory size={20} /></div>
                  <div className="dept-title">Phòng Vật Tư - Thiết Bị</div>
                  <div className="dept-info">Quản lý kho xưởng, máy móc gia công và nhập khẩu linh kiện</div>
                </div>

                <div className="dept-card">
                  <div className="dept-icon"><Users size={20} /></div>
                  <div className="dept-title">Phòng Kinh Doanh</div>
                  <div className="dept-info">Tư vấn cấu hình, chăm sóc khách hàng, phát triển đại lý</div>
                </div>

                <div className="dept-card">
                  <div className="dept-icon"><BarChart3 size={20} /></div>
                  <div className="dept-title">Phòng Tài Chính - KT</div>
                  <div className="dept-info">Quản lý dòng vốn, thanh quyết toán và bảo lãnh ngân hàng</div>
                </div>

                <div className="dept-card">
                  <div className="dept-icon"><Award size={20} /></div>
                  <div className="dept-title">Phòng Hành Chính - NS</div>
                  <div className="dept-info">Đào tạo nhân sự, văn hóa công ty và chế độ chính sách</div>
                </div>
              </div>

              {/* Cam kết nhân sự kỹ thuật */}
              <div className="personnel-commitments">
                <div className="pc-col">
                  <div className="pc-icon"><Users size={22} /></div>
                  <div>
                    <h5>Đội Ngũ Kỹ Sư & Cử Nhân Chuyên Ngành</h5>
                    <p>Được đào tạo bài bản từ các trường kỹ thuật danh tiếng, giàu kinh nghiệm thiết kế giải pháp và xử lý mặt bằng khó.</p>
                  </div>
                </div>

                <div className="pc-col">
                  <div className="pc-icon"><HardHat size={22} /></div>
                  <div>
                    <h5>100% Thợ Kỹ Thuật Lành Nghề Có Thẻ ATLĐ</h5>
                    <p>Thực hiện nghiệm ngặt các quy định an toàn lao động, trang bị đầy đủ bảo hộ đạt chuẩn khi thi công trên cao.</p>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* 6. NĂNG LỰC TÀI CHÍNH & MÁY MÓC THIẾT BỊ */}
      <section className="profile-section section-capacity">
        <div className="container">
          <RevealOnScroll animation="fade-up">
            <div className="capacity-grid">
              {/* Năng lực tài chính */}
              <div className="capacity-col finance-card">
                <div className="cap-head">
                  <div className="cap-icon"><TrendingUp size={24} /></div>
                  <div>
                    <span className="cap-badge">VỐN & DÒNG TIỀN</span>
                    <h3 className="cap-title">Năng Lực Tài Chính Vững Vàng</h3>
                  </div>
                </div>
                <p className="cap-desc">
                  BOSS Đà Nẵng có nền tảng tài chính mạnh mẽ, đảm bảo hoàn thành tốt các dự án lớn có tiến độ gấp. 
                  Bên cạnh nguồn vốn chủ sở hữu, công ty luôn duy trì mối quan hệ tín dụng vững chắc với các tổ chức ngân hàng hàng đầu, 
                  sẵn sàng đáp ứng đầy đủ nguồn lực tài chính để bảo lãnh thực hiện hợp đồng và bảo hành công trình.
                </p>

                <div className="finance-indicators">
                  <div className="fi-item">
                    <span className="fi-label">Tăng trưởng doanh thu:</span>
                    <strong className="fi-val text-green-gold">Liên tục tăng trưởng qua các năm</strong>
                  </div>
                  <div className="fi-item">
                    <span className="fi-label">Năng lực vốn lưu động:</span>
                    <strong className="fi-val">Đủ năng lực nhận các gói thầu lớn</strong>
                  </div>
                  <div className="fi-item">
                    <span className="fi-label">Đối tác tín dụng bảo lãnh:</span>
                    <span className="fi-val">Agribank, Vietinbank, Eximbank...</span>
                  </div>
                  <div className="fi-item">
                    <span className="fi-label">Nghĩa vụ ngân sách nhà nước:</span>
                    <strong className="fi-val text-green-gold">Hoàn thành 100% đúng hạn</strong>
                  </div>
                </div>
              </div>

              {/* Năng lực trang thiết bị máy móc */}
              <div className="capacity-col equipment-card">
                <div className="cap-head">
                  <div className="cap-icon"><Factory size={24} /></div>
                  <div>
                    <span className="cap-badge">TRANG THIẾT BỊ</span>
                    <h3 className="cap-title">Máy Móc Gia Công & Thi Công Hiện Đại</h3>
                  </div>
                </div>
                <p className="cap-desc">
                  Sở hữu xưởng gia công cùng dây chuyền thiết bị chuyên dụng đồng bộ, giúp rút ngắn thời gian hoàn thiện sản phẩm và đảm bảo độ chính xác cơ khí tuyệt đối.
                </p>

                <div className="equipment-list">
                  <div className="eq-item">
                    <CheckCircle2 size={18} className="eq-check" />
                    <div>
                      <strong>Máy cắt nhôm 2 đầu điều khiển kỹ thuật số:</strong>
                      <span> Cắt góc 45° - 90° với độ dung sai siêu nhỏ dưới 0.1mm.</span>
                    </div>
                  </div>
                  <div className="eq-item">
                    <CheckCircle2 size={18} className="eq-check" />
                    <div>
                      <strong>Dàn máy dập thủy lực & uốn nan chuyên dụng:</strong>
                      <span> Định hình nan cửa và phụ kiện chịu tải nặng.</span>
                    </div>
                  </div>
                  <div className="eq-item">
                    <CheckCircle2 size={18} className="eq-check" />
                    <div>
                      <strong>Thiết bị đo trắc đạc laser & căn phẳng mặt bằng:</strong>
                      <span> Kiểm tra độ thăng bằng trục cuốn và ray dẫn hướng chính xác.</span>
                    </div>
                  </div>
                  <div className="eq-item">
                    <CheckCircle2 size={18} className="eq-check" />
                    <div>
                      <strong>Hệ thống giàn giáo, tời điện & xe nâng hạ đạt kiểm định:</strong>
                      <span> Phục vụ lắp dựng an toàn tại các nhà xưởng trần cao tới 15m.</span>
                    </div>
                  </div>
                  <div className="eq-item">
                    <CheckCircle2 size={18} className="eq-check" />
                    <div>
                      <strong>Đội xe vận tải giao hàng chuyên trách:</strong>
                      <span> Linh hoạt vận chuyển nan cửa và vật tư tới mọi công trình miền Trung.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* 7. DANH MỤC DỰ ÁN TRỌNG ĐIỂM TIÊU BIỂU */}
      <section className="profile-section section-projects" id="du-an-tieu-bieu">
        <div className="container">
          <RevealOnScroll animation="fade-up">
            <div className="section-head text-center">
              <span className="section-subtitle-pill">HỒ SƠ CÔNG TRÌNH THỰC TẾ</span>
              <h2 className="section-main-title">Dự Án Tiêu Biểu Đã Thực Hiện</h2>
              <p className="section-subtext">
                Khẳng định uy tín và năng lực qua hàng trăm công trình dân dụng, thương mại và đại dự án công nghiệp.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="project-tabs-nav">
              {FEATURED_PROJECTS.map((tab, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`tab-btn ${activeProjectTab === idx ? "is-active" : ""}`}
                  onClick={() => setActiveProjectTab(idx)}
                >
                  <span>{tab.category}</span>
                </button>
              ))}
            </div>

            {/* Tab Content Display */}
            <div className="project-cards-grid">
              {FEATURED_PROJECTS[activeProjectTab].items.map((proj, idx) => (
                <div key={idx} className="project-feature-card">
                  <div className="pfc-top">
                    <span className="pfc-tag">{proj.tag}</span>
                    <span className="pfc-year"><Calendar size={13} /> {proj.year}</span>
                  </div>
                  <h3 className="pfc-name">{proj.name}</h3>
                  <div className="pfc-loc">
                    <MapPin size={15} />
                    <span>{proj.location}</span>
                  </div>
                  <p className="pfc-scope">
                    <strong>Hạng mục:</strong> {proj.scope}
                  </p>
                  <div className="pfc-footer">
                    <span className="pfc-status"><CheckCircle2 size={14} /> Hoàn thành nghiệm thu</span>
                  </div>
                </div>
              ))}
            </div>

            {/* All Projects Mini Grid Banner */}
            <div className="all-projects-mention">
              <div className="apm-inner">
                <div>
                  <h4>Và hàng trăm công trình biệt thự, shophouse, nhà xưởng tại Đà Nẵng & miền Trung</h4>
                  <p>Từ Euro Villas, Golden Hills, KCN Hòa Khánh, KCN Dung Quất đến các dự án tư nhân cao cấp.</p>
                </div>
                <Link to="/cong-trinh" className="btn-apm-link">
                  <span>Xem Thư Viện Hình Ảnh Công Trình</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* 8. BẢNG THÔNG TIN PHÁP LÝ CHI TIẾT */}
      <section className="profile-section section-legal-table">
        <div className="container">
          <RevealOnScroll animation="fade-up">
            <div className="legal-table-card">
              <div className="ltc-header">
                <div className="ltc-icon"><FileText size={26} /></div>
                <div>
                  <h3 className="ltc-title">BẢNG THÔNG TIN HÀNH CHÍNH & PHÁP LÝ DOANH NGHIỆP</h3>
                  <p className="ltc-subtitle">Cung cấp chuẩn xác phục vụ công tác soạn thảo hợp đồng, thẩm định hồ sơ thầu và thanh quyết toán</p>
                </div>
              </div>

              <div className="table-responsive">
                <table className="profile-legal-table">
                  <tbody>
                    <tr>
                      <td className="col-label">Tên công ty tiếng Việt:</td>
                      <td className="col-val font-bold">CÔNG TY TNHH MTV THƯƠNG MẠI & DỊCH VỤ BOSS ĐÀ NẴNG</td>
                    </tr>
                    <tr>
                      <td className="col-label">Tên giao dịch quốc tế:</td>
                      <td className="col-val">BOSS DA NANG TRADING & SERVICES COMPANY LIMITED (BOSS DA NANG CO., LTD)</td>
                    </tr>
                    <tr>
                      <td className="col-label">Mã số doanh nghiệp (MST):</td>
                      <td className="col-val"><strong className="text-highlight-gold">0401872174</strong> (Do Sở KH&ĐT TP Đà Nẵng cấp)</td>
                    </tr>
                    <tr>
                      <td className="col-label">Người đại diện theo pháp luật:</td>
                      <td className="col-val"><strong>Ông Hoàng Nhật Quỳnh</strong> — Chức vụ: <strong>Giám đốc</strong></td>
                    </tr>
                    <tr>
                      <td className="col-label">Địa chỉ trụ sở chính:</td>
                      <td className="col-val">Số 647 Ngô Quyền, Phường An Hải Bắc, Quận Sơn Trà, TP. Đà Nẵng, Việt Nam</td>
                    </tr>
                    <tr>
                      <td className="col-label">Điện thoại / Hotline dự án:</td>
                      <td className="col-val"><strong>0904 678 323</strong> (Zalo 24/7) — Máy bàn: <strong>02363 566 286</strong></td>
                    </tr>
                    <tr>
                      <td className="col-label">Email tiếp nhận hồ sơ & báo giá:</td>
                      <td className="col-val">bossdanangvn@gmail.com</td>
                    </tr>
                    <tr>
                      <td className="col-label">Trang thông tin điện tử (Website):</td>
                      <td className="col-val">https://bossdoordanang.com.vn</td>
                    </tr>
                    <tr>
                      <td className="col-label">Ngành nghề kinh doanh chính:</td>
                      <td className="col-val">Cung cấp, gia công, lắp đặt và bảo trì: Cửa cuốn tự động, cửa kéo công nghệ cao, cổng tự động Châu Âu, cửa nhôm kính, giếng trời thông minh và phụ kiện cửa.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* 9. TẢI VỀ PROFILE GỐC & CALL TO ACTION */}
      <section className="profile-cta-section">
        <div className="container">
          <RevealOnScroll animation="fade-up">
            <div className="profile-cta-box">
              <div className="cta-left">
                <span className="cta-sub-badge">TẢI FILE TÀI LIỆU GỐC</span>
                <h2 className="cta-heading">Quý Khách Cần Bản PDF In Ấn Để Làm Hồ Sơ Thầu?</h2>
                <p className="cta-text">
                  Quý Chủ đầu tư, Tổng thầu và Đối tác có thể tải trực tiếp bản <strong>Company Profile đầy đủ (File gốc PDF 32MB)</strong> 
                  hoặc liên hệ trực tiếp Ban Giám Đốc để nhận báo giá dự toán và phương án kỹ thuật tối ưu nhất.
                </p>
                <div className="cta-action-buttons">
                  <a 
                    href={GOOGLE_DRIVE_DOWNLOAD_URL} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-cta-download"
                    title="Tải bản PDF về máy"
                  >
                    <Download size={18} />
                    <span>Tải Hồ Sơ PDF Đầy Đủ (32MB)</span>
                  </a>

                  <a 
                    href="tel:0904678323" 
                    className="btn-cta-phone"
                  >
                    <Phone size={18} />
                    <span>Liên Hệ Ban Giám Đốc: 0904 678 323</span>
                  </a>
                </div>
              </div>

              <div className="cta-right">
                <div className="cta-contact-card">
                  <h4>LIÊN HỆ PHÒNG DỰ ÁN & ĐẤU THẦU</h4>
                  <div className="cc-row">
                    <Phone size={16} className="cc-icon" />
                    <div>
                      <span>Hotline kinh doanh:</span>
                      <strong>0904 678 323</strong>
                    </div>
                  </div>
                  <div className="cc-row">
                    <Mail size={16} className="cc-icon" />
                    <div>
                      <span>Email chào thầu:</span>
                      <strong>bossdanangvn@gmail.com</strong>
                    </div>
                  </div>
                  <div className="cc-row">
                    <MapPin size={16} className="cc-icon" />
                    <div>
                      <span>Văn phòng & Showroom:</span>
                      <small>647 Ngô Quyền, Sơn Trà, TP. Đà Nẵng</small>
                    </div>
                  </div>
                  <div className="cc-row">
                    <Clock size={16} className="cc-icon" />
                    <div>
                      <span>Thời gian làm việc:</span>
                      <small>24/7 (Sẵn sàng tiếp nhận yêu cầu)</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
