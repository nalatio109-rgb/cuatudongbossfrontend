import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Lock, Mail, User, Phone, Eye, EyeOff, 
  ArrowRight, ArrowLeft, CheckCircle2, AlertCircle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function Auth() {
  const { currentUser, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If redirected with ?tab=register, default to register tab
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get("tab") === "register" ? "register" : "login";
  const redirectTarget = searchParams.get("redirect") || "";

  const [activeTab, setActiveTab] = useState(initialTab);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPass, setShowRegPass] = useState(false);

  // Status & error states
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Toggle auth-mode on body to remove padding-top and sync dark background
  useEffect(() => {
    document.body.classList.add("auth-mode");
    return () => {
      document.body.classList.remove("auth-mode");
    };
  }, []);

  // If already logged in, redirect appropriately
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === "admin") {
        navigate(redirectTarget || "/admin", { replace: true });
      } else {
        navigate(redirectTarget || "/", { replace: true });
      }
    }
  }, [currentUser, navigate, redirectTarget]);

  // Always ensure login and register inputs are completely blank on mount / tab switch
  useEffect(() => {
    setLoginEmail("");
    setLoginPassword("");
    setRegName("");
    setRegEmail("");
    setRegPhone("");
    setRegPassword("");
    setRegConfirmPassword("");
  }, [activeTab]);


  // Handle Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setSubmitting(true);

    try {
      const result = await login(loginEmail, loginPassword);

      if (result.success) {
        setSuccessMessage("Đăng nhập thành công! Đang chuyển hướng...");
        setTimeout(() => {
          if (result.user.role === "admin") {
            navigate("/admin", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        }, 500);
      } else {
        setErrorMessage(result.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!");
      }
    } catch (err) {
      setErrorMessage("Đã xảy ra lỗi khi đăng nhập: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Register
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (regPassword !== regConfirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage("Mật khẩu phải có tối thiểu 6 ký tự!");
      return;
    }

    setSubmitting(true);

    try {
      const result = await register(regName, regEmail, regPassword, regPhone);

      if (result.success) {
        setSuccessMessage("Đăng ký thành công! Đang chuyển hướng về Trang Chủ...");
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 600);
      } else {
        setErrorMessage(result.message || "Đăng ký không thành công!");
      }
    } catch (err) {
      setErrorMessage("Đã xảy ra lỗi khi đăng ký: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* Aurora Mesh Gradient Animated Background */}
      <div className="aurora-canvas">
        <div className="aurora-orb orb-emerald"></div>
        <div className="aurora-orb orb-gold"></div>
        <div className="aurora-orb orb-mint"></div>
        <div className="aurora-orb orb-cyan"></div>
        <div className="aurora-grid"></div>
      </div>

      <div className="auth-container">
        {/* Top bar with back button */}
        <div className="auth-top-nav">
          <Link to="/" className="auth-back-link">
            <ArrowLeft size={16} /> Quay về Trang Chủ
          </Link>
        </div>

        <div className="auth-card">
          {/* Header */}
          <div className="auth-card-header">
            <Link to="/" className="auth-logo-link">
              <img src="/logo.png" alt="BOSS" className="auth-logo-img" />
            </Link>
            <h2>CỔNG XÁC THỰC BOSS ĐÀ NẴNG</h2>
            <p>Hệ thống tài khoản thành viên & quản trị viên BOSS</p>
          </div>

          {/* Tab Selector */}
          <div className="auth-tab-switch">
            <button 
              type="button"
              className={`auth-tab-btn ${activeTab === "login" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("login");
                setErrorMessage("");
              }}
            >
              Đăng Nhập
            </button>
            <button 
              type="button"
              className={`auth-tab-btn ${activeTab === "register" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("register");
                setErrorMessage("");
              }}
            >
              Đăng Ký Tài Khoản
            </button>
          </div>

          {/* Notifications */}
          {errorMessage && (
            <div className="auth-alert error">
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="auth-alert success">
              <CheckCircle2 size={18} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ================= TAB 1: LOGIN ================= */}
          {activeTab === "login" && (
            <form onSubmit={handleLoginSubmit} className="auth-form" autoComplete="off">
              {/* Fake hidden inputs to trick browser password managers from autofilling */}
              <input type="text" name="prevent_autofill_user" style={{ display: "none" }} aria-hidden="true" tabIndex="-1" autoComplete="off" />
              <input type="password" name="prevent_autofill_pwd" style={{ display: "none" }} aria-hidden="true" tabIndex="-1" autoComplete="new-password" />

              <div className="auth-input-group">
                <label>Email đăng nhập</label>
                <div className="auth-input-box">
                  <Mail size={18} className="input-icon" />
                  <input 
                    type="email" 
                    name="boss_login_account"
                    placeholder="Nhập email của bạn..."
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    autoComplete="off"
                    required
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label>Mật khẩu</label>
                <div className="auth-input-box">
                  <Lock size={18} className="input-icon" />
                  <input 
                    type={showLoginPass ? "text" : "password"} 
                    name="boss_login_key"
                    placeholder="Nhập mật khẩu..."
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button 
                    type="button" 
                    className="toggle-pass-btn"
                    onClick={() => setShowLoginPass(!showLoginPass)}
                  >
                    {showLoginPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={submitting}>
                {submitting ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP NGAY"}
                {!submitting && <ArrowRight size={18} />}
              </button>
            </form>
          )}

          {/* ================= TAB 2: REGISTER ================= */}
          {activeTab === "register" && (
            <form onSubmit={handleRegisterSubmit} className="auth-form" autoComplete="off">
              {/* Fake hidden inputs to trick browser password managers from autofilling */}
              <input type="text" name="prevent_autofill_user_reg" style={{ display: "none" }} aria-hidden="true" tabIndex="-1" autoComplete="off" />
              <input type="password" name="prevent_autofill_pwd_reg" style={{ display: "none" }} aria-hidden="true" tabIndex="-1" autoComplete="new-password" />

              <div className="auth-input-group">
                <label>Họ và tên *</label>
                <div className="auth-input-box">
                  <User size={18} className="input-icon" />
                  <input 
                    type="text" 
                    name="boss_reg_name"
                    placeholder="Ví dụ: Nguyễn Văn A"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    autoComplete="off"
                    required
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label>Địa chỉ Email *</label>
                <div className="auth-input-box">
                  <Mail size={18} className="input-icon" />
                  <input 
                    type="email" 
                    name="boss_reg_email"
                    placeholder="Nhập địa chỉ email..."
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    autoComplete="off"
                    required
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label>Số điện thoại liên hệ</label>
                <div className="auth-input-box">
                  <Phone size={18} className="input-icon" />
                  <input 
                    type="tel" 
                    name="boss_reg_phone"
                    placeholder="0904.xxx.xxx"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label>Mật khẩu (Tối thiểu 6 ký tự) *</label>
                <div className="auth-input-box">
                  <Lock size={18} className="input-icon" />
                  <input 
                    type={showRegPass ? "text" : "password"} 
                    name="boss_reg_pwd"
                    placeholder="Tạo mật khẩu an toàn..."
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button 
                    type="button" 
                    className="toggle-pass-btn"
                    onClick={() => setShowRegPass(!showRegPass)}
                  >
                    {showRegPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="auth-input-group">
                <label>Xác nhận lại mật khẩu *</label>
                <div className="auth-input-box">
                  <Lock size={18} className="input-icon" />
                  <input 
                    type={showRegPass ? "text" : "password"} 
                    name="boss_reg_pwd_confirm"
                    placeholder="Nhập lại mật khẩu vừa tạo..."
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={submitting}>
                {submitting ? "ĐANG TẠO TÀI KHOẢN..." : "ĐĂNG KÝ TÀI KHOẢN"}
                {!submitting && <ArrowRight size={18} />}
              </button>
            </form>
          )}

          {/* Footer of card */}
          <div className="auth-card-footer">
            <span>Bảo mật hệ thống bởi <strong>Latio & BOSS Đà Nẵng</strong></span>
          </div>
        </div>

        {/* Ambient bottom features */}
        <div className="auth-bottom-features">
          <div className="feature-item">⭐ Cửa Cuốn Đức & Cửa Tự Động</div>
          <span className="feature-item-dot">•</span>
          <div className="feature-item">Thi Công Biệt Thự Cao Cấp</div>
          <span className="feature-item-dot">•</span>
          <div className="feature-item">Hotline 24/7: 0905.123.456</div>
        </div>
      </div>
    </div>
  );
}
