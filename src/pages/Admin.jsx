import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { 
  Users, Package, FolderKanban, CheckCircle, Trash2, Plus, Edit,
  RefreshCw, X, Shield, Phone, ArrowLeft, LayoutDashboard, Database,
  Newspaper, Search, Eye, Tag, FileText, Check, Menu, LogOut, Sparkles, FileSpreadsheet, FileEdit,
  Wrench, Upload, Image as ImageIcon, ExternalLink, Filter, RotateCcw, Loader2
} from "lucide-react";
import AdminCategorySeo from "../components/AdminCategorySeo";
import AdminPriceQuote from "../components/AdminPriceQuote";
import AdminProductArticleEditor from "../components/AdminProductArticleEditor";
import { useAuth } from "../context/AuthContext";
import { slugify } from "../utils/slug.js";
import { DEFAULT_SERVICES as DEFAULT_SAMPLE_SERVICES } from "../data/defaultServices";
import "./Admin.css";

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
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Search states
  const [productSearch, setProductSearch] = useState("");
  const [projectSearch, setProjectSearch] = useState("");
  const [newsSearch, setNewsSearch] = useState("");
  const [contactSearch, setContactSearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");
  const [contactFilter, setContactFilter] = useState("all"); // "all" | "service" | "product"

  // Modals state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = add, object = edit

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [showNewsModal, setShowNewsModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isUploadingServiceImg, setIsUploadingServiceImg] = useState(false);

  // Form states
  const initialProductState = {
    title: "",
    code: "",
    category: "cuacuon",
    subCategory: "Cửa cuốn khe thoáng Đức",
    image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=800&q=80",
    description: "",
    specs: "Hợp kim nhôm 6063-T5, Bảo hành 5 năm",
    badge: "HOT",
    price: "1.500.000đ/m2"
  };

  const initialProjectState = {
    title: "",
    category: "Cửa Trượt Tự Động",
    location: "Đà Nẵng",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    description: "Công trình thi công lắp đặt hoàn thiện chuẩn cao cấp."
  };

  const initialNewsState = {
    title: "",
    slug: "",
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80",
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
  const [projectForm, setProjectForm] = useState(initialProjectState);
  const [newsForm, setNewsForm] = useState(initialNewsState);
  const [serviceForm, setServiceForm] = useState(initialServiceState);

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
      const [resC, resP, resPr, resN, resS] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/contacts`),
        fetch(`${import.meta.env.VITE_API_URL}/api/products`),
        fetch(`${import.meta.env.VITE_API_URL}/api/projects`),
        fetch(`${import.meta.env.VITE_API_URL}/api/news`),
        fetch(`${import.meta.env.VITE_API_URL}/api/services`)
      ]);

      const dataC = await resC.json();
      const dataP = await resP.json();
      const dataPr = await resPr.json();
      const dataN = await resN.json();
      const dataS = await resS.json();

      if (dataC.success) setContacts(dataC.data);
      if (dataP.success) setProducts(dataP.data);
      if (dataPr.success) setProjects(dataPr.data);
      if (dataN.success) setNews(dataN.data);
      
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

      // Auto-sync with backend if backend DB is empty
      if (dataS && dataS.success && Array.isArray(dataS.data) && dataS.data.length === 0) {
        try {
          fetch(`${import.meta.env.VITE_API_URL}/api/services/seed`, { method: "POST" })
            .catch(() => {});
        } catch (_) {}
      }
    } catch (err) {
      console.error("Admin Fetch Error:", err);
      showToast("❌ Lỗi khi kết nối MongoDB backend");
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
        showToast("🗑️ Đã xóa yêu cầu tư vấn khỏi MongoDB");
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
    setProductForm(initialProductState);
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title || "",
      code: product.code || "",
      category: product.category || "cuacuon",
      subCategory: product.subCategory || "Cửa cuốn khe thoáng Đức",
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

      const payload = { ...productForm, specs: specsArray };

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
          setProducts(products.map(p => p._id === editingProduct._id ? data.data : p));
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
          setProducts([data.data, ...products]);
          showToast("🎉 Thêm sản phẩm mới vào MongoDB thành công!");
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

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi MongoDB?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProducts(products.filter(p => p._id !== id));
        showToast("🗑️ Đã xóa sản phẩm thành công!");
      }
    } catch (err) {
      console.error("Delete product error:", err);
      showToast("❌ Lỗi khi xóa sản phẩm");
    }
  };

  // ----------------------------------------------------
  // PROJECT HANDLERS (ADD & EDIT & DELETE)
  // ----------------------------------------------------
  const handleOpenAddProject = () => {
    setEditingProject(null);
    setProjectForm(initialProjectState);
    setShowProjectModal(true);
  };

  const handleOpenEditProject = (project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title || "",
      category: project.category || "Cửa Trượt Tự Động",
      location: project.location || "Đà Nẵng",
      image: project.image || "",
      description: project.description || ""
    });
    setShowProjectModal(true);
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      let res, data;
      if (editingProject) {
        res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${editingProject._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectForm)
        });
        data = await res.json();
        if (data.success) {
          setProjects(projects.map(p => p._id === editingProject._id ? data.data : p));
          showToast("✨ Đã cập nhật thông tin dự án thành công!");
        }
      } else {
        res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectForm)
        });
        data = await res.json();
        if (data.success) {
          setProjects([data.data, ...projects]);
          showToast("🎉 Thêm dự án mới thành công!");
        }
      }

      if (data.success) {
        setShowProjectModal(false);
      }
    } catch (err) {
      console.error("Project Submit Error:", err);
      showToast("❌ Lỗi khi lưu dữ liệu dự án");
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa dự án này?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProjects(projects.filter(p => p._id !== id));
        showToast("🗑️ Đã xóa dự án thành công!");
      }
    } catch (err) {
      console.error("Delete project error:", err);
      showToast("❌ Lỗi khi xóa dự án");
    }
  };

  // ----------------------------------------------------
  // NEWS HANDLERS (ADD & EDIT & DELETE)
  // ----------------------------------------------------
  const handleOpenAddNews = () => {
    setEditingNews(null);
    setNewsForm(initialNewsState);
    setShowNewsModal(true);
  };

  const handleOpenEditNews = (article) => {
    setEditingNews(article);
    setNewsForm({
      title: article.title || "",
      slug: article.slug || "",
      image: article.image || "",
      date: article.date || new Date().toLocaleDateString("vi-VN"),
      summary: article.summary || "",
      content: article.content || "",
      author: article.author || "BOSS Đà Nẵng"
    });
    setShowNewsModal(true);
  };

  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newsForm,
        slug: newsForm.slug && newsForm.slug.trim() ? newsForm.slug.trim() : slugify(newsForm.title)
      };

      let res, data;
      if (editingNews) {
        res = await fetch(`${import.meta.env.VITE_API_URL}/api/news/${editingNews._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        data = await res.json();
        if (data.success) {
          setNews(news.map(n => n._id === editingNews._id ? data.data : n));
          showToast("✨ Đã cập nhật bài viết thành công!");
        }
      } else {
        res = await fetch(`${import.meta.env.VITE_API_URL}/api/news`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        data = await res.json();
        if (data.success) {
          setNews([data.data, ...news]);
          showToast("🎉 Thêm bài viết mới thành công!");
        }
      }

      if (data.success) {
        setShowNewsModal(false);
      }
    } catch (err) {
      console.error("News Submit Error:", err);
      showToast("❌ Lỗi khi lưu bài viết");
    }
  };

  const handleDeleteNews = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài viết này?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/news/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setNews(news.filter(n => n._id !== id));
        showToast("🗑️ Đã xóa bài viết thành công!");
      }
    } catch (err) {
      console.error("Delete news error:", err);
      showToast("❌ Lỗi khi xóa bài viết");
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

  // Filtered Lists for Search
  const filteredProducts = products.filter(p => 
    p.title?.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.code?.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category?.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredProjects = projects.filter(p => 
    p.title?.toLowerCase().includes(projectSearch.toLowerCase()) ||
    p.category?.toLowerCase().includes(projectSearch.toLowerCase()) ||
    p.location?.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const filteredNews = news.filter(n => 
    n.title?.toLowerCase().includes(newsSearch.toLowerCase()) ||
    n.summary?.toLowerCase().includes(newsSearch.toLowerCase())
  );

  const filteredServices = services.filter(s =>
    s.title?.toLowerCase().includes(serviceSearch.toLowerCase()) ||
    s.desc?.toLowerCase().includes(serviceSearch.toLowerCase()) ||
    s.content?.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  const filteredContacts = contacts.filter(c => {
    const matchesSearch =
      c.fullName?.toLowerCase().includes(contactSearch.toLowerCase()) ||
      c.phone?.includes(contactSearch) ||
      c.productCategory?.toLowerCase().includes(contactSearch.toLowerCase()) ||
      c.message?.toLowerCase().includes(contactSearch.toLowerCase());

    if (!matchesSearch) return false;

    const isServiceBooking = c.productCategory?.toLowerCase().includes("dịch vụ");
    if (contactFilter === "service") return isServiceBooking;
    if (contactFilter === "product") return !isServiceBooking;
    return true;
  });

  const pendingContactsCount = contacts.filter(c => c.status === "pending").length;
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
            <span>MONGODB CONTROL</span>
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
            className={`admin-nav-item ${activeTab === "products" && productSubTab === "list" ? "active" : ""}`}
            onClick={() => { 
              setActiveTab("products"); 
              setProductSubTab("list");
              setMobileMenuOpen(false); 
            }}
          >
            <Package size={18} /> Quản Lý Sản Phẩm
          </button>

          <button 
            className={`admin-nav-item ${activeTab === "projects" ? "active" : ""}`}
            onClick={() => { setActiveTab("projects"); setMobileMenuOpen(false); }}
          >
            <FolderKanban size={18} /> Quản Lý Dự Án
          </button>

          <button 
            className={`admin-nav-item ${activeTab === "news" ? "active" : ""}`}
            onClick={() => { setActiveTab("news"); setMobileMenuOpen(false); }}
          >
            <Newspaper size={18} /> Quản Lý Tin Tức
          </button>

          <button 
            className={`admin-nav-item ${activeTab === "services" ? "active" : ""}`}
            onClick={() => { setActiveTab("services"); setMobileMenuOpen(false); }}
          >
            <Wrench size={18} /> Quản Lý Dịch Vụ
            {services.length > 0 && <span className="nav-badge-count">{services.length}</span>}
          </button>

          <button 
            className={`admin-nav-item ${activeTab === "seo" ? "active" : ""}`}
            onClick={() => { setActiveTab("seo"); setMobileMenuOpen(false); }}
          >
            <Sparkles size={18} /> Bài Sale & SEO Danh Mục
          </button>

          <button 
            className={`admin-nav-item ${activeTab === "pricing" ? "active" : ""}`}
            onClick={() => { setActiveTab("pricing"); setMobileMenuOpen(false); }}
          >
            <FileSpreadsheet size={18} /> Quản Lý Bảng Báo Giá
          </button>

          <button 
            className={`admin-nav-item ${activeTab === "products" && productSubTab === "editor" ? "active" : ""}`}
            onClick={() => { 
              setActiveTab("products"); 
              setProductSubTab("editor");
              setMobileMenuOpen(false); 
            }}
          >
            <FileEdit size={18} /> Soạn Bài Chi Tiết SP (Word)
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
              <span className="topbar-status-text">MongoDB Atlas Connected</span>
              <span className="topbar-status-mobile-text">Atlas Live</span>
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
          {/* MOBILE QUICK TABS BAR */}
          <div className="admin-mobile-quick-tabs">
            <button 
              className={`mobile-quick-tab ${activeTab === "contacts" ? "active" : ""}`}
              onClick={() => setActiveTab("contacts")}
            >
              <Phone size={14} />
              <span>Báo Giá</span>
              {pendingContactsCount > 0 && <span className="tab-pill-count">{pendingContactsCount}</span>}
            </button>

            <button 
              className={`mobile-quick-tab ${activeTab === "services" ? "active" : ""}`}
              onClick={() => setActiveTab("services")}
            >
              <Wrench size={14} />
              <span>Dịch Vụ</span>
              {services.length > 0 && <span className="tab-pill-count">{services.length}</span>}
            </button>

            <button 
              className={`mobile-quick-tab ${activeTab === "products" && productSubTab === "list" ? "active" : ""}`}
              onClick={() => { setActiveTab("products"); setProductSubTab("list"); }}
            >
              <Package size={14} />
              <span>Sản Phẩm</span>
            </button>

            <button 
              className={`mobile-quick-tab ${activeTab === "projects" ? "active" : ""}`}
              onClick={() => setActiveTab("projects")}
            >
              <FolderKanban size={14} />
              <span>Dự Án</span>
            </button>

            <button 
              className={`mobile-quick-tab ${activeTab === "news" ? "active" : ""}`}
              onClick={() => setActiveTab("news")}
            >
              <Newspaper size={14} />
              <span>Tin Tức</span>
            </button>

            <button 
              className={`mobile-quick-tab ${activeTab === "seo" ? "active" : ""}`}
              onClick={() => setActiveTab("seo")}
            >
              <Sparkles size={14} />
              <span>Bài Sale</span>
            </button>

            <button 
              className={`mobile-quick-tab ${activeTab === "pricing" ? "active" : ""}`}
              onClick={() => setActiveTab("pricing")}
            >
              <FileSpreadsheet size={14} />
              <span>Bảng Giá KT</span>
            </button>

            <button 
              className={`mobile-quick-tab ${activeTab === "products" && productSubTab === "editor" ? "active" : ""}`}
              onClick={() => { setActiveTab("products"); setProductSubTab("editor"); }}
            >
              <FileEdit size={14} />
              <span>Soạn Bài SP</span>
            </button>
          </div>

          {/* STATS CARDS */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
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

            <div className="admin-stat-card">
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

            <div className="admin-stat-card">
              <div className="stat-icon">
                <Package size={24} />
              </div>
              <div className="stat-info">
                <h4>
                  <span className="desktop-stat-label">Sản Phẩm Trong Database</span>
                  <span className="mobile-stat-label">Tổng Sản Phẩm</span>
                </h4>
                <p>{products.length}</p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-icon blue">
                <FolderKanban size={24} />
              </div>
              <div className="stat-info">
                <h4>Dự Án Tiêu Biểu</h4>
                <p>{projects.length}</p>
              </div>
            </div>

            <div className="admin-stat-card">
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
                    <span className="subnav-active-code-pill">{editingArticleCode}</span>
                  )}
                </button>
              </div>

              {/* PHÂN HỆ 1: BẢNG DANH MỤC SẢN PHẨM (MONGODB CRUD) */}
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
                            <td style={{ color: "#10b981", fontWeight: 600 }}>{p.price || "Liên hệ"}</td>
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
                              {p.badge && <span className="admin-prod-card-badge">{p.badge}</span>}
                            </div>
                            
                            <div className="admin-prod-card-main-info">
                              <div className="admin-prod-card-meta">
                                <span className="admin-prod-card-code">{p.code}</span>
                                <span className="admin-badge-category">{p.category}</span>
                              </div>
                              <h3 className="admin-prod-card-title">{p.title}</h3>
                              <div className="admin-prod-card-price-row">
                                <span className="card-price-label">Giá:</span>
                                <span className="card-price-value">{p.price || "Liên hệ"}</span>
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
                <AdminProductArticleEditor 
                  showToast={showToast} 
                  initialProductCode={editingArticleCode}
                  onBackToProducts={() => setProductSubTab("list")}
                  dbProducts={products}
                />
              )}
            </div>
          )}

          {/* TAB 3: PROJECTS (FULL THÊM - SỬA - XÓA) */}
          {activeTab === "projects" && (
            <div className="admin-table-container">
              <div className="table-action-header">
                <h2>DỰ ÁN TIÊU BIỂU ({projects.length})</h2>
                <div className="table-header-controls">
                  <div className="admin-search-box">
                    <Search size={16} />
                    <input 
                      type="text" 
                      placeholder="Tìm tên dự án, địa điểm..."
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                      className="admin-search-input"
                    />
                  </div>
                  <button className="btn-add-new" onClick={handleOpenAddProject}>
                    <Plus size={16} /> THÊM DỰ ÁN MỚI
                  </button>
                </div>
              </div>
              <div className="table-scroll-hint"><span>⇄ Vuốt sang ngang để xem đầy đủ cột</span></div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Hình ảnh</th>
                    <th>Tên dự án</th>
                    <th>Hạng mục</th>
                    <th>Địa điểm</th>
                    <th>Mô tả</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((pr) => (
                      <tr key={pr._id}>
                        <td>
                          <img src={pr.image} alt={pr.title} style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 6 }} />
                        </td>
                        <td style={{ fontWeight: 600 }}>{pr.title}</td>
                        <td><span className="admin-badge-category">{pr.category}</span></td>
                        <td>{pr.location}</td>
                        <td style={{ maxWidth: 280, fontSize: "0.85rem", color: "#94a3b8" }}>{pr.description}</td>
                        <td>
                          <button 
                            className="btn-action-icon edit"
                            onClick={() => handleOpenEditProject(pr)}
                            title="Sửa dự án"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="btn-action-icon delete"
                            onClick={() => handleDeleteProject(pr._id)}
                            title="Xóa dự án"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "2rem" }}>
                        Chưa có dự án nào phù hợp với tìm kiếm.
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
                      placeholder="Tìm tiêu đề bài viết..."
                      value={newsSearch}
                      onChange={(e) => setNewsSearch(e.target.value)}
                      className="admin-search-input"
                    />
                  </div>
                  <button className="btn-add-new" onClick={handleOpenAddNews}>
                    <Plus size={16} /> THÊM BÀI VIẾT MỚI
                  </button>
                </div>
              </div>
              <div className="table-scroll-hint"><span>⇄ Vuốt sang ngang để xem đầy đủ cột</span></div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Hình ảnh</th>
                    <th>Tiêu đề bài viết</th>
                    <th>Ngày đăng</th>
                    <th>Tác giả</th>
                    <th>Tóm tắt ngắn</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNews.length > 0 ? (
                    filteredNews.map((n) => (
                      <tr key={n._id}>
                        <td>
                          <img src={n.image} alt={n.title} style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 6 }} />
                        </td>
                        <td style={{ fontWeight: 600 }}>
                          <div>{n.title}</div>
                          <div style={{ fontSize: "0.78rem", color: "#38bdf8", marginTop: 4 }}>
                            <Link to={`/tin-tuc/${n.slug || slugify(n.title)}`} target="_blank" style={{ color: "#38bdf8", textDecoration: "none" }}>
                              🔗 /tin-tuc/{n.slug || slugify(n.title)}
                            </Link>
                          </div>
                        </td>
                        <td>{n.date}</td>
                        <td><span className="admin-badge-category">{n.author || "BOSS"}</span></td>
                        <td style={{ maxWidth: 280, fontSize: "0.85rem", color: "#94a3b8" }}>{n.summary}</td>
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
                            onClick={() => handleDeleteNews(n._id)}
                            title="Xóa bài viết"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "2rem" }}>
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

          {/* 7. QUẢN LÝ BÀI VIẾT CHI TIẾT SẢN PHẨM (WYSIWYG WORD EDITOR) */}
          {activeTab === "article-editor" && (
            <AdminProductArticleEditor 
              showToast={showToast}
              initialProductCode={editingArticleCode}
              onBackToProducts={() => {
                setActiveTab("products");
                setProductSubTab("list");
              }}
              dbProducts={products}
            />
          )}
        </div>
      </main>

      {/* MODAL THÊM / SỬA SẢN PHẨM */}
      {showProductModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            <div className="modal-header">
              <h3>{editingProduct ? "✏️ Chỉnh Sửa Sản Phẩm MongoDB" : "➕ Thêm Sản Phẩm Mới Vào MongoDB"}</h3>
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
                  <label>Loại sản phẩm *</label>
                  <select 
                    value={productForm.subCategory} 
                    onChange={(e) => setProductForm({ ...productForm, subCategory: e.target.value })}
                  >
                    {SUBCATEGORIES[productForm.category]?.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="admin-form-grid-2">
                <div className="admin-form-group">
                  <label>Giá tham khảo</label>
                  <input 
                    type="text" 
                    value={productForm.price} 
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} 
                    placeholder="1.500.000đ/m2"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Nhãn Nổi Bật (Badge)</label>
                  <input 
                    type="text" 
                    value={productForm.badge} 
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })} 
                    placeholder="HOT / MỚI / CAO CẤP"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>URL Hình ảnh (Image Link) *</label>
                <input 
                  type="text" 
                  value={productForm.image} 
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} 
                  required 
                />
              </div>

              <div className="admin-form-group">
                <label>Mô tả ngắn sản phẩm</label>
                <textarea 
                  rows="2" 
                  value={productForm.description} 
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Mô tả đặc điểm nổi bật..."
                ></textarea>
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
                    {editingProduct ? "Cập Nhật Sản Phẩm" : "Lưu Vào MongoDB"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL THÊM / SỬA DỰ ÁN */}
      {showProjectModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            <div className="modal-header">
              <h3>{editingProject ? "✏️ Chỉnh Sửa Dự Án Tiêu Biểu" : "➕ Thêm Dự Án Tiêu Biểu Mới"}</h3>
              <button style={{ background: "none", border: "none", color: "white", cursor: "pointer" }} onClick={() => setShowProjectModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleProjectSubmit}>
              <div className="admin-form-group">
                <label>Tên dự án *</label>
                <input 
                  type="text" 
                  value={projectForm.title} 
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} 
                  required 
                  placeholder="Ví dụ: Cổng Tự Động Villa Ocean Villas"
                />
              </div>

              <div className="admin-form-grid-2">
                <div className="admin-form-group">
                  <label>Hạng mục / Loại dự án</label>
                  <input 
                    type="text" 
                    value={projectForm.category} 
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })} 
                    placeholder="Cửa Trượt Tự Động / Cổng Âm Sàn..."
                  />
                </div>

                <div className="admin-form-group">
                  <label>Địa điểm công trình</label>
                  <input 
                    type="text" 
                    value={projectForm.location} 
                    onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })} 
                    placeholder="Đà Nẵng / Quảng Nam..."
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>URL Hình ảnh dự án *</label>
                <input 
                  type="text" 
                  value={projectForm.image} 
                  onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })} 
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Mô tả dự án</label>
                <textarea 
                  rows="3" 
                  value={projectForm.description} 
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="Nội dung thi công..."
                ></textarea>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowProjectModal(false)}>Hủy</button>
                <button type="submit" className="btn-save">
                  {editingProject ? "Cập Nhật Dự Án" : "Lưu Dự Án"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL THÊM / SỬA TIN TỨC */}
      {showNewsModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            <div className="modal-header">
              <h3>{editingNews ? "✏️ Chỉnh Sửa Bài Viết Tin Tức" : "➕ Thêm Bài Viết Tin Tức Mới"}</h3>
              <button style={{ background: "none", border: "none", color: "white", cursor: "pointer" }} onClick={() => setShowNewsModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleNewsSubmit}>
              <div className="admin-form-group">
                <label>Tiêu đề bài viết *</label>
                <input 
                  type="text" 
                  value={newsForm.title} 
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    setNewsForm((prev) => ({
                      ...prev,
                      title: newTitle,
                      slug: !editingNews ? slugify(newTitle) : prev.slug
                    }));
                  }} 
                  required 
                  placeholder="Ví dụ: Xu Hướng Lắp Đặt Cửa Cuốn Cao Cấp 2026"
                />
              </div>

              <div className="admin-form-group">
                <label>Đường dẫn tĩnh SEO (Slug không dấu)</label>
                <input 
                  type="text" 
                  value={newsForm.slug} 
                  onChange={(e) => setNewsForm({ ...newsForm, slug: e.target.value })} 
                  placeholder="ví dụ: cua-khe-thoang-giai-phap-lay-sang"
                />
              </div>

              <div className="admin-form-grid-2">
                <div className="admin-form-group">
                  <label>Ngày đăng</label>
                  <input 
                    type="text" 
                    value={newsForm.date} 
                    onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })} 
                  />
                </div>
                <div className="admin-form-group">
                  <label>Tác giả</label>
                  <input 
                    type="text" 
                    value={newsForm.author} 
                    onChange={(e) => setNewsForm({ ...newsForm, author: e.target.value })} 
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>URL Hình ảnh đại diện *</label>
                <input 
                  type="text" 
                  value={newsForm.image} 
                  onChange={(e) => setNewsForm({ ...newsForm, image: e.target.value })} 
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Tóm tắt ngắn</label>
                <textarea 
                  rows="2" 
                  value={newsForm.summary} 
                  onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })}
                  placeholder="Tóm tắt ngắn gọn bài viết..."
                ></textarea>
              </div>

              <div className="admin-form-group">
                <label>Nội dung chi tiết</label>
                <textarea 
                  rows="4" 
                  value={newsForm.content} 
                  onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                  placeholder="Nội dung bài viết..."
                ></textarea>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowNewsModal(false)}>Hủy</button>
                <button type="submit" className="btn-save">
                  {editingNews ? "Cập Nhật Bài Viết" : "Lưu Bài Viết"}
                </button>
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
    </div>
  );
}
