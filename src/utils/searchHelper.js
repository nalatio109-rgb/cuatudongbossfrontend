/**
 * searchHelper.js
 * Tiện ích tìm kiếm thông minh toàn diện cho Boss Đà Nẵng:
 * 1. Tìm kiếm không dấu & có dấu (tiếng Việt): "cua cuon" khớp "Cửa cuốn", "mo to" khớp "Mô tơ"
 * 2. Tìm kiếm đa từ khóa (Multi-token): "cửa cuốn 5810", "đức sr3", các từ nằm rời nhau vẫn khớp
 * 3. Bỏ qua dấu phân cách / ký tự đặc biệt: "bec5810", "bec 5810", "bec.5810", "sr-3", "sr3"
 * 4. Hỗ trợ tìm kiếm trên nhiều trường dữ liệu (mã code, tên, mô tả, thông số kỹ thuật, danh mục, v.v.)
 * 5. An toàn tuyệt đối với null/undefined, mảng chuỗi (specs, tags).
 */

/**
 * Loại bỏ dấu tiếng Việt chuẩn xác (xử lý cả chữ hoa, chữ thường và ký tự đ/Đ)
 */
export function removeVietnameseTones(str) {
  if (!str) return "";
  let s = String(str);
  // Tách tổ hợp dấu Unicode và xóa
  s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // Thay thế ký tự đ, Đ
  s = s.replace(/đ/g, "d").replace(/Đ/g, "D");
  return s;
}

/**
 * Chuẩn hóa một chuỗi: chuyển chữ thường, loại bỏ khoảng trắng thừa
 */
export function cleanForSearch(str) {
  if (!str) return "";
  return String(str).toLowerCase().trim();
}

/**
 * Kiểm tra xem `combinedText` có chứa TẤT CẢ các từ khóa trong `query` không.
 * Các từ khóa có thể xuất hiện ở bất kỳ vị trí nào, có dấu hay không dấu.
 */
export function matchKeywords(combinedText, query) {
  if (!query || typeof query !== "string") return true;
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return true;

  // Tách query thành các từ đơn (tokens)
  const tokens = trimmedQuery.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;

  // Chuẩn bị văn bản mục tiêu ở 3 dạng:
  // 1. Chữ thường nguyên bản có dấu
  const targetRaw = String(combinedText || "").toLowerCase();
  // 2. Chữ thường không dấu
  const targetNoTone = removeVietnameseTones(targetRaw);
  // 3. Chữ thường không dấu và bỏ toàn bộ ký tự đặc biệt (chỉ giữ chữ và số)
  const targetNoPunct = targetNoTone.replace(/[^a-z0-9]/g, "");

  // TẤT CẢ các token trong query phải khớp với target
  return tokens.every((token) => {
    const tokenRaw = token.toLowerCase();
    const tokenNoTone = removeVietnameseTones(tokenRaw);
    const tokenNoPunct = tokenNoTone.replace(/[^a-z0-9]/g, "");

    // 1. Khớp trực tiếp có dấu
    if (targetRaw.includes(tokenRaw)) return true;

    // 2. Khớp không dấu
    if (targetNoTone.includes(tokenNoTone)) return true;

    // 3. Khớp không ký tự đặc biệt (ví dụ: "5810" khớp "BEC.5810", "sr3" khớp "(SR3)")
    if (tokenNoPunct && targetNoPunct.includes(tokenNoPunct)) return true;

    return false;
  });
}

/**
 * Trích xuất chuỗi tìm kiếm tổng hợp từ một đối tượng dữ liệu
 */
export function extractSearchableText(item, fieldGetters = []) {
  if (!item) return "";
  const parts = [];

  for (const getter of fieldGetters) {
    let val;
    if (typeof getter === "function") {
      val = getter(item);
    } else if (typeof getter === "string") {
      val = item[getter];
    }

    if (val !== null && val !== undefined) {
      if (Array.isArray(val)) {
        parts.push(val.map(v => (typeof v === "object" ? Object.values(v).join(" ") : String(v))).join(" "));
      } else if (typeof val === "object") {
        parts.push(Object.values(val).join(" "));
      } else {
        parts.push(String(val));
      }
    }
  }

  return parts.join(" ");
}

/**
 * Lọc danh sách phần tử dựa trên query tìm kiếm
 */
export function filterByKeywords(items, query, fieldGetters = []) {
  if (!Array.isArray(items)) return [];
  if (!query || !query.trim()) return items;

  return items.filter((item) => {
    const text = extractSearchableText(item, fieldGetters);
    return matchKeywords(text, query);
  });
}

