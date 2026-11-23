// Product pricing details page - Boss Door
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import {
  ShieldCheck,
  CheckCircle2,
  Star,
  HeadphonesIcon,
  PhoneCall,
  ArrowRight,
  ArrowLeft,
  Tag,
  Check,
  Truck,
  Wrench,
  Clock,
  HelpCircle,
  AlertCircle,
  MapPin,
  ChevronDown,
  Sparkles,
  Info,
  MessageCircle,
  Filter,
  Calendar,
  List,
  FileSpreadsheet
} from "lucide-react";
import { DEFAULT_PRICE_QUOTES } from "../data/defaultPriceQuotes";
import { DEFAULT_PRODUCT_ARTICLES } from "../data/defaultProductArticles";
import {
  PRICING_ARTICLES,
  BRAND_PRICE_QUOTES,
  BRAND_PRODUCT_ARTICLES,
  getPricingArticleBySlug
} from "../data/pricingArticlesData";
import { getProductSlug } from "../utils/slug.js";
import { getProductCardDescription } from "../utils/productDescriptionHelper";
import { formatProductPrice } from "../utils/priceFormatter";
import { useAuth } from "../context/AuthContext";
import "./ProductPricing.css";

const sanitizeSpec = (text) => {
  if (typeof text !== "string") return text;
  let s = text.replace(/110\s*năm/gi, "15 năm");
  s = s.replace(/(?<!\d)5\s*năm/gi, "10 năm");
  return s;
};

// Nhận diện cột hình ảnh đồng bộ với Admin
const isImageCol = (col) => {
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

// Helper tìm kiếm bảng giá thông minh khớp với ID, URL slug hoặc mã sản phẩm
const findQuoteInList = (list, searchCode) => {
  if (!Array.isArray(list) || list.length === 0) return null;
  const s = String(searchCode || "").toLowerCase().trim();
  if (!s) return null;

  // 1. Khớp chính xác ID hoặc _id
  let found = list.find((q) => (q.id && String(q.id).toLowerCase() === s) || (q._id && String(q._id).toLowerCase() === s));
  if (found) return found;

  // 2. Khớp chính xác productCode
  found = list.find((q) => q.productCode && q.productCode.toLowerCase() === s);
  if (found) return found;

  // 3. Khớp trong danh sách mã SP của items
  found = list.find((q) => q.items && q.items.some((it) => it.code && it.code.toLowerCase() === s));
  if (found) return found;

  // 4. Khớp theo productTitle hoặc title
  found = list.find((q) => {
    const t = (q.productTitle || q.title || "").toLowerCase();
    return t && (t === s || t.includes(s) || s.includes(t));
  });
  if (found) return found;

  // 5. Khớp alias slug thông dụng (ví dụ cua-cuon-bossdoor)
  if (s.includes("cua-cuon-bossdoor") || s === "bossdoor" || s === "bang-gia" || s === "cuacuon") {
    found = list.find(
      (q) =>
        (q.productTitle && q.productTitle.toLowerCase().includes("bossdoor")) ||
        (q.title && q.title.toLowerCase().includes("bossdoor")) ||
        q.productCode?.toLowerCase() === "bd-2026" ||
        q.productCode?.toLowerCase() === "bossdoor"
    );
    if (found) return found;
    found = list.find((q) => q.category === "cuacuon");
    if (found) return found;
  }
  return null;
};

const PRODUCT_PRICE_RANGES = {
  "CK-DE": "980.000 - 1.230.000đ/m²",
  "BEC.5810": "1.500.000 - 1.750.000đ/m²",
  "DL-75": "420.000 - 550.000đ/m²",
  "BD-LUX": "2.100.000 - 2.250.000đ/m²",
  "BD-L70": "980.000 - 1.350.000đ/m²",
  "SN-100": "1.200.000 - 1.800.000đ/m²",
  "CK-DL": "480.000 - 850.000đ/m²",
  "CK-IX304": "1.850.000 - 2.600.000đ/m²",
  "MT-500": "3.500.000 - 7.500.000đ/bộ",
  "UPS-800": "2.800.000 - 4.500.000đ/bộ",
  "WF-APP": "1.200.000 - 1.800.000đ/bộ",
  "IT-GHOST": "32.000.000 - 45.000.000đ/bộ",
  "NAB-150": "18.500.000 - 28.000.000đ/bộ"
};

const PRICING_BREADCRUMB_TITLES = {
  "CK-DE": "Bảng giá cập nhật cửa kéo công nghệ Đức 2026 tại Đà Nẵng",
  "BEC.5810": "Bảng giá Cửa cuốn BossDoor ECO BEC.5810",
  "DL-75": "Bảng giá Cửa cuốn Đài Loan",
  "BD-LUX": "Bảng giá Cửa cuốn BossDoor Luxury",
  "BD-L70": "Bảng giá Cửa cuốn tấm liền Úc",
  "SN-100": "Bảng giá Cửa cuốn song ngang - mắc võng",
  "CK-DL": "Bảng giá Cửa kéo Đài Loan",
  "CK-IX304": "Bảng giá Cửa kéo Inox 304",
  "MT-500": "Bảng giá Mô tơ cửa cuốn nhập khẩu",
  "UPS-800": "Bảng giá Bình lưu điện cửa cuốn",
  "WF-APP": "Bảng giá Bộ điều khiển cửa cuốn qua điện thoại",
  "IT-GHOST": "Bảng giá Mô tơ cổng tự động âm sàn Italia",
  "NAB-150": "Bảng giá Cửa kính trượt tự động",
  "SR1": "Bảng giá Cửa kéo công nghệ Đức SR1",
  "SR2": "Bảng giá Cửa kéo công nghệ Đức SR2",
  "SR3": "Bảng giá Cửa kéo công nghệ Đức SR3",
  "VIP": "Bảng giá Cửa kéo công nghệ Đức VIP"
};

const getPricingBreadcrumbTitle = (prod, article) => {
  if (article?.seo?.title) {
    const raw = article.seo.title.split("|")[0].trim();
    if (raw) return raw;
  }
  if (!prod) return "Bảng giá chi tiết";
  const codeKey = (prod.code || "").toUpperCase();
  if (codeKey && PRICING_BREADCRUMB_TITLES[codeKey]) {
    return PRICING_BREADCRUMB_TITLES[codeKey];
  }
  const rawTitle = prod.title || prod.name || prod.code || "";
  const cleanTitle = rawTitle.split("(")[0].trim();
  if (cleanTitle.toLowerCase().startsWith("bảng giá")) {
    return cleanTitle;
  }
  return `Bảng giá ${cleanTitle}`;
};

const getPublishDate = (article) => {
  if (article?.publishDate) return article.publishDate;
  if (article?.createdAt) {
    try {
      const d = new Date(article.createdAt);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("vi-VN");
      }
    } catch (e) {}
  }
  return "24/04/2026";
};

// Helper format giá sang chuẩn rút gọn 'k' giống ảnh 2 (Ví dụ: 4,110k, 980k, 1,030k)
const formatK = (val) => {
  if (!val) return "Liên hệ";
  const str = String(val).trim();
  if (str.toLowerCase() === "liên hệ") return "Liên hệ";
  if (/k$/i.test(str)) return str;

  const digitsOnly = str.replace(/[^\d]/g, "");
  if (!digitsOnly) return str;

  const num = parseInt(digitsOnly, 10);
  if (isNaN(num)) return str;

  if (num >= 1000) {
    const inK = Math.round(num / 1000);
    return `${inK.toLocaleString("en-US")}k`;
  }
  return `${num}đ`;
};

// Helper chuẩn hóa các gạch đầu dòng chi tiết kỹ thuật cho mobile
const formatMobileSpecs = (description, colors) => {
  if (!description && !colors) return [];

  const rawLines = typeof description === "string" 
    ? description.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    : Array.isArray(description) 
      ? description 
      : [];
  const specLines = [];

  for (const line of rawLines) {
    if (typeof line !== "string") continue;
    // Bỏ qua dòng chỉ là tên sản phẩm lặp lại
    if (/^thân cửa\s+[a-z0-9]+/i.test(line) && !line.includes(":") && !line.includes("–") && !line.includes("-")) {
      continue;
    }
    const cleanLine = line.replace(/^[-–•*]\s*/, "");
    if (cleanLine) {
      specLines.push(`– ${cleanLine}`);
    }
  }

  if (colors && !specLines.some((l) => l.toLowerCase().includes("màu"))) {
    const colorText = typeof colors === "string" 
      ? colors 
      : Array.isArray(colors) 
        ? colors.map(c => c.name || c).join(", ") 
        : "";
    if (colorText) specLines.push(`– Màu sắc: ${colorText}`);
  }

  return specLines;
};

