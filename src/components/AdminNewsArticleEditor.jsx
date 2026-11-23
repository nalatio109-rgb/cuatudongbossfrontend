import React, { useState, useRef, useEffect } from "react";
import {
  FileText,
  Save,
  X,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Bold,
  Italic,
  List,
  Heading,
  Code,
  Eye,
  Table,
  Trash2,
  CheckCircle2,
  Info,
  Link as LinkIcon,
  Unlink,
  ExternalLink,
  Newspaper,
  Calendar,
  User,
  Tag,
  Copy,
  Check,
  Edit3,
  Plus,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight
} from "lucide-react";
import "./AdminProjectArticleEditor.css";
import { slugify } from "../utils/slug";

export const SAMPLE_NEWS_TEMPLATE = {
  title: "Kinh nghiệm lựa chọn cửa cuốn khe thoáng công nghệ Đức chính hãng tại Đà Nẵng",
  slug: "kinh-nghiem-lua-chon-cua-cuon-khe-thoang-cong-nghe-duc-chinh-hang-tai-da-nang",
  category: "Tư vấn & Kinh nghiệm",
  author: "BOSS Đà Nẵng",
  date: new Date().toLocaleDateString("vi-VN"),
  image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
  summary: "Hướng dẫn thực tế từ chuyên gia kỹ thuật BOSS Đà Nẵng giúp gia chủ chọn đúng nan nhôm hợp kim chống bão, mô tơ đồng bộ và phụ kiện an toàn tối ưu cho nhà phố.",
  content: `<p style="line-height: 1.8; color: #334155; margin-bottom: 16px; font-size: 1.05rem;">
  Tại Đà Nẵng – thành phố ven biển với đặc trưng gió mùa và mưa bão hàng năm, việc lựa chọn một bộ 
  <a href="https://zalo.me/0904678323" target="_blank" rel="noopener noreferrer" style="color: #2563eb; font-weight: 700; text-decoration: underline; text-decoration-color: #3b82f6; text-underline-offset: 3.5px; text-decoration-thickness: 2px; cursor: pointer;">cửa cuốn khe thoáng công nghệ Đức</a> 
  đạt chuẩn chất lượng là ưu tiên hàng đầu của mọi gia đình. Dưới đây là những kinh nghiệm cốt lõi giúp bạn chọn đúng sản phẩm bền đẹp và an toàn nhất.
</p>

<table class="project-specs-table" style="width: 100%; border-collapse: collapse; margin: 16px 0 24px 0; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
  <tbody>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px 14px; font-weight: 700; color: #07522f; width: 25%; background: #f1f5f9;">Tiêu chí nan cửa:</td>
      <td style="padding: 10px 14px; color: #1e293b; width: 75%;">Hợp kim nhôm 6063-T5 tiêu chuẩn hàng không, sơn tĩnh điện ngoài trời AkzoNobel CHLB Đức bảo hành 5 - 10 năm.</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px 14px; font-weight: 700; color: #07522f; background: #f1f5f9;">Hệ thống mô tơ:</td>
      <td style="padding: 10px 14px; color: #1e293b;">Mô tơ lõi đồng 100%, tích hợp cảm biến tự dừng khi gặp vật cản và còi báo động chống cạy phá.</td>
    </tr>
    <tr>
      <td style="padding: 10px 14px; font-weight: 700; color: #07522f; background: #f1f5f9;">Bộ điều khiển:</td>
      <td style="padding: 10px 14px; color: #1e293b;">Hộp nhận tín hiệu mã nhảy Rolling Code chống sao chép tần số bảo mật tuyệt đối.</td>
    </tr>
  </tbody>
</table>

<h3 style="color: #07522f; font-size: 1.2rem; font-weight: 700; margin: 24px 0 10px 0;">1. Lựa chọn độ dày nan cửa theo diện tích mặt tiền</h3>
<p style="margin-bottom: 14px; line-height: 1.75; color: #334155;">
  Độ dày nan cửa quyết định trực tiếp tới khả năng chịu lực uốn và chống va đập khi có giông lốc. Với cửa rộng dưới 3.5m, độ dày từ 1.0mm - 1.2mm là lý tưởng. Đối với cửa mặt tiền lớn từ 4m - 6m, nên ưu tiên các dòng nan dày từ 1.3mm - 1.8mm có thanh giằng chịu lực gia cường.
</p>

<figure class="project-article-figure" style="text-align: center; margin: 24px 0;">
  <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80" alt="Cửa cuốn khe thoáng lắp đặt thực tế" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.12); border: 1px solid #cbd5e1;" />
  <figcaption style="margin-top: 8px; font-size: 0.88rem; color: #64748b; font-style: italic; text-align: center;">Hình ảnh 1: Mẫu nan cửa cuốn khe thoáng sơn tĩnh điện cao cấp lắp đặt tại công trình</figcaption>
</figure>

<h3 style="color: #07522f; font-size: 1.2rem; font-weight: 700; margin: 24px 0 10px 0;">2. Công nghệ giảm chấn 2 chiều vận hành êm ái</h3>
<p style="margin-bottom: 14px; line-height: 1.75; color: #334155;">
  Các mẫu cửa cuốn thế hệ mới được trang bị gioăng giảm chấn 2 chiều giữa các nan cửa, giúp triệt tiêu tới 95% tiếng ồn khi đóng mở. Điều này đặc biệt phù hợp cho các gia đình có người lớn tuổi hoặc trẻ nhỏ cần không gian yên tĩnh.
</p>

<h3 style="color: #07522f; font-size: 1.2rem; font-weight: 700; margin: 24px 0 10px 0;">3. Đơn vị thi công và chính sách bảo hành</h3>
<p style="margin-bottom: 14px; line-height: 1.75; color: #334155;">
  Khách hàng nên chọn đơn vị có showroom trưng bày thực tế, đội ngũ kỹ thuật lành nghề trực tiếp đo đạc và có cam kết cứu hộ kỹ thuật 24/7 như <strong>BOSS Đà Nẵng</strong> để luôn an tâm trong suốt quá trình sử dụng.
</p>`
};

