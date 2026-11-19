/**
 * Hàm phân tích ngày/tháng/năm thi công thành timestamp (milliseconds)
 * Hỗ trợ đa dạng định dạng người dùng nhập:
 * - DD/MM/YYYY (ví dụ: 19/11/2026, 15/05/2024)
 * - DD-MM-YYYY (ví dụ: 19-11-2026)
 * - YYYY-MM-DD (chuẩn date picker: 2026-11-19)
 * - Tháng MM/YYYY hoặc MM/YYYY (ví dụ: Tháng 02/2024, 05/2026)
 * - Chỉ năm YYYY (ví dụ: 2026, 2025, 2024)
 * - Chữ tiếng Việt: "Ngày 15 tháng 05 năm 2026"
 */
export const parseExecutionDate = (dateVal) => {
  if (!dateVal) return 0;
  if (typeof dateVal === 'number' && !isNaN(dateVal) && dateVal > 0) return dateVal;
  if (dateVal instanceof Date && !isNaN(dateVal.getTime())) return dateVal.getTime();

  const str = String(dateVal).trim();
  if (!str) return 0;

  // 1. Chuẩn YYYY-MM-DD (từ datepicker hoặc ISO string)
  if (/^\d{4}-\d{1,2}-\d{1,2}/.test(str)) {
    const d = new Date(str);
    if (!isNaN(d.getTime())) return d.getTime();
  }

  // 2. Định dạng: DD/MM/YYYY hoặc DD-MM-YYYY hoặc DD.MM.YYYY
  const dmyMatch = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10);
    const year = parseInt(dmyMatch[3], 10);
    if (year >= 1970 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return new Date(year, month - 1, day, 12, 0, 0).getTime();
    }
  }

  // 3. Định dạng: Tháng MM/YYYY, T.MM/YYYY, hoặc MM/YYYY
  const monthYearMatch = str.match(/(?:tháng\s*|t\s*)?(\d{1,2})[\/\-\.](\d{4})/i);
  if (monthYearMatch) {
    const month = parseInt(monthYearMatch[1], 10);
    const year = parseInt(monthYearMatch[2], 10);
    if (year >= 1970 && month >= 1 && month <= 12) {
      return new Date(year, month - 1, 1, 12, 0, 0).getTime();
    }
  }

  // 4. Định dạng chữ: "Ngày 15 tháng 05 năm 2026" hoặc "15 Tháng 5, 2026"
  const textDmyMatch = str.match(/(\d{1,2})\s*(?:tháng|\/|\-)\s*(\d{1,2})\s*(?:năm|\/|\-|,)?\s*(\d{4})/i);
  if (textDmyMatch) {
    const day = parseInt(textDmyMatch[1], 10);
    const month = parseInt(textDmyMatch[2], 10);
    const year = parseInt(textDmyMatch[3], 10);
    if (year >= 1970 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return new Date(year, month - 1, day, 12, 0, 0).getTime();
    }
  }

  // 5. Định dạng chỉ có năm: 2026, 2025, 2024...
  const yearMatch = str.match(/\b(19\d{2}|20\d{2})\b/);
  if (yearMatch) {
    const year = parseInt(yearMatch[1], 10);
    return new Date(year, 0, 1, 12, 0, 0).getTime();
  }

  // 6. Generic Date fallback
  const fallback = new Date(str);
  if (!isNaN(fallback.getTime())) return fallback.getTime();

  return 0;
};

/**
 * Lấy timestamp phụ trợ (createdAt / updatedAt / ObjectId) khi không có ngày thi công
 */
export const getFallbackTimestamp = (item) => {
  if (!item || typeof item !== 'object') return 0;

  if (item.createdAt) {
    const t = new Date(item.createdAt).getTime();
    if (!isNaN(t) && t > 0) return t;
  }

  if (item.updatedAt) {
    const t = new Date(item.updatedAt).getTime();
    if (!isNaN(t) && t > 0) return t;
  }

  const idStr = String(item._id || item.id || '');
  const projMatch = idStr.match(/proj-(\d+)/);
  if (projMatch) {
    const t = parseInt(projMatch[1], 10);
    if (!isNaN(t) && t > 0) return t;
  }

  if (/^[0-9a-fA-F]{24}$/.test(idStr)) {
    try {
      const t = parseInt(idStr.substring(0, 8), 16) * 1000;
      if (!isNaN(t) && t > 0) return t;
    } catch (_) {}
  }

  return 0;
};

/**
 * Helper chuẩn hóa và lấy timestamp (milliseconds) để sắp xếp bài viết / công trình
 * ƯU TIÊN SỐ 1: Ngày tháng năm thi công (completedDate / date / executionDate)
 * Ngày thi công gần đây nhất -> Lên đầu tiên
 */
export const getSortTimestamp = (item) => {
  if (!item || typeof item !== 'object') return 0;

  // 1. Ưu tiên cao nhất: Ngày tháng thi công thực tế do người dùng nhập
  const execTime = parseExecutionDate(item.completedDate || item.executionDate || item.date);
  if (execTime > 0) return execTime;

  // 2. Nếu chưa nhập ngày thi công, dùng ngày tạo bài viết
  if (item.createdAt) {
    const t = new Date(item.createdAt).getTime();
    if (!isNaN(t) && t > 0) return t;
  }

  // 3. Dùng ngày cập nhật bài viết
  if (item.updatedAt) {
    const t = new Date(item.updatedAt).getTime();
    if (!isNaN(t) && t > 0) return t;
  }

  // 4. ID timestamp (proj-Date.now() hoặc ObjectId)
  return getFallbackTimestamp(item);
};

/**
 * Hàm so sánh sắp xếp: Thi công ngày gần đây nhất hiển thị đầu tiên, bài cũ đẩy xuống
 */
export const sortByNewest = (a, b) => {
  const timeA = getSortTimestamp(a);
  const timeB = getSortTimestamp(b);
  if (timeB !== timeA) {
    return timeB - timeA;
  }
  // Nếu ngày thi công trùng nhau thì bài nào vừa tạo/cập nhật mới hơn sẽ lên trước
  return getFallbackTimestamp(b) - getFallbackTimestamp(a);
};
