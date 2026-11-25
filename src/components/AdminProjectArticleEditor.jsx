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
  Columns2,
  Columns
} from "lucide-react";
import "./AdminProjectArticleEditor.css";

export const SAMPLE_PROJECT_TEMPLATE = {
  title: "Thi công cửa cuốn khe thoáng cho anh Đô - Lê Lai",
  category: "Cửa Cuốn Khe Thoáng",
  location: "66 Lê Lai, Hải Châu, Đà Nẵng",
  completedDate: "2026",
  image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
  description: "Thi công lắp đặt hoàn thiện hệ thống cửa cuốn khe thoáng Eurodoor E60 công nghệ Đức cho gia đình anh Đô tại đường Lê Lai, Đà Nẵng.",
  content: `<table class="project-specs-table" style="width: 100%; border-collapse: collapse; margin: 16px 0 24px 0; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
  <tbody>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px 14px; font-weight: 700; color: #07522f; width: 22%; background: #f1f5f9;">Khách hàng:</td>
      <td style="padding: 10px 14px; color: #1e293b; width: 28%;">Anh Đô</td>
      <td style="padding: 10px 14px; font-weight: 700; color: #07522f; width: 22%; background: #f1f5f9;">Địa chỉ:</td>
      <td style="padding: 10px 14px; color: #1e293b; width: 28%;">66 Lê Lai, Hải Châu, Đà Nẵng</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px 14px; font-weight: 700; color: #07522f; background: #f1f5f9;">Sản phẩm:</td>
      <td style="padding: 10px 14px; color: #1e293b;">Cửa cuốn khe thoáng Eurodoor E60</td>
      <td style="padding: 10px 14px; font-weight: 700; color: #07522f; background: #f1f5f9;">Diện tích:</td>
      <td style="padding: 10px 14px; color: #1e293b;">10m² (Mặt tiền chính)</td>
    </tr>
    <tr>
      <td style="padding: 10px 14px; font-weight: 700; color: #07522f; background: #f1f5f9;">Cấu hình:</td>
      <td style="padding: 10px 14px; color: #1e293b;">Mô tơ BossDoor 500kg, Lưu điện UPS, 2 Remote mã nhảy</td>
      <td style="padding: 10px 14px; font-weight: 700; color: #07522f; background: #f1f5f9;">Thời gian:</td>
      <td style="padding: 10px 14px; color: #1e293b;">01 ngày (Bàn giao hoàn thiện)</td>
    </tr>
  </tbody>
</table>

<h3 style="color: #07522f; font-size: 1.18rem; font-weight: 700; margin: 20px 0 10px 0;">1. Khảo sát hiện trạng & nhu cầu của khách hàng</h3>
<p style="margin-bottom: 14px; line-height: 1.75; color: #334155;">Gia đình anh Đô tại đường Lê Lai (Hải Châu, Đà Nẵng) hoàn thiện căn nhà phố mặt tiền và mong muốn lắp đặt một bộ cửa cuốn vừa đảm bảo an ninh vững chắc, vừa thông thoáng đón ánh sáng tự nhiên và vận hành siêu êm ái cho tầng trệt.</p>
<p style="margin-bottom: 16px; line-height: 1.75; color: #334155;">Đội ngũ kỹ thuật viên BossDoor Đà Nẵng đã có mặt trực tiếp khảo sát kích thước khung chờ, tư vấn gia chủ lựa chọn dòng <strong>Cửa cuốn khe thoáng Eurodoor E60</strong> công nghệ Đức với nan nhôm hợp kim 6063-T5 phủ sơn tĩnh điện AkzoNobel cao cấp.</p>

<figure class="project-article-figure" style="text-align: center; margin: 24px 0;">
  <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80" alt="Khảo sát khung ray tại công trình anh Đô" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.12); border: 1px solid #e2e8f0;" />
  <figcaption style="margin-top: 8px; font-size: 0.88rem; color: #64748b; font-style: italic; text-align: center;">Hình ảnh 1: Kỹ thuật viên BossDoor tiến hành đo đạc và định vị ray dẫn hướng tại công trình anh Đô</figcaption>
</figure>

<h3 style="color: #07522f; font-size: 1.18rem; font-weight: 700; margin: 24px 0 10px 0;">2. Quy trình thi công thực tế tại công trình</h3>
<p style="margin-bottom: 12px; line-height: 1.75; color: #334155;">Quá trình thi công được thực hiện bài bản và nghiêm ngặt theo quy chuẩn an toàn hàng đầu của BOSS Đà Nẵng:</p>
<ul style="padding-left: 20px; margin-bottom: 16px; color: #334155; line-height: 1.75;">
  <li><strong>Bước 1 - Lắp đặt ray dẫn hướng:</strong> Sử dụng máy cân bằng laser định vị chuẩn xác độ thẳng đứng của hai ray nhôm, triệt tiêu ma sát và tiếng ồn khi cửa chuyển động.</li>
  <li><strong>Bước 2 - Lắp trục cuốn & gác mô tơ:</strong> Lắp trục cuốn thép mạ kẽm chịu lực cao, gắn mô tơ BossDoor 500kg đồng bộ.</li>
  <li><strong>Bước 3 - Lắp ráp các nan cửa khe thoáng:</strong> Ghép từng thanh nan Eurodoor E60, cài bọ nhựa chống xô nan hai đầu.</li>
  <li><strong>Bước 4 - Đấu nối điều khiển & an toàn:</strong> Cài đặt hệ thống cảm biến tự dừng khi gặp vật cản và tích hợp bình lưu điện UPS dự phòng mất điện.</li>
  <li><strong>Bước 5 - Căn chỉnh hành trình và nghiệm thu:</strong> Căn chỉnh rơ-le hành trình dừng trên - dưới chính xác và chạy thử tải liên tục.</li>
</ul>

<figure class="project-article-figure" style="text-align: center; margin: 24px 0;">
  <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80" alt="Lắp đặt nan cửa cuốn khe thoáng Eurodoor" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.12); border: 1px solid #e2e8f0;" />
  <figcaption style="margin-top: 8px; font-size: 0.88rem; color: #64748b; font-style: italic; text-align: center;">Hình ảnh 2: Hoàn thiện lắp ráp các nan cửa cuốn khe thoáng đón gió tự nhiên</figcaption>
</figure>

<h3 style="color: #07522f; font-size: 1.18rem; font-weight: 700; margin: 24px 0 10px 0;">3. Bàn giao & Nghiệm thu công trình</h3>
<p style="margin-bottom: 14px; line-height: 1.75; color: #334155;">Sau 1 ngày triển khai khẩn trương và cẩn trọng, công trình đã được hoàn thành đúng tiến độ. Cửa vận hành êm ru, các khe thoáng mở rộng tạo cảm giác thoáng đãng cho ngôi nhà, mặt tiền nổi bật với thiết kế hiện đại sang trọng.</p>
<p style="margin-bottom: 16px; line-height: 1.75; color: #334155;">Kỹ thuật viên BOSS Đà Nẵng đã trực tiếp hướng dẫn gia đình anh Đô cách vận hành remote, cách xả xích cơ khi mất điện và bàn giao sổ bảo hành chính hãng 24 tháng cho khách hàng.</p>

<figure class="project-article-figure" style="text-align: center; margin: 24px 0;">
  <img src="https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80" alt="Bàn giao công trình hoàn thiện cho gia chủ" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.12); border: 1px solid #e2e8f0;" />
  <figcaption style="margin-top: 8px; font-size: 0.88rem; color: #64748b; font-style: italic; text-align: center;">Hình ảnh 3: Toàn cảnh mặt tiền cửa cuốn sau khi bàn giao nghiệm thu hoàn thiện</figcaption>
</figure>`
};

