import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  Users, Package, FolderKanban, CheckCircle, Trash2, Plus, Edit,
  RefreshCw, X, Shield, Phone, ArrowLeft, LayoutDashboard, Database,
  Newspaper, Search, Eye, Tag, FileText, Check, Menu, LogOut, Sparkles, FileSpreadsheet, FileEdit,
  Wrench, Upload, Image as ImageIcon, ExternalLink, Filter, RotateCcw, Loader2,
  Star, BadgeCheck, Video as VideoIcon, AlertCircle, Layers
} from "lucide-react";
import AdminCategorySeo from "../components/AdminCategorySeo";
import AdminPriceQuote from "../components/AdminPriceQuote";
import AdminProductArticleEditor from "../components/AdminProductArticleEditor";
import AdminProjectArticleEditor, { SAMPLE_PROJECT_TEMPLATE } from "../components/AdminProjectArticleEditor";
import AdminNewsArticleEditor, { SAMPLE_NEWS_TEMPLATE } from "../components/AdminNewsArticleEditor";
import AdminProductQuickInfoCard from "../components/AdminProductQuickInfoCard";
import { getProductCardDescription } from "../utils/productDescriptionHelper";
import { formatProductPrice } from "../utils/priceFormatter";
import { useAuth } from "../context/AuthContext";
import { slugify } from "../utils/slug.js";
import { matchKeywords, extractSearchableText } from "../utils/searchHelper";
import { DEFAULT_SERVICES as DEFAULT_SAMPLE_SERVICES } from "../data/defaultServices";
import { compressImage } from "../utils/imageCompressor";
import { sortByNewest } from "../utils/sortHelper";
import "./Admin.css";

const DEFAULT_SAMPLE_REVIEWS = [
  {
    id: 1,
    name: "Anh Nguyễn Văn Hùng",
    email: "hung.nv@gmail.com",
    role: "",
    avatar: "H",
    rating: 5,
    text: "Lắp cửa cuốn cho garage nhà mình, nhân viên tư vấn rất nhiệt tình và chuyên nghiệp. Thi công nhanh gọn chỉ trong 1 buổi sáng. Cửa vận hành êm, đẹp hơn mình tưởng. Rất hài lòng!",
    color: "#07522f",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    verified: true,
    createdAt: "2026-11-10T08:00:00.000Z"
  },
  {
    id: 2,
    name: "Chị Trần Thị Lan",
    email: "lan.tran@gmail.com",
    role: "",
    avatar: "L",
    rating: 5,
    text: "Mình đã lắp cửa kéo inox cho shop thời trang. Chất lượng vượt kỳ vọng, inox sáng bóng, kéo rất nhẹ. Khách vào hay khen cửa đẹp. Boss Đà Nẵng làm việc uy tín, bảo hành chu đáo.",
    color: "#b45309",
    verified: true,
    createdAt: "2026-11-09T08:00:00.000Z"
  },
  {
    id: 3,
    name: "Anh Lê Minh Tú",
    email: "tu.le.kts@gmail.com",
    role: "",
    avatar: "T",
    rating: 5,
    text: "Tôi giới thiệu Boss Đà Nẵng cho nhiều dự án rồi. Họ có đủ loại cửa từ phổ thông đến cao cấp, báo giá minh bạch, không phát sinh. Đặc biệt đội thi công làm đúng bản vẽ kỹ thuật.",
    color: "#1d4ed8",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80",
    verified: true,
    createdAt: "2026-11-08T08:00:00.000Z"
  },
  {
    id: 4,
    name: "Chị Phạm Thu Hà",
    email: "thuha.pham@gmail.com",
    role: "",
    avatar: "H",
    rating: 5,
    text: "Lắp cửa trượt tự động cho công ty, cảm biến rất nhạy và êm ái. Nhân viên kỹ thuật hướng dẫn sử dụng tận tình. Sau 6 tháng dùng vẫn hoạt động tốt. Sẽ tiếp tục ủng hộ Boss!",
    color: "#7c3aed",
    verified: true,
    createdAt: "2026-11-07T08:00:00.000Z"
  },
  {
    id: 5,
    name: "Anh Đặng Quốc Bảo",
    email: "baodang.res@gmail.com",
    role: "",
    avatar: "B",
    rating: 5,
    text: "Boss tư vấn lắp barrier tự động cho bãi xe nhà hàng. Hệ thống chạy ổn định, dùng thẻ từ rất tiện. Giá cả cạnh tranh so với thị trường. Nhân viên phản hồi nhanh khi cần hỗ trợ.",
    color: "#0e7490",
    verified: true,
    createdAt: "2026-11-06T08:00:00.000Z"
  }
];

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
    "Cửa kính cường lực"
  ]
};

export default function Admin() {
  const { currentUser, logout, isAdmin } = useAuth();

  // Phân quyền tuyệt đối: Chỉ duy nhất admin@boss.vn mới có quyền vào trang quản trị
  if (!currentUser || currentUser.email?.toLowerCase().trim() !== "admin@boss.vn") {
    return <Navigate to="/" replace />;
  }

  const [activeTab, setActiveTab] = useState("contacts");
  const [productSubTab, setProductSubTab] = useState("list"); // "list" | "editor"
  const [editingArticleCode, setEditingArticleCode] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data states
  const [contacts, setContacts] = useState([]);
  const [products, setProducts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [news, setNews] = useState([]);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Search states
  const [productSearch, setProductSearch] = useState("");
  const [projectSearch, setProjectSearch] = useState("");
  const [newsSearch, setNewsSearch] = useState("");
  const [contactSearch, setContactSearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");
  const [reviewSearch, setReviewSearch] = useState("");
  const [contactFilter, setContactFilter] = useState("all"); // "all" | "service" | "product"
  const [reviewRatingFilter, setReviewRatingFilter] = useState("all"); // "all" | "5" | "4" | "3" | "has_media"
  const [viewingReview, setViewingReview] = useState(null); // Modal chỉ xem chi tiết (không sửa)

  // Modals state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = add, object = edit

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const projectFormRef = useRef(null);

  const [showNewsForm, setShowNewsForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const newsFormRef = useRef(null);

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isUploadingServiceImg, setIsUploadingServiceImg] = useState(false);
  const [isUploadingProductImg, setIsUploadingProductImg] = useState(false);
  const [isUploadingProjectImg, setIsUploadingProjectImg] = useState(false);

  // Form states
  const initialProductState = {
    title: "",
    code: "",
    category: "cuacuon",
    subCategory: "Cửa cuốn khe thoáng Đức",
    image: "",
    description: "",
    specs: "Hợp kim nhôm 6063-T5, Bảo hành 5 năm",
    badge: "",
    price: "1.500.000đ/m2"
  };

  const initialProjectState = {
    title: "",
    category: "Cửa Cuốn Khe Thoáng",
    location: "Đà Nẵng",
    completedDate: "",
    image: "",
    images: [],
    gallery: [],
    description: "",
    content: ""
  };

  const initialNewsState = {
    title: "",
    slug: "",
    category: "Tư vấn & Kinh nghiệm",
    image: "",
    date: new Date().toLocaleDateString("vi-VN"),
    summary: "",
    content: "",
    author: "BOSS Đà Nẵng"
  };

  const initialServiceState = {
    title: "",
    date: new Date().toLocaleDateString("vi-VN"),
    img: "/service_repair_247.png",
    desc: "",
    content: "",
    order: 0,
    phone: "0904.678.323"
  };

  const [productForm, setProductForm] = useState(initialProductState);
  const [isCustomSubCategory, setIsCustomSubCategory] = useState(false);
  const [projectForm, setProjectForm] = useState(initialProjectState);
  const [projectUrlInput, setProjectUrlInput] = useState("");
  const [newsForm, setNewsForm] = useState(initialNewsState);
  const [serviceForm, setServiceForm] = useState(initialServiceState);

  // Danh sách loại sản phẩm kết hợp giữa chuẩn mặc định và các loại do admin tự nhập
  const availableSubCategories = useMemo(() => {
    const list = [...(SUBCATEGORIES[productForm.category] || [])];
    if (Array.isArray(products)) {
      products.forEach((p) => {
        if (
          p.category === productForm.category &&
          p.subCategory &&
          !list.includes(p.subCategory)
        ) {
          list.push(p.subCategory);
        }
      });
    }
    return list;
  }, [productForm.category, products]);

  // Notification Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Helper formatting image source
  const formatImgSrc = (src) => {
    if (!src) return '/service_repair_247.png';
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
      return src;
    }
    if (src.startsWith('/uploads')) {
      const backendBase = import.meta.env.VITE_API_URL || '';
      return `${backendBase}${src}`;
    }
    return src;
  };

  // Fetch all data from MongoDB Backend
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resC, resP, resPr, resN, resS, resR] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/contacts`).catch(() => null),
        fetch(`${import.meta.env.VITE_API_URL}/api/products`).catch(() => null),
        fetch(`${import.meta.env.VITE_API_URL}/api/projects`).catch(() => null),
        fetch(`${import.meta.env.VITE_API_URL}/api/news`).catch(() => null),
        fetch(`${import.meta.env.VITE_API_URL}/api/services`).catch(() => null),
        fetch(`${import.meta.env.VITE_API_URL}/api/reviews`).catch(() => null)
      ]);

      const dataC = resC && resC.ok ? await resC.json().catch(() => null) : null;
      const dataP = resP && resP.ok ? await resP.json().catch(() => null) : null;
      const dataPr = resPr && resPr.ok ? await resPr.json().catch(() => null) : null;
      const dataN = resN && resN.ok ? await resN.json().catch(() => null) : null;
      const dataS = resS && resS.ok ? await resS.json().catch(() => null) : null;
      const dataR = resR && resR.ok ? await resR.json().catch(() => null) : null;

      if (dataC && dataC.success) {
        // Tách biệt hoàn toàn: Yêu cầu báo giá chỉ chứa liên hệ tư vấn sản phẩm & dịch vụ, không chứa đánh giá
        const pureContacts = (dataC.data || []).filter(
          (c) => !c.productCategory?.toLowerCase().includes("đánh giá")
        );
        setContacts(pureContacts);
      }
      if (dataP && dataP.success) setProducts(dataP.data);
      let localProjects = [];
      try {
        const localPr = localStorage.getItem("boss_admin_projects");
        if (localPr) {
          const parsed = JSON.parse(localPr);
          if (Array.isArray(parsed)) localProjects = parsed.filter(p => p && typeof p === 'object');
        }
      } catch (_) { }

      if (dataPr && dataPr.success && Array.isArray(dataPr.data) && dataPr.data.length > 0) {
        const validApi = dataPr.data.filter(p => p && typeof p === 'object');
        // Hợp nhất dữ liệu API với localStorage để luôn bảo lưu bài viết người dùng đã lưu
        const merged = validApi.map((apiP) => {
          const apiId = String(apiP._id || apiP.id || '').trim();
          const apiTitle = String(apiP.title || '').trim().toLowerCase();

          const localMatch = localProjects.find((lp) => {
            if (!lp) return false;
            const lpId = String(lp._id || lp.id || '').trim();
            const lpTitle = String(lp.title || '').trim().toLowerCase();
            if (apiId && lpId && apiId === lpId) return true;
            if (apiTitle && lpTitle && apiTitle === lpTitle) return true;
            return false;
          });

          if (localMatch) {
            return {
              ...apiP,
              ...localMatch,
              content: (typeof localMatch.content === 'string' && localMatch.content.trim())
                ? localMatch.content
                : (typeof apiP.content === 'string' ? apiP.content : "")
            };
          }
          return apiP;
        });

        // Bổ sung các dự án chỉ có trên localStorage
        localProjects.forEach((lp) => {
          if (!lp) return;
          const lpId = String(lp._id || lp.id || '').trim();
          const lpTitle = String(lp.title || '').trim().toLowerCase();

          const exists = merged.some((p) => {
            if (!p) return false;
            const pId = String(p._id || p.id || '').trim();
            const pTitle = String(p.title || '').trim().toLowerCase();
            if (pId && lpId && pId === lpId) return true;
            if (pTitle && lpTitle && pTitle === lpTitle) return true;
            return false;
          });
          if (!exists) merged.push(lp);
        });

        // Sắp xếp bài viết mới nhất lên đầu tiên
        merged.sort(sortByNewest);

        setProjects(merged);
        localStorage.setItem("boss_admin_projects", JSON.stringify(merged));
      } else if (localProjects.length > 0) {
        localProjects.sort(sortByNewest);
        setProjects(localProjects);
      }
      let localNews = [];
      try {
        const localN = localStorage.getItem("boss_admin_news");
        if (localN) {
          const parsed = JSON.parse(localN);
          if (Array.isArray(parsed)) localNews = parsed.filter(n => n && typeof n === 'object');
        }
      } catch (_) { }

      if (dataN && dataN.success && Array.isArray(dataN.data) && dataN.data.length > 0) {
        const validApi = dataN.data.filter(n => n && typeof n === 'object');
        const mergedNews = validApi.map((apiN) => {
          const apiId = String(apiN._id || apiN.id || '').trim();
          const apiTitle = String(apiN.title || '').trim().toLowerCase();

          const localMatch = localNews.find((ln) => {
            if (!ln) return false;
            const lnId = String(ln._id || ln.id || '').trim();
            const lnTitle = String(ln.title || '').trim().toLowerCase();
            if (apiId && lnId && apiId === lnId) return true;
            if (apiTitle && lnTitle && apiTitle === lnTitle) return true;
            return false;
          });

          if (localMatch) {
            return {
              ...apiN,
              ...localMatch,
              content: (typeof localMatch.content === 'string' && localMatch.content.trim())
                ? localMatch.content
                : (typeof apiN.content === 'string' ? apiN.content : "")
            };
          }
          return apiN;
        });

        localNews.forEach((ln) => {
          if (!ln) return;
          const lnId = String(ln._id || ln.id || '').trim();
          const lnTitle = String(ln.title || '').trim().toLowerCase();
          const exists = mergedNews.some((n) => {
            if (!n) return false;
            const nId = String(n._id || n.id || '').trim();
            const nTitle = String(n.title || '').trim().toLowerCase();
            if (nId && lnId && nId === lnId) return true;
            if (nTitle && lnTitle && nTitle === lnTitle) return true;
            return false;
          });
          if (!exists) mergedNews.push(ln);
        });

        mergedNews.sort(sortByNewest);
        setNews(mergedNews);
        localStorage.setItem("boss_admin_news", JSON.stringify(mergedNews));
      } else if (localNews.length > 0) {
        localNews.sort(sortByNewest);
        setNews(localNews);
      } else if (dataN && dataN.success && Array.isArray(dataN.data)) {
        const sortedNews = [...dataN.data].sort(sortByNewest);
        setNews(sortedNews);
      }

      let loadedServices = [];
      if (dataS && dataS.success && Array.isArray(dataS.data) && dataS.data.length > 0) {
        loadedServices = dataS.data;
      } else {
        const local = localStorage.getItem("boss_admin_services");
        if (local) {
          try {
            const parsed = JSON.parse(local);
            if (Array.isArray(parsed) && parsed.length > 0) loadedServices = parsed;
          } catch (e) {
            console.error("Parse local services error:", e);
          }
        }
        if (loadedServices.length === 0) {
          loadedServices = DEFAULT_SAMPLE_SERVICES;
        }
      }
      setServices(loadedServices);
      localStorage.setItem("boss_admin_services", JSON.stringify(loadedServices));

      // Reviews: Hybrid MongoDB backend + localStorage fallback
      let loadedReviews = [];
      if (dataR && dataR.success && Array.isArray(dataR.data) && dataR.data.length > 0) {
        loadedReviews = dataR.data;
      } else {
        const localR = localStorage.getItem("boss_customer_reviews");
        if (localR) {
          try {
            const parsedR = JSON.parse(localR);
            if (Array.isArray(parsedR) && parsedR.length > 0) loadedReviews = parsedR;
          } catch (e) {
            console.error("Parse local reviews error:", e);
          }
        }
        if (loadedReviews.length === 0) {
          loadedReviews = DEFAULT_SAMPLE_REVIEWS;
        }
      }
      setReviews(loadedReviews);
      try {
        localStorage.setItem("boss_customer_reviews", JSON.stringify(loadedReviews));
      } catch (_) { }

      // Auto-sync with backend if backend DB is empty
      if (dataS && dataS.success && Array.isArray(dataS.data) && dataS.data.length === 0) {
        try {
          fetch(`${import.meta.env.VITE_API_URL}/api/services/seed`, { method: "POST" })
            .catch(() => { });
        } catch (_) { }
      }
    } catch (err) {
      console.error("Admin Fetch Error:", err);
      showToast("❌ Lỗi khi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.classList.add("admin-mode");
    return () => {
      document.body.classList.remove("admin-mode");
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  // ----------------------------------------------------
  // CONTACT HANDLERS
  // ----------------------------------------------------
  const handleUpdateContactStatus = async (id, status) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/contacts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setContacts(contacts.map(c => c._id === id ? { ...c, status } : c));
        showToast("✅ Đã cập nhật trạng thái yêu cầu!");
      }
    } catch (err) {
      console.error("Update contact error:", err);
      showToast("❌ Lỗi khi cập nhật trạng thái");
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa yêu cầu tư vấn này?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/contacts/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setContacts(contacts.filter(c => c._id !== id));
        showToast("🗑️ Đã xóa yêu cầu tư vấn thành công");
      }
    } catch (err) {
      console.error("Delete contact error:", err);
      showToast("❌ Lỗi khi xóa yêu cầu");
    }
  };

  // ----------------------------------------------------
  // PRODUCT HANDLERS (ADD & EDIT & DELETE)
  // ----------------------------------------------------
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setEditingArticleCode("NEW");
    setProductSubTab("editor");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenEditProduct = (product) => {
    setEditingProduct(product);
    const cat = product.category || "cuacuon";
    const subCat = product.subCategory || "Cửa cuốn khe thoáng Đức";
    const isStandard = SUBCATEGORIES[cat]?.includes(subCat);
    setIsCustomSubCategory(!isStandard && Boolean(subCat));
    setProductForm({
      title: product.title || "",
      code: product.code || "",
      category: cat,
      subCategory: subCat,
      image: product.image || "",
      description: product.description || "",
      specs: Array.isArray(product.specs) ? product.specs.join(", ") : (product.specs || ""),
      badge: product.badge || "",
      price: product.price || ""
    });
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const specsArray = typeof productForm.specs === "string"
        ? productForm.specs.split(",").map(s => s.trim()).filter(Boolean)
        : productForm.specs;

      const finalPrice = productForm.price ? formatProductPrice(productForm.price, productForm.category) : "Liên hệ";
      const payload = {
        ...productForm,
        price: finalPrice,
        specs: specsArray,
        images: productForm.image ? [productForm.image] : [],
        gallery: productForm.image ? [productForm.image] : []
      };
      if (!payload.description || payload.description.includes("là giải pháp tối ưu cho những ai đang tìm kiếm")) {
        const articleExcerpt = getProductCardDescription(productForm);
        if (articleExcerpt) payload.description = articleExcerpt;
      }

      let res, data;
      if (editingProduct) {
        // PUT EDIT
        res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${editingProduct._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        data = await res.json();
        if (data.success) {
          const updated = products.map(p => p._id === editingProduct._id ? data.data : p);
          setProducts(updated);
          try {
            localStorage.setItem("boss_cached_products", JSON.stringify(updated));
            window.dispatchEvent(new CustomEvent("boss_products_updated", { detail: updated }));
          } catch (e) {}
          showToast("✨ Đã cập nhật thông tin sản phẩm thành công!");
        }
      } else {
        // POST ADD
        res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        data = await res.json();
        if (data.success) {
          const updated = [data.data, ...products];
          setProducts(updated);
          try {
            localStorage.setItem("boss_cached_products", JSON.stringify(updated));
            window.dispatchEvent(new CustomEvent("boss_products_updated", { detail: updated }));
          } catch (e) {}
          showToast("🎉 Thêm sản phẩm mới thành công!");
        }
      }

      if (data.success) {
        setShowProductModal(false);
      } else {
        showToast(`❌ Lỗi: ${data.message || "Không thể thực hiện"}`);
      }
    } catch (err) {
      console.error("Product Submit Error:", err);
      showToast("❌ Lỗi khi lưu dữ liệu sản phẩm");
    }
  };

  const handleSaveProductFromEditor = async (payload) => {
    try {
      if (!payload.description || payload.description.includes("là giải pháp tối ưu cho những ai đang tìm kiếm")) {
        const articleExcerpt = getProductCardDescription(payload);
        if (articleExcerpt) payload.description = articleExcerpt;
      }
      let res, data;
      const cleanPayload = { ...payload };
      if (!cleanPayload._id) {
        delete cleanPayload._id;
      }
      if (cleanPayload.price) {
        cleanPayload.price = formatProductPrice(cleanPayload.price, cleanPayload.category);
      }

      if (cleanPayload._id) {
        res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${cleanPayload._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cleanPayload)
        });
        data = await res.json();
        if (data.success) {
          setProducts(prev => {
            const updated = prev.map(p => p._id === cleanPayload._id ? data.data : p);
            try {
              localStorage.setItem("boss_cached_products", JSON.stringify(updated));
              window.dispatchEvent(new CustomEvent("boss_products_updated", { detail: updated }));
            } catch (e) {}
            return updated;
          });
          showToast("✨ Đã cập nhật thông tin sản phẩm thành công!");
        } else {
          showToast(`❌ Lỗi: ${data.message || "Không thể cập nhật sản phẩm"}`);
        }
      } else {
        res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cleanPayload)
        });
        data = await res.json();
        if (data.success) {
          setProducts(prev => {
            const updated = [data.data, ...prev];
            try {
              localStorage.setItem("boss_cached_products", JSON.stringify(updated));
              window.dispatchEvent(new CustomEvent("boss_products_updated", { detail: updated }));
            } catch (e) {}
            return updated;
          });
          showToast("🎉 Thêm sản phẩm mới thành công!");
        } else {
          showToast(`❌ Lỗi: ${data.message || "Không thể tạo sản phẩm"}`);
        }
      }
      return data;
    } catch (err) {
      console.error("Save product from editor error:", err);
      showToast("❌ Lỗi khi lưu thông tin sản phẩm: " + (err.message || "Mất kết nối"));
      throw err;
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        const updated = products.filter(p => p._id !== id);
        setProducts(updated);
        try {
          localStorage.setItem("boss_cached_products", JSON.stringify(updated));
          window.dispatchEvent(new CustomEvent("boss_products_updated", { detail: updated }));
        } catch (e) {}
        showToast("🗑️ Đã xóa sản phẩm thành công!");
      }
    } catch (err) {
      console.error("Delete product error:", err);
      showToast("❌ Lỗi khi xóa sản phẩm");
    }
  };

  // ----------------------------------------------------
  // PROJECT HANDLERS (ADD & EDIT & DELETE & UPLOAD)
  // ----------------------------------------------------
  const handleOpenAddProject = () => {
    setEditingProject(null);
    setProjectForm({
      title: "",
      category: "Cửa Cuốn Khe Thoáng",
      location: "Đà Nẵng",
      completedDate: "",
      image: "",
      images: [],
      gallery: [],
      description: "",
      content: ""
    });
    setProjectUrlInput("");
    setShowProjectForm(true);
    setTimeout(() => {
      projectFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleOpenEditProject = (project) => {
    setEditingProject(project);
    const existingImages = Array.isArray(project.images) && project.images.length > 0
      ? project.images
      : Array.isArray(project.gallery) && project.gallery.length > 0
        ? project.gallery
        : project.image
          ? [project.image]
          : [];

    let currentContent = project.content || "";
    // Nếu project chưa có bài viết HTML riêng (công trình cũ chỉ có phần mô tả ngắn):
    // Tự động nạp phần mô tả cũ và các ảnh có sẵn vào khung soạn thảo để người dùng tiếp tục chỉnh sửa, không bị mất thông tin cũ!
    if (!currentContent.trim()) {
      if (project.description && project.description.trim()) {
        let genHtml = `<p style="line-height: 1.8; color: #334155; margin-bottom: 16px;">${project.description}</p>`;
        existingImages.forEach((imgUrl, i) => {
          genHtml += `
<figure class="project-article-figure" style="text-align: center; margin: 24px 0;">
  <img src="${imgUrl}" alt="Hình ảnh công trình ${i + 1}" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.12); border: 1px solid #cbd5e1;" />
  <figcaption style="margin-top: 8px; font-size: 0.88rem; color: #64748b; font-style: italic; text-align: center;">Hình ảnh ${i + 1}: Thi công thực tế tại công trình</figcaption>
