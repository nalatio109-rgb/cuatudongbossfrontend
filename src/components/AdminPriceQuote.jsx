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
  FileText
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
    cols.forEach((col) => {
      if (item.rawGridCells && item.rawGridCells[col.id] !== undefined) {
        rowObj[col.id] = String(item.rawGridCells[col.id] ?? "");
      } else if (item[col.id] !== undefined) {
        rowObj[col.id] = String(item[col.id] ?? "");
      } else if (col.key && item[col.key] !== undefined) {
        rowObj[col.id] = String(item[col.key] ?? "");
      } else {
        const isStt = col.key === "stt" || col.id === "col_1" || col.label?.toLowerCase() === "stt";
        const isCode = col.key === "code" || col.id === "col_2" || col.label?.toLowerCase().includes("mã");
        const isImg = isImageCol(col);
        const isName = col.key === "name" || col.id === "col_3" || col.label?.toLowerCase().includes("tên") || col.label?.toLowerCase().includes("quy cách");
        const isUnit = col.key === "unit" || col.id === "col_4" || col.label?.toLowerCase().includes("đvt");
        const isColor = col.key === "colors" || col.id === "col_5" || col.label?.toLowerCase().includes("màu");
        const isPrice1 = col.key === "priceOver8" || col.id === "col_6" || col.label?.toLowerCase().includes("> 8m");
        const isPrice2 = col.key === "price6to8" || col.id === "col_7" || col.label?.toLowerCase().includes("≤ 8m") || col.label?.toLowerCase().includes("< 8m");

        if (isStt) rowObj[col.id] = String(item.stt || rIdx + 1);
        else if (isCode) rowObj[col.id] = String(item.code || "");
        else if (isImg) rowObj[col.id] = String(item.image || item.imageUrl || "");
        else if (isName) rowObj[col.id] = String(item.name || item.description || "");
        else if (isUnit) rowObj[col.id] = String(item.unit || "m2");
        else if (isColor) rowObj[col.id] = String(item.colors || "Theo tiêu chuẩn");
        else if (isPrice1) rowObj[col.id] = String(item.priceOver8 || item.price || "");
        else if (isPrice2) rowObj[col.id] = String(item.price6to8 || item.priceOver8 || item.price || "");
        else rowObj[col.id] = "";
      }
    });
    return rowObj;
  });
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

  // STATE FOR EDITOR (THÊM HOẶC SỬA BẢNG GIÁ)
  const [editingQuote, setEditingQuote] = useState(() => JSON.parse(JSON.stringify(DEFAULT_NEW_QUOTE_TEMPLATE)));
  const [gridColumns, setGridColumns] = useState(DEFAULT_GRID_COLUMNS);
  const [gridRows, setGridRows] = useState(createDefault7Rows);
  const [inputColsCount, setInputColsCount] = useState(8);
  const [inputRowsCount, setInputRowsCount] = useState(7);
  const [emptyCellsHighlight, setEmptyCellsHighlight] = useState(new Set());

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

    setQuotesList(loaded);
    setLoading(false);
  };

  // ================= 1. HÀM ĐIỀU HƯỚNG VÀ CHUYỂN CHẾ ĐỘ =================
  const handleStartCreateNew = () => {
    const freshCode = `BD-${Date.now().toString().slice(-4)}`;
    const newQuote = {
      ...JSON.parse(JSON.stringify(DEFAULT_NEW_QUOTE_TEMPLATE)),
      productCode: freshCode,
      productTitle: "Bảng giá cửa cuốn BossDoor 2026",
      title: "Bảng giá cập nhật cửa cuốn BossDoor 2026 tại Đà Nẵng"
    };
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
    const cloned = JSON.parse(JSON.stringify(quote));
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
  const handleDeleteQuote = async (code) => {
    if (quotesList.length <= 1) {
      alert("Hệ thống cần giữ lại tối thiểu 1 bảng giá!");
      return;
    }
    const target = quotesList.find((q) => q.productCode === code);
    const targetName = target?.productTitle || target?.title || code;

    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn XÓA VĨNH VIỄN bảng giá "${targetName}" khỏi hệ thống?`
    );
    if (!confirmDelete) return;

    setLoading(true);
    const remaining = quotesList.filter((q) => q.productCode !== code);

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
    const priceCols = gridColumns.filter((c) => c.key?.includes("price") || c.id === "col_6" || c.id === "col_7" || c.label?.toLowerCase().includes("giá"));

    const formattedItems = gridRows.map((row, rIdx) => {
      const sttVal = (sttCol && row[sttCol.id]) || rIdx + 1;
      const codeVal = (codeCol && row[codeCol.id]) || `${editingQuote.productCode || "SP"}-${rIdx + 1}`;
      const imgVal = (imgCol && row[imgCol.id]) || "";
      const nameVal = (nameCol && row[nameCol.id]) || `Dòng sản phẩm ${rIdx + 1}`;
      const unitVal = (unitCol && row[unitCol.id]) || "m2";
      const colorsVal = (colorCol && row[colorCol.id]) || "Theo tiêu chuẩn";
      const price1Val = (priceCols[0] && row[priceCols[0].id]) || "Liên hệ";
      const price2Val = (priceCols[1] && row[priceCols[1].id]) || price1Val;
      const price3Val = (priceCols[2] && row[priceCols[2].id]) || price2Val;

      return {
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
        note: `Sản phẩm ${codeVal}`,
        rawGridCells: { ...row }
      };
    });

    const quoteToSave = {
      ...editingQuote,
      productCode: (editingQuote.productCode || "").trim() || `BD-${Date.now().toString().slice(-4)}`,
      productTitle: rawTitle.trim(),
      category: editingQuote.category || "cuacuon",
      title: editingQuote.title || `Bảng giá cập nhật ${rawTitle.trim()} 2026 tại Đà Nẵng`,
      effectiveDate: editingQuote.effectiveDate || "Áp dụng từ năm 2026 cho đến khi có thông báo mới",
      articleAbove: editingQuote.articleAbove || "",
      articleBelow: editingQuote.articleBelow || "",
      image: editingQuote.image || (formattedItems.find((it) => it.image)?.image) || "/project_1.png",
      customColumns: gridColumns.map((c) => ({
        id: c.id,
        key: c.key || c.id,
        label: c.label,
        width: c.width || "130px"
      })),
      items: formattedItems,
      addons: editingQuote.addons || [],
      policies: editingQuote.policies || {}
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
          }
        } catch (e) {
          console.warn("API save error, fallback to local:", e);
        }
      }

      let updatedList;
      if (viewMode === "create") {
        const existIdx = quotesList.findIndex((q) => q.productCode === quoteToSave.productCode);
        if (existIdx >= 0) {
          updatedList = [...quotesList];
          updatedList[existIdx] = quoteToSave;
        } else {
          updatedList = [quoteToSave, ...quotesList];
        }
      } else {
        updatedList = quotesList.map((q) =>
          q.productCode === quoteToSave.productCode ? quoteToSave : q
        );
        if (!updatedList.some((q) => q.productCode === quoteToSave.productCode)) {
          updatedList.push(quoteToSave);
        }
      }

      setQuotesList(updatedList);
      localStorage.setItem("boss_admin_price_quotes", JSON.stringify(updatedList));
      window.dispatchEvent(new Event("priceQuotesUpdated"));

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
              <th>Tiêu đề bảng giá &amp; Mã</th>
              <th>Chuyên mục</th>
              <th>Quy cách khung</th>
              <th>Ngày áp dụng</th>
              <th>Tóm tắt nội dung</th>
              <th style={{ textAlign: "center", width: 100 }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuotes.length > 0 ? (
              filteredQuotes.map((q) => {
                const colsCount = q.customColumns?.length || DEFAULT_GRID_COLUMNS.length;
                const rowsCount = q.items?.length || 7;
                const firstItemWithImg = q.items?.find((it) => it.image || it.imageUrl);
                const thumbImg =
                  q.image ||
                  firstItemWithImg?.image ||
                  firstItemWithImg?.imageUrl ||
                  "/project_1.png";

                return (
                  <tr key={q.productCode}>
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
                      <div style={{ fontSize: "0.78rem", color: "#38bdf8", marginTop: 4 }}>
                        🏷️ Mã: <strong>{q.productCode}</strong>
                      </div>
                    </td>
                    <td>
                      <span
                        className="admin-badge-category"
                        style={{
                          background: "rgba(16, 185, 129, 0.15)",
                          color: "#10b981",
                          border: "1px solid rgba(16, 185, 129, 0.3)"
                        }}
                      >
                        {q.category === "cuacuon"
                          ? "Cửa cuốn"
                          : q.category === "cuakeo"
                          ? "Cửa kéo"
                          : q.category || "Cửa cuốn"}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          background: "rgba(56, 189, 248, 0.12)",
                          color: "#38bdf8",
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          border: "1px solid rgba(56, 189, 248, 0.25)"
                        }}
                      >
                        {colsCount} Cột × {rowsCount} Hàng
                      </span>
                    </td>
                    <td style={{ color: "#cbd5e1", fontSize: "0.88rem" }}>
                      {q.effectiveDate || "Năm 2026"}
                    </td>
                    <td style={{ maxWidth: 260, fontSize: "0.85rem", color: "#94a3b8" }}>
                      <div
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          lineHeight: 1.4
                        }}
                      >
                        {q.articleAbove || q.articleBelow || q.description || "Bảng báo giá chi tiết BossDoor"}
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
                          onClick={() => handleDeleteQuote(q.productCode)}
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
                <td colSpan={7} style={{ textAlign: "center", padding: "36px", color: "#94a3b8" }}>
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

        <div style={{ display: "flex", gap: "10px" }}>
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
                    <div className="quote-img-thumb-wrap">
                      <img
                        src={editingQuote.image}
                        alt="Ảnh đại diện bảng giá"
                        className="quote-preview-thumbnail"
                        onError={(e) => {
                          e.target.style.opacity = "0.3";
                        }}
                      />
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
              <div className="article-block-header">
                <span className="article-block-badge">
                  <FileText size={14} /> Bài Viết / Giới Thiệu (Phía Trên Bảng Giá)
                </span>
                <span className="article-block-hint">
                  Đoạn văn bản giới thiệu mở đầu hiển thị ngay phía trên bảng giá ngoài trang web
                </span>
              </div>
              <textarea
                rows={3}
                className="quote-article-textarea"
                value={editingQuote.articleAbove || ""}
                onChange={(e) => handleQuoteFieldChange("articleAbove", e.target.value)}
                placeholder="Nhập đoạn văn bản / bài viết giới thiệu mở đầu phía trên bảng giá..."
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
                            position: "relative"
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
                                {cellVal && (
                                  <div className="cell-img-thumb-container" title="Ảnh sản phẩm">
                                    <img
                                      src={cellVal}
                                      alt={`SP ${rIdx + 1}`}
                                      className="cell-img-thumb"
                                      onError={(e) => {
                                        e.target.style.opacity = "0.3";
                                      }}
                                    />
                                    <button
                                      type="button"
                                      className="btn-remove-cell-img"
                                      onClick={() => handleGridCellChange(rIdx, col.id, "")}
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
                                      onChange={(e) => handleCellImageUpload(rowIdx, col.id, e)}
                                    />
                                  </label>
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
                              <textarea
                                rows={2}
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
              <div className="article-block-header">
                <span className="article-block-badge">
                  <FileText size={14} /> Bài Viết Chi Tiết &amp; Tư Vấn Kỹ Thuật (Phía Dưới Bảng Giá)
                </span>
                <span className="article-block-hint">
                  Nội dung bài viết chi tiết, hướng dẫn kỹ thuật, lưu ý thi công hiển thị phía dưới bảng giá
                </span>
              </div>
              <textarea
                rows={4}
                className="quote-article-textarea"
                value={editingQuote.articleBelow || ""}
                onChange={(e) => handleQuoteFieldChange("articleBelow", e.target.value)}
                placeholder="Gõ bài viết chi tiết, hướng dẫn kỹ thuật, tư vấn báo giá đặt phía dưới bảng giá..."
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

          {/* PHẦN 4: GHI CHÚ VÀ CHÍNH SÁCH GIÁ */}
          <div className="builder-section-group">
            <h4 className="builder-group-title">
              <HelpCircle size={18} /> 4. Ghi Chú Và Chính Sách Giá
            </h4>
            <div className="form-grid-2">
              <div className="form-field">
                <label>1. Giá đã bao gồm những hạng mục nào:</label>
                <textarea
                  rows={3}
                  value={editingQuote.policies?.included || ""}
                  onChange={(e) => handlePolicyChange("included", e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>2. Những chi phí chưa bao gồm (vận chuyển, lắp đặt...):</label>
                <textarea
                  rows={3}
                  value={editingQuote.policies?.excluded || ""}
                  onChange={(e) => handlePolicyChange("excluded", e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>3. Ghi chú điều kiện thi công &amp; kích thước:</label>
                <textarea
                  rows={3}
                  value={editingQuote.policies?.conditionNote || ""}
                  onChange={(e) => handlePolicyChange("conditionNote", e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>4. Chính sách bảo hành và hỗ trợ kỹ thuật:</label>
                <textarea
                  rows={3}
                  value={editingQuote.policies?.warrantyNote || ""}
                  onChange={(e) => handlePolicyChange("warrantyNote", e.target.value)}
                />
              </div>
              <div className="form-field span-2">
                <label>5. Cam kết báo giá minh bạch, cạnh tranh của Boss Đà Nẵng:</label>
                <textarea
                  rows={2}
                  value={editingQuote.policies?.commitmentNote || ""}
                  onChange={(e) => handlePolicyChange("commitmentNote", e.target.value)}
                />
              </div>
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
    </div>
  );
}
