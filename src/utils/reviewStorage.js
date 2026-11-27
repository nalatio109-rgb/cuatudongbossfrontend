// ============================================================================
// reviewStorage.js - Quản lý lưu trữ đánh giá khách hàng bền vững bằng IndexedDB
// Hỗ trợ lưu video lớn (lên tới 100MB+) và hình ảnh mà KHÔNG bị giới hạn 5MB của localStorage
// ============================================================================

const DB_NAME = "BossCustomerReviewsDB";
const STORE_NAME = "reviews";
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject(new Error("IndexedDB is not supported"));
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Lấy toàn bộ đánh giá từ IndexedDB
 */
export async function getReviewsFromIndexedDB() {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const results = req.result || [];
        resolve(results);
      };
      req.onerror = () => resolve([]);
    });
  } catch (err) {
    return [];
  }
}

/**
 * Lưu danh sách nhiều đánh giá vào IndexedDB
 */
export async function saveReviewsToIndexedDB(reviews) {
  if (!Array.isArray(reviews)) return false;
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    // Xóa hết rồi ghi mới hoặc put từng cái
    for (const item of reviews) {
      if (item && (item.id || item._id)) {
        const keyId = item.id || item._id;
        store.put({ ...item, id: keyId });
      }
    }

    return new Promise((resolve) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (err) {
    console.warn("saveReviewsToIndexedDB warning:", err);
    return false;
  }
}

/**
 * Thêm hoặc cập nhật 1 đánh giá vào IndexedDB
 */
export async function putReviewToIndexedDB(review) {
  if (!review) return false;
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const keyId = review.id || review._id || Date.now();
    store.put({ ...review, id: keyId });

    return new Promise((resolve) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (err) {
    console.warn("putReviewToIndexedDB warning:", err);
    return false;
  }
}

/**
 * Xóa 1 đánh giá khỏi IndexedDB
 */
export async function deleteReviewFromIndexedDB(id) {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.delete(id);

    return new Promise((resolve) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (err) {
    return false;
  }
}

/**
 * Lưu danh sách reviews an toàn vào localStorage (lọc bớt payload video khổng lồ nếu bị quá tải 5MB)
 */
export function safeSaveToLocalStorage(reviews) {
  if (!Array.isArray(reviews)) return;
  try {
    localStorage.setItem("boss_customer_reviews", JSON.stringify(reviews));
  } catch (quotaError) {
    // Nếu quá 5MB localStorage, lưu bản thu nhỏ (lược mediaUrl lớn) trong localStorage
    // trong khi IndexedDB vẫn giữ 100% video/ảnh gốc
    try {
      const lightweight = reviews.map((r) => {
        if (r.mediaUrl && r.mediaUrl.length > 300000) {
          return {
            ...r,
            mediaUrl: "",
            hasIndexedDbMedia: true,
          };
        }
        return r;
      });
      localStorage.setItem("boss_customer_reviews", JSON.stringify(lightweight));
    } catch (_) { }
  }
}
