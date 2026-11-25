import React, { useState, useRef, useEffect } from "react";
import {
  FileText,
  Save,
  X,
  Upload,
  Image as ImageIcon,
  Plus,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2,
  Sparkles,
  Bold,
  Italic,
  List,
  Heading,
  Table,
  Eye,
  Edit3,
  Code,
  Loader2,
  CheckCircle2,
  Info,
  Link as LinkIcon,
  Unlink,
  ExternalLink,
  Copy,
  Check,
  Phone,
  Calendar,
  Clock,
  ShieldCheck,
  Wrench,
  Columns2,
  Columns
} from "lucide-react";
import "./AdminProjectArticleEditor.css";

export const SAMPLE_SERVICE_TEMPLATE = {
  title: "SỬA CHỮA CỬA CUỐN 24/24 TẠI ĐÀ NẴNG - CỨU HỘ KHẨN CẤP SAU 15 PHÚT",
  date: new Date().toLocaleDateString("vi-VN"),
  order: 1,
  phone: "0904.678.323",
  img: "/service_technician.png",
  desc: "Dịch vụ sửa chữa, bảo dưỡng cửa cuốn khẩn cấp tại Đà Nẵng 24/7. Thợ có mặt sau 15-30 phút, xử lý triệt để kẹt nan, đứt lá, hỏng mô tơ, lỗi hộp nhận remote với phụ kiện chính hãng.",
  content: `<p style="line-height: 1.8; color: #334155; margin-bottom: 16px; font-size: 1.05rem;">
  <strong>BOSS Đà Nẵng</strong> tự hào là trung tâm cứu hộ, bảo trì và sửa chữa cửa cuốn – cửa kéo uy tín số 1 tại Đà Nẵng. Với đội ngũ kỹ thuật viên thường trực 24/7 tại khắp các quận huyện (Hải Châu, Thanh Khê, Sơn Trà, Ngũ Hành Sơn, Cẩm Lệ, Liên Chiểu), chúng tôi cam kết có mặt kiểm tra chỉ sau 15 – 30 phút liên hệ.
</p>

<table class="project-specs-table" style="width: 100%; border-collapse: collapse; margin: 16px 0 24px 0; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
  <tbody>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px 14px; font-weight: 700; color: #07522f; width: 25%; background: #f1f5f9;">Thời gian cứu hộ:</td>
      <td style="padding: 10px 14px; color: #1e293b; width: 75%;">24/24 kể cả ngày nghỉ lễ, ban đêm và mùa mưa bão. Có mặt sau 15 - 30 phút.</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px 14px; font-weight: 700; color: #07522f; background: #f1f5f9;">Phạm vi dịch vụ:</td>
      <td style="padding: 10px 14px; color: #1e293b;">Toàn bộ khu vực TP. Đà Nẵng, Hội An, Điện Bàn & các tỉnh lân cận.</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px 14px; font-weight: 700; color: #07522f; background: #f1f5f9;">Chất lượng linh kiện:</td>
      <td style="padding: 10px 14px; color: #1e293b;">Linh kiện lõi đồng chính hãng BossDoor, YH, Austdoor bảo hành 12 - 36 tháng.</td>
    </tr>
    <tr>
      <td style="padding: 10px 14px; font-weight: 700; color: #07522f; background: #f1f5f9;">Hotline trực ca:</td>
      <td style="padding: 10px 14px; color: #2563eb; font-weight: 700;">0904.678.323 (Tư vấn kỹ thuật và báo giá miễn phí 100%)</td>
    </tr>
  </tbody>
</table>

<h3 style="color: #07522f; font-size: 1.2rem; font-weight: 700; margin: 24px 0 10px 0;">1. Các sự cố cửa cuốn thường gặp được xử lý nhanh trong ngày</h3>
<ul style="padding-left: 24px; margin-bottom: 16px; line-height: 1.8; color: #334155;">
  <li><strong>Cửa bị kẹt nan, xô nan:</strong> Do va quẹt chướng ngại vật hoặc gió bão làm trật đường ray dẫn hướng. Kỹ thuật viên sẽ nắn chỉnh nan, căn cân bằng trục cuốn và tra dầu bảo dưỡng.</li>
  <li><strong>Mô tơ không chạy hoặc chạy ngắt quãng:</strong> Do hỏng tụ khởi động, mòn rơ-le hành trình hoặc chập cuộn dây. Chúng tôi có sẵn linh kiện thay thế tại chỗ.</li>
  <li><strong>Hộp điều khiển không nhận tín hiệu remote:</strong> Kiểm tra tần số, cài đặt thêm remote mã nhảy Rolling Code chống phá mã sao chép.</li>
  <li><strong>Bình lưu điện (UPS) không tích điện:</strong> Kiểm tra bo sạc, thay thế ắc quy khô chuyên dụng độ bền cao.</li>
</ul>

<figure class="project-article-figure" style="text-align: center; margin: 24px auto;">
  <img src="/service_technician.png" alt="Đội ngũ kỹ thuật viên sửa chữa cửa cuốn tại Đà Nẵng" style="width: 80%; max-width: 100%; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.12); border: 1px solid #cbd5e1; display: block; margin: 0 auto;" />
  <figcaption style="margin-top: 8px; font-size: 0.88rem; color: #64748b; font-style: italic; text-align: center;">Hình ảnh: Kỹ thuật viên BOSS Đà Nẵng kiểm tra hệ thống điều khiển và mô tơ tại công trình</figcaption>
</figure>

<h3 style="color: #07522f; font-size: 1.2rem; font-weight: 700; margin: 24px 0 10px 0;">2. Quy trình làm việc 4 bước minh bạch và chuyên nghiệp</h3>
<p style="margin-bottom: 14px; line-height: 1.75; color: #334155;">
  <strong>Bước 1: Tiếp nhận yêu cầu:</strong> Khách hàng gọi hotline <a href="tel:0904678323" style="color: #2563eb; font-weight: 700; text-decoration: underline;">0904.678.323</a> mô tả hiện tượng, nhân viên tư vấn hướng dẫn cách ngắt điện an toàn ban đầu.<br>
  <strong>Bước 2: Khảo sát tận nơi sau 15 phút:</strong> Thợ trực tiếp đến đo đạc kiểm tra lỗi thực tế, tư vấn phương án tiết kiệm nhất cho gia chủ.<br>
  <strong>Bước 3: Báo giá niêm yết:</strong> Báo đúng giá niêm yết theo bảng giá công ty, chỉ tiến hành sửa chữa khi khách hàng đồng ý.<br>
  <strong>Bước 4: Nghiệm thu & Bảo hành:</strong> Vận hành thử nghiệm trơn tru, dán tem bảo hành và bàn giao hướng dẫn sử dụng bền lâu.
</p>`
};

