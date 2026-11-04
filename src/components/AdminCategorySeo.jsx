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
  AlertCircle
} from "lucide-react";
import { defaultCategorySeoTemplates } from "../data/defaultCategorySeo";
import "./AdminCategorySeo.css";

const CATEGORIES = [
  { id: "cuacuon", label: "Cửa Cuốn", badge: "Hot" },
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
      const newPoints = [...(prev.structureAndTech?.points || [])];
      newPoints.push({ heading: "Bộ phận mới", detail: "Mô tả chi tiết kỹ thuật..." });
      return {
        ...prev,
        structureAndTech: { ...prev.structureAndTech, points: newPoints }
      };
    });
  };

  const handleDeleteTechPoint = (idx) => {
    setFormData((prev) => {
      const newPoints = prev.structureAndTech?.points?.filter((_, i) => i !== idx) || [];
      return {
        ...prev,
        structureAndTech: { ...prev.structureAndTech, points: newPoints }
      };
    });
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
      benefits: [...(prev.benefits || []), { title: "Ưu điểm mới", desc: "Mô tả lợi ích..." }]
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
      const newItems = [...(prev.applications?.items || []), "Ứng dụng thực tế mới..."];
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

  // ----------------------------------------------------
  // SAVE & RESET
  // ----------------------------------------------------
  const handleSave = async (e) => {
    e.preventDefault();
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
          showToast(`✅ Đã lưu bài viết SEO danh mục "${CATEGORIES.find(c => c.id === selectedCat)?.label}" vào cơ sở dữ liệu!`);
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
    showToast(`🔄 Đã khôi phục nội dung mẫu chuẩn SEO cho danh mục!`);
  };

  if (isLoading || !formData) {
    return (
      <div className="admin-seo-loading">
        <div className="spinner"></div>
        <p>Đang tải dữ liệu bài viết SEO danh mục...</p>
      </div>
    );
  }

  return (
    <div className="admin-category-seo-panel">
      {/* HEADER SECTION */}
      <div className="admin-panel-head">
        <div>
          <h2>QUẢN LÝ BÀI VIẾT SEO BÁN HÀNG THEO DANH MỤC</h2>
          <p>
            Chỉnh sửa nội dung bán hàng chuyên sâu, tiêu đề H1/H2, thông số kỹ thuật và câu hỏi FAQ xuất hiện ở cuối mỗi danh mục sản phẩm.
          </p>
        </div>
        <div className="admin-head-actions">
          <a
            href={`/san-pham${selectedCat !== "all" ? `?cat=${selectedCat}` : ""}`}
            target="_blank"
            rel="noreferrer"
            className="btn-admin-preview"
          >
            <ExternalLink size={16} /> Xem Trên Web
          </a>
          <button
            type="button"
            className="btn-admin-reset"
            onClick={handleResetDefault}
          >
            <RotateCcw size={16} /> Mẫu Chuẩn SEO
          </button>
          <button
            type="button"
            className="btn-admin-save"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save size={16} /> {isSaving ? "Đang Lưu..." : "Lưu Bài Viết"}
          </button>
        </div>
      </div>

      {/* CATEGORY SELECTOR PILLS */}
      <div className="admin-category-tabs-bar">
        <span className="cat-tabs-label">Chọn danh mục bài viết:</span>
        <div className="cat-tabs-list">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`cat-tab-btn ${selectedCat === cat.id ? "active" : ""}`}
              onClick={() => setSelectedCat(cat.id)}
            >
              <span className="cat-name">{cat.label}</span>
              <span className="cat-sub-badge">{cat.badge}</span>
            </button>
          ))}
        </div>
      </div>

      {/* FORM SECTIONS */}
      <form onSubmit={handleSave} className="admin-seo-form">

        {/* 1. SEO META & KEYWORDS */}
        <div className="admin-card-section">
          <div className="section-header-row">
            <div className="section-badge-icon">
              <Search size={18} />
            </div>
            <div>
              <h3>1. Tối Ưu SEO Meta & Từ Khóa Google</h3>
              <p>Hiển thị trên kết quả tìm kiếm Google và thanh tiêu đề trình duyệt.</p>
            </div>
          </div>

          <div className="form-group-grid">
            <div className="form-field full-width">
              <label>
                Meta Title (Tiêu đề Google & Tab trình duyệt)
                <span className="field-hint">Khuyến nghị 55 - 65 ký tự</span>
              </label>
              <input
                type="text"
                value={formData.metaTitle || ""}
                onChange={(e) => handleSimpleChange("metaTitle", e.target.value)}
                placeholder="Ví dụ: Cửa Cuốn Đà Nẵng - Báo Giá & Lắp Đặt Cửa Cuốn BossDoor Chính Hãng 2026"
                required
              />
            </div>

            <div className="form-field full-width">
              <label>
                Meta Description (Đoạn mô tả ngắn tóm lược cho Google)
                <span className="field-hint">Khuyến nghị 140 - 160 ký tự</span>
              </label>
              <textarea
                rows={3}
                value={formData.metaDescription || ""}
                onChange={(e) => handleSimpleChange("metaDescription", e.target.value)}
                placeholder="Đoạn văn ngắn chứa từ khóa chính tóm lược nội dung trang..."
                required
              />
            </div>

            <div className="form-field full-width">
              <label>
                Từ Khóa Mục Tiêu (Target Keywords)
                <span className="field-hint">Phân cách các từ khóa bằng dấu phẩy</span>
              </label>
              <input
                type="text"
                value={Array.isArray(formData.targetKeywords) ? formData.targetKeywords.join(", ") : (formData.targetKeywords || "")}
                onChange={handleKeywordsChange}
                placeholder="cửa cuốn Đà Nẵng, cửa cuốn BossDoor, báo giá cửa cuốn Đà Nẵng..."
              />
            </div>
          </div>
        </div>

        {/* 2. MAIN HEADING & SUMMARY */}
        <div className="admin-card-section">
          <div className="section-header-row">
            <div className="section-badge-icon">
              <FileText size={18} />
            </div>
            <div>
              <h3>2. Tiêu Đề Bài Viết & Đoạn Giới Thiệu (Sapo)</h3>
              <p>Tiêu đề chính H1/H2 và đoạn văn mở đầu bài viết bán hàng.</p>
            </div>
          </div>

          <div className="form-group-grid">
            <div className="form-field full-width">
              <label>Tiêu Đề Chính Bài Viết (H1/H2 Heading)</label>
              <input
                type="text"
                value={formData.h1 || ""}
                onChange={(e) => handleSimpleChange("h1", e.target.value)}
                placeholder="Ví dụ: Cửa Cuốn Đà Nẵng - Báo Giá & Thi Công Lắp Đặt Cửa Cuốn BossDoor Chính Hãng"
                required
              />
            </div>

            <div className="form-field full-width">
              <label>Đoạn Giới Thiệu Tổng Quan (Sapo mở bài)</label>
              <textarea
                rows={3}
                value={formData.summary || ""}
                onChange={(e) => handleSimpleChange("summary", e.target.value)}
                placeholder="Đoạn văn mở đầu nêu bật vị thế, năng lực thi công tại Đà Nẵng, bảo hành..."
              />
            </div>

            <div className="form-field full-width">
              <label>
                Nội Dung Chi Tiết Bài Viết (Sales Content)
                <span className="field-hint">Hỗ trợ nhiều đoạn văn, tự động tách dòng trên giao diện</span>
              </label>
              <textarea
                rows={6}
                value={formData.content || ""}
                onChange={(e) => handleSimpleChange("content", e.target.value)}
                placeholder="Nhập nội dung bài viết bán hàng chi tiết..."
              />
            </div>
          </div>
        </div>

        {/* 3. STRUCTURE & TECHNICAL SPECIFICATIONS */}
        <div className="admin-card-section">
          <div className="section-header-row">
            <div className="section-badge-icon">
              <Settings size={18} />
            </div>
            <div>
              <h3>3. Cấu Tạo Kỹ Thuật & Nguyên Lý Hoạt Động</h3>
              <p>Phân tích chi tiết các bộ phận cơ khí và động cơ.</p>
            </div>
          </div>

          <div className="form-group-grid">
            <div className="form-field full-width">
              <label>Tiêu Đề Khối Cấu Tạo</label>
              <input
                type="text"
                value={formData.structureAndTech?.title || ""}
                onChange={(e) => handleTechTitleChange(e.target.value)}
              />
            </div>

            <div className="form-field full-width">
              <label>Đoạn Giới Thiệu Ngắn Khối Cấu Tạo</label>
              <input
                type="text"
                value={formData.structureAndTech?.desc || ""}
                onChange={(e) => handleTechDescChange(e.target.value)}
              />
            </div>
          </div>

          {/* List of points */}
          <div className="dynamic-items-container">
            <label className="sub-section-label">Danh Sách Các Bộ Phận / Điểm Kỹ Thuật:</label>
            {(formData.structureAndTech?.points || []).map((pt, idx) => (
              <div key={idx} className="dynamic-item-card">
                <div className="item-card-header">
                  <span className="item-card-index">Bộ phận #{idx + 1}</span>
                  <button
                    type="button"
                    className="btn-item-delete"
                    onClick={() => handleDeleteTechPoint(idx)}
                    title="Xóa bộ phận này"
                  >
                    <Trash2 size={15} /> Xóa
                  </button>
                </div>
                <div className="item-card-body">
                  <div className="form-field">
                    <label>Tên Bộ Phận / Tiêu Đề</label>
                    <input
                      type="text"
                      value={pt.heading || ""}
                      onChange={(e) => handleTechPointChange(idx, "heading", e.target.value)}
                      placeholder="Ví dụ: Thân cửa (Nan cửa)"
                    />
                  </div>
                  <div className="form-field">
                    <label>Chi Tiết Cấu Tạo & Thông Số</label>
                    <textarea
                      rows={2}
                      value={pt.detail || ""}
                      onChange={(e) => handleTechPointChange(idx, "detail", e.target.value)}
                      placeholder="Mô tả hợp kim nhôm, sơn tĩnh điện, độ dày..."
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="btn-add-dynamic-item"
              onClick={handleAddTechPoint}
            >
              <Plus size={16} /> Thêm Bộ Phận Cấu Tạo Mới
            </button>
          </div>
        </div>

        {/* 4. BENEFITS */}
        <div className="admin-card-section">
          <div className="section-header-row">
            <div className="section-badge-icon">
              <Award size={18} />
            </div>
            <div>
              <h3>4. Ưu Điểm & Lợi Ích Vượt Trội</h3>
              <p>Các lý do thuyết phục khách hàng tin chọn mua tại Boss Đà Nẵng.</p>
            </div>
          </div>

          <div className="form-field full-width" style={{ marginBottom: "16px" }}>
            <label>Tiêu Đề Khối Ưu Điểm</label>
            <input
              type="text"
              value={formData.benefitsTitle || ""}
              onChange={(e) => handleSimpleChange("benefitsTitle", e.target.value)}
              placeholder="Ví dụ: Ưu Điểm & Lợi Ích Vượt Trội Khi Chọn Mua Tại Boss Đà Nẵng"
            />
          </div>

          <div className="dynamic-items-container">
            {(formData.benefits || []).map((b, idx) => (
              <div key={idx} className="dynamic-item-card">
                <div className="item-card-header">
                  <span className="item-card-index">Lợi ích #{idx + 1}</span>
                  <button
                    type="button"
                    className="btn-item-delete"
                    onClick={() => handleDeleteBenefit(idx)}
                  >
                    <Trash2 size={15} /> Xóa
                  </button>
                </div>
                <div className="item-card-body">
                  <div className="form-field">
                    <label>Tiêu Đề Lợi Ích</label>
                    <input
                      type="text"
                      value={b.title || ""}
                      onChange={(e) => handleBenefitChange(idx, "title", e.target.value)}
                      placeholder="Ví dụ: An Toàn Chống Trộm Vượt Trội"
                    />
                  </div>
                  <div className="form-field">
                    <label>Diễn Giải Lợi Ích</label>
                    <textarea
                      rows={2}
                      value={b.desc || ""}
                      onChange={(e) => handleBenefitChange(idx, "desc", e.target.value)}
                      placeholder="Chi tiết công nghệ mã nhảy, vận hành êm ái..."
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="btn-add-dynamic-item"
              onClick={handleAddBenefit}
            >
              <Plus size={16} /> Thêm Lợi Ích Mới
            </button>
          </div>
        </div>

        {/* 5. APPLICATIONS */}
        <div className="admin-card-section">
          <div className="section-header-row">
            <div className="section-badge-icon">
              <Building2 size={18} />
            </div>
            <div>
              <h3>5. Ứng Dụng Thực Tế Tại Đà Nẵng</h3>
              <p>Phù hợp với từng loại hình kiến trúc và khu vực cụ thể.</p>
            </div>
          </div>

          <div className="form-field full-width" style={{ marginBottom: "16px" }}>
            <label>Tiêu Đề Khối Ứng Dụng</label>
            <input
              type="text"
              value={formData.applications?.title || ""}
              onChange={(e) => handleAppTitleChange(e.target.value)}
            />
          </div>

          <div className="dynamic-items-container">
            {(formData.applications?.items || []).map((item, idx) => (
              <div key={idx} className="dynamic-string-row">
                <span className="row-index">#{idx + 1}</span>
                <input
                  type="text"
                  value={item || ""}
                  onChange={(e) => handleAppItemChange(idx, e.target.value)}
                  placeholder="Ví dụ: Nhà phố, nhà ống mặt tiền các trục đường sầm uất..."
                />
                <button
                  type="button"
                  className="btn-row-delete"
                  onClick={() => handleDeleteAppItem(idx)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            <button
              type="button"
              className="btn-add-dynamic-item"
              onClick={handleAddAppItem}
            >
              <Plus size={16} /> Thêm Ứng Dụng Mới
            </button>
          </div>
        </div>

        {/* 6. BUYING GUIDE */}
        <div className="admin-card-section">
          <div className="section-header-row">
            <div className="section-badge-icon">
              <Wrench size={18} />
            </div>
            <div>
              <h3>6. Kinh Nghiệm Lựa Chọn Sản Phẩm</h3>
              <p>Cẩm nang tư vấn giúp khách hàng chọn mua chuẩn xác và tiết kiệm.</p>
            </div>
          </div>

          <div className="form-field full-width" style={{ marginBottom: "16px" }}>
            <label>Tiêu Đề Khối Kinh Nghiệm</label>
            <input
              type="text"
              value={formData.buyingGuide?.title || ""}
              onChange={(e) => handleGuideTitleChange(e.target.value)}
            />
          </div>

          <div className="dynamic-items-container">
            {(formData.buyingGuide?.steps || []).map((step, idx) => (
              <div key={idx} className="dynamic-item-card">
                <div className="item-card-header">
                  <span className="item-card-index">Kinh nghiệm #{idx + 1}</span>
                  <button
                    type="button"
                    className="btn-item-delete"
                    onClick={() => handleDeleteGuideStep(idx)}
                  >
                    <Trash2 size={15} /> Xóa
                  </button>
                </div>
                <div className="item-card-body">
                  <textarea
                    rows={2}
                    value={step || ""}
                    onChange={(e) => handleGuideStepChange(idx, e.target.value)}
                    placeholder="Mô tả kinh nghiệm chọn kích thước, tải trọng mô tơ, chọn lưu điện..."
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              className="btn-add-dynamic-item"
              onClick={handleAddGuideStep}
            >
              <Plus size={16} /> Thêm Kinh Nghiệm Mới
            </button>
          </div>
        </div>

        {/* 7. FAQS */}
        <div className="admin-card-section">
          <div className="section-header-row">
            <div className="section-badge-icon">
              <HelpCircle size={18} />
            </div>
            <div>
              <h3>7. Câu Hỏi Thường Gặp (FAQ Schema)</h3>
              <p>Được nhúng tự động dạng JSON-LD giúp Google xếp hạng cao trên kết quả tìm kiếm.</p>
            </div>
          </div>

          <div className="dynamic-items-container">
            {(formData.faqs || []).map((faq, idx) => (
              <div key={idx} className="dynamic-item-card">
                <div className="item-card-header">
                  <span className="item-card-index">Câu hỏi FAQ #{idx + 1}</span>
                  <button
                    type="button"
                    className="btn-item-delete"
                    onClick={() => handleDeleteFaq(idx)}
                  >
                    <Trash2 size={15} /> Xóa
                  </button>
                </div>
                <div className="item-card-body">
                  <div className="form-field">
                    <label>Câu Hỏi (Question)</label>
                    <input
                      type="text"
                      value={faq.q || ""}
                      onChange={(e) => handleFaqChange(idx, "q", e.target.value)}
                      placeholder="Ví dụ: Giá 1 bộ cửa cuốn tại Đà Nẵng bao nhiêu tiền?"
                    />
                  </div>
                  <div className="form-field">
                    <label>Câu Trả Lời (Answer)</label>
                    <textarea
                      rows={3}
                      value={faq.a || ""}
                      onChange={(e) => handleFaqChange(idx, "a", e.target.value)}
                      placeholder="Câu trả lời giải đáp thắc mắc chi tiết..."
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="btn-add-dynamic-item"
              onClick={handleAddFaq}
            >
              <Plus size={16} /> Thêm Câu Hỏi FAQ Mới
            </button>
          </div>
        </div>

        {/* BOTTOM SUBMIT BAR */}
        <div className="admin-form-bottom-bar">
          <button
            type="button"
            className="btn-admin-reset"
            onClick={handleResetDefault}
          >
            <RotateCcw size={16} /> Khôi Phục Mẫu Chuẩn SEO
          </button>
          <button
            type="submit"
            className="btn-admin-save-large"
            disabled={isSaving}
          >
            <Save size={18} /> {isSaving ? "Đang Lưu Cập Nhật..." : "LƯU CẬP NHẬT BÀI VIẾT BÁN HÀNG"}
          </button>
        </div>

      </form>
    </div>
  );
}

