import { DEFAULT_PRODUCT_ARTICLES } from "../data/defaultProductArticles";

/**
 * Trích xuất đoạn văn đầu tiên từ mã HTML bài viết Word Editor
 */
export function extractArticleFirstParagraph(htmlContent) {
  if (!htmlContent) return "";
  try {
    const pRegex = /<p[^>]*>(.*?)<\/p>/gis;
    let match;
    while ((match = pRegex.exec(htmlContent)) !== null) {
      const rawInner = match[1] || "";
      const plainText = rawInner
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, " ")
        .trim();
      if (plainText.length >= 25) {
        return plainText;
      }
    }
  } catch (err) {
    console.error("Error extracting first paragraph from HTML:", err);
  }
  return "";
}

/**
 * Lấy nội dung tóm tắt hiển thị trên Card sản phẩm:
 * Ưu tiên trích xuất từ bài viết chi tiết Word Editor (localStorage hoặc DEFAULT_PRODUCT_ARTICLES),
 * sau đó fallback về product.description nếu không tìm thấy.
 */
export function getProductCardDescription(product) {
  if (!product) return "";
  try {
    const code = (product.code || "").toUpperCase().trim();
    if (code) {
      let foundArticle = null;

      // 1. Kiểm tra bài viết đã lưu trong localStorage (từ Admin Word Editor)
      try {
        const localSaved = localStorage.getItem("boss_admin_product_articles");
        if (localSaved) {
          const articles = JSON.parse(localSaved);
          foundArticle = articles.find(
            (a) => a.productCode && a.productCode.toUpperCase() === code
          );
        }
      } catch (e) {
        console.warn("Error reading boss_admin_product_articles:", e);
      }

      // 2. Nếu chưa có trong localStorage, lấy từ danh sách mặc định
      if (!foundArticle) {
        foundArticle = DEFAULT_PRODUCT_ARTICLES.find(
          (a) => a.productCode && a.productCode.toUpperCase() === code
        );
      }

      // 3. Trích xuất đoạn văn đầu tiên trong nội dung bài viết
      if (foundArticle && foundArticle.content) {
        const extracted = extractArticleFirstParagraph(foundArticle.content);
        if (extracted) {
          return extracted;
        }
      }
    }
  } catch (err) {
    console.error("Error getting product card description:", err);
  }

  // 4. Fallback về description sẵn có của product
  return product.description || "";
}

