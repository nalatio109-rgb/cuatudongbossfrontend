import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Save,
  Send,
  Eye,
  RefreshCw,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Image,
  Link as LinkIcon,
  Video,
  Table,
  Undo,
  Redo,
  Code,
  Highlighter,
  Palette,
  Upload,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  Search,
  Check,
  Maximize2,
  Minimize2,
  Trash2,
  Plus,
  Sparkles,
  ChevronDown,
  ArrowLeft
} from "lucide-react";
import { DEFAULT_PRODUCT_ARTICLES } from "../data/defaultProductArticles";
import "./AdminProductArticleEditor.css";

// Available product catalog options for admin to select and edit
const PRODUCT_OPTIONS = [
  { code: "CK-SR1", title: "Cửa kéo công nghệ Đức SR1 (U dày 1.3 mm)", category: "cuakeo" },
  { code: "CK-SR2", title: "Cửa kéo công nghệ Đức SR2 (U dày 1.1 mm)", category: "cuakeo" },
  { code: "CK-SR3", title: "Cửa kéo công nghệ Đức SR3 (U dày 0.9 mm)", category: "cuakeo" },
  { code: "VIP", title: "Cửa kéo công nghệ Đức VIP (U dày 1.5 mm)", category: "cuakeo" },
  { code: "BEC.5810", title: "Cửa cuốn Bossdoor ECO BEC.5810", category: "cuacuon" },
  { code: "DL-75", title: "Cửa cuốn Đài Loan giá rẻ DL-75", category: "cuacuon" },
  { code: "BD-LUX", title: "Cửa cuốn thế hệ mới BossDoor Luxury", category: "cuacuon" },
  { code: "BD-900", title: "Cửa cuốn khe thoáng Đức BossDoor BD-900", category: "cuacuon" },
  { code: "BD-L70", title: "Cửa cuốn tấm liền Úc siêu êm BD-L70", category: "cuacuon" },
  { code: "SN-100", title: "Cửa cuốn song ngang - mắc võng SN-100", category: "cuacuon" },
  { code: "CK-DL", title: "Cửa kéo Đài Loan truyền thống CK-DL", category: "cuakeo" },
  { code: "CK-IX304", title: "Cửa kéo 100% Inox 304 cao cấp", category: "cuakeo" },
  { code: "MT-500", title: "Mô tơ cửa cuốn nhập khẩu Đài Loan / Đức", category: "phukien" },
  { code: "UPS-800", title: "Bình lưu điện cửa cuốn UPS dự phòng", category: "phukien" },
  { code: "IT-GHOST", title: "Mô tơ cổng tự động âm sàn Italia", category: "cuatudong" },
  { code: "NAB-150", title: "Cửa kính trượt tự động Nabco Nhật Bản", category: "cuatudong" }
];

