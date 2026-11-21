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
  Info,
  Upload,
  Image as ImageIcon,
  Loader2
} from "lucide-react";
import { DEFAULT_PRICE_QUOTES } from "../data/defaultPriceQuotes";
import "./AdminPriceQuote.css";

// 7 Cột mặc định tiêu chuẩn theo đúng thực tế ngành cửa tại Đà Nẵng
const DEFAULT_7_COLUMNS = [
  { id: "col_1", key: "stt", label: "STT", width: "60px" },
  { id: "col_2", key: "code", label: "Mã SP", width: "110px" },
  { id: "col_3", key: "name", label: "Tên & Quy cách kỹ thuật", width: "260px" },
  { id: "col_4", key: "unit", label: "ĐVT", width: "75px" },
  { id: "col_5", key: "colors", label: "Màu sắc", width: "160px" },
  { id: "col_6", key: "priceOver8", label: "Đơn giá (> 8m²)", width: "140px" },
  { id: "col_7", key: "price6to8", label: "Đơn giá (≤ 8m²)", width: "140px" }
];

// Khởi tạo sẵn 7 hàng mẫu chuyên nghiệp đúng 7 cột x 7 hàng
const createDefault7Rows = () => [
  {
    col_1: "1",
    col_2: "BD-01",
    col_3: "Cửa cuốn khe thoáng BossDoor tiêu chuẩn, nhôm 6063-T5",
    col_4: "m2",
    col_5: "Ghi sáng, Vàng kem",
    col_6: "1,250,000",
    col_7: "1,320,000"
  },
  {
    col_1: "2",
    col_2: "BD-02",
    col_3: "Cửa cuốn khe thoáng BossDoor chống bão gia cường kép",
    col_4: "m2",
    col_5: "Ghi sáng, Cafe cháy",
    col_6: "1,450,000",
    col_7: "1,520,000"
  },
  {
    col_1: "3",
    col_2: "BD-03",
    col_3: "Cửa cuốn BossDoor ECO siêu thoáng, giảm chấn 2 chiều",
    col_4: "m2",
    col_5: "Ghi sần, Cà phê",
    col_6: "1,650,000",
    col_7: "1,730,000"
  },
  {
    col_1: "4",
    col_2: "BD-04",
    col_3: "Cửa cuốn thế hệ mới khóa cơ an toàn chống cạy",
    col_4: "m2",
    col_5: "Ghi ánh kim",
    col_6: "1,850,000",
    col_7: "1,940,000"
  },
  {
    col_1: "5",
    col_2: "BD-05",
    col_3: "Cửa cuốn siêu êm tích hợp ron cao su giảm chấn",
    col_4: "m2",
    col_5: "Vàng kem, Nâu cafe",
    col_6: "2,100,000",
    col_7: "2,200,000"
  },
  {
    col_1: "6",
    col_2: "BD-06",
    col_3: "Cửa cuốn bản nan lớn Luxury sang trọng biệt thự",
    col_4: "m2",
    col_5: "Ghi sần cao cấp",
    col_6: "2,450,000",
    col_7: "2,560,000"
  },
  {
    col_1: "7",
    col_2: "BD-07",
    col_3: "Cửa cuốn siêu trường chống bão gió giật cấp 12",
    col_4: "m2",
    col_5: "Ghi xám đậm",
    col_6: "2,950,000",
    col_7: "3,100,000"
  }
];

