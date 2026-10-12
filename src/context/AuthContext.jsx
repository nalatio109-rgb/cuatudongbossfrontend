import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("boss_auth_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // Helper to persist auth
  const setAuthData = (user) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem("boss_auth_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("boss_auth_user");
    }
  };

  // Local fallback registry helper
  const getLocalUsers = () => {
    try {
      const users = localStorage.getItem("boss_local_users");
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  };

  const saveLocalUser = (user) => {
    const users = getLocalUsers();
    users.push(user);
    localStorage.setItem("boss_local_users", JSON.stringify(users));
  };

  // 1. LOGIN FUNCTION
  const login = async (email, password) => {
    setLoading(true);
    const cleanEmail = email.toLowerCase().trim();

    try {
      // First attempt backend API
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setAuthData(data.data);
        setLoading(false);
        return { success: true, user: data.data };
      } else if (res.status === 400 || res.status === 401) {
        // Known auth failure from API
        setLoading(false);
        return { success: false, message: data.message || "Email hoặc mật khẩu không chính xác" };
      }
    } catch (err) {
      console.warn("Backend auth API unreachable, using local auth provider:", err.message);
    }

    // Fallback: If backend is not yet restarted or unreachable
    // Check built-in admin account: admin@boss.vn / admin123
    if (cleanEmail === "admin@boss.vn") {
      if (password === "admin123") {
        const adminUser = {
          id: "admin_root_id",
          fullName: "Quản Trị Viên BOSS",
          email: "admin@boss.vn",
          phone: "0904678323",
          role: "admin",
          token: "local_admin_token_" + Date.now()
        };
        setAuthData(adminUser);
        setLoading(false);
        return { success: true, user: adminUser };
      } else {
        setLoading(false);
        return { success: false, message: "Mật khẩu quản trị viên không chính xác!" };
      }
    }

    // Check locally registered accounts
    const localUsers = getLocalUsers();
    const found = localUsers.find(u => u.email === cleanEmail);
    if (found) {
      if (found.password === password) {
        const userObj = {
          id: found.id,
          fullName: found.fullName,
          email: found.email,
          phone: found.phone,
          role: found.role || "user",
          token: "local_user_token_" + Date.now()
        };
        setAuthData(userObj);
        setLoading(false);
        return { success: true, user: userObj };
      } else {
        setLoading(false);
        return { success: false, message: "Mật khẩu không chính xác!" };
      }
    }

    setLoading(false);
    return { success: false, message: "Tài khoản email không tồn tại trong hệ thống!" };
  };

  // 2. REGISTER FUNCTION
  const register = async (fullName, email, password, phone = "") => {
    setLoading(true);
    const cleanEmail = email.toLowerCase().trim();

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email: cleanEmail, password, phone })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setAuthData(data.data);
        setLoading(false);
        return { success: true, user: data.data };
      } else if (res.status === 400) {
        setLoading(false);
        return { success: false, message: data.message || "Email này đã được sử dụng" };
      }
    } catch (err) {
      console.warn("Backend register API unreachable, using local fallback:", err.message);
    }

    // Fallback: local registration
    const localUsers = getLocalUsers();
    if (cleanEmail === "admin@boss.vn" || localUsers.some(u => u.email === cleanEmail)) {
      setLoading(false);
      return { success: false, message: "Email này đã được đăng ký tài khoản!" };
    }

    // ALL registered accounts are assigned 'user' role
    const newUser = {
      id: "user_" + Date.now(),
      fullName: fullName.trim(),
      email: cleanEmail,
      password: password, // For local test fallback
      phone: phone ? phone.trim() : "",
      role: "user"
    };

    saveLocalUser(newUser);

    const authUser = {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      phone: newUser.phone,
      role: "user",
      token: "local_token_" + Date.now()
    };

    setAuthData(authUser);
    setLoading(false);
    return { success: true, user: authUser };
  };

  // 3. LOGOUT FUNCTION
  const logout = () => {
    setAuthData(null);
  };

  const isAdmin = Boolean(currentUser && currentUser.role === "admin");

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