export default function AdminProjectArticleEditor({
  projectForm,
  setProjectForm,
  editingProject,
  onSave,
  onCancel,
  showToast,
  compressImage,
  isUploading,
  setIsUploading
}) {
  const editorRef = useRef(null);
  const lastHtmlRef = useRef(projectForm.content || "");
  const [editorMode, setEditorMode] = useState("wysiwyg"); // "wysiwyg" | "code" | "preview"
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

  // Trạng thái gắn link liên kết (Hyperlink) vào chữ
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
    if (editorMode !== "wysiwyg") {
      setEditorMode("wysiwyg");
    }

    const sel = window.getSelection();
    let selectedStr = "";
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
        savedRangeRef.current = range.cloneRange();
        selectedStr = range.toString().trim();
      }
    }

    // Nếu đang chọn trúng thẻ a đã có link -> nạp link cũ lên
    if (sel && sel.anchorNode) {
      const anchorEl = sel.anchorNode.parentElement?.closest("a");
      if (anchorEl) {
        editingAnchorRef.current = anchorEl;
        const existingHref = anchorEl.getAttribute("href") || "";
        if (existingHref) setLinkUrl(existingHref);
        if (!selectedStr) {
          selectedStr = anchorEl.textContent.trim();
        }
        setLinkOpenNewTab(anchorEl.target === "_blank");
      }
    }

    setLinkText(selectedStr);
    setShowImageInserter(false);
    setShowLinkPopover(true);
  };

  // Xác nhận gắn link liên kết vào đúng vị trí chữ đã chọn (Màu xanh dương & gạch chân)
  const handleConfirmInsertLink = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    let cleanUrl = linkUrl.trim();
    if (!cleanUrl) {
      alert("Vui lòng nhập hoặc dán địa chỉ đường dẫn (URL) liên kết!");
      return;
    }

    // Tự động thêm https:// nếu người dùng chỉ gõ tên miền
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
      // Kiểm tra vùng chọn có hợp lệ và nằm bên trong editor không
      if (range && editorRef.current.contains(range.commonAncestorContainer)) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        // Tạo thẻ a đúng vị trí chữ đang chọn với màu xanh dương và gạch chân
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

        // Xóa đoạn chữ cũ tại đúng vị trí nớ và chèn thẻ link vào đúng vị trí đó
        range.deleteContents();
        range.insertNode(linkEl);

        // Đặt con trỏ ngay sau thẻ link vừa tạo
        const newRange = document.createRange();
        newRange.setStartAfter(linkEl);
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);

        editorRef.current.focus();
        handleContentInput();
      } else {
        // Fallback chèn thẻ a nếu không có vùng chọn
        editorRef.current.focus();
        const linkHtml = `<a href="${cleanUrl}"${targetAttr} title="Liên kết: ${cleanUrl}" data-link-url="${cleanUrl}" class="project-article-link" style="${inlineStyle}">${displayText}</a>`;
        document.execCommand("insertHTML", false, linkHtml);
        handleContentInput();
      }
    } else {
      const linkHtml = `<a href="${cleanUrl}"${targetAttr} title="Liên kết: ${cleanUrl}" data-link-url="${cleanUrl}" class="project-article-link" style="${inlineStyle}">${displayText}</a>`;
      setProjectForm((prev) => ({
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

  // Gỡ bỏ link liên kết khỏi đoạn chữ
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
  }, [projectForm.content, editorMode]);

  // Đồng bộ nội dung vào editor DOM khi chuyển chế độ hoặc đổi bài viết
  useEffect(() => {
    if (editorRef.current && editorMode === "wysiwyg") {
      const currentHtml = projectForm.content || "";
      if (editorRef.current.innerHTML !== currentHtml) {
        if (document.activeElement !== editorRef.current) {
          editorRef.current.innerHTML = currentHtml;
          lastHtmlRef.current = currentHtml;
        }
      }
    }
  }, [editingProject, editorMode]);

  // Handle content changes from contentEditable div
  const handleContentInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    lastHtmlRef.current = html;
    setProjectForm((prev) => ({ ...prev, content: html }));
  };

  const cleanHtmlForSave = (html) => {
    if (!html) return "";
    return html
      .replace(/\s*class="([^"]*)\bimg-selected\b([^"]*)"/g, (match, p1, p2) => {
        const remaining = (p1 + " " + p2).trim().replace(/\s+/g, " ");
        return remaining ? ` class="${remaining}"` : "";
      })
      .replace(/\s*data-selected="true"/g, "");
  };

  const handleFormSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    let finalContent = projectForm.content || "";
    if (editorMode === "wysiwyg" && editorRef.current) {
      finalContent = editorRef.current.innerHTML;
      lastHtmlRef.current = finalContent;
    }
    finalContent = cleanHtmlForSave(finalContent);
    setProjectForm((prev) => ({ ...prev, content: finalContent }));
    if (onSave) {
      onSave(e, finalContent);
    }
  };

  // Run formatting commands (Bold, Italic, List, H3)
  const execCmd = (command, value = null) => {
    if (editorMode !== "wysiwyg") return;
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      handleContentInput();
    }
  };

  // 1-Click Load Sample Article (Anh Đô - Lê Lai)
  const handleLoadSample = () => {
    if (
      projectForm.content &&
      projectForm.content.trim().length > 10 &&
      !window.confirm("Nạp bài mẫu sẽ thay thế nội dung hiện tại. Bạn có chắc chắn muốn nạp?")
    ) {
      return;
    }

    setProjectForm((prev) => ({
      ...prev,
      title: prev.title || SAMPLE_PROJECT_TEMPLATE.title,
      category: prev.category || SAMPLE_PROJECT_TEMPLATE.category,
      location: prev.location || SAMPLE_PROJECT_TEMPLATE.location,
      image: prev.image || SAMPLE_PROJECT_TEMPLATE.image,
      images: prev.images && prev.images.length > 0 ? prev.images : [SAMPLE_PROJECT_TEMPLATE.image],
      description: prev.description || SAMPLE_PROJECT_TEMPLATE.description,
      content: SAMPLE_PROJECT_TEMPLATE.content
    }));

    if (editorRef.current) {
      editorRef.current.innerHTML = SAMPLE_PROJECT_TEMPLATE.content;
    }

    if (showToast) {
      showToast("⚡ Đã nạp thành công bài viết mẫu công trình chuẩn (Anh Đô - Lê Lai)!");
    }
  };

  // Insert Quick Specs Table
  const handleInsertSpecsTable = () => {
    const tableHtml = `
<table class="project-specs-table" style="width: 100%; border-collapse: collapse; margin: 16px 0 24px 0; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
  <tbody>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px 14px; font-weight: 700; color: #07522f; width: 22%; background: #f1f5f9;">Khách hàng:</td>
      <td style="padding: 10px 14px; color: #1e293b; width: 28%;">Anh/Chị...</td>
      <td style="padding: 10px 14px; font-weight: 700; color: #07522f; width: 22%; background: #f1f5f9;">Địa chỉ:</td>
      <td style="padding: 10px 14px; color: #1e293b; width: 28%;">${projectForm.location || "Đà Nẵng"}</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px 14px; font-weight: 700; color: #07522f; background: #f1f5f9;">Sản phẩm:</td>
      <td style="padding: 10px 14px; color: #1e293b;">${projectForm.category || "Cửa cuốn khe thoáng"}</td>
      <td style="padding: 10px 14px; font-weight: 700; color: #07522f; background: #f1f5f9;">Diện tích:</td>
      <td style="padding: 10px 14px; color: #1e293b;">... m²</td>
    </tr>
    <tr>
      <td style="padding: 10px 14px; font-weight: 700; color: #07522f; background: #f1f5f9;">Cấu hình:</td>
      <td style="padding: 10px 14px; color: #1e293b;">Mô tơ tải trọng cao, Lưu điện UPS, Remote</td>
      <td style="padding: 10px 14px; font-weight: 700; color: #07522f; background: #f1f5f9;">Thời gian:</td>
      <td style="padding: 10px 14px; color: #1e293b;">01 ngày (Bàn giao hoàn thiện)</td>
    </tr>
  </tbody>
</table><p><br></p>`;

    if (editorMode === "wysiwyg" && editorRef.current) {
      editorRef.current.focus();
      document.execCommand("insertHTML", false, tableHtml);
      handleContentInput();
    } else {
      setProjectForm((prev) => ({
        ...prev,
        content: (prev.content || "") + tableHtml
      }));
    }
    if (showToast) showToast("📊 Đã chèn bảng thông số kỹ thuật vào bài viết!");
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

      // Fallback base64
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

      // Fallback base64
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

  // Confirm Insert Image into Article
  const handleConfirmInsertImage = () => {
    if (!insertImageUrl.trim()) {
      alert("Vui lòng chọn ảnh từ máy hoặc dán link ảnh trước!");
      return;
    }

    const captionText = insertImageCaption.trim() || "Hình ảnh thi công thực tế tại công trình";
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
      setProjectForm((prev) => ({
        ...prev,
        content: (prev.content || "") + figureHtml
      }));
    }

    // Auto add to gallery images if not already there
    setProjectForm((prev) => {
      const currentList = Array.isArray(prev.images) ? [...prev.images] : [];
      if (!currentList.includes(insertImageUrl.trim())) {
        currentList.push(insertImageUrl.trim());
      }
      return {
        ...prev,
        image: prev.image || insertImageUrl.trim(),
        images: currentList,
        gallery: currentList
      };
    });

    // Reset inserter
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
    const cap1 = insertImageCaption.trim() || "Hình ảnh thi công thực tế 1";
    const cap2 = insertCaption2.trim() || "Hình ảnh thi công thực tế 2";

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
      setProjectForm((prev) => ({
        ...prev,
        content: (prev.content || "") + twoImagesHtml
      }));
    }

    setProjectForm((prev) => {
      const currentList = Array.isArray(prev.images) ? [...prev.images] : [];
      if (!currentList.includes(img1)) currentList.push(img1);
      if (!currentList.includes(img2)) currentList.push(img2);
      return {
        ...prev,
        image: prev.image || img1,
        images: currentList,
        gallery: currentList
      };
    });

    setInsertImageUrl("");
    setInsertImageCaption("");
    setInsertImgUrl2("");
    setInsertCaption2("");
    setShowImageInserter(false);

    if (showToast) showToast("🖼️🖼️ Đã chèn cụm 2 ảnh ngang hàng vào bài viết thành công!");
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
      showToast("✨ Đã đặt kích thước ảnh 50% ngang hàng! Bấm tương tự cho ảnh kế tiếp để 2 ảnh nằm cạnh nhau.");
    }
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

  // Clear article content
  const handleClearArticle = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ nội dung bài viết này không?")) {
      setProjectForm((prev) => ({ ...prev, content: "" }));
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
              Tên công trình / Tiêu đề bài viết *
            </label>
            <input
              type="text"
              value={projectForm.title}
              onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
              required
              className="input-title-large"
              placeholder="Ví dụ: Thi công cửa cuốn khe thoáng cho anh Đô - Lê Lai"
            />
          </div>

          <div className="admin-form-grid-3">
            <div className="admin-form-group">
              <label>Hạng mục / Loại sản phẩm</label>
              <input
                type="text"
                value={projectForm.category}
                onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                placeholder="Cửa Cuốn Khe Thoáng / Cổng Tự Động / Cửa Kéo..."
              />
            </div>

            <div className="admin-form-group">
              <label>Địa điểm thi công</label>
              <input
                type="text"
                value={projectForm.location}
                onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                placeholder="Ví dụ: 66 Lê Lai, Hải Châu, Đà Nẵng"
              />
            </div>

            <div className="admin-form-group">
              <label>Ngày tháng đã thi công (Gần đây nhất lên đầu)</label>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <input
                  type="text"
                  value={projectForm.completedDate || ""}
                  onChange={(e) => setProjectForm({ ...projectForm, completedDate: e.target.value })}
                  placeholder="Ví dụ: 19/11/2026, Tháng 11/2026 hoặc 2026"
                  style={{ flex: 1 }}
                />
                <input
                  type="date"
                  title="Chọn nhanh từ lịch"
                  style={{ width: "40px", height: "38px", padding: "4px", cursor: "pointer", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#f8fafc" }}
                  onChange={(e) => {
                    if (e.target.value) {
                      const [y, m, d] = e.target.value.split("-");
                      setProjectForm({ ...projectForm, completedDate: `${d}/${m}/${y}` });
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= PHẦN 2: BÀI VIẾT CÔNG TRÌNH (CHỮ XEN KẼ HÌNH ẢNH) ================= */}
        <div className="editor-article-section">
          <div className="article-section-header">
            <div>
              <h4 className="article-section-title">
                <FileText size={18} color="#10b981" />
                Nội Dung Bài Viết Chi Tiết (Chữ xen kẽ Hình ảnh & Bảng thông số)
              </h4>
              <p className="article-section-desc">
                Soạn bài viết trực quan như trên báo: gõ chữ, chèn hình ảnh thi công thực tế kèm chú thích, chèn bảng thông số.
              </p>
            </div>

            {/* NÚT NẠP BÀI MẪU CHUẨN */}
            <button
              type="button"
              onClick={handleLoadSample}
              className="btn-load-sample"
              title="Nạp cấu trúc bài viết mẫu chuẩn y như link BossDoor Đà Nẵng"
            >
              <Sparkles size={16} />
              <span>⚡ Nạp bài viết mẫu (Anh Đô - Lê Lai)</span>
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
                title="Gỡ bỏ link liên kết khỏi đoạn chữ đang chọn"
              >
                <Unlink size={15} /> <span>Bỏ link</span>
              </button>
            </div>

            <div className="toolbar-group highlight-tools">
              <button
                type="button"
                onClick={() => {
                  setShowLinkPopover(false);
                  setInserterLayoutMode("single");
                  setShowImageInserter(!showImageInserter || inserterLayoutMode !== "single");
                }}
                className={`tool-btn-highlight ${showImageInserter && inserterLayoutMode === "single" ? "active" : ""}`}
                title="Chèn hình ảnh thi công kèm chú thích vào bài"
              >
                <ImageIcon size={16} />
                <strong>📷 Chèn ảnh vào bài</strong>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowLinkPopover(false);
                  setInserterLayoutMode("two_cols");
                  setShowImageInserter(true);
                }}
                className={`tool-btn-highlight ${showImageInserter && inserterLayoutMode === "two_cols" ? "active" : ""}`}
                title="Chèn 2 hình ảnh ngang hàng song song cạnh nhau vào bài viết"
                style={{
                  background: showImageInserter && inserterLayoutMode === "two_cols" ? "#10b981" : "rgba(16, 185, 129, 0.2)",
                  borderColor: "#10b981",
                  color: showImageInserter && inserterLayoutMode === "two_cols" ? "#ffffff" : "#10b981"
                }}
              >
                <Columns2 size={16} />
                <strong>2 ảnh ngang hàng</strong>
              </button>

              <button
                type="button"
                onClick={handleInsertSpecsTable}
                className="tool-btn-highlight secondary"
                title="Chèn bảng thông số kỹ thuật thi công nhanh"
              >
                <Table size={16} />
                <span>📊 Chèn bảng thông số</span>
              </button>
            </div>

            <div className="toolbar-group mode-toggle-group">
              <button
                type="button"
                onClick={() => {
                  if (editorMode === "code" && editorRef.current) {
                    editorRef.current.innerHTML = projectForm.content || "";
                  }
                  setEditorMode("wysiwyg");
                }}
                className={`tool-mode-btn ${editorMode === "wysiwyg" ? "active" : ""}`}
              >
                <Edit3 size={14} /> <span>Soạn thảo</span>
              </button>
              <button
                type="button"
                onClick={() => setEditorMode("preview")}
                className={`tool-mode-btn ${editorMode === "preview" ? "active" : ""}`}
              >
                <Eye size={14} /> <span>Xem trước</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (editorMode === "wysiwyg" && editorRef.current) {
                    setProjectForm((prev) => ({ ...prev, content: editorRef.current.innerHTML }));
                  }
                  setEditorMode("code");
                }}
                className={`tool-mode-btn ${editorMode === "code" ? "active" : ""}`}
                title="Chỉnh sửa mã HTML trực tiếp"
              >
                <Code size={14} /> <span>Mã HTML</span>
              </button>
            </div>
          </div>

          {/* KHUNG CHÈN ẢNH NHANH (POPOVER INSERTER - 1 ẢNH HOẶC 2 ẢNH NGANG HÀNG) */}
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
                      <ImageIcon size={16} color="#10b981" /> Chèn hình ảnh thi công thực tế vào bài viết
                    </>
                  )}
                </h5>
                <button
                  type="button"
                  onClick={() => setShowImageInserter(false)}
                  className="btn-close-inserter"
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
                      <div className="inserter-field flex-2">
                        <label>Đường dẫn ảnh (URL hoặc chọn từ máy):</label>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <input
                            type="text"
                            value={insertImageUrl}
                            onChange={(e) => setInsertImageUrl(e.target.value)}
                            placeholder="Dán link URL ảnh tại đây hoặc bấm nút Chọn ảnh..."
                            style={{ flex: 1 }}
                          />
                          <label className="btn-inserter-upload">
                            {isUploadingInsertImg ? (
                              <>
                                <Loader2 size={15} className="spin" />
                                <span>Đang tải...</span>
                              </>
                            ) : (
                              <>
                                <Upload size={15} />
                                <span>Chọn ảnh từ máy</span>
                              </>
                            )}
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
                    </div>

                    <div className="inserter-row">
                      <div className="inserter-field">
                        <label>Dòng chú thích ảnh (Hiển thị ngay dưới chân ảnh):</label>
                        <input
                          type="text"
                          value={insertImageCaption}
                          onChange={(e) => setInsertImageCaption(e.target.value)}
                          placeholder="Ví dụ: Hình ảnh: Đội ngũ kỹ thuật viên đang lắp đặt ray nhôm dẫn hướng"
                        />
                      </div>
                    </div>

                    <div className="inserter-row">
                      <div className="inserter-field">
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
                    </div>

                    {insertImageUrl && (
                      <div className="inserter-preview-box">
                        <img src={insertImageUrl} alt="Xem trước ảnh chèn" />
                        <span>{insertImageCaption || "Hình ảnh thi công thực tế tại công trình"}</span>
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
                          placeholder="Ví dụ: Công trình lắp đặt cửa cuốn tại Hải Châu"
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
                          placeholder="Ví dụ: Hoàn thiện nghiệm thu cửa cuốn bàn giao gia chủ"
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
                    Hủy
                  </button>

                  {inserterLayoutMode === "single" ? (
                    <button
                      type="button"
                      onClick={handleConfirmInsertImage}
                      disabled={!insertImageUrl.trim() || isUploadingInsertImg}
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

          {/* KHUNG GẮN LINK LIÊN KẾT VÀO CHỮ (POPOVER) */}
          {showLinkPopover && (
            <div className="link-inserter-popover">
              <div className="inserter-header">
                <h5>
                  <LinkIcon size={16} color="#10b981" /> Gắn link liên kết (Hyperlink) vào chữ
                </h5>
                <button
                  type="button"
                  onClick={() => setShowLinkPopover(false)}
                  className="btn-close-inserter"
                  title="Đóng khung gắn link"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="inserter-body">
                <div className="inserter-row">
                  <div className="inserter-field">
                    <label>Chữ / Văn bản hiển thị trong bài viết:</label>
                    <input
                      type="text"
                      value={linkText}
                      onChange={(e) => setLinkText(e.target.value)}
                      placeholder="Ví dụ: Cửa cuốn Eurodoor E60, Báo giá cửa cuốn, tại đây..."
                    />
                  </div>
                </div>

                <div className="inserter-row">
                  <div className="inserter-field">
                    <label>Địa chỉ liên kết (URL website hoặc số điện thoại):</label>
                    <input
                      type="text"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="Dán link https://... hoặc /cua-cuon hoặc tel:0904678323..."
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleConfirmInsertLink(e);
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Gợi ý đường dẫn nhanh tiện lợi */}
                <div className="link-quick-pills">
                  <span className="pills-label">Gợi ý link nhanh:</span>
                  <button
                    type="button"
                    onClick={() => setLinkUrl("/cua-cuon")}
                    className="quick-link-pill"
                  >
                    🚪 Cửa cuốn
                  </button>
                  <button
                    type="button"
                    onClick={() => setLinkUrl("/bang-gia")}
                    className="quick-link-pill"
                  >
                    💰 Bảng giá
                  </button>
                  <button
                    type="button"
                    onClick={() => setLinkUrl("/cong-trinh")}
                    className="quick-link-pill"
                  >
                    🏗️ Công trình
                  </button>
                  <button
                    type="button"
                    onClick={() => setLinkUrl("tel:0904678323")}
                    className="quick-link-pill"
                  >
                    📞 Hotline (0904.678.323)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLinkUrl("https://zalo.me/0904678323")}
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
                  placeholder="Bắt đầu viết bài chia sẻ quá trình thi công thực tế tại đây... (Có thể bấm 'Nạp bài viết mẫu' ở góc trên để có sẵn khung sườn chuẩn)"
                />
              </div>
            )}

            {editorMode === "code" && (
              <div className="article-code-wrapper">
                <textarea
                  value={projectForm.content || ""}
                  onChange={(e) => setProjectForm({ ...projectForm, content: e.target.value })}
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
                    Chế độ xem trước: Bài viết hiển thị như giao diện khách hàng nhìn thấy trên website
                  </span>
                </div>
                <div
                  className="project-article-rendered-content preview-article-canvas"
                  dangerouslySetInnerHTML={{
                    __html:
                      projectForm.content ||
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
                Mẹo: Bấm <strong>"⚡ Nạp bài viết mẫu"</strong> để tự động có sẵn khung sườn chuẩn như bài viết của công ty, sau đó bạn chỉ cần thay chữ và hình ảnh của công trình bạn thi công!
              </span>
            </div>
            {projectForm.content && (
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
            {editingProject ? "Cập Nhật Công Trình" : "Lưu & Đăng Công Trình"}
          </button>
        </div>
      </form>
    </div>
  );
}