export default function AdminProductArticleEditor({ 
  showToast, 
  initialProductCode, 
  onBackToProducts, 
  dbProducts = [] 
}) {
  const [selectedProductCode, setSelectedProductCode] = useState(initialProductCode || "CK-SR1");
  const [articlesList, setArticlesList] = useState([]);
  const [activeArticle, setActiveArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // Combine static catalog options with products from MongoDB
  const availableProductOptions = React.useMemo(() => {
    const list = [...PRODUCT_OPTIONS];
    if (Array.isArray(dbProducts)) {
      dbProducts.forEach((dp) => {
        if (dp.code && !list.some((p) => p.code.toUpperCase() === dp.code.toUpperCase())) {
          list.push({
            code: dp.code,
            title: dp.title || dp.code,
            category: dp.category || "cuacuon"
          });
        }
      });
    }
    return list;
  }, [dbProducts]);

  useEffect(() => {
    if (initialProductCode && initialProductCode !== selectedProductCode) {
      setSelectedProductCode(initialProductCode);
      handleSelectProduct(initialProductCode);
    }
  }, [initialProductCode]);

  // Editor states
  const editorRef = useRef(null);
  const [isCodeView, setIsCodeView] = useState(false);
  const [rawHtmlContent, setRawHtmlContent] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Modals for inserting media & table
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageModalData, setImageModalData] = useState({
    url: "",
    alt: "",
    caption: "",
    align: "align-center", // 'align-center' | 'align-left' | 'align-right'
    width: "85%"
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkModalData, setLinkModalData] = useState({
    url: "",
    text: "",
    openNewTab: true
  });

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoModalData, setVideoModalData] = useState({ url: "" });

  const [showTableModal, setShowTableModal] = useState(false);
  const [tableModalData, setTableModalData] = useState({ rows: 4, cols: 2, hasHeader: true });

  // Secondary keyword input state
  const [newKeywordInput, setNewKeywordInput] = useState("");

  // Load articles from Backend or LocalStorage on mount
  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    let loaded = null;

    // 1. Try Backend API
    if (import.meta.env.VITE_API_URL) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/product-articles`);
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          loaded = json.data;
        }
      } catch (e) {
        console.log("Could not load product articles from API:", e.message);
      }
    }

    // 2. Try LocalStorage
    if (!loaded) {
      const local = localStorage.getItem("boss_admin_product_articles");
      if (local) {
        try {
          loaded = JSON.parse(local);
        } catch (e) {
          console.error(e);
        }
      }
    }

    // 3. Fallback to default seed
    if (!loaded || loaded.length === 0) {
      loaded = DEFAULT_PRODUCT_ARTICLES;
      localStorage.setItem("boss_admin_product_articles", JSON.stringify(DEFAULT_PRODUCT_ARTICLES));
    }

    setArticlesList(loaded);

    // Set initial active article
    const found = loaded.find((a) => a.productCode.toUpperCase() === selectedProductCode.toUpperCase()) || loaded[0];
    if (found) {
      setActiveArticle(JSON.parse(JSON.stringify(found)));
      setRawHtmlContent(found.content || "");
    }

    setLoading(false);
  };

  // Sync editor content when active article changes
  useEffect(() => {
    if (activeArticle && editorRef.current && !isCodeView) {
      editorRef.current.innerHTML = activeArticle.content || "";
    }
    if (activeArticle) {
      setRawHtmlContent(activeArticle.content || "");
    }
  }, [activeArticle?.productCode]);

  // Handle switching product dropdown
  const handleSelectProduct = (code) => {
    // Save current editor content before switching
    if (editorRef.current && activeArticle && !isCodeView) {
      activeArticle.content = editorRef.current.innerHTML;
    }

    setSelectedProductCode(code);
    const existing = articlesList.find((a) => a.productCode.toUpperCase() === code.toUpperCase());

    if (existing) {
      setActiveArticle(JSON.parse(JSON.stringify(existing)));
      setRawHtmlContent(existing.content || "");
    } else {
      // Create new draft template for this product
      const productInfo = availableProductOptions.find((p) => p.code === code) || {
        title: `Sản phẩm ${code}`,
        category: "cuakeo"
      };

      const newArt = {
        productCode: code,
        productTitle: productInfo.title,
        category: productInfo.category,
        status: "draft",
        content: `<h2>1. Giới thiệu tổng quan về ${productInfo.title}</h2>\n<p>Nhập nội dung bài viết chi tiết tại đây...</p>`,
        uploadedImages: [],
        seo: {
          title: `${productInfo.title} | Boss Đà Nẵng`,
          description: `Thông tin chi tiết, cấu tạo và bảng thông số kỹ thuật của ${productInfo.title}.`,
          focusKeyword: productInfo.title,
          secondaryKeywords: [code.toLowerCase(), "báo giá đà nẵng"],
          slug: code.toLowerCase().replace(/[^a-z0-9]/g, "-"),
          imageAlt: productInfo.title,
          canonicalUrl: `https://bossdoordanang.com.vn/san-pham/${code}`
        }
      };

      setActiveArticle(newArt);
      setRawHtmlContent(newArt.content);
    }
  };

  // EXEC COMMAND HELPER FOR WYSIWYG
  const executeCommand = (command, value = null) => {
    if (isCodeView) return;
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      handleEditorChange();
    }
  };

  // Update state whenever content changes in editor
  const handleEditorChange = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    setRawHtmlContent(html);
    setActiveArticle((prev) => ({ ...prev, content: html }));
  };

  // Toggle Code View (HTML source)
  const toggleCodeView = () => {
    if (isCodeView) {
      // Switching from code to WYSIWYG
      if (editorRef.current) {
        editorRef.current.innerHTML = rawHtmlContent;
      }
      setIsCodeView(false);
    } else {
      // Switching from WYSIWYG to code
      if (editorRef.current) {
        setRawHtmlContent(editorRef.current.innerHTML);
      }
      setIsCodeView(true);
    }
  };

  // Clean HTML on paste (from Word)
  const handlePaste = (e) => {
    // If not in code view, allow paste but clean messy mso styles
    setTimeout(() => {
      handleEditorChange();
    }, 50);
  };

  // Helper to read file as DataURL (Base64)
  const readFileAsDataUrl = (inputFile) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(inputFile);
    });
  };

  // INSERT IMAGE MODAL HANDLERS
  const handleUploadLocalImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value so user can re-select same file if needed
    e.target.value = "";

    setIsUploadingImage(true);
    let uploadedUrl = null;

    // 1. Try uploading to Backend Server
    try {
      const backendBase = import.meta.env.VITE_API_URL || "";
      const uploadEndpoint = backendBase ? `${backendBase}/api/upload` : "/api/upload";

      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData
      });

      const contentType = res.headers.get("content-type") || "";
      if (res.ok && contentType.includes("application/json")) {
        const json = await res.json();
        if (json.success && json.url) {
          uploadedUrl = json.url.startsWith("http")
            ? json.url
            : `${backendBase}${json.url}`;
          if (showToast) showToast("🎉 Đã tải ảnh lên máy chủ thành công!");
        }
      } else {
        console.warn("Upload server returned non-JSON, falling back to Base64.");
      }
    } catch (err) {
      console.warn("Backend upload network error, falling back to Base64:", err.message);
    }

    // 2. Seamless fallback to Base64 DataURL if Backend is offline or returned HTML/error
    if (!uploadedUrl) {
      try {
        uploadedUrl = await readFileAsDataUrl(file);
        if (showToast) {
          showToast("✨ Đã nạp ảnh trực tiếp vào bài viết thành công!");
        }
      } catch (readErr) {
        console.error("FileReader error:", readErr);
        alert("Không thể đọc file ảnh: " + readErr.message);
      }
    }

    if (uploadedUrl) {
      setImageModalData((prev) => ({ ...prev, url: uploadedUrl }));

      // Also track in activeArticle.uploadedImages
      setActiveArticle((prev) => ({
        ...prev,
        uploadedImages: Array.from(new Set([...(prev.uploadedImages || []), uploadedUrl]))
      }));
    }

    setIsUploadingImage(false);
  };

  const confirmInsertImage = () => {
    if (!imageModalData.url.trim()) {
      alert("Vui lòng nhập đường dẫn ảnh hoặc tải ảnh lên từ máy tính.");
      return;
    }

    const figureHtml = `
<figure class="editor-image-figure ${imageModalData.align}" style="max-width: ${imageModalData.width};">
  <img src="${imageModalData.url}" alt="${imageModalData.alt || activeArticle?.title || 'Hình ảnh sản phẩm'}" />
  ${imageModalData.caption ? `<figcaption>${imageModalData.caption}</figcaption>` : ""}
</figure><p></p>`;

    executeCommand("insertHTML", figureHtml);
    setShowImageModal(false);
    setImageModalData({ url: "", alt: "", caption: "", align: "align-center", width: "85%" });
  };

  // DELETE SINGLE IMAGE FROM UPLOADED GALLERY
  const handleDeleteUploadedImage = (urlToRemove) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa hình ảnh này khỏi thư viện ảnh đã tải lên?")) {
      return;
    }
    setActiveArticle((prev) => ({
      ...prev,
      uploadedImages: (prev.uploadedImages || []).filter((u) => u !== urlToRemove)
    }));
    if (showToast) {
      showToast("🗑️ Đã xóa ảnh khỏi thư viện thành công!");
    }
  };

  // CLEAR ALL IMAGES FROM UPLOADED GALLERY
  const handleClearAllUploadedImages = () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa TOÀN BỘ ảnh trong thư viện ảnh đã tải lên của sản phẩm này?")) {
      return;
    }
    setActiveArticle((prev) => ({
      ...prev,
      uploadedImages: []
    }));
    if (showToast) {
      showToast("🗑️ Đã làm trống toàn bộ thư viện ảnh!");
    }
  };

  // INSERT LINK MODAL HANDLER
  const confirmInsertLink = () => {
    if (!linkModalData.url.trim()) return;
    const text = linkModalData.text.trim() || linkModalData.url;
    const target = linkModalData.openNewTab ? 'target="_blank" rel="noopener noreferrer"' : "";
    const linkHtml = `<a href="${linkModalData.url}" ${target}>${text}</a>`;
    executeCommand("insertHTML", linkHtml);
    setShowLinkModal(false);
    setLinkModalData({ url: "", text: "", openNewTab: true });
  };

  // INSERT VIDEO MODAL HANDLER
  const confirmInsertVideo = () => {
    if (!videoModalData.url.trim()) return;
    let embedUrl = videoModalData.url.trim();

    // Convert youtube watch URL to embed URL
    if (embedUrl.includes("watch?v=")) {
      const videoId = embedUrl.split("watch?v=")[1].split("&")[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (embedUrl.includes("youtu.be/")) {
      const videoId = embedUrl.split("youtu.be/")[1].split("?")[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    const videoHtml = `
<div class="editor-video-responsive">
  <iframe src="${embedUrl}" title="Video sản phẩm" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div><p></p>`;

    executeCommand("insertHTML", videoHtml);
    setShowVideoModal(false);
    setVideoModalData({ url: "" });
  };

  // INSERT TABLE MODAL HANDLER
  const confirmInsertTable = () => {
    const rows = parseInt(tableModalData.rows, 10) || 3;
    const cols = parseInt(tableModalData.cols, 10) || 2;

    let tableHtml = `<table class="editor-content-table">\n`;
    if (tableModalData.hasHeader) {
      tableHtml += `  <thead>\n    <tr>\n`;
      for (let c = 1; c <= cols; c++) {
        tableHtml += `      <th>Tiêu đề cột ${c}</th>\n`;
      }
      tableHtml += `    </tr>\n  </thead>\n`;
    }
    tableHtml += `  <tbody>\n`;
    for (let r = 1; r <= rows; r++) {
      tableHtml += `    <tr>\n`;
      for (let c = 1; c <= cols; c++) {
        tableHtml += `      <td>Nội dung hàng ${r}, cột ${c}</td>\n`;
      }
      tableHtml += `    </tr>\n`;
    }
    tableHtml += `  </tbody>\n</table>\n<p></p>`;

    executeCommand("insertHTML", tableHtml);
    setShowTableModal(false);
  };

  // SEO FIELD CHANGE
  const handleSeoChange = (field, value) => {
    setActiveArticle((prev) => ({
      ...prev,
      seo: {
        ...(prev.seo || {}),
        [field]: value
      }
    }));
  };

  // ADD SECONDARY KEYWORD
  const handleAddSecondaryKeyword = () => {
    if (!newKeywordInput.trim()) return;
    const trimmed = newKeywordInput.trim();
    const currentKeywords = activeArticle.seo?.secondaryKeywords || [];
    if (!currentKeywords.includes(trimmed)) {
      handleSeoChange("secondaryKeywords", [...currentKeywords, trimmed]);
    }
    setNewKeywordInput("");
  };

  const handleRemoveSecondaryKeyword = (kwToRemove) => {
    const currentKeywords = activeArticle.seo?.secondaryKeywords || [];
    handleSeoChange(
      "secondaryKeywords",
      currentKeywords.filter((kw) => kw !== kwToRemove)
    );
  };

  // LIVE SEO SCORE CALCULATION
  const seoChecklist = () => {
    if (!activeArticle) return { score: 0, items: [] };

    const focusKw = (activeArticle.seo?.focusKeyword || "").toLowerCase().trim();
    const title = (activeArticle.seo?.title || "").toLowerCase();
    const desc = (activeArticle.seo?.description || "").toLowerCase();
    const content = (rawHtmlContent || "").toLowerCase();
    const cleanText = content.replace(/<[^>]*>/g, " ");

    const checks = [
      {
        id: "title_kw",
        label: "Từ khóa chính xuất hiện trong SEO Title",
        passed: focusKw ? title.includes(focusKw) : false
      },
      {
        id: "desc_kw",
        label: "Từ khóa chính xuất hiện trong Meta Description",
        passed: focusKw ? desc.includes(focusKw) : false
      },
      {
        id: "content_kw",
        label: "Từ khóa chính xuất hiện trong nội dung bài viết",
        passed: focusKw ? cleanText.includes(focusKw) : false
      },
      {
        id: "heading_structure",
        label: "Nội dung có chứa các tiêu đề H2, H3 phân cấp",
        passed: content.includes("<h2") || content.includes("<h3")
      },
      {
        id: "image_alt",
        label: "Bài viết có hình ảnh kèm thẻ mô tả ALT",
        passed: content.includes("<img") && content.includes("alt=")
      },
      {
        id: "content_length",
        label: "Độ dài bài viết phong phú (> 300 từ)",
        passed: cleanText.trim().split(/\s+/).filter(Boolean).length >= 250
      },
      {
        id: "slug_friendly",
        label: "Đường dẫn SEO Slug thân thiện không dấu",
        passed: Boolean(activeArticle.seo?.slug && !/[^a-z0-9-]/.test(activeArticle.seo.slug))
      }
    ];

    const passedCount = checks.filter((c) => c.passed).length;
    const score = Math.round((passedCount / checks.length) * 100);

    return { score, items: checks, wordCount: cleanText.trim().split(/\s+/).filter(Boolean).length };
  };

  const seoResults = seoChecklist();

  // SAVE OR PUBLISH ARTICLE
  const handleSaveArticle = async (status = "published") => {
    setLoading(true);
    setSaveStatus(null);

    // Sync current editor HTML
    let finalContent = rawHtmlContent;
    if (editorRef.current && !isCodeView) {
      finalContent = editorRef.current.innerHTML;
    }

    const payload = {
      ...activeArticle,
      status: status,
      content: finalContent
    };

    try {
      let success = false;
      let message = `Đã ${status === "draft" ? "lưu bản nháp" : "xuất bản"} bài viết thành công!`;

      // 1. Save to Backend API
      if (import.meta.env.VITE_API_URL) {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/product-articles`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.success) {
          success = true;
          message = json.message || message;
        }
      } else {
        success = true;
      }

      // 2. Save to LocalStorage fallback
      const updatedList = articlesList.map((a) =>
        a.productCode.toUpperCase() === payload.productCode.toUpperCase() ? payload : a
      );
      if (!updatedList.some((a) => a.productCode.toUpperCase() === payload.productCode.toUpperCase())) {
        updatedList.push(payload);
      }
      setArticlesList(updatedList);
      localStorage.setItem("boss_admin_product_articles", JSON.stringify(updatedList));

      setActiveArticle(payload);
      setSaveStatus({ success: true, message });
      if (showToast) showToast(message);
    } catch (err) {
      console.error("Save article error:", err);
      // Fallback local save
      const updatedList = articlesList.map((a) =>
        a.productCode.toUpperCase() === payload.productCode.toUpperCase() ? payload : a
      );
      setArticlesList(updatedList);
      localStorage.setItem("boss_admin_product_articles", JSON.stringify(updatedList));
      setSaveStatus({ success: true, message: "✨ Đã lưu bài viết vào bộ nhớ an toàn!" });
    } finally {
      setLoading(false);
    }
  };

  // RESET TO DEFAULT ARTICLE
  const handleResetDefaults = async () => {
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn khôi phục bài viết mẫu chuẩn cho sản phẩm ${selectedProductCode}? Mọi thay đổi chưa lưu sẽ bị ghi đè.`
      )
    ) {
      return;
    }

    setLoading(true);
    const defaultItem = DEFAULT_PRODUCT_ARTICLES.find(
      (a) => a.productCode.toUpperCase() === selectedProductCode.toUpperCase()
    );

    if (defaultItem) {
      setActiveArticle(JSON.parse(JSON.stringify(defaultItem)));
      setRawHtmlContent(defaultItem.content);
      if (editorRef.current && !isCodeView) {
        editorRef.current.innerHTML = defaultItem.content;
      }
      setSaveStatus({ success: true, message: "🎉 Đã khôi phục bài viết mẫu chuẩn thành công!" });
    }
    setLoading(false);
  };

  if (!activeArticle) {
    return <div className="admin-loading-card">Đang tải trình soạn thảo bài viết sản phẩm...</div>;
  }

  return (
    <div className={`admin-product-article-wrapper ${isFullscreen ? "fullscreen-editor" : ""}`}>
      {/* 1. TOP HEADER & PRODUCT SELECTOR BAR */}
      <div className="article-editor-header-bar">
        <div className="header-left-col">
          {onBackToProducts && (
            <button
              type="button"
              className="btn-back-to-products-tab"
              onClick={onBackToProducts}
              title="Quay lại danh sách sản phẩm"
            >
              <ArrowLeft size={16} /> Danh sách SP
            </button>
          )}

          <div className="product-selector-group">
            <label className="selector-label">
              <FileText size={16} /> Chọn sản phẩm cần soạn thảo:
            </label>
            <div className="select-wrapper">
              <select
                value={selectedProductCode}
                onChange={(e) => handleSelectProduct(e.target.value)}
                className="product-dropdown"
              >
                {availableProductOptions.map((prod) => (
                  <option key={prod.code} value={prod.code}>
                    [{prod.code}] - {prod.title}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="dropdown-arrow" />
            </div>
          </div>

          <div className="status-indicator-badge">
            {activeArticle.status === "draft" ? (
              <span className="status-badge draft">
                <AlertCircle size={13} /> BẢN NHÁP (DRAFT)
              </span>
            ) : (
              <span className="status-badge published">
                <CheckCircle2 size={13} /> ĐÃ XUẤT BẢN (PUBLISHED)
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons Top */}
        <div className="header-right-actions">
          <Link
            to={
              activeArticle?.seo?.slug
                ? `/san-pham/${activeArticle.seo.slug}`
                : `/san-pham/${activeArticle.productCode}`
            }
            target="_blank"
            className="btn-header-action outline"
            title="Xem trực tiếp bài viết trên website"
          >
            <ExternalLink size={15} /> Xem bài viết
          </Link>

          <button
            type="button"
            className="btn-header-action outline"
            onClick={() => setShowPreviewModal(true)}
            title="Xem trước nội dung"
          >
            <Eye size={15} /> Xem trước
          </button>

          <button
            type="button"
            className="btn-header-action warning"
            onClick={handleResetDefaults}
            title="Khôi phục bài mẫu chuẩn của Boss Đà Nẵng"
          >
            <RefreshCw size={15} /> Mẫu chuẩn
          </button>

          <button
            type="button"
            className="btn-header-action draft-btn"
            onClick={() => handleSaveArticle("draft")}
            disabled={loading}
          >
            <Save size={15} /> Lưu nháp
          </button>

          <button
            type="button"
            className="btn-header-action publish-btn"
            onClick={() => handleSaveArticle("published")}
            disabled={loading}
          >
            <Send size={15} /> Xuất bản ngay
          </button>
        </div>
      </div>

      {saveStatus && (
        <div className={`save-status-toast ${saveStatus.success ? "success" : "error"}`}>
          <CheckCircle2 size={16} />
          <span>{saveStatus.message}</span>
          <button className="close-toast-btn" onClick={() => setSaveStatus(null)}>
            ✕
          </button>
        </div>
      )}

      {/* 2. MICROSOFT WORD STYLE RIBBON TOOLBAR */}
      <div className="word-ribbon-toolbar">
        {/* ROW 1: TEXT STYLES, HEADINGS, FONTS, COLORS */}
        <div className="toolbar-row-group">
          {/* Undo / Redo */}
          <div className="toolbar-btn-group">
            <button
              type="button"
              className="toolbar-btn"
              onClick={() => executeCommand("undo")}
              title="Hoàn tác (Ctrl+Z)"
            >
              <Undo size={15} />
            </button>
            <button
              type="button"
              className="toolbar-btn"
              onClick={() => executeCommand("redo")}
              title="Làm lại (Ctrl+Y)"
            >
              <Redo size={15} />
            </button>
          </div>

          <div className="toolbar-divider"></div>

          {/* Heading / Format Dropdown */}
          <div className="toolbar-select-group">
            <select
              onChange={(e) => {
                const val = e.target.value;
                if (val === "p") executeCommand("formatBlock", "<p>");
                else if (val === "h1") executeCommand("formatBlock", "<h1>");
                else if (val === "h2") executeCommand("formatBlock", "<h2>");
                else if (val === "h3") executeCommand("formatBlock", "<h3>");
                else if (val === "h4") executeCommand("formatBlock", "<h4>");
                else if (val === "blockquote") executeCommand("formatBlock", "<blockquote>");
                else if (val === "callout") {
                  executeCommand(
                    "insertHTML",
                    `<div class="editor-callout-box"><h4>💡 Điểm nhấn kỹ thuật:</h4><p>Nhập lưu ý quan trọng tại đây...</p></div><p></p>`
                  );
                }
                e.target.value = "default";
              }}
              defaultValue="default"
              className="toolbar-select"
            >
              <option value="default" disabled>
                Định dạng đoạn văn
              </option>
              <option value="p">Đoạn văn thường (Paragraph)</option>
              <option value="h1">Tiêu đề lớn (H1)</option>
              <option value="h2">Tiêu đề chính (H2)</option>
              <option value="h3">Tiêu đề phụ (H3)</option>
              <option value="h4">Tiêu đề nhỏ (H4)</option>
              <option value="blockquote">Trích dẫn (Quote)</option>
              <option value="callout">Khung chú thích nổi bật (Callout)</option>
            </select>
          </div>

          {/* Font Size Dropdown */}
          <div className="toolbar-select-group">
            <select
              onChange={(e) => {
                executeCommand("fontSize", e.target.value);
                e.target.value = "default";
              }}
              defaultValue="default"
              className="toolbar-select size-select"
            >
              <option value="default" disabled>
                Cỡ chữ
              </option>
              <option value="2">Nhỏ (13px)</option>
              <option value="3">Vừa (15px)</option>
              <option value="4">Lớn (18px)</option>
              <option value="5">Rất lớn (24px)</option>
            </select>
          </div>

          <div className="toolbar-divider"></div>

          {/* Basic Formatting: Bold, Italic, Underline, Strike */}
          <div className="toolbar-btn-group">
            <button
              type="button"
              className="toolbar-btn bold-btn"
              onClick={() => executeCommand("bold")}
              title="In đậm (Ctrl+B)"
            >
              <Bold size={15} />
            </button>
            <button
              type="button"
              className="toolbar-btn"
              onClick={() => executeCommand("italic")}
              title="In nghiêng (Ctrl+I)"
            >
              <Italic size={15} />
            </button>
            <button
              type="button"
              className="toolbar-btn"
              onClick={() => executeCommand("underline")}
              title="Gạch chân (Ctrl+U)"
            >
              <Underline size={15} />
            </button>
            <button
              type="button"
              className="toolbar-btn"
              onClick={() => executeCommand("strikeThrough")}
              title="Gạch ngang chữ"
            >
              <Strikethrough size={15} />
            </button>
          </div>

          <div className="toolbar-divider"></div>

          {/* Color & Highlight */}
          <div className="toolbar-btn-group">
            <label className="toolbar-color-label" title="Màu chữ">
              <Palette size={15} />
              <input
                type="color"
                className="hidden-color-picker"
                onChange={(e) => executeCommand("foreColor", e.target.value)}
              />
            </label>
            <label className="toolbar-color-label highlight" title="Màu nền highlight">
              <Highlighter size={15} />
              <input
                type="color"
                className="hidden-color-picker"
                onChange={(e) => executeCommand("hiliteColor", e.target.value)}
              />
            </label>
          </div>

          <div className="toolbar-divider"></div>

          {/* Clear Formatting */}
          <button
            type="button"
            className="toolbar-btn text-clear"
            onClick={() => executeCommand("removeFormat")}
            title="Xóa định dạng"
          >
            Tx
          </button>
        </div>

        {/* ROW 2: ALIGNMENT, LISTS, MEDIA, TABLE, CODE */}
        <div className="toolbar-row-group">
          {/* Alignment */}
          <div className="toolbar-btn-group">
            <button
              type="button"
              className="toolbar-btn"
              onClick={() => executeCommand("justifyLeft")}
              title="Căn trái"
            >
              <AlignLeft size={15} />
            </button>
            <button
              type="button"
              className="toolbar-btn"
              onClick={() => executeCommand("justifyCenter")}
              title="Căn giữa"
            >
              <AlignCenter size={15} />
            </button>
            <button
              type="button"
              className="toolbar-btn"
              onClick={() => executeCommand("justifyRight")}
              title="Căn phải"
            >
              <AlignRight size={15} />
            </button>
            <button
              type="button"
              className="toolbar-btn"
              onClick={() => executeCommand("justifyFull")}
              title="Căn đều"
            >
              <AlignJustify size={15} />
            </button>
          </div>

          <div className="toolbar-divider"></div>

          {/* Lists & Indent */}
          <div className="toolbar-btn-group">
            <button
              type="button"
              className="toolbar-btn"
              onClick={() => executeCommand("insertUnorderedList")}
              title="Danh sách dấu chấm (Bullet List)"
            >
              <List size={15} />
            </button>
            <button
              type="button"
              className="toolbar-btn"
              onClick={() => executeCommand("insertOrderedList")}
              title="Danh sách số (Numbered List)"
            >
              <ListOrdered size={15} />
            </button>
          </div>

          <div className="toolbar-divider"></div>

          {/* Insert Media & Elements */}
          <div className="toolbar-btn-group">
            <button
              type="button"
              className="toolbar-btn media-btn"
              onClick={() => setShowImageModal(true)}
              title="Chèn hình ảnh từ máy tính hoặc URL"
            >
              <Image size={15} />
              <span>Chèn ảnh</span>
            </button>
            <button
              type="button"
              className="toolbar-btn media-btn"
              onClick={() => setShowLinkModal(true)}
              title="Chèn liên kết URL"
            >
              <LinkIcon size={15} />
              <span>Chèn Link</span>
            </button>
            <button
              type="button"
              className="toolbar-btn media-btn"
              onClick={() => setShowVideoModal(true)}
              title="Chèn video YouTube"
            >
              <Video size={15} />
              <span>Chèn Video</span>
            </button>
            <button
              type="button"
              className="toolbar-btn media-btn"
              onClick={() => setShowTableModal(true)}
              title="Chèn bảng biểu (Table)"
            >
              <Table size={15} />
              <span>Tạo bảng</span>
            </button>
            <button
              type="button"
              className="toolbar-btn"
              onClick={() => executeCommand("insertHorizontalRule")}
              title="Chèn đường kẻ ngang phân cách"
            >
              ―
            </button>
          </div>

          <div className="toolbar-divider"></div>

          {/* Code View & Fullscreen */}
          <div className="toolbar-btn-group ml-auto">
            <button
              type="button"
              className={`toolbar-btn ${isCodeView ? "active-toggle" : ""}`}
              onClick={toggleCodeView}
              title="Chuyển đổi giữa chế độ Soạn thảo trực quan và Mã HTML"
            >
              <Code size={15} />
              <span>{isCodeView ? "Trực quan" : "Mã HTML"}</span>
            </button>

            <button
              type="button"
              className="toolbar-btn"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Thu nhỏ" : "Phóng to toàn màn hình"}
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. MAIN WORD-STYLE CANVAS (VÙNG SOẠN THẢO) */}
      <div className="word-canvas-outer-wrapper">
        <div className="word-document-page-sheet">
          {isCodeView ? (
            <textarea
              className="raw-html-source-editor"
              value={rawHtmlContent}
              onChange={(e) => {
                setRawHtmlContent(e.target.value);
                setActiveArticle((prev) => ({ ...prev, content: e.target.value }));
              }}
              placeholder="Nhập hoặc chỉnh sửa trực tiếp mã HTML..."
            />
          ) : (
            <div
              ref={editorRef}
              className="wysiwyg-content-editable-area"
              contentEditable
              suppressContentEditableWarning
              onInput={handleEditorChange}
              onPaste={handlePaste}
              placeholder="Bắt đầu viết bài giới thiệu chi tiết cho sản phẩm tại đây..."
            />
          )}
        </div>
      </div>

      {/* Word Count & Stats Bar */}
      <div className="editor-bottom-status-bar">
        <div className="stats-left">
          <span>
            Số từ: <strong>{seoResults.wordCount}</strong> từ
          </span>
          <span className="dot">•</span>
          <span>
            Điểm SEO: <strong className={seoResults.score >= 80 ? "good-score" : "warn-score"}>{seoResults.score}%</strong>
          </span>
          <span className="dot">•</span>
          <span>
            Trạng thái: <strong>{activeArticle.status === "draft" ? "Bản nháp" : "Đã xuất bản"}</strong>
          </span>
        </div>
        <div className="stats-right">
          <span>💡 Mẹo: Nhấn Enter để xuống đoạn mới, Shift + Enter để xuống dòng nhẹ.</span>
        </div>
      </div>

      {/* 4. THƯ VIỆN ẢNH ĐÃ UPLOAD CHO SẢN PHẨM NÀY */}
      {activeArticle.uploadedImages && activeArticle.uploadedImages.length > 0 && (
        <div className="uploaded-gallery-shelf">
          <div className="shelf-header">
            <h4>
              <Image size={15} /> Thư viện hình ảnh đã tải lên ({activeArticle.uploadedImages.length}):
            </h4>
            <div className="shelf-actions-group">
              <span className="shelf-hint">Bấm "+ Chèn" để đưa ảnh vào bài viết</span>
              <button
                type="button"
                className="btn-clear-shelf-all"
                onClick={handleClearAllUploadedImages}
                title="Xóa tất cả ảnh khỏi thư viện của sản phẩm này"
              >
                <Trash2 size={12} /> Xóa tất cả ({activeArticle.uploadedImages.length})
              </button>
            </div>
          </div>
          <div className="shelf-thumbnails-row">
            {activeArticle.uploadedImages.map((imgUrl, uIdx) => (
              <div key={uIdx} className="shelf-item-card">
                <img src={imgUrl} alt={`Ảnh ${uIdx + 1}`} />
                <button
                  type="button"
                  className="btn-shelf-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteUploadedImage(imgUrl);
                  }}
                  title="Xóa ảnh này khỏi thư viện"
                >
                  <Trash2 size={12} />
                </button>
                <button
                  type="button"
                  className="btn-quick-insert"
                  onClick={() => {
                    executeCommand(
                      "insertHTML",
                      `<figure class="editor-image-figure align-center" style="max-width: 85%;"><img src="${imgUrl}" alt="${activeArticle.productTitle}" /><figcaption>Hình ảnh chi tiết ${activeArticle.productTitle}</figcaption></figure><p></p>`
                    );
                    if (showToast) showToast("Đã chèn ảnh vào bài viết!");
                  }}
                  title="Chèn ảnh này vào bài"
                >
                  <Plus size={13} /> Chèn
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. KHU VỰC THÔNG TIN SEO SẢN PHẨM (YÊU CẦU MỤC 2) */}
      {/* ========================================================= */}
      <section className="admin-seo-management-section">
        <div className="seo-section-header">
          <div className="seo-header-title-wrap">
            <Sparkles size={18} className="seo-sparkle-icon" />
            <h3>TỐI ƯU HÓA TÌM KIẾM (SEO) CHO SẢN PHẨM NÀY</h3>
          </div>
          <div className="seo-score-meter">
            <span className="score-text">Chất lượng SEO:</span>
            <div className="score-badge-circle">
              <strong>{seoResults.score}</strong>/100
            </div>
          </div>
        </div>

        {/* Google SERP Snippet Preview */}
        <div className="google-snippet-preview-card">
          <div className="snippet-title-bar">
            <span>Mô phỏng hiển thị trên Google Search:</span>
          </div>
          <div className="snippet-body">
            <div className="google-url-row">
              https://bossdoordanang.com.vn &gt; san-pham &gt; {activeArticle.seo?.slug || activeArticle.productCode.toLowerCase()}
            </div>
            <div className="google-title-row">
              {activeArticle.seo?.title || `${activeArticle.productTitle} | Boss Đà Nẵng`}
            </div>
            <div className="google-desc-row">
              {activeArticle.seo?.description ||
                "Báo giá và thông số kỹ thuật chính thức từ nhà máy Boss Đà Nẵng. Khảo sát đo đạc tận nơi hoàn toàn miễn phí."}
            </div>
          </div>
        </div>

        {/* SEO Inputs Grid */}
        <div className="seo-form-inputs-grid">
          {/* SEO Title */}
          <div className="seo-form-group span-2">
            <div className="label-with-counter">
              <label>SEO Title (Tiêu đề tìm kiếm):</label>
              <span className={`char-counter ${(activeArticle.seo?.title?.length || 0) > 65 ? "over" : ""}`}>
                {activeArticle.seo?.title?.length || 0}/60 ký tự (Lý tưởng: 50 - 60)
              </span>
            </div>
            <input
              type="text"
              value={activeArticle.seo?.title || ""}
              onChange={(e) => handleSeoChange("title", e.target.value)}
              placeholder="Ví dụ: Cửa Kéo Công Nghệ Đức SR1 U Dày 1.3mm | Boss Đà Nẵng"
              className="seo-input"
            />
          </div>

          {/* Meta Description */}
          <div className="seo-form-group span-2">
            <div className="label-with-counter">
              <label>Meta Description (Đoạn mô tả hiển thị trên Google):</label>
              <span className={`char-counter ${(activeArticle.seo?.description?.length || 0) > 165 ? "over" : ""}`}>
                {activeArticle.seo?.description?.length || 0}/160 ký tự (Lý tưởng: 140 - 160)
              </span>
            </div>
            <textarea
              rows={3}
              value={activeArticle.seo?.description || ""}
              onChange={(e) => handleSeoChange("description", e.target.value)}
              placeholder="Tóm tắt nội dung hấp dẫn chứa từ khóa chính, kích thích khách hàng bấm vào xem..."
              className="seo-textarea"
            />
          </div>

          {/* Focus Keyword */}
          <div className="seo-form-group">
            <label>Focus Keyword (Từ khóa chính):</label>
            <input
              type="text"
              value={activeArticle.seo?.focusKeyword || ""}
              onChange={(e) => handleSeoChange("focusKeyword", e.target.value)}
              placeholder="Ví dụ: Cửa kéo công nghệ Đức SR1"
              className="seo-input"
            />
          </div>

          {/* SEO Slug */}
          <div className="seo-form-group">
            <label>SEO Slug (Đường dẫn thân thiện):</label>
            <input
              type="text"
              value={activeArticle.seo?.slug || ""}
              onChange={(e) => handleSeoChange("slug", e.target.value)}
              placeholder="cua-keo-cong-nghe-duc-sr1"
              className="seo-input"
            />
          </div>

          {/* Secondary Keywords (Từ khóa phụ) */}
          <div className="seo-form-group span-2">
            <label>Secondary Keywords (Các từ khóa phụ bổ trợ):</label>
            <div className="secondary-keywords-input-wrapper">
              <div className="keywords-chip-list">
                {(activeArticle.seo?.secondaryKeywords || []).map((kw, kIdx) => (
                  <span key={kIdx} className="keyword-chip">
                    {kw}
                    <button
                      type="button"
                      onClick={() => handleRemoveSecondaryKeyword(kw)}
                      className="btn-remove-chip"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
              <div className="add-keyword-row">
                <input
                  type="text"
                  value={newKeywordInput}
                  onChange={(e) => setNewKeywordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSecondaryKeyword();
                    }
                  }}
                  placeholder="Nhập từ khóa phụ rồi bấm Thêm (Ví dụ: giá cửa kéo đức, cửa kéo u 1.3mm...)"
                  className="keyword-input-box"
                />
                <button type="button" onClick={handleAddSecondaryKeyword} className="btn-add-keyword">
                  <Plus size={15} /> Thêm từ khóa
                </button>
              </div>
            </div>
          </div>

          {/* Image ALT */}
          <div className="seo-form-group">
            <label>Image ALT (Mô tả hình ảnh chuẩn SEO):</label>
            <input
              type="text"
              value={activeArticle.seo?.imageAlt || ""}
              onChange={(e) => handleSeoChange("imageAlt", e.target.value)}
              placeholder="Hình ảnh cửa kéo công nghệ Đức SR1 tại Đà Nẵng"
              className="seo-input"
            />
          </div>

          {/* Canonical URL */}
          <div className="seo-form-group">
            <label>Canonical URL (Nếu có):</label>
            <input
              type="text"
              value={activeArticle.seo?.canonicalUrl || ""}
              onChange={(e) => handleSeoChange("canonicalUrl", e.target.value)}
              placeholder="https://bossdoordanang.com.vn/san-pham/..."
              className="seo-input"
            />
          </div>
        </div>

        {/* Real-time SEO Checklist */}
        <div className="seo-checklist-card">
          <div className="checklist-title">
            <CheckCircle2 size={16} /> Danh sách kiểm tra chất lượng SEO:
          </div>
          <div className="checklist-grid">
            {seoResults.items.map((chk) => (
              <div key={chk.id} className={`checklist-item ${chk.passed ? "passed" : "failed"}`}>
                <span className="status-icon-wrap">{chk.passed ? <Check size={14} /> : <X size={14} />}</span>
                <span>{chk.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* MODAL 1: CHÈN HÌNH ẢNH */}
      {/* ========================================================= */}
      {showImageModal && (
        <div className="editor-modal-backdrop" onClick={() => setShowImageModal(false)}>
          <div className="editor-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top-bar">
              <h4>
                <Image size={18} /> Chèn hình ảnh vào bài viết
              </h4>
              <button className="btn-close-modal" onClick={() => setShowImageModal(false)}>
                ✕
              </button>
            </div>

            <div className="modal-tab-content">
              {/* Option 1: Upload from computer */}
              <div className="modal-field-box">
                <label>1. Tải ảnh từ máy tính lên máy chủ:</label>
                <div className="file-upload-drag-box">
                  <Upload size={24} className="upload-icon" />
                  <p>Chọn ảnh từ máy tính (hỗ trợ .jpg, .jpeg, .png, .webp):</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadLocalImage}
                    disabled={isUploadingImage}
                  />
                  {isUploadingImage && <span className="uploading-text">Đang tải ảnh lên...</span>}
                </div>
              </div>

              {/* Option 2: Image URL */}
              <div className="modal-field-box">
                <label>2. Hoặc dán đường dẫn hình ảnh (URL):</label>
                <input
                  type="text"
                  value={imageModalData.url}
                  onChange={(e) => setImageModalData({ ...imageModalData, url: e.target.value })}
                  placeholder="https://... hoặc /uploads/..."
                  className="modal-text-input"
                />
              </div>

              {/* Preview image */}
              {imageModalData.url && (
                <div className="modal-preview-wrapper">
                  <div className="modal-image-preview-frame">
                    <img src={imageModalData.url} alt="Xem trước ảnh" />
                  </div>
                  <button
                    type="button"
                    className="btn-clear-modal-img"
                    onClick={() => setImageModalData((prev) => ({ ...prev, url: "" }))}
                    title="Hủy chọn hoặc xóa ảnh này"
                  >
                    <Trash2 size={13} /> Xóa ảnh đang chọn
                  </button>
                </div>
              )}

              {/* Image ALT */}
              <div className="modal-field-box">
                <label>Thẻ mô tả hình ảnh (ALT text - Tối ưu SEO):</label>
                <input
                  type="text"
                  value={imageModalData.alt}
                  onChange={(e) => setImageModalData({ ...imageModalData, alt: e.target.value })}
                  placeholder="Mô tả nội dung bức ảnh..."
                  className="modal-text-input"
                />
              </div>

              {/* Caption */}
              <div className="modal-field-box">
                <label>Chú thích hiển thị dưới ảnh (Caption):</label>
                <input
                  type="text"
                  value={imageModalData.caption}
                  onChange={(e) => setImageModalData({ ...imageModalData, caption: e.target.value })}
                  placeholder="Ví dụ: Hình 1: Bộ cửa kéo SR1 hoàn thiện thực tế"
                  className="modal-text-input"
                />
              </div>

              {/* Alignment & Width */}
              <div className="modal-row-grid">
                <div className="modal-field-box">
                  <label>Căn lề ảnh:</label>
                  <select
                    value={imageModalData.align}
                    onChange={(e) => setImageModalData({ ...imageModalData, align: e.target.value })}
                    className="modal-text-input"
                  >
                    <option value="align-center">Căn giữa bài viết</option>
                    <option value="align-left">Căn trái (chữ bao quanh phải)</option>
                    <option value="align-right">Căn phải (chữ bao quanh trái)</option>
                  </select>
                </div>
                <div className="modal-field-box">
                  <label>Kích thước độ rộng:</label>
                  <select
                    value={imageModalData.width}
                    onChange={(e) => setImageModalData({ ...imageModalData, width: e.target.value })}
                    className="modal-text-input"
                  >
                    <option value="100%">Toàn chiều rộng (100%)</option>
                    <option value="85%">Chuẩn đẹp (85%)</option>
                    <option value="65%">Vừa phải (65%)</option>
                    <option value="50%">Nhỏ gọn (50%)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-bottom-actions">
              <button type="button" className="btn-modal-cancel" onClick={() => setShowImageModal(false)}>
                Hủy bỏ
              </button>
              <button type="button" className="btn-modal-confirm" onClick={confirmInsertImage}>
                Chèn hình ảnh vào bài
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: CHÈN LIÊN KẾT */}
      {/* ========================================================= */}
      {showLinkModal && (
        <div className="editor-modal-backdrop" onClick={() => setShowLinkModal(false)}>
          <div className="editor-modal-box sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top-bar">
              <h4>
                <LinkIcon size={18} /> Chèn liên kết (Hyperlink)
              </h4>
              <button className="btn-close-modal" onClick={() => setShowLinkModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-tab-content">
              <div className="modal-field-box">
                <label>Đường dẫn liên kết (URL):</label>
                <input
                  type="text"
                  value={linkModalData.url}
                  onChange={(e) => setLinkModalData({ ...linkModalData, url: e.target.value })}
                  placeholder="https://... hoặc /bang-gia"
                  className="modal-text-input"
                />
              </div>
              <div className="modal-field-box">
                <label>Văn bản hiển thị:</label>
                <input
                  type="text"
                  value={linkModalData.text}
                  onChange={(e) => setLinkModalData({ ...linkModalData, text: e.target.value })}
                  placeholder="Ví dụ: Bấm vào đây để xem bảng giá"
                  className="modal-text-input"
                />
              </div>
              <div className="modal-checkbox-row">
                <input
                  type="checkbox"
                  id="linkOpenTab"
                  checked={linkModalData.openNewTab}
                  onChange={(e) => setLinkModalData({ ...linkModalData, openNewTab: e.target.checked })}
                />
                <label htmlFor="linkOpenTab">Mở trong tab mới (target="_blank")</label>
              </div>
            </div>
            <div className="modal-bottom-actions">
              <button type="button" className="btn-modal-cancel" onClick={() => setShowLinkModal(false)}>
                Hủy bỏ
              </button>
              <button type="button" className="btn-modal-confirm" onClick={confirmInsertLink}>
                Chèn liên kết
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: CHÈN VIDEO */}
      {/* ========================================================= */}
      {showVideoModal && (
        <div className="editor-modal-backdrop" onClick={() => setShowVideoModal(false)}>
          <div className="editor-modal-box sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top-bar">
              <h4>
                <Video size={18} /> Chèn video YouTube
              </h4>
              <button className="btn-close-modal" onClick={() => setShowVideoModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-tab-content">
              <div className="modal-field-box">
                <label>Đường dẫn video YouTube:</label>
                <input
                  type="text"
                  value={videoModalData.url}
                  onChange={(e) => setVideoModalData({ ...videoModalData, url: e.target.value })}
                  placeholder="Ví dụ: https://www.youtube.com/watch?v=..."
                  className="modal-text-input"
                />
              </div>
            </div>
            <div className="modal-bottom-actions">
              <button type="button" className="btn-modal-cancel" onClick={() => setShowVideoModal(false)}>
                Hủy bỏ
              </button>
              <button type="button" className="btn-modal-confirm" onClick={confirmInsertVideo}>
                Chèn video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: TẠO BẢNG BIỂU */}
      {/* ========================================================= */}
      {showTableModal && (
        <div className="editor-modal-backdrop" onClick={() => setShowTableModal(false)}>
          <div className="editor-modal-box sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top-bar">
              <h4>
                <Table size={18} /> Tạo bảng biểu nội dung
              </h4>
              <button className="btn-close-modal" onClick={() => setShowTableModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-tab-content">
              <div className="modal-row-grid">
                <div className="modal-field-box">
                  <label>Số hàng (Rows):</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={tableModalData.rows}
                    onChange={(e) => setTableModalData({ ...tableModalData, rows: e.target.value })}
                    className="modal-text-input"
                  />
                </div>
                <div className="modal-field-box">
                  <label>Số cột (Columns):</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={tableModalData.cols}
                    onChange={(e) => setTableModalData({ ...tableModalData, cols: e.target.value })}
                    className="modal-text-input"
                  />
                </div>
              </div>
              <div className="modal-checkbox-row">
                <input
                  type="checkbox"
                  id="tableHeaderCheck"
                  checked={tableModalData.hasHeader}
                  onChange={(e) => setTableModalData({ ...tableModalData, hasHeader: e.target.checked })}
                />
                <label htmlFor="tableHeaderCheck">Có hàng tiêu đề nổi bật (Header row)</label>
              </div>
            </div>
            <div className="modal-bottom-actions">
              <button type="button" className="btn-modal-cancel" onClick={() => setShowTableModal(false)}>
                Hủy bỏ
              </button>
              <button type="button" className="btn-modal-confirm" onClick={confirmInsertTable}>
                Tạo bảng ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: XEM TRƯỚC (PREVIEW MODAL) */}
      {/* ========================================================= */}
      {showPreviewModal && (
        <div className="editor-modal-backdrop" onClick={() => setShowPreviewModal(false)}>
          <div className="editor-preview-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top-bar">
              <h4>
                <Eye size={18} /> Xem trước bài viết: {activeArticle.productTitle}
              </h4>
              <button className="btn-close-modal" onClick={() => setShowPreviewModal(false)}>
                ✕
              </button>
            </div>
            <div className="preview-rendered-body">
              <div
                className="product-article-rendered-stream"
                dangerouslySetInnerHTML={{ __html: rawHtmlContent }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