</figure>`;
        });
        currentContent = genHtml;
      }
    }

    setProjectForm({
      title: project.title || "",
      category: project.category || "Cửa Cuốn Khe Thoáng",
      location: project.location || "Đà Nẵng",
      completedDate: project.completedDate || (project.date || ""),
      image: existingImages[0] || project.image || "",
      images: existingImages,
      gallery: existingImages,
      description: project.description || "",
      content: currentContent
    });
    setProjectUrlInput("");
    setShowProjectForm(true);
    setTimeout(() => {
      projectFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Thêm một hoặc nhiều đường link URL ảnh vào danh sách công trình
  const handleAddProjectUrl = () => {
    if (!projectUrlInput.trim()) return;
    const rawUrls = projectUrlInput
      .split(/[\n,\s]+/)
      .map((u) => u.trim())
      .filter((u) => u.length > 0 && (u.startsWith("http://") || u.startsWith("https://") || u.startsWith("/") || u.startsWith("data:")));

    if (rawUrls.length === 0) {
      showToast("⚠️ Vui lòng nhập link ảnh hợp lệ (http://, https://...)");
      return;
    }

    setProjectForm((prev) => {
      const existing = Array.isArray(prev.images) ? [...prev.images] : (prev.image ? [prev.image] : []);
      const combined = [...existing];
      rawUrls.forEach((u) => {
        if (!combined.includes(u)) combined.push(u);
      });
      return {
        ...prev,
        images: combined,
        gallery: combined,
        image: combined[0] || ""
      };
    });
    setProjectUrlInput("");
    showToast(`✨ Đã thêm ${rawUrls.length} ảnh công trình!`);
  };

  // Tải một hoặc nhiều ảnh công trình từ máy tính
  const handleUploadProjectImages = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter((f) => f.type.startsWith("image/"));
    if (validFiles.length === 0) {
      showToast("⚠️ Vui lòng chọn tệp hình ảnh hợp lệ (JPG, PNG, WebP)!");
      return;
    }

    setIsUploadingProjectImg(true);
    try {
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
                const fullUrl = f.url?.startsWith("http") || f.url?.startsWith("data:")
                  ? f.url
                  : `${backendBase}${f.url}`;
                uploadedUrls.push(fullUrl);
              });
            }
          }
        } catch (multiErr) {
          console.warn("Project multi upload error, fallback to single:", multiErr);
        }
      }

      // 2. Tải tuần tự nếu upload multiple chưa có kết quả
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
              if (data.success && (data.url || data.imageUrl)) {
                const rawUrl = data.url || data.imageUrl;
                const finalUrl = rawUrl.startsWith("http") || rawUrl.startsWith("data:")
                  ? rawUrl
                  : `${backendBase}${rawUrl}`;
                uploadedUrls.push(finalUrl);
                continue;
              }
            }
          } catch (singleErr) {
            console.warn("Single upload error, fallback to Base64:", singleErr);
          }

          // Fallback FileReader Base64
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
        setProjectForm((prev) => {
          const existing = Array.isArray(prev.images) ? [...prev.images] : (prev.image ? [prev.image] : []);
          const combined = [...existing];
          uploadedUrls.forEach((u) => {
            if (!combined.includes(u)) combined.push(u);
          });
          return {
            ...prev,
            images: combined,
            gallery: combined,
            image: combined[0] || ""
          };
        });
        showToast(`🎉 Đã tải lên thành công ${uploadedUrls.length} ảnh công trình!`);
      }
    } catch (err) {
      console.error("Project upload error:", err);
      showToast("❌ Lỗi khi tải ảnh công trình lên!");
    } finally {
      setIsUploadingProjectImg(false);
      e.target.value = "";
    }
  };

  // Đặt làm ảnh đại diện chính của công trình
  const handleSetMainProjectImage = (index) => {
    setProjectForm((prev) => {
      const list = Array.isArray(prev.images) ? [...prev.images] : (prev.image ? [prev.image] : []);
      if (index < 0 || index >= list.length) return prev;
      const target = list.splice(index, 1)[0];
      list.unshift(target);
      return {
        ...prev,
        images: list,
        gallery: list,
        image: list[0] || ""
      };
    });
    showToast("⭐ Đã chọn làm hình ảnh đại diện chính của công trình!");
  };

  // Xóa 1 ảnh khỏi danh sách công trình
  const handleRemoveProjectImage = (index) => {
    setProjectForm((prev) => {
      const list = Array.isArray(prev.images) ? [...prev.images] : (prev.image ? [prev.image] : []);
      list.splice(index, 1);
      return {
        ...prev,
        images: list,
        gallery: list,
        image: list[0] || ""
      };
    });
    showToast("🗑️ Đã xóa hình ảnh khỏi công trình");
  };

  // Xóa toàn bộ ảnh của công trình
  const handleClearAllProjectImages = () => {
    setProjectForm((prev) => ({
      ...prev,
      images: [],
      gallery: [],
      image: ""
    }));
    setProjectUrlInput("");
    showToast("🗑️ Đã xóa toàn bộ hình ảnh công trình");
  };

  const handleProjectSubmit = async (e, directContent) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      const contentHtml = (typeof directContent === "string" ? directContent : projectForm.content) || "";

      // 1. Tự động trích xuất các link ảnh có trong bài viết
      const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
      const extractedImgs = [];
      let match;
      while ((match = imgRegex.exec(contentHtml)) !== null) {
        if (match[1] && !extractedImgs.includes(match[1])) {
          extractedImgs.push(match[1]);
        }
      }

      let currentImages = Array.isArray(projectForm.images)
        ? [...projectForm.images]
        : (projectForm.image ? [projectForm.image] : []);

      extractedImgs.forEach((u) => {
        if (!currentImages.includes(u)) currentImages.push(u);
      });

      if (projectUrlInput && projectUrlInput.trim()) {
        const extraUrls = projectUrlInput
          .split(/[\n,\s]+/)
          .map((u) => u.trim())
          .filter((u) => u.length > 0 && (u.startsWith("http://") || u.startsWith("https://") || u.startsWith("/") || u.startsWith("data:")));
        extraUrls.forEach((u) => {
          if (!currentImages.includes(u)) currentImages.push(u);
        });
      }

      // Tự động lấy ảnh đầu tiên xuất hiện trong bài viết làm ảnh bìa chính (Thumbnail)
      let primaryImage = extractedImgs[0] || projectForm.image || currentImages[0] || "";
      if (!primaryImage) {
        primaryImage = "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80";
      }

      // Đảm bảo primaryImage luôn đứng đầu tiên trong danh sách ảnh
      if (currentImages.includes(primaryImage)) {
        currentImages = [primaryImage, ...currentImages.filter(img => img !== primaryImage)];
      } else {
        currentImages.unshift(primaryImage);
      }

      // 2. Bảo lưu mô tả hoặc trích xuất đoạn văn đầu tiên từ bài viết làm tóm tắt
      let shortDesc = projectForm.description || "";
      if (!shortDesc.trim() && contentHtml.trim()) {
        const plainText = contentHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
        shortDesc = plainText.length > 180 ? plainText.substring(0, 180) + "..." : plainText;
      }

      const tempId = editingProject ? (editingProject._id || editingProject.id) : `proj-${Date.now()}`;
      const payload = {
        ...projectForm,
        _id: tempId,
        id: tempId,
        image: primaryImage,
        images: currentImages.length > 0 ? currentImages : [primaryImage],
        gallery: currentImages.length > 0 ? currentImages : [primaryImage],
        description: shortDesc || "Công trình thi công lắp đặt hoàn thiện bởi BOSS Đà Nẵng.",
        content: contentHtml
      };

      let apiSavedItem = null;
      const backendBase = import.meta.env.VITE_API_URL || "";
      if (backendBase) {
        try {
          if (editingProject) {
            const editId = editingProject._id || editingProject.id;
            const res = await fetch(`${backendBase}/api/projects/${editId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });
            if (res.ok) {
              const resJson = await res.json();
              if (resJson && resJson.success && resJson.data) {
                apiSavedItem = resJson.data;
              }
            }
          } else {
            const res = await fetch(`${backendBase}/api/projects`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });
            if (res.ok) {
              const resJson = await res.json();
              if (resJson && resJson.success && resJson.data) {
                apiSavedItem = resJson.data;
              }
            }
          }
        } catch (apiErr) {
          console.warn("Project API error, falling back to local save:", apiErr);
        }
      }

      const nowIso = new Date().toISOString();
      // Luôn đảm bảo content bài viết của người dùng được giữ nguyên 100%
      const finalItem = {
        ...payload,
        ...(apiSavedItem || {}),
        content: (apiSavedItem && apiSavedItem.content && apiSavedItem.content.trim())
          ? apiSavedItem.content
          : payload.content,
        createdAt: (apiSavedItem && apiSavedItem.createdAt) || (editingProject && editingProject.createdAt) || nowIso,
        updatedAt: nowIso
      };

      // Luôn đưa bài viết vừa mới tạo hoặc vừa cập nhật lên đầu danh sách, các bài cũ đẩy xuống
      const filtered = projects.filter(p => {
        const pId = String(p._id || p.id || '').trim();
        const editId = String(editingProject?._id || editingProject?.id || '').trim();
        if (editId && pId && editId === pId) return false;
        if (editingProject && p.title && editingProject.title && p.title.trim().toLowerCase() === editingProject.title.trim().toLowerCase()) return false;
        return true;
      });
      const updated = [finalItem, ...filtered].sort(sortByNewest);

      setProjects(updated);
      localStorage.setItem("boss_admin_projects", JSON.stringify(updated));
      setShowProjectForm(false);
      setEditingProject(null);
      showToast(editingProject ? "✨ Đã cập nhật bài viết công trình thành công!" : "🎉 Đã thêm và đăng bài viết công trình thành công!");
    } catch (err) {
      console.error("Project Submit Error:", err);
      showToast("❌ Có lỗi xảy ra khi lưu bài viết công trình.");
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa công trình này?")) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${id}`, { method: "DELETE" }).catch(() => null);
      const updated = projects.filter(p => p._id !== id);
      setProjects(updated);
      localStorage.setItem("boss_admin_projects", JSON.stringify(updated));
      showToast("🗑️ Đã xóa công trình thành công!");
    } catch (err) {
      console.error("Delete project error:", err);
      const updated = projects.filter(p => p._id !== id);
      setProjects(updated);
      localStorage.setItem("boss_admin_projects", JSON.stringify(updated));
      showToast("🗑️ Đã xóa công trình!");
    }
  };

  // ----------------------------------------------------
  // NEWS HANDLERS (ADD & EDIT & DELETE)
  // ----------------------------------------------------
  const handleOpenAddNews = () => {
    setEditingNews(null);
    setNewsForm(initialNewsState);
    setShowNewsForm(true);
    setTimeout(() => {
      newsFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleOpenEditNews = (article) => {
    setEditingNews(article);
    setNewsForm({
      title: article.title || "",
      slug: article.slug || slugify(article.title || ""),
      category: article.category || "Tư vấn & Kinh nghiệm",
      image: article.image || "",
      date: article.date || new Date().toLocaleDateString("vi-VN"),
      summary: article.summary || "",
      content: article.content || "",
      author: article.author || "BOSS Đà Nẵng"
    });
    setShowNewsForm(true);
    setTimeout(() => {
      newsFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleNewsSubmit = async (e, directContent) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      const contentHtml = (typeof directContent === "string" ? directContent : newsForm.content) || "";

      // 1. Tự động trích xuất các link ảnh có trong bài viết
      const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
      const extractedImgs = [];
      let match;
      while ((match = imgRegex.exec(contentHtml)) !== null) {
        if (match[1] && !extractedImgs.includes(match[1])) {
          extractedImgs.push(match[1]);
        }
      }

      // Tự động lấy ảnh đầu tiên xuất hiện trong bài viết làm ảnh bìa chính (Thumbnail) nếu chưa có
      let primaryImage = newsForm.image || extractedImgs[0] || "";
      if (!primaryImage) {
        primaryImage = "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80";
      }

      // 2. Bảo lưu tóm tắt hoặc trích xuất đoạn văn đầu tiên từ bài viết làm tóm tắt
      let shortSummary = newsForm.summary || "";
      if (!shortSummary.trim() && contentHtml.trim()) {
        const plainText = contentHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
        shortSummary = plainText.length > 180 ? plainText.substring(0, 180) + "..." : plainText;
      }

      const generatedSlug = newsForm.slug && newsForm.slug.trim() 
        ? slugify(newsForm.slug.trim()) 
        : slugify(newsForm.title || "tin-tuc-boss");

      const tempId = editingNews ? (editingNews._id || editingNews.id) : `news-${Date.now()}`;
      const payload = {
        ...newsForm,
        _id: tempId,
        id: tempId,
        title: newsForm.title || "Bài viết tin tức BOSS Đà Nẵng",
        slug: generatedSlug,
        category: newsForm.category || "Tư vấn & Kinh nghiệm",
        author: newsForm.author || "BOSS Đà Nẵng",
        date: newsForm.date || new Date().toLocaleDateString("vi-VN"),
        image: primaryImage,
        summary: shortSummary || "Cập nhật tin tức thị trường và cẩm nang lựa chọn cửa cuốn tại Đà Nẵng.",
        content: contentHtml
      };

      let apiSavedItem = null;
      const backendBase = import.meta.env.VITE_API_URL || "";
      if (backendBase) {
        try {
          if (editingNews) {
            const editId = editingNews._id || editingNews.id;
            const res = await fetch(`${backendBase}/api/news/${editId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });
            if (res.ok) {
              const resJson = await res.json();
              if (resJson && resJson.success && resJson.data) {
                apiSavedItem = resJson.data;
              }
            }
          } else {
            const res = await fetch(`${backendBase}/api/news`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });
            if (res.ok) {
              const resJson = await res.json();
              if (resJson && resJson.success && resJson.data) {
                apiSavedItem = resJson.data;
              }
            }
          }
        } catch (apiErr) {
          console.warn("News API error, falling back to local save:", apiErr);
        }
      }

      const nowIso = new Date().toISOString();
      const finalItem = {
        ...payload,
        ...(apiSavedItem || {}),
        content: (apiSavedItem && apiSavedItem.content && apiSavedItem.content.trim())
          ? apiSavedItem.content
          : payload.content,
        createdAt: (apiSavedItem && apiSavedItem.createdAt) || (editingNews && editingNews.createdAt) || nowIso,
        updatedAt: nowIso
      };

      // Luôn đưa bài viết vừa mới tạo hoặc vừa cập nhật lên đầu danh sách, các bài cũ đẩy xuống
      const filtered = news.filter(n => {
        const nId = String(n._id || n.id || '').trim();
        const editId = String(editingNews?._id || editingNews?.id || '').trim();
        if (editId && nId && editId === nId) return false;
        if (editingNews && n.title && editingNews.title && n.title.trim().toLowerCase() === editingNews.title.trim().toLowerCase()) return false;
        return true;
      });
      const updated = [finalItem, ...filtered].sort(sortByNewest);

      setNews(updated);
      localStorage.setItem("boss_admin_news", JSON.stringify(updated));
      setShowNewsForm(false);
      setEditingNews(null);
      showToast(editingNews ? "✨ Đã cập nhật bài viết tin tức thành công!" : "🎉 Đã thêm và đăng bài viết tin tức thành công!");
    } catch (err) {
      console.error("News Submit Error:", err);
      showToast("❌ Có lỗi xảy ra khi lưu bài viết tin tức.");
    }
  };

  const handleDeleteNews = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài viết tin tức này?")) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/news/${id}`, { method: "DELETE" }).catch(() => null);
      const updated = news.filter(n => n._id !== id && n.id !== id);
      setNews(updated);
      localStorage.setItem("boss_admin_news", JSON.stringify(updated));
      showToast("🗑️ Đã xóa bài viết tin tức thành công!");
    } catch (err) {
      console.error("Delete news error:", err);
      const updated = news.filter(n => n._id !== id && n.id !== id);
      setNews(updated);
      localStorage.setItem("boss_admin_news", JSON.stringify(updated));
      showToast("🗑️ Đã xóa bài viết tin tức!");
    }
  };

  // ----------------------------------------------------
  // SERVICE HANDLERS (ADD & EDIT & DELETE & UPLOAD)
  // ----------------------------------------------------
  const handleOpenAddService = () => {
    setEditingService(null);
    setServiceForm({
      title: "",
      date: new Date().toLocaleDateString("vi-VN"),
      img: "/service_repair_247.png",
      desc: "",
      content: "",
      order: services.length + 1,
      phone: "0904.678.323"
    });
    setShowServiceModal(true);
  };

  const handleOpenEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      title: service.title || "",
      date: service.date || new Date().toLocaleDateString("vi-VN"),
      img: service.img || "/service_repair_247.png",
      desc: service.desc || "",
      content: service.content || "",
      order: service.order ?? 0,
      phone: service.phone || "0904.678.323"
    });
    setShowServiceModal(true);
  };

  const handleUploadServiceImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingServiceImg(true);

    try {
      const backendBase = import.meta.env.VITE_API_URL || "";
      const uploadEndpoint = backendBase ? `${backendBase}/api/upload` : "/api/upload";
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        setServiceForm(prev => ({ ...prev, img: data.url }));
        showToast("🎉 Tải ảnh dịch vụ lên thành công!");
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          setServiceForm(prev => ({ ...prev, img: event.target.result }));
          showToast("✨ Đã tải ảnh dịch vụ trực tiếp!");
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn("Upload error, using Base64 fallback:", err);
      const reader = new FileReader();
      reader.onload = (event) => {
        setServiceForm(prev => ({ ...prev, img: event.target.result }));
        showToast("✨ Đã tải ảnh dịch vụ trực tiếp!");
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingServiceImg(false);
      e.target.value = "";
    }
  };

  const handleUploadProductImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("⚠️ Vui lòng chọn tệp hình ảnh hợp lệ!");
      return;
    }

    setIsUploadingProductImg(true);
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
            setProductForm(prev => ({ ...prev, image: finalUrl }));
            showToast("🎉 Tải ảnh sản phẩm từ thiết bị lên thành công!");
            setIsUploadingProductImg(false);
            return;
          }
        }
      } catch (uploadErr) {
        console.warn("Product upload backend failed, fallback to FileReader:", uploadErr);
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setProductForm(prev => ({ ...prev, image: event.target.result }));
        showToast("✨ Đã tải ảnh từ thiết bị thành công!");
        setIsUploadingProductImg(false);
      };
      reader.onerror = () => {
        showToast("❌ Không thể đọc file ảnh từ thiết bị!");
        setIsUploadingProductImg(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Product image upload error:", err);
      showToast("❌ Lỗi khi chọn ảnh!");
      setIsUploadingProductImg(false);
    } finally {
      e.target.value = "";
    }
  };

  const [seedingServices, setSeedingServices] = useState(false);

  const handleSeedDefaultServices = async (silent = false) => {
    if (!silent && !window.confirm("Bạn có muốn nạp 8 dịch vụ tiêu chuẩn vào hệ thống Admin không?")) return;
    setSeedingServices(true);
    try {
      const backendBase = import.meta.env.VITE_API_URL || '';
      let res = await fetch(`${backendBase}/api/services/seed`, { method: "POST" });
      let data = await res.json().catch(() => null);

      if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
        setServices(data.data);
        localStorage.setItem("boss_admin_services", JSON.stringify(data.data));
        if (!silent) showToast("✨ Đã nạp thành công 8 dịch vụ vào hệ thống!");
        setSeedingServices(false);
        return;
      }

      // Fallback: POST one by one to /api/services
      const createdServices = [];
      for (const item of DEFAULT_SAMPLE_SERVICES) {
        try {
          const postRes = await fetch(`${backendBase}/api/services`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item)
          });
          const postData = await postRes.json();
          if (postData.success && postData.data) {
            createdServices.push(postData.data);
          }
        } catch (e) {
          console.warn("Post service error:", e);
        }
      }

      if (createdServices.length > 0) {
        setServices(createdServices);
        localStorage.setItem("boss_admin_services", JSON.stringify(createdServices));
        if (!silent) showToast(`✨ Đã nạp ${createdServices.length} dịch vụ vào cơ sở dữ liệu!`);
      } else {
        const localServices = DEFAULT_SAMPLE_SERVICES.map((s, idx) => ({ ...s, _id: `seed_${Date.now()}_${idx}` }));
        setServices(localServices);
        localStorage.setItem("boss_admin_services", JSON.stringify(localServices));
        if (!silent) showToast("✨ Đã nạp 8 dịch vụ tiêu chuẩn vào Admin!");
      }
    } catch (err) {
      console.error("Seed services error:", err);
      const localServices = DEFAULT_SAMPLE_SERVICES.map((s, idx) => ({ ...s, _id: `seed_${Date.now()}_${idx}` }));
      setServices(localServices);
      localStorage.setItem("boss_admin_services", JSON.stringify(localServices));
      if (!silent) showToast("✨ Đã nạp 8 dịch vụ tiêu chuẩn vào Admin!");
    } finally {
      setSeedingServices(false);
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      let res, data;
      if (editingService) {
        res = await fetch(`${import.meta.env.VITE_API_URL}/api/services/${editingService._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(serviceForm)
        });
        data = await res.json();
        if (data.success) {
          const updated = services.map(s => s._id === editingService._id ? data.data : s);
          setServices(updated);
          localStorage.setItem("boss_admin_services", JSON.stringify(updated));
          showToast("✨ Đã cập nhật dịch vụ thành công!");
        }
      } else {
        res = await fetch(`${import.meta.env.VITE_API_URL}/api/services`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(serviceForm)
        });
        data = await res.json();
        if (data.success) {
          const updated = [...services, data.data];
          setServices(updated);
          localStorage.setItem("boss_admin_services", JSON.stringify(updated));
          showToast("🎉 Thêm dịch vụ mới thành công!");
        }
      }

      if (data && data.success) {
        setShowServiceModal(false);
      } else {
        // Fallback for offline mode
        if (editingService) {
          const updated = services.map(s => s._id === editingService._id ? { ...serviceForm, _id: editingService._id } : s);
          setServices(updated);
          localStorage.setItem("boss_admin_services", JSON.stringify(updated));
          setShowServiceModal(false);
          showToast("✨ Đã lưu cập nhật dịch vụ!");
        } else {
          const newLocal = { ...serviceForm, _id: `local_svc_${Date.now()}` };
          const updated = [...services, newLocal];
          setServices(updated);
          localStorage.setItem("boss_admin_services", JSON.stringify(updated));
          setShowServiceModal(false);
          showToast("🎉 Đã lưu dịch vụ mới!");
        }
      }
    } catch (err) {
      console.error("Service Submit Error:", err);
      // Fallback local save
      if (editingService) {
        const updated = services.map(s => s._id === editingService._id ? { ...serviceForm, _id: editingService._id } : s);
        setServices(updated);
        localStorage.setItem("boss_admin_services", JSON.stringify(updated));
        setShowServiceModal(false);
        showToast("✨ Đã lưu cập nhật dịch vụ vào hệ thống!");
      } else {
        const newLocal = { ...serviceForm, _id: `local_svc_${Date.now()}` };
        const updated = [...services, newLocal];
        setServices(updated);
        localStorage.setItem("boss_admin_services", JSON.stringify(updated));
        setShowServiceModal(false);
        showToast("🎉 Đã lưu dịch vụ mới vào hệ thống!");
      }
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này khỏi hệ thống?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/services/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        const updated = services.filter(s => s._id !== id);
        setServices(updated);
        localStorage.setItem("boss_admin_services", JSON.stringify(updated));
        showToast("🗑️ Đã xóa dịch vụ thành công!");
      }
    } catch (err) {
      console.error("Delete service error:", err);
      const updated = services.filter(s => s._id !== id);
      setServices(updated);
      localStorage.setItem("boss_admin_services", JSON.stringify(updated));
      showToast("🗑️ Đã xóa dịch vụ khỏi hệ thống!");
    }
  };

  // Quản lý xóa đánh giá khách hàng (QUY TẮC: CHỈ ĐƯỢC XÓA, KHÔNG ĐƯỢC SỬA)
  const handleDeleteReview = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này khỏi hệ thống? (Lưu ý: Đánh giá đã xóa không thể khôi phục)")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/${id}`, { method: "DELETE" }).catch(() => null);
      if (res && res.ok) {
        // Backend deletion success
      }
      const updated = reviews.filter(r => (r._id || r.id) !== id);
      setReviews(updated);
      try {
        localStorage.setItem("boss_customer_reviews", JSON.stringify(updated));
      } catch (_) { }
      showToast("🗑️ Đã xóa đánh giá khách hàng thành công!");
    } catch (err) {
      console.error("Delete review error:", err);
      const updated = reviews.filter(r => (r._id || r.id) !== id);
      setReviews(updated);
      try {
        localStorage.setItem("boss_customer_reviews", JSON.stringify(updated));
      } catch (_) { }
      showToast("🗑️ Đã xóa đánh giá khỏi bộ nhớ!");
    }
  };

  // Filtered Lists for Search (Thông minh, hỗ trợ không dấu, có dấu, đa từ khóa)
  const filteredProducts = products.filter(p => {
    const text = extractSearchableText(p, [
      "title", "code", "category", "description", "specs", "price", "businessStatus", "badge"
    ]);
    return matchKeywords(text, productSearch);
  });

  const filteredProjects = projects.filter(p => {
    const text = extractSearchableText(p, [
      "title", "category", "location", "description", "customer", "date"
    ]);
    return matchKeywords(text, projectSearch);
  });

  const filteredNews = news.filter(n => {
    const text = extractSearchableText(n, [
      "title", "summary", "content", "author", "category"
    ]);
    return matchKeywords(text, newsSearch);
  });

  const filteredServices = services.filter(s => {
    const text = extractSearchableText(s, [
      "title", "desc", "content", "category", "price"
    ]);
    return matchKeywords(text, serviceSearch);
  });

  const filteredReviews = reviews.filter((r) => {
    const reviewCombined = `${extractSearchableText(r, ["name", "email", "role", "text", "address", "location"])} ${r.rating ? `${r.rating} sao` : ""}`;
    const matchesSearch = matchKeywords(reviewCombined, reviewSearch);

    if (!matchesSearch) return false;

    if (reviewRatingFilter === "5") return Number(r.rating) === 5;
    if (reviewRatingFilter === "4") return Number(r.rating) === 4;
    if (reviewRatingFilter === "3") return Number(r.rating) <= 3;
    if (reviewRatingFilter === "has_media") return Boolean(r.mediaUrl);

    return true;
  });

  const filteredContacts = contacts.filter(c => {
    // Đánh giá khách hàng không liên quan và không bao giờ hiển thị ở bảng yêu cầu báo giá
    if (c.productCategory?.toLowerCase().includes("đánh giá")) return false;

    const contactCombined = extractSearchableText(c, [
      "fullName", "phone", "email", "address", "productCategory", "message", "status"
    ]);
    const matchesSearch = matchKeywords(contactCombined, contactSearch);

    if (!matchesSearch) return false;

    const isServiceBooking = c.productCategory?.toLowerCase().includes("dịch vụ");
    if (contactFilter === "service") return isServiceBooking;
    if (contactFilter === "product") return !isServiceBooking;
    return true;
  });

  const pendingContactsCount = contacts.filter(
    c => c.status === "pending" && !c.productCategory?.toLowerCase().includes("đánh giá")
  ).length;
  const serviceContactsCount = contacts.filter(c =>
    c.productCategory?.toLowerCase().includes("dịch vụ")
  ).length;

  return (
    <div className="admin-standalone-wrapper">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="admin-toast-message">
          {toastMessage}
        </div>
      )}

      {/* 1. SIDEBAR */}
      {mobileMenuOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <aside className={`admin-sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="admin-sidebar-logo">
          <div className="logo-badge">B</div>
          <div className="admin-logo-text">
            <h2>BOSS ADMIN</h2>
            <span>BẢNG ĐIỀU KHIỂN</span>
          </div>
          <button
            type="button"
            className="admin-sidebar-close-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Đóng menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="admin-nav-list">
          <button
            className={`admin-nav-item ${activeTab === "contacts" ? "active" : ""}`}
            onClick={() => { setActiveTab("contacts"); setMobileMenuOpen(false); }}
          >
            <Phone size={18} /> Yêu Cầu Báo Giá
            {pendingContactsCount > 0 && <span className="nav-badge-count">{pendingContactsCount}</span>}
          </button>

          <button
            className={`admin-nav-item ${activeTab === "products" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("products");
              setProductSubTab("list");
              setMobileMenuOpen(false);
            }}
          >
            <Package size={18} /> Quản Lý Sản Phẩm
          </button>

          <button
            className={`admin-nav-item ${activeTab === "pricing" ? "active" : ""}`}
            onClick={() => { setActiveTab("pricing"); setMobileMenuOpen(false); }}
          >
            <FileSpreadsheet size={18} /> Quản Lý Báo Giá
          </button>

          <button
            className={`admin-nav-item ${activeTab === "services" ? "active" : ""}`}
            onClick={() => { setActiveTab("services"); setMobileMenuOpen(false); }}
          >
            <Wrench size={18} /> Quản Lý Dịch Vụ
            {services.length > 0 && <span className="nav-badge-count">{services.length}</span>}
          </button>

          <button
            className={`admin-nav-item ${activeTab === "news" ? "active" : ""}`}
            onClick={() => { setActiveTab("news"); setMobileMenuOpen(false); }}
          >
            <Newspaper size={18} /> Quản Lý Tin Tức
          </button>

          <button
            className={`admin-nav-item ${activeTab === "projects" ? "active" : ""}`}
            onClick={() => { setActiveTab("projects"); setMobileMenuOpen(false); }}
          >
            <FolderKanban size={18} /> Quản Lý Công Trình
          </button>

          <button
            className={`admin-nav-item ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => { setActiveTab("reviews"); setMobileMenuOpen(false); }}
          >
            <Star size={18} /> Đánh Giá Khách Hàng
            {reviews.length > 0 && <span className="nav-badge-count">{reviews.length}</span>}
          </button>

          <button
            className={`admin-nav-item ${activeTab === "seo" ? "active" : ""}`}
            onClick={() => { setActiveTab("seo"); setMobileMenuOpen(false); }}
          >
            <Sparkles size={18} /> Bài Sale & SEO Danh Mục
          </button>
        </div>

        <div className="sidebar-footer">
          <Link to="/" className="btn-back-to-site" onClick={() => setMobileMenuOpen(false)}>
            <ArrowLeft size={18} /> Quay về Trang Chủ
          </Link>
          <button
            type="button"
            className="btn-sidebar-logout"
            onClick={() => {
              setMobileMenuOpen(false);
              logout();
            }}
          >
            <LogOut size={18} /> Đăng Xuất
          </button>
        </div>
      </aside>

      {/* 2. MAIN VIEWPORT */}
      <main className="admin-main-viewport">
        {/* TOPBAR */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="admin-mobile-menu-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Mở menu quản trị"
            >
              <Menu size={20} />
            </button>
            <div className="topbar-status">
              <span className="status-dot"></span>
              <span className="topbar-status-text">Hệ Thống Trực Tuyến</span>
              <span className="topbar-status-mobile-text">Online</span>
            </div>
          </div>

          <div className="topbar-user">
            <button className="btn-add-new btn-refresh-data" onClick={fetchData} disabled={loading}>
              <RefreshCw size={14} className={loading ? "spin" : ""} />
              <span className="refresh-btn-text">{loading ? "Đang nạp..." : "Làm mới dữ liệu"}</span>
            </button>
            <div className="admin-user-profile-badge" title={currentUser?.email || "admin@boss.vn"}>
              <div className="user-avatar">
                {currentUser?.fullName ? currentUser.fullName[0].toUpperCase() : "A"}
              </div>
              <div className="admin-profile-text">
                <span className="admin-name">{currentUser?.fullName || "Admin"}</span>
                <span className="admin-role-tag">QUẢN TRỊ VIÊN</span>
              </div>
            </div>
            <button
              type="button"
              className="btn-admin-logout"
              onClick={() => logout()}
              title="Đăng xuất khỏi trang quản trị"
            >
              <LogOut size={16} />
              <span className="logout-btn-text">Đăng Xuất</span>
            </button>
          </div>
        </header>

        {/* CONTENT BODY */}
        <div className="admin-content-body">
          {/* STATS CARDS (DESKTOP: ALL 6 CARDS) */}
          <div className="admin-stats-grid admin-stats-grid-desktop">
            <div
              className={`admin-stat-card ${activeTab === "contacts" ? "active" : ""}`}
              onClick={() => setActiveTab("contacts")}
              title="Xem danh sách yêu cầu báo giá"
            >
              <div className="stat-icon green">
                <Phone size={24} />
              </div>
              <div className="stat-info">
                <h4>
                  <span className="desktop-stat-label">Báo Giá Mới Chờ Xử Lý</span>
                  <span className="mobile-stat-label">Báo Giá Chờ Xử Lý</span>
                </h4>
                <p>{pendingContactsCount} <span style={{ fontSize: "0.85rem", color: "#f59e0b" }}>({contacts.length} tổng)</span></p>
              </div>
            </div>

            <div
              className={`admin-stat-card ${activeTab === "services" ? "active" : ""}`}
              onClick={() => setActiveTab("services")}
              title="Xem danh sách dịch vụ"
            >
              <div className="stat-icon" style={{ background: "rgba(234, 179, 8, 0.15)", color: "#eab308" }}>
                <Wrench size={24} />
              </div>
              <div className="stat-info">
                <h4>
                  <span className="desktop-stat-label">Dịch Vụ Cửa Cuốn / Kéo</span>
                  <span className="mobile-stat-label">Dịch Vụ Cửa Cuốn</span>
                </h4>
                <p>
                  {services.length}{" "}
                  <span style={{ fontSize: "0.85rem", color: "#38bdf8" }}>
                    <span className="desktop-stat-label">({serviceContactsCount} đơn dịch vụ)</span>
                    <span className="mobile-stat-label">({serviceContactsCount} đơn)</span>
                  </span>
                </p>
              </div>
            </div>

            <div
              className={`admin-stat-card ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}
              title="Xem danh sách đánh giá khách hàng"
            >
              <div className="stat-icon" style={{ background: "rgba(245, 189, 32, 0.18)", color: "#f5bd20" }}>
                <Star size={24} />
              </div>
              <div className="stat-info">
                <h4>
                  <span className="desktop-stat-label">Đánh Giá Khách Hàng</span>
                  <span className="mobile-stat-label">Đánh Giá KH</span>
                </h4>
                <p>
                  {reviews.length}{" "}
                  <span style={{ fontSize: "0.85rem", color: "#f5bd20" }}>
                    ({reviews.filter(r => r.rating === 5).length} lượt 5⭐)
                  </span>
                </p>
              </div>
            </div>

            <div
              className={`admin-stat-card ${activeTab === "products" ? "active" : ""}`}
              onClick={() => { setActiveTab("products"); setProductSubTab("list"); }}
              title="Xem danh sách sản phẩm"
            >
              <div className="stat-icon" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
                <Package size={24} />
              </div>
              <div className="stat-info">
                <h4>
                  <span className="desktop-stat-label">Sản Phẩm Trong Database</span>
                  <span className="mobile-stat-label">Tổng Sản Phẩm</span>
                </h4>
                <p>
                  {products.length}{" "}
                  <span style={{ fontSize: "0.85rem", color: "#10b981" }}>
                    ({products.length} có mặt)
                  </span>
                </p>
              </div>
            </div>

            <div
              className={`admin-stat-card ${activeTab === "projects" ? "active" : ""}`}
              onClick={() => setActiveTab("projects")}
              title="Xem danh sách công trình"
            >
              <div className="stat-icon blue">
                <FolderKanban size={24} />
              </div>
              <div className="stat-info">
                <h4>Công Trình Tiêu Biểu</h4>
                <p>{projects.length}</p>
              </div>
            </div>

            <div
              className={`admin-stat-card ${activeTab === "news" ? "active" : ""}`}
              onClick={() => setActiveTab("news")}
              title="Xem danh sách tin tức & bài viết"
            >
              <div className="stat-icon" style={{ background: "rgba(168, 85, 247, 0.15)", color: "#a855f7" }}>
                <Newspaper size={24} />
              </div>
              <div className="stat-info">
                <h4>
                  <span className="desktop-stat-label">Bài Viết & Tin Tức</span>
                  <span className="mobile-stat-label">Tin Tức & Bài Viết</span>
                </h4>
                <p>{news.length}</p>
              </div>
            </div>
          </div>

          {/* MOBILE CONTEXTUAL STATS (<= 992px) */}
          <div className="admin-mobile-stats-grid">
            {activeTab === "products" ? (
              <>
                <div
                  className="admin-stat-card active"
                  style={{
                    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.16) 0%, rgba(30, 41, 59, 0.85) 100%)",
                    border: "1px solid rgba(16, 185, 129, 0.38)"
                  }}
                >
                  <div className="stat-icon" style={{ background: "rgba(16, 185, 129, 0.2)", color: "#10b981" }}>
                    <Package size={20} />
                  </div>
                  <div className="stat-info">
                    <h4>Tổng Sản Phẩm</h4>
                    <p>
                      {products.length}{" "}
                      <span style={{ fontSize: "0.78rem", color: "#10b981", fontWeight: 600 }}>
                        ({products.length} có mặt)
                      </span>
                    </p>
                  </div>
                </div>

                <div
                  className="admin-stat-card"
                  style={{
                    background: "linear-gradient(135deg, rgba(212, 175, 55, 0.14) 0%, rgba(30, 41, 59, 0.85) 100%)",
                    border: "1px solid rgba(212, 175, 55, 0.32)"
                  }}
                >
                  <div className="stat-icon" style={{ background: "rgba(212, 175, 55, 0.2)", color: "#f5bd20" }}>
                    <Layers size={20} />
                  </div>
                  <div className="stat-info">
                    <h4>Cửa Cuốn & Kéo</h4>
                    <p>
                      {products.filter(p => p.category === "cuacuon" || p.category === "cuakeo").length}{" "}
                      <span style={{ fontSize: "0.78rem", color: "#f5bd20", fontWeight: 600 }}>
                        ({products.filter(p => p.category === "phukien" || p.category === "cuatudong").length} PK/Cổng)
                      </span>
                    </p>
                  </div>
                </div>
              </>
            ) : activeTab === "services" ? (
              <>
                <div
                  className="admin-stat-card active"
                  style={{
                    background: "linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, rgba(30, 41, 59, 0.85) 100%)",
                    border: "1px solid rgba(234, 179, 8, 0.35)"
                  }}
                >
                  <div className="stat-icon" style={{ background: "rgba(234, 179, 8, 0.2)", color: "#eab308" }}>
                    <Wrench size={20} />
                  </div>
                  <div className="stat-info">
                    <h4>Dịch Vụ Cửa Cuốn</h4>
                    <p>{services.length} <span style={{ fontSize: "0.78rem", color: "#eab308", fontWeight: 600 }}>({services.length} dịch vụ)</span></p>
                  </div>
                </div>

                <div
                  className="admin-stat-card"
                  onClick={() => setActiveTab("contacts")}
                  style={{
                    background: "linear-gradient(135deg, rgba(56, 189, 248, 0.14) 0%, rgba(30, 41, 59, 0.85) 100%)",
                    border: "1px solid rgba(56, 189, 248, 0.32)"
                  }}
                >
                  <div className="stat-icon" style={{ background: "rgba(56, 189, 248, 0.2)", color: "#38bdf8" }}>
                    <Phone size={20} />
                  </div>
                  <div className="stat-info">
                    <h4>Đơn Dịch Vụ</h4>
                    <p>{serviceContactsCount} <span style={{ fontSize: "0.78rem", color: "#38bdf8", fontWeight: 600 }}>({serviceContactsCount} đơn)</span></p>
                  </div>
                </div>
              </>
            ) : activeTab === "reviews" ? (
              <>
                <div
                  className="admin-stat-card active"
                  style={{
                    background: "linear-gradient(135deg, rgba(245, 189, 32, 0.14) 0%, rgba(30, 41, 59, 0.85) 100%)",
                    border: "1px solid rgba(245, 189, 32, 0.35)"
                  }}
                >
                  <div className="stat-icon" style={{ background: "rgba(245, 189, 32, 0.2)", color: "#f5bd20" }}>
                    <Star size={20} />
                  </div>
                  <div className="stat-info">
                    <h4>Đánh Giá KH</h4>
                    <p>{reviews.length} <span style={{ fontSize: "0.78rem", color: "#f5bd20", fontWeight: 600 }}>({reviews.length} đánh giá)</span></p>
                  </div>
                </div>

                <div
                  className="admin-stat-card"
                  style={{
                    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.16) 0%, rgba(30, 41, 59, 0.85) 100%)",
                    border: "1px solid rgba(16, 185, 129, 0.35)"
                  }}
                >
                  <div className="stat-icon" style={{ background: "rgba(16, 185, 129, 0.2)", color: "#10b981" }}>
                    <BadgeCheck size={20} />
                  </div>
                  <div className="stat-info">
                    <h4>Lượt 5 Sao</h4>
                    <p>{reviews.filter(r => r.rating === 5).length} <span style={{ fontSize: "0.78rem", color: "#10b981", fontWeight: 600 }}>(5⭐ tuyệt đối)</span></p>
                  </div>
                </div>
              </>
            ) : activeTab === "projects" ? (
              <>
                <div
                  className="admin-stat-card active"
                  style={{
                    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.16) 0%, rgba(30, 41, 59, 0.85) 100%)",
                    border: "1px solid rgba(59, 130, 246, 0.35)"
                  }}
                >
                  <div className="stat-icon blue">
                    <FolderKanban size={20} />
                  </div>
                  <div className="stat-info">
                    <h4>Công Trình Tiêu Biểu</h4>
                    <p>{projects.length} <span style={{ fontSize: "0.78rem", color: "#3b82f6", fontWeight: 600 }}>({projects.length} công trình)</span></p>
                  </div>
                </div>

                <div
                  className="admin-stat-card"
                  onClick={() => setActiveTab("reviews")}
                  style={{
                    background: "linear-gradient(135deg, rgba(245, 189, 32, 0.14) 0%, rgba(30, 41, 59, 0.85) 100%)",
                    border: "1px solid rgba(245, 189, 32, 0.32)"
                  }}
                >
                  <div className="stat-icon" style={{ background: "rgba(245, 189, 32, 0.18)", color: "#f5bd20" }}>
                    <Star size={20} />
                  </div>
                  <div className="stat-info">
                    <h4>Đánh Giá KH</h4>
                    <p>{reviews.length} <span style={{ fontSize: "0.78rem", color: "#f5bd20", fontWeight: 600 }}>({reviews.filter(r => r.rating === 5).length} lượt 5⭐)</span></p>
                  </div>
                </div>
              </>
            ) : activeTab === "news" ? (
              <>
                <div
                  className="admin-stat-card active"
                  style={{
                    background: "linear-gradient(135deg, rgba(168, 85, 247, 0.16) 0%, rgba(30, 41, 59, 0.85) 100%)",
                    border: "1px solid rgba(168, 85, 247, 0.35)"
                  }}
                >
                  <div className="stat-icon" style={{ background: "rgba(168, 85, 247, 0.2)", color: "#a855f7" }}>
                    <Newspaper size={20} />
                  </div>
                  <div className="stat-info">
                    <h4>Tin Tức & Bài Viết</h4>
                    <p>{news.length} <span style={{ fontSize: "0.78rem", color: "#a855f7", fontWeight: 600 }}>({news.length} bài)</span></p>
                  </div>
                </div>

                <div
                  className="admin-stat-card"
                  style={{
                    background: "linear-gradient(135deg, rgba(212, 175, 55, 0.14) 0%, rgba(30, 41, 59, 0.85) 100%)",
                    border: "1px solid rgba(212, 175, 55, 0.32)"
                  }}
                >
                  <div className="stat-icon" style={{ background: "rgba(212, 175, 55, 0.2)", color: "#d4af37" }}>
                    <Tag size={20} />
                  </div>
                  <div className="stat-info">
                    <h4>Tác Giả Viết Bài</h4>
                    <p>BOSS <span style={{ fontSize: "0.78rem", color: "#d4af37", fontWeight: 600 }}>(Đà Nẵng)</span></p>
                  </div>
                </div>
              </>
            ) : (
              /* DEFAULT (contacts, etc.) - KHỞI TẠO MÀN HÌNH ĐIỆN THOẠI */
              <>
                <div
                  className="admin-stat-card active"
                  onClick={() => setActiveTab("contacts")}
                  style={{
                    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.16) 0%, rgba(30, 41, 59, 0.85) 100%)",
                    border: "1px solid rgba(16, 185, 129, 0.35)"
                  }}
                >
                  <div className="stat-icon green">
                    <Phone size={20} />
                  </div>
                  <div className="stat-info">
                    <h4>Báo Giá Chờ Xử Lý</h4>
                    <p>{pendingContactsCount} <span style={{ fontSize: "0.78rem", color: "#f59e0b", fontWeight: 600 }}>({contacts.length} tổng)</span></p>
                  </div>
                </div>

                <div
                  className="admin-stat-card"
                  onClick={() => setActiveTab("reviews")}
                  style={{
                    background: "linear-gradient(135deg, rgba(245, 189, 32, 0.14) 0%, rgba(30, 41, 59, 0.85) 100%)",
                    border: "1px solid rgba(245, 189, 32, 0.32)"
                  }}
                >
                  <div className="stat-icon" style={{ background: "rgba(245, 189, 32, 0.18)", color: "#f5bd20" }}>
                    <Star size={20} />
                  </div>
                  <div className="stat-info">
                    <h4>Đánh Giá KH</h4>
                    <p>
                      {reviews.length}{" "}
                      <span style={{ fontSize: "0.78rem", color: "#f5bd20", fontWeight: 600 }}>
                        ({reviews.filter(r => r.rating === 5).length} lượt 5⭐)
                      </span>
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* TAB 1: CONTACTS */}
          {activeTab === "contacts" && (
            <div className="admin-table-container">
              <div className="table-action-header">
                <h2>DANH SÁCH YÊU CẦU TƯ VẤN & BÁO GIÁ ({contacts.length})</h2>
                <div className="table-header-controls">
                  <div className="admin-search-box">
                    <Search size={16} />
                    <input
                      type="text"
                      placeholder="Tìm kiếm tên, SĐT..."
                      value={contactSearch}
                      onChange={(e) => setContactSearch(e.target.value)}
                      className="admin-search-input"
                    />
                  </div>
                </div>
              </div>

              {/* FILTER CHIPS (TẤT CẢ VS ĐƠN DỊCH VỤ VS ĐƠN SẢN PHẨM) */}
              <div className="contact-filter-chips">
                <button
                  type="button"
                  className={`chip-btn ${contactFilter === "all" ? "active" : ""}`}
                  onClick={() => setContactFilter("all")}
                >
                  Tất cả ({contacts.length})
                </button>
                <button
                  type="button"
                  className={`chip-btn service ${contactFilter === "service" ? "active" : ""}`}
                  onClick={() => setContactFilter("service")}
                >
                  <span className="desktop-stat-label">🛠️ Đơn Dịch Vụ Sửa Chữa ({serviceContactsCount})</span>
                  <span className="mobile-stat-label">🛠️ Dịch Vụ ({serviceContactsCount})</span>
                </button>
                <button
                  type="button"
                  className={`chip-btn ${contactFilter === "product" ? "active" : ""}`}
                  onClick={() => setContactFilter("product")}
                >
                  <span className="desktop-stat-label">📦 Đơn Sản Phẩm ({contacts.length - serviceContactsCount})</span>
                  <span className="mobile-stat-label">📦 Sản Phẩm ({contacts.length - serviceContactsCount})</span>
                </button>
              </div>

              {/* CUỘN NGANG DÀNH CHO BẢNG DESKTOP */}
              <div className="table-scroll-hint contact-scroll-hint"><span>⇄ Vuốt sang ngang để xem đầy đủ cột</span></div>
              <table className="admin-table contact-desktop-table">
                <thead>
                  <tr>
                    <th>Thời gian</th>
                    <th>Khách hàng</th>
                    <th>Số điện thoại</th>
                    <th>Hạng mục tư vấn</th>
                    <th>Nội dung yêu cầu</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.length > 0 ? (
                    filteredContacts.map((item) => (
                      <tr key={item._id}>
                        <td>{new Date(item.createdAt).toLocaleString("vi-VN")}</td>
                        <td style={{ fontWeight: "600" }}>{item.fullName}</td>
                        <td>
                          <a href={`tel:${item.phone}`} style={{ color: "#d4af37", fontWeight: "600", textDecoration: "none" }}>
                            {item.phone}
                          </a>
                        </td>
                        <td>
                          {item.productCategory?.toLowerCase().includes("dịch vụ") ? (
                            <span className="admin-badge-service">
                              🛠️ {item.productCategory}
                            </span>
                          ) : (
                            <span className="admin-badge-category">
                              {item.productName || item.productCategory}
                              {item.productCode ? ` (${item.productCode})` : ""}
                            </span>
                          )}
                        </td>
                        <td style={{ maxWidth: 260, color: "#94a3b8", fontSize: "0.85rem" }}>
                          {item.dimensions && <div><strong>KT:</strong> {item.dimensions} (SL: {item.quantity || 1})</div>}
                          {item.address && <div><strong>Đ/c:</strong> {item.address}</div>}
                          {item.message && <div>{item.message}</div>}
                          {!item.dimensions && !item.address && !item.message && "Không có ghi chú"}
                        </td>
                        <td>
                          <span className={`status-pill ${item.status}`}>
                            {item.status === "pending" ? "Chờ tư vấn" : item.status === "contacted" ? "Đã liên hệ" : "Hoàn thành"}
                          </span>
                        </td>
                        <td>
                          {item.status === "pending" && (
                            <button
                              className="btn-action-icon"
                              title="Đánh dấu đã liên hệ"
                              onClick={() => handleUpdateContactStatus(item._id, "contacted")}
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                          <button
                            className="btn-action-icon delete"
                            title="Xóa yêu cầu"
                            onClick={() => handleDeleteContact(item._id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center", padding: "2rem" }}>
                        Không tìm thấy yêu cầu tư vấn nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* GIAO DIỆN DẠNG THẺ (CARD VIEW) DÀNH CHO ĐIỆN THOẠI - KHÔNG CẦN VUỐT NGANG */}
              <div className="admin-mobile-contact-cards">
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((item) => (
                    <div key={item._id} className="admin-contact-card-item">
                      <div className="admin-contact-card-header">
                        <div className="contact-card-customer-info">
                          <span className="contact-card-name">{item.fullName || "Khách Hàng"}</span>
                          <span className="contact-card-time">{new Date(item.createdAt).toLocaleString("vi-VN")}</span>
                        </div>
                        <span className={`status-pill ${item.status}`}>
                          {item.status === "pending" ? "Chờ tư vấn" : item.status === "contacted" ? "Đã liên hệ" : "Hoàn thành"}
                        </span>
                      </div>

                      <div className="admin-contact-card-phone-row">
                        <div className="contact-phone-display">
                          <Phone size={14} className="phone-icon" />
                          <a href={`tel:${item.phone}`} className="contact-phone-link">
                            {item.phone}
                          </a>
                        </div>
                        <a href={`tel:${item.phone}`} className="btn-quick-call">
                          Gọi ngay
                        </a>
                      </div>

                      <div className="admin-contact-card-category-row">
                        <span className="contact-label">Hạng mục:</span>
                        {item.productCategory?.toLowerCase().includes("dịch vụ") ? (
                          <span className="admin-badge-service">
                            🛠️ {item.productCategory}
                          </span>
                        ) : (
                          <span className="admin-badge-category">
                            {item.productName || item.productCategory}
                            {item.productCode ? ` (${item.productCode})` : ""}
                          </span>
                        )}
                      </div>

                      {(item.dimensions || item.address || item.message) ? (
                        <div className="admin-contact-card-details">
                          {item.dimensions && (
                            <div className="detail-line">
                              <strong>Kích thước:</strong> {item.dimensions} {item.quantity ? `(SL: ${item.quantity})` : ""}
                            </div>
                          )}
                          {item.address && (
                            <div className="detail-line">
                              <strong>Địa chỉ:</strong> {item.address}
                            </div>
                          )}
                          {item.message && (
                            <div className="detail-line message-line">
                              <strong>Lời nhắn:</strong> {item.message}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="admin-contact-card-details empty-note">
                          Không có ghi chú thêm
                        </div>
                      )}

                      <div className="admin-contact-card-actions">
                        {item.status === "pending" && (
                          <button
                            type="button"
                            className="card-contact-btn btn-mark-contacted"
                            onClick={() => handleUpdateContactStatus(item._id, "contacted")}
                          >
                            <CheckCircle size={14} />
                            <span>Đã liên hệ</span>
                          </button>
                        )}
                        <button
                          type="button"
                          className="card-contact-btn btn-delete-contact"
                          onClick={() => handleDeleteContact(item._id)}
                        >
                          <Trash2 size={14} />
                          <span>Xóa yêu cầu</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="admin-contact-card-empty">
                    Không tìm thấy yêu cầu tư vấn nào.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS (QUẢN LÝ DANH MỤC & SOẠN BÀI CHI TIẾT WORD) */}
          {activeTab === "products" && (
            <div className="product-management-wrapper">
              {/* THANH ĐIỀU HƯỚNG PHÂN HỆ QUẢN LÝ SẢN PHẨM */}
              <div className="product-subnav-bar">
                <button
                  type="button"
                  className={`product-subnav-btn ${productSubTab === "list" ? "active" : ""}`}
                  onClick={() => setProductSubTab("list")}
                >
                  <Package size={17} />
                  <span>Danh Mục Sản Phẩm</span>
                  <span className="subnav-count-pill">{products.length}</span>
                </button>

                <button
                  type="button"
                  className={`product-subnav-btn ${productSubTab === "editor" ? "active" : ""}`}
                  onClick={() => {
                    setProductSubTab("editor");
                  }}
                >
                  <FileEdit size={17} />
                  <span>Soạn Bài Chi Tiết SP & SEO (Word)</span>
                  {editingArticleCode && (
                    <span className="subnav-active-code-pill">
                      {editingArticleCode === "NEW" ? "✨ TẠO MỚI" : editingArticleCode}
                    </span>
                  )}
                </button>
              </div>

              {/* PHÂN HỆ 1: BẢNG DANH MỤC SẢN PHẨM */}
              {productSubTab === "list" && (
                <div className="admin-table-container">
                  <div className="table-action-header">
                    <h2>DANH MỤC SẢN PHẨM ({products.length})</h2>
                    <div className="table-header-controls">
                      <div className="admin-search-box">
                        <Search size={16} />
                        <input
                          type="text"
                          placeholder="Tìm mã SP, tên sản phẩm..."
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          className="admin-search-input"
                        />
                      </div>
                      <button className="btn-add-new" onClick={handleOpenAddProduct}>
                        <Plus size={16} /> THÊM SẢN PHẨM MỚI
                      </button>
                    </div>
                  </div>
                  {/* CUỘN NGANG DÀNH CHO BẢNG DESKTOP */}
                  <div className="table-scroll-hint product-scroll-hint"><span>⇄ Vuốt sang ngang để xem đầy đủ cột</span></div>
                  <table className="admin-table product-desktop-table">
                    <thead>
                      <tr>
                        <th>Hình ảnh</th>
                        <th>Tên sản phẩm</th>
                        <th>Mã SP</th>
                        <th>Danh mục</th>
                        <th>Mô tả chi tiết</th>
                        <th>Giá tham khảo</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((p) => (
                          <tr key={p._id}>
                            <td>
                              <img src={p.image} alt={p.title} style={{ width: 50, height: 40, objectFit: "cover", borderRadius: 6 }} />
                            </td>
                            <td style={{ fontWeight: 600 }}>
                              {p.title}
                              {p.badge && <span style={{ marginLeft: 8, fontSize: "0.7rem", background: "#d4af37", color: "#000", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>{p.badge}</span>}
                            </td>
                            <td><span style={{ background: "rgba(255,255,255,0.1)", padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>{p.code}</span></td>
                            <td><span className="admin-badge-category">{p.category}</span></td>
                            <td style={{ maxWidth: 250, fontSize: "0.85rem", color: "#94a3b8" }}>{p.description}</td>
                            <td style={{ color: "#10b981", fontWeight: 600 }}>{formatProductPrice(p.price, p.category)}</td>
                            <td>
                              <button
                                className="btn-action-icon article"
                                onClick={() => {
                                  setEditingArticleCode(p.code);
                                  setProductSubTab("editor");
                                }}
                                title={`Soạn bài viết chi tiết Word cho ${p.code}`}
                              >
                                <FileEdit size={16} />
                              </button>
                              <button
                                className="btn-action-icon edit"
                                onClick={() => handleOpenEditProduct(p)}
                                title="Sửa thông tin sản phẩm"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                className="btn-action-icon delete"
                                onClick={() => handleDeleteProduct(p._id)}
                                title="Xóa sản phẩm"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" style={{ textAlign: "center", padding: "2rem" }}>
                            Chưa có sản phẩm nào phù hợp với tìm kiếm.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* GIAO DIỆN DẠNG THẺ (CARD VIEW) DÀNH RIÊNG CHO ĐIỆN THOẠI - KHÔNG CẦN VUỐT NGANG */}
                  <div className="admin-mobile-product-cards">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((p) => (
                        <div key={p._id} className="admin-prod-card-item">
                          <div className="admin-prod-card-top">
                            <div className="admin-prod-card-img-wrap">
                              <img src={p.image} alt={p.title} className="admin-prod-card-img" />
                              {p.badge && !/hot/i.test(p.badge) && <span className="admin-prod-card-badge">{p.badge}</span>}
                            </div>

                            <div className="admin-prod-card-main-info">
                              <div className="admin-prod-card-meta">
                                <span className="admin-prod-card-code">{p.code}</span>
                                <span className="admin-badge-category">{p.category}</span>
                              </div>
                              <h3 className="admin-prod-card-title">{p.title}</h3>
                              <div className="admin-prod-card-price-row">
                                <span className="card-price-label">Giá:</span>
                                <span className="card-price-value">{formatProductPrice(p.price, p.category)}</span>
                              </div>
                            </div>
                          </div>

                          {p.description && (
                            <div className="admin-prod-card-desc">
                              {p.description}
                            </div>
                          )}

                          <div className="admin-prod-card-actions">
                            <button
                              type="button"
                              className="card-action-btn card-action-article"
                              onClick={() => {
                                setEditingArticleCode(p.code);
                                setProductSubTab("editor");
                              }}
                              title={`Soạn bài chi tiết cho ${p.code}`}
                            >
                              <FileEdit size={14} />
                              <span>Soạn bài</span>
                            </button>

                            <button
                              type="button"
                              className="card-action-btn card-action-edit"
                              onClick={() => handleOpenEditProduct(p)}
                              title="Sửa thông tin sản phẩm"
                            >
                              <Edit size={14} />
                              <span>Sửa</span>
                            </button>

                            <button
                              type="button"
                              className="card-action-btn card-action-delete"
                              onClick={() => handleDeleteProduct(p._id)}
                              title="Xóa sản phẩm"
                            >
                              <Trash2 size={14} />
                              <span>Xóa</span>
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="admin-prod-card-empty">
                        Chưa có sản phẩm nào phù hợp với tìm kiếm.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PHÂN HỆ 2: TRÌNH SOẠN BÀI VIẾT CHI TIẾT & SEO (WYSIWYG WORD) */}
              {productSubTab === "editor" && (
                <div className="product-editor-subtab-layout">
                  {/* KHUNG THÔNG TIN CƠ BẢN SẢN PHẨM (ẢNH 1 NẰM DƯỚI ẢNH 2, NGOÀI WORD) */}
                  <AdminProductQuickInfoCard
                    currentProductCode={editingArticleCode || (products[0]?.code) || "BEC.5810"}
                    onSelectProductCode={(code) => setEditingArticleCode(code)}
                    dbProducts={products}
                    onSaveProduct={handleSaveProductFromEditor}
                    showToast={showToast}
                    onBackToList={() => setProductSubTab("list")}
                  />

                  {/* TRÌNH SOẠN BÀI VIẾT CHI TIẾT & SEO (WORD) */}
                  <AdminProductArticleEditor
                    showToast={showToast}
                    initialProductCode={editingArticleCode || (products[0]?.code) || "BEC.5810"}
                    onBackToProducts={() => setProductSubTab("list")}
                    dbProducts={products}
                    onSelectProduct={(code) => setEditingArticleCode(code)}
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PROJECTS (FULL THÊM - SỬA - XÓA) */}
          {activeTab === "projects" && (
            <div className="admin-table-container">
              <div className="table-action-header">
                <h2>CÔNG TRÌNH TIÊU BIỂU ({projects.length})</h2>
                <div className="table-header-controls">
                  <div className="admin-search-box">
                    <Search size={16} />
                    <input
                      type="text"
                      placeholder="Tìm tên công trình, địa điểm..."
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                      className="admin-search-input"
                    />
                  </div>
                  <button 
                    className="btn-add-new" 
                    onClick={showProjectForm && !editingProject ? () => { setShowProjectForm(false); setEditingProject(null); } : handleOpenAddProject}
                    style={showProjectForm && !editingProject ? { background: "rgba(239, 68, 68, 0.2)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.4)" } : {}}
                  >
                    {showProjectForm && !editingProject ? (
                      <>
                        <X size={16} /> ĐÓNG KHUNG NHẬP
                      </>
                    ) : (
                      <>
                        <Plus size={16} /> THÊM CÔNG TRÌNH MỚI
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* KHUNG BIỂU MẪU THÊM / SỬA CÔNG TRÌNH NẰM TRỰC TIẾP TRÊN TRANG (INLINE FORM KHÔNG BỊ MODAL CHE NỀN) */}
              {showProjectForm && (
                <div className="admin-inline-form-card" ref={projectFormRef}>
                  <div className="inline-form-header">
                    <div className="inline-form-title">
                      <h3>
                        {editingProject ? (
                          <>
                            <span>✏️ Chỉnh Sửa Công Trình:</span>
                            <span className="highlight-text">{editingProject.title}</span>
                          </>
                        ) : (
                          <>
                            <span>➕ Thêm Công Trình Tiêu Biểu Mới</span>
                          </>
                        )}
                      </h3>
                      <p className="inline-form-desc">
                        {editingProject 
                          ? "Cập nhật thông tin chi tiết, địa điểm và danh sách hình ảnh thực tế của công trình bên dưới." 
                          : "Nhập thông tin công trình, tải lên nhiều hình ảnh để hiển thị công trình thực tế trên website."}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn-close-inline-form"
                      onClick={() => { setShowProjectForm(false); setEditingProject(null); }}
                      title="Đóng biểu mẫu"
                    >
                      <X size={16} />
                      <span>Đóng</span>
                    </button>
                  </div>

                  <AdminProjectArticleEditor
                    projectForm={projectForm}
                    setProjectForm={setProjectForm}
                    editingProject={editingProject}
                    onSave={handleProjectSubmit}
                    onCancel={() => { setShowProjectForm(false); setEditingProject(null); }}
                    showToast={showToast}
                    compressImage={compressImage}
                    isUploading={isUploadingProjectImg}
                    setIsUploading={setIsUploadingProjectImg}
                  />
                </div>
              )}
              <div className="table-scroll-hint"><span>⇄ Vuốt sang ngang để xem đầy đủ cột</span></div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Hình ảnh</th>
                    <th>Tên công trình</th>
                    <th>Hạng mục</th>
                    <th>Địa điểm</th>
                    <th>Ngày thi công</th>
                    <th>Mô tả</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((pr) => (
                      <tr key={pr._id}>
                        <td>
                          <img src={formatImgSrc(pr.image)} alt={pr.title} style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 6 }} />
                        </td>
                        <td style={{ fontWeight: 600 }}>{pr.title}</td>
                        <td><span className="admin-badge-category">{pr.category}</span></td>
                        <td>{pr.location}</td>
                        <td>
                          <span style={{ fontSize: "0.85rem", color: "#07522f", fontWeight: 600, background: "rgba(7, 82, 47, 0.08)", padding: "3px 8px", borderRadius: "5px", whiteSpace: "nowrap" }}>
                            {pr.completedDate || (pr.createdAt ? new Date(pr.createdAt).toLocaleDateString("vi-VN") : "—")}
                          </span>
                        </td>
                        <td style={{ maxWidth: 280, fontSize: "0.85rem", color: "#94a3b8" }}>{pr.description}</td>
                        <td>
                          <button
                            className="btn-action-icon edit"
                            onClick={() => handleOpenEditProject(pr)}
                            title="Sửa công trình"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="btn-action-icon delete"
                            onClick={() => handleDeleteProject(pr._id)}
                            title="Xóa công trình"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "2rem" }}>
                        Chưa có công trình nào phù hợp với tìm kiếm.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 4: NEWS (FULL THÊM - SỬA - XÓA) */}
          {activeTab === "news" && (
            <div className="admin-table-container">
              <div className="table-action-header">
                <h2>BÀI VIẾT & TIN TỨC ({news.length})</h2>
                <div className="table-header-controls">
                  <div className="admin-search-box">
                    <Search size={16} />
                    <input
                      type="text"
                      placeholder="Tìm tiêu đề, nội dung, chuyên mục..."
                      value={newsSearch}
                      onChange={(e) => setNewsSearch(e.target.value)}
                      className="admin-search-input"
                    />
                  </div>
                  <button
                    className="btn-add-new"
                    onClick={showNewsForm && !editingNews ? () => { setShowNewsForm(false); setEditingNews(null); } : handleOpenAddNews}
                    style={showNewsForm && !editingNews ? { background: "rgba(239, 68, 68, 0.2)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.4)" } : {}}
                  >
                    {showNewsForm && !editingNews ? (
                      <>
                        <X size={16} /> ĐÓNG KHUNG NHẬP
                      </>
                    ) : (
                      <>
                        <Plus size={16} /> THÊM BÀI VIẾT MỚI
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* KHUNG BIỂU MẪU THÊM / SỬA TIN TỨC NẰM TRỰC TIẾP TRÊN TRANG (INLINE FORM KHÔNG BỊ MODAL CHE NỀN) */}
              {showNewsForm && (
                <div className="admin-inline-form-card" ref={newsFormRef}>
                  <div className="inline-form-header">
                    <div className="inline-form-title">
                      <h3>
                        {editingNews ? (
                          <>
                            <span>✏️ Chỉnh Sửa Bài Viết Tin Tức:</span>
                            <span className="highlight-text">{editingNews.title}</span>
                          </>
                        ) : (
                          <>
                            <span>➕ Soạn Thảo & Đăng Bài Viết Tin Tức Mới</span>
                          </>
                        )}
                      </h3>
                      <p className="inline-form-desc">
                        {editingNews
                          ? "Cập nhật nội dung, tiêu đề, danh mục, hình ảnh minh họa và đường dẫn SEO của bài viết tin tức bên dưới."
                          : "Soạn bài viết tin tức chuyên ngành, cẩm nang chọn cửa hoặc kinh nghiệm thi công với trình soạn thảo trực quan đầy đủ tính năng."}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn-close-inline-form"
                      onClick={() => { setShowNewsForm(false); setEditingNews(null); }}
                      title="Đóng biểu mẫu"
                    >
                      <X size={16} />
                      <span>Đóng</span>
                    </button>
                  </div>

                  <AdminNewsArticleEditor
                    newsForm={newsForm}
                    setNewsForm={setNewsForm}
                    editingNews={editingNews}
                    onSave={handleNewsSubmit}
                    onCancel={() => { setShowNewsForm(false); setEditingNews(null); }}
                    showToast={showToast}
                    compressImage={compressImage}
                  />
                </div>
              )}

              <div className="table-scroll-hint"><span>⇄ Vuốt sang ngang để xem đầy đủ cột</span></div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Hình ảnh</th>
                    <th>Tiêu đề bài viết</th>
                    <th>Chuyên mục</th>
                    <th>Ngày đăng</th>
                    <th>Tác giả</th>
                    <th>Tóm tắt ngắn</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNews.length > 0 ? (
                    filteredNews.map((n) => (
                      <tr key={n._id || n.id}>
                        <td>
                          <img src={n.image || "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=120&q=80"} alt={n.title} style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 6 }} />
                        </td>
                        <td style={{ fontWeight: 600 }}>
                          <div>{n.title}</div>
                          <div style={{ fontSize: "0.78rem", color: "#38bdf8", marginTop: 4 }}>
                            <Link to={`/tin-tuc/${n.slug || slugify(n.title)}`} target="_blank" style={{ color: "#38bdf8", textDecoration: "none" }}>
                              🔗 /tin-tuc/{n.slug || slugify(n.title)}
                            </Link>
                          </div>
                        </td>
                        <td>
                          <span className="admin-badge-category" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                            {n.category || "Tư vấn"}
                          </span>
                        </td>
                        <td>{n.date}</td>
                        <td><span className="admin-badge-category">{n.author || "BOSS"}</span></td>
                        <td style={{ maxWidth: 260, fontSize: "0.85rem", color: "#94a3b8" }}>{n.summary}</td>
                        <td>
                          <button
                            className="btn-action-icon edit"
                            onClick={() => handleOpenEditNews(n)}
                            title="Sửa bài viết"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="btn-action-icon delete"
                            onClick={() => handleDeleteNews(n._id || n.id)}
                            title="Xóa bài viết"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center", padding: "2rem" }}>
                        Chưa có bài viết tin tức nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: SERVICES (FULL CRUD QUẢN LÝ DỊCH VỤ) */}
          {activeTab === "services" && (
            <div className="admin-table-container">
              <div className="table-action-header">
                <h2>DANH SÁCH DỊCH VỤ BOSS ĐÀ NẴNG ({services.length})</h2>
                <div className="table-header-controls">
                  <div className="admin-search-box">
                    <Search size={16} />
                    <input
                      type="text"
                      placeholder="Tìm tiêu đề, nội dung dịch vụ..."
                      value={serviceSearch}
                      onChange={(e) => setServiceSearch(e.target.value)}
                      className="admin-search-input"
                    />
                  </div>
                  <button
                    className="btn-seed-services"
                    onClick={() => handleSeedDefaultServices(false)}
                    disabled={seedingServices}
                    title="Khôi phục hoặc nạp thêm 8 dịch vụ tiêu chuẩn"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 14px",
                      background: "rgba(212,175,55,0.15)",
                      border: "1px solid rgba(212,175,55,0.4)",
                      color: "#d4af37",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      transition: "all 0.2s ease"
                    }}
                  >
                    <RotateCcw size={14} className={seedingServices ? "spin" : ""} />
                    {seedingServices ? "Đang nạp..." : "Nạp 8 Dịch Vụ Mẫu"}
                  </button>
                  <button className="btn-add-new" onClick={handleOpenAddService}>
                    <Plus size={16} /> THÊM DỊCH VỤ MỚI
                  </button>
                </div>
              </div>
              <div className="table-scroll-hint"><span>⇄ Vuốt sang ngang để xem đầy đủ cột</span></div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Hình ảnh</th>
                    <th>Tiêu đề dịch vụ</th>
                    <th>Ngày đăng</th>
                    <th>Thứ tự</th>
                    <th>Mô tả tóm tắt</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.length > 0 ? (
                    filteredServices.map((s, idx) => (
                      <tr key={s._id || s.id || idx}>
                        <td>
                          <img
                            src={formatImgSrc(s.img)}
                            alt={s.title}
                            style={{ width: 64, height: 44, objectFit: "cover", borderRadius: 6, border: "1px solid rgba(212,175,55,0.3)" }}
                          />
                        </td>
                        <td style={{ fontWeight: 600 }}>
                          <div style={{ color: "#f8fafc" }}>{s.title}</div>
                          <div style={{ fontSize: "0.78rem", color: "#38bdf8", marginTop: 4, display: "flex", alignItems: "center", gap: 8 }}>
                            <span>📞 Hotline: {s.phone || "0904.678.323"}</span>
                            <span>•</span>
                            <Link to="/dich-vu" target="_blank" style={{ color: "#38bdf8", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 3 }}>
                              <ExternalLink size={12} /> Xem trên web
                            </Link>
                          </div>
                        </td>
                        <td>{s.date}</td>
                        <td>
                          <span className="admin-badge-category" style={{ background: "rgba(212,175,55,0.15)", color: "#d4af37", fontWeight: 700 }}>
                            #{s.order ?? (idx + 1)}
                          </span>
                        </td>
                        <td style={{ maxWidth: 280, fontSize: "0.85rem", color: "#94a3b8" }}>
                          {s.desc}
                        </td>
                        <td>
                          <button
                            className="btn-action-icon edit"
                            onClick={() => handleOpenEditService(s)}
                            title="Sửa dịch vụ"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="btn-action-icon delete"
                            onClick={() => handleDeleteService(s._id)}
                            title="Xóa dịch vụ"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
                        <div style={{ maxWidth: 500, margin: "0 auto", color: "#94a3b8" }}>
                          <Wrench size={40} style={{ color: "#d4af37", margin: "0 auto 12px", display: "block" }} />
                          <h3 style={{ color: "#f8fafc", fontSize: "1.1rem", marginBottom: 8, fontWeight: 700 }}>
                            Chưa có dịch vụ nào trong cơ sở dữ liệu
                          </h3>
                          <p style={{ fontSize: "0.85rem", marginBottom: 20, color: "#94a3b8", lineHeight: 1.5 }}>
                            Hệ thống hiện chưa có bản ghi dịch vụ nào. Bạn có thể tự tạo dịch vụ mới hoặc nạp sẵn 8 dịch vụ tiêu chuẩn (cửa cuốn, sửa chữa 24/7, cửa kéo, phụ kiện...).
                          </p>
                          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                            <button
                              className="btn-add-new"
                              onClick={() => handleSeedDefaultServices(false)}
                              disabled={seedingServices}
                              style={{ background: "linear-gradient(135deg, #d4af37 0%, #b8972e 100%)", color: "#000", fontWeight: 700 }}
                            >
                              {seedingServices ? <Loader2 size={16} className="spin" /> : <RotateCcw size={16} />}
                              {seedingServices ? "Đang nạp dữ liệu..." : "⚡ Nạp 8 Dịch Vụ Mẫu Vào Admin"}
                            </button>
                            <button className="btn-add-new" onClick={handleOpenAddService}>
                              <Plus size={16} /> Thêm Dịch Vụ Mới
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* 5. QUẢN LÝ BÀI VIẾT SALE & SEO DANH MỤC */}
          {activeTab === "seo" && (
            <AdminCategorySeo showToast={showToast} />
          )}

          {/* 6. QUẢN LÝ BẢNG BÁO GIÁ KỸ THUẬT */}
          {activeTab === "pricing" && (
            <AdminPriceQuote showToast={showToast} />
          )}

          {/* 7. QUẢN LÝ ĐÁNH GIÁ KHÁCH HÀNG (CHỈ ĐƯỢC XÓA, KHÔNG ĐƯỢC SỬA) */}
          {activeTab === "reviews" && (
            <div className="admin-table-container">
              <div className="table-action-header">
                <h2>QUẢN LÝ ĐÁNH GIÁ KHÁCH HÀNG ({reviews.length})</h2>
                <div className="table-header-controls">
                  <div className="admin-search-box">
                    <Search size={16} />
                    <input
                      type="text"
                      placeholder="Tìm tên khách, email, nhận xét..."
                      value={reviewSearch}
                      onChange={(e) => setReviewSearch(e.target.value)}
                      className="admin-search-input"
                    />
                  </div>
                </div>
              </div>

              {/* THÔNG BÁO CHÍNH SÁCH CHỈ ĐƯỢC XÓA, KHÔNG ĐƯỢC SỬA */}
              <div className="admin-policy-banner">
                <div className="policy-badge-icon">
                  <Shield size={18} />
                </div>
                <div className="policy-text">
                  <strong>CHÍNH SÁCH BẢO TOÀN TÍNH XÁC THỰC CỦA ĐÁNH GIÁ:</strong>
                  <span>
                    Toàn bộ nhận xét do khách hàng gửi đều được giữ nguyên bản. Quản trị viên chỉ có quyền <b>Xóa bỏ</b> những đánh giá vi phạm (spam, quảng cáo rác, ngôn từ không phù hợp), <b>tuyệt đối không được phép chỉnh sửa</b> nội dung của khách hàng.
                  </span>
                </div>
              </div>

              {/* BỘ LỌC ĐÁNH GIÁ */}
              <div className="contact-filter-chips">
                <button
                  type="button"
                  className={`chip-btn ${reviewRatingFilter === "all" ? "active" : ""}`}
                  onClick={() => setReviewRatingFilter("all")}
                >
                  Tất cả ({reviews.length})
                </button>
                <button
                  type="button"
                  className={`chip-btn ${reviewRatingFilter === "5" ? "active" : ""}`}
                  onClick={() => setReviewRatingFilter("5")}
                >
                  ⭐ 5 Sao ({reviews.filter(r => Number(r.rating) === 5).length})
                </button>
                <button
                  type="button"
                  className={`chip-btn ${reviewRatingFilter === "4" ? "active" : ""}`}
                  onClick={() => setReviewRatingFilter("4")}
                >
                  ⭐ 4 Sao ({reviews.filter(r => Number(r.rating) === 4).length})
                </button>
                <button
                  type="button"
                  className={`chip-btn ${reviewRatingFilter === "3" ? "active" : ""}`}
                  onClick={() => setReviewRatingFilter("3")}
                >
                  ⭐ ≤ 3 Sao ({reviews.filter(r => Number(r.rating) <= 3).length})
                </button>
                <button
                  type="button"
                  className={`chip-btn ${reviewRatingFilter === "has_media" ? "active" : ""}`}
                  onClick={() => setReviewRatingFilter("has_media")}
                >
                  📷 Có Tệp Ảnh / Video ({reviews.filter(r => r.mediaUrl).length})
                </button>
              </div>

              {/* BẢNG DESKTOP */}
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: "45px" }}>STT</th>
                    <th style={{ width: "210px" }}>Khách Hàng</th>
                    <th style={{ width: "115px" }}>Đánh Giá</th>
                    <th style={{ width: "170px" }}>Khu Vực / Dự Án</th>
                    <th>Nội Dung Nhận Xét</th>
                    <th style={{ width: "120px" }}>Tệp Đính Kèm</th>
                    <th style={{ width: "105px" }}>Ngày Gửi</th>
                    <th style={{ width: "85px", textAlign: "center" }}>Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReviews.length > 0 ? (
                    filteredReviews.map((item, idx) => (
                      <tr key={item._id || item.id || idx}>
                        <td>{idx + 1}</td>
                        <td>
                          <div className="admin-review-user-cell">
                            <div
                              className="admin-review-avatar"
                              style={{ background: item.color || "#07522f" }}
                            >
                              {item.avatar || (item.name ? item.name[0].toUpperCase() : "K")}
                            </div>
                            <div className="admin-review-user-info">
                              <strong>{item.name}</strong>
                              {item.email && <span className="review-user-email">{item.email}</span>}
                              {item.verified && (
                                <span className="admin-verified-tag">
                                  <BadgeCheck size={11} /> Xác thực
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="admin-star-rating-cell">
                            <div className="admin-stars-row">
                              {[...Array(Number(item.rating) || 5)].map((_, i) => (
                                <Star key={i} size={13} fill="#f5bd20" color="#f5bd20" />
                              ))}
                            </div>
                            <span className="rating-score-pill">{item.rating || 5}.0 ⭐</span>
                          </div>
                        </td>
                        <td>
                          <span className="admin-review-role">{item.role || "Khách hàng"}</span>
                        </td>
                        <td>
                          <p className="admin-review-text-preview" title={item.text}>
                            “{item.text}”
                          </p>
                        </td>
                        <td>
                          {item.mediaUrl ? (
                            item.mediaType === "video" ? (
                              <button
                                type="button"
                                className="admin-media-thumb-btn"
                                onClick={() => setViewingReview(item)}
                                title="Bấm để xem video thực tế"
                              >
                                <VideoIcon size={13} /> Video clip
                              </button>
                            ) : (
                              <div
                                className="admin-review-thumb-wrap"
                                onClick={() => setViewingReview(item)}
                                title="Bấm để xem ảnh phóng to"
                              >
                                <img src={item.mediaUrl} alt="Ảnh thực tế" />
                                <span className="thumb-zoom-badge"><Eye size={10} /></span>
                              </div>
                            )
                          ) : (
                            <span className="no-media-text">-</span>
                          )}
                        </td>
                        <td>
                          <span className="admin-date-badge">
                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString("vi-VN") : "Mới đây"}
                          </span>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <div className="admin-actions-cell" style={{ justifyContent: "center" }}>
                            {/* Nút Xem chi tiết */}
                            <button
                              type="button"
                              className="btn-action-icon view"
                              onClick={() => setViewingReview(item)}
                              title="Xem chi tiết đầy đủ"
                            >
                              <Eye size={16} />
                            </button>
                            {/* CHỈ CÓ NÚT XÓA - KHÔNG CÓ NÚT SỬA */}
                            <button
                              type="button"
                              className="btn-action-icon delete"
                              onClick={() => handleDeleteReview(item._id || item.id)}
                              title="Xóa đánh giá này khỏi hệ thống"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
                        <Star size={36} style={{ color: "#64748b", margin: "0 auto 10px", display: "block" }} />
                        <h4 style={{ color: "#94a3b8" }}>Không tìm thấy đánh giá nào phù hợp</h4>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* DANH SÁCH THẺ MOBILE */}
              <div className="admin-mobile-review-cards">
                {filteredReviews.length > 0 ? (
                  filteredReviews.map((item, idx) => (
                    <div key={item._id || item.id || idx} className="admin-mobile-review-card">
                      <div className="m-review-header">
                        <div className="m-review-user">
                          <div
                            className="admin-review-avatar"
                            style={{ background: item.color || "#07522f" }}
                          >
                            {item.avatar || (item.name ? item.name[0].toUpperCase() : "K")}
                          </div>
                          <div>
                            <strong>{item.name}</strong>
                            <div className="m-review-meta">
                              <span>{item.role}</span>
                              {item.verified && (
                                <span className="admin-verified-tag">
                                  <BadgeCheck size={10} /> Đã xác thực
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="admin-stars-row">
                          {[...Array(Number(item.rating) || 5)].map((_, i) => (
                            <Star key={i} size={12} fill="#f5bd20" color="#f5bd20" />
                          ))}
                        </div>
                      </div>

                      <p className="m-review-body">“{item.text}”</p>

                      {item.mediaUrl && (
                        <div className="m-review-media">
                          {item.mediaType === "video" ? (
                            <video src={item.mediaUrl} controls style={{ maxHeight: "150px", width: "100%", borderRadius: "8px" }} />
                          ) : (
                            <img src={item.mediaUrl} alt="Ảnh đính kèm" style={{ maxHeight: "150px", width: "100%", objectFit: "cover", borderRadius: "8px" }} />
                          )}
                        </div>
                      )}

                      <div className="m-review-footer">
                        <span className="m-review-date">
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString("vi-VN") : "Mới đây"}
                        </span>

                        <div className="m-review-actions">
                          <button
                            type="button"
                            className="btn-m-action view"
                            onClick={() => setViewingReview(item)}
                          >
                            <Eye size={14} /> Chi tiết
                          </button>
                          {/* CHỈ CÓ NÚT XÓA */}
                          <button
                            type="button"
                            className="btn-m-action delete"
                            onClick={() => handleDeleteReview(item._id || item.id)}
                          >
                            <Trash2 size={14} /> Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
                    Không có đánh giá nào phù hợp
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 8. QUẢN LÝ BÀI VIẾT CHI TIẾT SẢN PHẨM (WYSIWYG WORD EDITOR) */}
          {activeTab === "article-editor" && (
            <div className="product-editor-subtab-layout">
              <AdminProductQuickInfoCard
                currentProductCode={editingArticleCode || (products[0]?.code) || "BEC.5810"}
                onSelectProductCode={(code) => setEditingArticleCode(code)}
                dbProducts={products}
                onSaveProduct={handleSaveProductFromEditor}
                showToast={showToast}
              />
              <AdminProductArticleEditor
                showToast={showToast}
                initialProductCode={editingArticleCode || (products[0]?.code) || "BEC.5810"}
                onBackToProducts={() => {
                  setActiveTab("products");
                  setProductSubTab("list");
                }}
                dbProducts={products}
                onSelectProduct={(code) => setEditingArticleCode(code)}
              />
            </div>
          )}
        </div>
      </main>

      {/* MODAL THÊM / SỬA SẢN PHẨM */}
      {showProductModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            <div className="modal-header">
              <h3>{editingProduct ? "✏️ Chỉnh Sửa Sản Phẩm" : "➕ Thêm Sản Phẩm Mới"}</h3>
              <button style={{ background: "none", border: "none", color: "white", cursor: "pointer" }} onClick={() => setShowProductModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleProductSubmit}>
              <div className="admin-form-group">
                <label>Tên sản phẩm *</label>
                <input
                  type="text"
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  required
                  placeholder="Ví dụ: CỬA CUỐN KHE THOÁNG CHỐNG BÃO"
                />
              </div>

              <div className="admin-form-grid-3">
                <div className="admin-form-group">
                  <label>Mã sản phẩm *</label>
                  <input
                    type="text"
                    value={productForm.code}
                    onChange={(e) => setProductForm({ ...productForm, code: e.target.value })}
                    required
                    placeholder="Mã: BD-999"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Danh mục *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      setIsCustomSubCategory(false);
                      setProductForm({
                        ...productForm,
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
                <div className="admin-form-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <label style={{ margin: 0 }}>Loại sản phẩm *</label>
                    <button
                      type="button"
                      onClick={() => {
                        const nextState = !isCustomSubCategory;
                        setIsCustomSubCategory(nextState);
                        if (!nextState && !availableSubCategories.includes(productForm.subCategory)) {
                          setProductForm({ ...productForm, subCategory: availableSubCategories[0] || "" });
                        }
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#10b981",
                        fontSize: "0.78rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        textDecoration: "underline",
                        padding: 0
                      }}
                    >
                      {isCustomSubCategory ? "← Chọn từ có sẵn" : "+ Điền tên khác"}
                    </button>
                  </div>

                  {!isCustomSubCategory ? (
                    <select
                      value={availableSubCategories.includes(productForm.subCategory) ? productForm.subCategory : "__custom__"}
                      onChange={(e) => {
                        if (e.target.value === "__custom__") {
                          setIsCustomSubCategory(true);
                        } else {
                          setProductForm({ ...productForm, subCategory: e.target.value });
                        }
                      }}
                    >
                      {availableSubCategories.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                      <option value="__custom__">+ Điền tên loại khác (Tự nhập)...</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={productForm.subCategory}
                      onChange={(e) => setProductForm({ ...productForm, subCategory: e.target.value })}
                      placeholder="Nhập tên loại sản phẩm mới..."
                      autoFocus
                      required
                    />
                  )}
                  {isCustomSubCategory && (
                    <span style={{ fontSize: "0.72rem", color: "#10b981", marginTop: "4px", display: "block" }}>
                      ✓ Sẽ tự động lưu và xuất hiện trên Navbar
                    </span>
                  )}
                </div>
              </div>

              <div className="admin-form-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <label style={{ margin: 0 }}>Giá tham khảo</label>
                  {productForm.price && (
                    <span style={{ fontSize: "0.78rem", color: "#10b981", fontWeight: 600 }}>
                      Hiển thị: {formatProductPrice(productForm.price, productForm.category)}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  onBlur={() => {
                    if (productForm.price && productForm.price.trim()) {
                      setProductForm((prev) => ({
                        ...prev,
                        price: formatProductPrice(prev.price, prev.category)
                      }));
                    }
                  }}
                  placeholder="Ví dụ: 100000 hoặc 1.500.000đ/m2"
                />
              </div>

              <div className="admin-form-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <label style={{ margin: 0 }}>URL Hình ảnh (Image Link) *</label>
                  <span style={{ fontSize: "0.76rem", color: "#38bdf8" }}>Dán link hoặc chọn từ máy</span>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input
                    type="text"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    required
                    placeholder="Nhập đường dẫn ảnh hoặc bấm nút bên cạnh..."
                    style={{ flex: 1 }}
                  />
                  <label style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "linear-gradient(135deg, rgba(0, 77, 50, 0.95) 0%, rgba(5, 150, 105, 0.95) 100%)",
                    color: "white",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                    border: "1px solid rgba(16, 185, 129, 0.4)"
                  }}>
                    <Upload size={15} />
                    {isUploadingProductImg ? "Đang tải..." : "Chọn ảnh từ máy"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadProductImage}
                      disabled={isUploadingProductImg}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>

                {/* Preview Thumbnail */}
                {productForm.image && (
                  <div style={{
                    marginTop: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    background: "rgba(0,0,0,0.3)",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px dashed rgba(16, 185, 129, 0.35)"
                  }}>
                    <img
                      src={formatImgSrc(productForm.image)}
                      alt="Preview"
                      style={{ width: "60px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <span style={{ fontSize: "0.8rem", color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                      {productForm.image}
                    </span>
                    <button
                      type="button"
                      onClick={() => setProductForm({ ...productForm, image: "" })}
                      style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#f87171", padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem", cursor: "pointer" }}
                    >
                      Xóa
                    </button>
                  </div>
                )}
              </div>

              <div className="admin-form-group">
                <label>Thông số kỹ thuật (phân cách bằng dấu phẩy)</label>
                <input
                  type="text"
                  value={productForm.specs}
                  onChange={(e) => setProductForm({ ...productForm, specs: e.target.value })}
                  placeholder="Nhôm 6063-T5, Sơn tĩnh điện CHLB Đức, Bảo hành 5 năm"
                />
              </div>

              <div className="modal-footer modal-footer-spaced">
                <div>
                  {productForm.code && (
                    <button
                      type="button"
                      className="btn-shortcut-to-editor"
                      onClick={() => {
                        const code = productForm.code;
                        setShowProductModal(false);
                        setActiveTab("products");
                        setEditingArticleCode(code);
                        setProductSubTab("editor");
                      }}
                      title="Mở trình soạn thảo bài viết Word cho sản phẩm này"
                    >
                      <FileEdit size={15} /> Soạn Bài Chi Tiết (Word)
                    </button>
                  )}
                </div>
                <div className="modal-actions-right">
                  <button type="button" className="btn-cancel" onClick={() => setShowProductModal(false)}>Hủy</button>
                  <button type="submit" className="btn-save">
                    {editingProduct ? "Cập Nhật Sản Phẩm" : "Lưu Sản Phẩm"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* MODAL THÊM / SỬA DỊCH VỤ */}
      {showServiceModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            <div className="modal-header">
              <h3>{editingService ? "✏️ Chỉnh Sửa Dịch Vụ BOSS" : "➕ Thêm Dịch Vụ Mới Vào Hệ Thống"}</h3>
              <button
                type="button"
                style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}
                onClick={() => setShowServiceModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleServiceSubmit}>
              <div className="admin-form-group">
                <label>Tiêu đề dịch vụ *</label>
                <input
                  type="text"
                  value={serviceForm.title}
                  onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                  required
                  placeholder="Ví dụ: SỬA CHỮA CỬA CUỐN 24/24 TẠI ĐÀ NẴNG"
                />
              </div>

              <div className="admin-form-grid-3">
                <div className="admin-form-group">
                  <label>Ngày đăng</label>
                  <input
                    type="text"
                    value={serviceForm.date}
                    onChange={(e) => setServiceForm({ ...serviceForm, date: e.target.value })}
                    placeholder="DD/MM/YYYY"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Thứ tự hiển thị</label>
                  <input
                    type="number"
                    value={serviceForm.order}
                    onChange={(e) => setServiceForm({ ...serviceForm, order: Number(e.target.value) })}
                    placeholder="1, 2, 3..."
                  />
                </div>
                <div className="admin-form-group">
                  <label>Hotline hỗ trợ</label>
                  <input
                    type="text"
                    value={serviceForm.phone}
                    onChange={(e) => setServiceForm({ ...serviceForm, phone: e.target.value })}
                    placeholder="0904.678.323"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Hình ảnh đại diện dịch vụ *</label>
                <div className="service-img-input-row" style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
                  <input
                    type="text"
                    value={serviceForm.img}
                    onChange={(e) => setServiceForm({ ...serviceForm, img: e.target.value })}
                    required
                    placeholder="Đường dẫn ảnh: /service_repair_247.png hoặc URL"
                    style={{ flex: 1 }}
                  />
                  <label className="btn-upload-file-label" style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "rgba(212, 175, 55, 0.2)",
                    color: "#f5d77f",
                    border: "1px solid rgba(212, 175, 55, 0.4)",
                    padding: "9px 14px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    whiteSpace: "nowrap"
                  }}>
                    <Upload size={15} />
                    {isUploadingServiceImg ? "Đang tải..." : "Tải ảnh từ máy"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadServiceImage}
                      disabled={isUploadingServiceImg}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>

                {/* Preview Thumbnail */}
                {serviceForm.img && (
                  <div className="service-img-preview-box" style={{
                    marginTop: "6px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    background: "rgba(0,0,0,0.3)",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px dashed rgba(212,175,55,0.3)"
                  }}>
                    <img
                      src={formatImgSrc(serviceForm.img)}
                      alt="Preview"
                      style={{ width: "70px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                      Xem trước hình ảnh đại diện dịch vụ
                    </span>
                  </div>
                )}
              </div>

              <div className="admin-form-group">
                <label>Mô tả tóm tắt (hiển thị trên thẻ dịch vụ)</label>
                <textarea
                  rows="2"
                  value={serviceForm.desc}
                  onChange={(e) => setServiceForm({ ...serviceForm, desc: e.target.value })}
                  placeholder="Mô tả ngắn gọn về dịch vụ này..."
                ></textarea>
              </div>

              <div className="admin-form-group">
                <label>Nội dung chi tiết dịch vụ (khi bấm 'Xem chi tiết')</label>
                <textarea
                  rows="6"
                  value={serviceForm.content}
                  onChange={(e) => setServiceForm({ ...serviceForm, content: e.target.value })}
                  placeholder="Nội dung chi tiết từng gạch đầu dòng, quy trình, cam kết bảo hành..."
                ></textarea>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowServiceModal(false)}>Hủy</button>
                <button type="submit" className="btn-save">
                  {editingService ? "Cập Nhật Dịch Vụ" : "Lưu Dịch Vụ Mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL XEM CHI TIẾT ĐÁNH GIÁ (CHỈ XEM & XÓA - TUYỆT ĐỐI KHÔNG CÓ FORM SỬA) */}
      {viewingReview && (
        <div className="admin-modal-overlay" onClick={() => setViewingReview(null)}>
          <div className="admin-modal-card admin-review-detail-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <Star size={18} fill="#f5bd20" color="#f5bd20" /> Chi Tiết Đánh Giá Khách Hàng
              </h3>
              <button
                type="button"
                style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}
                onClick={() => setViewingReview(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="review-modal-body-readonly">
              {/* Reviewer Header */}
              <div className="readonly-reviewer-box">
                <div
                  className="readonly-avatar"
                  style={{ background: viewingReview.color || "#07522f" }}
                >
                  {viewingReview.avatar || (viewingReview.name ? viewingReview.name[0].toUpperCase() : "K")}
                </div>
                <div className="readonly-user-details">
                  <h4>{viewingReview.name}</h4>
                  <div className="readonly-meta-tags">
                    {viewingReview.email && <span>{viewingReview.email}</span>}
                    <span>• {viewingReview.role || "Khách hàng"}</span>
                    {viewingReview.verified && (
                      <span className="admin-verified-tag"><BadgeCheck size={12} /> Đã xác thực</span>
                    )}
                  </div>
                </div>
                <div className="readonly-rating-badge">
                  <div className="admin-stars-row">
                    {[...Array(Number(viewingReview.rating) || 5)].map((_, i) => (
                      <Star key={i} size={15} fill="#f5bd20" color="#f5bd20" />
                    ))}
                  </div>
                  <strong>{viewingReview.rating || 5}/5 Sao</strong>
                </div>
              </div>

              {/* Review Content */}
              <div className="readonly-content-box">
                <label>Nội dung nhận xét & cảm nhận:</label>
                <p className="readonly-text">“{viewingReview.text}”</p>
              </div>

              {/* Media Preview if attached */}
              {viewingReview.mediaUrl && (
                <div className="readonly-media-box">
                  <label>Hình ảnh / Video thực tế đính kèm:</label>
                  {viewingReview.mediaType === "video" ? (
                    <video src={viewingReview.mediaUrl} controls autoPlay={false} className="readonly-video-player" />
                  ) : (
                    <img src={viewingReview.mediaUrl} alt="Ảnh thực tế" className="readonly-img-view" />
                  )}
                </div>
              )}

              {/* Transparency Notice */}
              <div className="readonly-transparency-note">
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>
                  Đánh giá này được bảo toàn nguyên vẹn theo đúng chính sách minh bạch. Quản trị viên chỉ có thể <b>Xóa</b> đánh giá nếu vi phạm tiêu chuẩn cộng đồng, hệ thống không cung cấp chức năng chỉnh sửa.
                </span>
              </div>
            </div>

            <div className="modal-footer" style={{ justifyContent: "space-between" }}>
              <button
                type="button"
                className="btn-cancel-modal"
                onClick={() => setViewingReview(null)}
              >
                Đóng
              </button>

              <button
                type="button"
                className="btn-delete-review-modal"
                onClick={() => {
                  handleDeleteReview(viewingReview._id || viewingReview.id);
                  setViewingReview(null);
                }}
              >
                <Trash2 size={16} /> Xóa Đánh Giá Này
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