export default function AdminPriceQuote({ showToast }) {
  const [quotesList, setQuotesList] = useState([]);
  const [selectedQuoteCode, setSelectedQuoteCode] = useState(DEFAULT_PRICE_QUOTES[0].productCode);
  const [activeQuote, setActiveQuote] = useState(DEFAULT_PRICE_QUOTES[0]);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // { success: boolean, message: string }

  // STATE KHUNG FORM THÊM BẢNG GIÁ MỚI PHÍA DƯỚI
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newQuoteName, setNewQuoteName] = useState("Bảng giá cửa cuốn BossDoor 2026");
  const [newQuoteCode, setNewQuoteCode] = useState("BD-2026");
  const [newQuoteCategory, setNewQuoteCategory] = useState("cuacuon");
  const [newQuoteTitle, setNewQuoteTitle] = useState("Bảng giá cập nhật cửa cuốn BossDoor 2026 tại Đà Nẵng");
  const [newQuoteEffectiveDate, setNewQuoteEffectiveDate] = useState("Áp dụng từ năm 2026 cho đến khi có thông báo mới");

  // Grid builder: Các cột và các hàng (mặc định 7 cột, 7 hàng)
  const [gridColumns, setGridColumns] = useState(DEFAULT_7_COLUMNS);
  const [gridRows, setGridRows] = useState(createDefault7Rows);
  const [inputRowsCount, setInputRowsCount] = useState(7);
  const [inputColsCount, setInputColsCount] = useState(7);

  const createFormRef = useRef(null);

  // Tải ảnh từ máy local & Link ảnh (Active Quote & New Quote)
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const [newQuoteImage, setNewQuoteImage] = useState("");
  const [isUploadingNewImage, setIsUploadingNewImage] = useState(false);
  const newFileInputRef = useRef(null);

  // Load quotes from API or localStorage
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
    const curr = loaded.find((q) => q.productCode === selectedQuoteCode) || loaded[0];
    setSelectedQuoteCode(curr.productCode);
    setActiveQuote(JSON.parse(JSON.stringify(curr)));
    setLoading(false);
  };

  const handleSelectQuote = (quoteCode) => {
    const target = quotesList.find((q) => q.productCode === quoteCode);
    if (target) {
      setSelectedQuoteCode(target.productCode);
      setActiveQuote(JSON.parse(JSON.stringify(target)));
      setSaveStatus(null);
    }
  };

  // Toggle mở form thêm bảng giá
  const handleToggleCreateForm = () => {
    setShowCreateForm((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => {
          createFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
      return next;
    });
  };

  // Tự động tạo mã gợi ý khi gõ tên bảng giá
  const handleNewQuoteNameChange = (val) => {
    setNewQuoteName(val);
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
    if (autoCode && !newQuoteCode.startsWith("BD-")) {
      setNewQuoteCode(`BD-${autoCode}`);
    }
    setNewQuoteTitle(`Bảng giá cập nhật ${val.trim()} 2026 tại Đà Nẵng`);
  };

  // ================= GRID BUILDER ACTIONS (KHUNG 7 CỘT 7 HÀNG) =================
  // Tạo nhanh khung 7 cột x 7 hàng
  const handleResetTo7x7 = () => {
    setGridColumns(DEFAULT_7_COLUMNS);
    setGridRows(createDefault7Rows());
    setInputColsCount(7);
    setInputRowsCount(7);
    triggerToast("⚡ Đã tạo khung chuẩn 7 Cột x 7 Hàng sẵn sàng điền giá và thông tin!");
  };

  // Áp dụng số cột x số hàng tùy biến (ví dụ người dùng nhập 5 hàng x 6 cột, hoặc 8 hàng x 7 cột...)
  const handleApplyCustomGridSize = () => {
    const rowsNum = Math.max(1, Math.min(50, parseInt(inputRowsCount, 10) || 7));
    const colsNum = Math.max(2, Math.min(15, parseInt(inputColsCount, 10) || 7));

    // 1. Tạo hoặc điều chỉnh cột
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

    // 2. Tạo hoặc điều chỉnh hàng
    let newRows = [...gridRows];
    if (rowsNum > newRows.length) {
      for (let r = newRows.length + 1; r <= rowsNum; r++) {
        const rowObj = {};
        newCols.forEach((col, cIdx) => {
          if (cIdx === 0) rowObj[col.id] = String(r);
          else if (cIdx === 1) rowObj[col.id] = `SP-${String(r).padStart(2, "0")}`;
          else if (cIdx === 2) rowObj[col.id] = `Quy cách dòng sản phẩm số ${r}`;
          else if (cIdx === 3) rowObj[col.id] = "m2";
          else if (cIdx === 4) rowObj[col.id] = "Theo tiêu chuẩn";
          else if (cIdx === 5) rowObj[col.id] = "Liên hệ";
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

  // Thêm 1 hàng mới
  const handleAddGridRow = () => {
    setGridRows((prev) => {
      const nextStt = prev.length + 1;
      const newRow = {};
      gridColumns.forEach((col, idx) => {
        if (idx === 0) newRow[col.id] = String(nextStt);
        else if (idx === 1) newRow[col.id] = `SP-${String(nextStt).padStart(2, "0")}`;
        else if (idx === 2) newRow[col.id] = `Dòng sản phẩm mới số ${nextStt}`;
        else if (idx === 3) newRow[col.id] = "m2";
        else if (idx === 4) newRow[col.id] = "Ghi sáng, Vàng kem";
        else if (idx === 5) newRow[col.id] = "1,500,000";
        else newRow[col.id] = "";
      });
      return [...prev, newRow];
    });
    setInputRowsCount((prev) => prev + 1);
  };

  // Xóa 1 hàng
  const handleDeleteGridRow = (rowIdx) => {
    setGridRows((prev) => {
      const filtered = prev.filter((_, idx) => idx !== rowIdx);
      // Tự động đánh lại STT cột đầu nếu có
      if (gridColumns[0]) {
        filtered.forEach((r, idx) => {
          r[gridColumns[0].id] = String(idx + 1);
        });
      }
      return filtered;
    });
    setInputRowsCount((prev) => Math.max(1, prev - 1));
  };

  // Thêm 1 cột mới
  const handleAddGridCol = () => {
    const nextColNum = gridColumns.length + 1;
    const newColId = `col_${Date.now()}_${nextColNum}`;
    const newCol = {
      id: newColId,
      key: newColId,
      label: `Cột mới ${nextColNum}`,
      width: "130px"
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

  // Xóa 1 cột
  const handleDeleteGridCol = (colIdx) => {
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

  // Đổi tên tiêu đề cột
  const handleUpdateColLabel = (colIdx, newLabel) => {
    setGridColumns((prev) => {
      const updated = [...prev];
      updated[colIdx] = { ...updated[colIdx], label: newLabel };
      return updated;
    });
  };

  // Gõ giá trị vào từng ô (Cell)
  const handleGridCellChange = (rowIdx, colId, value) => {
    setGridRows((prev) => {
      const updated = [...prev];
      updated[rowIdx] = { ...updated[rowIdx], [colId]: value };
      return updated;
    });
  };

  // ================= XÁC NHẬN TẠO VÀ LƯU BẢNG BÁO GIÁ MỚI =================
  const handleSaveNewQuote = async () => {
    if (!newQuoteName || !newQuoteName.trim()) {
      alert("Vui lòng điền tên bảng giá!");
      return;
    }
    const code = (newQuoteCode || "BD-NEW").trim().toUpperCase();
    if (quotesList.some((q) => q.productCode.toUpperCase() === code)) {
      alert(`Mã bảng giá "${code}" đã tồn tại! Vui lòng chọn mã khác.`);
      return;
    }

    setLoading(true);

    // Chuyển đổi dữ liệu 7 cột x 7 hàng sang cấu trúc items chuẩn
    const formattedItems = gridRows.map((row, rIdx) => {
      const sttVal = row[gridColumns[0]?.id] || rIdx + 1;
      const codeVal = row[gridColumns[1]?.id] || `${code}-${rIdx + 1}`;
      const nameVal = row[gridColumns[2]?.id] || `Dòng sản phẩm ${rIdx + 1}`;
      const unitVal = row[gridColumns[3]?.id] || "m2";
      const colorsVal = row[gridColumns[4]?.id] || "Theo tiêu chuẩn";
      const price1Val = row[gridColumns[5]?.id] || "Liên hệ";
      const price2Val = row[gridColumns[6]?.id] || price1Val;
      const price3Val = gridColumns[7] ? row[gridColumns[7]?.id] : price2Val;

      return {
        stt: isNaN(Number(sttVal)) ? rIdx + 1 : Number(sttVal),
        code: String(codeVal).trim(),
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

    const newQuoteObj = {
      productCode: code,
      productTitle: newQuoteName.trim(),
      category: newQuoteCategory,
      title: newQuoteTitle.trim() || `Bảng giá cập nhật ${newQuoteName.trim()} 2026 tại Đà Nẵng`,
      effectiveDate: newQuoteEffectiveDate.trim() || "Áp dụng từ năm 2026 cho đến khi có thông báo mới",
      image: newQuoteImage || "",
      imageUrl: newQuoteImage || "",
      customColumns: gridColumns.map((c) => ({ id: c.id, label: c.label })),
      items: formattedItems,
      addons: [
        { category: "Phụ kiện đi kèm", name: "Bộ phụ kiện chính hãng đồng bộ", price: "Đồng bộ", unit: "bộ" },
        { category: "Ray inox & khóa", name: "Ray Inox đặc chìm âm nền", price: "+ 280.000 đồng/md", unit: "md" },
        { category: "Khóa cơ an toàn", name: "Chốt khóa tự động chống cạy phá", price: "+ 350.000 đồng/bộ", unit: "bộ" }
      ],
      policies: {
        included: "Đã bao gồm: Thân cửa theo quy cách kỹ thuật, sơn tĩnh điện bảo hành 10 năm, công khảo sát đo đạc thực tế tại công trình.",
        excluded: "Chưa bao gồm: Chi phí vận chuyển & nhân công lắp đặt hoàn thiện (thường 10 – 20%), thuế VAT 10% (nếu có).",
        conditionNote: "Miễn phí 100% khảo sát và tư vấn tận nơi tại tất cả quận huyện Đà Nẵng.",
        warrantyNote: "Thân cửa bảo hành 5 – 10 năm. Động cơ mô tơ bảo hành 2 – 5 năm 1 đổi 1.",
        commitmentNote: "BossDoor Đà Nẵng cam kết giá tốt nhất, minh bạch 100%, không phát sinh phụ phí ngoài hợp đồng."
      }
    };

    try {
      // 1. Lưu vào MongoDB Backend nếu có
      if (import.meta.env.VITE_API_URL) {
        try {
          await fetch(`${import.meta.env.VITE_API_URL}/api/price-quotes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newQuoteObj)
          });
        } catch (e) {
          console.log("Could not save new quote to backend API, will save locally:", e.message);
        }
      }

      // 2. Lưu vào localStorage và state
      const updatedList = [newQuoteObj, ...quotesList];
      setQuotesList(updatedList);
      setSelectedQuoteCode(code);
      setActiveQuote(newQuoteObj);
      localStorage.setItem("boss_admin_price_quotes", JSON.stringify(updatedList));

      setShowCreateForm(false);
      triggerToast(`🎉 Đã tạo và lưu thành công bảng giá: "${newQuoteName}" (${formattedItems.length} dòng sản phẩm)!`);
    } catch (err) {
      console.error("Save new quote error:", err);
      triggerToast("Đã lưu bảng giá vào bộ nhớ hệ thống!", true);
    } finally {
      setLoading(false);
    }
  };

  // ================= XÓA BẢNG GIÁ ĐANG CHỌN =================
  const handleDeleteActiveQuote = async () => {
    if (!activeQuote) return;
    if (quotesList.length <= 1) {
      alert("Hệ thống cần giữ lại tối thiểu 1 bảng giá!");
      return;
    }
    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn XÓA VĨNH VIỄN bảng giá "${activeQuote.productTitle || activeQuote.productCode}" khỏi hệ thống?`
    );
    if (!confirmDelete) return;

    setLoading(true);
    const codeToDelete = activeQuote.productCode;
    const remaining = quotesList.filter((q) => q.productCode !== codeToDelete);

    if (import.meta.env.VITE_API_URL && activeQuote._id) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/price-quotes/${activeQuote._id}`, {
          method: "DELETE"
        });
      } catch (e) {}
    }

    setQuotesList(remaining);
    localStorage.setItem("boss_admin_price_quotes", JSON.stringify(remaining));
    const nextActive = remaining[0];
    setSelectedQuoteCode(nextActive.productCode);
    setActiveQuote(JSON.parse(JSON.stringify(nextActive)));
    triggerToast(`Đã xóa bảng giá "${codeToDelete}" thành công!`);
    setLoading(false);
  };

  // Field change on active quote
  const handleMetaChange = (field, value) => {
    setActiveQuote((prev) => ({ ...prev, [field]: value }));
  };

  // Upload ảnh trực tiếp từ máy local cho Bảng giá đang chọn
  const handleImageUpload = async (e) => {
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
            const finalUrl = data.url.startsWith("http") || data.url.startsWith("data:")
              ? data.url
              : `${backendBase}${data.url}`;
            setActiveQuote((prev) => ({ ...prev, image: finalUrl, imageUrl: finalUrl }));
            triggerToast("✨ Đã tải ảnh lên thành công!", true);
            setIsUploadingImage(false);
            return;
          }
        }
      } catch (uploadErr) {
        console.warn("Upload API failed, fallback to FileReader Base64:", uploadErr);
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target.result;
        setActiveQuote((prev) => ({ ...prev, image: base64Data, imageUrl: base64Data }));
        triggerToast("✨ Đã tải ảnh từ máy tính thành công!", true);
        setIsUploadingImage(false);
      };
      reader.onerror = () => {
        triggerToast("❌ Không thể đọc file ảnh từ máy tính!", false);
        setIsUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Image upload error:", err);
      triggerToast("❌ Lỗi khi chọn ảnh!", false);
      setIsUploadingImage(false);
    } finally {
      if (e.target) e.target.value = "";
    }
  };

  // Upload ảnh cho Form Thêm bảng giá mới
  const handleNewQuoteImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      triggerToast("⚠️ Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WEBP)!", false);
      return;
    }

    setIsUploadingNewImage(true);
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
            const finalUrl = data.url.startsWith("http") || data.url.startsWith("data:")
              ? data.url
              : `${backendBase}${data.url}`;
            setNewQuoteImage(finalUrl);
            triggerToast("✨ Đã tải ảnh lên thành công!", true);
            setIsUploadingNewImage(false);
            return;
          }
        }
      } catch (uploadErr) {
        console.warn("Upload API failed, fallback to FileReader Base64:", uploadErr);
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setNewQuoteImage(event.target.result);
        triggerToast("✨ Đã tải ảnh từ máy tính thành công!", true);
        setIsUploadingNewImage(false);
      };
      reader.onerror = () => {
        triggerToast("❌ Không thể đọc file ảnh từ máy tính!", false);
        setIsUploadingNewImage(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("New quote image upload error:", err);
      triggerToast("❌ Lỗi khi chọn ảnh!", false);
      setIsUploadingNewImage(false);
    } finally {
      if (e.target) e.target.value = "";
    }
  };

  const handlePolicyChange = (field, value) => {
    setActiveQuote((prev) => ({
      ...prev,
      policies: {
        ...(prev.policies || {}),
        [field]: value
      }
    }));
  };

  // ITEMS (TABLE ROWS IN ACTIVE QUOTE)
  const handleItemChange = (index, field, value) => {
    setActiveQuote((prev) => {
      const newItems = [...(prev.items || [])];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  const handleAddItem = () => {
    setActiveQuote((prev) => {
      const items = prev.items || [];
      const nextStt = items.length + 1;
      const newItem = {
        stt: nextStt,
        code: `${prev.productCode || "SP"}-${nextStt}`,
        name: `Dòng sản phẩm mới số ${nextStt}`,
        description: "- Chi tiết cấu tạo...\n- Độ dày...\n- Sơn tĩnh điện AkzoNobel...",
        unit: "m2",
        colors: "Ghi sáng, Vàng kem, Cà phê",
        priceOver8: "1,200,000",
        price6to8: "1,250,000",
        price4to6: "1,300,000",
        note: ""
      };
      return { ...prev, items: [...items, newItem] };
    });
  };

  const handleDeleteItem = (index) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa dòng sản phẩm này khỏi bảng giá?")) {
      setActiveQuote((prev) => {
        const newItems = (prev.items || []).filter((_, i) => i !== index);
        newItems.forEach((it, idx) => {
          it.stt = idx + 1;
        });
        return { ...prev, items: newItems };
      });
    }
  };

  // ADDONS
  const handleAddonChange = (index, field, value) => {
    setActiveQuote((prev) => {
      const newAddons = [...(prev.addons || [])];
      newAddons[index] = { ...newAddons[index], [field]: value };
      return { ...prev, addons: newAddons };
    });
  };

  const handleAddNewAddon = () => {
    setActiveQuote((prev) => {
      const addons = prev.addons || [];
      const newAddon = {
        category: "Tùy chọn bổ sung",
        name: "Lựa chọn nâng cấp mới",
        price: "+ 100.000 đồng/md",
        unit: "md"
      };
      return { ...prev, addons: [...addons, newAddon] };
    });
  };

  const handleDeleteAddon = (index) => {
    setActiveQuote((prev) => ({
      ...prev,
      addons: (prev.addons || []).filter((_, i) => i !== index)
    }));
  };

  // SAVE ACTIVE QUOTE
  const handleSaveActiveQuote = async () => {
    setLoading(true);
    setSaveStatus(null);

    try {
      let success = false;
      let message = "Đã lưu bảng báo giá thành công!";

      if (import.meta.env.VITE_API_URL) {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/price-quotes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(activeQuote)
        });
        const json = await res.json();
        if (json.success) {
          success = true;
          message = json.message || message;
        }
      } else {
        success = true;
      }

      const updatedList = quotesList.map((q) =>
        q.productCode === activeQuote.productCode ? activeQuote : q
      );
      if (!updatedList.some((q) => q.productCode === activeQuote.productCode)) {
        updatedList.push(activeQuote);
      }
      setQuotesList(updatedList);
      localStorage.setItem("boss_admin_price_quotes", JSON.stringify(updatedList));

      triggerToast(message, true);
    } catch (err) {
      console.error("Save price quote error:", err);
      const updatedList = quotesList.map((q) =>
        q.productCode === activeQuote.productCode ? activeQuote : q
      );
      setQuotesList(updatedList);
      localStorage.setItem("boss_admin_price_quotes", JSON.stringify(updatedList));

      triggerToast("✨ Đã lưu bảng báo giá thành công (Lưu trữ bộ nhớ an toàn)!", true);
    } finally {
      setLoading(false);
    }
  };

  // RESET TO DEFAULT SEED
  const handleResetDefaults = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn khôi phục bảng giá mẫu kỹ thuật từ bản chuẩn gốc của hệ thống?")) {
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
    setSelectedQuoteCode(DEFAULT_PRICE_QUOTES[0].productCode);
    setActiveQuote(JSON.parse(JSON.stringify(DEFAULT_PRICE_QUOTES[0])));
    triggerToast("🎉 Đã khôi phục toàn bộ bảng giá mẫu gốc thành công!");
    setLoading(false);
  };

  return (
    <div className="admin-price-quote-wrapper">
      {/* 1. HEADER CHÍNH */}
      <div className="quote-admin-header">
        <div className="header-text-col">
          <div className="header-tag-badge">
            <FileSpreadsheet size={14} /> QUẢN TRỊ BÁO GIÁ
          </div>
          <h2>Quản Lý Báo Giá Kỹ Thuật Từng Dòng Cửa</h2>
          <p>
            Tạo và chỉnh sửa các bảng giá kỹ thuật phân tầng theo diện tích (&gt;8m², ≤8m²), tùy biến số hàng số cột linh hoạt, cấu hình bảng giá phụ kiện và ghi chú chính sách.
          </p>
        </div>
        <div className="header-actions-row">
          {quotesList.length > 1 && (
            <div className="header-quote-switcher">
              <label>Bảng giá:</label>
              <select
                value={selectedQuoteCode}
                onChange={(e) => handleSelectQuote(e.target.value)}
                className="header-quote-dropdown"
              >
                {quotesList.map((q) => (
                  <option key={q.productCode} value={q.productCode}>
                    {q.productTitle || q.productCode}
                  </option>
                ))}
              </select>
            </div>
          )}
          <button
            type="button"
            className={`btn-action-primary ${showCreateForm ? "btn-close-mode" : ""}`}
            onClick={handleToggleCreateForm}
          >
            {showCreateForm ? <X size={16} /> : <Plus size={16} />}
            <span>{showCreateForm ? "Đóng Khung Thêm Bảng Giá" : "Thêm Bảng Giá Mới"}</span>
          </button>
          <button type="button" className="btn-action-outline" onClick={handleResetDefaults}>
            <RotateCcw size={16} /> Khôi Phục Bản Gốc
          </button>
        </div>
      </div>

      {/* STATUS TOAST ALERT */}
      {saveStatus && (
        <div className={`quote-save-alert ${saveStatus.success ? "success" : "error"}`}>
          {saveStatus.success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{saveStatus.message}</span>
          <button type="button" className="btn-close-toast" onClick={() => setSaveStatus(null)}>✕</button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. KHUNG TẠO BẢNG GIÁ MỚI (HIỆN NGAY BÊN DƯỚI NÚT THEO YÊU CẦU CỦA USER) */}
      {/* ========================================================================= */}
      {showCreateForm && (
        <section ref={createFormRef} className="new-quote-builder-card">
          <div className="builder-card-topbar">
            <div className="builder-card-title">
              <Sparkles size={20} className="gold-icon" />
              <div>
                <h3>THÊM BẢNG BÁO GIÁ MỚI VÀO HỆ THỐNG</h3>
                <span className="builder-sub-note">
                  Điền tên bảng giá, thiết lập khung số cột x số hàng (ví dụ 7 cột x 7 hàng) và nhập trực tiếp giá cùng thông tin.
                </span>
              </div>
            </div>
            <button
              type="button"
              className="btn-cancel-builder-x"
              onClick={() => setShowCreateForm(false)}
              title="Đóng form tạo mới"
            >
              <X size={18} />
            </button>
          </div>

          <div className="builder-card-body">
            {/* PHẦN 1: THÔNG TIN BẢNG GIÁ & HÌNH ẢNH */}
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
                    value={newQuoteName}
                    onChange={(e) => handleNewQuoteNameChange(e.target.value)}
                    placeholder="Ví dụ: Bảng giá Cửa cuốn BossDoor Luxury 2026, Cửa kéo công nghệ Đức..."
                    required
                  />
                </div>

                <div className="form-field full-width quote-image-field-wrap">
                  <label>Hình ảnh bảng giá (Link ảnh hoặc tải từ máy local):</label>
                  <div className="quote-image-controls-row">
                    <div className="quote-image-url-box">
                      <input
                        type="text"
                        className="image-url-input"
                        value={newQuoteImage}
                        onChange={(e) => setNewQuoteImage(e.target.value)}
                        placeholder="Dán link ảnh trực tiếp (https://... hoặc /project_1.png)..."
                      />
                    </div>

                    <input
                      type="file"
                      ref={newFileInputRef}
                      onChange={handleNewQuoteImageUpload}
                      accept="image/*"
                      style={{ display: "none" }}
                    />

                    <button
                      type="button"
                      className="btn-upload-local-img"
                      onClick={() => newFileInputRef.current?.click()}
                      disabled={isUploadingNewImage}
                    >
                      {isUploadingNewImage ? (
                        <>
                          <Loader2 size={16} className="spin-icon" /> Đang tải ảnh...
                        </>
                      ) : (
                        <>
                          <Upload size={16} /> Tải ảnh từ máy local
                        </>
                      )}
                    </button>
                  </div>

                  {newQuoteImage && (
                    <div className="quote-image-preview-card">
                      <div className="quote-img-thumb-wrap">
                        <img
                          src={newQuoteImage}
                          alt="Ảnh bảng giá mới"
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
                          onClick={() => setNewQuoteImage("")}
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

            {/* PHẦN 2: KHUNG ĐIỀN GIÁ VÀ THÔNG TIN (MA TRẬN 7 CỘT X 7 HÀNG LINH HOẠT) */}
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

                {/* Thanh điều khiển kích thước khung bảng */}
                <div className="grid-dimension-controls">
                  <button
                    type="button"
                    className="btn-preset-7x7"
                    onClick={handleResetTo7x7}
                    title="Khởi tạo chuẩn 7 Cột x 7 Hàng có sẵn mẫu"
                  >
                    <Sparkles size={14} /> Khung Chuẩn 7 Cột × 7 Hàng
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

              {/* Hướng dẫn thao tác bảng */}
              <div className="matrix-quick-hint">
                <Info size={15} />
                <span>
                  Bạn có thể <strong>bấm vào tiêu đề từng cột để đổi tên cột</strong>, gõ trực tiếp giá và thông tin vào các ô, hoặc bấm <strong>+ Thêm hàng</strong> / <strong>+ Thêm cột</strong> bất cứ lúc nào.
                </span>
              </div>

              {/* BẢNG SPREADSHEET ĐIỀN THÔNG TIN TRỰC TIẾP */}
              <div className="admin-table-scroll-wrapper spreadsheet-wrapper">
                <table className="admin-quote-data-table spreadsheet-table">
                  <thead>
                    <tr>
                      <th style={{ width: "42px", textAlign: "center" }}>#</th>
                      {gridColumns.map((col, cIdx) => (
                        <th key={col.id} style={{ minWidth: col.width || "130px" }}>
                          <div className="col-header-interactive">
                            <input
                              type="text"
                              value={col.label}
                              onChange={(e) => handleUpdateColLabel(cIdx, e.target.value)}
                              className="col-label-input"
                              title="Bấm để đổi tên cột"
                            />
                            {gridColumns.length > 2 && (
                              <button
                                type="button"
                                className="btn-del-col-x"
                                onClick={() => handleDeleteGridCol(cIdx)}
                                title={`Xóa cột "${col.label}"`}
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </th>
                      ))}
                      <th style={{ width: "45px", textAlign: "center" }}>Xóa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gridRows.map((row, rIdx) => (
                      <tr key={`r-${rIdx}`}>
                        <td className="row-num-cell font-bold text-center">
                          {rIdx + 1}
                        </td>
                        {gridColumns.map((col) => {
                          const isCode = col.key === "code" || col.id === "col_2";
                          const isNameOrDesc = col.key === "name" || col.id === "col_3";
                          const isPrice = col.key?.includes("price") || col.id === "col_6" || col.id === "col_7";

                          return (
                            <td key={`${col.id}-${rIdx}`} className="spreadsheet-cell">
                              {isNameOrDesc ? (
                                <textarea
                                  rows={2}
                                  className="table-textarea cell-content"
                                  value={row[col.id] || ""}
                                  onChange={(e) => handleGridCellChange(rIdx, col.id, e.target.value)}
                                  placeholder="Nhập tên, quy cách..."
                                />
                              ) : (
                                <input
                                  type="text"
                                  className={`table-input cell-content ${isCode ? "bold-code" : ""} ${isPrice ? "price-input" : ""}`}
                                  value={row[col.id] || ""}
                                  onChange={(e) => handleGridCellChange(rIdx, col.id, e.target.value)}
                                  placeholder={isPrice ? "1,200,000" : isCode ? "Mã SP" : "..."}
                                />
                              )}
                            </td>
                          );
                        })}
                        <td className="text-center">
                          <button
                            type="button"
                            className="btn-trash-row"
                            onClick={() => handleDeleteGridRow(rIdx)}
                            title={`Xóa hàng ${rIdx + 1}`}
                          >
                            <Trash2 size={15} />
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
                  onClick={handleAddGridRow}
                >
                  <Plus size={15} /> Thêm 1 Hàng Mới
                </button>
                <button
                  type="button"
                  className="btn-append-col"
                  onClick={handleAddGridCol}
                >
                  <Plus size={15} /> Thêm 1 Cột Mới
                </button>
              </div>
            </div>

            {/* THANH NÚT LƯU BẢNG BÁO GIÁ */}
            <div className="builder-action-footer">
              <button
                type="button"
                className="btn-submit-new-quote"
                onClick={handleSaveNewQuote}
                disabled={loading}
              >
                <Check size={18} />
                <span>{loading ? "Đang xử lý..." : "XÁC NHẬN TẠO & LƯU BẢNG BÁO GIÁ"}</span>
              </button>

              <button
                type="button"
                className="btn-cancel-builder"
                onClick={() => setShowCreateForm(false)}
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 3. TRÌNH CHỈNH SỬA CHI TIẾT BẢNG GIÁ ĐANG CHỌN (ACTIVE QUOTE) */}
      {/* ========================================================================= */}
      {activeQuote && (
        <div className="quote-editor-card">
          {/* 1. BẢNG GIÁ SẢN PHẨM KỸ THUẬT */}
          <div className="editor-section-box">
            <div className="section-header-row">
              <div>
                <h3 className="section-title mb-0">
                  <Tag size={18} /> Bảng Giá Sản Phẩm Kỹ Thuật (Phân Tầng Theo Diện Tích)
                </h3>
                <span className="section-sub-info">
                  Số lượng dòng hiện tại: <strong>{activeQuote.items?.length || 0} dòng</strong>
                </span>
              </div>
              <div className="section-header-actions">
                <button type="button" className="btn-add-row" onClick={handleAddItem}>
                  <Plus size={15} /> Thêm Dòng Sản Phẩm
                </button>
                <button
                  type="button"
                  className="btn-delete-this-quote"
                  onClick={handleDeleteActiveQuote}
                  title="Xóa vĩnh viễn bảng giá này khỏi hệ thống"
                >
                  <Trash2 size={15} /> Xóa Bảng Giá Này
                </button>
              </div>
            </div>

            <div className="admin-table-scroll-wrapper">
              <table className="admin-quote-data-table">
                <thead>
                  <tr>
                    <th style={{ width: "42px", textAlign: "center" }}>STT</th>
                    <th style={{ width: "95px" }}>Mã SP</th>
                    <th style={{ minWidth: "260px" }}>Diễn giải (Cấu tạo, độ dày, sơn phủ)</th>
                    <th style={{ width: "65px", textAlign: "center" }}>ĐVT</th>
                    <th style={{ minWidth: "160px" }}>Màu sắc</th>
                    <th style={{ minWidth: "125px" }}>Đơn giá (&gt; 8m²)</th>
                    <th style={{ minWidth: "125px" }}>Đơn giá (6 - &lt; 8m²)</th>
                    <th style={{ minWidth: "125px" }}>Đơn giá (4 - &lt; 6m²)</th>
                    <th style={{ width: "50px", textAlign: "center" }}>Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {(activeQuote.items || []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="text-center font-bold">{row.stt || idx + 1}</td>
                      <td>
                        <input
                          type="text"
                          className="table-input bold-code"
                          value={row.code || ""}
                          onChange={(e) => handleItemChange(idx, "code", e.target.value)}
                          placeholder="SR3, VIP, BD-01..."
                        />
                      </td>
                      <td>
                        <textarea
                          rows={3}
                          className="table-textarea"
                          value={row.description || row.name || ""}
                          onChange={(e) => {
                            handleItemChange(idx, "description", e.target.value);
                            handleItemChange(idx, "name", e.target.value.split("\n")[0]);
                          }}
                          placeholder="Mô tả chi tiết kỹ thuật, độ dày nan, sơn tĩnh điện..."
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="table-input text-center"
                          value={row.unit || "m2"}
                          onChange={(e) => handleItemChange(idx, "unit", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="table-input"
                          value={row.colors || ""}
                          onChange={(e) => handleItemChange(idx, "colors", e.target.value)}
                          placeholder="Ghi sáng, vàng kem..."
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="table-input price-input"
                          value={row.priceOver8 || ""}
                          onChange={(e) => handleItemChange(idx, "priceOver8", e.target.value)}
                          placeholder="1,200,000"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="table-input price-input"
                          value={row.price6to8 || ""}
                          onChange={(e) => handleItemChange(idx, "price6to8", e.target.value)}
                          placeholder="1,250,000"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="table-input price-input"
                          value={row.price4to6 || ""}
                          onChange={(e) => handleItemChange(idx, "price4to6", e.target.value)}
                          placeholder="1,300,000"
                        />
                      </td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn-trash-row"
                          onClick={() => handleDeleteItem(idx)}
                          title="Xóa dòng này"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="table-bottom-action-row">
              <button type="button" className="btn-add-row" onClick={handleAddItem}>
                <Plus size={15} /> Thêm Dòng Sản Phẩm Mới Vào Bảng Này
              </button>
            </div>
          </div>

          {/* 3. LỰA CHỌN THÊM (ADD-ONS) */}
          <div className="editor-section-box">
            <div className="section-header-row">
              <h3 className="section-title mb-0">
                <Plus size={18} /> Khu Vực "LỰA CHỌN THÊM" (Phụ Kiện &amp; Nâng Cấp)
              </h3>
              <button type="button" className="btn-add-row" onClick={handleAddNewAddon}>
                <Plus size={15} /> Thêm Lựa Chọn Phụ Kiện
              </button>
            </div>

            <div className="addons-editor-list">
              {(activeQuote.addons || []).map((addon, aIdx) => (
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

          {/* 4. GHI CHÚ VÀ CHÍNH SÁCH GIÁ */}
          <div className="editor-section-box">
            <h3 className="section-title">
              <HelpCircle size={18} /> Ghi Chú Và Chính Sách Giá
            </h3>
            <div className="form-grid-2">
              <div className="form-field">
                <label>1. Giá đã bao gồm những hạng mục nào:</label>
                <textarea
                  rows={3}
                  value={activeQuote.policies?.included || ""}
                  onChange={(e) => handlePolicyChange("included", e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>2. Những chi phí chưa bao gồm (vận chuyển, lắp đặt...):</label>
                <textarea
                  rows={3}
                  value={activeQuote.policies?.excluded || ""}
                  onChange={(e) => handlePolicyChange("excluded", e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>3. Ghi chú điều kiện thi công &amp; kích thước:</label>
                <textarea
                  rows={3}
                  value={activeQuote.policies?.conditionNote || ""}
                  onChange={(e) => handlePolicyChange("conditionNote", e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>4. Chính sách bảo hành và hỗ trợ kỹ thuật:</label>
                <textarea
                  rows={3}
                  value={activeQuote.policies?.warrantyNote || ""}
                  onChange={(e) => handlePolicyChange("warrantyNote", e.target.value)}
                />
              </div>
              <div className="form-field span-2">
                <label>5. Cam kết báo giá minh bạch, cạnh tranh của Boss Đà Nẵng:</label>
                <textarea
                  rows={2}
                  value={activeQuote.policies?.commitmentNote || ""}
                  onChange={(e) => handlePolicyChange("commitmentNote", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* SAVE BUTTON BAR */}
          <div className="quote-editor-footer">
            <button
              className="btn-save-quote-primary"
              onClick={handleSaveActiveQuote}
              disabled={loading}
            >
              <Save size={18} />
              <span>{loading ? "Đang lưu bảng giá..." : "LƯU CẬP NHẬT BẢNG BÁO GIÁ NÀY"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
