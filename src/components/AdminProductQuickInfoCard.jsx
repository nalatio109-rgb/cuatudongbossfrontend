import React, { useState, useEffect } from "react";
import { 
  Package, ChevronDown, ChevronUp, Save, Loader2, Undo2, Upload, X, 
  Image as ImageIcon, Plus, Trash2, Star 
} from "lucide-react";
import { getProductCardDescription } from "../utils/productDescriptionHelper";
import { compressImage } from "../utils/imageCompressor";
import "./AdminProductQuickInfoCard.css";

const SUBCATEGORIES = {
  cuacuon: [
    "Cửa cuốn khe thoáng Đức",
    "Cửa cuốn Đài Loan",
    "Cửa cuốn tấm liền Úc",
    "Cửa cuốn song ngang - mắc võng",
    "Cửa cuốn cao cấp"
  ],
  phukien: [
    "Mô tơ cửa cuốn",
    "Bình lưu điện cửa cuốn",
    "Bộ điều khiển qua điện thoại",
    "Tay điều khiển, hộp điều khiển"
  ],
  cuakeo: [
    "Cửa kéo CN Đức",
    "Cửa kéo Đài Loan",
    "Cửa kéo không lá",
    "Cửa kéo Inox"
  ],
  cuatudong: [
    "Cổng tự động",
    "Cửa tự động",
    "Mái hiên, rèm che tự động",
    "Cửa kính lề sàn"
  ],
  nhomkinh: [
    "Cửa nhôm Xingfa",
    "Vách kính cường lực",
    "Cửa kính thủy lực"
  ]
};

