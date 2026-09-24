import React, { useState } from 'react';
import {
  Phone, Calendar, ArrowRight, Shield, Clock, MapPin, CheckCircle2,
  Send, Wrench, Search, X, ChevronRight, FileText, Headphones, Tag
} from 'lucide-react';
import './Services.css';
import RevealOnScroll from '../components/RevealOnScroll';

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    district: 'Quận Hải Châu',
    service: 'Sửa chữa cửa cuốn 24/24',
    note: ''
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.name,
          phone: formData.phone,
          productCategory: `Dịch Vụ: ${formData.service} (${formData.district})`,
          message: formData.note || 'Yêu cầu tư vấn dịch vụ tận nơi'
        })
      });
      const data = await res.json();
      if (data.success) {
        setFormSubmitted(true);
      }
    } catch (err) {
      console.error('Submit service form error:', err);
    }
  };

  // Exact Services items from trungtamhethongcua293.com
  const servicesData = [
    {
      id: 1,
      title: 'CÁCH CHỐNG BÃO CHO CỬA CUỐN HIỆU QUẢ',
      date: '18/10/2024',
      img: '/service_repair_247.png',
      desc: 'Trong thời gian gần đây mưa bão thường xuyên xảy ra ở khắp nơi trên cả nước, đặc biệt là các tỉnh miền Trung gây ra nguy cơ xô kẹt, móp nan cửa cuốn. Hướng dẫn các giải pháp gia cố nan, khóa xích an toàn chống bão hiệu quả.',
      content: `Trong thời gian gần me mưa bão thường xuyên xảy ra ở các tỉnh miền Trung. Cửa cuốn là lá chắn đầu tiên bảo vệ toàn bộ tài sản ngôi nhà. Để đảm bảo an toàn tối đa khi xảy ra dông bão:
      1. Đóng kín hoàn toàn hệ thống cửa, không để khe hở gió lùa.
      2. Kiểm tra bộ lưu điện (UPS) đảm bảo luôn đủ dung lượng hoạt động khi cúp điện.
      3. Lắp thêm bộ chống xô nan, thanh V gia cố khung ray chịu lực gió bão.
      4. Ngắt cầu giao điện chính nếu nước ngập sâu để tránh chập cháy bo mạch.`
    },
    {
      id: 2,
      title: 'SỬA CHỮA CỬA CUỐN 24/24 TẠI ĐÀ NẴNG - HOTLINE 0904.678.323',
      date: '19/10/2022',
      img: '/service_technician.png',
      desc: 'Dịch vụ sửa chữa, bảo trì, bảo dưỡng cửa cuốn tại Đà Nẵng NHANH CHÓNG - UY TÍN - NHIỆT TÌNH. Đội ngũ thợ trực ca 24/7 tại 7 quận huyện có mặt sau 15-30 phút.',
      content: `BOSS Đà Nẵng chuyên cung cấp dịch vụ sửa chữa cửa cuốn khẩn cấp 24/7:
      - Xử lý kẹt nan cửa, đứt lá nan, bung rãnh ray.
      - Thay mới mô tơ lõi đồng chính hãng bảo hành 24-36 tháng.
      - Sửa bo mạch điều khiển, thay tụ điện, thay hành trình mô tơ lấy ngay.
      - Cài thêm chìa điều khiển remote mã nhảy Rolling Code chống phá mã.
      - Thay ắc quy lưu điện khô chính hãng giá gốc.`
    },
    {
      id: 3,
      title: 'CÔNG TRÌNH SỬA CHỮA ĐÃ THỰC HIỆN (HOTLINE 0904.678.323)',
      date: '17/10/2024',
      img: '/project_1.png',
      desc: 'Sửa chữa cửa cuốn là một việc quan trọng, đặc biệt là khi cửa bị hỏng hoặc gặp sự cố khẩn cấp. Tổng hợp các dự án thực tế BOSS Đà Nẵng đã thi công phục vụ hàng ngàn khách hàng.',
      content: `Hình ảnh thực tế các công trình sửa chữa, cứu hộ cửa cuốn & cổng tự động tại Hải Châu, Sơn Trà, Thanh Khê, Liên Chiểu... Chúng tôi cam kết báo giá niêm yết trước khi làm, thay thế linh kiện CO/CQ chính hãng và dán tem bảo hành tận nhà.`
    },
    {
      id: 4,
      title: 'CỬA KÉO - CÁC LỖI THƯỜNG GẶP VÀ CÁCH KHẮC PHỤC, BÁO GIÁ SỬA CHỮA',
      date: '25/10/2024',
      img: '/hero_bg.png',
      desc: 'Cửa kéo Đài Loan, cửa kéo inox thường gặp các lỗi nặng tay, trật đường ray, đứt nhíp. Hướng dẫn tự kiểm tra và bảng giá sửa chữa cửa kéo tận nơi.',
      content: `Các sự cố thường gặp trên cửa kéo Đài Loan / Đức & cách khắc phục:
      - Cửa kéo bị nặng, rít khi đẩy: Do bụi bẩn bám rãnh V hoặc bánh xe đạn bạc hỏng -> Thay bánh xe bạc đạn mới.
      - Nhíp cửa kéo bị đứt, cong vênh: Thay thế thanh nhíp mới chịu lực cao.
      - Cử bị lệch ray, khó khóa chìa: Khảo sát cân chỉnh khung ray và thay ổ khóa cửa kéo an toàn.`
    },
    {
      id: 5,
      title: 'PHỤ KIỆN CỬA CUỐN TỰ ĐỘNG CHÍNH HÃNG',
      date: '18/07/2019',
      img: '/factory_worker.png',
      desc: 'Cung cấp đầy đủ phụ kiện cửa cuốn: Mô tơ, bình lưu điện UPS, bộ điều khiển qua điện thoại Wi-Fi/4G, cảm biến tự dừng, còi báo động chống trộm.',
      content: `BOSS Đà Nẵng phân phối sỉ lẻ phụ kiện cửa cuốn chính hãng 100%:
      - Mô tơ YH, Austdoor, BossDoor, S68 lõi đồng chịu tải 300kg - 1500kg.
      - Bình lưu điện UPS 800kg - 1200kg thời gian chờ 48h - 72h.
      - Bộ điều khiển cửa cuốn qua Smartphone bảo mật cao.
      - Cảm biến đảo chiều khi gặp vật cản bảo vệ trẻ nhỏ & ô tô.`
    },
    {
      id: 6,
      title: 'GIỚI THIỆU VỀ SẢN PHẨM CỬA CUỐN CÔNG NGHỆ ĐỨC',
      date: '18/07/2019',
      img: '/about_door_1.png',
      desc: 'Cửa cuốn khe thoáng công nghệ Đức làm từ hợp kim nhôm cao cấp 6063-T5, sơn tĩnh điện ngoài trời CHLB Đức bảo hành 10 năm không phai màu.',
      content: `Ưu điểm vượt trội của dòng Cửa Cuốn Khe Thoáng Công Nghệ Đức:
      - Chất liệu nhôm hợp kim định hình cao cấp chịu lực va đập lớn.
      - Thiết kế lỗ khe thoáng linh hoạt giúp đón gió và ánh sáng tự nhiên.
      - Kết hợp ron giảm chấn siêu êm giúp triệt tiêu 95% tiếng ồn khi đóng mở.
      - Tích hợp công nghệ chống sao chép chìa khoá mã nhảy an toàn tuyệt đối.`
    },
    {
      id: 7,
      title: 'LẮP ĐẶT CỬA CUỐN TẠI ĐÀ NẴNG – HUẾ – QUẢNG NAM',
      date: '18/07/2019',
      img: '/service_technician.png',
      desc: 'Dịch vụ tư vấn, thiết kế và thi công lắp đặt cửa cuốn trọn gói tại Đà Nẵng, Huế, Quảng Nam. Báo giá cạnh tranh, khảo sát tận nơi miễn phí 100%.',
      content: `BOSS Đà Nẵng tiếp nhận thi công lắp đặt cửa cuốn tại miền Trung:
      - Khảo sát đo đạc mặt bằng miễn phí trong 30 phút.
      - Tư vấn mẫu nan cửa cuốn khe thoáng, cửa cuốn tấm liền phù hợp kiến trúc.
      - Đội ngũ kỹ thuật viên >10 năm kinh nghiệm lắp đặt chuẩn xác.
      - Cam kết bảo hành nan cửa 5 năm, mô tơ 24-36 tháng tận nơi.`
    },
    {
      id: 8,
      title: 'LẮP ĐẶT CỬA KÉO TẠI ĐÀ NẴNG – HUẾ – QUẢNG NAM',
      date: '25/07/2019',
      img: '/project_1.png',
      desc: 'Thi công lắp đặt cửa kéo Đài Loan có lá, cửa kéo không lá, cửa kéo inox cao cấp cho nhà phố, ki-ốt, nhà xưởng giá rẻ tận gốc.',
      content: `Dịch vụ lắp đặt cửa kéo chất lượng cao:
      - Sử dụng tole mạ màu nhập khẩu Đài Loan độ bền vượt trội.
      - Nhíp ép thủy lực chắc chắn, sơn tĩnh điện chống gỉ sét.
      - Bánh xe đạn bạc vận hành êm ái, kéo đẩy nhẹ nhàng.`
    }
  ];

  return (
    <div className="boss-services-page site-293-style">

      {/* 1. TOP BANNER HEADER */}
      <div className="site293-top-banner">
        <div className="banner-overlay"></div>
        <div className="container relative-z">
          <RevealOnScroll animation="fade-down" className="banner-text-box">
            <h1>DỊCH VỤ BOSS ĐÀ NẴNG</h1>
            <p>Hệ thống thi công, lắp đặt & sửa chữa cửa cuốn, cửa kéo, cổng tự động chuyên nghiệp 24/7</p>
          </RevealOnScroll>
        </div>
      </div>

      {/* 2. BREADCRUMB */}
      <div className="site293-breadcrumb">
        <div className="container">
          <a href="/" title="Trang chủ">Trang chủ <ChevronRight size={14} /></a>
          <span className="current-page">Dịch vụ</span>
        </div>
      </div>

      {/* 3. MAIN SERVICES LIST SECTION */}
      <main className="site293-main-content section-space">
        <div className="container">

          {/* Title Box */}
          <RevealOnScroll animation="fade-left" className="site293-title-box">
            <h2>Dịch vụ</h2>
            <div className="title-underline"></div>
          </RevealOnScroll>

          {/* Service Cards Grid (3 Columns) with Staggered Fade-Up Animations */}
          <div className="site293-news-grid">
            {servicesData.map((item, index) => (
              <RevealOnScroll
                key={item.id}
                animation="fade-up"
                delay={(index % 3) * 120}
                duration={650}
              >
                <div className="site293-news-card">
                  <div className="img-article-wrap">
                    <img src={item.img} alt={item.title} />
                    <span className="sp-date">
                      <Calendar size={13} /> {item.date}
                    </span>
                  </div>
                  <div className="nd-article">
                    <h3 className="title-article">
                      <button onClick={() => setSelectedService(item)}>
                        {item.title}
                      </button>
                    </h3>
                    <div className="body-content">
                      {item.desc}
                    </div>
                    <button
                      className="btn-readmore-293"
                      onClick={() => setSelectedService(item)}
                    >
                      Xem chi tiết <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>

        </div>
      </main>

      {/* 4. DETAIL MODAL POPUP */}
      {selectedService && (
        <div className="site293-modal-overlay" onClick={() => setSelectedService(null)}>
          <div className="site293-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedService(null)}>
              <X size={22} />
            </button>
            <div className="modal-header">
              <span className="modal-date"><Calendar size={14} /> Ngày đăng: {selectedService.date}</span>
              <h2>{selectedService.title}</h2>
            </div>
            <div className="modal-img-wrap">
              <img src={selectedService.img} alt={selectedService.title} />
            </div>
            <div className="modal-body-text">
              <p className="modal-desc">{selectedService.desc}</p>
              <div className="modal-detail-content">
                {selectedService.content.split('\n').map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <a href="tel:0904678323" className="btn-modal-call">
                <Phone size={16} /> GỌI THỢ NGAY: 0904.678.323
              </a>
              <button className="btn-modal-close" onClick={() => setSelectedService(null)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. QUICK BOOKING FORM SECTION */}
      <section className="site293-booking-section" id="quote-form-section">
        <div className="container">
          <RevealOnScroll animation="zoom-in" className="site293-form-card">
            <div className="form-card-title text-center">
              <span>ĐẶT LỊCH KHẢO SÁT & SỬA CỬA TẬN NƠI</span>
              <h3>Đội ngũ kỹ thuật BOSS Đà Nẵng hỗ trợ sau 15-30 phút</h3>
            </div>

            {formSubmitted ? (
              <div className="booking-success-box text-center">
                <CheckCircle2 size={56} className="text-emerald" style={{ margin: '0 auto 1rem' }} />
                <h3>GỬI YÊU CẦU THÀNH CÔNG!</h3>
                <p>Kỹ thuật viên BOSS Đà Nẵng sẽ liên hệ lại cho bạn ngay lập tức.</p>
                <button className="btn-brand-red" onClick={() => setFormSubmitted(false)}>
                  GỬI YÊU CẦU KHÁC
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="site293-real-form">
                <div className="form-row-grid">
                  <div className="form-group-item">
                    <label>Họ và tên của bạn *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Anh Hoàng - Hải Châu"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group-item">
                    <label>Số điện thoại liên hệ *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Nhập SĐT của bạn..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row-grid">
                  <div className="form-group-item">
                    <label>Quận/Huyện tại Đà Nẵng</label>
                    <select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    >
                      <option value="Quận Hải Châu">Quận Hải Châu</option>
                      <option value="Quận Thanh Khê">Quận Thanh Khê</option>
                      <option value="Quận Sơn Trà">Quận Sơn Trà</option>
                      <option value="Quận Ngũ Hành Sơn">Quận Ngũ Hành Sơn</option>
                      <option value="Quận Liên Chiểu">Quận Liên Chiểu</option>
                      <option value="Quận Cẩm Lệ">Quận Cẩm Lệ</option>
                      <option value="Huyện Hòa Vang">Huyện Hòa Vang</option>
                    </select>
                  </div>

                  <div className="form-group-item">
                    <label>Dịch vụ cần tư vấn / sửa chữa</label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    >
                      <option value="Sửa chữa cửa cuốn 24/24">Sửa chữa cửa cuốn 24/24</option>
                      <option value="Lắp đặt cửa cuốn tại Đà Nẵng">Lắp đặt cửa cuốn tại Đà Nẵng</option>
                      <option value="Lắp đặt cửa kéo Đài Loan">Lắp đặt cửa kéo Đài Loan</option>
                      <option value="Sửa chữa cửa kéo, thay nhíp, đạn bạc">Sửa chữa cửa kéo, thay nhíp, đạn bạc</option>
                      <option value="Bảo trì phụ kiện, thay remote, bình UPS">Bảo trì phụ kiện, thay remote, bình UPS</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-item">
                  <label>Ghi chú hoặc mô tả tình trạng hư hỏng</label>
                  <textarea
                    rows="3"
                    placeholder="Nhập chi tiết yêu cầu..."
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  ></textarea>
                </div>

                <div className="text-center" style={{ marginTop: '1.5rem' }}>
                  <button type="submit" className="btn-brand-red">
                    <Send size={18} /> GỬI YÊU CẦU TƯ VẤN NGAY
                  </button>
                </div>
              </form>
            )}
          </RevealOnScroll>
        </div>
      </section>


    </div>
  );
};

export default Services;

