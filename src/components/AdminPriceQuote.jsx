import React, { useState, useEffect, useRef } from "react";
import {
  Tag,
  Plus,
  Trash2,
  Edit,
  Save,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  FileSpreadsheet,
  Check,
  X,
  LayoutGrid,
  Columns,
  Rows,
  Sparkles,
  ArrowDown,
  ArrowLeft,
  Search,
  Info,
  Upload,
  Image as ImageIcon,
  Loader2,
  FileText,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
  Columns2,
  Palette,
  Highlighter,
  Code,
  Type,
  RemoveFormatting,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ExternalLink,
  Link2,
  Table,
  ArrowUp
} from "lucide-react";
import { DEFAULT_PRICE_QUOTES } from "../data/defaultPriceQuotes";
import "./AdminPriceQuote.css";

// Nhận diện cột hình ảnh (dựa vào key, id hoặc tiêu đề cột có chữ ảnh/hình/image)
export const isImageCol = (col) => {
  if (!col) return false;
  const k = (col.key || "").toLowerCase();
  const id = (col.id || "").toLowerCase();
  const l = (col.label || "").toLowerCase();
  return (
    k === "image" ||
    k === "img" ||
    id.includes("img") ||
    id.includes("image") ||
    l.includes("ảnh") ||
    l.includes("hình") ||
    l.includes("image") ||
    l.includes("photo")
  );
};

// 8 Cột mặc định tiêu chuẩn bao gồm Cột Hình Ảnh theo đúng chuẩn ngành cửa
export const DEFAULT_GRID_COLUMNS = [
  { id: "col_1", key: "stt", label: "STT", width: "50px" },
  { id: "col_2", key: "code", label: "Mã SP", width: "88px" },
  { id: "col_img", key: "image", label: "Hình ảnh", width: "150px" },
  { id: "col_3", key: "name", label: "Tên & Quy cách kỹ thuật", width: "240px" },
  { id: "col_4", key: "unit", label: "ĐVT", width: "65px" },
  { id: "col_5", key: "colors", label: "Màu sắc", width: "140px" },
  { id: "col_6", key: "priceOver8", label: "Đơn giá (> 8m²)", width: "130px" },
  { id: "col_7", key: "price6to8", label: "Đơn giá (≤ 8m²)", width: "130px" }
];

// Khởi tạo sẵn 7 hàng mẫu chuyên nghiệp đúng chuẩn có cột hình ảnh
export const createDefault7Rows = () => [
  {
    col_1: "1",
    col_2: "BD-01",
    col_img: "/project_1.png",
    col_3: "Cửa cuốn khe thoáng BossDoor tiêu chuẩn, nhôm 6063-T5",
    col_4: "m2",
    col_5: "Ghi sáng, Vàng kem",
    col_6: "1,250,000",
    col_7: "1,320,000"
  },
  {
    col_1: "2",
    col_2: "BD-02",
    col_img: "",
    col_3: "Cửa cuốn khe thoáng BossDoor chống bão gia cường kép",
    col_4: "m2",
    col_5: "Ghi sáng, Cafe cháy",
    col_6: "1,450,000",
    col_7: "1,520,000"
  },
  {
    col_1: "3",
    col_2: "BD-03",
    col_img: "",
    col_3: "Cửa cuốn BossDoor ECO siêu thoáng, giảm chấn 2 chiều",
    col_4: "m2",
    col_5: "Ghi sần, Cà phê",
    col_6: "1,650,000",
    col_7: "1,730,000"
  },
  {
    col_1: "4",
    col_2: "BD-04",
    col_img: "",
    col_3: "Cửa cuốn thế hệ mới khóa cơ an toàn chống cạy",
    col_4: "m2",
    col_5: "Ghi ánh kim",
    col_6: "1,850,000",
    col_7: "1,940,000"
  },
  {
    col_1: "5",
    col_2: "BD-05",
    col_img: "",
    col_3: "Cửa cuốn siêu êm tích hợp ron cao su giảm chấn",
    col_4: "m2",
    col_5: "Vàng kem, Nâu cafe",
    col_6: "2,100,000",
    col_7: "2,200,000"
  },
  {
    col_1: "6",
    col_2: "BD-06",
    col_img: "",
    col_3: "Cửa cuốn bản nan lớn Luxury sang trọng biệt thự",
    col_4: "m2",
    col_5: "Ghi sần cao cấp",
    col_6: "2,450,000",
    col_7: "2,560,000"
  },
  {
    col_1: "7",
    col_2: "BD-07",
    col_img: "",
    col_3: "Cửa cuốn siêu trường chống bão gió giật cấp 12",
    col_4: "m2",
    col_5: "Ghi xám đậm",
    col_6: "2,950,000",
    col_7: "3,100,000"
  }
];

// Chuẩn hóa cột hiển thị từ quote
export const getActiveColumns = (quote) => {
  if (quote?.customColumns && quote.customColumns.length > 0) {
    return quote.customColumns.map((c) => ({
      id: c.id || c.key,
      key: c.key || c.id,
      label: c.label || "Cột",
      width: c.width || "130px"
    }));
  }
  return DEFAULT_GRID_COLUMNS;
};

// Chuẩn hóa hàng hiển thị từ quote
export const getActiveRows = (quote, cols) => {
  if (!quote?.items || quote.items.length === 0) {
    return createDefault7Rows();
  }
  return quote.items.map((item, rIdx) => {
    const rowObj = {};
    const priceCols = cols.filter(
      (c) =>
        c.key?.toLowerCase().includes("price") ||
        c.id === "col_6" ||
        c.id === "col_7" ||
        c.id === "col_8" ||
        c.label?.toLowerCase().includes("giá") ||
        c.label?.toLowerCase().includes("đơn giá")
    );

    cols.forEach((col) => {
      // 1. Nếu là cột hình ảnh: ưu tiên đọc từ rawGridCells, item[col.id], item.image hoặc item.imageUrl
      if (isImageCol(col)) {
        const imgVal =
          (item.rawGridCells && item.rawGridCells[col.id]) ||
          item[col.id] ||
          item.image ||
          item.imageUrl ||
          "";
        rowObj[col.id] = String(imgVal);
        return;
      }

      // 2. Đọc trực tiếp từ rawGridCells nếu có
      if (item.rawGridCells && item.rawGridCells[col.id] !== undefined && item.rawGridCells[col.id] !== "") {
        rowObj[col.id] = String(item.rawGridCells[col.id]);
        return;
      }
      // 3. Đọc từ thuộc tính phẳng item[col.id] nếu có
      if (item[col.id] !== undefined && item[col.id] !== "") {
        rowObj[col.id] = String(item[col.id]);
        return;
      }
      // 4. Đọc từ col.key nếu có
      if (col.key && item[col.key] !== undefined && item[col.key] !== "") {
        rowObj[col.id] = String(item[col.key]);
        return;
      }

      // 5. Fallback theo từng loại cột
      const isStt = col.key === "stt" || col.id === "col_1" || col.label?.toLowerCase() === "stt";
      const isCode = col.key === "code" || col.id === "col_2" || col.label?.toLowerCase().includes("mã");
      const isName = col.key === "name" || col.id === "col_3" || col.label?.toLowerCase().includes("tên") || col.label?.toLowerCase().includes("quy cách");
      const isUnit = col.key === "unit" || col.id === "col_4" || col.label?.toLowerCase().includes("đvt");
      const isColor = col.key === "colors" || col.id === "col_5" || col.label?.toLowerCase().includes("màu");
      const isPrice = priceCols.some((pc) => pc.id === col.id);

      if (isStt) {
        rowObj[col.id] = String(item.stt || rIdx + 1);
      } else if (isCode) {
        rowObj[col.id] = String(item.code || "");
      } else if (isName) {
        rowObj[col.id] = String(item.name || item.description || "");
      } else if (isUnit) {
        rowObj[col.id] = String(item.unit || "m2");
      } else if (isColor) {
        rowObj[col.id] = String(item.colors || "Theo tiêu chuẩn");
      } else if (isPrice) {
        const pIdx = priceCols.findIndex((pc) => pc.id === col.id);
        if (pIdx === 0) {
          rowObj[col.id] = String(item.priceOver8 || item.price || "");
        } else if (pIdx === 1) {
          rowObj[col.id] = String(item.price6to8 || "");
        } else if (pIdx === 2) {
          rowObj[col.id] = String(item.price4to6 || "");
        } else {
          rowObj[col.id] = "";
        }
      } else {
        rowObj[col.id] = "";
      }
    });
    rowObj.productLink = String(item.productLink || item.url || (item.rawGridCells && item.rawGridCells.productLink) || "");
    return rowObj;
  });
};

// Component Textarea tự động co giãn chiều cao theo độ dài nội dung chữ (chữ dài tới đâu hộp to tới đó)
const AutoResizeTextarea = ({
  value,
  onChange,
  placeholder,
  className = "quote-article-textarea",
  minHeight = 90,
  style = {},
  ...props
}) => {
  const textareaRef = useRef(null);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      const newHeight = Math.max(el.scrollHeight, minHeight);
      el.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  useEffect(() => {
    window.addEventListener("resize", adjustHeight);
    return () => window.removeEventListener("resize", adjustHeight);
  }, []);

  return (
    <textarea
      ref={textareaRef}
      value={value || ""}
      onChange={(e) => {
        if (onChange) onChange(e);
        adjustHeight();
      }}
      placeholder={placeholder}
      className={className}
      style={{
        overflowY: "hidden",
        minHeight: `${minHeight}px`,
        boxSizing: "border-box",
        ...style
      }}
      {...props}
    />
  );
};

