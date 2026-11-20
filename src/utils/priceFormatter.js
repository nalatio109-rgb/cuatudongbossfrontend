/**
 * Tiện ích chuẩn hóa và định dạng giá tiền sản phẩm (VND)
 * Hỗ trợ các trường hợp nhập từ admin:
 * - 100000 => 100.000đ/m2
 * - 4110000 => 4.110.000đ/m2
 * - 4110000/m2 => 4.110.000đ/m2
 * - 1.450.000đ/m2 => 1.450.000đ/m2
 * - 2500000/bộ => 2.500.000đ/bộ
 * - 1200000 - 1500000/m2 => 1.200.000 - 1.500.000đ/m2
 * - "Liên hệ" hoặc rỗng => "Liên hệ"
 */

export function formatVND(num) {
  if (num === null || num === undefined) return "";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatProductPrice(price, category = "cuacuon") {
  if (!price && price !== 0) return "Liên hệ";
  const str = String(price).trim();
  if (!str || str.toLowerCase() === "liên hệ" || str === "0") {
    return "Liên hệ";
  }

  // Xác định đơn vị tính phù hợp
  let unit = "đ/m2";
  if (/bộ/i.test(str)) {
    unit = "đ/bộ";
  } else if (/cái/i.test(str)) {
    unit = "đ/cái";
  } else if (/\/(m|mét)(?!2|²)/i.test(str)) {
    unit = "đ/m";
  } else if (/m2|m²/i.test(str)) {
    unit = "đ/m2";
  } else if (category === "phukien") {
    unit = "đ";
  } else {
    // Mặc định cửa cuốn, cửa kéo, nhôm kính là theo m2
    unit = "đ/m2";
  }

  // Tách bỏ các đuôi đơn vị trước khi lấy chữ số
  // (tránh số 2 trong m2 bị gộp thành số tiền)
  const strippedStr = str
    .replace(/(\/|\s)?(m2|m²|bộ|cái|\/(m|mét))/gi, "")
    .replace(/(vnđ|vnd|đ|d)/gi, "")
    .trim();

  // Xử lý khoảng giá dạng 1200000 - 1500000
  if (strippedStr.includes("-")) {
    const parts = strippedStr.split("-");
    if (parts.length === 2) {
      const num1 = parts[0].replace(/[^\d]/g, "");
      const num2 = parts[1].replace(/[^\d]/g, "");
      if (num1 && num2) {
        return `${formatVND(num1)} - ${formatVND(num2)}${unit}`;
      }
    }
  }

  // Lấy các chữ số còn lại
  const cleanNumber = strippedStr.replace(/[^\d]/g, "");
  if (!cleanNumber || cleanNumber === "0") {
    return str.toLowerCase().includes("liên hệ") ? "Liên hệ" : str;
  }

  return `${formatVND(cleanNumber)}${unit}`;
}

