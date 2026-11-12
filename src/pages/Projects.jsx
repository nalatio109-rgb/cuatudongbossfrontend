import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  ArrowUpRight,
  CheckCircle2,
  PhoneCall,
  MessageCircle,
  Search,
  SlidersHorizontal,
  Layers,
  ShieldCheck,
  Sparkles,
  Clock,
  ChevronRight,
  X,
  Ruler,
  Award,
  Wrench,
  Building2,
  Eye,
  Check
} from 'lucide-react';
import './Projects.css';
import RevealOnScroll from '../components/RevealOnScroll';
import AnimatedCounter from '../components/AnimatedCounter';

const formatImgSrc = (src) => {
  if (!src) return '/project_1.png';
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src;
  }
  if (src.startsWith('/uploads')) {
    const backendBase = import.meta.env.VITE_API_URL || '';
    return `${backendBase}${src}`;
  }
  return src;
};

// Danh sách công trình thực tế tiêu biểu của BOSS Đà Nẵng
const SHOWCASE_PROJECTS = [
  {
    id: 'p1',
    title: 'Hệ Thống Cửa Cuốn Song Ngang TTTM Lacoste / Aeon Mall',
    category: 'Dự án TTTM & Showroom',
    categoryKey: 'commercial',
    image: '/about_construction.jpg',
    location: 'Hải Châu, Đà Nẵng',
    completedDate: '2024',
    scale: '2 bộ cửa cuốn song ngang inox 304 khổ lớn 7.5m x 4.2m',
    motor: 'Mô tơ tải trọng 1000kg chuyên dụng TTTM',
    features: [
      'Nan inox 304 không gỉ sét sáng bóng',
      'Độ thông thoáng 85% trưng bày ngoài giờ',
      'Hệ thống tự dừng khi gặp chướng ngại vật',
      'Đạt chuẩn thẩm mỹ và an toàn PCCC TTTM'
    ],
    description: 'Thi công hoàn thiện hệ thống cửa cuốn lưới song ngang inox 304 cao cấp cho gian hàng thời trang tại trung tâm thương mại. Đảm bảo tầm nhìn thông thoáng cho sản phẩm trưng bày ngoài giờ làm việc kết hợp độ an toàn chống trộm tối đa, vận hành êm ái tiêu chuẩn quốc tế.'
  },
  {
    id: 'p2',
    title: 'Cửa Cuốn Khe Thoáng BossDoor Siêu Êm Biệt Thự Euro Village',
    category: 'Cửa cuốn khe thoáng',
    categoryKey: 'khe-thoang',
    image: '/project_1.png',
    location: 'Euro Village 1, Sơn Trà, Đà Nẵng',
    completedDate: '2024',
    scale: 'Bộ cửa rộng 5.2m x 3.6m hợp kim nhôm 6063-T6',
    motor: 'Mô tơ YH Đài Loan 600kg lõi đồng 100%',
    features: [
      'Công nghệ AI chống xô chống kẹt tự dừng',
      'Sơn tĩnh điện cao cấp AkzoNobel CHLB Đức',
      'Điều khiển đóng mở qua Smartphone từ xa',
      'Bình lưu điện thông minh UPS Boss dự phòng 72h'
    ],
    description: 'Lắp đặt cửa cuốn khe thoáng BossDoor tích hợp công nghệ AI chống xô tự dừng khi gặp vật cản, cảm biến báo khói, còi báo động chống cạy phá và bộ điều khiển thông minh qua Smartphone cho biệt thự cao cấp Euro Village Đà Nẵng.'
  },
  {
    id: 'p3',
    title: 'Cổng Mở Tự Động Âm Sàn Italia Biệt Thự Đảo Phúc Lộc Viên',
    category: 'Cổng tự động',
    categoryKey: 'cong-tu-dong',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    location: 'Phúc Lộc Viên, Sơn Trà, Đà Nẵng',
    completedDate: '2023',
    scale: 'Cổng sắt mỹ nghệ 2 cánh 900kg, motor âm sàn Italia',
    motor: 'Motor âm sàn Ditec/Beninca chuẩn IP67 kháng nước',
    features: [
      'Kháng nước ngập tuyệt đối IP67 chống ngập mùa mưa',
      'Góc mở rộng linh hoạt từ 110 đến 180 độ',
      'Remote điều khiển mã nhảy Rolling Code chống sao chép',
      'Tự ngắt an toàn khi có người hoặc vật cản ngang cổng'
    ],
    description: 'Hệ thống mô tơ âm sàn thủy lực Ditec/Beninca nhập khẩu nguyên chiếc từ Italia. Kháng nước ngập tuyệt đối mùa mưa lũ miền Trung, góc mở linh hoạt 110-180 độ, kết nối camera an ninh và nhận diện xe vào cổng.'
  },
  {
    id: 'p4',
    title: 'Cửa Cuốn Tấm Liền Thép Úc Siêu Êm Shophouse Nguyễn Văn Linh',
    category: 'Cửa cuốn tấm liền',
    categoryKey: 'tam-lien',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    location: 'Nguyễn Văn Linh, Hải Châu, Đà Nẵng',
    completedDate: '2024',
    scale: '3 bộ cửa cuốn tấm liền thép BlueScope Úc mặt tiền phố',
    motor: 'Mô tơ trong trục DC 24V siêu an toàn',
    features: [
      'Thân cửa thép tấm liền BlueScope siêu bền',
      'Dây polyguide giảm chấn triệt tiêu 99% tiếng ồn',
      'Tốc độ mở nhanh gấp 3 lần cửa truyền thống',
      'Chốt ly hợp cơ thoát hiểm bằng tay dễ dàng khi mất điện'
    ],
    description: 'Giải pháp bảo vệ cho dãy nhà phố kinh doanh shophouse trung tâm Đà Nẵng. Cửa vận hành siêu êm ái, tốc độ mở nhanh, tích hợp chốt ly hợp thoát hiểm khẩn cấp bằng tay chỉ mất 3 giây khi có sự cố hỏa hoạn.'
  },
  {
    id: 'p5',
    title: 'Cửa Kéo Công Nghệ Đức Sơn AkzoNobel Nhà Phố Hòa Xuân',
    category: 'Cửa kéo & Inox',
    categoryKey: 'cua-keo',
    image: '/about_door_1.png',
    location: 'Khu Đô Thị Sinh Thái Hòa Xuân, Cẩm Lệ, Đà Nẵng',
    completedDate: '2024',
    scale: 'Cửa kéo nhôm cao cấp không lá lấy sáng 95%, bề rộng 4.8m',
    motor: 'Kéo tay bạc đạn đôi siêu nhẹ',
    features: [
      'Thanh U đúc dày 1.4mm nhôm 6063 bền bỉ',
      'Bạc đạn đôi trượt nhẹ phụ nữ & người lớn tuổi đẩy êm',
      'Sơn tĩnh điện AkzoNobel chống ăn mòn gió muối biển',
      'Hệ nhíp đặc mạ kẽm không gỉ kết cấu chắc chắn'
    ],
    description: 'Gia công sản xuất và lắp đặt cửa kéo CN Đức thanh nhôm hợp kim bền bỉ, bạc đạn đôi vận hành êm nhẹ. Lớp sơn tĩnh điện bảo hành 10 năm không bong tróc trước thời tiết biển Đà Nẵng.'
  },
  {
    id: 'p6',
    title: 'Cửa Trượt Tự Động Mắt Thần Nabco Khách Sạn 4 Sao Mỹ Khê',
    category: 'Cửa tự động',
    categoryKey: 'cong-tu-dong',
    image: 'https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=1200&q=80',
    location: 'Võ Nguyên Giáp, Sơn Trà, Đà Nẵng',
    completedDate: '2023',
    scale: 'Cửa trượt 2 cánh kính cường lực 12mm Temper, ray nhôm 4.2m',
    motor: 'Hệ điều khiển vi xử lý Nabco Made in Japan',
    features: [
      'Cảm biến mắt thần hồng ngoại nhạy bén 3 cấp độ',
      'Cơ chế chống kẹt an toàn cho trẻ nhỏ và người già',
      'Độ ồn khi trượt dưới 45dB cực kỳ êm ái',
      'Kính cường lực 12mm viền inox bóng sang trọng'
    ],
    description: 'Hệ thống cửa tự động mắt thần hồng ngoại Nabco (Nhật Bản) cho sảnh đón khách sạn biển Mỹ Khê. Cảm biến nhận diện người từ xa nhạy bén, chống kẹt người qua lại an toàn tuyệt đối, độ ồn chuẩn khách sạn 4 sao.'
  },
  {
    id: 'p7',
    title: 'Cửa Cuốn Khe Thoáng Cách Âm 2 Lớp Biệt Thự FPT City',
    category: 'Cửa cuốn khe thoáng',
    categoryKey: 'khe-thoang',
    image: '/hero_building.png',
    location: 'Khu Đô Thị Công Nghệ FPT City, Ngũ Hành Sơn, Đà Nẵng',
    completedDate: '2024',
    scale: 'Bộ cửa cuốn khe thoáng siêu dày 1.6mm kích thước 5.8m x 4.0m',
    motor: 'Mô tơ xích kéo ngoài YH lõi đồng Đài Loan',
    features: [
      'Nan nhôm 2 lớp cách âm, cách nhiệt hiệu quả',
      'Hệ gioăng giảm chấn 2 chiều triệt tiêu rung lắc',
      'Hệ thống lưu điện Boss Smart UPS lưu trữ 72h',
      'Tự đảo chiều an toàn khi gặp chướng ngại vật'
    ],
    description: 'Công trình biệt thự cao cấp ven sông Cổ Cò. Nan nhôm 2 lớp cách âm cách nhiệt tốt, hệ gioăng giảm chấn 2 chiều triệt tiêu tiếng ồn khi đóng cửa. Hệ thống lưu điện Boss Smart UPS lưu trữ 72 giờ khi mất điện lưới.'
  },
  {
    id: 'p8',
    title: 'Cửa Kéo Inox 304 Cao Cấp Nhà Xưởng & Kho Vận KCN Hòa Khánh',
    category: 'Cửa kéo & Inox',
    categoryKey: 'cua-keo',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    location: 'KCN Hòa Khánh, Liên Chiểu, Đà Nẵng',
    completedDate: '2023',
    scale: 'Cửa kéo Inox SUS 304 toàn phần chiều ngang 8.5m x cao 4.5m',
    motor: 'Kéo tay bánh xe inox chịu lực công nghiệp',
    features: [
      'Gia công 100% Inox SUS 304 sáng bóng không gỉ sét',
      'Khung U đúc dày chịu lực gió bão miền Trung cấp 12',
      'Hệ thống khóa âm sàn chống cắt trộm an toàn',
      'Độ bền kết cấu trên 20 năm trong môi trường công nghiệp'
    ],
    description: 'Chế tác hoàn toàn từ Inox 304 chống ăn mòn hóa chất, không rỉ sét trong môi trường kho bãi sản xuất. Khung u và nhíp inox dày chịu lực gió bão miền Trung, khóa âm sàn chống cắt trộm an toàn.'
  },
  {
    id: 'p9',
    title: 'Cổng Mở Tự Động Cánh Tay Đòn Biệt Thự Sân Vườn Hội An',
    category: 'Cổng tự động',
    categoryKey: 'cong-tu-dong',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    location: 'Cẩm Châu, TP. Hội An, Quảng Nam',
    completedDate: '2024',
    scale: 'Cổng gỗ kết hợp khung thép mỹ thuật 2 cánh nặng 800kg',
    motor: 'Motor tay đòn điện tử 24V DC Italia',
    features: [
      'Motor tay đòn cơ điện 24V vận hành êm và an toàn',
      'Cơ chế tự khóa khi đóng kín không cần ổ khóa cơ',
      'Mở cổng 1 cánh cho người đi bộ hoặc 2 cánh cho ô tô',
      'Tích hợp điều khiển qua App điện thoại từ xa'
    ],
    description: 'Giải pháp cổng tự động tay đòn điện tử vận hành êm ái, cơ chế tự khóa khi cửa đóng kín không cần dùng thêm ổ khóa cơ. Kết nối bộ điều khiển qua App điện thoại mở cổng cho khách từ bất kỳ đâu.'
  }
];