// Component Trình Soạn Thảo Văn Bản Phong Phú (Rich Text Editor) Trực Quan Kiểu Word/Docs
const RichArticleEditor = ({
  value,
  onChange,
  placeholder,
  minHeight = 120,
  badgeText = "Bài Viết Chi Tiết",
  hintText = "Nội dung bài viết chi tiết, hướng dẫn kỹ thuật",
  tableColumns = null,
  tableRows = null,
  onScrollToTable = null,
  allQuotes = null
}) => {
  const editorRef = useRef(null);
  const lastHtmlRef = useRef("");
  const [isCodeView, setIsCodeView] = useState(false);
  const [codeValue, setCodeValue] = useState("");
  const [showImgModal, setShowImgModal] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [imgCaption, setImgCaption] = useState("");
  const [imgSize, setImgSize] = useState("medium"); // small (35%) | medium (65%) | large (85%) | full (100%)
  const [showQuickTable, setShowQuickTable] = useState(false);
  const fileInputRef = useRef(null);

  // Image resizer & align controller (thanh điều khiển nổi cỡ ảnh giống Quản lý bài viết)
  const [selectedImgEl, setSelectedImgEl] = useState(null);
  const [selectedImgSize, setSelectedImgSize] = useState("100%");
  const [imgToolbarPos, setImgToolbarPos] = useState(null);

  // Chuẩn hóa nội dung ban đầu (nếu là plain text có dấu xuống dòng \n -> chuyển thành thẻ <p>)
  const toHtml = (val) => {
    if (!val) return "<p><br></p>";
    if (/<[a-z][\s\S]*>/i.test(val)) return val;
    return val
      .split(/\r?\n/)
      .map((line) => {
        const trimmed = line.trim();
        return trimmed ? `<p>${trimmed}</p>` : "<p><br></p>";
      })
      .join("");
  };

  useEffect(() => {
    const formatted = toHtml(value);
    if (editorRef.current && formatted !== lastHtmlRef.current) {
      editorRef.current.innerHTML = formatted;
      lastHtmlRef.current = formatted;
      setCodeValue(formatted);
    }
  }, [value]);

  // Cập nhật vị trí thanh công cụ ảnh khi cuộn trang hoặc resize
  useEffect(() => {
    const handleScrollOrResize = () => {
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
  }, [selectedImgEl]);

  // Bấm ra ngoài hoặc bấm Esc để đóng thanh chỉnh ảnh
  useEffect(() => {
    const handleDocClick = (e) => {
      if (
        selectedImgEl &&
        !e.target.closest(".editor-image-control-toolbar") &&
        e.target !== selectedImgEl
      ) {
        selectedImgEl.classList.remove("img-selected");
        selectedImgEl.removeAttribute("data-selected");
        setSelectedImgEl(null);
        setImgToolbarPos(null);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && selectedImgEl) {
        selectedImgEl.classList.remove("img-selected");
        selectedImgEl.removeAttribute("data-selected");
        setSelectedImgEl(null);
        setImgToolbarPos(null);
      }
    };

    document.addEventListener("mousedown", handleDocClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleDocClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImgEl]);

  // Lắng nghe click vào ảnh trong bài viết để bật thanh điều khiển kích thước ảnh
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleImgClick = (e) => {
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
      }
    };

    editor.addEventListener("click", handleImgClick);
    return () => {
      editor.removeEventListener("click", handleImgClick);
    };
  }, [selectedImgEl]);

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
    handleInput();
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
    handleInput();
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
    handleInput();
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
    handleInput();
  };

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      lastHtmlRef.current = html;
      setCodeValue(html);
      onChange(html);
    }
  };

  const exec = (command, val = null) => {
    if (isCodeView) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    try {
      document.execCommand("styleWithCSS", false, true);
    } catch (e) {}
    document.execCommand(command, false, val);
    handleInput();
  };

  const handleInsertCallout = () => {
    const calloutHtml = `
      <div class="editor-callout-box" style="background: #f0fdf4; border: 1.5px solid #86efac; border-left: 5px solid #004d32; border-radius: 8px; padding: 12px 18px; margin: 14px 0;">
        <strong style="color: #004d32; display: block; margin-bottom: 4px; font-size: 14px;">💡 Điểm nhấn / Lưu ý kỹ thuật:</strong>
        <p style="margin: 0; color: #1e293b; font-size: 14px;">Kích thước cửa cuốn = Kích thước ô cửa + 200mm (phần nan cửa cuốn chìm xuống)...</p>
      </div><p><br></p>
    `;
    exec("insertHTML", calloutHtml);
  };

  const handleInsertOtherPricesTable = () => {
    let list = allQuotes;
    if (!list || list.length === 0) {
      try {
        const local = localStorage.getItem("boss_admin_price_quotes");
        if (local) list = JSON.parse(local);
      } catch (e) {}
    }
    if (!list || list.length === 0) {
      list = DEFAULT_PRICE_QUOTES;
    }

    const rows = [];
    for (let i = 0; i < list.length; i += 2) {
      rows.push([list[i], list[i + 1] || null]);
    }

    const rowsHtml = rows.map((pair, rIdx) => {
      const bg = rIdx % 2 === 0 ? "#eef2f6" : "#ffffff";
      const col1 = pair[0];
      const col2 = pair[1];
      const title1 = col1.productTitle || col1.title || col1.name || "Bảng giá";
      const code1 = col1.productCode || col1.code || col1.id;
      const td1 = `<td style="width: 50%; border: 1px solid #cbd5e1; padding: 12px 16px;"><a href="/bang-gia/${code1}" style="color: #0284c7; font-weight: 500; text-decoration: none;">${title1}</a></td>`;

      let td2 = `<td style="width: 50%; border: 1px solid #cbd5e1; padding: 12px 16px;">&nbsp;</td>`;
      if (col2) {
        const title2 = col2.productTitle || col2.title || col2.name || "Bảng giá";
        const code2 = col2.productCode || col2.code || col2.id;
        td2 = `<td style="width: 50%; border: 1px solid #cbd5e1; padding: 12px 16px;"><a href="/bang-gia/${code2}" style="color: #0284c7; font-weight: 500; text-decoration: none;">${title2}</a></td>`;
      }

      return `<tr style="background-color: ${bg};">${td1}${td2}</tr>`;
    }).join("");

    const tableHtml = `
      <div class="other-door-pricing-wrapper" style="margin: 28px 0 20px 0; width: 100%;">
        <h3 style="font-size: 16px; font-weight: 700; color: #1e293b; margin: 0 0 12px 0;">Xem thêm bảng giá các dòng cửa:</h3>
        <table class="other-door-pricing-table" style="width: 100%; border-collapse: collapse; border: 1px solid #cbd5e1; background-color: #ffffff;">
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div><p><br></p>
    `;
    exec("insertHTML", tableHtml);
  };

  const handleInsertImage = () => {
    if (!imgUrl.trim()) {
      alert("Vui lòng nhập link ảnh hoặc chọn ảnh từ máy!");
      return;
    }
    const caption = imgCaption.trim() || "Hình ảnh minh họa sản phẩm";
    const sizeConfig = {
      small: { width: "35%", maxHeight: "280px" },
      medium: { width: "65%", maxHeight: "440px" },
      large: { width: "85%", maxHeight: "580px" },
      full: { width: "100%", maxHeight: "750px" }
    }[imgSize] || { width: "65%", maxHeight: "440px" };

    const figureHtml = `
      <figure style="text-align: center; margin: 18px 0;">
        <img src="${imgUrl.trim()}" alt="${caption}" style="max-width: ${sizeConfig.width}; width: 100%; max-height: ${sizeConfig.maxHeight}; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; object-fit: contain; cursor: zoom-in;" title="Bấm để phóng to ảnh xem chi tiết" />
        <figcaption style="margin-top: 6px; font-size: 13px; color: #64748b; font-style: italic;">${caption}</figcaption>
      </figure><p><br></p>
    `;
    exec("insertHTML", figureHtml);
    setImgUrl("");
    setImgCaption("");
    setImgSize("medium");
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

  const handleToggleCodeView = () => {
    if (isCodeView) {
      if (editorRef.current) {
        editorRef.current.innerHTML = codeValue;
      }
      lastHtmlRef.current = codeValue;
      onChange(codeValue);
      setIsCodeView(false);
    } else {
      if (editorRef.current) {
        setCodeValue(editorRef.current.innerHTML);
      }
      setIsCodeView(true);
    }
  };

  return (
    <div className="rich-article-editor-card">
      {/* KHỐI STICKY HEADER GỒM TIÊU ĐỀ BADGE, NÚT XEM NHANH BẢNG GIÁ & THANH CÔNG CỤ TOOLBAR (ĐI THEO KHI LƯỚT XUỐNG) */}
      <div className="rich-editor-sticky-header">
        {/* HEADER CỦA BLOCK */}
        <div className="article-block-header">
          <div className="article-block-header-left">
            <span className="article-block-badge">
              <FileText size={14} /> {badgeText}
            </span>
            <span className="article-block-hint">{hintText}</span>
          </div>

          {tableRows && tableRows.length > 0 && (
            <div className="article-block-header-right">
              <button
                type="button"
                className={`btn-quick-view-table ${showQuickTable ? "active" : ""}`}
                onClick={() => setShowQuickTable(!showQuickTable)}
                title="Bấm để xem nhanh bảng giá đối chiếu số liệu khi viết bài"
              >
                <Table size={13} />
                <span>{showQuickTable ? "Ẩn Bảng Giá" : "Xem Nhanh Bảng Giá"}</span>
              </button>
              {onScrollToTable && (
                <button
                  type="button"
                  className="btn-scroll-to-table"
                  onClick={onScrollToTable}
                  title="Cuộn lên bảng giá phía trên"
                >
                  <ArrowUp size={13} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* BẢNG GIÁ THU NHỎ XEM NHANH ĐI THEO MÀN HÌNH */}
        {showQuickTable && tableColumns && (
          <div className="quick-table-floating-drawer">
            <div className="quick-table-drawer-header">
              <div className="drawer-title" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Sparkles size={14} className="gold-icon" />
                <strong>Bảng Giá Đối Chiếu Số Liệu (Ghim đi theo màn hình để viết bài):</strong>
              </div>
              <button
                type="button"
                className="btn-close-quick-table"
                onClick={() => setShowQuickTable(false)}
                title="Đóng bảng xem nhanh"
              >
                ✕
              </button>
            </div>
            <div className="quick-table-drawer-scroll">
              <table className="quick-table-compact">
                <thead>
                  <tr>
                    {tableColumns.map((col) => (
                      <th key={col.id}>{col.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, rIdx) => (
                    <tr key={row.rowId || rIdx}>
                      {tableColumns.map((col) => (
                        <td key={col.id}>
                          {col.type === "image" ? (
                            row[col.key || col.id] ? (
                              <img src={row[col.key || col.id]} alt="" style={{ height: "24px", maxWidth: "45px", objectFit: "contain" }} />
                            ) : "-"
                          ) : (
                            row[col.key || col.id] || "-"
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* THANH CÔNG CỤ TOOLBAR */}
        <div className="rich-editor-toolbar">
        {/* Nhóm Tiêu đề Headings */}
        <div className="toolbar-group">
          <select
            className="toolbar-select"
            defaultValue="p"
            onChange={(e) => {
              const val = e.target.value;
              if (val === "h2") exec("formatBlock", "<h2>");
              else if (val === "h3") exec("formatBlock", "<h3>");
              else if (val === "h4") exec("formatBlock", "<h4>");
              else exec("formatBlock", "<p>");
              e.target.value = "p";
            }}
            title="Chọn định dạng đoạn văn hoặc tiêu đề"
          >
            <option value="p">Đoạn văn (Thường)</option>
            <option value="h2">Tiêu đề chính (H2)</option>
            <option value="h3">Tiêu đề mục (H3)</option>
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

        {/* Nhóm Màu chữ nhanh & Highlight */}
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
            title="Tô màu nền Highlight vàng nhạt"
          >
            <Highlighter size={14} />
          </button>
        </div>

        <div className="toolbar-sep" />

        {/* Nhóm Danh sách & Căn lề */}
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
        </div>

        <div className="toolbar-sep" />

        {/* Nhóm Tiện ích: Callout Box, Chèn ảnh */}
        <div className="toolbar-group">
          <button
            type="button"
            className="tb-btn-special"
            onMouseDown={(e) => { e.preventDefault(); handleInsertCallout(); }}
            title="Chèn khung điểm nhấn / ghi chú kỹ thuật viền xanh nổi bật"
          >
            <Sparkles size={13} /> <span>Khung điểm nhấn</span>
          </button>
          <button
            type="button"
            className="tb-btn-special"
            onClick={() => setShowImgModal(!showImgModal)}
            title="Chèn hình ảnh minh họa vào bài viết"
          >
            <ImageIcon size={13} /> <span>Chèn ảnh</span>
          </button>
          <button
            type="button"
            className="tb-btn-special"
            onMouseDown={(e) => { e.preventDefault(); handleInsertOtherPricesTable(); }}
            title="Chèn bảng liên kết 'Xem thêm bảng giá các loại cửa cuốn' (8 dòng x 2 cột)"
          >
            <Table size={13} /> <span>Bảng giá khác</span>
          </button>
        </div>

        {/* Nhóm Xem Mã & Xóa định dạng */}
        <div className="toolbar-group ml-auto">
          <button
            type="button"
            className="tb-btn"
            onMouseDown={(e) => { e.preventDefault(); exec("removeFormat"); }}
            title="Xóa định dạng chữ"
          >
            <RemoveFormatting size={14} />
          </button>
          <button
            type="button"
            className={`tb-btn ${isCodeView ? "active" : ""}`}
            onClick={handleToggleCodeView}
            title={isCodeView ? "Quay về trình soạn thảo trực quan" : "Chỉnh sửa mã HTML"}
          >
            <Code size={14} /> <span>{isCodeView ? "Trực quan" : "Mã HTML"}</span>
          </button>
        </div>
      </div>
      </div>

      {/* POPUP CHÈN ẢNH VÀO BÀI VIẾT NẾU MỞ */}
      {showImgModal && (
        <div className="rich-img-modal-popover">
          <div className="popover-title-row">
            <span>📷 Chèn hình ảnh vào bài viết</span>
            <button type="button" onClick={() => setShowImgModal(false)}>✕</button>
          </div>
          <div className="popover-body">
            <div className="popover-field">
              <label>Đường dẫn link ảnh (URL hoặc chọn từ máy):</label>
              <div style={{ display: "flex", gap: "6px" }}>
                <input
                  type="text"
                  placeholder="https://... hoặc /project_1.png"
                  value={imgUrl}
                  onChange={(e) => setImgUrl(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="btn-choose-file"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={13} /> Tải từ máy
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleUploadImgFile}
                />
              </div>
            </div>
            <div className="popover-field">
              <label>Chú thích hiển thị dưới chân ảnh:</label>
              <input
                type="text"
                placeholder="Ví dụ: Hình ảnh kỹ thuật viên đo đạc kích thước cửa..."
                value={imgCaption}
                onChange={(e) => setImgCaption(e.target.value)}
              />
            </div>
            <div className="popover-field">
              <label>Kích thước ảnh trong bài (Phóng to / Thu nhỏ):</label>
              <div className="img-size-selector-row">
                {[
                  { key: "small", label: "Nhỏ (35%)", desc: "Ảnh minh họa phụ / góc nhỏ" },
                  { key: "medium", label: "Vừa (65%)", desc: "Kích thước tiêu chuẩn đẹp mắt" },
                  { key: "large", label: "Lớn (85%)", desc: "Ảnh chi tiết rõ nét" },
                  { key: "full", label: "Toàn khung (100%)", desc: "Ảnh ngang toàn bài" }
                ].map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    className={`btn-img-size-chip ${imgSize === s.key ? "active" : ""}`}
                    onClick={() => setImgSize(s.key)}
                    title={s.desc}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            {imgUrl && (
              <div className="popover-preview">
                <img src={imgUrl} alt="preview" onError={(e) => { e.target.style.display = "none"; }} />
              </div>
            )}
            <div className="popover-actions">
              <button type="button" className="btn-cancel" onClick={() => setShowImgModal(false)}>
                Hủy
              </button>
              <button type="button" className="btn-confirm" onClick={handleInsertImage}>
                <Check size={14} /> Chèn vào bài viết ngay
              </button>
            </div>
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
          onClick={(e) => e.stopPropagation()}
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
            <button
              type="button"
              className="img-btn-adjust"
              onClick={() => handleStepImageSize(-10)}
              title="Thu nhỏ 10%"
            >
              <Minus size={13} />
            </button>
            <span className="img-current-percent">
              {selectedImgEl.style.width || "100%"}
            </span>
            <button
              type="button"
              className="img-btn-adjust"
              onClick={() => handleStepImageSize(10)}
              title="Phóng to 10%"
            >
              <Plus size={13} />
            </button>
          </div>
          <div className="img-align-group">
            <button
              type="button"
              className="img-btn-align"
              onClick={() => handleSetImageAlign("left")}
              title="Căn trái"
            >
              <AlignLeft size={13} />
            </button>
            <button
              type="button"
              className="img-btn-align"
              onClick={() => handleSetImageAlign("center")}
              title="Căn giữa"
            >
              <AlignCenter size={13} />
            </button>
            <button
              type="button"
              className="img-btn-align"
              onClick={() => handleSetImageAlign("right")}
              title="Căn phải"
            >
              <AlignRight size={13} />
            </button>
          </div>
          <button
            type="button"
            className="img-btn-delete"
            onClick={handleDeleteSelectedImg}
            title="Xóa ảnh"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}

      {/* VÙNG SOẠN THẢO CHÍNH (TỰ ĐỘNG CO GIÃN THEO ĐỘ DÀI CHỮ) */}
      {isCodeView ? (
        <textarea
          className="rich-editor-code-view"
          style={{ minHeight: `${minHeight}px` }}
          value={codeValue}
          onChange={(e) => {
            setCodeValue(e.target.value);
            lastHtmlRef.current = e.target.value;
            onChange(e.target.value);
          }}
          placeholder="Nhập mã HTML bài viết tại đây..."
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          className="rich-article-content-editable"
          style={{ minHeight: `${minHeight}px` }}
          onInput={handleInput}
          onBlur={handleInput}
          placeholder={placeholder}
          data-placeholder={placeholder}
        />
      )}
    </div>
  );
};

const DEFAULT_NEW_QUOTE_TEMPLATE = {
  productCode: "BD-2026",
  productTitle: "Bảng giá cửa cuốn BossDoor 2026",
  category: "cuacuon",
  title: "Bảng giá cập nhật cửa cuốn BossDoor 2026 tại Đà Nẵng",
  effectiveDate: "Áp dụng từ năm 2026 cho đến khi có thông báo mới",
  image: "/project_1.png",
  articleAbove:
    "BossDoor Đà Nẵng trân trọng gửi đến Quý khách hàng bảng báo giá chi tiết, mới nhất năm 2026. Các dòng sản phẩm được sản xuất trên dây chuyền hiện đại, tiêu chuẩn chất lượng cao, bền bỉ và an toàn tuyệt đối cho mọi công trình.",
  articleBelow:
    "Lưu ý: Báo giá trên áp dụng cho công trình tại khu vực Đà Nẵng và các tỉnh lân cận. Khách hàng lắp đặt số lượng lớn hoặc dự án công trình sẽ nhận được mức chiết khấu ưu đãi đặc biệt. Để được tư vấn chi tiết và khảo sát đo đạc miễn phí tận nơi, Quý khách vui lòng liên hệ Hotline/Zalo kỹ thuật: 0904.678.323.",
  addons: [
    {
      category: "Ray dẫn hướng",
      name: "Ray nhôm hộp giảm chấn tiêu chuẩn",
      unit: "md",
      price: "+ 120.000 đồng/md"
    },
    {
      category: "Bộ lưu điện (UPS)",
      name: "Bộ lưu điện BossDoor chính hãng 24-48h",
      unit: "bộ",
      price: "+ 2.850.000 đồng/bộ"
    },
    {
      category: "Còi báo động",
      name: "Còi báo động chống cạy cửa tích hợp",
      unit: "bộ",
      price: "+ 450.000 đồng/bộ"
    }
  ],
  policies: {
    included: "Đơn giá đã bao gồm thân cửa, ray dẫn hướng, trục cuốn, công lắp đặt hoàn thiện nội thành Đà Nẵng.",
    excluded: "Chưa bao gồm thuế VAT 10%, hộp che thạch cao/alumi và chi phí vận chuyển ngoại tỉnh (nếu có).",
    conditionNote: "Áp dụng cho kích thước cửa tiêu chuẩn chiều rộng ≤ 6.5m và diện tích từ 8m² trở lên.",
    warrantyNote: "Bảo hành thân cửa 10 năm bề mặt sơn, động cơ motor 24 tháng chính hãng, bảo trì định kỳ miễn phí.",
    commitmentNote: "BossDoor Đà Nẵng cam kết 100% linh kiện chính hãng, đền gấp 10 lần nếu phát hiện hàng giả, hàng nhái."
  }
};

export default function AdminPriceQuote({ showToast }) {
  // VIEW MODE: "list" (Danh sách bảng giá chuẩn Admin) | "create" (Thêm mới) | "edit" (Chỉnh sửa)
  const [viewMode, setViewMode] = useState("list");
  const [quotesList, setQuotesList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // KEY CỦA BẢNG GIÁ ĐANG CHỈNH SỬA ĐỂ BẢO ĐẢM GHI ĐÈ ĐÚNG ITEM
  const [editingOriginalKey, setEditingOriginalKey] = useState(null);

  // STATE FOR EDITOR (THÊM HOẶC SỬA BẢNG GIÁ)
  const [editingQuote, setEditingQuote] = useState(() => JSON.parse(JSON.stringify(DEFAULT_NEW_QUOTE_TEMPLATE)));
  const [gridColumns, setGridColumns] = useState(DEFAULT_GRID_COLUMNS);
  const [gridRows, setGridRows] = useState(createDefault7Rows);
  const [inputColsCount, setInputColsCount] = useState(8);
  const [inputRowsCount, setInputRowsCount] = useState(7);
  const [emptyCellsHighlight, setEmptyCellsHighlight] = useState(new Set());
  const [zoomModalImg, setZoomModalImg] = useState(null); // { url, title }
  const [zoomScale, setZoomScale] = useState(1);
  const [zoomRotation, setZoomRotation] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isDraggingZoom, setIsDraggingZoom] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Reset trạng thái zoom khi mở ảnh mới hoặc đóng
  useEffect(() => {
    setZoomScale(1);
    setZoomRotation(0);
    setZoomPosition({ x: 0, y: 0 });
    setIsDraggingZoom(false);
  }, [zoomModalImg?.url]);

  // Cung cấp hàm phóng to ảnh toàn cục cho bài viết
  useEffect(() => {
    window.__adminZoomImg = (url, title) => {
      setZoomModalImg({ url, title });
    };
    return () => {
      delete window.__adminZoomImg;
    };
  }, []);

  const handleZoomIn = () => setZoomScale((prev) => Math.min(Number((prev + 0.25).toFixed(2)), 3.5));
  const handleZoomOut = () => setZoomScale((prev) => Math.max(Number((prev - 0.25).toFixed(2)), 0.5));
  const handleResetZoom = () => {
    setZoomScale(1);
    setZoomRotation(0);
    setZoomPosition({ x: 0, y: 0 });
  };
  const handleRotateZoom = () => setZoomRotation((prev) => (prev + 90) % 360);

  const handleZoomWheel = (e) => {
    if (e.deltaY < 0) {
      setZoomScale((prev) => Math.min(Number((prev + 0.15).toFixed(2)), 3.5));
    } else {
      setZoomScale((prev) => Math.max(Number((prev - 0.15).toFixed(2)), 0.5));
    }
  };

  const handleZoomMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDraggingZoom(true);
    dragStartRef.current = {
      x: e.clientX - zoomPosition.x,
      y: e.clientY - zoomPosition.y
    };
  };

  const handleZoomMouseMove = (e) => {
    if (!isDraggingZoom) return;
    setZoomPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handleZoomMouseUp = () => {
    setIsDraggingZoom(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setZoomModalImg(null);
    };
    if (zoomModalImg) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [zoomModalImg]);

  // RESIZE COLUMN STATE
  const [resizingColIndex, setResizingColIndex] = useState(null);
  const resizeStartXRef = useRef(0);
  const resizeStartWidthRef = useRef(0);

  // IMAGE UPLOADS
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const quoteImageInputRef = useRef(null);

  // Load quotes khi khởi chạy
  useEffect(() => {
    loadQuotes();
  }, []);

  const triggerToast = (msg, isSuccess = true) => {
    if (typeof showToast === "function") {
      showToast(msg);
    }
    setSaveStatus({ success: isSuccess, message: msg });
  };

  const loadQuotes = async () => {
    setLoading(true);
    let loaded = null;

    if (import.meta.env.VITE_API_URL) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/price-quotes`);
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          loaded = json.data;
        }
      } catch (err) {
        console.log("Could not load price quotes from API, checking localStorage:", err.message);
      }
    }

    if (!loaded) {
      const local = localStorage.getItem("boss_admin_price_quotes");
      if (local) {
        try {
          loaded = JSON.parse(local);
        } catch (e) {
          console.error(e);
        }
      }
    }

    if (!loaded || loaded.length === 0) {
      loaded = DEFAULT_PRICE_QUOTES;
    }

    // Chuẩn hóa và gán ID duy nhất tuyệt đối cho từng bảng giá (tránh trùng lặp key)
    const seenIds = new Set();
    const normalized = [];

    loaded.forEach((q, idx) => {
      const stableId = q.id || q._id || `quote_${q.productCode || "bd"}_${idx}`;
      if (!seenIds.has(stableId)) {
        seenIds.add(stableId);
        normalized.push({
          ...q,
          id: stableId,
          productCode: q.productCode || `BD-${String(idx + 1).padStart(2, "0")}`,
          productTitle: q.productTitle || q.title || "Bảng giá cửa cuốn BossDoor 2026",
          title: q.title || `Bảng giá cập nhật ${q.productTitle || "cửa cuốn BossDoor"} 2026 tại Đà Nẵng`,
          articleAbove: q.articleAbove !== undefined ? q.articleAbove : DEFAULT_NEW_QUOTE_TEMPLATE.articleAbove,
          articleBelow: q.articleBelow !== undefined ? q.articleBelow : DEFAULT_NEW_QUOTE_TEMPLATE.articleBelow,
          image: q.image || "/project_1.png"
        });
      }
    });

    setQuotesList(normalized);
    setLoading(false);
  };

  // ================= 1. HÀM ĐIỀU HƯỚNG VÀ CHUYỂN CHẾ ĐỘ =================
  const handleStartCreateNew = () => {
    const freshId = `quote_${Date.now()}`;
    const freshCode = `BD-${Date.now().toString().slice(-4)}`;
    const newQuote = {
      ...JSON.parse(JSON.stringify(DEFAULT_NEW_QUOTE_TEMPLATE)),
      id: freshId,
      productCode: freshCode,
      productTitle: "Bảng giá cửa cuốn BossDoor 2026",
      title: "Bảng giá cập nhật cửa cuốn BossDoor 2026 tại Đà Nẵng",
      image: "/project_1.png",
      articleAbove: DEFAULT_NEW_QUOTE_TEMPLATE.articleAbove,
      articleBelow: DEFAULT_NEW_QUOTE_TEMPLATE.articleBelow
    };
    setEditingOriginalKey(freshId);
    setEditingQuote(newQuote);
    setGridColumns(DEFAULT_GRID_COLUMNS);
    setGridRows(createDefault7Rows());
    setInputColsCount(DEFAULT_GRID_COLUMNS.length);
    setInputRowsCount(7);
    setEmptyCellsHighlight(new Set());
    setViewMode("create");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStartEditQuote = (quote) => {
    // 1. Lưu key ID gốc duy nhất của quote cần sửa
    const quoteKey = quote.id || quote._id;
    setEditingOriginalKey(quoteKey);

    // 2. Tìm bản data chuẩn nhất: tìm trong quotesList hiện tại theo ID trước, nếu không có mới tìm trong localStorage
    let target = quote;
    const foundInList = quotesList.find(
      (q) => (quote.id && q.id === quote.id) || (quote._id && q._id === quote._id) || (quoteKey && q.id === quoteKey)
    );
    if (foundInList) {
      target = foundInList;
    } else {
      try {
        const local = localStorage.getItem("boss_admin_price_quotes");
        if (local) {
          const parsed = JSON.parse(local);
          const match = parsed.find(
            (q) =>
              (quote.id && q.id === quote.id) ||
              (quote._id && q._id === quote._id) ||
              (quoteKey && q.id === quoteKey)
          );
          if (match) target = match;
        }
      } catch (e) {}
    }

    const cloned = JSON.parse(JSON.stringify(target));
    // Đảm bảo bảo toàn ID duy nhất của bảng giá
    cloned.id = cloned.id || cloned._id || quoteKey;

    // Giữ nguyên bài viết người dùng đã gõ (kể cả chữ ngắn như 'ok')
    if (cloned.articleAbove === undefined) {
      cloned.articleAbove = DEFAULT_NEW_QUOTE_TEMPLATE.articleAbove;
    }
    if (cloned.articleBelow === undefined) {
      cloned.articleBelow = DEFAULT_NEW_QUOTE_TEMPLATE.articleBelow;
    }
    if (!cloned.image) {
      cloned.image = "/project_1.png";
    }

    setEditingQuote(cloned);
    const cols = getActiveColumns(cloned);
    const rows = getActiveRows(cloned, cols);
    setGridColumns(cols);
    setGridRows(rows);
    setInputColsCount(cols.length);
    setInputRowsCount(rows.length);
    setEmptyCellsHighlight(new Set());
    setViewMode("edit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ================= 2. QUẢN LÝ DANH SÁCH BẢNG GIÁ (LIST VIEW) =================
  const handleDeleteQuote = async (quoteOrKey) => {
    if (quotesList.length <= 1) {
      alert("Hệ thống cần giữ lại tối thiểu 1 bảng giá!");
      return;
    }
    const target = quotesList.find(
      (q) =>
        (q.id && q.id === quoteOrKey) ||
        (q._id && q._id === quoteOrKey) ||
        (q.productCode && q.productCode === quoteOrKey)
    );
    const targetName = target?.productTitle || target?.title || target?.productCode || quoteOrKey;

    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn XÓA VĨNH VIỄN bảng giá "${targetName}" khỏi hệ thống?`
    );
    if (!confirmDelete) return;

    setLoading(true);
    const remaining = quotesList.filter((q) => {
      if (target?.id && q.id) return q.id !== target.id;
      if (target?._id && q._id) return q._id !== target._id;
      if (target?.productCode && q.productCode) return q.productCode !== target.productCode;
      return true;
    });

    if (import.meta.env.VITE_API_URL && target?._id) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/price-quotes/${target._id}`, {
          method: "DELETE"
        });
      } catch (e) {
        console.warn("Delete API error:", e);
      }
    }

    setQuotesList(remaining);
    localStorage.setItem("boss_admin_price_quotes", JSON.stringify(remaining));
    window.dispatchEvent(new Event("priceQuotesUpdated"));
    window.dispatchEvent(new Event("storage"));
    triggerToast(`✨ Đã xóa bảng giá "${targetName}" thành công!`);
    setLoading(false);
    if (viewMode !== "list") {
      setViewMode("list");
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn khôi phục toàn bộ bảng giá mẫu kỹ thuật từ bản chuẩn gốc của hệ thống?")) {
      return;
    }

    setLoading(true);
    if (import.meta.env.VITE_API_URL) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/price-quotes/seed-defaults`, {
          method: "POST"
        });
      } catch (err) {
        console.error("Seed API call error:", err);
      }
    }

    localStorage.setItem("boss_admin_price_quotes", JSON.stringify(DEFAULT_PRICE_QUOTES));
    setQuotesList(DEFAULT_PRICE_QUOTES);
    window.dispatchEvent(new Event("priceQuotesUpdated"));
    triggerToast("🎉 Đã khôi phục toàn bộ bảng giá mẫu gốc thành công!");
    setLoading(false);
  };

  // ================= 3. THAO TÁC CẤU HÌNH THÔNG TIN BẢNG GIÁ =================
  const handleQuoteFieldChange = (field, value) => {
    setEditingQuote((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuoteNameChange = (val) => {
    const cleanStr = val
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .trim();
    const words = cleanStr.split(/\s+/).filter(Boolean);
    let autoCode = "";
    if (words.length > 0) {
      autoCode = words.map((w) => w[0]).join("").toUpperCase();
      if (autoCode.length < 3 && words[0]) {
        autoCode = words[0].substring(0, 4).toUpperCase();
      }
    }

    setEditingQuote((prev) => {
      const nextCode =
        viewMode === "create" && autoCode && !prev.productCode.startsWith("BD-")
          ? `BD-${autoCode}`
          : prev.productCode;
      return {
        ...prev,
        productTitle: val,
        productCode: nextCode,
        title: `Bảng giá cập nhật ${val.trim()} 2026 tại Đà Nẵng`
      };
    });
  };

  // Tải ảnh đại diện bảng giá từ máy local
  const handleQuoteImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      triggerToast("⚠️ Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WEBP)!", false);
      return;
    }

    setIsUploadingImage(true);
    try {
      const backendBase = import.meta.env.VITE_API_URL || "";
      const uploadEndpoint = backendBase ? `${backendBase}/api/upload` : "/api/upload";
      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await fetch(uploadEndpoint, {
          method: "POST",
          body: formData
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.url) {
            const finalUrl =
              data.url.startsWith("http") || data.url.startsWith("data:")
                ? data.url
                : `${backendBase}${data.url}`;
            handleQuoteFieldChange("image", finalUrl);
            triggerToast("✨ Đã tải ảnh đại diện bảng giá thành công!", true);
            return;
          }
        }
      } catch (uploadErr) {
        // Fallback to FileReader Base64
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        handleQuoteFieldChange("image", event.target.result);
        triggerToast("✨ Đã tải ảnh từ máy tính thành công!", true);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Quote image upload error:", err);
      triggerToast("❌ Lỗi khi chọn ảnh!", false);
    } finally {
      setIsUploadingImage(false);
      if (e.target) e.target.value = "";
    }
  };

  // ================= 4. THAO TÁC TRÊN BẢNG SPREADSHEET (KHUNG BẢNG GIÁ) =================
  // Tạo nhanh khung chuẩn 8 Cột (Có Cột Ảnh) x 7 Hàng
  const handleResetTo7x7 = () => {
    setGridColumns(DEFAULT_GRID_COLUMNS);
    setGridRows(createDefault7Rows());
    setInputColsCount(DEFAULT_GRID_COLUMNS.length);
    setInputRowsCount(7);
    triggerToast("⚡ Đã tạo khung chuẩn 8 Cột (Có Cột Hình Ảnh) x 7 Hàng sẵn sàng điền thông tin!");
  };

  // Áp dụng số cột x số hàng tùy biến
  const handleApplyCustomGridSize = () => {
    const rowsNum = Math.max(1, Math.min(50, parseInt(inputRowsCount, 10) || 7));
    const colsNum = Math.max(2, Math.min(15, parseInt(inputColsCount, 10) || 8));

    // 1. Cột
    let newCols = [...gridColumns];
    if (colsNum > newCols.length) {
      for (let c = newCols.length + 1; c <= colsNum; c++) {
        newCols.push({
          id: `col_${c}`,
          key: `col_${c}`,
          label: `Cột ${c}`,
          width: "130px"
        });
      }
    } else if (colsNum < newCols.length) {
      newCols = newCols.slice(0, colsNum);
    }

    // 2. Hàng
    let newRows = [...gridRows];
    if (rowsNum > newRows.length) {
      for (let r = newRows.length + 1; r <= rowsNum; r++) {
        const rowObj = {};
        newCols.forEach((col, cIdx) => {
          if (cIdx === 0) rowObj[col.id] = String(r);
          else if (cIdx === 1) rowObj[col.id] = `SP-${String(r).padStart(2, "0")}`;
          else if (isImageCol(col)) rowObj[col.id] = "";
          else if (cIdx === 2 || col.key === "name") rowObj[col.id] = `Quy cách dòng sản phẩm số ${r}`;
          else if (col.key === "unit") rowObj[col.id] = "m2";
          else if (col.key === "colors") rowObj[col.id] = "Theo tiêu chuẩn";
          else if (col.key?.includes("price")) rowObj[col.id] = "Liên hệ";
          else rowObj[col.id] = "";
        });
        newRows.push(rowObj);
      }
    } else if (rowsNum < newRows.length) {
      newRows = newRows.slice(0, rowsNum);
    }

    setGridColumns(newCols);
    setGridRows(newRows);
    triggerToast(`Đã thiết lập khung bảng: ${newCols.length} Cột x ${newRows.length} Hàng!`);
  };

  // Đổi tên cột
  const handleUpdateColLabel = (colIdx, newLabel) => {
    setGridColumns((prev) => {
      const next = [...prev];
      next[colIdx] = { ...next[colIdx], label: newLabel };
      return next;
    });
  };

  // Thêm 1 cột mới ở cuối bảng
  const handleAddCol = () => {
    const nextColNum = gridColumns.length + 1;
    const newColId = `col_${Date.now()}_${nextColNum}`;
    const newCol = {
      id: newColId,
      key: newColId,
      label: `Cột mới ${nextColNum}`,
      width: "140px"
    };
    setGridColumns((prev) => [...prev, newCol]);
    setGridRows((prev) =>
      prev.map((r) => ({
        ...r,
        [newColId]: ""
      }))
    );
    setInputColsCount((prev) => prev + 1);
  };

  // Chèn 1 cột mới sau cột afterIndex
  const handleInsertCol = (afterIndex) => {
    const nextColNum = gridColumns.length + 1;
    const newColId = `col_${Date.now()}_${nextColNum}`;
    const newCol = {
      id: newColId,
      key: newColId,
      label: `Cột mới ${nextColNum}`,
      width: "140px"
    };
    setGridColumns((prev) => {
      const next = [...prev];
      next.splice(afterIndex + 1, 0, newCol);
      return next;
    });
    setGridRows((prev) =>
      prev.map((r) => ({
        ...r,
        [newColId]: ""
      }))
    );
    setInputColsCount((prev) => prev + 1);
    triggerToast(`✨ Đã chèn 1 cột mới cạnh cột "${gridColumns[afterIndex]?.label || afterIndex + 1}"!`);
  };

  // Xóa 1 cột
  const handleDeleteCol = (colIdx) => {
    if (gridColumns.length <= 2) {
      alert("Bảng giá cần có tối thiểu 2 cột thông tin!");
      return;
    }
    const removedCol = gridColumns[colIdx];
    setGridColumns((prev) => prev.filter((_, idx) => idx !== colIdx));
    setGridRows((prev) =>
      prev.map((r) => {
        const copy = { ...r };
        delete copy[removedCol.id];
        return copy;
      })
    );
    setInputColsCount((prev) => Math.max(2, prev - 1));
  };

  // Thêm 1 cột Hình ảnh vào bảng
  const handleAddImageCol = () => {
    const newColId = `col_img_${Date.now()}`;
    const newCol = {
      id: newColId,
      key: "image",
      label: "Hình ảnh",
      width: "165px"
    };
    const codeIdx = gridColumns.findIndex(
      (c) => c.key === "code" || c.id === "col_2" || c.label.toLowerCase().includes("mã")
    );
    const insertIdx = codeIdx >= 0 ? codeIdx + 1 : 2;

    setGridColumns((prev) => {
      const next = [...prev];
      next.splice(insertIdx, 0, newCol);
      return next;
    });
    setGridRows((prev) =>
      prev.map((r) => ({
        ...r,
        [newColId]: ""
      }))
    );
    setInputColsCount((prev) => prev + 1);
    triggerToast('✨ Đã thêm cột "Hình ảnh" vào bảng giá!');
  };

  // Thêm 1 hàng mới
  const handleAddRow = () => {
    setGridRows((prev) => {
      const nextStt = prev.length + 1;
      const newRow = {};
      gridColumns.forEach((col, idx) => {
        if (col.key === "stt" || col.id === "col_1" || idx === 0) newRow[col.id] = String(nextStt);
        else if (col.key === "code" || col.id === "col_2") newRow[col.id] = `SP-${String(nextStt).padStart(2, "0")}`;
        else if (isImageCol(col)) newRow[col.id] = "";
        else if (col.key === "name" || col.id === "col_3") newRow[col.id] = `Dòng sản phẩm mới số ${nextStt}`;
        else if (col.key === "unit" || col.id === "col_4") newRow[col.id] = "m2";
        else if (col.key === "colors" || col.id === "col_5") newRow[col.id] = "Ghi sáng, Vàng kem";
        else if (col.key === "priceOver8" || col.id === "col_6") newRow[col.id] = "1,500,000";
        else newRow[col.id] = "";
      });
      return [...prev, newRow];
    });
    setInputRowsCount((prev) => prev + 1);
  };

  // Chèn 1 hàng mới sau afterIndex
  const handleInsertRow = (afterIndex) => {
    setGridRows((prev) => {
      const newRow = {};
      const nextStt = afterIndex + 2;
      gridColumns.forEach((col, idx) => {
        if (col.key === "stt" || col.id === "col_1" || idx === 0) newRow[col.id] = String(nextStt);
        else if (col.key === "code" || col.id === "col_2") newRow[col.id] = `SP-${String(nextStt).padStart(2, "0")}`;
        else if (isImageCol(col)) newRow[col.id] = "";
        else if (col.key === "name" || col.id === "col_3") newRow[col.id] = `Dòng sản phẩm mới ${nextStt}`;
        else if (col.key === "unit" || col.id === "col_4") newRow[col.id] = "m2";
        else if (col.key === "colors" || col.id === "col_5") newRow[col.id] = "Ghi sáng, Vàng kem";
        else if (col.key === "priceOver8" || col.id === "col_6") newRow[col.id] = "";
        else newRow[col.id] = "";
      });
      const next = [...prev];
      next.splice(afterIndex + 1, 0, newRow);
      if (gridColumns[0]) {
        next.forEach((r, rIdx) => {
          r[gridColumns[0].id] = String(rIdx + 1);
        });
      }
      return next;
    });
    setInputRowsCount((prev) => prev + 1);
    triggerToast(`✨ Đã chèn 1 hàng mới ngay dưới hàng ${afterIndex + 1}!`);
  };

  // Xóa 1 hàng
  const handleDeleteRow = (rowIdx) => {
    setGridRows((prev) => {
      const filtered = prev.filter((_, idx) => idx !== rowIdx);
      if (gridColumns[0]) {
        filtered.forEach((r, idx) => {
          r[gridColumns[0].id] = String(idx + 1);
        });
      }
      return filtered;
    });
    setInputRowsCount((prev) => Math.max(1, prev - 1));
  };

  // Thay đổi giá trị ô
  const handleGridCellChange = (rowIdx, colId, value) => {
    setGridRows((prev) => {
      const next = [...prev];
      next[rowIdx] = { ...next[rowIdx], [colId]: value };
      return next;
    });
    setEmptyCellsHighlight((prev) => {
      if (!prev.has(`${rowIdx}_${colId}`)) return prev;
      const nextSet = new Set(prev);
      nextSet.delete(`${rowIdx}_${colId}`);
      return nextSet;
    });
  };

  // Tải ảnh cho từng ô trong Cột Hình Ảnh
  const handleCellImageUpload = async (rowIdx, colId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      triggerToast("⚠️ Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WEBP)!", false);
      return;
    }

    try {
      const backendBase = import.meta.env.VITE_API_URL || "";
      const uploadEndpoint = backendBase ? `${backendBase}/api/upload` : "/api/upload";
      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await fetch(uploadEndpoint, {
          method: "POST",
          body: formData
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.url) {
            const finalUrl =
              data.url.startsWith("http") || data.url.startsWith("data:")
                ? data.url
                : `${backendBase}${data.url}`;
            handleGridCellChange(rowIdx, colId, finalUrl);
            triggerToast("✨ Đã tải ảnh sản phẩm thành công!", true);
            return;
          }
        }
      } catch (uploadErr) {
        // Fallback to FileReader Base64
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        handleGridCellChange(rowIdx, colId, event.target.result);
        triggerToast("✨ Đã tải ảnh từ máy tính vào bảng!", true);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Cell image upload error:", err);
      triggerToast("❌ Lỗi khi chọn ảnh!", false);
    } finally {
      if (e.target) e.target.value = "";
    }
  };

  // Kéo thả co giãn độ rộng cột (Column Resizer)
  const handleResizeStart = (e, colIdx) => {
    e.preventDefault();
    e.stopPropagation();
    setResizingColIndex(colIdx);
    resizeStartXRef.current = e.clientX;
    const curWidthStr = gridColumns[colIdx]?.width || "130px";
    const curWidth = parseInt(curWidthStr, 10) || 130;
    resizeStartWidthRef.current = curWidth;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - resizeStartXRef.current;
      const newWidth = Math.max(50, Math.min(600, resizeStartWidthRef.current + deltaX));
      setGridColumns((prev) => {
        const next = [...prev];
        if (next[colIdx]) {
          next[colIdx] = { ...next[colIdx], width: `${newWidth}px` };
        }
        return next;
      });
    };

    const handleMouseUp = () => {
      setResizingColIndex(null);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // ================= 5. PHỤ KIỆN (ADD-ONS) & CHÍNH SÁCH =================
  const handleAddNewAddon = () => {
    setEditingQuote((prev) => ({
      ...prev,
      addons: [
        ...(prev.addons || []),
        {
          category: "Lựa chọn thêm mới",
          name: "Phụ kiện nâng cấp cửa",
          unit: "bộ",
          price: "+ 350.000 đồng/bộ"
        }
      ]
    }));
  };

  const handleAddonChange = (index, field, value) => {
    setEditingQuote((prev) => {
      const newAddons = [...(prev.addons || [])];
      newAddons[index] = { ...newAddons[index], [field]: value };
      return { ...prev, addons: newAddons };
    });
  };

  const handleDeleteAddon = (index) => {
    setEditingQuote((prev) => ({
      ...prev,
      addons: (prev.addons || []).filter((_, i) => i !== index)
    }));
  };

  const handlePolicyChange = (field, value) => {
    setEditingQuote((prev) => ({
      ...prev,
      policies: {
        ...(prev.policies || {}),
        [field]: value
      }
    }));
  };

  // ================= 6. LƯU BẢNG BÁO GIÁ (SAVE QUOTE) =================
  const handleSaveQuote = async () => {
    const rawTitle = editingQuote.productTitle || editingQuote.name || "";
    if (!rawTitle.trim()) {
      triggerToast("⚠️ Vui lòng nhập tên bảng giá trước khi lưu!", false);
      return;
    }

    // Kiểm tra ô trống
    const emptyCoords = new Set();
    gridRows.forEach((row, rIdx) => {
      gridColumns.forEach((col) => {
        if (isImageCol(col)) return; // Cột ảnh có thể để trống
        const val = row[col.id];
        if (val === undefined || String(val).trim() === "") {
          emptyCoords.add(`${rIdx}_${col.id}`);
        }
      });
    });

    if (emptyCoords.size > 0) {
      setEmptyCellsHighlight(emptyCoords);
      triggerToast(
        `⚠️ Bảng giá còn ${emptyCoords.size} ô chưa điền thông tin (được tô viền đỏ)! Vui lòng điền đủ tất cả các ô trước khi lưu.`,
        false
      );
      return;
    }
    setEmptyCellsHighlight(new Set());
    setLoading(true);

    // Chuẩn hóa formattedItems
    const sttCol = gridColumns.find((c) => c.key === "stt" || c.id === "col_1" || c.label?.toLowerCase() === "stt") || gridColumns[0];
    const codeCol = gridColumns.find((c) => c.key === "code" || c.id === "col_2" || c.label?.toLowerCase().includes("mã")) || gridColumns[1];
    const imgCol = gridColumns.find(isImageCol);
    const nameCol = gridColumns.find((c) => c.key === "name" || c.id === "col_3" || c.label?.toLowerCase().includes("tên") || c.label?.toLowerCase().includes("quy cách")) || gridColumns[2];
    const unitCol = gridColumns.find((c) => c.key === "unit" || c.id === "col_4" || c.label?.toLowerCase().includes("đvt") || c.label?.toLowerCase().includes("đơn vị")) || gridColumns[3];
    const colorCol = gridColumns.find((c) => c.key === "colors" || c.id === "col_5" || c.label?.toLowerCase().includes("màu")) || gridColumns[4];
    const priceCols = gridColumns.filter((c) => c.key?.toLowerCase().includes("price") || c.id === "col_6" || c.id === "col_7" || c.label?.toLowerCase().includes("giá") || c.label?.toLowerCase().includes("đơn giá"));

    const formattedItems = gridRows.map((row, rIdx) => {
      const sttVal = (sttCol && row[sttCol.id]) || rIdx + 1;
      const codeVal = (codeCol && row[codeCol.id]) || `${editingQuote.productCode || "SP"}-${rIdx + 1}`;
      const imgVal = (imgCol && row[imgCol.id]) || "";
      const nameVal = (nameCol && row[nameCol.id]) || `Dòng sản phẩm ${rIdx + 1}`;
      const unitVal = (unitCol && row[unitCol.id]) || "m2";
      const colorsVal = (colorCol && row[colorCol.id]) || "Theo tiêu chuẩn";
      const price1Val = (priceCols[0] && row[priceCols[0].id]) || "";
      const price2Val = (priceCols[1] && row[priceCols[1].id]) || "";
      const price3Val = (priceCols[2] && row[priceCols[2].id]) || "";

      return {
        ...row,
        stt: isNaN(Number(sttVal)) ? rIdx + 1 : Number(sttVal),
        code: String(codeVal).trim(),
        image: String(imgVal).trim(),
        imageUrl: String(imgVal).trim(),
        name: String(nameVal).trim(),
        description: String(nameVal).trim(),
        unit: String(unitVal).trim(),
        colors: String(colorsVal).trim(),
        priceOver8: String(price1Val).trim(),
        price6to8: String(price2Val).trim(),
        price4to6: String(price3Val).trim(),
        productLink: String(row.productLink || "").trim(),
        note: `Sản phẩm ${codeVal}`,
        rawGridCells: { ...row }
      };
    });

    const quoteId = editingQuote.id || editingQuote._id || editingOriginalKey || `quote_${Date.now()}`;
    const quoteToSave = {
      ...editingQuote,
      id: quoteId,
      productCode: (editingQuote.productCode || "").trim() || `BD-${Date.now().toString().slice(-4)}`,
      productTitle: rawTitle.trim(),
      category: editingQuote.category || "cuacuon",
      title: (editingQuote.title && editingQuote.title.trim()) || `Bảng giá cập nhật ${rawTitle.trim()} 2026 tại Đà Nẵng`,
      effectiveDate: editingQuote.effectiveDate || "Áp dụng từ năm 2026 cho đến khi có thông báo mới",
      articleAbove: editingQuote.articleAbove !== undefined ? editingQuote.articleAbove : DEFAULT_NEW_QUOTE_TEMPLATE.articleAbove,
      articleBelow: editingQuote.articleBelow !== undefined ? editingQuote.articleBelow : DEFAULT_NEW_QUOTE_TEMPLATE.articleBelow,
      image: editingQuote.image || (formattedItems.find((it) => it.image)?.image) || "/project_1.png",
      customColumns: gridColumns.map((c) => ({
        id: c.id,
        key: c.key || c.id,
        label: c.label,
        width: c.width || "130px"
      })),
      items: formattedItems,
      addons: editingQuote.addons || [],
      policies: editingQuote.policies && Object.keys(editingQuote.policies).length > 0
        ? editingQuote.policies
        : DEFAULT_NEW_QUOTE_TEMPLATE.policies
    };

    try {
      let success = false;
      let message = "Đã lưu bảng báo giá thành công!";

      if (import.meta.env.VITE_API_URL) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/price-quotes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(quoteToSave)
          });
          const json = await res.json();
          if (json.success) {
            success = true;
            message = json.message || message;
            if (json.data?._id) {
              quoteToSave._id = json.data._id;
            }
          }
        } catch (e) {
          console.warn("API save error, fallback to local:", e);
        }
      }

      // Cập nhật danh sách: tìm đúng vị trí của bảng giá đang sửa theo ID duy nhất (KHÔNG tìm theo productCode để tránh ghi đè nhầm bản ghi khác)
      let updatedList = [...quotesList];
      const targetId = editingOriginalKey || quoteToSave.id || quoteToSave._id;
      const existIdx = updatedList.findIndex(
        (q) =>
          (targetId && (q.id === targetId || q._id === targetId)) ||
          (quoteToSave.id && q.id === quoteToSave.id) ||
          (quoteToSave._id && q._id === quoteToSave._id)
      );

      if (existIdx >= 0) {
        updatedList[existIdx] = quoteToSave;
      } else {
        updatedList = [quoteToSave, ...updatedList];
      }

      setQuotesList(updatedList);
      localStorage.setItem("boss_admin_price_quotes", JSON.stringify(updatedList));
      window.dispatchEvent(new Event("priceQuotesUpdated"));
      window.dispatchEvent(new Event("storage"));

      triggerToast(`🎉 ${message}`);
      // Sau khi lưu bảng giá, tự động quay trở về danh sách bảng giá ngoài Admin!
      setViewMode("list");
    } catch (err) {
      console.error("Save price quote error:", err);
      triggerToast("❌ Đã có lỗi xảy ra khi lưu bảng giá!", false);
    } finally {
      setLoading(false);
    }
  };

  // Filtered quotes for search in List View
  const filteredQuotes = quotesList.filter((q) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const titleMatch = (q.productTitle || q.title || "").toLowerCase().includes(query);
    const codeMatch = (q.productCode || "").toLowerCase().includes(query);
    const catMatch = (q.category || "").toLowerCase().includes(query);
    return titleMatch || codeMatch || catMatch;
  });

  // =========================================================================
  // VIEW MODE: "list" -> HIỂN THỊ DANH SÁCH BẢNG GIÁ CHUẨN ADMIN NHƯ ẢNH 2
  // =========================================================================
  if (viewMode === "list") {
    return (
      <div className="admin-table-container">
        {/* THANH TIÊU ĐỀ, TÌM KIẾM VÀ NÚT THÊM BẢNG GIÁ */}
        <div className="table-action-header">
          <h2>BẢNG GIÁ ({quotesList.length})</h2>
          <div className="table-header-controls">
            <div className="admin-search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Tìm tiêu đề, mã bảng giá, chuyên mục..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-search-input"
              />
            </div>
            <button
              className="btn-add-new"
              onClick={handleStartCreateNew}
              title="Tạo mới một bảng giá kỹ thuật với khung bảng tùy biến"
            >
              <Plus size={16} /> THÊM BẢNG GIÁ MỚI
            </button>
            <button
              type="button"
              onClick={handleResetDefaults}
              title="Khôi phục lại dữ liệu bảng giá mẫu chuẩn gốc"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#94a3b8",
                padding: "9px 14px",
                borderRadius: "10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.85rem",
                fontWeight: 600,
                transition: "all 0.2s"
              }}
            >
              <RotateCcw size={14} /> Khôi phục gốc
            </button>
          </div>
        </div>

        {/* STATUS ALERT NẾU CÓ */}
        {saveStatus && (
          <div
            className={`quote-save-alert ${saveStatus.success ? "success" : "error"}`}
            style={{ margin: "0 24px 16px" }}
          >
            {saveStatus.success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{saveStatus.message}</span>
            <button type="button" className="btn-close-toast" onClick={() => setSaveStatus(null)}>✕</button>
          </div>
        )}

        <div className="table-scroll-hint"><span>⇄ Vuốt sang ngang để xem đầy đủ cột</span></div>

        {/* BẢNG DANH SÁCH BẢNG GIÁ THEO CHUẨN GIAO DIỆN ADMIN */}
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 85 }}>Hình ảnh</th>
              <th>Tiêu đề bảng giá</th>
              <th style={{ textAlign: "center", width: 120 }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuotes.length > 0 ? (
              filteredQuotes.map((q, qIdx) => {
                const quoteUniqueKey = q.id || q._id || q.productCode || `q_${qIdx}`;
                const firstItemWithImg = q.items?.find((it) => it.image || it.imageUrl);
                const thumbImg =
                  q.image ||
                  firstItemWithImg?.image ||
                  firstItemWithImg?.imageUrl ||
                  "/project_1.png";

                return (
                  <tr key={quoteUniqueKey}>
                    <td>
                      <img
                        src={thumbImg}
                        alt={q.productTitle || q.productCode}
                        style={{
                          width: 60,
                          height: 40,
                          objectFit: "cover",
                          borderRadius: 6,
                          border: "1px solid rgba(255,255,255,0.12)"
                        }}
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=120&q=80";
                        }}
                      />
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      <div style={{ color: "#f8fafc", fontSize: "0.95rem" }}>
                        {q.productTitle || q.title || q.name || "Bảng giá cửa cuốn BossDoor"}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "2px" }}>
                        {q.customColumns?.length || 8} Cột × {q.items?.length || 7} Hàng
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                        <button
                          className="btn-action-icon edit"
                          onClick={() => handleStartEditQuote(q)}
                          title="Chỉnh sửa bảng giá này"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn-action-icon delete"
                          onClick={() => handleDeleteQuote(quoteUniqueKey)}
                          title="Xóa bảng giá này"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3} style={{ textAlign: "center", padding: "36px", color: "#94a3b8" }}>
                  Không tìm thấy bảng giá nào phù hợp với từ khóa "{searchQuery}"!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE: "create" HOẶC "edit" -> TRANG ĐIỀN KHUNG BẢNG GIÁ CHI TIẾT
  // =========================================================================
  return (
    <div className="admin-price-quote-wrapper">
      {/* THANH HEADER ĐIỀU HƯỚNG: QUAY LẠI DANH SÁCH & TIÊU ĐỀ */}
      <div
        className="table-action-header"
        style={{
          background: "#0f172a",
          padding: "16px 24px",
          borderRadius: "14px",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <button
            type="button"
            className="btn-back-to-list"
            onClick={() => setViewMode("list")}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#f8fafc",
              padding: "9px 16px",
              borderRadius: "10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: 700,
              fontSize: "0.88rem",
              transition: "all 0.2s"
            }}
          >
            <ArrowLeft size={16} /> ← Quay Lại Danh Sách Bảng Giá
          </button>
          <h2 style={{ fontSize: "1.2rem", margin: 0, color: "#f8fafc", fontWeight: 700 }}>
            {viewMode === "create"
              ? "THÊM BẢNG GIÁ MỚI VÀO HỆ THỐNG"
              : `CHỈNH SỬA: ${editingQuote.productTitle || editingQuote.productCode}`}
          </h2>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {viewMode === "edit" && (
            <button
              type="button"
              className="btn-delete-quote-current"
              onClick={() => handleDeleteQuote(editingQuote.id || editingOriginalKey || editingQuote.productCode)}
              disabled={loading}
              style={{
                background: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.35)",
                color: "#fca5a5",
                padding: "9px 16px",
                borderRadius: "10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: 600,
                fontSize: "0.85rem",
                transition: "all 0.2s"
              }}
              title="Xóa vĩnh viễn bảng giá này khỏi hệ thống"
            >
              <Trash2 size={16} /> XÓA BẢNG GIÁ NÀY
            </button>
          )}
          <button
            type="button"
            className="btn-add-new"
            onClick={handleSaveQuote}
            disabled={loading}
            style={{ padding: "9px 20px" }}
          >
            <Save size={16} /> {loading ? "Đang lưu..." : "LƯU BẢNG BÁO GIÁ"}
          </button>
        </div>
      </div>

      {/* TOAST ALERT NẾU CÓ */}
      {saveStatus && (
        <div className={`quote-save-alert ${saveStatus.success ? "success" : "error"}`}>
          {saveStatus.success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{saveStatus.message}</span>
          <button type="button" className="btn-close-toast" onClick={() => setSaveStatus(null)}>✕</button>
        </div>
      )}

      {/* KHUNG BIỂU MẪU ĐIỀN THÔNG TIN & SPREADSHEET MATRIX */}
      <section className="new-quote-builder-card" style={{ marginTop: 0 }}>
        <div className="builder-card-topbar">
          <div className="builder-card-title">
            <Sparkles size={20} className="gold-icon" />
            <div>
              <h3>
                {viewMode === "create"
                  ? "THIẾT LẬP KHUNG VÀ THÔNG TIN BẢNG BÁO GIÁ MỚI"
                  : `CẬP NHẬT NỘI DUNG: ${editingQuote.productTitle || editingQuote.productCode}`}
              </h3>
              <span className="builder-sub-note">
                Tùy biến số hàng số cột linh hoạt, dán link hoặc tải ảnh sản phẩm, gõ bài viết trên/dưới bảng giá và ghi chú kỹ thuật.
              </span>
            </div>
          </div>
          <button
            type="button"
            className="btn-cancel-builder-x"
            onClick={() => setViewMode("list")}
            title="Đóng và quay lại danh sách"
          >
            <X size={18} />
          </button>
        </div>

        <div className="builder-card-body">
          {/* PHẦN 1: THÔNG TIN NHẬN DIỆN BẢNG GIÁ & HÌNH ẢNH */}
          <div className="builder-section-group">
            <h4 className="builder-group-title">
              <FileSpreadsheet size={16} /> 1. Thông Tin Nhận Diện Bảng Giá
            </h4>
            <div className="quote-simple-form-grid">
              <div className="form-field full-width">
                <label className="required-label">
                  Tên bảng giá <span className="text-red">*</span>:
                </label>
                <input
                  type="text"
                  className="input-highlight-bold quote-name-input"
                  value={editingQuote.productTitle || ""}
                  onChange={(e) => handleQuoteNameChange(e.target.value)}
                  placeholder="Ví dụ: Bảng giá Cửa cuốn BossDoor Luxury 2026, Cửa kéo công nghệ Đức..."
                  required
                />
              </div>

              {/* TIÊU ĐỀ BẢNG GIÁ HIỂN THỊ TRÊN WEBSITE */}
              <div className="form-field full-width">
                <label>
                  Tiêu đề bài viết / Bảng giá hiển thị trên website:
                </label>
                <input
                  type="text"
                  className="input-highlight-bold quote-name-input"
                  value={editingQuote.title || ""}
                  onChange={(e) => handleQuoteFieldChange("title", e.target.value)}
                  placeholder="Ví dụ: Bảng giá cập nhật cửa cuốn BossDoor 2026 tại Đà Nẵng..."
                />
              </div>



              {/* HÌNH ẢNH ĐẠI DIỆN BẢNG GIÁ */}
              <div className="form-field full-width quote-image-field-wrap">
                <label>Hình ảnh đại diện bảng giá (Link ảnh hoặc tải từ máy tính):</label>
                <div className="quote-image-controls-row">
                  <div className="quote-image-url-box">
                    <input
                      type="text"
                      className="image-url-input"
                      value={editingQuote.image || ""}
                      onChange={(e) => handleQuoteFieldChange("image", e.target.value)}
                      placeholder="Dán link ảnh trực tiếp (https://... hoặc /project_1.png)..."
                    />
                  </div>

                  <input
                    type="file"
                    ref={quoteImageInputRef}
                    onChange={handleQuoteImageUpload}
                    accept="image/*"
                    style={{ display: "none" }}
                  />

                  <button
                    type="button"
                    className="btn-upload-local-img"
                    onClick={() => quoteImageInputRef.current?.click()}
                    disabled={isUploadingImage}
                  >
                    {isUploadingImage ? (
                      <>
                        <Loader2 size={16} className="spin-icon" /> Đang tải ảnh...
                      </>
                    ) : (
                      <>
                        <Upload size={16} /> Tải ảnh từ máy tính
                      </>
                    )}
                  </button>
                </div>

                {editingQuote.image && (
                  <div className="quote-image-preview-card">
                    <div
                      className="quote-img-thumb-wrap"
                      onClick={() => setZoomModalImg({ url: editingQuote.image, title: editingQuote.productTitle || "Ảnh đại diện bảng giá" })}
                      style={{ cursor: "zoom-in" }}
                      title="Nhấn để phóng to / thu nhỏ ảnh"
                    >
                      <img
                        src={editingQuote.image}
                        alt="Ảnh đại diện bảng giá"
                        className="quote-preview-thumbnail"
                        onError={(e) => {
                          e.target.style.opacity = "0.3";
                        }}
                      />
                      <span className="quote-img-zoom-hint">
                        <ZoomIn size={12} /> Phóng to
                      </span>
                    </div>
                    <div className="quote-img-preview-info">
                      <span className="preview-label">Ảnh đã chọn</span>
                      <button
                        type="button"
                        className="btn-remove-quote-img"
                        onClick={() => handleQuoteFieldChange("image", "")}
                        title="Xóa ảnh này"
                      >
                        <X size={14} /> Xóa ảnh
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* PHẦN 2: KHUNG ĐIỀN BẢNG GIÁ VÀ THÔNG TIN SẢN PHẨM */}
          <div className="builder-section-group">
            <div className="builder-matrix-header-row">
              <div className="matrix-title-wrap">
                <h4 className="builder-group-title mb-0">
                  <LayoutGrid size={16} /> 2. Khung Bảng Giá &amp; Thông Tin Sản Phẩm
                </h4>
                <span className="matrix-current-badge">
                  Đang hiển thị: <strong>{gridColumns.length} Cột</strong> × <strong>{gridRows.length} Hàng</strong>
                </span>
              </div>

              {/* Nút preset và chỉnh số cột x số hàng */}
              <div className="grid-dimension-controls">
                <button
                  type="button"
                  className="btn-preset-7x7"
                  onClick={handleResetTo7x7}
                  title="Khởi tạo chuẩn 8 Cột (kèm Cột Ảnh) x 7 Hàng có sẵn mẫu"
                >
                  <Sparkles size={14} /> Khung Chuẩn 8 Cột × 7 Hàng (Có Ảnh)
                </button>

                <div className="dimension-input-group">
                  <label>Số cột:</label>
                  <input
                    type="number"
                    min={2}
                    max={15}
                    value={inputColsCount}
                    onChange={(e) => setInputColsCount(e.target.value)}
                    className="dim-num-input"
                  />
                  <span className="dim-times">×</span>
                  <label>Số hàng:</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={inputRowsCount}
                    onChange={(e) => setInputRowsCount(e.target.value)}
                    className="dim-num-input"
                  />
                  <button
                    type="button"
                    className="btn-apply-dim"
                    onClick={handleApplyCustomGridSize}
                  >
                    Tạo Khung
                  </button>
                </div>
              </div>
            </div>

            {/* Hướng dẫn thao tác */}
            <div className="matrix-quick-hint">
              <Info size={15} />
              <span>
                💡 <strong>Kéo thả viền mép cột</strong> để co giãn độ rộng cột. Bấm dấu <strong>+</strong> trên tiêu đề cột hoặc nút <strong>+ Chèn</strong> trên từng hàng để <strong>thêm cột / hàng vào bất cứ chỗ nào</strong> bạn muốn!
              </span>
            </div>

            {/* KHU VỰC BÀI VIẾT PHÍA TRÊN BẢNG GIÁ */}
            <div className="quote-article-block above-table-article">
              <RichArticleEditor
                value={editingQuote.articleAbove || ""}
                onChange={(val) => handleQuoteFieldChange("articleAbove", val)}
                placeholder="Nhập đoạn văn bản / bài viết giới thiệu mở đầu phía trên bảng giá..."
                minHeight={80}
                badgeText="Bài Viết / Giới Thiệu (Phía Trên Bảng Giá)"
                hintText="Đoạn văn bản giới thiệu mở đầu hiển thị ngay phía trên bảng giá ngoài trang web"
                allQuotes={quotesList}
              />
            </div>

            {/* BẢNG SPREADSHEET NHẬP LIỆU TRỰC TIẾP */}
            <div className="admin-table-scroll-wrapper spreadsheet-wrapper">
              <table className="admin-quote-data-table spreadsheet-table">
                <thead>
                  <tr>
                    {gridColumns.map((col, cIdx) => {
                      const isSttCol = col.key === "stt" || col.id === "col_1" || col.label?.toLowerCase() === "stt";
                      const isCodeCol = col.key === "code" || col.id === "col_2" || col.label?.toLowerCase().includes("mã");
                      const isUnitCol = col.key === "unit" || col.id === "col_4" || col.label?.toLowerCase().includes("đvt");
                      const colWidth = isSttCol
                        ? col.width && parseInt(col.width) >= 48 ? col.width : "50px"
                        : isCodeCol
                        ? col.width && parseInt(col.width) >= 80 ? col.width : "88px"
                        : isUnitCol
                        ? col.width && parseInt(col.width) >= 60 ? col.width : "65px"
                        : col.width || "120px";
                      const colMinWidth = isSttCol ? "42px" : isCodeCol ? "72px" : isUnitCol ? "52px" : "55px";

                      return (
                        <th
                          key={col.id}
                          style={{
                            width: colWidth,
                            minWidth: colMinWidth,
                            position: "sticky",
                            top: 0,
                            zIndex: 10
                          }}
                        >
                          <div className={`col-header-interactive ${isSttCol ? "stt-header-interactive" : ""} ${isCodeCol ? "code-header-interactive" : ""}`}>
                            <input
                              type="text"
                              value={col.label}
                              onChange={(e) => handleUpdateColLabel(cIdx, e.target.value)}
                              className={`col-label-input ${isSttCol ? "stt-label-input" : ""}`}
                              title="Bấm để đổi tên cột"
                            />
                            <div className="col-header-btns">
                              <button
                                type="button"
                                className="btn-insert-col-plus"
                                onClick={() => handleInsertCol(cIdx)}
                                title={`Chèn thêm 1 cột mới ngay sau cột "${col.label}"`}
                              >
                                <Plus size={8} />
                              </button>
                              {!isSttCol && gridColumns.length > 2 && (
                                <button
                                  type="button"
                                  className="btn-del-col-x"
                                  onClick={() => handleDeleteCol(cIdx)}
                                  title={`Xóa cột "${col.label}"`}
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          </div>

                          {/* THANH KÉO CO GIÃN ĐỘ RỘNG CỘT */}
                          <div
                            className={`col-resize-handle ${resizingColIndex === cIdx ? "active" : ""}`}
                            onMouseDown={(e) => handleResizeStart(e, cIdx)}
                            title="Bấm giữ và kéo chuột sang trái/phải để co giãn to nhỏ cột này"
                          />
                        </th>
                      );
                    })}
                    <th style={{ width: "88px", textAlign: "center", padding: "4px" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {gridRows.map((row, rIdx) => (
                    <tr key={`gr-${rIdx}`}>
                      {gridColumns.map((col) => {
                        const isImage = isImageCol(col);
                        const isStt = col.key === "stt" || col.id === "col_1" || col.label?.toLowerCase() === "stt";
                        const isCode = col.key === "code" || col.id === "col_2" || col.label?.toLowerCase().includes("mã");
                        const isNameOrDesc = col.key === "name" || col.id === "col_3" || col.label?.toLowerCase().includes("tên");
                        const isPrice = col.key?.includes("price") || col.id === "col_6" || col.id === "col_7" || col.label?.toLowerCase().includes("giá");
                        const cellVal = row[col.id] || "";
                        const isHighlighted = emptyCellsHighlight.has(`${rIdx}_${col.id}`);

                        if (isImage) {
                          return (
                            <td key={`${col.id}-${rIdx}`} className="spreadsheet-cell cell-image-type">
                              <div className={`table-img-cell-box ${cellVal ? "has-image" : ""}`}>
                                <div className="table-img-main-row">
                                  {cellVal && (
                                    <div
                                      className="cell-img-thumb-container"
                                      title="Nhấn để phóng to ảnh xem chi tiết"
                                      onClick={() =>
                                        setZoomModalImg({
                                          url: cellVal,
                                          title: row.name || `Sản phẩm dòng ${rIdx + 1}`
                                        })
                                      }
                                    >
                                      <img
                                        src={cellVal}
                                        alt={`SP ${rIdx + 1}`}
                                        className="cell-img-thumb"
                                        onError={(e) => {
                                          e.target.style.opacity = "0.3";
                                        }}
                                      />
                                      <span className="cell-img-zoom-hover" title="Phóng to">
                                        <ZoomIn size={11} />
                                      </span>
                                      <button
                                        type="button"
                                        className="btn-remove-cell-img"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleGridCellChange(rIdx, col.id, "");
                                        }}
                                        title="Gỡ ảnh này"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  )}
                                  <div className="cell-img-action-group">
                                    <input
                                      type="text"
                                      className="table-input cell-img-url-input"
                                      value={cellVal}
                                      onChange={(e) => handleGridCellChange(rIdx, col.id, e.target.value)}
                                      placeholder="Dán link ảnh..."
                                      title="Dán link ảnh trực tiếp (https://... hoặc /ảnh.jpg)"
                                    />
                                    <label className="cell-img-upload-btn" title="Tải ảnh từ máy local (PNG, JPG, WEBP)">
                                      <Upload size={11} />
                                      <span className="upload-btn-text">Tải</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        onChange={(e) => handleCellImageUpload(rIdx, col.id, e)}
                                      />
                                    </label>
                                  </div>
                                </div>
                                <div className="cell-prod-link-row">
                                  <input
                                    type="text"
                                    className="table-input cell-prod-link-input"
                                    value={row.productLink || ""}
                                    onChange={(e) => handleGridCellChange(rIdx, "productLink", e.target.value)}
                                    placeholder="🔗 Link SP riêng (tùy chọn: /san-pham/...)"
                                    title="Đường link dẫn đến trang sản phẩm riêng (ví dụ: /san-pham/bd-01). Để trống sẽ tự động tạo link theo mã SP."
                                  />
                                </div>
                              </div>
                            </td>
                          );
                        }

                        return (
                          <td
                            key={`${col.id}-${rIdx}`}
                            className={`spreadsheet-cell ${isStt ? "cell-stt-cell" : ""} ${isCode ? "cell-code-cell" : ""} ${isHighlighted ? "cell-highlight-empty" : ""}`}
                          >
                            {isNameOrDesc ? (
                              <AutoResizeTextarea
                                minHeight={42}
                                className="table-textarea cell-content"
                                value={cellVal}
                                onChange={(e) => handleGridCellChange(rIdx, col.id, e.target.value)}
                                placeholder="Nhập tên, quy cách..."
                              />
                            ) : (
                              <input
                                type="text"
                                className={`table-input cell-content ${isStt ? "cell-stt-input" : ""} ${isCode ? "bold-code cell-code-input" : ""} ${isPrice ? "price-input" : ""}`}
                                value={cellVal}
                                onChange={(e) => handleGridCellChange(rIdx, col.id, e.target.value)}
                                placeholder={isPrice ? "1,200,000" : isCode ? "Mã SP" : isStt ? String(rIdx + 1) : "..."}
                              />
                            )}
                          </td>
                        );
                      })}
                      <td className="text-center row-actions-cell">
                        <button
                          type="button"
                          className="btn-insert-row-inline"
                          onClick={() => handleInsertRow(rIdx)}
                          title={`Chèn thêm 1 hàng mới ngay dưới hàng ${rIdx + 1}`}
                        >
                          <Plus size={12} /> Chèn
                        </button>
                        <button
                          type="button"
                          className="btn-trash-row"
                          onClick={() => handleDeleteRow(rIdx)}
                          title={`Xóa hàng ${rIdx + 1}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* THANH THÊM HÀNG / THÊM CỘT DƯỚI BẢNG */}
            <div className="table-quick-append-bar">
              <button
                type="button"
                className="btn-append-row"
                onClick={handleAddRow}
              >
                <Plus size={15} /> Thêm 1 Hàng Mới
              </button>
              <button
                type="button"
                className="btn-append-col"
                onClick={handleAddCol}
              >
                <Plus size={15} /> Thêm 1 Cột Mới
              </button>
              {!gridColumns.some(isImageCol) && (
                <button
                  type="button"
                  className="btn-append-img-col"
                  onClick={handleAddImageCol}
                  title="Thêm 1 cột chuyên dụng để dán link ảnh hoặc tải ảnh từ máy tính"
                >
                  <ImageIcon size={15} /> Thêm Cột Hình Ảnh
                </button>
              )}
            </div>

            {/* KHU VỰC BÀI VIẾT PHÍA DƯỚI BẢNG GIÁ */}
            <div className="quote-article-block below-table-article">
              <RichArticleEditor
                value={editingQuote.articleBelow || ""}
                onChange={(val) => handleQuoteFieldChange("articleBelow", val)}
                placeholder="Gõ bài viết chi tiết, hướng dẫn kỹ thuật, tư vấn báo giá đặt phía dưới bảng giá..."
                minHeight={120}
                badgeText="Bài Viết Chi Tiết & Tư Vấn Kỹ Thuật (Phía Dưới Bảng Giá)"
                hintText="Nội dung bài viết chi tiết, hướng dẫn kỹ thuật, lưu ý thi công hiển thị phía dưới bảng giá"
                tableColumns={gridColumns}
                tableRows={gridRows}
                allQuotes={quotesList}
                onScrollToTable={() => {
                  const el = document.querySelector('.spreadsheet-wrapper') || document.querySelector('.matrix-quick-hint');
                  el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
              />
            </div>
          </div>

          {/* PHẦN 3: LỰA CHỌN THÊM (PHỤ KIỆN & NÂNG CẤP) */}
          <div className="builder-section-group">
            <div className="section-header-row">
              <h4 className="builder-group-title mb-0">
                <Plus size={18} /> 3. Khu Vực "LỰA CHỌN THÊM" (Phụ Kiện &amp; Nâng Cấp)
              </h4>
              <button type="button" className="btn-add-row" onClick={handleAddNewAddon}>
                <Plus size={15} /> Thêm Lựa Chọn Phụ Kiện
              </button>
            </div>

            <div className="addons-editor-list">
              {(editingQuote.addons || []).map((addon, aIdx) => (
                <div key={aIdx} className="addon-editor-row">
                  <div className="addon-field-group">
                    <label>Nhóm / Phân loại:</label>
                    <input
                      type="text"
                      value={addon.category || ""}
                      onChange={(e) => handleAddonChange(aIdx, "category", e.target.value)}
                      placeholder="Ví dụ: Ray Inox đặc chìm, Trụ khóa..."
                    />
                  </div>
                  <div className="addon-field-group flex-2">
                    <label>Tên lựa chọn phụ kiện:</label>
                    <input
                      type="text"
                      value={addon.name || ""}
                      onChange={(e) => handleAddonChange(aIdx, "name", e.target.value)}
                      placeholder="Ví dụ: Ray Inox đặc 201 chìm"
                    />
                  </div>
                  <div className="addon-field-group">
                    <label>Đơn vị tính:</label>
                    <input
                      type="text"
                      value={addon.unit || "md"}
                      onChange={(e) => handleAddonChange(aIdx, "unit", e.target.value)}
                      placeholder="md, m dài, bộ..."
                    />
                  </div>
                  <div className="addon-field-group">
                    <label>Đơn giá cộng thêm:</label>
                    <input
                      type="text"
                      className="price-input"
                      value={addon.price || ""}
                      onChange={(e) => handleAddonChange(aIdx, "price", e.target.value)}
                      placeholder="Ví dụ: + 280.000 đồng/md"
                    />
                  </div>
                  <button
                    type="button"
                    className="btn-trash-addon"
                    onClick={() => handleDeleteAddon(aIdx)}
                    title="Xóa lựa chọn phụ kiện này"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* CẢNH BÁO Ô TRỐNG NẾU CÓ */}
          {emptyCellsHighlight.size > 0 && (
            <div className="table-validation-warning">
              <AlertCircle size={18} className="warn-icon" />
              <span>
                ⚠️ <strong>Chưa thể lưu:</strong> Bảng giá còn <strong>{emptyCellsHighlight.size} ô</strong> đang để trống (được tô màu đỏ). Vui lòng điền đủ tất cả các ô trong bảng!
              </span>
            </div>
          )}

          {/* NÚT THAO TÁC CUỐI TRANG */}
          <div className="builder-action-footer">
            <button
              type="button"
              className="btn-submit-new-quote"
              onClick={handleSaveQuote}
              disabled={loading}
            >
              <Check size={18} />
              <span>{loading ? "Đang xử lý..." : "XÁC NHẬN LƯU BẢNG BÁO GIÁ"}</span>
            </button>

            {viewMode === "edit" && (
              <button
                type="button"
                className="btn-danger-outline"
                onClick={() => handleDeleteQuote(editingQuote.id || editingOriginalKey || editingQuote.productCode)}
                disabled={loading}
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.35)",
                  color: "#fca5a5",
                  padding: "11px 20px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontWeight: 600,
                  fontSize: "0.9rem"
                }}
              >
                <Trash2 size={16} /> Xóa Bảng Giá Này
              </button>
            )}

            <button
              type="button"
              className="btn-cancel-builder"
              onClick={() => setViewMode("list")}
            >
              Hủy bỏ &amp; Quay lại danh sách
            </button>
          </div>
        </div>
      </section>

      {/* MODAL PHÓNG TO / THU NHỎ HÌNH ẢNH TRONG ADMIN */}
      {zoomModalImg && (
        <div
          className="admin-zoom-modal-backdrop"
          onClick={() => setZoomModalImg(null)}
        >
          <div
            className="admin-zoom-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="zoom-modal-header">
              <div className="zoom-modal-header-left">
                <Sparkles size={16} className="gold-icon" />
                <h3 className="zoom-modal-title">{zoomModalImg.title || "Xem ảnh chi tiết"}</h3>
              </div>

              {/* THANH ĐIỀU KHIỂN PHÓNG TO / THU NHỎ / XOAY ẢNH */}
              <div className="zoom-modal-controls-bar">
                <button
                  type="button"
                  className="btn-zoom-action"
                  onClick={handleZoomOut}
                  title="Thu nhỏ ảnh (-25%)"
                  disabled={zoomScale <= 0.5}
                >
                  <ZoomOut size={16} />
                </button>

                <button
                  type="button"
                  className="btn-zoom-scale-indicator"
                  onClick={handleResetZoom}
                  title="Bấm để đưa về 100% kích thước chuẩn"
                >
                  {Math.round(zoomScale * 100)}%
                </button>

                <button
                  type="button"
                  className="btn-zoom-action"
                  onClick={handleZoomIn}
                  title="Phóng to ảnh (+25%)"
                  disabled={zoomScale >= 3.5}
                >
                  <ZoomIn size={16} />
                </button>

                <div className="zoom-modal-sep" />

                <button
                  type="button"
                  className="btn-zoom-action"
                  onClick={handleRotateZoom}
                  title="Xoay ảnh 90 độ"
                >
                  <RotateCcw size={15} style={{ transform: "scaleX(-1)" }} />
                </button>

                <button
                  type="button"
                  className="btn-zoom-action btn-zoom-reset"
                  onClick={handleResetZoom}
                  title="Đặt lại ảnh về ban đầu"
                >
                  Mặc định
                </button>

                <div className="zoom-modal-sep" />

                <button
                  type="button"
                  className="btn-close-zoom-modal-clean"
                  onClick={() => setZoomModalImg(null)}
                  title="Đóng (Esc)"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* VÙNG HIỂN THỊ HÌNH ẢNH CÓ HỖ TRỢ ZOOM & DRAG */}
            <div
              className={`zoom-modal-image-wrapper ${isDraggingZoom ? "is-dragging" : ""}`}
              onWheel={handleZoomWheel}
              onMouseDown={handleZoomMouseDown}
              onMouseMove={handleZoomMouseMove}
              onMouseUp={handleZoomMouseUp}
              onMouseLeave={handleZoomMouseUp}
              onDoubleClick={() => {
                if (zoomScale === 1) {
                  setZoomScale(2);
                } else {
                  handleResetZoom();
                }
              }}
              style={{
                cursor: zoomScale > 1 ? (isDraggingZoom ? "grabbing" : "grab") : "zoom-in"
              }}
            >
              <img
                src={zoomModalImg.url}
                alt={zoomModalImg.title || "Xem ảnh"}
                className="zoom-modal-img"
                style={{
                  transform: `translate(${zoomPosition.x}px, ${zoomPosition.y}px) scale(${zoomScale}) rotate(${zoomRotation}deg)`,
                  transition: isDraggingZoom ? "none" : "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
                }}
                draggable={false}
              />
            </div>

            <div className="zoom-modal-footer-hint">
              <span>💡 Dùng <strong>con lăn chuột</strong> hoặc nút <strong>+ / -</strong> để phóng to/thu nhỏ, <strong>kéo giữ chuột</strong> để di chuyển ảnh, <strong>nhấp đúp</strong> để phóng to nhanh 200%.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
