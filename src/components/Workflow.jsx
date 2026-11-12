import React from "react";
import { Ruler, Sliders, HardHat, ShieldCheck, KeyRound, ArrowRight } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";

export default function Workflow() {
  const workflowSteps = [
    {
      step: "01",
      icon: <Ruler size={26} />,
      title: "KHẢO SÁT & ĐO ĐẠC",
      desc: "Khảo sát vị trí, đo đạc thực tế miễn phí",
    },
    {
      step: "02",
      icon: <Sliders size={26} />,
      title: "TƯ VẤN CẤU HÌNH",
      desc: "Tư vấn vật liệu & cấu hình tối ưu cho từng mặt bằng",
    },
    {
      step: "03",
      icon: <HardHat size={26} />,
      title: "THI CÔNG TIẾN ĐỘ",
      desc: "Thi công đúng tiến độ, đảm bảo an toàn công trình",
    },
    {
      step: "04",
      icon: <ShieldCheck size={26} />,
      title: "CHẠY THỬ & KIỂM TRA",
      desc: "Kiểm tra nghiêm ngặt hệ thống cảm biến an toàn",
    },
    {
      step: "05",
      icon: <KeyRound size={26} />,
      title: "NGHIỆM THU & BÀN GIAO",
      desc: "Nghiệm thu, bàn giao & hướng dẫn sử dụng chi tiết",
    },
  ];

  return (
    <section className="workflow-section" id="workflow">
      <div className="container">
        <RevealOnScroll animation="fade-up">
          <div className="workflow-header-center">
            <div className="section-subtitle">
              <span>QUY TRÌNH LẮP ĐẶT 5 BƯỚC</span>
              <div className="subtitle-line"></div>
            </div>
            <h2>
              AN TÂM TUYỆT ĐỐI <br className="workflow-title-br" />
              <span className="workflow-phrase-nowrap">VỚI BOSS ĐÀ NẴNG</span>
            </h2>
          </div>
        </RevealOnScroll>

        <div className="workflow-grid">
          {workflowSteps.map((step, index) => (
            <React.Fragment key={index}>
              <RevealOnScroll
                animation="zoom-in"
                delay={index * 120}
                className="workflow-step"
              >
                <div className="workflow-icon-wrapper">
                  <div className="workflow-icon">{step.icon}</div>
                  <span className="step-number-badge">{step.step}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </RevealOnScroll>
              {index < workflowSteps.length - 1 && (
                <div className="workflow-connector">
                  <div className="dotted-line"></div>
                  <ArrowRight size={16} className="connector-arrow" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

