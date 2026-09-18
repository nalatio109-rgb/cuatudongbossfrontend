import React from "react";
import { MessageSquare, ClipboardList, FileSignature, Settings, ShieldCheck, ArrowRight } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";

export default function Workflow() {
  const workflowSteps = [
    {
      step: "01",
      icon: <MessageSquare size={26} />,
      title: "TIẾP NHẬN YÊU CẦU",
      desc: "Lắng nghe nhu cầu & tư vấn giải pháp tối ưu nhất",
    },
    {
      step: "02",
      icon: <ClipboardList size={26} />,
      title: "KHẢO SÁT & BÁO GIÁ",
      desc: "Khảo sát thực tế công trình & báo giá minh bạch",
    },
    {
      step: "03",
      icon: <FileSignature size={26} />,
      title: "KÝ KẾT HỢP ĐỒNG",
      desc: "Thống nhất phương án & tiến hành ký kết",
    },
    {
      step: "04",
      icon: <Settings size={26} />,
      title: "THI CÔNG LẮP ĐẶT",
      desc: "Thi công nhanh chóng, chuẩn quy trình kỹ thuật",
    },
    {
      step: "05",
      icon: <ShieldCheck size={26} />,
      title: "NGHIỆM THU & BẢO HÀNH",
      desc: "Nghiệm thu bàn giao & bảo hành dài hạn 24/7",
    },
  ];

  return (
    <section className="workflow-section" id="workflow">
      <div className="container">
        <RevealOnScroll animation="fade-up">
          <div className="workflow-header-center">
            <div className="section-subtitle">
              <span>QUY TRÌNH LÀM VIỆC</span>
              <div className="subtitle-line"></div>
            </div>
            <h2>QUY TRÌNH PHỤC VỤ CHUYÊN NGHIỆP</h2>
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