export default function AdminProductQuickInfoCard({
  currentProductCode,
  onSelectProductCode,
  dbProducts = [],
  onSaveProduct,
  showToast
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    code: currentProductCode || "",
    category: "cuacuon",
    subCategory: "Cửa cuốn khe thoáng Đức",
    price: "",
    badge: "HOT",
    image: "",
    images: [],
    description: "",
    specs: ""
  });

  // Đồng bộ dữ liệu khi currentProductCode hoặc dbProducts thay đổi
  useEffect(() => {
    if (!currentProductCode && dbProducts.length > 0) {
      if (onSelectProductCode) onSelectProductCode(dbProducts[0].code);
      return;
    }

    const found = dbProducts.find(
      (p) => p.code?.toUpperCase() === currentProductCode?.toUpperCase()
    );

    if (found) {
      const initialImages = Array.isArray(found.images) && found.images.length > 0
        ? found.images
        : Array.isArray(found.gallery) && found.gallery.length > 0
          ? found.gallery
          : found.image
            ? [found.image]
            : [];

      setFormData({
        _id: found._id || "",
        title: found.title || "",
        code: found.code || currentProductCode,
        category: found.category || "cuacuon",
        subCategory: found.subCategory || SUBCATEGORIES[found.category || "cuacuon"]?.[0] || "",
        price: found.price || "",
        badge: found.badge || "",
        image: initialImages[0] || found.image || "",
        images: initialImages,
        description: found.description || "",
        specs: Array.isArray(found.specs) ? found.specs.join(", ") : (found.specs || "")
      });
      setUrlInput("");
    } else {
      const defaultImg = "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=800&q=80";
      setFormData({
        _id: "",
        title: `Sản phẩm ${currentProductCode || ""}`,
        code: currentProductCode || "",
        category: "cuacuon",
        subCategory: "Cửa cuốn khe thoáng Đức",
        price: "",
        badge: "",
        image: defaultImg,
        images: [defaultImg],
        description: "",
        specs: ""
      });
      setUrlInput("");
    }
  }, [currentProductCode, dbProducts]);

  const handleReset = () => {
    const found = dbProducts.find(
      (p) => p.code?.toUpperCase() === currentProductCode?.toUpperCase()
    );
    if (found) {
      const initialImages = Array.isArray(found.images) && found.images.length > 0
        ? found.images
        : Array.isArray(found.gallery) && found.gallery.length > 0
          ? found.gallery
          : found.image
            ? [found.image]
            : [];

      setFormData({
        _id: found._id || "",
        title: found.title || "",
        code: found.code || currentProductCode,
        category: found.category || "cuacuon",
        subCategory: found.subCategory || SUBCATEGORIES[found.category || "cuacuon"]?.[0] || "",
        price: found.price || "",
        badge: found.badge || "",
        image: initialImages[0] || found.image || "",
        images: initialImages,
        description: found.description || "",
        specs: Array.isArray(found.specs) ? found.specs.join(", ") : (found.specs || "")
      });
      setUrlInput("");
      if (showToast) showToast("↩️ Đã khôi phục dữ liệu ban đầu");
    }
  };

  // Thêm một hoặc nhiều link URL ảnh vào danh sách
  const handleAddUrl = () => {
    if (!urlInput.trim()) return;

    const rawUrls = urlInput
      .split(/[\n,\s]+/)
      .map((u) => u.trim())
      .filter((u) => u.length > 0 && (u.startsWith("http://") || u.startsWith("https://") || u.startsWith("/") || u.startsWith("data:")));

    if (rawUrls.length === 0) {
      if (showToast) showToast("⚠️ Vui lòng nhập đường dẫn URL ảnh hợp lệ (http://, https://...)");
      return;
    }

    setFormData((prev) => {
      const existing = Array.isArray(prev.images) ? [...prev.images] : (prev.image ? [prev.image] : []);
      const combined = [...existing];
      rawUrls.forEach((u) => {
        if (!combined.includes(u)) combined.push(u);
      });
      return {
        ...prev,
        images: combined,
        image: combined[0] || ""
      };
    });

    setUrlInput("");
    if (showToast) showToast(`✨ Đã thêm ${rawUrls.length} đường dẫn ảnh vào danh sách!`);
  };

  // Tải một hoặc nhiều ảnh từ máy tính hoặc điện thoại
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter((f) => f.type.startsWith("image/"));
    if (validFiles.length === 0) {
      if (showToast) showToast("⚠️ Vui lòng chọn tệp hình ảnh hợp lệ (JPG, PNG, WebP)!");
      return;
    }

    setIsUploadingImage(true);
    try {
      // Tự động nén tối ưu dung lượng ảnh trước khi gửi lên (giúp tải siêu nhanh & tiết kiệm bộ nhớ)
      const processedFiles = await Promise.all(validFiles.map((f) => compressImage(f)));

      const backendBase = import.meta.env.VITE_API_URL || "";
      const multipleUploadEndpoint = backendBase ? `${backendBase}/api/upload/multiple` : "/api/upload/multiple";
      const singleUploadEndpoint = backendBase ? `${backendBase}/api/upload` : "/api/upload";

      const uploadedUrls = [];

      // 1. Thử dùng endpoint tải nhiều ảnh nếu có từ 2 ảnh trở lên
      if (processedFiles.length > 1) {
        try {
          const multiFormData = new FormData();
          processedFiles.forEach((file) => multiFormData.append("images", file));
          const res = await fetch(multipleUploadEndpoint, {
            method: "POST",
            body: multiFormData
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.files)) {
              data.files.forEach((f) => {
                const finalUrl = f.url.startsWith("http") || f.url.startsWith("data:")
                  ? f.url
                  : `${backendBase}${f.url}`;
                uploadedUrls.push(finalUrl);
              });
            }
          }
        } catch (multiErr) {
          console.warn("Multiple upload endpoint failed, falling back to sequential:", multiErr);
        }
      }

      // 2. Nếu chưa upload được (hoặc chỉ có 1 file), upload tuần tự từng file
      if (uploadedUrls.length === 0) {
        for (const file of processedFiles) {
          try {
            const singleFormData = new FormData();
            singleFormData.append("image", file);
            const res = await fetch(singleUploadEndpoint, {
              method: "POST",
              body: singleFormData
            });
            if (res.ok) {
              const data = await res.json();
              if (data.success && data.url) {
                const finalUrl = data.url.startsWith("http") || data.url.startsWith("data:")
                  ? data.url
                  : `${backendBase}${data.url}`;
                uploadedUrls.push(finalUrl);
                continue;
              }
            }
          } catch (singleErr) {
            console.warn("Single upload failed, fallback to FileReader:", singleErr);
          }

          // Fallback: FileReader Base64
          await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                uploadedUrls.push(event.target.result);
              }
              resolve();
            };
            reader.onerror = () => resolve();
            reader.readAsDataURL(file);
          });
        }
      }

      if (uploadedUrls.length > 0) {
        setFormData((prev) => {
          const existing = Array.isArray(prev.images) ? [...prev.images] : (prev.image ? [prev.image] : []);
          const combined = [...existing];
          uploadedUrls.forEach((url) => {
            if (!combined.includes(url)) combined.push(url);
          });
          return {
            ...prev,
            images: combined,
            image: combined[0] || ""
          };
        });
        if (showToast) showToast(`🎉 Đã tải lên thành công ${uploadedUrls.length} hình ảnh!`);
      }
    } catch (err) {
      console.error("Multiple images upload error:", err);
      if (showToast) showToast("❌ Lỗi khi tải ảnh lên từ thiết bị!");
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  // Đặt làm ảnh đại diện chính (chuyển lên vị trí đầu tiên)
  const handleSetMainImage = (index) => {
    setFormData((prev) => {
      const currentList = Array.isArray(prev.images) ? [...prev.images] : (prev.image ? [prev.image] : []);
      if (index < 0 || index >= currentList.length) return prev;
      const targetImg = currentList.splice(index, 1)[0];
      currentList.unshift(targetImg);
      return {
        ...prev,
        images: currentList,
        image: currentList[0] || ""
      };
    });
    if (showToast) showToast("⭐ Đã chọn làm hình ảnh đại diện chính!");
  };

  // Xóa 1 ảnh khỏi danh sách
  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      const currentList = Array.isArray(prev.images) ? [...prev.images] : (prev.image ? [prev.image] : []);
      currentList.splice(index, 1);
      return {
        ...prev,
        images: currentList,
        image: currentList[0] || ""
      };
    });
    if (showToast) showToast("🗑️ Đã xóa hình ảnh khỏi danh sách");
  };

  // Xóa toàn bộ danh sách ảnh
  const handleClearAllImages = () => {
    setFormData((prev) => ({
      ...prev,
      images: [],
      image: ""
    }));
    setUrlInput("");
    if (showToast) showToast("🗑️ Đã xóa toàn bộ hình ảnh");
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.title?.trim() || !formData.code?.trim()) {
      if (showToast) showToast("⚠️ Vui lòng nhập Tên và Mã sản phẩm!");
      return;
    }

    setIsSaving(true);
    try {
      // Gộp các ảnh hiện có + url đang còn gõ dở trong ô nhập
      let currentImages = Array.isArray(formData.images) ? [...formData.images] : (formData.image ? [formData.image] : []);
      if (urlInput.trim()) {
        const extraUrls = urlInput
          .split(/[\n,\s]+/)
          .map((u) => u.trim())
          .filter((u) => u.length > 0 && (u.startsWith("http://") || u.startsWith("https://") || u.startsWith("/") || u.startsWith("data:")));
        extraUrls.forEach((u) => {
          if (!currentImages.includes(u)) currentImages.push(u);
        });
      }

      const primaryImage = currentImages[0] || formData.image || "";
      if (!primaryImage) {
        if (showToast) showToast("⚠️ Vui lòng thêm ít nhất 1 hình ảnh hoặc đường link ảnh sản phẩm!");
        setIsSaving(false);
        return;
      }

      const specsArray = typeof formData.specs === "string"
        ? formData.specs.split(",").map((s) => s.trim()).filter(Boolean)
        : formData.specs;

      const payload = {
        ...formData,
        image: primaryImage,
        images: currentImages,
        gallery: currentImages,
        specs: specsArray
      };

      // Tự động cập nhật mô tả tóm tắt từ bài viết nếu đang để trống hoặc chứa bản mẫu cũ
      if (!payload.description || payload.description.includes("là giải pháp tối ưu cho những ai đang tìm kiếm")) {
        const articleExcerpt = getProductCardDescription(formData);
        if (articleExcerpt) {
          payload.description = articleExcerpt;
        }
      }

      if (onSaveProduct) {
        const res = await onSaveProduct(payload);
        if (res && res.data && res.data._id) {
          setFormData((prev) => ({
            ...prev,
            _id: res.data._id,
            image: primaryImage,
            images: currentImages
          }));
        }
      }
      setUrlInput("");
    } catch (err) {
      console.error("Save product info card error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="product-quick-info-standalone-card">
      {/* HEADER CARD */}
      <div 
        className="quick-info-standalone-header"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="quick-info-standalone-title-group">
          <div className="quick-info-icon-wrapper">
            <Package size={20} className="quick-info-main-icon" />
          </div>
          <span className="quick-info-main-title">THÔNG TIN CƠ BẢN SẢN PHẨM</span>
          {formData.code && (
            <span className="quick-info-code-badge">
              MÃ: {formData.code}
            </span>
          )}
        </div>
        <button
          type="button"
          className="btn-quick-info-collapse"
          onClick={(e) => {
            e.stopPropagation();
            setIsCollapsed(!isCollapsed);
          }}
          title={isCollapsed ? "Mở rộng" : "Thu gọn"}
        >
          <span>{isCollapsed ? "Mở rộng" : "Thu gọn"}</span>
          {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>

      {/* BODY FORM */}
      {!isCollapsed && (
        <form className="quick-info-standalone-form" onSubmit={handleSubmit}>
          {/* TÊN SẢN PHẨM */}
          <div className="quick-info-form-group">
            <label>Tên sản phẩm *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Ví dụ: Cửa cuốn Bossdoor ECO BEC.5810"
            />
          </div>

          {/* GRID 3 CỘT: MÃ, DANH MỤC, LOẠI SP */}
          <div className="quick-info-form-grid-3">
            <div className="quick-info-form-group">
              <label>Mã sản phẩm *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
                placeholder="Mã: BD-999"
              />
            </div>

            <div className="quick-info-form-group">
              <label>Danh mục *</label>
              <select
                value={formData.category}
                onChange={(e) => {
                  const newCat = e.target.value;
                  setFormData({
                    ...formData,
                    category: newCat,
                    subCategory: SUBCATEGORIES[newCat]?.[0] || ""
                  });
                }}
              >
                <option value="cuacuon">Cửa Cuốn</option>
                <option value="phukien">Phụ Kiện Cửa Cuốn</option>
                <option value="cuakeo">Cửa Kéo</option>
                <option value="cuatudong">Cổng & Cửa Tự Động</option>
                <option value="nhomkinh">Nhôm Kính</option>
              </select>
            </div>

            <div className="quick-info-form-group">
              <label>Loại sản phẩm *</label>
              <select
                value={formData.subCategory}
                onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
              >
                {(SUBCATEGORIES[formData.category] || []).map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* GIÁ THAM KHẢO */}
          <div className="quick-info-form-group">
            <label>Giá tham khảo</label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="1.500.000đ/m2"
            />
          </div>

          {/* URL HÌNH ẢNH & TẢI NHIỀU ẢNH TỪ MÁY */}
          <div className="quick-info-form-group">
            <div className="quick-info-label-row">
              <label>Hình ảnh sản phẩm (Hỗ trợ nhiều ảnh & nhiều link URL) *</label>
              <span className="quick-info-label-hint">Dán link ảnh hoặc chọn từ máy / điện thoại</span>
            </div>
            
            <div className="image-input-upload-row">
              <div className="image-url-input-container">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddUrl();
                    }
                  }}
                  placeholder="Dán link ảnh (nhập nhiều link cách nhau bởi dấu phẩy hoặc Enter)..."
                  className="image-url-input"
                />
                <button
                  type="button"
                  className="btn-add-url-inline"
                  onClick={handleAddUrl}
                  disabled={!urlInput.trim()}
                  title="Thêm link này vào danh sách hình ảnh"
                >
                  <Plus size={15} />
                  <span>Thêm link</span>
                </button>
              </div>
              
              <label className={`btn-upload-device ${isUploadingImage ? "uploading" : ""}`}>
                {isUploadingImage ? (
                  <>
                    <Loader2 size={16} className="spin" />
                    <span>Đang tải...</span>
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    <span>Chọn ảnh từ máy</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={isUploadingImage}
                  style={{ display: "none" }}
                />
              </label>
            </div>

            {/* DANH SÁCH BỘ SƯU TẬP HÌNH ẢNH (MULTI-IMAGE GALLERY LIST) */}
            {formData.images && formData.images.length > 0 ? (
              <div className="quick-info-gallery-section">
                <div className="gallery-section-header">
                  <span className="gallery-count-badge">
                    <ImageIcon size={15} /> Danh sách hình ảnh ({formData.images.length} ảnh):
                  </span>
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      className="btn-gallery-clear-all"
                      onClick={handleClearAllImages}
                      title="Xóa tất cả hình ảnh"
                    >
                      <Trash2 size={13} /> Xóa tất cả
                    </button>
                  )}
                </div>

                <div className="gallery-grid-squares">
                  {formData.images.map((imgUrl, idx) => {
                    const isMain = idx === 0 || imgUrl === formData.image;
                    return (
                      <div
                        key={`${imgUrl}-${idx}`}
                        className={`gallery-square-card ${isMain ? "is-main" : ""}`}
                        title={isMain ? "⭐ Ảnh đại diện chính" : `Ảnh phụ #${idx + 1}`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Ảnh ${idx + 1}`}
                          className="gallery-square-img"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />

                        {/* Top Bar: Nhãn ảnh chính/số thứ tự & nút Xóa */}
                        <div className="gallery-square-top-bar">
                          {isMain ? (
                            <span className="square-badge-main" title="Ảnh đại diện chính của sản phẩm">
                              <Star size={11} fill="#fbbf24" color="#fbbf24" /> Chính
                            </span>
                          ) : (
                            <span className="square-badge-idx">#{idx + 1}</span>
                          )}

                          <button
                            type="button"
                            className="btn-square-delete"
                            onClick={() => handleRemoveImage(idx)}
                            title="Xóa ảnh này khỏi danh sách"
                          >
                            <X size={13} />
                          </button>
                        </div>

                        {/* Bottom Bar: Nút Đặt làm ảnh chính (cho các ảnh phụ) */}
                        {!isMain && (
                          <button
                            type="button"
                            className="btn-square-set-main"
                            onClick={() => handleSetMainImage(idx)}
                            title="Bấm để đặt làm ảnh đại diện chính của sản phẩm"
                          >
                            <Star size={11} />
                            <span>Làm ảnh chính</span>
                          </button>
                        )}
                      </div>
                    );
                  })}

                  {/* Ô vuông bấm thêm ảnh trực tiếp từ thiết bị */}
                  <label className="gallery-square-add-tile" title="Bấm để chọn thêm ảnh từ máy tính hoặc điện thoại">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={isUploadingImage}
                      style={{ display: "none" }}
                    />
                    {isUploadingImage ? (
                      <>
                        <Loader2 size={22} className="spin" />
                        <span>Đang tải...</span>
                      </>
                    ) : (
                      <>
                        <Plus size={24} />
                        <span>Thêm ảnh</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
            ) : (
              <div className="gallery-empty-hint">
                <ImageIcon size={18} />
                <span>Chưa có hình ảnh nào. Bạn có thể dán link URL hoặc bấm "Chọn ảnh từ máy" để thêm nhiều ảnh.</span>
              </div>
            )}
          </div>

          {/* THÔNG SỐ KỸ THUẬT */}
          <div className="quick-info-form-group">
            <label>Thông số kỹ thuật (phân cách bằng dấu phẩy)</label>
            <input
              type="text"
              value={formData.specs}
              onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
              placeholder="Hợp kim nhôm 6063-T5, Bảo hành 5 năm"
            />
          </div>

          {/* FOOTER ACTIONS */}
          <div className="quick-info-standalone-footer">
            <button
              type="button"
              className="btn-quick-info-cancel"
              onClick={handleReset}
              disabled={isSaving}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn-quick-info-save"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Lưu Sản Phẩm</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
