import React from "react";
import { ShieldCheck, Cpu, CircleDollarSign, Headphones, Award, Sparkles, CheckCircle2 } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";

export default function WhyChooseUs() {
  const reasons = [
    {
      number: "01",
      icon: <ShieldCheck size={26} strokeWidth={1.8} />,
      badge: "ĐẠT CHUẨN EU",
      title: "SẢN PHẨM CHẤT LƯỢNG",
      text: "Cam kết nhập khẩu chính hãng 100%, độ bền vượt thời gian đạt tiêu chuẩn Châu Âu cao cấp.",
    },
    {
      number: "02",
      icon: <Cpu size={26} strokeWidth={1.8} />,
      badge: "CÔNG NGHỆ 4.0",
      title: "CÔNG NGHỆ HIỆN ĐẠI",
      text: "Vận hành siêu êm ái, chống sao chép mã khoá, điều khiển thông minh qua Smartphone.",
    },
    {
      number: "03",
      icon: <CircleDollarSign size={26} strokeWidth={1.8} />,
      badge: "TỪ NHÀ SẢN XUẤT",
      title: "GIÁ CẢ CẠNH TRANH",
      text: "Báo giá minh bạch, trực tiếp từ kho nhà sản xuất, tối ưu chi phí không qua trung gian.",
    },
    {
      number: "04",
      icon: <Headphones size={26} strokeWidth={1.8} />,
      badge: "HỖ TRỢ 24/7",
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
              <Sparkles size={14} className="subtitle-icon" />
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

        {/* 4 Feature Cards Grid - Custom Architectural Style */}
        <div className="why-features-grid">
          {reasons.map((reason, index) => (
            <RevealOnScroll
              key={index}
              animation="fade-up"
              delay={index * 100}
              className="why-feature-card"
            >
              <div className="why-card-top">
                <div className="why-card-icon-ring">
                  {reason.icon}
                </div>
                <span className="why-card-number">{reason.number}</span>
              </div>

              <div className="why-card-badge">{reason.badge}</div>

              <h3 className="why-card-title">{reason.title}</h3>
              <p className="why-card-text">{reason.text}</p>
              
              <div className="why-card-footer">
                <span className="why-card-check">
                  <CheckCircle2 size={15} /> Cam kết BOSS
                </span>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

