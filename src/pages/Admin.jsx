import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Users, Package, FolderKanban, CheckCircle, Trash2, Plus, Edit,
  RefreshCw, X, Shield, Phone, ArrowLeft, LayoutDashboard, Database,
  Newspaper, Search, Eye, Tag, FileText, Check
} from "lucide-react";
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
  const [activeTab, setActiveTab] = useState("contacts");
  
  // Data states
  const [contacts, setContacts] = useState([]);
  const [products, setProducts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Search states
  const [productSearch, setProductSearch] = useState("");
  const [projectSearch, setProjectSearch] = useState("");
  const [newsSearch, setNewsSearch] = useState("");
  const [contactSearch, setContactSearch] = useState("");

  // Modals state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = add, object = edit

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [showNewsModal, setShowNewsModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);

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

  const [productForm, setProductForm] = useState(initialProductState);
  const [projectForm, setProjectForm] = useState(initialProjectState);
  const [newsForm, setNewsForm] = useState(initialNewsState);

  // Notification Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Fetch all data from MongoDB Backend
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resC, resP, resPr, resN] = await Promise.all([
        fetch("https://cuatudongbossbackend-production.up.railway.app/api/contacts"),
        fetch("https://cuatudongbossbackend-production.up.railway.app/api/products"),
        fetch("https://cuatudongbossbackend-production.up.railway.app/api/projects"),
        fetch("https://cuatudongbossbackend-production.up.railway.app/api/news")
      ]);

      const dataC = await resC.json();
      const dataP = await resP.json();
      const dataPr = await resPr.json();
      const dataN = await resN.json();

      if (dataC.success) setContacts(dataC.data);
      if (dataP.success) setProducts(dataP.data);
      if (dataPr.success) setProjects(dataPr.data);
      if (dataN.success) setNews(dataN.data);
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
      const res = await fetch(`https://cuatudongbossbackend-production.up.railway.app/api/contacts/${id}`, {
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
      const res = await fetch(`https://cuatudongbossbackend-production.up.railway.app/api/contacts/${id}`, { method: "DELETE" });
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
        res = await fetch(`https://cuatudongbossbackend-production.up.railway.app/api/products/${editingProduct._id}`, {
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
        res = await fetch("https://cuatudongbossbackend-production.up.railway.app/api/products", {
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
      const res = await fetch(`https://cuatudongbossbackend-production.up.railway.app/api/products/${id}`, { method: "DELETE" });
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
        res = await fetch(`https://cuatudongbossbackend-production.up.railway.app/api/projects/${editingProject._id}`, {
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
        res = await fetch("https://cuatudongbossbackend-production.up.railway.app/api/projects", {
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
      const res = await fetch(`https://cuatudongbossbackend-production.up.railway.app/api/projects/${id}`, { method: "DELETE" });
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
      let res, data;
      if (editingNews) {
        res = await fetch(`https://cuatudongbossbackend-production.up.railway.app/api/news/${editingNews._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newsForm)
        });
        data = await res.json();
        if (data.success) {
          setNews(news.map(n => n._id === editingNews._id ? data.data : n));
          showToast("✨ Đã cập nhật bài viết thành công!");
        }
      } else {
        res = await fetch("https://cuatudongbossbackend-production.up.railway.app/api/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newsForm)
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
      const res = await fetch(`https://cuatudongbossbackend-production.up.railway.app/api/news/${id}`, { method: "DELETE" });
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

  const filteredContacts = contacts.filter(c => 
    c.fullName?.toLowerCase().includes(contactSearch.toLowerCase()) ||
    c.phone?.includes(contactSearch) ||
    c.productCategory?.toLowerCase().includes(contactSearch.toLowerCase())
  );

  const pendingContactsCount = contacts.filter(c => c.status === "pending").length;

  return (
    <div className="admin-standalone-wrapper">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div style={{
          position: "fixed",
          top: 24,
          right: 24,
          background: "#1e293b",
          color: "#f8fafc",
          padding: "12px 20px",
          borderRadius: 12,
          border: "1px solid rgba(16,185,129,0.4)",
          boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
          zIndex: 10000,
          fontWeight: 600,
          fontSize: "0.9rem",
          display: "flex",
          alignItems: "center",
          gap: 10,
          animation: "adminFadeInUp 0.3s ease-out"
        }}>
          {toastMessage}
        </div>
      )}

      {/* 1. SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <div className="logo-badge">B</div>
          <div>
            <h2>BOSS ADMIN</h2>
            <span>MONGODB CONTROL</span>
          </div>
        </div>

        <div className="admin-nav-list">
          <button 
            className={`admin-nav-item ${activeTab === "contacts" ? "active" : ""}`}
            onClick={() => setActiveTab("contacts")}
          >
            <Phone size={18} /> Yêu Cầu Báo Giá
            {pendingContactsCount > 0 && <span className="nav-badge-count">{pendingContactsCount}</span>}
          </button>

          <button 
            className={`admin-nav-item ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            <Package size={18} /> Quản Lý Sản Phẩm
          </button>

          <button 
            className={`admin-nav-item ${activeTab === "projects" ? "active" : ""}`}
            onClick={() => setActiveTab("projects")}
          >
            <FolderKanban size={18} /> Quản Lý Dự Án
          </button>

          <button 
            className={`admin-nav-item ${activeTab === "news" ? "active" : ""}`}
            onClick={() => setActiveTab("news")}
          >
            <Newspaper size={18} /> Quản Lý Tin Tức
          </button>
        </div>

        <div className="sidebar-footer">
          <Link to="/" className="btn-back-to-site">
            <ArrowLeft size={18} /> Quay về Trang Chủ
          </Link>
        </div>
      </aside>

      {/* 2. MAIN VIEWPORT */}
      <main className="admin-main-viewport">
        {/* TOPBAR */}
        <header className="admin-topbar">
          <div className="topbar-status">
            <span className="status-dot"></span> MongoDB Atlas Connected
          </div>

          <div className="topbar-user">
            <button className="btn-add-new" onClick={fetchData} disabled={loading} style={{ padding: "6px 14px", fontSize: "0.85rem" }}>
              <RefreshCw size={14} className={loading ? "spin" : ""} /> {loading ? "Đang nạp..." : "Làm mới dữ liệu"}
            </button>
            <div className="user-avatar">A</div>
          </div>
        </header>

        {/* CONTENT BODY */}
        <div className="admin-content-body">
          {/* STATS CARDS */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="stat-icon green">
                <Phone size={24} />
              </div>
              <div className="stat-info">
                <h4>Báo Giá Mới Chờ Xử Lý</h4>
                <p>{pendingContactsCount} <span style={{ fontSize: "0.85rem", color: "#f59e0b" }}>({contacts.length} tổng)</span></p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-icon">
                <Package size={24} />
              </div>
              <div className="stat-info">
                <h4>Sản Phẩm Trong Database</h4>
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
                <h4>Bài Viết & Tin Tức</h4>
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
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Thời gian</th>
                    <th>Khách hàng</th>
                    <th>Số điện thoại</th>
                    <th>Sản phẩm tư vấn</th>
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
                        <td><span className="admin-badge-category">{item.productCategory}</span></td>
                        <td style={{ maxWidth: 220, color: "#94a3b8" }}>{item.message || "Không có nội dung"}</td>
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
            </div>
          )}

          {/* TAB 2: PRODUCTS (FULL THÊM - SỬA - XÓA) */}
          {activeTab === "products" && (
            <div className="admin-table-container">
              <div className="table-action-header">
                <h2>DANH MỤC SẢN PHẨM TRONG MONGODB ({products.length})</h2>
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
              <table className="admin-table">
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
                            className="btn-action-icon edit"
                            onClick={() => handleOpenEditProduct(p)}
                            title="Sửa sản phẩm"
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
            </div>
          )}

          {/* TAB 3: PROJECTS (FULL THÊM - SỬA - XÓA) */}
          {activeTab === "projects" && (
            <div className="admin-table-container">
              <div className="table-action-header">
                <h2>DỰ ÁN TIÊU BIỂU TRONG MONGODB ({projects.length})</h2>
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
                <h2>BÀI VIẾT & TIN TỨC TRONG MONGODB ({news.length})</h2>
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
                        <td style={{ fontWeight: 600 }}>{n.title}</td>
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

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
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

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
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

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowProductModal(false)}>Hủy</button>
                <button type="submit" className="btn-save">
                  {editingProduct ? "Cập Nhật Sản Phẩm" : "Lưu Vào MongoDB"}
                </button>
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

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
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
                  onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} 
                  required 
                  placeholder="Ví dụ: Xu Hướng Lắp Đặt Cửa Cuốn Cao Cấp 2026"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
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
    </div>
  );
}
