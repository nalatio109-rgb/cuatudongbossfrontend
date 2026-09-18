import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import RevealOnScroll from "./RevealOnScroll";

export default function Projects() {
  const projects = [
    {
      id: 1,
      title: "Biệt thự cao cấp Euro Village",
      category: "Cửa trượt tự động",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      title: "Căn hộ Penthouse Landmark",
      category: "Cửa nhôm kính cao cấp",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      title: "Thi công Cửa Villa Sơn Trà",
      category: "Cửa mở cánh hiện đại",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 4,
      title: "Showroom BOSS Đà Nẵng",
      category: "Hệ thống Cửa tự động",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 5,
      title: "Resort & Spa ven biển",
      category: "Cửa kính thuỷ lực",
      image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 6,
      title: "Biệt thự phố Ngũ Hành Sơn",
      category: "Cửa cổng tự động",
      image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=600&q=80"
    }
  ];

  // Duplicate array for continuous infinite marquee loop
  const marqueeItems = [...projects, ...projects];

  return (
    <>
      {/* ================= PROJECTS ================= */}
      <section className="projects-section" id="projects">
        <div className="container">
          <RevealOnScroll animation="fade-up">
            <div className="section-header-flex">
              <div className="section-title-left">
                <div className="section-subtitle">
                  <span>DỰ ÁN TIÊU BIỂU</span>
                  <div className="subtitle-line"></div>
                </div>
                <h2>NHỮNG CÔNG TRÌNH ĐÃ THỰC HIỆN</h2>
              </div>
              <Link to="/du-an" className="btn-outline">
                XEM TẤT CẢ DỰ ÁN <ArrowRight size={14} />
              </Link>
            </div>
          </RevealOnScroll>
        </div>

        <RevealOnScroll animation="zoom-in" delay={200} className="projects-marquee-wrapper">
          <div className="projects-marquee-track">
            {marqueeItems.map((project, index) => (
              <div className="project-card" key={`${project.id}-${index}`}>
                <img src={project.image} alt={project.title} />
                <div className="project-card-overlay">
                  <span className="project-card-category">{project.category}</span>
                  <h4 className="project-card-title">{project.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </section>
    </>
  );
}