export default function AdminNewsArticleEditor({
  newsForm,
  setNewsForm,
  editingNews,
  onSave,
  onCancel,
  showToast,
  compressImage
}) {
  const editorRef = useRef(null);
  const lastHtmlRef = useRef(newsForm.content || "");
  const [editorMode, setEditorMode] = useState("wysiwyg"); // "wysiwyg" | "code" | "preview"

  // Image inserter popover
  const [showImageInserter, setShowImageInserter] = useState(false);
  const [insertImageUrl, setInsertImageUrl] = useState("");
  const [insertImageCaption, setInsertImageCaption] = useState("");
  const [isUploadingInsertImg, setIsUploadingInsertImg] = useState(false);
  const [insertImgWidth, setInsertImgWidth] = useState("100%");

  // Image resizer & align controller
  const [selectedImgEl, setSelectedImgEl] = useState(null);
  const [selectedImgSize, setSelectedImgSize] = useState("100%");
  const [imgToolbarPos, setImgToolbarPos] = useState(null);

  // Hyperlink popover
  const [showLinkPopover, setShowLinkPopover] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [linkOpenNewTab, setLinkOpenNewTab] = useState(true);
  const savedRangeRef = useRef(null);
  const editingAnchorRef = useRef(null);

  // Floating link hover preview card
  const [hoveredLink, setHoveredLink] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const hoverTimeoutRef = useRef(null);
  const sheetContainerRef = useRef(null);

  // Mở popup gắn link
  const handleOpenLinkPopover = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (editorMode !== "wysiwyg") setEditorMode("wysiwyg");

    const sel = window.getSelection();
    let selectedStr = "";
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
        savedRangeRef.current = range.cloneRange();
        selectedStr = range.toString().trim();
      }
    }

    if (sel && sel.anchorNode) {
      const anchorEl = sel.anchorNode.parentElement?.closest("a");
      if (anchorEl) {
        editingAnchorRef.current = anchorEl;
        const existingHref = anchorEl.getAttribute("href") || "";
        if (existingHref) setLinkUrl(existingHref);
        if (!selectedStr) selectedStr = anchorEl.textContent.trim();
        setLinkOpenNewTab(anchorEl.target === "_blank");
      }
    }

    setLinkText(selectedStr);
    setShowImageInserter(false);
    setShowLinkPopover(true);
  };

  // Xác nhận gắn link màu xanh dương và gạch chân
  const handleConfirmInsertLink = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    let cleanUrl = linkUrl.trim();
    if (!cleanUrl) {
      alert("Vui lòng nhập hoặc dán địa chỉ đường dẫn (URL) liên kết!");
      return;
    }

    if (
      !cleanUrl.startsWith("http://") &&
      !cleanUrl.startsWith("https://") &&
      !cleanUrl.startsWith("/") &&
      !cleanUrl.startsWith("#") &&
      !cleanUrl.startsWith("tel:") &&
      !cleanUrl.startsWith("mailto:")
    ) {
      cleanUrl = "https://" + cleanUrl;
    }

    const displayText = linkText.trim() || cleanUrl;
    const targetAttr = linkOpenNewTab ? ' target="_blank" rel="noopener noreferrer"' : "";
    const inlineStyle = "color: #2563eb; font-weight: 700; text-decoration: underline; text-decoration-color: #3b82f6; text-underline-offset: 3.5px; text-decoration-thickness: 2px; cursor: pointer;";

    if (editorRef.current) {
      // Trường hợp 1: Chỉnh sửa thẻ a đang có từ floating preview hoặc selection
      if (editingAnchorRef.current && editorRef.current.contains(editingAnchorRef.current)) {
        const anchor = editingAnchorRef.current;
        anchor.href = cleanUrl;
        anchor.textContent = displayText;
        anchor.title = `Liên kết: ${cleanUrl}`;
        anchor.setAttribute("data-link-url", cleanUrl);
        if (linkOpenNewTab) {
          anchor.target = "_blank";
          anchor.rel = "noopener noreferrer";
        } else {
          anchor.removeAttribute("target");
          anchor.removeAttribute("rel");
        }
        anchor.style.cssText = inlineStyle;
        editingAnchorRef.current = null;
        editorRef.current.focus();
        handleContentInput();
        setShowLinkPopover(false);
        setLinkUrl("");
        setLinkText("");
        savedRangeRef.current = null;
        if (showToast) showToast(`🔗 Đã cập nhật link vào chữ "${displayText}"!`);
        return;
      }

      // Trường hợp 2: Chèn thẻ a mới vào vùng bôi đen (selection)
      const range = savedRangeRef.current;
      if (range && editorRef.current.contains(range.commonAncestorContainer)) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        const linkEl = document.createElement("a");
        linkEl.href = cleanUrl;
        linkEl.title = `Liên kết: ${cleanUrl}`;
        linkEl.setAttribute("data-link-url", cleanUrl);
        linkEl.className = "project-article-link";
        if (linkOpenNewTab) {
          linkEl.target = "_blank";
          linkEl.rel = "noopener noreferrer";
        }
        linkEl.style.cssText = inlineStyle;
        linkEl.textContent = displayText;

        range.deleteContents();
        range.insertNode(linkEl);

        const newRange = document.createRange();
        newRange.setStartAfter(linkEl);
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);

        editorRef.current.focus();
        handleContentInput();
      } else {
        editorRef.current.focus();
        const linkHtml = `<a href="${cleanUrl}"${targetAttr} title="Liên kết: ${cleanUrl}" data-link-url="${cleanUrl}" class="project-article-link" style="${inlineStyle}">${displayText}</a>`;
        document.execCommand("insertHTML", false, linkHtml);
        handleContentInput();
      }
    } else {
      const linkHtml = `<a href="${cleanUrl}"${targetAttr} title="Liên kết: ${cleanUrl}" data-link-url="${cleanUrl}" class="project-article-link" style="${inlineStyle}">${displayText}</a>`;
      setNewsForm((prev) => ({
        ...prev,
        content: (prev.content || "") + linkHtml
      }));
    }

    setShowLinkPopover(false);
    setLinkUrl("");
    setLinkText("");
    savedRangeRef.current = null;
    editingAnchorRef.current = null;
    if (showToast) showToast(`🔗 Đã gắn link màu xanh dương vào chữ "${displayText}"!`);
  };

  // Gỡ link
  const handleUnlink = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (editorMode !== "wysiwyg") return;
    if (editorRef.current) {
      const range = savedRangeRef.current;
      if (range && editorRef.current.contains(range.commonAncestorContainer)) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        const anchorEl = range.commonAncestorContainer.nodeType === 1
          ? range.commonAncestorContainer.closest("a")
          : range.commonAncestorContainer.parentElement?.closest("a");

        if (anchorEl) {
          const parent = anchorEl.parentNode;
          while (anchorEl.firstChild) {
            parent.insertBefore(anchorEl.firstChild, anchorEl);
          }
          parent.removeChild(anchorEl);
          handleContentInput();
          setShowLinkPopover(false);
          savedRangeRef.current = null;
          editingAnchorRef.current = null;
          if (showToast) showToast("✂️ Đã gỡ bỏ liên kết thành công!");
          return;
        }
      }
      editorRef.current.focus();
      document.execCommand("unlink", false, null);
      handleContentInput();
      setShowLinkPopover(false);
      savedRangeRef.current = null;
      editingAnchorRef.current = null;
      if (showToast) showToast("✂️ Đã gỡ bỏ liên kết thành công!");
    }
  };

  // Hover detection over links in editor or preview
  const handleEditorMouseOver = (e) => {
    const anchor = e.target.closest("a");
    if (anchor && (editorRef.current?.contains(anchor) || sheetContainerRef.current?.contains(anchor))) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      const rect = anchor.getBoundingClientRect();
      const href = anchor.getAttribute("href") || anchor.href || "";
      const text = anchor.innerText || anchor.textContent || "";
      const openNewTab = anchor.target === "_blank";
      setHoveredLink({
        href,
        text,
        openNewTab,
        rect,
        anchorEl: anchor
      });
    }
  };

  const handleEditorMouseOut = (e) => {
    const anchor = e.target.closest("a");
    if (anchor) {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredLink(null);
      }, 300);
    }
  };

  const handleCopyFloatingLink = (url) => {
    if (!url) return;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 1600);
        if (showToast) showToast("📋 Đã sao chép liên kết vào clipboard!");
      }).catch(() => {
        if (showToast) showToast("📋 Đã sao chép liên kết!");
      });
    } else {
      if (showToast) showToast(`📋 Link: ${url}`);
    }
  };

  const handleEditFloatingLink = (linkItem) => {
    if (!linkItem) return;
    setLinkUrl(linkItem.href || "");
    setLinkText(linkItem.text || "");
    setLinkOpenNewTab(linkItem.openNewTab || false);

    if (linkItem.anchorEl) {
      editingAnchorRef.current = linkItem.anchorEl;
      if (editorRef.current) {
        const range = document.createRange();
        range.selectNodeContents(linkItem.anchorEl);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        savedRangeRef.current = range;
      }
    }
    setHoveredLink(null);
    setShowLinkPopover(true);
  };

  const handleUnlinkFloating = (anchorEl) => {
    if (!anchorEl || !anchorEl.parentNode) return;
    const parent = anchorEl.parentNode;
    while (anchorEl.firstChild) {
      parent.insertBefore(anchorEl.firstChild, anchorEl);
    }
    parent.removeChild(anchorEl);
    setHoveredLink(null);
    handleContentInput();
    if (showToast) showToast("✂️ Đã gỡ bỏ liên kết thành công!");
  };

  // Close floating card on window scroll or resize
  useEffect(() => {
    const handleScrollOrResize = () => {
      if (hoveredLink) setHoveredLink(null);
      if (selectedImgEl) {
        const rect = selectedImgEl.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) {
          selectedImgEl.classList.remove("img-selected");
          selectedImgEl.removeAttribute("data-selected");
          setSelectedImgEl(null);
          setImgToolbarPos(null);
        } else {
          setImgToolbarPos({
            top: Math.max(10, rect.top - 52),
            left: rect.left + rect.width / 2
          });
        }
      }
    };
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [hoveredLink, selectedImgEl]);

  // Tự động gán title cho tất cả thẻ a trong editor nếu thiếu
  useEffect(() => {
    if (editorRef.current) {
      const anchors = editorRef.current.querySelectorAll("a");
      anchors.forEach((a) => {
        const href = a.getAttribute("href");
        if (href && !a.getAttribute("title")) {
          a.setAttribute("title", `Liên kết: ${href}`);
        }
      });
    }
  }, [newsForm.content, editorMode]);

  // Đồng bộ nội dung vào editor DOM
  useEffect(() => {
    if (editorRef.current && editorMode === "wysiwyg") {
      const currentHtml = newsForm.content || "";
      if (editorRef.current.innerHTML !== currentHtml) {
        if (document.activeElement !== editorRef.current) {
          editorRef.current.innerHTML = currentHtml;
          lastHtmlRef.current = currentHtml;
        }
      }
    }
  }, [editingNews, editorMode]);

  const handleContentInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    lastHtmlRef.current = html;
    setNewsForm((prev) => ({ ...prev, content: html }));
  };

  const handleFormSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    let finalContent = newsForm.content || "";
    if (editorMode === "wysiwyg" && editorRef.current) {
      finalContent = editorRef.current.innerHTML;
      lastHtmlRef.current = finalContent;
    }
    setNewsForm((prev) => ({ ...prev, content: finalContent }));
    if (onSave) {
      onSave(e, finalContent);
    }
  };

  const execCmd = (command, value = null) => {
    if (editorMode !== "wysiwyg") return;
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      handleContentInput();
    }
  };

  // 1-Click Load Sample News Article
  const handleLoadSample = () => {
    if (
      newsForm.content &&
      newsForm.content.trim().length > 10 &&
      !window.confirm("Nạp bài mẫu sẽ thay thế nội dung hiện tại. Bạn có chắc chắn muốn nạp?")
    ) {
      return;
    }

    setNewsForm((prev) => ({
      ...prev,
      title: prev.title || SAMPLE_NEWS_TEMPLATE.title,
      slug: prev.slug || SAMPLE_NEWS_TEMPLATE.slug,
      category: prev.category || SAMPLE_NEWS_TEMPLATE.category,
      author: prev.author || SAMPLE_NEWS_TEMPLATE.author,
      date: prev.date || SAMPLE_NEWS_TEMPLATE.date,
      image: prev.image || SAMPLE_NEWS_TEMPLATE.image,
      summary: prev.summary || SAMPLE_NEWS_TEMPLATE.summary,
      content: SAMPLE_NEWS_TEMPLATE.content
    }));

    if (editorRef.current) {
      editorRef.current.innerHTML = SAMPLE_NEWS_TEMPLATE.content;
    }

    if (showToast) {
      showToast("⚡ Đã nạp thành công bài viết tin tức mẫu chuẩn SEO!");
    }
  };

  // Insert Quick Table
  const handleInsertTable = () => {
    const tableHtml = `
<table class="project-specs-table" style="width: 100%; border-collapse: collapse; margin: 16px 0 24px 0; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
  <tbody>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px 14px; font-weight: 700; color: #07522f; width: 30%; background: #f1f5f9;">Mục so sánh / Tiêu chí:</td>
      <td style="padding: 10px 14px; color: #1e293b; width: 70%;">Thông tin chi tiết khuyến nghị...</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px 14px; font-weight: 700; color: #07522f; background: #f1f5f9;">Ưu điểm nổi bật:</td>
      <td style="padding: 10px 14px; color: #1e293b;">Bền bỉ, chống ăn mòn, vận hành êm ái</td>
    </tr>
    <tr>
      <td style="padding: 10px 14px; font-weight: 700; color: #07522f; background: #f1f5f9;">Bảo hành & Hỗ trợ:</td>
      <td style="padding: 10px 14px; color: #1e293b;">Bảo hành chính hãng, cứu hộ 24/7</td>
    </tr>
  </tbody>
</table><p><br></p>`;

    if (editorMode === "wysiwyg" && editorRef.current) {
      editorRef.current.focus();
      document.execCommand("insertHTML", false, tableHtml);
      handleContentInput();
    } else {
      setNewsForm((prev) => ({
        ...prev,
        content: (prev.content || "") + tableHtml
      }));
    }
    if (showToast) showToast("📊 Đã chèn bảng thông tin vào bài viết!");
  };

  // Upload image to insert into article
  const handleUploadInsertImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingInsertImg(true);

    try {
      let compressed = file;
      if (compressImage) {
        try {
          compressed = await compressImage(file);
        } catch (_) {}
      }

      const backendBase = import.meta.env.VITE_API_URL || "";
      const uploadEndpoint = backendBase ? `${backendBase}/api/upload` : "/api/upload";

      let uploadedUrl = null;
      try {
        const formData = new FormData();
        formData.append("image", compressed);
        const res = await fetch(uploadEndpoint, {
          method: "POST",
          body: formData
        });
        if (res.ok) {
          const data = await res.json();
          uploadedUrl = data.url || data.secure_url || data.imageUrl || (data.data && data.data.url);
        }
      } catch (_) {}

      if (!uploadedUrl) {
        uploadedUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target.result);
          reader.readAsDataURL(compressed);
        });
      }

      if (uploadedUrl) {
        setInsertImageUrl(uploadedUrl);
        if (showToast) showToast("✅ Tải ảnh lên thành công! Bấm 'Chèn vào bài' để đặt ảnh.");
      }
    } catch (err) {
      if (showToast) showToast("❌ Không thể tải ảnh: " + err.message);
    } finally {
      setIsUploadingInsertImg(false);
      e.target.value = "";
    }
  };


  // Confirm Insert Image into Article
  const handleConfirmInsertImage = () => {
    if (!insertImageUrl.trim()) {
      alert("Vui lòng chọn ảnh từ máy hoặc dán link ảnh trước!");
      return;
    }

    const captionText = insertImageCaption.trim() || "Hình ảnh minh họa bài viết";
    const chosenWidth = insertImgWidth || "100%";
    const figureHtml = `
<figure class="project-article-figure" style="text-align: center; margin: 24px auto;">
  <img src="${insertImageUrl.trim()}" alt="${captionText}" style="width: ${chosenWidth}; max-width: 100%; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.12); border: 1px solid #e2e8f0; display: block; margin: 0 auto;" />
  <figcaption style="margin-top: 8px; font-size: 0.88rem; color: #64748b; font-style: italic; text-align: center;">${captionText}</figcaption>
</figure><p><br></p>`;

    if (editorMode === "wysiwyg" && editorRef.current) {
      editorRef.current.focus();
      document.execCommand("insertHTML", false, figureHtml);
      handleContentInput();
    } else {
      setNewsForm((prev) => ({
        ...prev,
        content: (prev.content || "") + figureHtml
      }));
    }

    // Auto set as thumbnail image if none selected
    setNewsForm((prev) => ({
      ...prev,
      image: prev.image || insertImageUrl.trim()
    }));

    setInsertImageUrl("");
    setInsertImageCaption("");
    setShowImageInserter(false);

    if (showToast) showToast("📷 Đã chèn hình ảnh và chú thích vào bài viết thành công!");
  };

  // Lắng nghe click vào ảnh để bật thanh điều khiển kích thước ảnh
  const handleEditorClick = (e) => {
    const target = e.target;
    if (target && target.tagName === "IMG") {
      e.stopPropagation();
      if (selectedImgEl && selectedImgEl !== target) {
        selectedImgEl.classList.remove("img-selected");
        selectedImgEl.removeAttribute("data-selected");
      }
      target.classList.add("img-selected");
      target.setAttribute("data-selected", "true");
      setSelectedImgEl(target);
      const rect = target.getBoundingClientRect();
      const currentWidth = target.style.width || "100%";
      setSelectedImgSize(currentWidth);
      setImgToolbarPos({
        top: Math.max(10, rect.top - 52),
        left: rect.left + rect.width / 2
      });
    } else {
      if (selectedImgEl && !e.target.closest(".editor-image-control-toolbar")) {
        selectedImgEl.classList.remove("img-selected");
        selectedImgEl.removeAttribute("data-selected");
        setSelectedImgEl(null);
        setImgToolbarPos(null);
      }
    }
  };

  const handleSetImageSize = (sizePercent) => {
    if (!selectedImgEl) return;
    selectedImgEl.style.width = sizePercent;
    selectedImgEl.style.maxWidth = "100%";
    selectedImgEl.style.height = "auto";
    if (!selectedImgEl.style.margin) {
      selectedImgEl.style.margin = "16px auto";
      selectedImgEl.style.display = "block";
    }
    setSelectedImgSize(sizePercent);
    setTimeout(() => {
      if (selectedImgEl) {
        const rect = selectedImgEl.getBoundingClientRect();
        setImgToolbarPos({
          top: Math.max(10, rect.top - 52),
          left: rect.left + rect.width / 2
        });
      }
    }, 50);
    handleContentInput();
  };

  const handleStepImageSize = (deltaPercent) => {
    if (!selectedImgEl) return;
    let currentVal = parseInt(selectedImgEl.style.width || "100", 10);
    if (isNaN(currentVal)) currentVal = 100;
    let nextVal = Math.min(100, Math.max(20, currentVal + deltaPercent));
    handleSetImageSize(`${nextVal}%`);
  };

  const handleSetImageAlign = (align) => {
    if (!selectedImgEl) return;
    if (align === "center") {
      selectedImgEl.style.display = "block";
      selectedImgEl.style.margin = "16px auto";
      selectedImgEl.style.float = "none";
    } else if (align === "left") {
      selectedImgEl.style.display = "inline-block";
      selectedImgEl.style.margin = "10px 18px 10px 0";
      selectedImgEl.style.float = "left";
    } else if (align === "right") {
      selectedImgEl.style.display = "inline-block";
      selectedImgEl.style.margin = "10px 0 10px 18px";
      selectedImgEl.style.float = "right";
    }
    handleContentInput();
  };

  const handleDeleteSelectedImg = () => {
    if (!selectedImgEl) return;
    const parent = selectedImgEl.parentElement;
    if (parent && parent.tagName === "FIGURE") {
      parent.remove();
    } else {
      selectedImgEl.remove();
    }
    setSelectedImgEl(null);
    setImgToolbarPos(null);
    handleContentInput();
    if (showToast) showToast("🗑️ Đã xóa hình ảnh khỏi bài viết");
  };

  const handleClearArticle = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ nội dung bài viết này không?")) {
      setNewsForm((prev) => ({ ...prev, content: "" }));
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
    }
  };

  // Xử lý khi dán (Paste): Tự động co mọi hình ảnh và bảng vừa khít 100% chiều ngang khung
  const handleEditorPaste = () => {
    setTimeout(() => {
      if (editorRef.current) {
        const imgs = editorRef.current.querySelectorAll("img");
        imgs.forEach((img) => {
          img.style.maxWidth = "100%";
          img.style.height = "auto";
          img.removeAttribute("width");
          img.removeAttribute("height");
        });
        const tables = editorRef.current.querySelectorAll("table");
        tables.forEach((tbl) => {
          tbl.style.maxWidth = "100%";
          tbl.style.width = "100%";
          tbl.style.tableLayout = "fixed";
          tbl.removeAttribute("width");
        });
        handleContentInput();
      }
    }, 50);
  };

  return (
    <div className="project-article-unified-editor">
      <form onSubmit={handleFormSubmit}>
        {/* ================= PHẦN 1: THÔNG TIN CƠ BẢN ================= */}
        <div className="editor-basic-section">
          <div className="admin-form-group">
            <label className="field-label-prominent">
              Tiêu đề bài viết tin tức *
            </label>
            <input
              type="text"
              value={newsForm.title}
              onChange={(e) => {
                const newTitle = e.target.value;
                setNewsForm((prev) => ({
                  ...prev,
                  title: newTitle,
                  slug: !editingNews ? slugify(newTitle) : prev.slug
                }));
              }}
              required
              className="input-title-large"
              placeholder="Ví dụ: Kinh nghiệm lựa chọn cửa cuốn khe thoáng công nghệ Đức chính hãng"
            />
          </div>

          <div className="admin-form-group">
            <label>Ngày đăng bài (Gần đây nhất hiển thị lên đầu)</label>
            <div style={{ display: "flex", gap: "6px", alignItems: "center", maxWidth: "360px" }}>
              <input
                type="text"
                value={newsForm.date || ""}
                onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                placeholder="Ví dụ: 19/11/2026"
                style={{ flex: 1 }}
              />
              <input
                type="date"
                title="Chọn nhanh từ lịch"
                style={{ width: "40px", height: "38px", padding: "4px", cursor: "pointer", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#f8fafc" }}
                onChange={(e) => {
                  if (e.target.value) {
                    const [y, m, d] = e.target.value.split("-");
                    setNewsForm({ ...newsForm, date: `${d}/${m}/${y}` });
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* ================= PHẦN 2: BÀI VIẾT CHI TIẾT (CHỮ XEN KẼ HÌNH ẢNH) ================= */}
        <div className="editor-article-section">
          <div className="article-section-header">
            <div>
              <h4 className="article-section-title">
                <Newspaper size={18} color="#10b981" />
                Nội Dung Bài Viết Chi Tiết (Chữ xen kẽ Hình ảnh & Bảng)
              </h4>
              <p className="article-section-desc">
                Soạn bài viết tin tức trực quan: gõ chữ, chèn hình ảnh minh họa kèm chú thích, chèn bảng thông tin so sánh, gắn link liên kết.
              </p>
            </div>

            {/* NÚT NẠP BÀI MẪU CHUẨN */}
            <button
              type="button"
              onClick={handleLoadSample}
              className="btn-load-sample"
              title="Nạp cấu trúc bài viết mẫu tin tức chuẩn SEO có sẵn hình ảnh và bảng"
            >
              <Sparkles size={16} />
              <span>⚡ Nạp bài viết mẫu tin tức chuẩn SEO</span>
            </button>
          </div>

          {/* THANH CÔNG CỤ TOOLBAR */}
          <div className="article-toolbar">
            <div className="toolbar-group">
              <button
                type="button"
                onClick={() => execCmd("bold")}
                className="tool-btn"
                title="In đậm chữ (Ctrl+B)"
              >
                <Bold size={15} /> <span>In đậm</span>
              </button>
              <button
                type="button"
                onClick={() => execCmd("italic")}
                className="tool-btn"
                title="In nghiêng (Ctrl+I)"
              >
                <Italic size={15} /> <span>In nghiêng</span>
              </button>
              <button
                type="button"
                onClick={() => execCmd("formatBlock", "h3")}
                className="tool-btn"
                title="Tiêu đề mục (H3)"
              >
                <Heading size={15} /> <span>Tiêu đề mục</span>
              </button>
              <button
                type="button"
                onClick={() => execCmd("insertUnorderedList")}
                className="tool-btn"
                title="Danh sách gạch đầu dòng"
              >
                <List size={15} /> <span>Danh sách</span>
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleOpenLinkPopover(e);
                }}
                className={`tool-btn ${showLinkPopover ? "active" : ""}`}
                title="Gắn link liên kết vào chữ (Ctrl+K)"
              >
                <LinkIcon size={15} /> <span>Gắn link</span>
              </button>
              <button
                type="button"
                onClick={handleUnlink}
                className="tool-btn"
                title="Gỡ bỏ link liên kết"
              >
                <Unlink size={15} /> <span>Gỡ link</span>
              </button>
            </div>

            <div className="toolbar-divider" />

            <div className="toolbar-group">
              <button
                type="button"
                onClick={() => {
                  setShowLinkPopover(false);
                  setShowImageInserter(!showImageInserter);
                }}
                className={`tool-btn tool-btn-primary ${showImageInserter ? "active" : ""}`}
                title="Chèn hình ảnh vào giữa bài viết kèm chú thích"
              >
                <ImageIcon size={15} /> <span>Chèn ảnh vào bài</span>
              </button>

              <button
                type="button"
                onClick={handleInsertTable}
                className="tool-btn"
                title="Chèn bảng thông tin / bảng so sánh"
              >
                <Table size={15} /> <span>Chèn bảng</span>
              </button>
            </div>

            <div className="toolbar-divider" />

            {/* CHUYỂN ĐỔI CHẾ ĐỘ XEM */}
            <div className="toolbar-group toolbar-modes">
              <button
                type="button"
                onClick={() => {
                  if (editorMode === "wysiwyg" && editorRef.current) {
                    lastHtmlRef.current = editorRef.current.innerHTML;
                    setNewsForm((prev) => ({ ...prev, content: lastHtmlRef.current }));
                  }
                  setEditorMode("wysiwyg");
                }}
                className={`mode-btn ${editorMode === "wysiwyg" ? "active" : ""}`}
              >
                ✏️ Soạn thảo
              </button>

              <button
                type="button"
                onClick={() => {
                  if (editorMode === "wysiwyg" && editorRef.current) {
                    lastHtmlRef.current = editorRef.current.innerHTML;
                    setNewsForm((prev) => ({ ...prev, content: lastHtmlRef.current }));
                  }
                  setEditorMode("preview");
                }}
                className={`mode-btn ${editorMode === "preview" ? "active" : ""}`}
              >
                <Eye size={14} /> Xem trước
              </button>

              <button
                type="button"
                onClick={() => {
                  if (editorMode === "wysiwyg" && editorRef.current) {
                    lastHtmlRef.current = editorRef.current.innerHTML;
                    setNewsForm((prev) => ({ ...prev, content: lastHtmlRef.current }));
                  }
                  setEditorMode("code");
                }}
                className={`mode-btn ${editorMode === "code" ? "active" : ""}`}
              >
                <Code size={14} /> Mã HTML
              </button>
            </div>
          </div>

          {/* POPUP CHÈN ẢNH VÀO BÀI VIẾT */}
          {showImageInserter && (
            <div className="image-inserter-popover">
              <div className="inserter-header">
                <h5>📷 Chèn hình ảnh vào nội dung bài viết</h5>
                <button
                  type="button"
                  onClick={() => setShowImageInserter(false)}
                  className="btn-close-popover"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="inserter-body">
                <div className="inserter-row">
                  <div className="inserter-input-wrap">
                    <label>Cách 1: Tải ảnh từ máy tính lên (Hệ thống tự nén chuẩn web)</label>
                    <label className="btn-upload-file-label">
                      <Upload size={15} />
                      <span>{isUploadingInsertImg ? "Đang tải ảnh lên..." : "Chọn ảnh từ máy tính"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadInsertImage}
                        disabled={isUploadingInsertImg}
                        style={{ display: "none" }}
                      />
                    </label>
                  </div>
                </div>

                <div className="inserter-divider">
                  <span>HOẶC</span>
                </div>

                <div className="inserter-row">
                  <label>Cách 2: Dán đường link URL ảnh trực tiếp</label>
                  <input
                    type="text"
                    value={insertImageUrl}
                    onChange={(e) => setInsertImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... hoặc /uploads/..."
                    className="inserter-text-input"
                  />
                </div>

                <div className="inserter-row">
                  <label>Chú thích chân ảnh (Caption hiển thị nghiêng dưới hình)</label>
                  <input
                    type="text"
                    value={insertImageCaption}
                    onChange={(e) => setInsertImageCaption(e.target.value)}
                    placeholder="Ví dụ: Hình ảnh 1: Mẫu nan cửa cuốn khe thoáng thế hệ mới"
                    className="inserter-text-input"
                  />
                </div>

                <div className="inserter-row">
                  <label>Kích thước hiển thị của ảnh khi ra web:</label>
                  <div className="img-insert-size-presets">
                    {["100%", "80%", "60%", "40%"].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        className={`size-preset-pill ${insertImgWidth === sz ? "active" : ""}`}
                        onClick={() => setInsertImgWidth(sz)}
                      >
                        {sz === "100%" ? "Toàn khung (100%)" : sz === "80%" ? "Lớn (80%)" : sz === "60%" ? "Vừa (60%)" : "Nhỏ (40%)"}
                      </button>
                    ))}
                  </div>
                </div>

                {insertImageUrl && (
                  <div className="inserter-preview">
                    <img src={insertImageUrl} alt="Xem trước" />
                    <span className="preview-caption">
                      {insertImageCaption || "Hình ảnh minh họa bài viết"}
                    </span>
                  </div>
                )}

                <div className="inserter-actions">
                  <button
                    type="button"
                    onClick={() => setShowImageInserter(false)}
                    className="btn-inserter-cancel"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmInsertImage}
                    disabled={!insertImageUrl.trim()}
                    className="btn-inserter-confirm"
                  >
                    <CheckCircle2 size={15} /> Chèn vào vị trí con trỏ
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* POPUP GẮN LINK (HYPERLINK) VÀO CHỮ */}
          {showLinkPopover && (
            <div className="image-inserter-popover link-inserter-popover">
              <div className="inserter-header">
                <h5>🔗 Gắn liên kết (Hyperlink) vào chữ trong bài viết</h5>
                <button
                  type="button"
                  onClick={() => setShowLinkPopover(false)}
                  className="btn-close-popover"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="inserter-body">
                <div className="inserter-row">
                  <label>Văn bản hiển thị:</label>
                  <input
                    type="text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Đoạn chữ được gắn link..."
                    className="inserter-text-input"
                  />
                </div>

                <div className="inserter-row">
                  <label>Địa chỉ liên kết (URL):</label>
                  <input
                    type="text"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://... hoặc /san-pham/... hoặc tel:0904678323"
                    className="inserter-text-input"
                    autoFocus
                  />
                </div>

                {/* GỢI Ý LINK NHANH */}
                <div className="quick-links-row">
                  <span className="quick-links-label">Gợi ý nhanh:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setLinkUrl("/bang-gia");
                      if (!linkText) setLinkText("Bảng giá cửa cuốn");
                    }}
                    className="quick-link-pill"
                  >
                    📋 Bảng giá
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLinkUrl("/cong-trinh");
                      if (!linkText) setLinkText("Công trình thực tế");
                    }}
                    className="quick-link-pill"
                  >
                    🏗️ Công trình
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLinkUrl("tel:0904678323");
                      if (!linkText) setLinkText("0904.678.323");
                    }}
                    className="quick-link-pill"
                  >
                    📞 Hotline
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLinkUrl("https://zalo.me/0904678323");
                      if (!linkText) setLinkText("Zalo tư vấn");
                    }}
                    className="quick-link-pill"
                  >
                    💬 Zalo tư vấn
                  </button>
                </div>

                <div className="link-options-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={linkOpenNewTab}
                      onChange={(e) => setLinkOpenNewTab(e.target.checked)}
                    />
                    <span>Mở liên kết trong tab mới (target="_blank")</span>
                  </label>
                </div>

                <div className="inserter-actions">
                  <button
                    type="button"
                    onClick={handleUnlink}
                    className="btn-inserter-cancel"
                    title="Xóa link khỏi đoạn chữ"
                  >
                    <Unlink size={14} /> Gỡ link
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLinkPopover(false)}
                    className="btn-inserter-cancel"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmInsertLink}
                    disabled={!linkUrl.trim()}
                    className="btn-inserter-confirm"
                  >
                    <LinkIcon size={14} /> Gắn link vào chữ
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= KHUNG NỘI DUNG CHÍNH (EDITOR SHEET) ================= */}
          <div
            ref={sheetContainerRef}
            className="article-sheet-container"
            onMouseOver={handleEditorMouseOver}
            onMouseOut={handleEditorMouseOut}
          >
            {/* FLOATING LINK PREVIEW CARD KHI RÊ CHUỘT VÀO LINK */}
            {hoveredLink && (
              <div
                className="editor-floating-link-card"
                style={{
                  position: "fixed",
                  top: `${Math.max(12, Math.min(window.innerHeight - 56, hoveredLink.rect.bottom + 8))}px`,
                  left: `${Math.max(16, Math.min(window.innerWidth - 380, hoveredLink.rect.left))}px`,
                  zIndex: 999999
                }}
                onMouseEnter={() => {
                  if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current);
                    hoverTimeoutRef.current = null;
                  }
                }}
                onMouseLeave={() => {
                  if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                  hoverTimeoutRef.current = setTimeout(() => {
                    setHoveredLink(null);
                  }, 250);
                }}
              >
                <div className="floating-link-icon" title="Liên kết trong bài viết">
                  <LinkIcon size={15} />
                </div>
                <div className="floating-link-url-wrap">
                  <span className="floating-link-label">Đường dẫn liên kết:</span>
                  <a
                    href={hoveredLink.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="floating-link-url"
                    title={`Bấm để mở: ${hoveredLink.href}`}
                  >
                    {hoveredLink.href}
                  </a>
                </div>

                <div className="floating-link-divider" />

                <div className="floating-link-actions">
                  <a
                    href={hoveredLink.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="floating-link-btn"
                    title="Mở liên kết trong tab mới"
                  >
                    <ExternalLink size={12} />
                    <span>Mở</span>
                  </a>

                  <button
                    type="button"
                    className={`floating-link-btn ${copiedLink ? "btn-copied" : ""}`}
                    onClick={() => handleCopyFloatingLink(hoveredLink.href)}
                    title="Sao chép địa chỉ liên kết"
                  >
                    {copiedLink ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedLink ? "Đã chép" : "Chép"}</span>
                  </button>

                  <button
                    type="button"
                    className="floating-link-btn"
                    onClick={() => handleEditFloatingLink(hoveredLink)}
                    title="Chỉnh sửa liên kết này"
                  >
                    <Edit3 size={12} />
                    <span>Sửa</span>
                  </button>

                  <button
                    type="button"
                    className="floating-link-btn btn-unlink"
                    onClick={() => handleUnlinkFloating(hoveredLink.anchorEl)}
                    title="Gỡ bỏ liên kết khỏi chữ"
                  >
                    <Unlink size={12} />
                    <span>Gỡ</span>
                  </button>
                </div>
              </div>
            )}
            {/* FLOATING IMAGE RESIZER & ALIGN TOOLBAR KHI CLICK VÀO ẢNH */}
            {selectedImgEl && imgToolbarPos && (
              <div
                className="editor-image-control-toolbar"
                style={{
                  position: "fixed",
                  top: `${Math.max(10, imgToolbarPos.top)}px`,
                  left: `${Math.max(12, Math.min(window.innerWidth - 320, imgToolbarPos.left))}px`,
                  transform: "translateX(-50%)",
                  zIndex: 999999
                }}
              >
                <div className="img-toolbar-label">
                  <span>📐 Cỡ ảnh:</span>
                </div>
                <div className="img-size-buttons">
                  {["35%", "60%", "80%", "100%"].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      className={`size-pill-btn ${selectedImgSize === sz || (sz === "100%" && !selectedImgEl.style.width) ? "active" : ""}`}
                      onClick={() => handleSetImageSize(sz)}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
                <div className="img-adjust-group">
                  <button type="button" className="img-btn-adjust" onClick={() => handleStepImageSize(-10)} title="Thu nhỏ 10%"><Minus size={13} /></button>
                  <span className="img-current-percent">{selectedImgEl.style.width || "100%"}</span>
                  <button type="button" className="img-btn-adjust" onClick={() => handleStepImageSize(10)} title="Phóng to 10%"><Plus size={13} /></button>
                </div>
                <div className="img-align-group">
                  <button type="button" className="img-btn-align" onClick={() => handleSetImageAlign("left")} title="Căn trái"><AlignLeft size={13} /></button>
                  <button type="button" className="img-btn-align" onClick={() => handleSetImageAlign("center")} title="Căn giữa"><AlignCenter size={13} /></button>
                  <button type="button" className="img-btn-align" onClick={() => handleSetImageAlign("right")} title="Căn phải"><AlignRight size={13} /></button>
                </div>
                <button type="button" className="img-btn-delete" onClick={handleDeleteSelectedImg} title="Xóa ảnh"><Trash2 size={13} /></button>
              </div>
            )}
            {editorMode === "wysiwyg" && (
              <div className="article-wysiwyg-wrapper" onClick={handleEditorClick}>
                <div
                  ref={editorRef}
                  className="article-content-editable"
                  contentEditable
                  suppressContentEditableWarning
                  onInput={handleContentInput}
                  onPaste={handleEditorPaste}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                      e.preventDefault();
                      handleOpenLinkPopover(e);
                    }
                  }}
                  placeholder="Bắt đầu viết bài tin tức, kinh nghiệm chia sẻ tại đây... (Có thể bấm 'Nạp bài viết mẫu' ở góc trên để có sẵn khung sườn chuẩn)"
                />
              </div>
            )}

            {editorMode === "code" && (
              <div className="article-code-wrapper">
                <textarea
                  value={newsForm.content || ""}
                  onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                  rows={18}
                  className="article-code-textarea"
                  placeholder="Nhập mã HTML bài viết tại đây..."
                />
              </div>
            )}

            {editorMode === "preview" && (
              <div className="article-preview-wrapper">
                <div className="preview-indicator-bar">
                  <Eye size={16} />
                  <span>
                    Chế độ xem trước: Bài viết hiển thị như giao diện độc giả nhìn thấy trên website
                  </span>
                </div>
                <div
                  className="project-article-rendered-content preview-article-canvas"
                  dangerouslySetInnerHTML={{
                    __html:
                      newsForm.content ||
                      "<p style='color: #94a3b8; font-style: italic; text-align: center; padding: 40px;'>Chưa có nội dung bài viết. Hãy chuyển sang tab 'Soạn thảo' hoặc bấm 'Nạp bài viết mẫu' để bắt đầu!</p>"
                  }}
                />
              </div>
            )}
          </div>

          {/* DÒNG HƯỚNG DẪN & NÚT XÓA BÀI */}
          <div className="article-editor-footer-hint">
            <div className="footer-hint-text">
              <Info size={14} />
              <span>
                Mẹo: Bấm <strong>"⚡ Nạp bài viết mẫu tin tức"</strong> để tự động có sẵn khung sườn chuẩn SEO, sau đó bạn chỉ cần thay chữ và hình ảnh tương ứng!
              </span>
            </div>
            {newsForm.content && (
              <button
                type="button"
                onClick={handleClearArticle}
                className="btn-clear-article"
                title="Xóa trắng nội dung bài viết"
              >
                <Trash2 size={13} /> Xóa trắng bài viết
              </button>
            )}
          </div>
        </div>

        {/* ================= PHẦN 3: NÚT LƯU & HỦY ================= */}
        <div className="inline-form-footer">
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Hủy bỏ
          </button>
          <button type="submit" className="btn-save">
            <Save size={16} />
            {editingNews ? "Cập Nhật Bài Viết" : "Lưu & Đăng Bài Viết"}
          </button>
        </div>
      </form>
    </div>
  );
}

