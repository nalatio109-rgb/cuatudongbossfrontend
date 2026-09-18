import React from "react";
import { ShieldCheck, Cpu, CircleDollarSign, Headphones, Phone } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";

export default function WhyChooseUs() {
  const reasons = [
    {
      icon: <ShieldCheck size={28} strokeWidth={1.8} />,
      title: "SẢN PHẨM CHẤT LƯỢNG",
      text: "Cam kết nhập khẩu chính hãng 100%, độ bền vượt thời gian đạt tiêu chuẩn Châu Âu.",
    },
    {
      icon: <Cpu size={28} strokeWidth={1.8} />,
      title: "CÔNG NGHỆ HIỆN ĐẠI",
      text: "Vận hành siêu êm ái, chống sao chép mã khoá, điều khiển thông minh qua Smartphone.",
    },
    {
      icon: <CircleDollarSign size={28} strokeWidth={1.8} />,
      title: "GIÁ CẢ CẠNH TRANH",
      text: "Báo giá minh bạch, hợp lý trực tiếp từ nhà sản xuất không qua trung gian.",
    },
    {
      icon: <Headphones size={28} strokeWidth={1.8} />,
      title: "DỊCH VỤ TẬN TÂM",
      text: "Khảo sát tận nơi miễn phí, thi công chuẩn tiến độ, bảo hành bảo trì uy tín dài hạn.",
    },
  ];

  return (
    <section className="why-section" id="about">
      <div className="container">
        {/* Header section */}
        <div className="why-header-flex">
          <div className="why-title-group">
            <div className="why-subtitle">
              <span>GIÁ TRỊ VƯỢT TRỘI</span>
              <div className="subtitle-line"></div>
            </div>
            <h2 className="why-main-title">
              VÌ SAO CHỌN <span className="text-gold">BOSS</span>?
            </h2>
          </div>
          <p className="why-header-desc">
            Tự hào là đơn vị uy tín hàng đầu cung cấp giải pháp Cửa Cuốn, Cửa Tự Động & Nhôm Kính Cao Cấp với cam kết chất lượng vượt trội.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="why-features-grid">
          {reasons.map((reason, index) => (
            <RevealOnScroll
              key={index}
              animation="fade-up"
              delay={index * 100}
              className="why-feature-card"
            >
              <div className="why-card-icon-box">
                {reason.icon}
              </div>
              <h3>{reason.title}</h3>
              <p>{reason.text}</p>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

