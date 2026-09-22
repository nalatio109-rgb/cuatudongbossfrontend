import React, { useState, useEffect } from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';
import './Projects.css';

const Projects = () => {
  const initialProjects = [
    { id: 1, title: 'Cửa Trượt Siêu Thị Lotte', category: 'Cửa Trượt', image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=800&q=80', location: 'Đà Nẵng', description: 'Hệ thống cửa trượt tự động cho siêu thị.' },
    { id: 2, title: 'Cổng Biệt Thự Euro Village', category: 'Cổng Tự Động', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', location: 'Đà Nẵng', description: 'Thi công cổng mở xoay tự động cao cấp.' },
    { id: 3, title: 'Cửa Xoay Khách Sạn 5 Sao', category: 'Cửa Xoay', image: 'https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=800&q=80', location: 'Hội An', description: 'Lắp đặt hệ thống cửa xoay khách sạn sang trọng.' },
    { id: 4, title: 'Barie Tự Động Khu Công Nghiệp', category: 'Barie', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', location: 'Quảng Nam', description: 'Barie kiểm soát ra vào khu công nghiệp.' },
  ];

  const [projects, setProjects] = useState(initialProjects);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setProjects(data.data);
        }
      })
      .catch((err) => console.error("Projects API error:", err));
  }, []);

  const openModal = (project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const closeModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="projects-page">
      <section className="page-header" style={{
        background: 'linear-gradient(135deg, #0a2e20 0%, var(--color-primary) 100%)',
        padding: '6rem 0 4rem',
        color: 'white',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 className="hero-title" style={{fontSize: '3.5rem'}}>Dự Án <span className="text-gradient">Tiêu Biểu</span></h1>
          <p className="hero-subtitle" style={{margin: '0 auto'}}>Những công trình khẳng định chất lượng và uy tín của BOSS Đà Nẵng.</p>
        </div>
      </section>

      <section className="section-padding bg-light">
        <div className="container">
          <div className="portfolio-grid">
            {projects.map((proj) => (
              <div 
                key={proj._id || proj.id} 
                className="portfolio-card"
                onClick={() => openModal(proj)}
                style={{ cursor: 'pointer' }}
              >
                <div className="portfolio-img-wrapper">
                  <img src={proj.image || proj.img} alt={proj.title} className="portfolio-img" />
                  <div className="portfolio-overlay">
                    <button className="portfolio-link-btn"><ArrowUpRight size={28} /></button>
                  </div>
                </div>
                <div className="portfolio-info">
                  <span className="portfolio-category">{proj.category}</span>
                  <h3>{proj.title}</h3>
                  {proj.location && (
                    <div className="portfolio-location">
                      <MapPin size={14} /> <span>{proj.location}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <div className="project-modal-overlay" onClick={closeModal}>
          <div className="project-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="project-modal-close" onClick={closeModal}>&times;</button>
            <div className="project-modal-body">
              <div className="project-modal-image">
                <img src={selectedProject.image || selectedProject.img} alt={selectedProject.title} />
              </div>
              <div className="project-modal-info">
                <span className="portfolio-category">{selectedProject.category}</span>
                <h2>{selectedProject.title}</h2>
                {selectedProject.location && (
                  <div className="portfolio-location">
                    <MapPin size={16} /> <span>{selectedProject.location}</span>
                  </div>
                )}
                <div className="project-modal-desc">
                  <p>{selectedProject.description || "Nội dung chi tiết dự án đang được cập nhật..."}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