// Helper lấy giá cho bảng mobile theo filter diện tích
const getMobileTablePrice = (row, activeAreaFilter) => {
  let rawPrice = row.priceOver8;
  if (activeAreaFilter === "from6to8") {
    rawPrice = row.price6to8 || row.priceOver8;
  } else if (activeAreaFilter === "from4to6") {
    rawPrice = row.price4to6 || row.priceOver8;
  } else if (activeAreaFilter === "over8") {
    rawPrice = row.priceOver8;
  } else {
    rawPrice = row.priceOver8 || row.price;
  }
  return formatK(rawPrice);
};

const filterArticleHtml = (html) => {
  if (!html) return "";
  return html
    .replace(/<div class="editor-callout-box">[\s\S]*?(?:CÔNG TY TNHH|BOSSDOOR ĐÀ NẴNG|647 Ngô Quyền)[\s\S]*?<\/div>/gi, "")
    .replace(/<h2>5\.\s*Địa chỉ liên hệ[\s\S]*?<\/h2>/gi, "")
    .replace(/<p>[^<]*?liên hệ với chúng tôi:?<\/p>/gi, "");
};

export default function ProductPricing() {
  const { currentUser } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const path = location.pathname.toLowerCase();
  const isDirectGermanDoorUrl =
    path.includes("bang-gia-cap-nhat-cua-keo-cong-nghe-duc") ||
    path.includes("cua-keo-cong-nghe-duc");
  const effectiveId = id || (isDirectGermanDoorUrl ? "CK-DE" : "cua-cuon-bossdoor");

  const matchedPricingArticle = useMemo(() => {
    return getPricingArticleBySlug(effectiveId);
  }, [effectiveId]);

  const [product, setProduct] = useState(() => {
    if (location.state?.product) return location.state.product;
    // Check if effectiveId matches a price quote in localStorage or DEFAULT_PRICE_QUOTES
    try {
      const local = localStorage.getItem("boss_admin_price_quotes");
      const quotes = local ? JSON.parse(local) : DEFAULT_PRICE_QUOTES;
      const foundQuote = findQuoteInList(quotes, effectiveId);
      if (foundQuote) {
        return {
          id: foundQuote.productCode,
          code: foundQuote.productCode,
          title: foundQuote.productTitle || foundQuote.title || "Bảng giá cửa cuốn BossDoor",
          category: foundQuote.category || "cuacuon",
          price: foundQuote.items?.[0] ? `${foundQuote.items[0].priceOver8}đ/m²` : "Liên hệ",
          image: foundQuote.image || "/project_1.png",
          description: foundQuote.articleAbove || "Bảng báo giá chi tiết BossDoor Đà Nẵng",
          specs: [
            "Hợp kim nhôm 6063T5 cao cấp",
            "Sơn tĩnh điện AkzoNobel CHLB Đức bảo hành 10 năm",
            "Khóa cơ an toàn chống cạy phá độc quyền",
            "Vận hành êm ái triệt tiêu tiếng ồn"
          ]
        };
      }
    } catch (e) {}

    if (matchedPricingArticle) {
      const brandQuote = BRAND_PRICE_QUOTES[matchedPricingArticle.brandCode];
      return {
        id: matchedPricingArticle.id,
        code: (matchedPricingArticle.brandCode || "BOSSDOOR").toUpperCase(),
        title: matchedPricingArticle.title,
        category: matchedPricingArticle.brandCode?.includes("keo") ? "cuakeo" : "cuacuon",
        price: brandQuote?.items?.[0] ? `${brandQuote.items[0].priceOver8}đ/m²` : "4.110.000đ/m²",
        image: matchedPricingArticle.image,
        description: matchedPricingArticle.excerpt,
        specs: [
          "Hợp kim nhôm 6063T5 cao cấp",
          "Sơn tĩnh điện AkzoNobel CHLB Đức bảo hành 10 năm",
          "Khóa cơ an toàn chống cạy phá độc quyền",
          "Vận hành êm ái triệt tiêu tiếng ồn"
        ]
      };
    }
    return null;
  });

  const [loading, setLoading] = useState(() => {
    if (location.state?.product) return false;
    if (matchedPricingArticle) return false;
    try {
      const local = localStorage.getItem("boss_admin_price_quotes");
      if (local) {
        const list = JSON.parse(local);
        if (list.some((q) => q.productCode?.toLowerCase() === (effectiveId || "").toLowerCase())) {
          return false;
        }
      }
    } catch (e) {}
    return false;
  });
  const [allProducts, setAllProducts] = useState([]);
  const [tocOpen, setTocOpen] = useState(true);

  // Fetch all products dynamically from DB
  useEffect(() => {
    let isMounted = true;
    if (import.meta.env.VITE_API_URL) {
      fetch(`${import.meta.env.VITE_API_URL}/api/products`)
        .then((res) => res.json())
        .then((resData) => {
          if (resData.success && Array.isArray(resData.data) && isMounted) {
            setAllProducts(resData.data);
          }
        })
        .catch((err) => console.log("Failed to load products list:", err.message));
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const [priceQuote, setPriceQuote] = useState(() => {
    try {
      const local = localStorage.getItem("boss_admin_price_quotes");
      if (local) {
        const list = JSON.parse(local);
        const match = findQuoteInList(list, effectiveId);
        if (match) return match;
      }
    } catch (e) {}

    if (matchedPricingArticle?.brandCode && BRAND_PRICE_QUOTES[matchedPricingArticle.brandCode]) {
      return BRAND_PRICE_QUOTES[matchedPricingArticle.brandCode];
    }
    return findQuoteInList(DEFAULT_PRICE_QUOTES, effectiveId) || DEFAULT_PRICE_QUOTES[0] || null;
  });

  const [productArticle, setProductArticle] = useState(() => {
    if (matchedPricingArticle?.brandCode && BRAND_PRODUCT_ARTICLES[matchedPricingArticle.brandCode]) {
      return BRAND_PRODUCT_ARTICLES[matchedPricingArticle.brandCode];
    }
    return DEFAULT_PRODUCT_ARTICLES.find(
      (a) => a.productCode?.toLowerCase() === (effectiveId || "CK-DE").toLowerCase()
    ) || DEFAULT_PRODUCT_ARTICLES.find((a) => a.productCode === "CK-DE") || null;
  });

  const [activeAreaFilter, setActiveAreaFilter] = useState("all"); // 'all' | 'over8' | 'from6to8' | 'from4to6'

  // DANH SÁCH TOÀN BỘ BẢNG GIÁ ĐỒNG BỘ 100% VỚI ADMIN
  const [allPriceQuotes, setAllPriceQuotes] = useState(() => {
    const local = localStorage.getItem("boss_admin_price_quotes");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return DEFAULT_PRICE_QUOTES;
  });

  useEffect(() => {
    let isMounted = true;
    const loadAllQuotes = async () => {
      let loaded = null;
      if (import.meta.env.VITE_API_URL) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/price-quotes`);
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            loaded = json.data;
          }
        } catch (e) {}
      }
      if (!loaded) {
        const local = localStorage.getItem("boss_admin_price_quotes");
        if (local) {
          try {
            const parsed = JSON.parse(local);
            if (Array.isArray(parsed) && parsed.length > 0) loaded = parsed;
          } catch (e) {}
        }
      }
      if (isMounted && loaded && loaded.length > 0) {
        setAllPriceQuotes(loaded);
      }
    };

    loadAllQuotes();

    const handleUpdate = () => {
      const local = localStorage.getItem("boss_admin_price_quotes");
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAllPriceQuotes(parsed);
            const currentKey = priceQuote?.id || priceQuote?._id || priceQuote?.productCode || product?.code || effectiveId;
            const updatedMatch =
              findQuoteInList(parsed, currentKey) ||
              findQuoteInList(parsed, effectiveId) ||
              parsed[0];
            if (updatedMatch) {
              setPriceQuote(updatedMatch);
              setProduct((prev) => ({
                ...(prev || {}),
                code: updatedMatch.productCode || prev?.code,
                title: updatedMatch.productTitle || updatedMatch.title || prev?.title,
                image: updatedMatch.image || prev?.image,
                description: updatedMatch.articleAbove || prev?.description
              }));
            }
          }
        } catch (e) {}
      }
    };
    window.addEventListener("priceQuotesUpdated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("priceQuotesUpdated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Chuyển đổi bảng giá đang xem khi người dùng bấm pill chọn bảng giá
  const handleSelectQuote = (targetQuote) => {
    if (!targetQuote) return;
    setPriceQuote(targetQuote);
    if (targetQuote.productTitle) {
      setProduct((prev) => ({
        ...(prev || {}),
        code: targetQuote.productCode,
        title: targetQuote.productTitle,
        category: targetQuote.category || prev?.category || "cuacuon",
        image: targetQuote.image || targetQuote.imageUrl || prev?.image
      }));
    }
  };

  // Load price quote matching this product
  useEffect(() => {
    const code = product?.code || effectiveId;
    if (!code) return;

    let isMounted = true;

    const fetchQuote = async () => {
      let foundQuote = null;

      // 1. Fetch from backend API
      if (import.meta.env.VITE_API_URL) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/price-quotes/${code}`);
          const json = await res.json();
          if (json.success && json.data) {
            foundQuote = json.data;
          }
        } catch (e) {
          console.log("Could not load price quote from API:", e.message);
        }
      }

      // 2. Fallback to localStorage
      if (!foundQuote) {
        const local = localStorage.getItem("boss_admin_price_quotes");
        if (local) {
          try {
            const list = JSON.parse(local);
            foundQuote = findQuoteInList(list, code) || findQuoteInList(list, effectiveId);
          } catch (e) {
            console.error(e);
          }
        }
      }

      // 3. Fallback to BRAND_PRICE_QUOTES (Khớp thương hiệu theo slug hoặc brandCode)
      if (!foundQuote && matchedPricingArticle?.brandCode && BRAND_PRICE_QUOTES[matchedPricingArticle.brandCode]) {
        foundQuote = BRAND_PRICE_QUOTES[matchedPricingArticle.brandCode];
      }

      // 4. Fallback to DEFAULT_PRICE_QUOTES
      if (!foundQuote) {
        foundQuote = findQuoteInList(DEFAULT_PRICE_QUOTES, code) || findQuoteInList(DEFAULT_PRICE_QUOTES, effectiveId);
      }

      // 4. Fallback based on category
      if (!foundQuote) {
        const upperCode = code.toUpperCase();
        if (product?.category === "cuakeo" || upperCode.startsWith("CK") || upperCode.startsWith("SR") || upperCode === "VIP" || isDirectGermanDoorUrl) {
          foundQuote = DEFAULT_PRICE_QUOTES.find((q) => q.productCode === "CK-DE");
        } else {
          foundQuote = DEFAULT_PRICE_QUOTES.find((q) => q.productCode === "BEC.5810") || DEFAULT_PRICE_QUOTES[0];
        }
      }

      if (isMounted && foundQuote) {
        setPriceQuote(foundQuote);
      }
    };

    fetchQuote();

    return () => {
      isMounted = false;
    };
  }, [product, effectiveId, isDirectGermanDoorUrl]);

  // Load product article (rich content & guide)
  useEffect(() => {
    const code = product?.code || effectiveId;
    if (!code) return;

    let isMounted = true;

    const fetchArticle = async () => {
      let foundArticle = null;

      // 1. Fetch from backend API
      if (import.meta.env.VITE_API_URL) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/product-articles/${code}`);
          const json = await res.json();
          if (json.success && json.data) {
            foundArticle = json.data;
          }
        } catch (e) {
          console.log("Could not load product article from API:", e.message);
        }
      }

      // 2. Fallback to localStorage
      if (!foundArticle) {
        const local = localStorage.getItem("boss_admin_product_articles");
        if (local) {
          try {
            const list = JSON.parse(local);
            foundArticle = list.find(
              (a) =>
                a.productCode?.toUpperCase() === code.toUpperCase() ||
                (a.seo?.slug && code.toLowerCase().includes(a.seo.slug.toLowerCase()))
            );
          } catch (e) {
            console.error(e);
          }
        }
      }

      // 3. Fallback to BRAND_PRODUCT_ARTICLES
      if (!foundArticle && matchedPricingArticle?.brandCode && BRAND_PRODUCT_ARTICLES[matchedPricingArticle.brandCode]) {
        foundArticle = BRAND_PRODUCT_ARTICLES[matchedPricingArticle.brandCode];
      }

      // 4. Fallback to DEFAULT_PRODUCT_ARTICLES
      if (!foundArticle) {
        foundArticle = DEFAULT_PRODUCT_ARTICLES.find(
          (a) =>
            a.productCode?.toUpperCase() === code.toUpperCase() ||
            (code.toUpperCase().startsWith("CK") && a.productCode === "CK-DE") ||
            (isDirectGermanDoorUrl && a.productCode === "CK-DE") ||
            (a.seo?.slug && code.toLowerCase().includes(a.seo.slug.toLowerCase()))
        );
      }

      // 5. Default fallback for German door
      if (!foundArticle && (code.toUpperCase().includes("CK") || code.toUpperCase().includes("SR") || code.toUpperCase() === "VIP" || isDirectGermanDoorUrl)) {
        foundArticle = DEFAULT_PRODUCT_ARTICLES.find((a) => a.productCode === "CK-DE");
      }

      if (isMounted && foundArticle) {
        setProductArticle(foundArticle);
      }
    };

    fetchArticle();

    return () => {
      isMounted = false;
    };
  }, [product, effectiveId, isDirectGermanDoorUrl, matchedPricingArticle]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Lookup product by ID, Code or Slug dynamically if not passed via location state
  useEffect(() => {
    let isMounted = true;
    const searchKey = String(effectiveId || "").toLowerCase().trim();

    // If product is already loaded and matches current route, no need to lookup
    if (
      product &&
      (String(product.id) === searchKey ||
        (product.code && product.code.toLowerCase() === searchKey) ||
        String(product._id || "") === searchKey ||
        getProductSlug(product).toLowerCase() === searchKey ||
        (matchedPricingArticle && (String(product.id) === matchedPricingArticle.id || product.code?.toLowerCase() === matchedPricingArticle.brandCode?.toLowerCase())))
    ) {
      setLoading(false);
      return;
    }

    setLoading(!product);

    const lookupProduct = async () => {
      // 1. Try fetching directly by effectiveId from backend API
      if (import.meta.env.VITE_API_URL && effectiveId) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${effectiveId}`);
          const resJson = await res.json();
          if (resJson.success && resJson.data && isMounted) {
            const fetchedProduct = { ...resJson.data };
            if (Array.isArray(fetchedProduct.specs)) {
              fetchedProduct.specs = fetchedProduct.specs.map(sanitizeSpec);
            }
            if (fetchedProduct.code && PRODUCT_PRICE_RANGES[fetchedProduct.code]) {
              fetchedProduct.price = PRODUCT_PRICE_RANGES[fetchedProduct.code];
            }
            setProduct(fetchedProduct);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.log("Could not fetch product detail directly from API:", err.message);
        }
      }

      // 2. Search in allProducts list or fetch all products
      let list = allProducts;
      if (!list || list.length === 0) {
        if (import.meta.env.VITE_API_URL) {
          try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
            const resJson = await res.json();
            if (resJson.success && Array.isArray(resJson.data)) {
              list = resJson.data;
              if (isMounted) setAllProducts(list);
            }
          } catch (e) {}
        }
      }

      let matched = null;
      if (Array.isArray(list) && list.length > 0) {
        matched = list.find((p) => {
          const pCode = (p.code || "").toLowerCase();
          const pId = String(p.id || p._id || "").toLowerCase();
          const pSlug = getProductSlug(p).toLowerCase();
          return (
            pCode === searchKey ||
            pId === searchKey ||
            pSlug === searchKey ||
            (searchKey.includes("cua-keo") && pCode.includes("ck")) ||
            (searchKey.includes("bang-gia-cap-nhat") && pCode.includes("ck"))
          );
        });

        if (!matched && (isDirectGermanDoorUrl || !id)) {
          matched = list.find((p) => (p.code || "").toUpperCase() === "CK-DE") || list.find((p) => p.category === "cuakeo");
        }
      }

      // 3. Fallback to matchedPricingArticle dù có API hay không
      if (!matched && matchedPricingArticle) {
        const brandQuote = BRAND_PRICE_QUOTES[matchedPricingArticle.brandCode];
        matched = {
          id: matchedPricingArticle.id,
          code: (matchedPricingArticle.brandCode || "BOSSDOOR").toUpperCase(),
          title: matchedPricingArticle.title,
          category: matchedPricingArticle.brandCode?.includes("keo") ? "cuakeo" : "cuacuon",
          price: brandQuote?.items?.[0] ? `${brandQuote.items[0].priceOver8}đ/m²` : "4.110.000đ/m²",
          image: matchedPricingArticle.image,
          description: matchedPricingArticle.excerpt,
          specs: [
            "Hợp kim nhôm 6063T5 cao cấp",
            "Sơn tĩnh điện AkzoNobel CHLB Đức bảo hành 10 năm",
            "Khóa cơ an toàn chống cạy phá độc quyền",
            "Vận hành êm ái triệt tiêu tiếng ồn"
          ]
        };
      }

      // 4. Fallback to price quote from localStorage / DEFAULT_PRICE_QUOTES
      if (!matched) {
        try {
          const local = localStorage.getItem("boss_admin_price_quotes");
          const quotesList = local ? JSON.parse(local) : DEFAULT_PRICE_QUOTES;
          const found = quotesList.find(
            (q) =>
              q.productCode?.toLowerCase() === searchKey ||
              (q.items && q.items.some((it) => it.code?.toLowerCase() === searchKey))
          );
          if (found) {
            matched = {
              id: found.productCode,
              code: found.productCode,
              title: found.productTitle || found.title || "Bảng giá cửa cuốn BossDoor",
              category: found.category || "cuacuon",
              price: found.items?.[0] ? `${found.items[0].priceOver8}đ/m²` : "Liên hệ",
              image: found.image || "/project_1.png",
              description: found.articleAbove || "Bảng báo giá chi tiết BossDoor Đà Nẵng",
              specs: [
                "Hợp kim nhôm 6063T5 cao cấp",
                "Sơn tĩnh điện AkzoNobel CHLB Đức bảo hành 10 năm",
                "Khóa cơ an toàn chống cạy phá độc quyền",
                "Vận hành êm ái triệt tiêu tiếng ồn"
              ]
            };
            setPriceQuote(found);
          }
        } catch (e) {}
      }

      if (matched && isMounted) {
        const matchedObj = { ...matched };
        if (Array.isArray(matchedObj.specs)) {
          matchedObj.specs = matchedObj.specs.map(sanitizeSpec);
        }
        if (matchedObj.code && PRODUCT_PRICE_RANGES[matchedObj.code]) {
          matchedObj.price = PRODUCT_PRICE_RANGES[matchedObj.code];
        }
        setProduct(matchedObj);
        setLoading(false);
        return;
      }

      if (isMounted) setLoading(false);
    };

    lookupProduct();

    return () => {
      isMounted = false;
    };
  }, [id, effectiveId, isDirectGermanDoorUrl, allProducts]);

  // Dynamic SEO meta updates
  useEffect(() => {
    if (product) {
      const pageTitle = productArticle?.seo?.title || `Bảng Giá ${product.title} - Báo Giá Trọn Gói 2026 | Boss Đà Nẵng`;
      document.title = pageTitle;
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = productArticle?.seo?.description || `Bảng giá chi tiết ${product.title} (Mã: ${product.code}). Giá niêm yết: ${product.price || "Liên hệ"}. Khảo sát tận nơi miễn phí, bảo hành chính hãng tại Đà Nẵng.`;
    }
  }, [product, productArticle]);

  if (loading) {
    return (
      <div className="pricing-loading-screen">
        <div className="pricing-spinner"></div>
        <p>Đang tải bảng giá sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found-view">
        <div className="container text-center py-20">
          <h2>Không Tìm Thấy Bảng Giá Sản Phẩm</h2>
          <p>Mã sản phẩm hoặc đường dẫn báo giá này không tồn tại trong hệ thống.</p>
          <div className="not-found-actions">
            <Link to="/san-pham" className="btn-return-catalog">
              <ArrowLeft size={16} /> VỀ DANH MỤC SẢN PHẨM
            </Link>
            <Link to="/bang-gia" className="btn-return-catalog outline">
              XEM TẤT CẢ BẢNG GIÁ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check if product has an official price string
  const hasOfficialPrice = product.price && product.price !== "Liên hệ" && product.price.trim() !== "";

  // Dynamic pricing breakdown tiers based on product specs or default tier
  const pricingTiers = [
    {
      name: "Quy cách tiêu chuẩn",
      spec: product.specs?.[0] || "Theo thông số nhà sản xuất",
      unit: product.price?.includes("/bộ") ? "Bộ" : "m2",
      price: hasOfficialPrice ? product.price : "Liên hệ nhận giá",
      status: "Sẵn hàng"
    },
    {
      name: "Quy cách tăng cường chống bão",
      spec: product.specs?.[1] || "Độ dày tối ưu gia cường gân chịu lực",
      unit: product.price?.includes("/bộ") ? "Bộ" : "m2",
      price: hasOfficialPrice ? "Tùy kích thước đo đạc" : "Liên hệ nhận giá",
      status: "Gia công theo yêu cầu"
    }
  ];

  // Dynamic accessories based on category
  const accessoriesList = product.category === "cuacuon"
    ? [
        {
          name: "Mô tơ xích kéo lõi đồng 100% (300kg - 800kg)",
          price: "Từ 3.500.000đ/bộ",
          warranty: "10 năm 1 đổi 1",
          image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"
        },
        {
          name: "Bình lưu điện dự phòng UPS (48h - 72h)",
          price: "Từ 2.800.000đ/bộ",
          warranty: "2 năm",
          image: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=600&q=80"
        },
        {
          name: "Bộ điều khiển qua điện thoại Smart WiFi/4G",
          price: "1.200.000đ/bộ",
          warranty: "2 năm",
          image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80"
        },
        {
          name: "Tay điều khiển remote mã nhảy Rolling Code",
          price: "650.000đ/bộ",
          warranty: "2 năm",
          image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80"
        }
      ]
    : product.category === "cuakeo"
    ? [
        {
          name: "Bạc đạn inox bi kín chống rỉ sét",
          price: "Đồng bộ theo cửa",
          warranty: "2 năm",
          image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
        },
        {
          name: "Khóa âm sàn chống cắt chuyên dụng",
          price: "350.000đ/bộ",
          warranty: "2 năm",
          image: "/project_1.png"
        },
        {
          name: "Sơn AkzoNobel CHLB Đức ngoài trời",
          price: "Đã bao gồm",
          warranty: "10 năm",
          image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=600&q=80"
        }
      ]
    : product.category === "cuatudong"
    ? [
        {
          name: "Mô tơ âm sàn Italia chuẩn chống nước IP67",
          price: "Đồng bộ theo hệ",
          warranty: "10 năm",
          image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"
        },
        {
          name: "Cảm biến hồng ngoại Photocell chống kẹp",
          price: "Kèm theo bộ",
          warranty: "3 năm",
          image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80"
        },
        {
          name: "Bộ điều khiển Smartphone thông minh",
          price: "Tích hợp sẵn",
          warranty: "2 năm",
          image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80"
        }
      ]
    : [
        {
          name: "Phụ kiện đồng bộ chính hãng",
          price: "Theo quy cách",
          warranty: "Chính hãng 100%",
          image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
        }
      ];

  // Danh sách dòng sản phẩm cho bảng giá (dùng chung cho cả Desktop và Mobile)
  const defaultGermanItems = DEFAULT_PRICE_QUOTES.find((q) => q.productCode === "CK-DE")?.items || [];
  const quoteTableItems =
    priceQuote?.items && priceQuote.items.length > 0
      ? priceQuote.items
      : (product?.category === "cuakeo" || (product?.code && product.code.toUpperCase().includes("CK")) || isDirectGermanDoorUrl)
      ? defaultGermanItems
      : pricingTiers.map((t, idx) => ({
          stt: idx + 1,
          code: product?.code || "CK-DE",
          name: t.name,
          description: t.spec,
          unit: t.unit,
          colors: "Theo tiêu chuẩn",
          priceOver8: t.price,
          price6to8: t.price,
          price4to6: t.price
        }));

  // Chuẩn hóa danh sách cột hiển thị cho bảng giá (Đồng bộ 100% với Admin & Dữ liệu)
  const activeColumns = useMemo(() => {
    if (priceQuote?.customColumns && priceQuote.customColumns.length > 0) {
      return priceQuote.customColumns;
    }
    // Nếu quote chưa có customColumns, tự động phát hiện số lượng cột giá và cột ảnh từ items
    const hasImg = quoteTableItems.some((it) => it.image || it.imageUrl);
    const hasPrice3 = quoteTableItems.some(
      (it) => it.price4to6 && it.price4to6 !== it.price6to8 && it.price4to6 !== it.priceOver8
    );
    const hasPrice2 = quoteTableItems.some(
      (it) => it.price6to8 && it.price6to8 !== it.priceOver8
    );

    const cols = [
      { id: "col_1", key: "stt", label: "STT", width: "50px" },
      { id: "col_2", key: "code", label: "Mã SP", width: "88px" }
    ];
    if (hasImg) {
      cols.push({ id: "col_img", key: "image", label: "Hình ảnh", width: "90px" });
    }
    cols.push(
      { id: "col_3", key: "name", label: "Diễn giải (Cấu tạo, độ dày, sơn phủ)", width: "260px" },
      { id: "col_4", key: "unit", label: "ĐVT", width: "65px" },
      { id: "col_5", key: "colors", label: "Màu sắc", width: "140px" }
    );

    if (hasPrice3) {
      cols.push(
        { id: "col_6", key: "priceOver8", label: "Đơn giá (> 8m²)", width: "130px" },
        { id: "col_7", key: "price6to8", label: "Đơn giá (6 - < 8m²)", width: "130px" },
        { id: "col_8", key: "price4to6", label: "Đơn giá (4 - < 6m²)", width: "130px" }
      );
    } else if (hasPrice2) {
      cols.push(
        { id: "col_6", key: "priceOver8", label: "Đơn giá (> 8m²)", width: "130px" },
        { id: "col_7", key: "price6to8", label: "Đơn giá (≤ 8m²)", width: "130px" }
      );
    } else {
      cols.push({ id: "col_6", key: "priceOver8", label: "Đơn giá (> 8m²)", width: "130px" });
    }
    return cols;
  }, [priceQuote, quoteTableItems]);

  // Danh sách các bài viết bảng giá liên quan của các dòng cửa khác (lấy động 100% từ allProducts trong DB)
  const relatedPriceQuotes = useMemo(() => {
    const currentCode = (product?.code || "CK-DE").toUpperCase();
    const currentCategory = product?.category || "cuakeo";
    const currentKey = String(effectiveId || product?.code || "").toUpperCase();
    const isCurrentGermanQuote = currentCode === "CK-DE" || isDirectGermanDoorUrl || currentKey.includes("CK-DE") || currentKey.includes("BANG-GIA-CAP-NHAT");

    const dynamicQuotes = (allProducts || []).map((p) => {
      const pCode = (p.code || "").toUpperCase();
      const catName = p.category === "cuacuon" ? "CỬA CUỐN" : p.category === "cuakeo" ? "CỬA KÉO" : p.category === "cuatudong" ? "CỬA TỰ ĐỘNG" : "PHỤ KIỆN";
      const slug = getProductSlug(p);
      const quotePath = pCode === "CK-DE"
        ? "/bang-gia-cap-nhat-cua-keo-cong-nghe-duc-2026-tai-da-nang"
        : `/bang-gia/${slug}`;
      const desc = getProductCardDescription(p);
      const price = PRODUCT_PRICE_RANGES[pCode] || (p.price ? formatProductPrice(p.price, p.category) : "Liên hệ");
      const specs = Array.isArray(p.specs) ? p.specs.map(sanitizeSpec) : [];

      return {
        code: pCode,
        title: (p.title || p.name || "").toUpperCase(),
        category: p.category || "cuacuon",
        categoryName: catName,
        price,
        badge: p.badge || (p.category === "cuakeo" ? "BÁN CHẠY" : "CHÍNH HÃNG"),
        image: p.image || (Array.isArray(p.images) && p.images[0]) || "",
        description: desc,
        specs: specs.length > 0 ? specs : ["Bảo hành chính hãng 10 năm"],
        path: quotePath
      };
    });

    const filtered = dynamicQuotes.filter((q) => {
      if (isCurrentGermanQuote) {
        return q.code !== "CK-DE";
      }
      return q.code !== currentCode && !currentKey.includes(q.code);
    });

    // Ưu tiên sản phẩm cùng danh mục lên trước
    filtered.sort((a, b) => {
      if (a.category === currentCategory && b.category !== currentCategory) return -1;
      if (a.category !== currentCategory && b.category === currentCategory) return 1;
      return 0;
    });

    return filtered.slice(0, 4);
  }, [allProducts, product, effectiveId, isDirectGermanDoorUrl]);

  return (
    <div className="product-pricing-page">
      {/* 1. BREADCRUMB (Khớp chuẩn 100% Ảnh 4) */}
      <nav className="pricing-breadcrumb" aria-label="Breadcrumb">
        <div className="container">
          <Link to="/" className="crumb-link">Trang chủ</Link>
          <span className="crumb-sep">»</span>
          <Link to="/bang-gia" className="crumb-link">Bảng giá</Link>
          <span className="crumb-sep">»</span>
          <span className="crumb-current">{getPricingBreadcrumbTitle(product, productArticle)}</span>
        </div>
      </nav>

      <main className="container pricing-main-container">
        {productArticle ? (
          <article className="pricing-article-wrapper">
            {/* ARTICLE CONTINUOUS HEADER */}
            <header className="article-continuous-header">
              <h1 className="article-main-title">
                {priceQuote?.title || priceQuote?.productTitle || (productArticle?.seo?.title ? productArticle.seo.title.split("|")[0]?.trim() : (product?.title || "Bảng giá"))}
              </h1>
              <div className="article-meta-bar">
                <span className="meta-tag-category">
                  <Tag size={13} className="meta-icon" /> {priceQuote?.category === "cuacuon" ? "Cửa cuốn" : priceQuote?.category === "cuakeo" ? "Cửa kéo" : "Báo giá kỹ thuật"}
                </span>
                <span className="meta-tag-date">
                  <Calendar size={13} className="meta-icon" /> {getPublishDate(productArticle)}
                </span>
              </div>
            </header>

            {/* BẢNG BÁO GIÁ CHÍNH */}
            <section className="pricing-table-section">
              <div className="pricing-table-header-row">
                <h2 id="bang-gia-chi-tiet" className="pricing-section-title">
                  {priceQuote?.tableHeading || priceQuote?.title || `Bảng giá ${product?.title || ""} tại Đà Nẵng`}
                </h2>
                <div className="table-scroll-hint-pill">
                  ↔ Vuốt ngang để xem đầy đủ các cột giá
                </div>
              </div>

              {/* BÀI VIẾT / GIỚI THIỆU PHÍA TRÊN BẢNG GIÁ (LUÔN ĐỒNG BỘ HIỂN THỊ) */}
              <div className="pricing-custom-article-box above-quote-article">
                <p className="custom-article-paragraph">
                  {priceQuote?.articleAbove?.trim() ||
                    "BossDoor Đà Nẵng trân trọng gửi đến Quý khách hàng bảng báo giá chi tiết, mới nhất năm 2026. Các dòng sản phẩm được sản xuất trên dây chuyền hiện đại, tiêu chuẩn chất lượng cao, bền bỉ và an toàn tuyệt đối cho mọi công trình."}
                </p>
              </div>

              {/* BẢNG GIÁ KỸ THUẬT ĐỒNG BỘ 100% VỚI ADMIN */}
              <div className="technical-table-container-card">
                <div className="admin-table-scroll-wrapper">
                  <table className="admin-quote-data-table customer-quote-table">
                    <thead>
                      <tr>
                        {activeColumns.map((col, cIdx) => {
                          const isImg = isImageCol(col);
                          const isStt = col.key === "stt" || col.id === "col_1" || col.label?.toLowerCase() === "stt";
                          const isCode = col.key === "code" || col.id === "col_2" || col.label?.toLowerCase().includes("mã");
                          const isPrice =
                            col.key?.toLowerCase().includes("price") ||
                            col.id === "col_6" ||
                            col.id === "col_7" ||
                            col.id === "col_8" ||
                            col.label?.toLowerCase().includes("giá") ||
                            col.label?.toLowerCase().includes("đơn giá");
                          const colWidth = col.width || (isStt ? "50px" : isCode ? "88px" : isImg ? "90px" : "130px");

                          return (
                            <th
                              key={col.id || cIdx}
                              style={{
                                width: colWidth,
                                minWidth: isStt ? "45px" : isCode ? "75px" : isImg ? "80px" : "110px",
                                textAlign: isStt || isCode || isImg ? "center" : isPrice ? "center" : "left"
                              }}
                              className={isPrice ? "price-head highlight-head" : ""}
                            >
                              {col.label}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {quoteTableItems.map((row, rIdx) => {
                        const isCurrentProduct = 
                          product?.code && 
                          (product.code.toUpperCase() === row?.code?.toUpperCase() || 
                           row?.code?.toUpperCase()?.includes(product.code.toUpperCase()));

                        return (
                          <tr key={rIdx} className={isCurrentProduct ? "highlight-current-row" : ""}>
                            {activeColumns.map((col, cIdx) => {
                              const isImg = isImageCol(col);
                              const isStt = col.key === "stt" || col.id === "col_1" || col.label?.toLowerCase() === "stt";
                              const isCode = col.key === "code" || col.id === "col_2" || col.label?.toLowerCase().includes("mã");
                              const isPrice =
                                col.key?.toLowerCase().includes("price") ||
                                col.id === "col_6" ||
                                col.id === "col_7" ||
                                col.id === "col_8" ||
                                col.label?.toLowerCase().includes("giá") ||
                                col.label?.toLowerCase().includes("đơn giá");
                              const isUnit = col.key === "unit" || col.id === "col_4" || col.label?.toLowerCase().includes("đvt");

                              let cellVal = "";
                              if (row.rawGridCells && row.rawGridCells[col.id] !== undefined && row.rawGridCells[col.id] !== "") {
                                cellVal = row.rawGridCells[col.id];
                              } else if (row[col.id] !== undefined && row[col.id] !== "") {
                                cellVal = row[col.id];
                              } else if (col.key && row[col.key] !== undefined && row[col.key] !== "") {
                                cellVal = row[col.key];
                              } else if (isStt) {
                                cellVal = row.stt || rIdx + 1;
                              } else if (isCode) {
                                cellVal = row.code || "";
                              } else if (isImg) {
                                cellVal = row.image || row.imageUrl || "";
                              } else if (isUnit) {
                                cellVal = row.unit || "m2";
                              } else if (isPrice) {
                                const priceCols = activeColumns.filter(
                                  (c) =>
                                    c.key?.toLowerCase().includes("price") ||
                                    c.id === "col_6" ||
                                    c.id === "col_7" ||
                                    c.id === "col_8" ||
                                    c.label?.toLowerCase().includes("giá") ||
                                    c.label?.toLowerCase().includes("đơn giá")
                                );
                                const pIdx = priceCols.findIndex((c) => c.id === col.id);
                                if (pIdx === 0) cellVal = row.priceOver8 || row.price || "Liên hệ";
                                else if (pIdx === 1) cellVal = row.price6to8 || "Liên hệ";
                                else if (pIdx === 2) cellVal = row.price4to6 || "Liên hệ";
                                else cellVal = row[col.id] || "Liên hệ";
                              } else {
                                cellVal = row.name || row.description || "";
                              }

                              if (isImg) {
                                return (
                                  <td key={col.id || cIdx} className="cell-client-img text-center">
                                    {cellVal ? (
                                      <img
                                        src={cellVal}
                                        alt={`SP ${rIdx + 1}`}
                                        className="client-table-thumb"
                                        onError={(e) => { e.target.style.display = "none"; }}
                                      />
                                    ) : (
                                      <span className="cell-empty-dash">—</span>
                                    )}
                                  </td>
                                );
                              }

                              if (isStt) {
                                return (
                                  <td key={col.id || cIdx} className="cell-client-stt text-center font-bold">
                                    {cellVal || rIdx + 1}
                                  </td>
                                );
                              }

                              if (isCode) {
                                return (
                                  <td key={col.id || cIdx} className="cell-client-code text-center">
                                    <span className="client-code-badge">{cellVal}</span>
                                  </td>
                                );
                              }

                              if (isPrice) {
                                const displayStr = cellVal
                                  ? cellVal.includes("đ") || isNaN(Number(cellVal.replace(/[,.]/g, "")))
                                    ? cellVal
                                    : `${cellVal} đ/m²`
                                  : "Liên hệ";
                                return (
                                  <td key={col.id || cIdx} className="cell-client-price text-center">
                                    <span className="client-price-text">{displayStr}</span>
                                  </td>
                                );
                              }

                              if (isUnit) {
                                return (
                                  <td key={col.id || cIdx} className="cell-client-unit text-center">
                                    <span className="client-unit-text">{cellVal}</span>
                                  </td>
                                );
                              }

                              return (
                                <td key={col.id || cIdx} className="cell-client-desc">
                                  <div className="client-desc-text">{cellVal}</div>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* BÀI VIẾT CHI TIẾT & TƯ VẤN PHÍA DƯỚI BẢNG GIÁ (LUÔN ĐỒNG BỘ HIỂN THỊ) */}
              <div className="pricing-custom-article-box below-quote-article">
                <div className="custom-article-header">
                  <Sparkles size={16} className="sparkle-gold-icon" />
                  <h4>THÔNG TIN CHI TIẾT &amp; TƯ VẤN KỸ THUẬT</h4>
                </div>
                <p className="custom-article-paragraph">
                  {priceQuote?.articleBelow?.trim() ||
                    "Lưu ý: Báo giá trên áp dụng cho công trình tại khu vực Đà Nẵng và các tỉnh lân cận. Khách hàng lắp đặt số lượng lớn hoặc dự án công trình sẽ nhận được mức chiết khấu ưu đãi đặc biệt. Để được tư vấn chi tiết và khảo sát đo đạc miễn phí tận nơi, Quý khách vui lòng liên hệ Hotline/Zalo kỹ thuật: 0904.678.323."}
                </p>
              </div>

              {/* 4. KHU VỰC "LỰA CHỌN THÊM" (PHỤ KIỆN & NÂNG CẤP) */}
              <div className="technical-addons-section">
                <div className="addons-section-title-bar">
                  <Sparkles size={18} className="gold-icon" />
                  <h3>LỰA CHỌN THÊM</h3>
                </div>
                <div className="addons-technical-content">
                  {(priceQuote?.addons && priceQuote.addons.length > 0 ? priceQuote.addons : [
                    { category: "Ray Inox đặc chìm", name: "Ray Inox đặc 201 chìm", price: "+ 280.000 đồng/md", unit: "md" },
                    { category: "Ray Inox đặc chìm", name: "Ray Inox đặc 304 chìm", price: "+ 350.000 đồng/md", unit: "md" },
                    { category: "Ray Inox đặc nổi", name: "Ray Inox đặc 201 nổi", price: "+ 330.000 đồng/md", unit: "md" },
                    { category: "Ray Inox đặc nổi", name: "Ray Inox đặc 304 nổi", price: "+ 400.000 đồng/md", unit: "md" },
                    { category: "Trụ khóa an toàn", name: "Trụ khóa cửa 1 cánh", price: "+ 50.000 đồng/m dài", unit: "m dài" }
                  ]).map((addon, aIdx) => (
                    <div key={aIdx} className="addon-line-item">
                      <div className="addon-title-wrap">
                        <span className="addon-stt">{aIdx + 1}.</span>
                        <strong className="addon-name">{addon.name}</strong>
                        {addon.category && <span className="addon-cat-tag">({addon.category})</span>}
                      </div>
                      <div className="addon-price-wrap">
                        <span className="addon-price-tag">{addon.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. KHU VỰC LIÊN HỆ BÁO GIÁ (CTA NỔI BẬT) */}
              <div className="pricing-cta-highlight-banner">
                <div className="cta-banner-content">
                  <div className="cta-badge">TƯ VẤN &amp; KHẢO SÁT TẬN CÔNG TRÌNH</div>
                  <h2>Bạn cần báo giá chính xác cho công trình của mình?</h2>
                  <p>
                    Kỹ sư Boss Đà Nẵng sẵn sàng đến trực tiếp công trình đo đạc thực tế và lên bảng dự toán trọn gói hoàn toàn <strong>MIỄN PHÍ</strong>.
                  </p>
                  <div className="cta-buttons-group">
                    <a 
                      href="https://zalo.me/0904678323" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-cta-quote"
                    >
                      <MessageCircle size={18} /> YÊU CẦU BÁO GIÁ ZALO
                    </a>
                    <a href="tel:0904678323" className="btn-cta-hotline-call">
                      <PhoneCall size={18} /> GỌI TƯ VẤN: 0904.678.323
                    </a>
                    <a 
                      href="https://zalo.me/0904678323" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-cta-zalo"
                    >
                      <MessageCircle size={18} /> LIÊN HỆ ZALO
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </article>
        ) : (
          <>
            {/* 2. PRODUCT SUMMARY CARD (FALLBACK) */}
            <section className="pricing-product-hero">
              <div className="hero-image-column">
                <div className="pricing-img-wrapper">
                  <img src={priceQuote?.image || priceQuote?.imageUrl || product?.image} alt={product?.title || priceQuote?.productTitle || "Bảng giá"} />
                  <span className="pricing-code-pill">MÃ: {product?.code || priceQuote?.productCode}</span>
                </div>
              </div>

              <div className="hero-info-column">
                <div className="pricing-cat-tag">
                  BẢNG BÁO GIÁ CHÍNH HÃNG 2026
                </div>
                <h1 className="pricing-product-title">{product.title}</h1>

                <p className="pricing-desc-text">
                  {product.details || product.description}
                </p>

                {product.specs && product.specs.length > 0 && (
                  <div className="pricing-specs-tags">
                    {product.specs.map((sp, idx) => {
                      const displaySp = sanitizeSpec(sp);
                      return (
                        <span key={idx} className="spec-tag-item">
                          <Check size={12} className="check-icon" /> {displaySp}
                        </span>
                      );
                    })}
                  </div>
                )}

                <div className="pricing-cta-actions">
                  <a 
                    href="https://zalo.me/0904678323" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-request-quote-now"
                  >
                    <MessageCircle size={18} /> YÊU CẦU BÁO GIÁ ZALO
                  </a>
                  <a href="tel:0904678323" className="btn-call-hotline-now">
                    <PhoneCall size={18} /> GỌI: 0904.678.323
                  </a>
                  <Link 
                    to={`/san-pham/${getProductSlug(product)}`} 
                    state={{ product }}
                    className="btn-view-tech-specs"
                  >
                    Chi tiết kỹ thuật <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </section>

            {/* 3. BẢNG BÁO GIÁ KỸ THUẬT CHUYÊN NGHIỆP */}
            <section className="pricing-table-section">
              <div className="section-head-bar">
                <div className="head-badge">BẢNG BÁO GIÁ KỸ THUẬT CHÍNH THỨC</div>
                <h2 className="technical-main-title">
                  {priceQuote?.title || `Bảng Giá Cập Nhật ${product.title} 2026 Tại Đà Nẵng`}
                </h2>
                <p className="technical-sub-note">
                  Bảng giá niêm yết theo quy chuẩn kỹ thuật nhà sản xuất, phân cấp chi tiết theo từng khoảng diện tích m² thi công:
                </p>
              </div>

              {/* BÀI VIẾT / GIỚI THIỆU PHÍA TRÊN BẢNG GIÁ (LUÔN ĐỒNG BỘ HIỂN THỊ) */}
              <div className="pricing-custom-article-box above-quote-article">
                <p className="custom-article-paragraph">
                  {priceQuote?.articleAbove?.trim() ||
                    "BossDoor Đà Nẵng trân trọng gửi đến Quý khách hàng bảng báo giá chi tiết, mới nhất năm 2026. Các dòng sản phẩm được sản xuất trên dây chuyền hiện đại, tiêu chuẩn chất lượng cao, bền bỉ và an toàn tuyệt đối cho mọi công trình."}
                </p>
              </div>

              {/* BẢNG GIÁ KỸ THUẬT ĐỒNG BỘ 100% VỚI ADMIN */}
              <div className="technical-table-container-card">
                <div className="admin-table-scroll-wrapper">
                  <table className="admin-quote-data-table customer-quote-table">
                    <thead>
                      <tr>
                        {activeColumns.map((col, cIdx) => {
                          const isImg = isImageCol(col);
                          const isStt = col.key === "stt" || col.id === "col_1" || col.label?.toLowerCase() === "stt";
                          const isCode = col.key === "code" || col.id === "col_2" || col.label?.toLowerCase().includes("mã");
                          const isPrice =
                            col.key?.toLowerCase().includes("price") ||
                            col.id === "col_6" ||
                            col.id === "col_7" ||
                            col.id === "col_8" ||
                            col.label?.toLowerCase().includes("giá") ||
                            col.label?.toLowerCase().includes("đơn giá");
                          const colWidth = col.width || (isStt ? "50px" : isCode ? "88px" : isImg ? "90px" : "130px");

                          return (
                            <th
                              key={col.id || cIdx}
                              style={{
                                width: colWidth,
                                minWidth: isStt ? "45px" : isCode ? "75px" : isImg ? "80px" : "110px",
                                textAlign: isStt || isCode || isImg ? "center" : isPrice ? "center" : "left"
                              }}
                              className={isPrice ? "price-head highlight-head" : ""}
                            >
                              {col.label}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {quoteTableItems.map((row, rIdx) => {
                        const isCurrentProduct = 
                          product?.code && 
                          (product.code.toUpperCase() === row?.code?.toUpperCase() || 
                           row?.code?.toUpperCase()?.includes(product.code.toUpperCase()));

                        return (
                          <tr key={rIdx} className={isCurrentProduct ? "highlight-current-row" : ""}>
                            {activeColumns.map((col, cIdx) => {
                              const isImg = isImageCol(col);
                              const isStt = col.key === "stt" || col.id === "col_1" || col.label?.toLowerCase() === "stt";
                              const isCode = col.key === "code" || col.id === "col_2" || col.label?.toLowerCase().includes("mã");
                              const isPrice =
                                col.key?.toLowerCase().includes("price") ||
                                col.id === "col_6" ||
                                col.id === "col_7" ||
                                col.id === "col_8" ||
                                col.label?.toLowerCase().includes("giá") ||
                                col.label?.toLowerCase().includes("đơn giá");
                              const isUnit = col.key === "unit" || col.id === "col_4" || col.label?.toLowerCase().includes("đvt");

                              let cellVal = "";
                              if (row.rawGridCells && row.rawGridCells[col.id] !== undefined && row.rawGridCells[col.id] !== "") {
                                cellVal = row.rawGridCells[col.id];
                              } else if (row[col.id] !== undefined && row[col.id] !== "") {
                                cellVal = row[col.id];
                              } else if (col.key && row[col.key] !== undefined && row[col.key] !== "") {
                                cellVal = row[col.key];
                              } else if (isStt) {
                                cellVal = row.stt || rIdx + 1;
                              } else if (isCode) {
                                cellVal = row.code || "";
                              } else if (isImg) {
                                cellVal = row.image || row.imageUrl || "";
                              } else if (isUnit) {
                                cellVal = row.unit || "m2";
                              } else if (isPrice) {
                                const priceCols = activeColumns.filter(
                                  (c) =>
                                    c.key?.toLowerCase().includes("price") ||
                                    c.id === "col_6" ||
                                    c.id === "col_7" ||
                                    c.id === "col_8" ||
                                    c.label?.toLowerCase().includes("giá") ||
                                    c.label?.toLowerCase().includes("đơn giá")
                                );
                                const pIdx = priceCols.findIndex((c) => c.id === col.id);
                                if (pIdx === 0) cellVal = row.priceOver8 || row.price || "Liên hệ";
                                else if (pIdx === 1) cellVal = row.price6to8 || "Liên hệ";
                                else if (pIdx === 2) cellVal = row.price4to6 || "Liên hệ";
                                else cellVal = row[col.id] || "Liên hệ";
                              } else {
                                cellVal = row.name || row.description || "";
                              }

                              if (isImg) {
                                return (
                                  <td key={col.id || cIdx} className="cell-client-img text-center">
                                    {cellVal ? (
                                      <img
                                        src={cellVal}
                                        alt={`SP ${rIdx + 1}`}
                                        className="client-table-thumb"
                                        onError={(e) => { e.target.style.display = "none"; }}
                                      />
                                    ) : (
                                      <span className="cell-empty-dash">—</span>
                                    )}
                                  </td>
                                );
                              }

                              if (isStt) {
                                return (
                                  <td key={col.id || cIdx} className="cell-client-stt text-center font-bold">
                                    {cellVal || rIdx + 1}
                                  </td>
                                );
                              }

                              if (isCode) {
                                return (
                                  <td key={col.id || cIdx} className="cell-client-code text-center">
                                    <span className="client-code-badge">{cellVal}</span>
                                  </td>
                                );
                              }

                              if (isPrice) {
                                const displayStr = cellVal
                                  ? cellVal.includes("đ") || isNaN(Number(cellVal.replace(/[,.]/g, "")))
                                    ? cellVal
                                    : `${cellVal} đ/m²`
                                  : "Liên hệ";
                                return (
                                  <td key={col.id || cIdx} className="cell-client-price text-center">
                                    <span className="client-price-text">{displayStr}</span>
                                  </td>
                                );
                              }

                              if (isUnit) {
                                return (
                                  <td key={col.id || cIdx} className="cell-client-unit text-center">
                                    <span className="client-unit-text">{cellVal}</span>
                                  </td>
                                );
                              }

                              return (
                                <td key={col.id || cIdx} className="cell-client-desc">
                                  <div className="client-desc-text">{cellVal}</div>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* BÀI VIẾT CHI TIẾT & TƯ VẤN PHÍA DƯỚI BẢNG GIÁ (LUÔN ĐỒNG BỘ HIỂN THỊ) */}
              <div className="pricing-custom-article-box below-quote-article">
                <div className="custom-article-header">
                  <Sparkles size={16} className="sparkle-gold-icon" />
                  <h4>THÔNG TIN CHI TIẾT &amp; TƯ VẤN KỸ THUẬT</h4>
                </div>
                <p className="custom-article-paragraph">
                  {priceQuote?.articleBelow?.trim() ||
                    "Lưu ý: Báo giá trên áp dụng cho công trình tại khu vực Đà Nẵng và các tỉnh lân cận. Khách hàng lắp đặt số lượng lớn hoặc dự án công trình sẽ nhận được mức chiết khấu ưu đãi đặc biệt. Để được tư vấn chi tiết và khảo sát đo đạc miễn phí tận nơi, Quý khách vui lòng liên hệ Hotline/Zalo kỹ thuật: 0904.678.323."}
                </p>
              </div>

              {/* 4. KHU VỰC "LỰA CHỌN THÊM" (PHỤ KIỆN & NÂNG CẤP) */}
              <div className="technical-addons-section">
                <div className="addons-section-title-bar">
                  <Sparkles size={18} className="gold-icon" />
                  <h3>LỰA CHỌN THÊM</h3>
                </div>
                <div className="addons-technical-content">
                  {(priceQuote?.addons && priceQuote.addons.length > 0 ? priceQuote.addons : [
                    { category: "Ray Inox đặc chìm", name: "Ray Inox đặc 201 chìm", price: "+ 280.000 đồng/md", unit: "md" },
                    { category: "Ray Inox đặc chìm", name: "Ray Inox đặc 304 chìm", price: "+ 350.000 đồng/md", unit: "md" },
                    { category: "Ray Inox đặc nổi", name: "Ray Inox đặc 201 nổi", price: "+ 330.000 đồng/md", unit: "md" },
                    { category: "Ray Inox đặc nổi", name: "Ray Inox đặc 304 nổi", price: "+ 400.000 đồng/md", unit: "md" },
                    { category: "Trụ khóa an toàn", name: "Trụ khóa cửa 1 cánh", price: "+ 50.000 đồng/m dài", unit: "m dài" }
                  ]).map((addon, aIdx) => (
                    <div key={aIdx} className="addon-line-item">
                      <div className="addon-title-wrap">
                        <span className="addon-stt">{aIdx + 1}.</span>
                        <strong className="addon-name">{addon.name}</strong>
                        {addon.category && <span className="addon-cat-tag">({addon.category})</span>}
                      </div>
                      <div className="addon-price-wrap">
                        <span className="addon-price-tag">{addon.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. KHU VỰC LIÊN HỆ BÁO GIÁ (CTA NỔI BẬT) */}
              <div className="pricing-cta-highlight-banner">
                <div className="cta-banner-content">
                  <div className="cta-badge">TƯ VẤN &amp; KHẢO SÁT TẬN CÔNG TRÌNH</div>
                  <h2>Bạn cần báo giá chính xác cho công trình của mình?</h2>
                  <p>
                    Kỹ sư Boss Đà Nẵng sẵn sàng đến trực tiếp công trình đo đạc thực tế và lên bảng dự toán trọn gói hoàn toàn <strong>MIỄN PHÍ</strong>.
                  </p>
                  <div className="cta-buttons-group">
                    <a 
                      href="https://zalo.me/0904678323" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-cta-quote"
                    >
                      <MessageCircle size={18} /> YÊU CẦU BÁO GIÁ ZALO
                    </a>
                    <a href="tel:0904678323" className="btn-cta-hotline-call">
                      <PhoneCall size={18} /> GỌI TƯ VẤN: 0904.678.323
                    </a>
                    <a 
                      href="https://zalo.me/0904678323" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-cta-zalo"
                    >
                      <MessageCircle size={18} /> LIÊN HỆ ZALO
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* 5. POLICIES & COMMITMENTS */}
        <section className="pricing-policies-section">
          <div className="policies-grid">
            <div className="policy-box">
              <div className="policy-icon"><ShieldCheck size={28} /></div>
              <h3>Chính Sách Bảo Hành</h3>
              <p>Thân cửa bảo hành từ 5 đến 10 năm; động cơ mô tơ bảo hành 2 - 5 năm 1 đổi 1. Bảo trì kỹ thuật định kỳ miễn phí.</p>
            </div>
            <div className="policy-box">
              <div className="policy-icon"><Truck size={28} /></div>
              <h3>Vận Chuyển Miễn Phí</h3>
              <p>Miễn phí 100% cước vận chuyển đến tận chân công trình tại Hải Châu, Thanh Khê, Sơn Trà, Ngũ Hành Sơn, Liên Chiểu, Cẩm Lệ.</p>
            </div>
            <div className="policy-box">
              <div className="policy-icon"><Wrench size={28} /></div>
              <h3>Lắp Đặt Chuẩn Kỹ Thuật 24H</h3>
              <p>Đội ngũ kỹ sư tay nghề trên 8 năm kinh nghiệm, thi công nhanh gọn, kiểm tra laser cân bằng và bàn giao nghiệm thu chu đáo.</p>
            </div>
          </div>
        </section>

        {/* 6. RELATED PRICING ARTICLES / BẢNG GIÁ LIÊN QUAN */}
        {relatedPriceQuotes.length > 0 && (
          <section className="related-pricing-section">
            <div className="related-compact-grid">
              {relatedPriceQuotes.map((item, idx) => (
                <article
                  key={idx}
                  className="related-compact-card"
                  onClick={() => navigate(item.path)}
                >
                  {/* Hình ảnh nhỏ ở phía bên góc trái */}
                  <div className="related-thumb-box">
                    <img src={item.image} alt={item.title} loading="lazy" />
                  </div>

                  {/* Chữ bên cột phải */}
                  <div className="related-content-col">
                    <div className="related-meta-tags">
                      <span className="related-cat-pill">{item.categoryName}</span>
                      <span className="related-code-pill">MÃ: {item.code}</span>
                    </div>

                    <h3 className="related-title-text">
                      <Link
                        to={item.path}
                        className="related-title-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {item.title}
                      </Link>
                    </h3>

                    <div className="related-action-row">
                      <Link
                        to={item.path}
                        className="related-link-action"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Tag size={13} className="related-tag-icon" />
                        <span>Bảng giá</span>
                        <ArrowRight size={13} className="related-arrow-icon" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* 7. GUARANTEE BAR */}
        <section className="pricing-guarantee-bar">
          <div className="guarantee-item">
            <div className="g-icon-box">
              <ShieldCheck size={18} className="g-icon" />
            </div>
            <div className="g-text">
              <h4>CHÍNH HÃNG 100%</h4>
              <p>Đầy đủ C/O, C/Q</p>
            </div>
          </div>
          <div className="guarantee-item">
            <div className="g-icon-box gold">
              <CheckCircle2 size={18} className="g-icon gold" />
            </div>
            <div className="g-text">
              <h4>BẢO HÀNH 10 NĂM</h4>
              <p>Tận nơi, hỗ trợ 24/7</p>
            </div>
          </div>
          <div className="guarantee-item">
            <div className="g-icon-box red">
              <Star size={18} className="g-icon red" />
            </div>
            <div className="g-text">
              <h4>LẮP ĐẶT 24H</h4>
              <p>Nhanh gọn, chuẩn kỹ thuật</p>
            </div>
          </div>
          <div className="guarantee-item">
            <div className="g-icon-box teal">
              <HeadphonesIcon size={18} className="g-icon teal" />
            </div>
            <div className="g-text">
              <h4>TƯ VẤN MIỄN PHÍ</h4>
              <p>Khảo sát tận nơi 0đ</p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

