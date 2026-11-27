import React, { useState, useEffect, useRef } from "react";
import {
  Save,
  RotateCcw,
  ExternalLink,
  Bold,
  Italic,
  Underline,
  Palette,
  Highlighter,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Image as ImageIcon,
  Link as LinkIcon,
  Table as TableIcon,
  Code,
  Sparkles,
  Search,
  X,
  FileText,
  Upload,
  CheckCircle2,
  Eye
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

// Helper: Chuyển đổi dữ liệu template hoặc JSON thành HTML văn bản Word đầy đủ
function convertTemplateToWordHtml(data) {
  if (!data) return "<p>Bắt đầu viết nội dung bài viết bán hàng tại đây...</p>";

  // Nếu đã là HTML đầy đủ
  if (data.content && /<[a-z][\s\S]*>/i.test(data.content)) {
    return data.content;
  }

  let html = "";

  // 1. Đoạn mở bài Sapo
  if (data.summary) {
    html += `<p style="font-size: 15.5px; line-height: 1.8; color: #334155; margin-bottom: 20px;"><em>${data.summary}</em></p>`;
  }

  // 2. Nội dung thân bài
  if (data.content) {
    data.content.split("\n\n").forEach((p) => {
      if (p.trim()) html += `<p>${p.trim()}</p>`;
    });
  }

  // 3. Cấu tạo kỹ thuật
  if (data.structureAndTech?.points?.length) {
    html += `<h2>${data.structureAndTech.title || "Cấu Tạo Kỹ Thuật & Nguyên Lý Hoạt Động"}</h2>`;
    if (data.structureAndTech.desc) {
      html += `<p>${data.structureAndTech.desc}</p>`;
    }
    html += `<ul>`;
    data.structureAndTech.points.forEach((pt) => {
      html += `<li><strong>${pt.heading}:</strong> ${pt.detail}</li>`;
    });
    html += `</ul>`;
  }

  // 4. Ưu điểm nổi bật
  if (data.benefits?.length) {
    html += `<h2>${data.benefitsTitle || "Ưu Điểm & Lợi Ích Vượt Trội"}</h2>`;
    html += `<ul>`;
    data.benefits.forEach((b) => {
      html += `<li><strong>${b.title}:</strong> ${b.desc}</li>`;
    });
    html += `</ul>`;
  }

  // 5. Ứng dụng thực tế
  if (data.applications?.items?.length) {
    html += `<h2>${data.applications.title || "Ứng Dụng Thực Tế Tại Đà Nẵng"}</h2>`;
    html += `<ul>`;
    data.applications.items.forEach((item) => {
      html += `<li>${item}</li>`;
    });
    html += `</ul>`;
  }

  // 6. Kinh nghiệm lựa chọn
  if (data.buyingGuide?.steps?.length) {
    html += `<h2>${data.buyingGuide.title || "Kinh Nghiệm Lựa Chọn Sản Phẩm"}</h2>`;
    html += `<ol>`;
    data.buyingGuide.steps.forEach((step) => {
      html += `<li>${step}</li>`;
    });
    html += `</ol>`;
  }

  // 7. Câu hỏi thường gặp
  if (data.faqs?.length) {
    html += `<h2>Câu Hỏi Thường Gặp (FAQ)</h2>`;
    data.faqs.forEach((faq) => {
      html += `<div style="background: #f0fdf4; border-left: 4px solid #004d32; padding: 12px 18px; margin: 14px 0; border-radius: 6px;">
        <strong style="color: #004d32; font-size: 15px; display: block; margin-bottom: 4px;">❓ ${faq.q}</strong>
        <p style="margin: 0; color: #1e293b; font-size: 14px;">${faq.a}</p>
      </div>`;
    });
  }

  return html || "<p>Nhập nội dung bài viết...</p>";
}

export default function AdminCategorySeo({ showToast }) {
  const [selectedCat, setSelectedCat] = useState("cuacuon");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form states (Word document)
  const [h1Title, setH1Title] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [targetKeywords, setTargetKeywords] = useState([]);
  const [wordCount, setWordCount] = useState(0);

  // Editor states
  const editorRef = useRef(null);
  const [isCodeView, setIsCodeView] = useState(false);
  const [rawHtmlContent, setRawHtmlContent] = useState("");

  // Modals
  const [showSeoModal, setShowSeoModal] = useState(false);
  const [showImgModal, setShowImgModal] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [imgCaption, setImgCaption] = useState("");
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  // Raw original object for preservation
  const originalDataRef = useRef(null);

  // Load category data
  useEffect(() => {
    loadCategory(selectedCat);
  }, [selectedCat]);

  const loadCategory = async (catId) => {
    setIsLoading(true);
    const defaultData = defaultCategorySeoTemplates[catId] || defaultCategorySeoTemplates.all;

    let loadedData = null;
    try {
      const raw = localStorage.getItem(`boss_category_seo_${catId}`);
      if (raw) loadedData = JSON.parse(raw);
    } catch (e) {
      console.error(e);
    }

    if (!loadedData && import.meta.env.VITE_API_URL) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/category-seo/${catId}`);
        const resJson = await res.json();
        if (resJson.success && resJson.data) {
          loadedData = resJson.data;
        }
      } catch (err) {}
    }

    const finalData = loadedData || JSON.parse(JSON.stringify(defaultData));
    originalDataRef.current = finalData;

    setH1Title(finalData.h1 || "");
    setMetaTitle(finalData.metaTitle || finalData.h1 || "");
    setMetaDescription(finalData.metaDescription || finalData.summary || "");
    setTargetKeywords(Array.isArray(finalData.targetKeywords) ? finalData.targetKeywords : []);

    const wordHtml = convertTemplateToWordHtml(finalData);
    setRawHtmlContent(wordHtml);
    if (editorRef.current) {
      editorRef.current.innerHTML = wordHtml;
      updateWordCount(wordHtml);
    }
    setIsLoading(false);
  };

  const updateWordCount = (html) => {
    const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    setWordCount(text ? text.split(" ").length : 0);
  };

  // ----------------------------------------------------
  // TOOLBAR COMMANDS
  // ----------------------------------------------------
  const exec = (command, value = null) => {
    if (isCodeView) return;
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      handleEditorInput();
    }
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setRawHtmlContent(html);
      updateWordCount(html);
    }
  };

  const handleToggleCodeView = () => {
    if (isCodeView) {
      if (editorRef.current) {
        editorRef.current.innerHTML = rawHtmlContent;
      }
      setIsCodeView(false);
    } else {
      if (editorRef.current) {
        setRawHtmlContent(editorRef.current.innerHTML);
      }
      setIsCodeView(true);
    }
  };

  // Chèn khung điểm nhấn Callout
  const handleInsertCallout = () => {
    const calloutHtml = `
      <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-left: 5px solid #004d32; border-radius: 8px; padding: 14px 18px; margin: 16px 0;">
        <strong style="color: #004d32; display: block; margin-bottom: 5px; font-size: 15px;">💡 Điểm Nhấn / Lưu Ý Quan Trọng:</strong>
        <p style="margin: 0; color: #1e293b; font-size: 14px;">Nhập nội dung lưu ý kỹ thuật hoặc cam kết chất lượng tại đây...</p>
      </div><p><br></p>
    `;
    exec("insertHTML", calloutHtml);
  };

  // Chèn ảnh
  const handleInsertImage = () => {
    if (!imgUrl.trim()) {
      alert("Vui lòng nhập đường link ảnh hoặc chọn ảnh từ máy!");
      return;
    }
    const caption = imgCaption.trim() || "Hình ảnh minh họa sản phẩm Boss Đà Nẵng";
    const figureHtml = `
      <figure style="text-align: center; margin: 20px 0;">
        <img src="${imgUrl.trim()}" alt="${caption}" style="max-width: 100%; max-height: 450px; border-radius: 8px; box-shadow: 0 4px 14px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; object-fit: contain;" />
        <figcaption style="margin-top: 8px; font-size: 13px; color: #64748b; font-style: italic;">${caption}</figcaption>
      </figure><p><br></p>
    `;
    exec("insertHTML", figureHtml);
    setImgUrl("");
    setImgCaption("");
    setShowImgModal(false);
  };

  const handleUploadImgFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImgUrl(ev.target.result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Chèn liên kết
  const handleInsertLink = () => {
    if (!linkUrl.trim()) return;
    const text = linkText.trim() || linkUrl.trim();
    const linkHtml = `<a href="${linkUrl.trim()}" target="_blank" rel="noopener noreferrer" style="color: #004d32; text-decoration: underline; font-weight: 600;">${text}</a>`;
    exec("insertHTML", linkHtml);
    setLinkUrl("");
    setLinkText("");
    setShowLinkModal(false);
  };

  // Chèn bảng
  const handleInsertTable = () => {
    let tableHtml = `<table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;"><thead><tr>`;
    for (let c = 1; c <= tableCols; c++) {
      tableHtml += `<th style="border: 1px solid #cbd5e1; padding: 10px 14px; background: #004d32; color: #ffffff; text-align: left;">Tiêu đề cột ${c}</th>`;
    }
    tableHtml += `</tr></thead><tbody>`;
    for (let r = 1; r <= tableRows; r++) {
      tableHtml += `<tr>`;
      for (let c = 1; c <= tableCols; c++) {
        tableHtml += `<td style="border: 1px solid #cbd5e1; padding: 10px 14px;">Dữ liệu ${r}.${c}</td>`;
      }
      tableHtml += `</tr>`;
    }
    tableHtml += `</tbody></table><p><br></p>`;
    exec("insertHTML", tableHtml);
    setShowTableModal(false);
  };

  // ----------------------------------------------------
  // SAVE & RESET
  // ----------------------------------------------------
  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSaving(true);

    const currentHtml = isCodeView
      ? rawHtmlContent
      : editorRef.current
      ? editorRef.current.innerHTML
      : rawHtmlContent;

    const dataToSave = {
      ...(originalDataRef.current || {}),
      category: selectedCat,
      h1: h1Title.trim() || `Bài Viết Danh Mục ${CATEGORIES.find((c) => c.id === selectedCat)?.label}`,
      content: currentHtml,
      metaTitle: metaTitle.trim() || h1Title.trim(),
      metaDescription: metaDescription.trim(),
      targetKeywords: targetKeywords
    };

    try {
      // 1. Lưu vào LocalStorage
      localStorage.setItem(`boss_category_seo_${selectedCat}`, JSON.stringify(dataToSave));
      originalDataRef.current = dataToSave;

      // 2. Lưu vào Backend API
      if (import.meta.env.VITE_API_URL) {
        await fetch(`${import.meta.env.VITE_API_URL}/api/category-seo/${selectedCat}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSave)
        });
      }

      showToast(`✅ Đã lưu bài viết "${CATEGORIES.find((c) => c.id === selectedCat)?.label}" thành công!`);
    } catch (err) {
      console.error("Save error:", err);
      showToast(`💾 Đã lưu bài viết vào bộ nhớ máy tính!`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefault = () => {
    if (!window.confirm(`Bạn có chắc muốn khôi phục bài viết "${CATEGORIES.find((c) => c.id === selectedCat)?.label}" về nội dung Word mẫu ban đầu?`)) {
      return;
    }
    const defaultData = defaultCategorySeoTemplates[selectedCat] || defaultCategorySeoTemplates.all;
    originalDataRef.current = defaultData;
    setH1Title(defaultData.h1 || "");
    setMetaTitle(defaultData.metaTitle || defaultData.h1 || "");
    setMetaDescription(defaultData.metaDescription || defaultData.summary || "");
    setTargetKeywords(Array.isArray(defaultData.targetKeywords) ? defaultData.targetKeywords : []);

    const wordHtml = convertTemplateToWordHtml(defaultData);
    setRawHtmlContent(wordHtml);
    if (editorRef.current) {
      editorRef.current.innerHTML = wordHtml;
      updateWordCount(wordHtml);
    }
    try {
      localStorage.removeItem(`boss_category_seo_${selectedCat}`);
    } catch (e) {}
    showToast(`🔄 Đã khôi phục bài viết về mẫu chuẩn Word ban đầu!`);
  };

  return (
    <div className="admin-word-article-editor-card">
      {/* KHỐI NAVBAR & TOOLBAR CỐ ĐỊNH KHI CUỘN TRANG */}
      <div className="word-editor-sticky-navbar">
        {/* 1. THANH TIÊU ĐỀ & CHỌN DANH MỤC TRÊN ĐẦU */}
        <div className="word-editor-top-bar">
        <div className="top-bar-left">
          <h2>QUẢN LÝ BÀI VIẾT BÁN HÀNG THEO DANH MỤC</h2>
          <span className="top-bar-sub">Soạn thảo bài viết trực tiếp trên trang giấy y như Word</span>
        </div>

        <div className="top-bar-actions">
          <a
            href={`/san-pham${selectedCat !== "all" ? `?cat=${selectedCat}` : ""}`}
            target="_blank"
            rel="noreferrer"
            className="btn-word-preview"
          >
            <ExternalLink size={15} /> Xem Trên Web
          </a>
          <button
            type="button"
            className="btn-word-reset"
            onClick={handleResetDefault}
          >
            <RotateCcw size={15} /> Mẫu Chuẩn
          </button>
          <button
            type="button"
            className="btn-word-save"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save size={16} /> {isSaving ? "Đang Lưu..." : "Lưu Bài Viết"}
          </button>
        </div>
      </div>

      {/* 2. CHỌN DANH MỤC DẠNG TAB LIỀN MẠCH */}
      <div className="word-editor-category-strip">
        <span className="strip-label">Danh mục bài viết:</span>
        <div className="strip-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`cat-pill-btn ${selectedCat === cat.id ? "active" : ""}`}
              onClick={() => setSelectedCat(cat.id)}
            >
              <span className="pill-name">{cat.label}</span>
              <span className="pill-badge">{cat.badge}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. THANH CÔNG CỤ TOOLBAR KIỂU MS WORD */}
      <div className="word-editor-toolbar">
        {/* Nhóm Heading Formats */}
        <div className="toolbar-group">
          <select
            className="toolbar-select"
            defaultValue="p"
            onChange={(e) => {
              const val = e.target.value;
              if (val === "h1") exec("formatBlock", "<h1>");
              else if (val === "h2") exec("formatBlock", "<h2>");
              else if (val === "h3") exec("formatBlock", "<h3>");
              else if (val === "h4") exec("formatBlock", "<h4>");
              else exec("formatBlock", "<p>");
              e.target.value = "p";
            }}
            title="Chọn định dạng đoạn văn hoặc tiêu đề"
          >
            <option value="p">Đoạn văn (Thường)</option>
            <option value="h1">Tiêu đề lớn (H1)</option>
            <option value="h2">Tiêu đề mục (H2)</option>
            <option value="h3">Tiêu đề con (H3)</option>
            <option value="h4">Tiêu đề nhỏ (H4)</option>
          </select>
        </div>

        <div className="toolbar-sep" />

        {/* Nhóm In đậm, Nghiêng, Gạch chân */}
        <div className="toolbar-group">
          <button
            type="button"
            className="tb-btn"
            onMouseDown={(e) => { e.preventDefault(); exec("bold"); }}
            title="In đậm (Ctrl+B)"
          >
            <Bold size={15} />
          </button>
          <button
            type="button"
            className="tb-btn"
            onMouseDown={(e) => { e.preventDefault(); exec("italic"); }}
            title="In nghiêng (Ctrl+I)"
          >
            <Italic size={15} />
          </button>
          <button
            type="button"
            className="tb-btn"
            onMouseDown={(e) => { e.preventDefault(); exec("underline"); }}
            title="Gạch chân (Ctrl+U)"
          >
            <Underline size={15} />
          </button>
        </div>

        <div className="toolbar-sep" />

        {/* Nhóm Màu chữ & Highlight */}
        <div className="toolbar-group">
          <button
            type="button"
            className="tb-color-chip chip-green"
            onMouseDown={(e) => { e.preventDefault(); exec("foreColor", "#004d32"); }}
            title="Màu xanh BossDoor (#004d32)"
          />
          <button
            type="button"
            className="tb-color-chip chip-red"
            onMouseDown={(e) => { e.preventDefault(); exec("foreColor", "#e30613"); }}
            title="Màu đỏ điểm nhấn (#e30613)"
          />
          <button
            type="button"
            className="tb-color-chip chip-blue"
            onMouseDown={(e) => { e.preventDefault(); exec("foreColor", "#1d4ed8"); }}
            title="Màu xanh dương (#1d4ed8)"
          />
          <button
            type="button"
            className="tb-color-chip chip-orange"
            onMouseDown={(e) => { e.preventDefault(); exec("foreColor", "#d97706"); }}
            title="Màu vàng cam (#d97706)"
          />
          <button
            type="button"
            className="tb-color-chip chip-dark"
            onMouseDown={(e) => { e.preventDefault(); exec("foreColor", "#0f172a"); }}
            title="Màu đen chữ thường (#0f172a)"
          />

          <label className="tb-color-picker-label" title="Tùy chọn màu chữ bất kỳ">
            <Palette size={14} />
            <input
              type="color"
              className="tb-hidden-color-input"
              onChange={(e) => exec("foreColor", e.target.value)}
            />
          </label>

          <button
            type="button"
            className="tb-btn tb-highlight-btn"
            onMouseDown={(e) => { e.preventDefault(); exec("hiliteColor", "#fef08a"); }}
            title="Tô màu nền Highlight vàng"
          >
            <Highlighter size={14} />
          </button>
        </div>

        <div className="toolbar-sep" />

        {/* Nhóm Căn lề */}
        <div className="toolbar-group">
          <button
            type="button"
            className="tb-btn"
            onMouseDown={(e) => { e.preventDefault(); exec("justifyLeft"); }}
            title="Căn trái"
          >
            <AlignLeft size={15} />
          </button>
          <button
            type="button"
            className="tb-btn"
            onMouseDown={(e) => { e.preventDefault(); exec("justifyCenter"); }}
            title="Căn giữa"
          >
            <AlignCenter size={15} />
          </button>
          <button
            type="button"
            className="tb-btn"
            onMouseDown={(e) => { e.preventDefault(); exec("justifyRight"); }}
            title="Căn phải"
          >
            <AlignRight size={15} />
          </button>
          <button
            type="button"
            className="tb-btn"
            onMouseDown={(e) => { e.preventDefault(); exec("justifyFull"); }}
            title="Căn đều 2 bên"
          >
            <AlignJustify size={15} />
          </button>
        </div>

        <div className="toolbar-sep" />

        {/* Nhóm Danh sách */}
        <div className="toolbar-group">
          <button
            type="button"
            className="tb-btn"
            onMouseDown={(e) => { e.preventDefault(); exec("insertUnorderedList"); }}
            title="Danh sách gạch đầu dòng"
          >
            <List size={15} />
          </button>
          <button
            type="button"
            className="tb-btn"
            onMouseDown={(e) => { e.preventDefault(); exec("insertOrderedList"); }}
            title="Danh sách số thứ tự (1, 2, 3)"
          >
            <ListOrdered size={15} />
          </button>
        </div>

        <div className="toolbar-sep" />

        {/* Nhóm Tiện ích: Callout, Ảnh, Bảng, Link */}
        <div className="toolbar-group">
          <button
            type="button"
            className="tb-btn-special"
            onMouseDown={(e) => { e.preventDefault(); handleInsertCallout(); }}
            title="Chèn khung điểm nhấn / lưu ý nổi bật"
          >
            <Sparkles size={13} /> <span>Điểm nhấn</span>
          </button>
          <button
            type="button"
            className="tb-btn-special"
            onClick={() => setShowImgModal(true)}
            title="Chèn hình ảnh"
          >
            <ImageIcon size={13} /> <span>Chèn ảnh</span>
          </button>
          <button
            type="button"
            className="tb-btn-special"
            onClick={() => setShowTableModal(true)}
            title="Chèn bảng biểu"
          >
            <TableIcon size={13} /> <span>Bảng</span>
          </button>
          <button
            type="button"
            className="tb-btn-special"
            onClick={() => setShowLinkModal(true)}
            title="Chèn liên kết URL"
          >
            <LinkIcon size={13} /> <span>Link</span>
          </button>
        </div>

        {/* Nhóm Phải: Xem HTML & Cấu hình SEO */}
        <div className="toolbar-group ml-auto">
          <button
            type="button"
            className={`tb-btn ${showSeoModal ? "active" : ""}`}
            onClick={() => setShowSeoModal(!showSeoModal)}
            title="Cấu hình tiêu đề & mô tả SEO Google"
          >
            <Search size={14} /> <span>SEO Google</span>
          </button>
          <button
            type="button"
            className={`tb-btn ${isCodeView ? "active" : ""}`}
            onClick={handleToggleCodeView}
            title="Chuyển đổi giữa chế độ Soạn thảo trực quan và Mã HTML"
          >
            <Code size={14} /> <span>{isCodeView ? "Trực quan" : "Mã HTML"}</span>
          </button>
        </div>
      </div>

      {/* THANH CẤU HÌNH SEO GOOGLE (THU GỌN / MỞ RỘNG) */}
      {showSeoModal && (
        <div className="word-seo-drawer">
          <div className="seo-drawer-header">
            <h4>🔍 Cấu Hình SEO Google Cho Danh Mục</h4>
            <button type="button" className="btn-close-drawer" onClick={() => setShowSeoModal(false)}>
              <X size={16} />
            </button>
          </div>
          <div className="seo-drawer-grid">
            <div className="seo-input-group">
              <label>Meta Title (Tiêu đề Google):</label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Tiêu đề hiển thị trên kết quả tìm kiếm Google..."
              />
            </div>
            <div className="seo-input-group">
              <label>Meta Description (Đoạn mô tả Google):</label>
              <textarea
                rows={2}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Mô tả tóm tắt ngắn cho công cụ tìm kiếm..."
              />
            </div>
          </div>
        </div>
      )}
      </div>

      {/* 4. CANVAS TRANG GIẤY WORD DUY NHẤT (WORD DOCUMENT PAGE SHEET) */}
      <div className="word-canvas-outer-wrapper">
        <div className="word-document-page-sheet">
          {/* Ô nhập tiêu đề H1 ngay đầu trang giấy */}
          <div className="sheet-h1-row">
            <input
              type="text"
              className="sheet-h1-input"
              value={h1Title}
              onChange={(e) => setH1Title(e.target.value)}
              placeholder="Nhập tiêu đề chính bài viết bán hàng (H1 Heading)..."
            />
          </div>

          <div className="sheet-h1-divider" />

          {/* Vùng soạn thảo Word chính */}
          {isCodeView ? (
            <textarea
              className="word-html-source-area"
              value={rawHtmlContent}
              onChange={(e) => {
                setRawHtmlContent(e.target.value);
                updateWordCount(e.target.value);
              }}
              placeholder="Nhập hoặc chỉnh sửa trực tiếp mã HTML..."
            />
          ) : (
            <div
              ref={editorRef}
              className="wysiwyg-content-editable-area"
              contentEditable
              suppressContentEditableWarning
              onInput={handleEditorInput}
              onBlur={handleEditorInput}
              placeholder="Bắt đầu soạn thảo nội dung bài viết bán hàng chi tiết tại đây y như Microsoft Word..."
            />
          )}
        </div>
      </div>

      {/* 5. THANH THỐNG KÊ & NÚT LƯU Ở ĐÁY TRANG GIẤY */}
      <div className="word-bottom-status-bar">
        <div className="status-stats">
          <span>Số từ: <strong>{wordCount}</strong> từ</span>
          <span className="dot">•</span>
          <span>Danh mục: <strong>{CATEGORIES.find((c) => c.id === selectedCat)?.label}</strong></span>
          <span className="dot">•</span>
          <span>💡 <em>Nhấn Enter để xuống đoạn mới, Shift + Enter để xuống dòng.</em></span>
        </div>

        <button
          type="button"
          className="btn-word-save-bottom"
          onClick={handleSave}
          disabled={isSaving}
        >
          <Save size={16} /> {isSaving ? "Đang Lưu Cập Nhật..." : "LƯU BÀI VIẾT BÁN HÀNG"}
        </button>
      </div>

      {/* MODAL CHÈN ẢNH */}
      {showImgModal && (
        <div className="word-editor-modal-overlay">
          <div className="word-editor-modal-card">
            <div className="modal-header">
              <h3>🖼️ Chèn Hình Ảnh Vào Bài Viết</h3>
              <button type="button" onClick={() => setShowImgModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <label>Đường link ảnh (URL):</label>
              <input
                type="text"
                value={imgUrl}
                onChange={(e) => setImgUrl(e.target.value)}
                placeholder="https://example.com/anh-cua-cuon.jpg"
              />

              <div style={{ margin: "12px 0 6px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span>Hoặc tải ảnh từ máy tính:</span>
                <label className="btn-upload-file">
                  <Upload size={14} /> Chọn ảnh từ máy
                  <input type="file" accept="image/*" onChange={handleUploadImgFile} style={{ display: "none" }} />
                </label>
              </div>

              {imgUrl && (
                <div style={{ textAlign: "center", margin: "10px 0" }}>
                  <img src={imgUrl} alt="Preview" style={{ maxHeight: "140px", borderRadius: "6px" }} />
                </div>
              )}

              <label style={{ marginTop: "10px" }}>Chú thích ảnh (Caption):</label>
              <input
                type="text"
                value={imgCaption}
                onChange={(e) => setImgCaption(e.target.value)}
                placeholder="Ví dụ: Thi công cửa cuốn BossDoor tại Đà Nẵng"
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-modal-cancel" onClick={() => setShowImgModal(false)}>Hủy</button>
              <button type="button" className="btn-modal-confirm" onClick={handleInsertImage}>Chèn Ảnh</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CHÈN LINK */}
      {showLinkModal && (
        <div className="word-editor-modal-overlay">
          <div className="word-editor-modal-card">
            <div className="modal-header">
              <h3>🔗 Chèn Liên Kết (Link URL)</h3>
              <button type="button" onClick={() => setShowLinkModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <label>Đường link (URL):</label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://bossdoordanang.com.vn/bang-gia"
              />
              <label style={{ marginTop: "10px" }}>Chữ hiển thị:</label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Ví dụ: Xem bảng giá cửa cuốn 2026"
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-modal-cancel" onClick={() => setShowLinkModal(false)}>Hủy</button>
              <button type="button" className="btn-modal-confirm" onClick={handleInsertLink}>Chèn Link</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CHÈN BẢNG */}
      {showTableModal && (
        <div className="word-editor-modal-overlay">
          <div className="word-editor-modal-card">
            <div className="modal-header">
              <h3>📊 Chèn Bảng Biểu (Table)</h3>
              <button type="button" onClick={() => setShowTableModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body" style={{ display: "flex", gap: "16px" }}>
              <div style={{ flex: 1 }}>
                <label>Số hàng:</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={tableRows}
                  onChange={(e) => setTableRows(parseInt(e.target.value) || 1)}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Số cột:</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={tableCols}
                  onChange={(e) => setTableCols(parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-modal-cancel" onClick={() => setShowTableModal(false)}>Hủy</button>
              <button type="button" className="btn-modal-confirm" onClick={handleInsertTable}>Tạo Bảng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
