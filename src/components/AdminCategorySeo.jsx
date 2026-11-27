import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Save,
  RotateCcw,
  ExternalLink,
  Plus,
  Trash2,
  FileText,
  Search,
  Settings,
  Award,
  Building2,
  Wrench,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sliders,
  AlignLeft,
  Copy
} from "lucide-react";
import { defaultCategorySeoTemplates } from "../data/defaultCategorySeo";
import "./AdminCategorySeo.css";

const CATEGORIES = [
  { id: "cuacuon", label: "Cửa Cuốn", badge: "Khe thoáng" },
  { id: "phukien", label: "Phụ Kiện Cửa", badge: "Linh kiện" },
  { id: "cuakeo", label: "Cửa Kéo", badge: "Đài Loan/Inox" },
  { id: "cuatudong", label: "Cổng & Cửa Tự Động", badge: "Italia/Nhật" },
  { id: "all", label: "Tất Cả Danh Mục", badge: "Tổng quan" }
];

export default function AdminCategorySeo({ showToast }) {
  const [selectedCat, setSelectedCat] = useState("cuacuon");
  const [formData, setFormData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editorTab, setEditorTab] = useState("article"); // 'article' | 'seo' | 'advanced'

  // Load data whenever selected category changes
  useEffect(() => {
    loadCategoryData(selectedCat);
  }, [selectedCat]);

  const loadCategoryData = async (catId) => {
    setIsLoading(true);
    const defaultData = defaultCategorySeoTemplates[catId] || defaultCategorySeoTemplates.all;

    // 1. Check localStorage first for instant local cache
    let cached = null;
    try {
      const raw = localStorage.getItem(`boss_category_seo_${catId}`);
      if (raw) cached = JSON.parse(raw);
    } catch (e) {
      console.error(e);
    }

    // 2. Fetch from backend
    if (import.meta.env.VITE_API_URL) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/category-seo/${catId}`);
        const resJson = await res.json();
        if (resJson.success && resJson.data) {
          setFormData(resJson.data);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.log("Using cached or default data:", err.message);
      }
    }

    // Fallback to cached or default
    setFormData(cached || JSON.parse(JSON.stringify(defaultData)));
    setIsLoading(false);
  };

  // ----------------------------------------------------
  // FORM FIELD HANDLERS
  // ----------------------------------------------------
  const handleSimpleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleKeywordsChange = (e) => {
    const raw = e.target.value;
    const array = raw.split(",").map((k) => k.trim());
    setFormData((prev) => ({ ...prev, targetKeywords: array }));
  };

  // Structure & Tech points
  const handleTechTitleChange = (val) => {
    setFormData((prev) => ({
      ...prev,
      structureAndTech: { ...prev.structureAndTech, title: val }
    }));
  };

  const handleTechDescChange = (val) => {
    setFormData((prev) => ({
      ...prev,
      structureAndTech: { ...prev.structureAndTech, desc: val }
    }));
  };

  const handleTechPointChange = (idx, field, val) => {
    setFormData((prev) => {
      const newPoints = [...(prev.structureAndTech?.points || [])];
      newPoints[idx] = { ...newPoints[idx], [field]: val };
      return {
        ...prev,
        structureAndTech: { ...prev.structureAndTech, points: newPoints }
      };
    });
  };

  const handleAddTechPoint = () => {
    setFormData((prev) => {
      const newPoints = [
        ...(prev.structureAndTech?.points || []),
        { heading: "Bộ phận kỹ thuật mới", detail: "Mô tả cấu tạo, thông số kỹ thuật chi tiết..." }
      ];
      return {
        ...prev,
        structureAndTech: { ...prev.structureAndTech, points: newPoints }
      };
    });
  };

  const handleDeleteTechPoint = (idx) => {
    setFormData((prev) => ({
      ...prev,
      structureAndTech: {
        ...prev.structureAndTech,
        points: prev.structureAndTech?.points?.filter((_, i) => i !== idx) || []
      }
    }));
  };

  // Benefits
  const handleBenefitChange = (idx, field, val) => {
    setFormData((prev) => {
      const newBenefits = [...(prev.benefits || [])];
      newBenefits[idx] = { ...newBenefits[idx], [field]: val };
      return { ...prev, benefits: newBenefits };
    });
  };

  const handleAddBenefit = () => {
    setFormData((prev) => ({
      ...prev,
      benefits: [
        ...(prev.benefits || []),
        { title: "Ưu điểm nổi bật mới", desc: "Mô tả lợi ích mang lại cho khách hàng..." }
      ]
    }));
  };

  const handleDeleteBenefit = (idx) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits?.filter((_, i) => i !== idx) || []
    }));
  };

  // Applications
  const handleAppTitleChange = (val) => {
    setFormData((prev) => ({
      ...prev,
      applications: { ...prev.applications, title: val }
    }));
  };

  const handleAppItemChange = (idx, val) => {
    setFormData((prev) => {
      const newItems = [...(prev.applications?.items || [])];
      newItems[idx] = val;
      return {
        ...prev,
        applications: { ...prev.applications, items: newItems }
      };
    });
  };

  const handleAddAppItem = () => {
    setFormData((prev) => {
      const newItems = [...(prev.applications?.items || []), "Ứng dụng công trình thực tế mới..."];
      return {
        ...prev,
        applications: { ...prev.applications, items: newItems }
      };
    });
  };

  const handleDeleteAppItem = (idx) => {
    setFormData((prev) => ({
      ...prev,
      applications: {
        ...prev.applications,
        items: prev.applications?.items?.filter((_, i) => i !== idx) || []
      }
    }));
  };

  // Buying Guide
  const handleGuideTitleChange = (val) => {
    setFormData((prev) => ({
      ...prev,
      buyingGuide: { ...prev.buyingGuide, title: val }
    }));
  };

  const handleGuideStepChange = (idx, val) => {
    setFormData((prev) => {
      const newSteps = [...(prev.buyingGuide?.steps || [])];
      newSteps[idx] = val;
      return {
        ...prev,
        buyingGuide: { ...prev.buyingGuide, steps: newSteps }
      };
    });
  };

  const handleAddGuideStep = () => {
    setFormData((prev) => {
      const newSteps = [...(prev.buyingGuide?.steps || []), "Kinh nghiệm chọn mua mới..."];
      return {
        ...prev,
        buyingGuide: { ...prev.buyingGuide, steps: newSteps }
      };
    });
  };

  const handleDeleteGuideStep = (idx) => {
    setFormData((prev) => ({
      ...prev,
      buyingGuide: {
        ...prev.buyingGuide,
        steps: prev.buyingGuide?.steps?.filter((_, i) => i !== idx) || []
      }
    }));
  };

  // FAQs
  const handleFaqChange = (idx, field, val) => {
    setFormData((prev) => {
      const newFaqs = [...(prev.faqs || [])];
      newFaqs[idx] = { ...newFaqs[idx], [field]: val };
      return { ...prev, faqs: newFaqs };
    });
  };

  const handleAddFaq = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [
        ...(prev.faqs || []),
        { q: "Câu hỏi thường gặp mới là gì?", a: "Câu trả lời chi tiết tại Boss Đà Nẵng..." }
      ]
    }));
  };

  const handleDeleteFaq = (idx) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs?.filter((_, i) => i !== idx) || []
    }));
  };

  // Helper: Consolidate structured points into the single content textarea
  const handleConsolidateIntoArticle = () => {
    let fullText = formData.content || "";
    
    if (formData.structureAndTech?.points?.length) {
      fullText += `\n\n### ${formData.structureAndTech.title || "Cấu Tạo Kỹ Thuật & Nguyên Lý Hoạt Động"}\n`;
      if (formData.structureAndTech.desc) fullText += `${formData.structureAndTech.desc}\n`;
      formData.structureAndTech.points.forEach((pt) => {
        fullText += `\n- **${pt.heading}**: ${pt.detail}`;
      });
    }

    if (formData.benefits?.length) {
      fullText += `\n\n### ${formData.benefitsTitle || "Ưu Điểm & Lợi Ích Vượt Trội"}`;
      formData.benefits.forEach((b) => {
        fullText += `\n- **${b.title}**: ${b.desc}`;
      });
    }

    if (formData.applications?.items?.length) {
      fullText += `\n\n### ${formData.applications.title || "Ứng Dụng Thực Tế Tại Đà Nẵng"}`;
      formData.applications.items.forEach((item) => {
        fullText += `\n- ${item}`;
      });
    }

    if (formData.buyingGuide?.steps?.length) {
      fullText += `\n\n### ${formData.buyingGuide.title || "Kinh Nghiệm Lựa Chọn Sản Phẩm"}`;
      formData.buyingGuide.steps.forEach((step) => {
        fullText += `\n- ${step}`;
      });
    }

    if (formData.faqs?.length) {
      fullText += `\n\n### Câu Hỏi Thường Gặp (FAQ)`;
      formData.faqs.forEach((faq) => {
        fullText += `\n\n**Hỏi: ${faq.q}**\nTrả lời: ${faq.a}`;
      });
    }

    setFormData((prev) => ({ ...prev, content: fullText.trim() }));
    showToast("✅ Đã gộp toàn bộ cấu tạo, lợi ích & FAQ vào 1 khung soạn thảo duy nhất!");
  };

  // ----------------------------------------------------
  // SAVE & RESET
  // ----------------------------------------------------
  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!formData) return;
    setIsSaving(true);

    try {
      // 1. Cache to localStorage for instant local reflection
      localStorage.setItem(`boss_category_seo_${selectedCat}`, JSON.stringify(formData));

      // 2. Save to backend database
      if (import.meta.env.VITE_API_URL) {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/category-seo/${selectedCat}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, category: selectedCat })
        });
        const resJson = await res.json();
        if (resJson.success) {
          showToast(`✅ Đã lưu bài viết danh mục "${CATEGORIES.find(c => c.id === selectedCat)?.label}" thành công!`);
        } else {
          showToast(`💾 Đã lưu bài viết vào bộ nhớ trình duyệt!`);
        }
      } else {
        showToast(`💾 Đã lưu bài viết vào bộ nhớ trình duyệt!`);
      }
    } catch (err) {
      console.error("Save error:", err);
      showToast(`💾 Đã lưu bài viết vào bộ nhớ máy tính!`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefault = () => {
    if (!window.confirm(`Bạn có chắc muốn khôi phục bài viết "${CATEGORIES.find(c => c.id === selectedCat)?.label}" về nội dung chuẩn mẫu ban đầu?`)) {
      return;
    }
    const defaultData = defaultCategorySeoTemplates[selectedCat] || defaultCategorySeoTemplates.all;
    setFormData(JSON.parse(JSON.stringify(defaultData)));
    try {
      localStorage.removeItem(`boss_category_seo_${selectedCat}`);
    } catch (e) {
      console.error(e);
    }
    showToast(`🔄 Đã khôi phục nội dung mẫu chuẩn cho danh mục!`);
  };

  if (isLoading || !formData) {
    return (
      <div className="admin-seo-loading">
        <div className="spinner"></div>
        <p>Đang tải dữ liệu bài viết danh mục...</p>
      </div>
    );
  }

  // Word & character stats
  const contentWords = (formData.content || "").trim() ? (formData.content || "").trim().split(/\s+/).length : 0;
  const contentChars = (formData.content || "").length;

  return (
    <div className="admin-category-seo-unified-wrapper">
      {/* KHUNG DUY NHẤT CHỨA TOÀN BỘ QUẢN LÝ BÀI VIẾT */}
      <div className="admin-category-seo-unified-box">

        {/* 1. HEADER SECTION TÍCH HỢP */}
        <div className="unified-box-head">
          <div className="unified-head-text">
            <h2>QUẢN LÝ BÀI VIẾT BÁN HÀNG THEO DANH MỤC</h2>
            <p>
              Chỉnh sửa bài viết giới thiệu chuyên sâu xuất hiện ở chân trang mỗi danh mục sản phẩm (H1, nội dung chi tiết & thông số SEO).
            </p>
          </div>
          <div className="unified-head-actions">
            <a
              href={`/san-pham${selectedCat !== "all" ? `?cat=${selectedCat}` : ""}`}
              target="_blank"
              rel="noreferrer"
              className="btn-unified-preview"
              title="Xem bài viết hiển thị thực tế trên web"
            >
              <ExternalLink size={15} /> Xem Trên Web
            </a>
            <button
              type="button"
              className="btn-unified-reset"
              onClick={handleResetDefault}
              title="Khôi phục nội dung mẫu chuẩn"
            >
              <RotateCcw size={15} /> Mẫu Chuẩn SEO
            </button>
            <button
              type="button"
              className="btn-unified-save"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save size={16} /> {isSaving ? "Đang Lưu..." : "Lưu Bài Viết"}
            </button>
          </div>
        </div>

        {/* 2. CHỌN DANH MỤC LIỀN MẠCH TRONG CÙNG KHUNG */}
        <div className="unified-box-cats">
          <span className="unified-cats-label">Danh mục bài viết:</span>
          <div className="unified-cats-list">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`unified-cat-pill ${selectedCat === cat.id ? "active" : ""}`}
                onClick={() => setSelectedCat(cat.id)}
              >
                <span className="cat-name">{cat.label}</span>
                <span className="cat-badge">{cat.badge}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. THANH ĐIỀU HƯỚNG TAB TINH GỌN (CHỈ 3 PHẦN, MẶC ĐỊNH LÀ 1 KHUNG SOẠN BÀI DUY NHẤT) */}
        <div className="unified-box-subtabs">
          <button
            type="button"
            className={`unified-subtab-btn ${editorTab === "article" ? "active" : ""}`}
            onClick={() => setEditorTab("article")}
          >
            <FileText size={17} />
            <span>1. Soạn Thảo Bài Viết (Khung duy nhất)</span>
          </button>
          <button
            type="button"
            className={`unified-subtab-btn ${editorTab === "seo" ? "active" : ""}`}
            onClick={() => setEditorTab("seo")}
          >
            <Search size={17} />
            <span>2. Cấu Hình SEO Google</span>
          </button>
          <button
            type="button"
            className={`unified-subtab-btn ${editorTab === "advanced" ? "active" : ""}`}
            onClick={() => setEditorTab("advanced")}
          >
            <Sliders size={17} />
            <span>3. Cấu Tạo & FAQ (Nâng cao)</span>
          </button>
        </div>

        {/* 4. VÙNG NỘI DUNG FORM NẰM GỌN TRONG 1 KHUNG */}
        <form onSubmit={handleSave} className="unified-box-form">

          {/* TAB 1: SOẠN THẢO BÀI VIẾT (KHUNG DUY NHẤT) */}
          {editorTab === "article" && (
            <div className="unified-tab-pane">
              {/* Tiêu đề chính */}
              <div className="unified-field-group">
                <label className="unified-field-label">
                  Tiêu Đề Chính Bài Viết (H1 Heading)
                  <span className="unified-hint">Hiển thị tiêu đề lớn nhất ở đầu bài viết</span>
                </label>
                <input
                  type="text"
                  className="unified-input-title"
                  value={formData.h1 || ""}
                  onChange={(e) => handleSimpleChange("h1", e.target.value)}
                  placeholder="Ví dụ: Cửa Cuốn Đà Nẵng - Báo Giá & Thi Công Lắp Đặt Cửa Cuốn BossDoor Chính Hãng 2026"
                  required
                />
              </div>

              {/* Đoạn tóm tắt Sapo */}
              <div className="unified-field-group">
                <label className="unified-field-label">
                  Đoạn Mở Bài Tóm Tắt (Sapo)
                  <span className="unified-hint">1 đoạn văn ngắn mở đầu làm nổi bật dịch vụ</span>
                </label>
                <textarea
                  rows={3}
                  className="unified-textarea-sapo"
                  value={formData.summary || ""}
                  onChange={(e) => handleSimpleChange("summary", e.target.value)}
                  placeholder="Đoạn mở đầu nêu bật vị thế, năng lực thi công tại Đà Nẵng, cam kết bảo hành và chất lượng..."
                />
              </div>

              {/* KHUNG SOẠN THẢO BÀI VIẾT TOÀN DIỆN (CHỈ 1 KHUNG DUY NHẤT) */}
              <div className="unified-field-group">
                <div className="unified-editor-header-bar">
                  <div className="unified-editor-title-wrap">
                    <span className="unified-editor-main-label">Nội Dung Bài Viết Bán Hàng Toàn Diện</span>
                    <span className="unified-stats-badge">
                      {contentWords} từ • {contentChars} ký tự
                    </span>
                  </div>

                  <button
                    type="button"
                    className="btn-consolidate"
                    onClick={handleConsolidateIntoArticle}
                    title="Gộp tất cả các mục Cấu tạo, Lợi ích, FAQ mẫu vào khung này để dễ sửa thành bài viết liền mạch"
                  >
                    <Copy size={14} /> Gộp mẫu toàn bộ vào khung này
                  </button>
                </div>

                <textarea
                  className="unified-textarea-full-content"
                  rows={16}
                  value={formData.content || ""}
                  onChange={(e) => handleSimpleChange("content", e.target.value)}
                  placeholder="Viết toàn bộ nội dung bài viết bán hàng chi tiết tại đây...&#10;&#10;💡 Cách viết rất đơn giản:&#10;- Bấm Enter 2 lần để xuống dòng thành đoạn văn mới.&#10;- Gõ '### Tên Tiêu Đề' để tạo tiêu đề con in đậm đẹp mắt.&#10;- Gõ '- Nội dung' để tạo danh sách gạch đầu dòng."
                />

                <div className="unified-editor-tips">
                  <span>💡 <strong>Hướng dẫn tiện lợi:</strong> Bạn có thể gõ toàn bộ bài viết, các mục cấu tạo, ưu điểm trong đúng 1 khung soạn thảo này. Xuống dòng 2 lần để tách đoạn văn, hoặc gõ <code>### Tiêu đề mục</code> để tạo tiêu đề phân đoạn trên web.</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CẤU HÌNH SEO GOOGLE */}
          {editorTab === "seo" && (
            <div className="unified-tab-pane">
              <div className="unified-seo-grid">
                <div className="unified-field-group">
                  <label className="unified-field-label">
                    Meta Title (Tiêu đề Google & Tab trình duyệt)
                    <span className="unified-hint">Khuyến nghị: 50 - 65 ký tự</span>
                  </label>
                  <input
                    type="text"
                    className="unified-input-text"
                    value={formData.metaTitle || ""}
                    onChange={(e) => handleSimpleChange("metaTitle", e.target.value)}
                    placeholder="Ví dụ: Cửa Cuốn Đà Nẵng - Báo Giá & Lắp Đặt Cửa Cuốn BossDoor Chính Hãng 2026"
                  />
                </div>

                <div className="unified-field-group">
                  <label className="unified-field-label">
                    Meta Description (Đoạn mô tả hiển thị trên Google)
                    <span className="unified-hint">Khuyến nghị: 135 - 160 ký tự</span>
                  </label>
                  <textarea
                    rows={3}
                    className="unified-textarea-sapo"
                    value={formData.metaDescription || ""}
                    onChange={(e) => handleSimpleChange("metaDescription", e.target.value)}
                    placeholder="Mô tả ngắn gọn, thu hút người dùng bấm vào khi tìm kiếm trên Google..."
                  />
                </div>

                <div className="unified-field-group">
                  <label className="unified-field-label">
                    Từ Khóa Mục Tiêu (Target Keywords)
                    <span className="unified-hint">Phân cách các từ bằng dấu phẩy</span>
                  </label>
                  <input
                    type="text"
                    className="unified-input-text"
                    value={Array.isArray(formData.targetKeywords) ? formData.targetKeywords.join(", ") : (formData.targetKeywords || "")}
                    onChange={handleKeywordsChange}
                    placeholder="cửa cuốn Đà Nẵng, cửa cuốn BossDoor, báo giá cửa cuốn Đà Nẵng..."
                  />
                </div>

                {/* GOOGLE PREVIEW BOX TRỰC QUAN */}
                <div className="unified-serp-preview">
                  <span className="serp-preview-label">Xem trước kết quả tìm kiếm trên Google:</span>
                  <div className="serp-box">
                    <div className="serp-cite">https://bossdoordanang.com.vn &gt; san-pham</div>
                    <div className="serp-title">{formData.metaTitle || formData.h1 || "Tiêu đề trang sản phẩm"}</div>
                    <div className="serp-desc">{formData.metaDescription || formData.summary || "Đoạn văn mô tả tóm tắt hiển thị trên kết quả tìm kiếm Google..."}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: KHỐI KỸ THUẬT & FAQ (NÂNG CAO - NẾU CẦN TÙY BIẾN CHI TIẾT) */}
          {editorTab === "advanced" && (
            <div className="unified-tab-pane">
              <div className="unified-advanced-helper">
                <AlertCircle size={18} />
                <span>
                  <strong>Lưu ý:</strong> Các mục dưới đây là tùy chọn nâng cao dùng để xuất hiện thành các khối thẻ đặc thù (schema FAQ, bộ phận cơ khí). Nếu bạn đã gộp nội dung vào khung bài viết chính ở Tab 1 thì không nhất thiết phải điền thêm ở đây.
                </span>
              </div>

              {/* 3.1 CẤU TẠO KỸ THUẬT */}
              <div className="unified-accordion-box">
                <div className="unified-accordion-head">
                  <div className="accordion-title-row">
                    <Settings size={18} />
                    <h4>Cấu Tạo Kỹ Thuật & Bộ Phận Cơ Khí</h4>
                  </div>
                  <button type="button" className="btn-add-item-compact" onClick={handleAddTechPoint}>
                    <Plus size={14} /> Thêm Bộ Phận
                  </button>
                </div>
                <div className="unified-accordion-body">
                  <div className="compact-items-list">
                    {(formData.structureAndTech?.points || []).map((pt, idx) => (
                      <div key={idx} className="compact-item-row">
                        <input
                          type="text"
                          className="item-input-title"
                          value={pt.heading || ""}
                          onChange={(e) => handleTechPointChange(idx, "heading", e.target.value)}
                          placeholder="Tên bộ phận..."
                        />
                        <input
                          type="text"
                          className="item-input-desc"
                          value={pt.detail || ""}
                          onChange={(e) => handleTechPointChange(idx, "detail", e.target.value)}
                          placeholder="Mô tả thông số kỹ thuật..."
                        />
                        <button type="button" className="btn-item-remove" onClick={() => handleDeleteTechPoint(idx)}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3.2 ƯU ĐIỂM & LỢI ÍCH */}
              <div className="unified-accordion-box">
                <div className="unified-accordion-head">
                  <div className="accordion-title-row">
                    <Award size={18} />
                    <h4>Ưu Điểm & Lợi Ích Vượt Trội</h4>
                  </div>
                  <button type="button" className="btn-add-item-compact" onClick={handleAddBenefit}>
                    <Plus size={14} /> Thêm Lợi Ích
                  </button>
                </div>
                <div className="unified-accordion-body">
                  <div className="compact-items-list">
                    {(formData.benefits || []).map((b, idx) => (
                      <div key={idx} className="compact-item-row">
                        <input
                          type="text"
                          className="item-input-title"
                          value={b.title || ""}
                          onChange={(e) => handleBenefitChange(idx, "title", e.target.value)}
                          placeholder="Tiêu đề lợi ích..."
                        />
                        <input
                          type="text"
                          className="item-input-desc"
                          value={b.desc || ""}
                          onChange={(e) => handleBenefitChange(idx, "desc", e.target.value)}
                          placeholder="Diễn giải chi tiết..."
                        />
                        <button type="button" className="btn-item-remove" onClick={() => handleDeleteBenefit(idx)}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3.3 CÂU HỎI THƯỜNG GẶP FAQ */}
              <div className="unified-accordion-box">
                <div className="unified-accordion-head">
                  <div className="accordion-title-row">
                    <HelpCircle size={18} />
                    <h4>Câu Hỏi Thường Gặp (FAQ Schema)</h4>
                  </div>
                  <button type="button" className="btn-add-item-compact" onClick={handleAddFaq}>
                    <Plus size={14} /> Thêm Câu Hỏi FAQ
                  </button>
                </div>
                <div className="unified-accordion-body">
                  <div className="compact-items-list">
                    {(formData.faqs || []).map((faq, idx) => (
                      <div key={idx} className="compact-faq-card">
                        <div className="compact-faq-q">
                          <input
                            type="text"
                            value={faq.q || ""}
                            onChange={(e) => handleFaqChange(idx, "q", e.target.value)}
                            placeholder="Nhập câu hỏi (Ví dụ: Giá cửa cuốn bao nhiêu tiền?)..."
                          />
                          <button type="button" className="btn-item-remove" onClick={() => handleDeleteFaq(idx)}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={faq.a || ""}
                          onChange={(e) => handleFaqChange(idx, "a", e.target.value)}
                          placeholder="Nhập câu trả lời giải đáp..."
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. FOOTER SAVE BAR TÍCH HỢP Ở ĐÁY KHUNG */}
          <div className="unified-box-footer">
            <button
              type="button"
              className="btn-footer-reset"
              onClick={handleResetDefault}
            >
              <RotateCcw size={15} /> Khôi Phục Mẫu
            </button>
            <button
              type="submit"
              className="btn-footer-save"
              disabled={isSaving}
            >
              <Save size={18} /> {isSaving ? "Đang Lưu Cập Nhật..." : "LƯU CẬP NHẬT BÀI VIẾT"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
