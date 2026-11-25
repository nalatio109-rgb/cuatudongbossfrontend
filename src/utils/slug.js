/**
 * Chuyển đổi tên tiếng Việt có dấu thành slug không dấu chuẩn SEO.
 * Ví dụ: "CỬA CUỐN KHE THOÁNG ĐỨC BOSSDOOR BD-900"
 * -> "cua-cuon-khe-thoang-duc-bossdoor-bd-900"
 */
export function slugify(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Xóa toàn bộ dấu thanh tiếng Việt
    .replace(/[đĐ]/g, "d")           // Thay chữ đ/Đ thành d
    .replace(/[^a-z0-9\s-]/g, " ")   // Ký tự đặc biệt (chấm, phẩy, ngoặc...) thành khoảng trắng
    .trim()
    .replace(/\s+/g, "-")            // Gom khoảng trắng thành dấu gạch ngang
    .replace(/-+/g, "-");            // Gom nhiều dấu gạch ngang liền nhau thành 1
}

/**
 * Lấy slug chuẩn cho một sản phẩm.
 * Ưu tiên: product.slug > slugify(product.title) > slugify(product.code) > String(product.id)
 */
export function getProductSlug(product) {
  if (!product) return "";
  if (product.slug && typeof product.slug === "string" && product.slug.trim().length > 0) {
    const s = product.slug.trim().toLowerCase();
    return s.replace(/^(san-pham-)+/gi, "");
  }
  if (product.title && typeof product.title === "string") {
    let raw = product.title.trim();
    // Bỏ tiền tố "Sản phẩm " nếu có để tránh vòng lặp slugify san-pham-
    if (/^sản phẩm\s+/i.test(raw)) {
      raw = raw.replace(/^sản phẩm\s+/i, "");
    }
    const s = slugify(raw);
    return s.replace(/^(san-pham-)+/gi, "");
  }
  if (product.code && typeof product.code === "string") {
    return slugify(product.code).replace(/^(san-pham-)+/gi, "");
  }
  return String(product.id || "").toLowerCase().replace(/^(san-pham-)+/gi, "");
}

/**
 * Lấy slug chuẩn không dấu cho một bài viết tin tức.
 * Ưu tiên: newsItem.slug > slugify(newsItem.title) > String(newsItem._id || newsItem.id)
 * Ví dụ: "Cửa khe thoáng - Giải pháp lấy sáng và lưu thông khí"
 * -> "cua-khe-thoang-giai-phap-lay-sang" hoặc "cua-khe-thoang-giai-phap-lay-sang-va-luu-thong-khi"
 */
export function getNewsSlug(newsItem) {
  if (!newsItem) return "";
  if (newsItem.slug && typeof newsItem.slug === "string" && newsItem.slug.trim().length > 0) {
    return newsItem.slug.trim();
  }
  if (newsItem.title && typeof newsItem.title === "string") {
    return slugify(newsItem.title);
  }
  return String(newsItem._id || newsItem.id || "").toLowerCase();
}

/**
 * Lấy slug chuẩn không dấu cho một bài viết công trình / dự án.
 * Ví dụ: "Thi công cửa cuốn khe thoáng cho anh Đô - Lê Lai"
 * -> "thi-cong-cua-cuon-khe-thoang-cho-anh-do-le-lai"
 */
export function getProjectSlug(project) {
  if (!project) return "";
  if (project.slug && typeof project.slug === "string" && project.slug.trim().length > 0) {
    return project.slug.trim();
  }
  if (project.title && typeof project.title === "string") {
    return slugify(project.title);
  }
  return String(project._id || project.id || "").toLowerCase();
}

/**
 * Lấy slug chuẩn không dấu cho một dịch vụ.
 * Ví dụ: "Sửa chữa cửa cuốn 24/24 tại Đà Nẵng"
 * -> "sua-chua-cua-cuon-24-24-tai-da-nang"
 */
export function getServiceSlug(service) {
  if (!service) return "";
  if (service.slug && typeof service.slug === "string" && service.slug.trim().length > 0) {
    return service.slug.trim();
  }
  if (service.title && typeof service.title === "string") {
    return slugify(service.title);
  }
  if (service.name && typeof service.name === "string") {
    return slugify(service.name);
  }
  return String(service._id || service.id || "").toLowerCase();
}