const FILTER_TABS = [
  { key: 'all', label: 'Tất Cả Công Trình', icon: <Layers size={15} /> },
  { key: 'khe-thoang', label: 'Cửa Cuốn Khe Thoáng', icon: <Award size={15} /> },
  { key: 'tam-lien', label: 'Cửa Cuốn Tấm Liền', icon: <ShieldCheck size={15} /> },
  { key: 'cong-tu-dong', label: 'Cổng Tự Động', icon: <Sparkles size={15} /> },
  { key: 'cua-keo', label: 'Cửa Kéo & Inox', icon: <Ruler size={15} /> },
  { key: 'commercial', label: 'Dự Án TTTM & Showroom', icon: <Building2 size={15} /> }
];

export default function Projects() {
  const [projectsList, setProjectsList] = useState(SHOWCASE_PROJECTS);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  // Tải thêm dự án từ Backend API nếu Admin đã thêm dự án mới
  useEffect(() => {
    const fetchApiProjects = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${apiUrl}/api/projects`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          // Chuẩn hóa dữ liệu từ database
          const mappedApi = data.data.map((item, idx) => ({
            id: item._id || `api-${idx}`,
            title: item.title,
            category: item.category || 'Cửa cuốn',
            categoryKey: (item.category && item.category.toLowerCase().includes('cổng'))
              ? 'cong-tu-dong'
              : (item.category && item.category.toLowerCase().includes('kéo'))
              ? 'cua-keo'
              : (item.category && item.category.toLowerCase().includes('tấm liền'))
              ? 'tam-lien'
              : (item.category && (item.category.toLowerCase().includes('thương mại') || item.category.toLowerCase().includes('tttm')))
              ? 'commercial'
              : 'khe-thoang',
            image: formatImgSrc(item.image),
            location: item.location || 'Đà Nẵng',
            completedDate: item.completedDate || '2024',
            scale: 'Thi công theo kích thước khảo sát thực tế',
            motor: 'Đồng bộ linh kiện chính hãng',
            features: [
              'Vận hành êm ái, bền bỉ',
              'Linh kiện nhập khẩu chính hãng',
              'Bảo hành tận tâm 24/7'
            ],
            description: item.description || 'Công trình thi công lắp đặt hoàn thiện bởi đội ngũ kỹ thuật BOSS Đà Nẵng.'
          }));

          // Gộp các công trình từ Admin lên đầu danh sách
          setProjectsList([...mappedApi, ...SHOWCASE_PROJECTS]);
        }
      } catch (err) {
        console.warn('Projects API fetch error, fallback to showcase data:', err);
      }
    };

    fetchApiProjects();
  }, []);

  // Lọc theo Danh mục và Ô tìm kiếm
  const filteredProjects = useMemo(() => {
    return projectsList.filter((proj) => {
      const matchTab = activeTab === 'all' || proj.categoryKey === activeTab;
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchTab;

      const titleMatch = proj.title?.toLowerCase().includes(query);
      const catMatch = proj.category?.toLowerCase().includes(query);
      const locMatch = proj.location?.toLowerCase().includes(query);
      const descMatch = proj.description?.toLowerCase().includes(query);

      return matchTab && (titleMatch || catMatch || locMatch || descMatch);
    });
  }, [projectsList, activeTab, searchQuery]);

  const openModal = (proj) => {
    setSelectedProject(proj);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="projects-page-container">
      {/* 1. HERO HEADER */}
      <section className="projects-hero-banner">
        <div className="projects-hero-glow-1"></div>
        <div className="projects-hero-glow-2"></div>
        <div className="container projects-hero-content">
          <div className="projects-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <ChevronRight size={14} />
            <span>Công trình thực tế</span>
          </div>

          <h1 className="projects-main-title">
            CÔNG TRÌNH <span className="text-highlight">THỰC TẾ</span>
          </h1>

          <p className="projects-main-subtitle">
            Minh chứng chất lượng vượt trội qua hơn <strong>2.000+ công trình</strong> cửa cuốn, cửa kéo, 
            cổng tự động đã thi công hoàn thiện tại Đà Nẵng và các tỉnh miền Trung.
          </p>

          {/* KPI Mini Bar */}
          <div className="projects-kpi-bar">
            <div className="projects-kpi-item">
              <span className="kpi-num">
                <AnimatedCounter end={2000} suffix="+" />
              </span>
              <span className="kpi-lbl">Công trình hoàn thành</span>
            </div>
            <div className="projects-kpi-divider"></div>

            <div className="projects-kpi-item">
              <span className="kpi-num">
                <AnimatedCounter end={10} suffix="+" />
              </span>
              <span className="kpi-lbl">Năm kinh nghiệm</span>
            </div>
            <div className="projects-kpi-divider"></div>

            <div className="projects-kpi-item">
              <span className="kpi-num">100%</span>
              <span className="kpi-lbl">Khách hàng nghiệm thu hài lòng</span>
            </div>
            <div className="projects-kpi-divider"></div>

            <div className="projects-kpi-item">
              <span className="kpi-num">30 Phút</span>
              <span className="kpi-lbl">Khảo sát tận nơi miễn phí</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FILTER TABS & SEARCH BAR */}
      <section className="projects-filter-section">
        <div className="container">
          <div className="projects-filter-controls">
            {/* Filter Tabs */}
            <div className="projects-filter-pills">
              {FILTER_TABS.map((tab) => {
                const count = tab.key === 'all'
                  ? projectsList.length
                  : projectsList.filter(p => p.categoryKey === tab.key).length;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    className={`filter-pill-btn ${activeTab === tab.key ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    <span className="pill-icon">{tab.icon}</span>
                    <span className="pill-text">{tab.label}</span>
                    <span className="pill-count">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="projects-search-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm công trình: Sơn Trà, Euro Village, Hòa Xuân..."
                aria-label="Tìm kiếm công trình"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  title="Xóa tìm kiếm"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          <div className="projects-count-bar">
            <span>
              Đang hiển thị: <strong>{filteredProjects.length}</strong> công trình tiêu biểu
            </span>
            {searchQuery && (
              <span className="search-result-hint">
                (Kết quả khớp với: "{searchQuery}")
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 3. PROJECTS SHOWCASE GRID */}
      <section className="projects-grid-section">
        <div className="container">
          {filteredProjects.length === 0 ? (
            <div className="projects-empty-state">
              <Building2 size={48} className="empty-icon" />
              <h3>Không tìm thấy công trình phù hợp</h3>
              <p>Vui lòng thử từ khóa tìm kiếm khác hoặc chuyển danh mục công trình.</p>
              <button
                type="button"
                className="btn-reset-filter"
                onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
              >
                Xem tất cả công trình
              </button>
            </div>
          ) : (
            <div className="projects-modern-grid">
              {filteredProjects.map((proj, idx) => (
                <RevealOnScroll
                  key={proj.id || idx}
                  animation="fade-up"
                  delay={(idx % 3) * 100}
                  className="project-modern-card"
                >
                  {/* Card Image Wrapper */}
                  <div className="card-media-wrapper" onClick={() => openModal(proj)}>
                    <img
                      src={formatImgSrc(proj.image)}
                      alt={proj.title}
                      loading="lazy"
                      className="card-media-img"
                    />
                    <div className="card-media-overlay">
                      <span className="view-detail-badge">
                        <Eye size={16} /> Xem chi tiết công trình
                      </span>
                    </div>

                    {/* Category Tag */}
                    <div className="card-badge-category">
                      {proj.category}
                    </div>

                    {/* Completion Year */}
                    {proj.completedDate && (
                      <div className="card-badge-year">
                        <Calendar size={13} /> {proj.completedDate}
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="card-content-body">
                    {/* Location */}
                    <div className="card-location-row">
                      <MapPin size={15} className="location-pin" />
                      <span>{proj.location}</span>
                    </div>

                    {/* Title */}
                    <h3 className="card-project-title" onClick={() => openModal(proj)}>
                      {proj.title}
                    </h3>

                    {/* Scale Highlight */}
                    {proj.scale && (
                      <div className="card-scale-highlight">
                        <Ruler size={14} className="scale-icon" />
                        <span>{proj.scale}</span>
                      </div>
                    )}

                    {/* Description Snippet */}
                    <p className="card-description-snippet">
                      {proj.description}
                    </p>

                    {/* Card Features / Tags */}
                    {proj.features && proj.features.length > 0 && (
                      <div className="card-tags-row">
                        {proj.features.slice(0, 2).map((feat, fIdx) => (
                          <span key={fIdx} className="card-spec-chip">
                            <Check size={12} /> {feat}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Card Actions Footer */}
                    <div className="card-action-footer">
                      <button
                        type="button"
                        className="btn-card-details"
                        onClick={() => openModal(proj)}
                      >
                        <span>Chi tiết công trình</span>
                        <ArrowUpRight size={16} />
                      </button>

                      <a
                        href="tel:0904678323"
                        className="btn-card-call"
                        title="Tư vấn công trình tương tự: 0904.678.323"
                      >
                        <PhoneCall size={15} />
                      </a>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. REAL ON-SITE TECHNICAL GALLERY STRIP */}
      <section className="projects-gallery-section">
        <div className="container">
          <RevealOnScroll animation="fade-up">
            <div className="section-title-center">
              <span className="section-tag-gold">HÌNH ẢNH THỰC TẾ TẠI CÔNG TRƯỜNG</span>
              <h2>Đội Ngũ Kỹ Thuật BOSS Đà Nẵng Trực Tiếp Thi Công</h2>
              <p className="section-desc-center">
                Mỗi công trình đều được giám sát kỹ thuật nghiêm ngặt, thi công đúng bản vẽ và tiêu chuẩn an toàn cao nhất.
              </p>
            </div>
          </RevealOnScroll>

          <div className="onsite-gallery-grid">
            <RevealOnScroll animation="zoom-in" delay={100} className="onsite-gallery-card">
              <img src="/about_technician_install.jpg" alt="Kỹ thuật viên BOSS lắp đặt mô tơ trên giàn giáo" />
              <div className="onsite-gallery-caption">
                <strong>Lắp đặt trên cao an toàn</strong>
                <span>Kỹ thuật viên trang bị đầy đủ đai an toàn & bảo hộ lao động</span>
              </div>
            </RevealOnScroll>

            <RevealOnScroll animation="zoom-in" delay={200} className="onsite-gallery-card">
              <img src="/about_construction.jpg" alt="Hoàn thiện lắp đặt cửa cuốn TTTM Aeon Mall" />
              <div className="onsite-gallery-caption">
                <strong>Thi công hệ thống TTTM</strong>
                <span>Nghiệm thu song ngang inox khổ lớn tại Aeon Mall Đà Nẵng</span>
              </div>
            </RevealOnScroll>

            <RevealOnScroll animation="zoom-in" delay={300} className="onsite-gallery-card">
              <img src="/about_meeting.jpg" alt="Họp triển khai lịch lắp đặt công trình trong tuần" />
              <div className="onsite-gallery-caption">
                <strong>Kế hoạch thi công chi tiết</strong>
                <span>Phân công kỹ thuật viên theo từng tuyến đường & công trình</span>
              </div>
            </RevealOnScroll>

            <RevealOnScroll animation="zoom-in" delay={400} className="onsite-gallery-card">
              <img src="/factory_worker.png" alt="Xưởng gia công chế tác cửa cuốn BOSS" />
              <div className="onsite-gallery-caption">
                <strong>Gia công chuẩn xác tại xưởng</strong>
                <span>Hệ thống máy cắt, dập nan nhôm công nghệ CNC độ chính xác 100%</span>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* 5. WORKFLOW 5-STEP PROCESS */}
      <section className="projects-workflow-section">
        <div className="container">
          <RevealOnScroll animation="fade-up">
            <div className="section-title-center">
              <span className="section-tag-gold">QUY TRÌNH THI CÔNG</span>
              <h2>5 Bước Lắp Đặt Công Trình Tiêu Chuẩn BOSS Đà Nẵng</h2>
              <p className="section-desc-center">
                Cam kết thi công chuẩn kỹ thuật, đúng tiến độ bàn giao và an toàn tuyệt đối.
              </p>
            </div>
          </RevealOnScroll>

          <div className="workflow-steps-flex">
            <div className="workflow-step-box">
              <div className="step-badge-num">1</div>
              <div className="step-icon-wrap"><Ruler size={24} /></div>
              <h4>Khảo Sát & Đo Đạc</h4>
              <p>Có mặt sau 30 phút, đo đạc kích thước thực tế và kiểm tra kết cấu công trình hoàn toàn miễn phí.</p>
            </div>

            <div className="workflow-step-arrow">➔</div>

            <div className="workflow-step-box">
              <div className="step-badge-num">2</div>
              <div className="step-icon-wrap"><Award size={24} /></div>
              <h4>Tư Vấn & Lên Bản Vẽ</h4>
              <p>Tư vấn cấu hình vật liệu (độ dày nan, công suất mô tơ, lưu điện) tối ưu chi phí cho từng mặt bằng.</p>
            </div>

            <div className="workflow-step-arrow">➔</div>

            <div className="workflow-step-box">
              <div className="step-badge-num">3</div>
              <div className="step-icon-wrap"><Wrench size={24} /></div>
              <h4>Sản Xuất & Lắp Đặt</h4>
              <p>Gia công tại xưởng theo đúng kích thước, đội ngũ thợ lành nghề thi công nhanh chóng, an toàn.</p>
            </div>

            <div className="workflow-step-arrow">➔</div>

            <div className="workflow-step-box">
              <div className="step-badge-num">4</div>
              <div className="step-icon-wrap"><ShieldCheck size={24} /></div>
              <h4>Chạy Thử Cảm Biến</h4>
              <p>Kiểm tra nghiêm ngặt hệ thống chống xô, tự đảo chiều, còi báo động và tính năng điều khiển điện thoại.</p>
            </div>

            <div className="workflow-step-arrow">➔</div>

            <div className="workflow-step-box">
              <div className="step-badge-num">5</div>
              <div className="step-icon-wrap"><CheckCircle2 size={24} /></div>
              <h4>Nghiệm Thu & Bảo Hành</h4>
              <p>Bàn giao chìa khóa, hướng dẫn sử dụng chi tiết và kích hoạt thẻ bảo hành chính hãng tận nơi 24/7.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION CONSULTATION CARD */}
      <section className="projects-cta-section">
        <div className="container">
          <div className="projects-cta-card">
            <div className="cta-left-content">
              <span className="cta-badge">TƯ VẤN & KHẢO SÁT TẬN NƠI</span>
              <h2>Bạn Cần Giải Pháp Cửa Chuẩn Xác Cho Công Trình Của Mình?</h2>
              <p>
                Đội ngũ kỹ thuật BOSS Đà Nẵng sẵn sàng đến trực tiếp công trình của bạn trong vòng 
                <strong> 30 phút</strong> để khảo sát mặt bằng, đo đạc thông số và gửi báo giá tối ưu nhất.
              </p>
              <div className="cta-features-list">
                <div className="cta-feat-item">
                  <CheckCircle2 size={18} className="feat-check" />
                  <span>Khảo sát, tư vấn mẫu mã tận nhà miễn phí 100%</span>
                </div>
                <div className="cta-feat-item">
                  <CheckCircle2 size={18} className="feat-check" />
                  <span>Báo giá minh bạch, cam kết không phát sinh chi phí</span>
                </div>
                <div className="cta-feat-item">
                  <CheckCircle2 size={18} className="feat-check" />
                  <span>Bảo hành motor và thân cửa chính hãng lên đến 5 năm</span>
                </div>
              </div>
            </div>

            <div className="cta-right-actions">
              <div className="cta-hotline-box">
                <span className="hotline-sub">Hotline Kỹ Thuật & Khảo Sát 24/7</span>
                <a href="tel:0904678323" className="hotline-main-number">
                  <PhoneCall size={26} /> 0904.678.323
                </a>
                <span className="hotline-note">(Hỗ trợ tất cả các quận Đà Nẵng & Quảng Nam)</span>
              </div>

              <div className="cta-buttons-group">
                <a
                  href="https://zalo.me/0904678323"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-cta-zalo"
                >
                  <MessageCircle size={18} />
                  <span>Chat Zalo Nhận Báo Giá</span>
                </a>

                <Link to="/lien-he" className="btn-cta-contact">
                  <span>Gửi Yêu Cầu Khảo Sát</span>
                  <ArrowUpRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. MODAL CHI TIẾT CÔNG TRÌNH */}
      {selectedProject && (
        <div className="project-detail-modal-overlay" onClick={closeModal}>
          <div className="project-detail-modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-button"
              onClick={closeModal}
              aria-label="Đóng chi tiết công trình"
            >
              <X size={22} />
            </button>

            <div className="modal-scroll-inner">
              {/* Modal Image Header */}
              <div className="modal-image-holder">
                <img
                  src={formatImgSrc(selectedProject.image)}
                  alt={selectedProject.title}
                  className="modal-banner-img"
                />
                <div className="modal-category-pill">
                  {selectedProject.category}
                </div>
              </div>

              {/* Modal Body Info */}
              <div className="modal-body-content">
                <div className="modal-meta-row">
                  <span className="meta-item">
                    <MapPin size={16} /> <strong>Địa điểm:</strong> {selectedProject.location}
                  </span>
                  {selectedProject.completedDate && (
                    <span className="meta-item">
                      <Calendar size={16} /> <strong>Năm bàn giao:</strong> {selectedProject.completedDate}
                    </span>
                  )}
                </div>

                <h2 className="modal-project-title">
                  {selectedProject.title}
                </h2>

                {/* Scale & Technical Specs */}
                <div className="modal-specs-box">
                  <h4>Thông Số Kỹ Thuật & Cấu Hình Lắp Đặt:</h4>
                  <ul>
                    {selectedProject.scale && (
                      <li>
                        <strong>Quy mô / Kích thước:</strong> {selectedProject.scale}
                      </li>
                    )}
                    {selectedProject.motor && (
                      <li>
                        <strong>Động cơ & Điều khiển:</strong> {selectedProject.motor}
                      </li>
                    )}
                    {selectedProject.features && selectedProject.features.map((feat, fIdx) => (
                      <li key={fIdx}>
                        <strong>Tính năng:</strong> {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Description */}
                <div className="modal-desc-box">
                  <h4>Mô Tả Quá Trình Thi Công:</h4>
                  <p>{selectedProject.description}</p>
                </div>

                {/* Modal CTA Footer */}
                <div className="modal-cta-footer">
                  <div className="modal-cta-text">
                    <strong>Bạn muốn lắp đặt giải pháp tương tự cho công trình của mình?</strong>
                    <span>Liên hệ ngay kỹ sư BOSS Đà Nẵng để được khảo sát thực tế miễn phí</span>
                  </div>
                  <div className="modal-cta-actions">
                    <a href="tel:0904678323" className="btn-modal-call">
                      <PhoneCall size={18} /> Gọi Ngay: 0904.678.323
                    </a>
                    <a
                      href="https://zalo.me/0904678323"
                      target="_blank"
                      rel="noreferrer"
                      className="btn-modal-zalo"
                    >
                      <MessageCircle size={18} /> Chat Zalo
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
