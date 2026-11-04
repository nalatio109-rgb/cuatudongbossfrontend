import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Settings,
  Award,
  Building2,
  Wrench,
  HelpCircle
} from "lucide-react";
import "./CategorySeoContent.css";

export default function CategorySeoContent({ activeCategory = "all" }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    // 1. Try local cache first for instant response
    try {
      const cached = localStorage.getItem(`boss_category_seo_${activeCategory}`);
      if (cached) {
        setData(JSON.parse(cached));
      }
    } catch (e) {
      console.error(e);
    }

    // 2. Fetch from backend API
    if (import.meta.env.VITE_API_URL) {
      fetch(`${import.meta.env.VITE_API_URL}/api/category-seo/${activeCategory}`)
        .then((res) => res.json())
        .then((resJson) => {
          if (resJson.success && resJson.data) {
            setData(resJson.data);
            try {
              localStorage.setItem(`boss_category_seo_${activeCategory}`, JSON.stringify(resJson.data));
            } catch (err) {}
          }
        })
        .catch(() => {});
    }
  }, [activeCategory]);

  // Update document.title & meta description dynamically from data
  useEffect(() => {
    if (data?.metaTitle) {
      document.title = data.metaTitle;
    }
    if (data?.metaDescription) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = data.metaDescription;
    }
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    const currentOrigin = window.location.origin || "";
    canonical.href = `${currentOrigin}/san-pham${activeCategory !== "all" ? `?cat=${activeCategory}` : ""}`;
  }, [data, activeCategory]);

  // If there is no data or article has no content/heading, do not render static placeholders
  if (!data || (!data.h1 && !data.summary && !data.content)) {
    return null;
  }

  // Schema.org FAQPage structured data for Google Rich Snippets
  const hasFaqs = Array.isArray(data.faqs) && data.faqs.length > 0;
  const faqSchema = hasFaqs
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": data.faqs.map((faq) => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      }
    : null;

  const toggleFaq = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const hasTechPoints = Array.isArray(data.structureAndTech?.points) && data.structureAndTech.points.length > 0;
  const hasBenefits = Array.isArray(data.benefits) && data.benefits.length > 0;
  const hasApplications = Array.isArray(data.applications?.items) && data.applications.items.length > 0;
  const hasBuyingGuide = Array.isArray(data.buyingGuide?.steps) && data.buyingGuide.steps.length > 0;

  return (
    <article className="seo-content-section" aria-label="Nội dung chuyên sâu danh mục">
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="seo-container">
        <div className={`seo-article-wrapper ${isExpanded ? "is-expanded" : "is-collapsed"}`}>

          {/* HEADER SECTION - 100% DYNAMIC */}
          <header className="seo-article-header">
            {data.h1 && <h2 className="seo-main-heading">{data.h1}</h2>}
            <div className="seo-heading-divider">
              <span className="dot"></span>
              <span className="bar"></span>
              <span className="dot"></span>
            </div>
            {data.summary && <p className="seo-lead-text">{data.summary}</p>}
          </header>

          {/* DYNAMIC ARTICLE BODY CONTENT */}
          {data.content && (
            <div className="seo-body-content">
              {data.content.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}

          {/* DYNAMIC STRUCTURE & TECHNICAL DETAILS */}
          {hasTechPoints && (
            <section className="seo-section seo-tech-section">
              <div className="section-title-wrap">
                <Settings size={22} className="title-icon" />
                <h3>{data.structureAndTech.title || "Cấu Tạo Kỹ Thuật & Nguyên Lý Hoạt Động"}</h3>
              </div>
              {data.structureAndTech.desc && (
                <p className="section-subtext">{data.structureAndTech.desc}</p>
              )}
              <div className="tech-points-grid">
                {data.structureAndTech.points.map((pt, idx) => (
                  <div key={idx} className="tech-point-item">
                    <div className="tech-number">0{idx + 1}</div>
                    <div className="tech-point-body">
                      {pt.heading && <h4>{pt.heading}</h4>}
                      {pt.detail && <p>{pt.detail}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* DYNAMIC BENEFITS */}
          {hasBenefits && (
            <section className="seo-section seo-benefits-section">
              <div className="section-title-wrap">
                <Award size={22} className="title-icon" />
                <h3>{data.benefitsTitle || "Ưu Điểm & Lợi Ích Vượt Trội"}</h3>
              </div>
              <div className="benefits-grid">
                {data.benefits.map((b, idx) => (
                  <div key={idx} className="benefit-card">
                    {b.title && <h4>{b.title}</h4>}
                    {b.desc && <p>{b.desc}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* DYNAMIC APPLICATIONS */}
          {hasApplications && (
            <section className="seo-section seo-applications-section">
              <div className="section-title-wrap">
                <Building2 size={22} className="title-icon" />
                <h3>{data.applications.title || "Ứng Dụng Thực Tế"}</h3>
              </div>
              <div className="applications-list-box">
                {data.applications.items.map((item, idx) => (
                  <div key={idx} className="app-item">
                    <div className="app-dot"></div>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* DYNAMIC BUYING GUIDE */}
          {hasBuyingGuide && (
            <section className="seo-section seo-guide-section">
              <div className="section-title-wrap">
                <Wrench size={22} className="title-icon" />
                <h3>{data.buyingGuide.title || "Kinh Nghiệm Lựa Chọn Sản Phẩm"}</h3>
              </div>
              <div className="guide-box">
                {data.buyingGuide.steps.map((st, idx) => (
                  <div key={idx} className="guide-step">
                    <div className="guide-step-badge">Kinh nghiệm {idx + 1}</div>
                    <p>{st}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* DYNAMIC FAQ ACCORDION */}
          {hasFaqs && (
            <section className="seo-section seo-faq-section">
              <div className="section-title-wrap">
                <HelpCircle size={22} className="title-icon" />
                <h3>Câu Hỏi Thường Gặp (FAQ)</h3>
              </div>
              <div className="faq-accordion">
                {data.faqs.map((faq, idx) => {
                  const isOpen = activeFaq === idx;
                  return (
                    <div key={idx} className={`faq-item ${isOpen ? "is-open" : ""}`}>
                      <button
                        className="faq-question-btn"
                        onClick={() => toggleFaq(idx)}
                        aria-expanded={isOpen}
                      >
                        <span className="faq-q-text">{faq.q}</span>
                        <span className="faq-arrow-icon">
                          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </span>
                      </button>
                      <div className="faq-answer-collapse">
                        <div className="faq-answer-content">
                          <p>{faq.a}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* GRADIENT OVERLAY WHEN COLLAPSED */}
          {!isExpanded && <div className="seo-collapse-fade" aria-hidden="true" />}
        </div>

        {/* TOGGLE EXPAND / COLLAPSE BUTTON */}
        <div className="seo-toggle-action">
          <button
            type="button"
            className="btn-seo-toggle"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Thu gọn bài viết" : "Xem thêm bài viết"}
          >
            {isExpanded ? (
              <>
                Thu gọn nội dung <ChevronUp size={18} />
              </>
            ) : (
              <>
                Xem thêm nội dung chi tiết <ChevronDown size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