export default function AdminServiceArticleEditor({
  serviceForm,
  setServiceForm,
  editingService,
  onSave,
  onCancel,
  showToast,
  compressImage,
  isUploading,
  setIsUploading
}) {
  const editorRef = useRef(null);
  const lastHtmlRef = useRef(serviceForm.content || "");
  const [editorMode, setEditorMode] = useState("wysiwyg"); // "wysiwyg" | "code" | "preview"

  // Image inserter popover (Hỗ trợ chèn 1 ảnh đơn hoặc 2 ảnh ngang hàng song song)
  const [showImageInserter, setShowImageInserter] = useState(false);
  const [inserterLayoutMode, setInserterLayoutMode] = useState("single"); // "single" | "two_cols"
  const [insertImageUrl, setInsertImageUrl] = useState("");
  const [insertImageCaption, setInsertImageCaption] = useState("");
  const [isUploadingInsertImg, setIsUploadingInsertImg] = useState(false);
  const [insertImgWidth, setInsertImgWidth] = useState("100%");

  // Ảnh thứ 2 cho chế độ 2 ảnh ngang hàng
  const [insertImgUrl2, setInsertImgUrl2] = useState("");
  const [insertCaption2, setInsertCaption2] = useState("");
  const [isUploadingInsertImg2, setIsUploadingInsertImg2] = useState(false);

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

  // Mở popup gắn link và lưu lại đoạn chữ đang chọn
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

  // Xác nhận gắn link liên kết
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
      setServiceForm((prev) => ({
        ...prev,
        content: (prev.content || "") + linkHtml
      }));
    }

    setShowLinkPopover(false);
    setLinkUrl("");
    setLinkText("");
    savedRangeRef.current = null;
    editingAnchorRef.current = null;
    if (showToast) showToast(`🔗 Đã gắn link vào chữ "${displayText}"!`);
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

  // Hover detection over links
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
      setHoveredLink({ href, text, openNewTab, rect, anchorEl: anchor });
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

  // Scroll or resize listener
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

  // Đồng bộ nội dung vào editor DOM
  useEffect(() => {
    if (editorRef.current && editorMode === "wysiwyg") {
      const currentHtml = serviceForm.content || "";
      if (editorRef.current.innerHTML !== currentHtml) {
        if (document.activeElement !== editorRef.current) {
          editorRef.current.innerHTML = currentHtml;
          lastHtmlRef.current = currentHtml;
        }
      }
    }
  }, [editingService, editorMode]);

  const handleContentInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    lastHtmlRef.current = html;
    setServiceForm((prev) => ({ ...prev, content: html }));
  };

  const handleFormSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    let finalContent = serviceForm.content || "";
    if (editorMode === "wysiwyg" && editorRef.current) {
      finalContent = editorRef.current.innerHTML;
      lastHtmlRef.current = finalContent;
    }
    setServiceForm((prev) => ({ ...prev, content: finalContent }));
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

  // Nạp mẫu dịch vụ tiêu chuẩn
  const handleLoadSample = () => {
    if (
      serviceForm.content &&
      serviceForm.content.trim().length > 10 &&
      !window.confirm("Nạp bài mẫu sẽ thay thế nội dung hiện tại. Bạn có chắc chắn muốn nạp?")
    ) {
      return;
    }

    setServiceForm((prev) => ({
      ...prev,
      title: prev.title || SAMPLE_SERVICE_TEMPLATE.title,
      date: prev.date || SAMPLE_SERVICE_TEMPLATE.date,
      order: prev.order || SAMPLE_SERVICE_TEMPLATE.order,
      phone: prev.phone || SAMPLE_SERVICE_TEMPLATE.phone,
      img: prev.img || SAMPLE_SERVICE_TEMPLATE.img,
      desc: prev.desc || SAMPLE_SERVICE_TEMPLATE.desc,
      content: SAMPLE_SERVICE_TEMPLATE.content
    }));

    if (editorRef.current) {
      editorRef.current.innerHTML = SAMPLE_SERVICE_TEMPLATE.content;
    }

    if (showToast) {
      showToast("⚡ Đã nạp thành công bài viết dịch vụ mẫu chuẩn!");
    }
  };

  // Chèn bảng quy trình & cam kết dịch vụ
  const handleInsertServiceTable = () => {
    const tableHtml = `
<table class="project-specs-table" style="width: 100%; border-collapse: collapse; margin: 16px 0 24px 0; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
  <tbody>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px 14px; font-weight: 700; color: #07522f; width: 30%; background: #f1f5f9;">Thời gian cứu hộ:</td>
      <td style="padding: 10px 14px; color: #1e293b; width: 70%;">Phục vụ 24/7 kể cả ngày lễ, có mặt sau 15 - 30 phút</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px 14px; font-weight: 700; color: #07522f; background: #f1f5f9;">Báo giá & Khảo sát:</td>
      <td style="padding: 10px 14px; color: #1e293b;">Khảo sát miễn phí, báo giá niêm yết trước khi sửa chữa</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px 14px; font-weight: 700; color: #07522f; background: #f1f5f9;">Chính sách bảo hành:</td>
      <td style="padding: 10px 14px; color: #1e293b;">Bảo hành từ 12 - 36 tháng cho mọi linh kiện thay thế</td>
    </tr>
    <tr>
      <td style="padding: 10px 14px; font-weight: 700; color: #07522f; background: #f1f5f9;">Hotline trực 24/7:</td>
      <td style="padding: 10px 14px; color: #2563eb; font-weight: 700;">${serviceForm.phone || "0904.678.323"}</td>
    </tr>
  </tbody>
</table><p><br></p>`;

    if (editorMode === "wysiwyg" && editorRef.current) {
      editorRef.current.focus();
      document.execCommand("insertHTML", false, tableHtml);
      handleContentInput();
    } else {
      setServiceForm((prev) => ({
        ...prev,
        content: (prev.content || "") + tableHtml
      }));
    }
    if (showToast) showToast("📊 Đã chèn bảng quy trình dịch vụ vào bài viết!");
  };

  // Upload ảnh đại diện dịch vụ
  const handleUploadMainServiceImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (setIsUploading) setIsUploading(true);

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
        setServiceForm((prev) => ({ ...prev, img: uploadedUrl }));
        if (showToast) showToast("✅ Tải ảnh đại diện dịch vụ thành công!");
      }
    } catch (err) {
      if (showToast) showToast("❌ Không thể tải ảnh: " + err.message);
    } finally {
      if (setIsUploading) setIsUploading(false);
      e.target.value = "";
    }
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

  // Upload ảnh thứ 2 cho chế độ 2 ảnh ngang hàng
  const handleUploadInsertImage2 = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingInsertImg2(true);

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
        setInsertImgUrl2(uploadedUrl);
        if (showToast) showToast("✅ Tải ảnh thứ 2 lên thành công!");
      }
    } catch (err) {
      if (showToast) showToast("❌ Không thể tải ảnh 2: " + err.message);
    } finally {
      setIsUploadingInsertImg2(false);
      e.target.value = "";
    }
  };

  // Confirm Insert Single Image into Article
  const handleConfirmInsertImage = () => {
    if (!insertImageUrl.trim()) {
      alert("Vui lòng chọn ảnh từ máy hoặc dán link ảnh trước!");
      return;
    }

    const captionText = insertImageCaption.trim() || "Hình ảnh thi công thực tế tại hiện trường";
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
      setServiceForm((prev) => ({
        ...prev,
        content: (prev.content || "") + figureHtml
      }));
    }

    setServiceForm((prev) => ({
      ...prev,
      img: prev.img || insertImageUrl.trim()
    }));

    setInsertImageUrl("");
    setInsertImageCaption("");
    setShowImageInserter(false);

    if (showToast) showToast("📷 Đã chèn hình ảnh và chú thích vào bài viết thành công!");
  };

  // Xác nhận chèn cụm 2 ảnh ngang hàng vào bài viết
  const handleConfirmInsertTwoImages = () => {
    if (!insertImageUrl.trim() && !insertImgUrl2.trim()) {
      alert("Vui lòng tải hoặc dán link ít nhất 1 ảnh!");
      return;
    }

    const img1 = insertImageUrl.trim() || insertImgUrl2.trim();
    const img2 = insertImgUrl2.trim() || insertImageUrl.trim();
    const cap1 = insertImageCaption.trim() || "Hình ảnh công trình 1";
    const cap2 = insertCaption2.trim() || "Hình ảnh công trình 2";

    const twoImagesHtml = `
<div class="service-images-row-2col" style="display: flex; gap: 16px; margin: 24px 0; justify-content: center; align-items: flex-start; flex-wrap: wrap;">
  <figure class="project-article-figure" style="flex: 1 1 calc(50% - 10px); min-width: 260px; max-width: calc(50% - 8px); margin: 0; text-align: center; box-sizing: border-box;">
    <img src="${img1}" alt="${cap1}" style="width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.12); border: 1px solid #cbd5e1; display: block; margin: 0 auto; object-fit: cover;" />
    <figcaption style="margin-top: 8px; font-size: 0.88rem; color: #64748b; font-style: italic; text-align: center;">${cap1}</figcaption>
  </figure>
  <figure class="project-article-figure" style="flex: 1 1 calc(50% - 10px); min-width: 260px; max-width: calc(50% - 8px); margin: 0; text-align: center; box-sizing: border-box;">
    <img src="${img2}" alt="${cap2}" style="width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.12); border: 1px solid #cbd5e1; display: block; margin: 0 auto; object-fit: cover;" />
    <figcaption style="margin-top: 8px; font-size: 0.88rem; color: #64748b; font-style: italic; text-align: center;">${cap2}</figcaption>
  </figure>
</div><p><br></p>`;

    if (editorMode === "wysiwyg" && editorRef.current) {
      editorRef.current.focus();
      document.execCommand("insertHTML", false, twoImagesHtml);
      handleContentInput();
    } else {
      setServiceForm((prev) => ({
        ...prev,
        content: (prev.content || "") + twoImagesHtml
      }));
    }

    setServiceForm((prev) => ({
      ...prev,
      img: prev.img || img1
    }));

    setInsertImageUrl("");
    setInsertImageCaption("");
    setInsertImgUrl2("");
    setInsertCaption2("");
    setShowImageInserter(false);

    if (showToast) showToast("🖼️🖼️ Đã chèn 2 ảnh ngang hàng vào bài viết thành công!");
  };

  // Đặt ảnh đã chọn sang chế độ ngang hàng 50%
  const handleSetTwoImagesLayout = () => {
    if (!selectedImgEl) return;
    selectedImgEl.style.width = "calc(50% - 10px)";
    selectedImgEl.style.maxWidth = "calc(50% - 10px)";
    selectedImgEl.style.height = "auto";
    selectedImgEl.style.display = "inline-block";
    selectedImgEl.style.verticalAlign = "top";
    selectedImgEl.style.margin = "10px 5px";
    selectedImgEl.style.float = "none";
    selectedImgEl.style.boxSizing = "border-box";

    const parentFig = selectedImgEl.closest("figure");
    if (parentFig) {
      parentFig.style.display = "inline-block";
      parentFig.style.width = "calc(50% - 10px)";
      parentFig.style.maxWidth = "calc(50% - 10px)";
      parentFig.style.verticalAlign = "top";
      parentFig.style.margin = "10px 5px";
      parentFig.style.boxSizing = "border-box";
      parentFig.style.textAlign = "center";
      selectedImgEl.style.width = "100%";
      selectedImgEl.style.maxWidth = "100%";
    }

    setSelectedImgSize("50%");
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
    if (showToast) {
      showToast("✨ Đã đặt kích thước ảnh 50% ngang hàng! Bấm tương tự cho ảnh kế tiếp để 2 ảnh xếp cạnh nhau.");
    }
  };

  // Image click handler for floating toolbar
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
    if (sizePercent === "50%") {
      handleSetTwoImagesLayout();
      return;
    }
    selectedImgEl.style.width = sizePercent;
    selectedImgEl.style.maxWidth = "100%";
    selectedImgEl.style.height = "auto";
    selectedImgEl.style.display = "block";
    selectedImgEl.style.margin = "16px auto";
    selectedImgEl.style.float = "none";
    const parentFig = selectedImgEl.closest("figure");
    if (parentFig) {
      parentFig.style.display = "block";
      parentFig.style.width = "100%";
      parentFig.style.maxWidth = "100%";
      parentFig.style.margin = "24px auto";
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
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ nội dung bài viết dịch vụ này không?")) {
      setServiceForm((prev) => ({ ...prev, content: "" }));
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
    }
  };

  // Co dãn vừa khít 100% khi paste
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
        {/* ================= PHẦN 1: THÔNG TIN CƠ BẢN DỊCH VỤ ================= */}
        <div className="editor-basic-section">
          <div className="admin-form-group">
            <label className="field-label-prominent">
              Tiêu đề / Tên dịch vụ *
            </label>
            <input
              type="text"
              value={serviceForm.title}
              onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
              required
              className="input-title-large"
              placeholder="Ví dụ: SỬA CHỮA CỬA CUỐN 24/24 TẠI ĐÀ NẴNG"
            />
          </div>

          <div className="admin-form-group">
            <label>Ngày đăng hiển thị</label>
            <input
              type="text"
              value={serviceForm.date}
              onChange={(e) => setServiceForm({ ...serviceForm, date: e.target.value })}
              placeholder="DD/MM/YYYY"
            />
          </div>

          {/* HÌNH ẢNH ĐẠI DIỆN DỊCH VỤ */}
          <div className="admin-form-group">
            <label className="field-label-prominent">
              Hình ảnh đại diện dịch vụ (Hiển thị ngoài trang chủ & trang dịch vụ) *
            </label>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
              <input
                type="text"
                value={serviceForm.img}
                onChange={(e) => setServiceForm({ ...serviceForm, img: e.target.value })}
                required
                placeholder="Đường dẫn ảnh: /service_repair_247.png hoặc URL..."
                style={{ flex: 1 }}
              />
              <label
                className="btn-upload-file-label"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                  color: "#ffffff",
                  border: "none",
                  padding: "9px 14px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  whiteSpace: "nowrap"
                }}
              >
                <Upload size={15} />
                {isUploading ? "Đang tải ảnh..." : "Chọn ảnh từ máy"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadMainServiceImage}
                  disabled={isUploading}
                  style={{ display: "none" }}
                />
              </label>
            </div>

            {serviceForm.img && (
              <div
                style={{
                  marginTop: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  background: "rgba(15, 23, 42, 0.6)",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px dashed rgba(16, 185, 129, 0.4)"
                }}
              >
                <img
                  src={serviceForm.img}
                  alt="Xem trước ảnh đại diện"
                  style={{ width: "70px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                  Xem trước hình ảnh đại diện của dịch vụ
                </span>
              </div>
            )}
          </div>

          {/* MÔ TẢ TÓM TẮT DỊCH VỤ */}
          <div className="admin-form-group">
            <label>Mô tả ngắn gọn dịch vụ (Hiển thị trên thẻ card bên ngoài)</label>
            <textarea
              rows={2}
              value={serviceForm.desc}
              onChange={(e) => setServiceForm({ ...serviceForm, desc: e.target.value })}
              placeholder="Ví dụ: Dịch vụ sửa chữa, bảo dưỡng cửa cuốn khẩn cấp tại Đà Nẵng 24/7. Thợ có mặt sau 15-30 phút..."
              style={{
                width: "100%",
                background: "rgba(30, 41, 59, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#f8fafc",
                borderRadius: "8px",
                padding: "10px 14px",
                fontSize: "0.9rem",
                boxBox: "border-box"
              }}
            />
          </div>
        </div>

        {/* ================= PHẦN 2: SOẠN THẢO BÀI VIẾT DỊCH VỤ CHI TIẾT ================= */}
        <div className="editor-article-section">
          <div className="article-section-header">
            <div className="header-left">
              <h4 className="article-section-title">
                <FileText size={18} color="#10b981" />
                <span>Nội Dung Bài Viết Dịch Vụ Chi Tiết (Chữ xen kẽ Hình ảnh & Bảng)</span>
              </h4>
              <p className="article-section-desc">
                Soạn bài viết giới thiệu dịch vụ trực quan: gõ chữ, chèn hình ảnh minh họa kèm chú thích, chèn bảng quy trình & cam kết, gắn link liên kết.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLoadSample}
              className="btn-load-sample"
              title="Bấm để tự động điền bài viết mẫu chuẩn về dịch vụ sửa cửa cuốn"
            >
              <Sparkles size={16} />
              <span>Nạp bài viết mẫu dịch vụ chuẩn</span>
            </button>
          </div>

          {/* THANH CÔNG CỤ SOẠN THẢO (TOOLBAR) */}
          <div className="article-toolbar">
            <div className="toolbar-group">
              <button
                type="button"
                onClick={() => execCmd("bold")}
                className="tool-btn"
                title="In đậm (Ctrl+B)"
              >
                <Bold size={15} />
                <span>In đậm</span>
              </button>

              <button
                type="button"
                onClick={() => execCmd("italic")}
                className="tool-btn"
                title="In nghiêng (Ctrl+I)"
              >
                <Italic size={15} />
                <span>In nghiêng</span>
              </button>

              <button
                type="button"
                onClick={() => execCmd("formatBlock", "<h3>")}
                className="tool-btn"
                title="Tiêu đề mục con (H3)"
              >
                <Heading size={15} />
                <span>Tiêu đề mục</span>
              </button>

              <button
                type="button"
                onClick={() => execCmd("insertUnorderedList")}
                className="tool-btn"
                title="Danh sách gạch đầu dòng"
              >
                <List size={15} />
                <span>Danh sách</span>
              </button>

              <button
                type="button"
                onClick={handleOpenLinkPopover}
                className="tool-btn tool-btn-highlight"
                title="Gắn link liên kết vào chữ (Ctrl+K)"
              >
                <LinkIcon size={14} />
                <span>Gắn link</span>
              </button>

              <button
                type="button"
                onClick={handleUnlink}
                className="tool-btn"
                title="Gỡ link khỏi đoạn chữ"
              >
                <Unlink size={14} />
                <span>Gỡ link</span>
              </button>
            </div>

            <div className="toolbar-group">
              <button
                type="button"
                onClick={() => {
                  setShowLinkPopover(false);
                  setInserterLayoutMode("single");
                  setShowImageInserter(!showImageInserter || inserterLayoutMode !== "single");
                }}
                className={`tool-btn ${showImageInserter && inserterLayoutMode === "single" ? "active" : ""}`}
                title="Chèn 1 hình ảnh đơn vào bài viết"
              >
                <ImageIcon size={15} />
                <span>Chèn ảnh vào bài</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowLinkPopover(false);
                  setInserterLayoutMode("two_cols");
                  setShowImageInserter(true);
                }}
                className={`tool-btn tool-btn-highlight ${showImageInserter && inserterLayoutMode === "two_cols" ? "active" : ""}`}
                title="Chèn 2 hình ảnh ngang hàng song song cạnh nhau vào bài viết"
                style={{
                  background: showImageInserter && inserterLayoutMode === "two_cols" ? "#10b981" : "rgba(16, 185, 129, 0.15)",
                  borderColor: "#10b981",
                  color: showImageInserter && inserterLayoutMode === "two_cols" ? "#ffffff" : "#10b981"
                }}
              >
                <Columns2 size={15} />
                <span>2 ảnh ngang hàng</span>
              </button>

              <button
                type="button"
                onClick={handleInsertServiceTable}
                className="tool-btn"
                title="Chèn bảng quy trình & cam kết dịch vụ"
              >
                <Table size={15} />
                <span>Chèn bảng</span>
              </button>
            </div>

            {/* TAB CHUYỂN CHẾ ĐỘ XEM */}
            <div className="toolbar-group view-mode-tabs">
              <button
                type="button"
                onClick={() => setEditorMode("wysiwyg")}
                className={`tab-mode-btn ${editorMode === "wysiwyg" ? "active" : ""}`}
              >
                <Edit3 size={14} />
                <span>Soạn thảo</span>
              </button>
              <button
                type="button"
                onClick={() => setEditorMode("preview")}
                className={`tab-mode-btn ${editorMode === "preview" ? "active" : ""}`}
              >
                <Eye size={14} />
                <span>Xem trước</span>
              </button>
              <button
                type="button"
                onClick={() => setEditorMode("code")}
                className={`tab-mode-btn ${editorMode === "code" ? "active" : ""}`}
              >
                <Code size={14} />
                <span>Mã HTML</span>
              </button>
            </div>
          </div>

          {/* KHUNG POPUP CHÈN ẢNH VÀO BÀI VIẾT (1 ẢNH HOẶC 2 ẢNH NGANG HÀNG) */}
          {showImageInserter && (
            <div className="image-inserter-popover">
              <div className="inserter-header">
                <h5>
                  {inserterLayoutMode === "two_cols" ? (
                    <>
                      <Columns2 size={16} color="#10b981" /> Chèn 2 hình ảnh ngang hàng (song song cạnh nhau)
                    </>
                  ) : (
                    <>
                      <ImageIcon size={16} color="#10b981" /> Chèn hình ảnh vào bài viết dịch vụ
                    </>
                  )}
                </h5>
                <button
                  type="button"
                  onClick={() => setShowImageInserter(false)}
                  className="btn-close-popover"
                >
                  <X size={15} />
                </button>
              </div>

              {/* THANH CHỌN BỐ CỤC: 1 ẢNH ĐƠN HOẶC 2 ẢNH NGANG HÀNG */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginBottom: "14px",
                  background: "rgba(15, 23, 42, 0.65)",
                  padding: "4px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.08)"
                }}
              >
                <button
                  type="button"
                  onClick={() => setInserterLayoutMode("single")}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    background: inserterLayoutMode === "single" ? "#10b981" : "transparent",
                    color: inserterLayoutMode === "single" ? "#ffffff" : "#94a3b8",
                    transition: "all 0.2s ease"
                  }}
                >
                  <ImageIcon size={14} /> 1 ảnh đơn (Căn giữa / Toàn dòng)
                </button>
                <button
                  type="button"
                  onClick={() => setInserterLayoutMode("two_cols")}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    background: inserterLayoutMode === "two_cols" ? "#10b981" : "transparent",
                    color: inserterLayoutMode === "two_cols" ? "#ffffff" : "#94a3b8",
                    transition: "all 0.2s ease"
                  }}
                >
                  <Columns2 size={14} /> 2 ảnh ngang hàng (Song song 50% - 50%)
                </button>
              </div>

              <div className="inserter-body">
                {/* 1. CHẾ ĐỘ 1 ẢNH ĐƠN */}
                {inserterLayoutMode === "single" && (
                  <>
                    <div className="inserter-row">
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
                        placeholder="Ví dụ: Kỹ thuật viên đang kiểm tra mô tơ tại nhà khách hàng"
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
                          {insertImageCaption || "Hình ảnh minh họa dịch vụ"}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* 2. CHẾ ĐỘ 2 ẢNH NGANG HÀNG (SONG SONG 50% - 50%) */}
                {inserterLayoutMode === "two_cols" && (
                  <div className="two-images-inserter-cols">
                    {/* CỘT ẢNH 1 - TRÁI */}
                    <div className="two-images-col-card">
                      <div className="two-images-col-title">
                        <ImageIcon size={14} /> 1. Hình ảnh bên trái
                      </div>
                      <div>
                        <label style={{ fontSize: "0.78rem", color: "#cbd5e1", display: "block", marginBottom: "6px" }}>Chọn ảnh từ máy:</label>
                        <label className="btn-upload-file-label" style={{ width: "100%", boxSizing: "border-box" }}>
                          <Upload size={14} />
                          <span>{isUploadingInsertImg ? "Đang tải ảnh 1..." : "Tải ảnh 1 lên"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleUploadInsertImage}
                            disabled={isUploadingInsertImg}
                            style={{ display: "none" }}
                          />
                        </label>
                      </div>
                      <div>
                        <label style={{ fontSize: "0.78rem", color: "#cbd5e1", display: "block", marginBottom: "4px" }}>Hoặc dán URL ảnh 1:</label>
                        <input
                          type="text"
                          value={insertImageUrl}
                          onChange={(e) => setInsertImageUrl(e.target.value)}
                          placeholder="https://... hoặc /uploads/..."
                          className="inserter-text-input"
                          style={{ width: "100%", boxSizing: "border-box" }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: "0.78rem", color: "#cbd5e1", display: "block", marginBottom: "4px" }}>Chú thích ảnh 1:</label>
                        <input
                          type="text"
                          value={insertImageCaption}
                          onChange={(e) => setInsertImageCaption(e.target.value)}
                          placeholder="Ví dụ: Hình ảnh công trình tại Hải Châu"
                          className="inserter-text-input"
                          style={{ width: "100%", boxSizing: "border-box" }}
                        />
                      </div>
                      {insertImageUrl && (
                        <div className="inserter-preview" style={{ maxHeight: "140px" }}>
                          <img src={insertImageUrl} alt="Xem trước ảnh 1" style={{ maxHeight: "90px", objectFit: "cover" }} />
                          <span className="preview-caption">{insertImageCaption || "Ảnh bên trái"}</span>
                        </div>
                      )}
                    </div>

                    {/* CỘT ẢNH 2 - PHẢI */}
                    <div className="two-images-col-card">
                      <div className="two-images-col-title">
                        <ImageIcon size={14} /> 2. Hình ảnh bên phải
                      </div>
                      <div>
                        <label style={{ fontSize: "0.78rem", color: "#cbd5e1", display: "block", marginBottom: "6px" }}>Chọn ảnh từ máy:</label>
                        <label className="btn-upload-file-label" style={{ width: "100%", boxSizing: "border-box" }}>
                          <Upload size={14} />
                          <span>{isUploadingInsertImg2 ? "Đang tải ảnh 2..." : "Tải ảnh 2 lên"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleUploadInsertImage2}
                            disabled={isUploadingInsertImg2}
                            style={{ display: "none" }}
                          />
                        </label>
                      </div>
                      <div>
                        <label style={{ fontSize: "0.78rem", color: "#cbd5e1", display: "block", marginBottom: "4px" }}>Hoặc dán URL ảnh 2:</label>
                        <input
                          type="text"
                          value={insertImgUrl2}
                          onChange={(e) => setInsertImgUrl2(e.target.value)}
                          placeholder="https://... hoặc /uploads/..."
                          className="inserter-text-input"
                          style={{ width: "100%", boxSizing: "border-box" }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: "0.78rem", color: "#cbd5e1", display: "block", marginBottom: "4px" }}>Chú thích ảnh 2:</label>
                        <input
                          type="text"
                          value={insertCaption2}
                          onChange={(e) => setInsertCaption2(e.target.value)}
                          placeholder="Ví dụ: Hoàn thiện lắp đặt cửa cuốn nan nhôm"
                          className="inserter-text-input"
                          style={{ width: "100%", boxSizing: "border-box" }}
                        />
                      </div>
                      {insertImgUrl2 && (
                        <div className="inserter-preview" style={{ maxHeight: "140px" }}>
                          <img src={insertImgUrl2} alt="Xem trước ảnh 2" style={{ maxHeight: "90px", objectFit: "cover" }} />
                          <span className="preview-caption">{insertCaption2 || "Ảnh bên phải"}</span>
                        </div>
                      )}
                    </div>
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

                  {inserterLayoutMode === "single" ? (
                    <button
                      type="button"
                      onClick={handleConfirmInsertImage}
                      disabled={!insertImageUrl.trim()}
                      className="btn-inserter-confirm"
                    >
                      <CheckCircle2 size={15} /> Chèn vào vị trí con trỏ
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleConfirmInsertTwoImages}
                      disabled={!insertImageUrl.trim() && !insertImgUrl2.trim()}
                      className="btn-inserter-confirm"
                      style={{ background: "linear-gradient(135deg, #059669 0%, #10b981 100%)" }}
                    >
                      <Columns2 size={15} /> Chèn 2 ảnh ngang hàng vào bài
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* KHUNG POPUP GẮN LINK (HYPERLINK) VÀO CHỮ */}
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
                    placeholder="https://... hoặc /bang-gia hoặc tel:0904678323"
                    className="inserter-text-input"
                    autoFocus
                  />
                </div>

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
            {/* FLOATING LINK PREVIEW CARD */}
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
                  {["35%", "50%", "70%", "100%"].map((sz) => (
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
                <button
                  type="button"
                  className={`size-pill-btn ${selectedImgSize === "50%" ? "active" : ""}`}
                  onClick={handleSetTwoImagesLayout}
                  title="Xếp 2 ảnh nằm ngang hàng cạnh nhau (50% - 50%)"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    background: selectedImgSize === "50%" ? "#10b981" : "rgba(16, 185, 129, 0.2)",
                    color: selectedImgSize === "50%" ? "#ffffff" : "#10b981",
                    border: "1px solid rgba(16, 185, 129, 0.4)",
                    padding: "3px 8px"
                  }}
                >
                  <Columns2 size={12} />
                  <span>2 ảnh ngang (50%)</span>
                </button>
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
                  placeholder="Bắt đầu viết bài giới thiệu chi tiết dịch vụ tại đây... (Có thể bấm 'Nạp bài viết mẫu dịch vụ chuẩn' ở góc trên để có sẵn khung sườn chuẩn)"
                />
              </div>
            )}

            {editorMode === "code" && (
              <div className="article-code-wrapper">
                <textarea
                  value={serviceForm.content || ""}
                  onChange={(e) => setServiceForm({ ...serviceForm, content: e.target.value })}
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
                    Chế độ xem trước: Bài viết hiển thị như khách hàng nhìn thấy trong chi tiết dịch vụ
                  </span>
                </div>
                <div
                  className="project-article-rendered-content preview-article-canvas"
                  dangerouslySetInnerHTML={{
                    __html:
                      serviceForm.content ||
                      "<p style='color: #94a3b8; font-style: italic; text-align: center; padding: 40px;'>Chưa có nội dung bài viết dịch vụ. Hãy chuyển sang tab 'Soạn thảo' hoặc bấm 'Nạp bài viết mẫu dịch vụ chuẩn' để bắt đầu!</p>"
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
                Mẹo: Bấm <strong>"⚡ Nạp bài viết mẫu dịch vụ chuẩn"</strong> để tự động có sẵn khung sườn chuyên nghiệp (bảng cam kết, quy trình 4 bước, hotline) rồi chỉ cần thay chữ theo ý bạn!
              </span>
            </div>
            {serviceForm.content && (
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

        {/* NÚT THAO TÁC SUBMIT HOẶC HỦY FORM */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "12px",
            marginTop: "1.25rem",
            paddingTop: "1rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)"
          }}
        >
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: "10px 20px",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#cbd5e1",
                borderRadius: "8px",
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              Hủy bỏ
            </button>
          )}

          <button
            type="submit"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 28px",
              background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
              border: "none",
              color: "#ffffff",
              borderRadius: "8px",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
              transition: "all 0.2s ease"
            }}
          >
            <Save size={16} />
            <span>{editingService ? "Lưu Cập Nhật Dịch Vụ" : "Đăng Dịch Vụ Mới"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
