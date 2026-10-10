import React from "react";
import { ShieldCheck, Cpu, CircleDollarSign, Headphones } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";

export default function WhyChooseUs() {
  const reasons = [
    {
      icon: <ShieldCheck size={22} strokeWidth={2} />,
      title: "Chất lượng đảm bảo",
      text: "Sản phẩm rõ nguồn gốc, bền bỉ theo thời gian.",
    },
    {
      icon: <Cpu size={22} strokeWidth={2} />,
      title: "Công nghệ hiện đại",
      text: "Vận hành tiện lợi, an toàn và thông minh.",
    },
    {
      icon: <CircleDollarSign size={22} strokeWidth={2} />,
      title: "Giá thành hợp lý",
      text: "Tối ưu chi phí theo nhu cầu công trình.",
    },
    {
      icon: <Headphones size={22} strokeWidth={2} />,
      title: "Hỗ trợ tận tâm",
      text: "Tư vấn, lắp đặt và bảo hành chu đáo.",
    },
  ];

  return (
    <section className="why-section" id="about">
      <div className="container">
        <div className="why-header-centered">
          <RevealOnScroll animation="fade-up">
            <div className="why-subtitle justify-center">
              <span>GIÁ TRỊ VƯỢT TRỘI</span>
            </div>
            <h2 className="why-main-title text-center">
              VÌ SAO CHỌN <span style={{ color: "#f5bd20" }}>BOSS</span>?
            </h2>
            <p className="why-header-desc text-center">
              Giải pháp cửa chất lượng cho mọi công trình.
            </p>
          </RevealOnScroll>
        </div>

        <div className="why-grid">
          {reasons.map((reason, index) => (
            <RevealOnScroll
              key={index}
              animation={index % 2 === 0 ? "fade-left" : "fade-right"}
              delay={index > 1 ? 150 : 0}
              className="why-grid-item"
            >
              <div className="why-grid-icon">
                {reason.icon}
              </div>
              <div className="why-grid-content">
                <h3>{reason.title}</h3>
                <p>{reason.text}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

