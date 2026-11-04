import React, { useState, useEffect } from "react";
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
  Check
} from "lucide-react";
import { DEFAULT_PRICE_QUOTES } from "../data/defaultPriceQuotes";
import "./AdminPriceQuote.css";

export default function AdminPriceQuote() {
  const [quotesList, setQuotesList] = useState([]);
  const [selectedQuoteCode, setSelectedQuoteCode] = useState(DEFAULT_PRICE_QUOTES[0].productCode);
  const [activeQuote, setActiveQuote] = useState(DEFAULT_PRICE_QUOTES[0]);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // { success: boolean, message: string }

  // Load quotes from API or localStorage
  useEffect(() => {
    loadQuotes();
  }, []);

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

  // Field change on active quote
  const handleMetaChange = (field, value) => {
    setActiveQuote((prev) => ({ ...prev, [field]: value }));
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

  // ITEMS (TABLE ROWS)
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
        code: `NEW-${nextStt}`,
        name: `Dòng sản phẩm mới ${nextStt}`,
        description: "- Chi tiết cấu tạo...\n- Độ dày...\n- Sơn phủ...",
        unit: "m2",
        colors: "Ghi sáng, vàng kem, cà phê, xanh",
        priceOver8: "1,000,000",
        price6to8: "1,050,000",
        price4to6: "1,100,000",
        note: ""
      };
      return { ...prev, items: [...items, newItem] };
    });
  };

  const handleDeleteItem = (index) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa dòng sản phẩm này khỏi bảng giá?")) {
      setActiveQuote((prev) => {
        const newItems = (prev.items || []).filter((_, i) => i !== index);
        // Re-index stt
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

  // CREATE NEW QUOTE
  const handleCreateNewQuote = () => {
    const newCode = prompt("Nhập mã sản phẩm mới cho bảng báo giá (Ví dụ: BCE.5810, DL-75, BD-LUX, SR-NEW):");
    if (!newCode || !newCode.trim()) return;

    const formattedCode = newCode.trim().toUpperCase();
    if (quotesList.some((q) => q.productCode.toUpperCase() === formattedCode)) {
      alert("Mã bảng giá sản phẩm này đã tồn tại trong danh sách!");
      return;
    }

    const newQuote = {
      productCode: formattedCode,
      productTitle: `Bảng giá sản phẩm ${formattedCode}`,
      category: "cuacuon",
      title: `Bảng giá cập nhật sản phẩm ${formattedCode} 2026 tại Đà Nẵng`,
      effectiveDate: "Áp dụng từ năm 2026 cho đến khi có thông báo mới",
      items: [
        {
          stt: 1,
          code: formattedCode,
          name: `Sản phẩm ${formattedCode} chuẩn`,
          description: `- Thông số kỹ thuật độ dày...\n- Sơn AkzoNobel CHLB Đức.\n- Vận hành êm ái.`,
          unit: "m2",
          colors: "Ghi sáng, Vàng kem, Cà phê",
          priceOver8: "1,200,000",
          price6to8: "1,250,000",
          price4to6: "1,300,000",
          note: "Hàng sẵn có tại kho"
        }
      ],
      addons: [
        { category: "Phụ kiện đi kèm", name: "Bộ phụ kiện chính hãng", price: "Đồng bộ", unit: "bộ" }
      ],
      policies: {
        included: "Đã bao gồm: Thân cửa theo quy cách, công khảo sát đo đạc tại công trình.",
        excluded: "Chưa bao gồm: Chi phí vận chuyển & nhân công lắp đặt.",
        conditionNote: "Miễn phí khảo sát và báo giá trực tiếp tại Đà Nẵng.",
        warrantyNote: "Bảo hành chính hãng 5 năm.",
        commitmentNote: "BossDoor Đà Nẵng cam kết giá tốt nhất, minh bạch 100%."
      }
    };

    const updatedList = [newQuote, ...quotesList];
    setQuotesList(updatedList);
    setSelectedQuoteCode(formattedCode);
    setActiveQuote(newQuote);
    localStorage.setItem("boss_admin_price_quotes", JSON.stringify(updatedList));
  };

  // SAVE TO DATABASE & LOCALSTORAGE
  const handleSaveActiveQuote = async () => {
    setLoading(true);
    setSaveStatus(null);

    try {
      let success = false;
      let message = "Đã lưu bảng báo giá thành công!";

      // 1. Try saving to MongoDB Backend
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

      // 2. Save in localStorage
      const updatedList = quotesList.map((q) =>
        q.productCode === activeQuote.productCode ? activeQuote : q
      );
      if (!updatedList.some((q) => q.productCode === activeQuote.productCode)) {
        updatedList.push(activeQuote);
      }
      setQuotesList(updatedList);
      localStorage.setItem("boss_admin_price_quotes", JSON.stringify(updatedList));

      setSaveStatus({ success: true, message });
    } catch (err) {
      console.error("Save price quote error:", err);
      // Fallback save locally
      const updatedList = quotesList.map((q) =>
        q.productCode === activeQuote.productCode ? activeQuote : q
      );
      setQuotesList(updatedList);
      localStorage.setItem("boss_admin_price_quotes", JSON.stringify(updatedList));

      setSaveStatus({
        success: true,
        message: "✨ Đã lưu bảng báo giá thành công (Lưu trữ bộ nhớ an toàn)!"
      });
    } finally {
      setLoading(false);
    }
  };

  // RESET TO DEFAULT SEED
  const handleResetDefaults = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn khôi phục bảng giá mẫu kỹ thuật từ bản chuẩn (Cửa kéo Đức SR3, SR2, SR1, VIP...)?")) {
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
    setSaveStatus({ success: true, message: "🎉 Đã khôi phục toàn bộ bảng giá mẫu gốc thành công!" });
    setLoading(false);
  };

  return (
    <div className="admin-price-quote-wrapper">
      {/* HEADER */}
      <div className="quote-admin-header">
        <div>
          <h2>Quản Lý Bảng Báo Giá Kỹ Thuật Từng Sản Phẩm</h2>
          <p>
            Chỉnh sửa các cột STT, Mã SP, Diễn giải cấu tạo, ĐVT, Màu sắc, các mức giá theo diện tích (&gt;8m², 6-8m², 4-6m²), khu vực Lựa chọn thêm và ghi chú chính sách.
          </p>
        </div>
        <div className="header-actions-row">
          <button className="btn-action-primary" onClick={handleCreateNewQuote}>
            <Plus size={16} /> Thêm Bảng Giá Sản Phẩm
          </button>
          <button className="btn-action-outline" onClick={handleResetDefaults}>
            <RotateCcw size={16} /> Khôi Phục Dữ Liệu Gốc
          </button>
        </div>
      </div>

      {/* STATUS TOAST */}
      {saveStatus && (
        <div className={`quote-save-alert ${saveStatus.success ? "success" : "error"}`}>
          {saveStatus.success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{saveStatus.message}</span>
        </div>
      )}

      {/* SELECT PRODUCT PRICE QUOTE TABS */}
      <div className="quote-selector-bar">
        <span className="selector-label">Chọn bảng giá sản phẩm để quản lý:</span>
        <div className="quote-tabs-scroll">
          {quotesList.map((q) => (
            <button
              key={q.productCode}
              className={`quote-tab-pill ${selectedQuoteCode === q.productCode ? "active" : ""}`}
              onClick={() => handleSelectQuote(q.productCode)}
            >
              <Tag size={13} /> {q.productCode}
            </button>
          ))}
        </div>
      </div>

      {activeQuote && (
        <div className="quote-editor-card">
          {/* 1. GENERAL META INFO */}
          <div className="editor-section-box">
            <h3 className="section-title">
              <FileSpreadsheet size={18} /> Thông Tin Chung Của Bảng Giá
            </h3>
            <div className="form-grid-3">
              <div className="form-field">
                <label>Mã sản phẩm (Code):</label>
                <input
                  type="text"
                  value={activeQuote.productCode || ""}
                  onChange={(e) => handleMetaChange("productCode", e.target.value.toUpperCase())}
                  required
                />
              </div>
              <div className="form-field">
                <label>Tên sản phẩm đại diện:</label>
                <input
                  type="text"
                  value={activeQuote.productTitle || ""}
                  onChange={(e) => handleMetaChange("productTitle", e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Danh mục sản phẩm:</label>
                <select
                  value={activeQuote.category || "cuakeo"}
                  onChange={(e) => handleMetaChange("category", e.target.value)}
                >
                  <option value="cuakeo">Cửa kéo</option>
                  <option value="cuacuon">Cửa cuốn</option>
                  <option value="phukien">Phụ kiện cửa</option>
                  <option value="cuatudong">Cổng & Cửa tự động</option>
                  <option value="nhomkinh">Nhôm kính</option>
                </select>
              </div>
              <div className="form-field span-2">
                <label>Tiêu đề bảng giá (Hiển thị đầu bảng):</label>
                <input
                  type="text"
                  value={activeQuote.title || ""}
                  onChange={(e) => handleMetaChange("title", e.target.value)}
                  placeholder="Ví dụ: Bảng giá cập nhật cửa kéo công nghệ Đức 2026 tại Đà Nẵng"
                />
              </div>
              <div className="form-field">
                <label>Thời gian áp dụng bảng giá:</label>
                <input
                  type="text"
                  value={activeQuote.effectiveDate || ""}
                  onChange={(e) => handleMetaChange("effectiveDate", e.target.value)}
                  placeholder="Ví dụ: Áp dụng từ năm 2026 cho đến khi có thông báo mới"
                />
              </div>
            </div>
          </div>

          {/* 2. MAIN TECHNICAL PRICING TABLE EDITOR */}
          <div className="editor-section-box">
            <div className="section-header-row">
              <h3 className="section-title">
                <Tag size={18} /> Bảng Giá Sản Phẩm Kỹ Thuật (Phân Tầng Theo Diện Tích)
              </h3>
              <button type="button" className="btn-add-row" onClick={handleAddItem}>
                <Plus size={15} /> Thêm Dòng Sản Phẩm
              </button>
            </div>

            <div className="admin-table-scroll-wrapper">
              <table className="admin-quote-data-table">
                <thead>
                  <tr>
                    <th style={{ width: "40px" }}>STT</th>
                    <th style={{ width: "90px" }}>Mã SP</th>
                    <th style={{ minWidth: "260px" }}>Diễn giải (Cấu tạo, độ dày, sơn phủ)</th>
                    <th style={{ width: "65px" }}>ĐVT</th>
                    <th style={{ minWidth: "160px" }}>Màu sắc</th>
                    <th style={{ minWidth: "120px" }}>Đơn giá (&gt; 8m²)</th>
                    <th style={{ minWidth: "120px" }}>Đơn giá (6 - &lt; 8m²)</th>
                    <th style={{ minWidth: "120px" }}>Đơn giá (4 - &lt; 6m²)</th>
                    <th style={{ width: "50px" }}>Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {(activeQuote.items || []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="text-center font-bold">{row.stt}</td>
                      <td>
                        <input
                          type="text"
                          className="table-input bold-code"
                          value={row.code || ""}
                          onChange={(e) => handleItemChange(idx, "code", e.target.value)}
                          placeholder="SR3, VIP..."
                        />
                      </td>
                      <td>
                        <textarea
                          rows={4}
                          className="table-textarea"
                          value={row.description || ""}
                          onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                          placeholder="Mô tả chi tiết kỹ thuật, xuống dòng bằng phím Enter..."
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
                          placeholder="980,000"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="table-input price-input"
                          value={row.price6to8 || ""}
                          onChange={(e) => handleItemChange(idx, "price6to8", e.target.value)}
                          placeholder="1,010,000"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="table-input price-input"
                          value={row.price4to6 || ""}
                          onChange={(e) => handleItemChange(idx, "price4to6", e.target.value)}
                          placeholder="1,030,000"
                        />
                      </td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn-trash-row"
                          onClick={() => handleDeleteItem(idx)}
                          title="Xóa dòng"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. LỰA CHỌN THÊM (ADD-ONS) */}
          <div className="editor-section-box">
            <div className="section-header-row">
              <h3 className="section-title">
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
              <span>{loading ? "Đang lưu bảng giá..." : "LƯU BẢNG BÁO GIÁ LÊN HỆ THỐNG"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

