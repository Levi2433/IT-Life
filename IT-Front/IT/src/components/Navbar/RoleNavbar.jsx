import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Settings, ChevronDown, CircleCheck } from "lucide-react";
import "./RoleNavbar.css";

const API = "http://localhost:4000";

const ROLES = {
  admin: { title: "Admin", label: "Administrator", me: "/admin/me" },
  teacher: { title: "O'qituvchi", label: "O'qituvchi", me: "/teacher/me" },
  student: { title: "O'quvchi", label: "O'quvchi", me: "/student/me" },
};

const getRole = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1])).role;
  } catch {
    return null;
  }
};

const RoleNavbar = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const token = localStorage.getItem("token");
  const role = ROLES[getRole(token)];
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("admin") || "null"));
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.clear();
    navigate("/admin-login", { replace: true });
  };

  useEffect(() => {
    if (!role) return logout();
    fetch(API + role.me, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.status === 401 || res.status === 403 ? logout() : res.ok && res.json()))
      .then((json) => json && setUser(json.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <header className="rnav">
      <div className="rnav-left">
        <CircleCheck size={18} />
        <span className="rnav-title">{role?.title}</span>
      </div>

      <div className="rnav-right">
        <button className="rnav-btn" type="button">
          <Bell size={16} />
          <span className="rnav-badge">2</span>
        </button>
        <button className="rnav-btn" type="button">
          <Settings size={16} />
        </button>

        <div className="rnav-lang">
          <select defaultValue="uz">
            <option value="uz">O'zbek tili</option>
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
          <ChevronDown size={14} className="rnav-lang-icon" />
        </div>

        <div className="rnav-profile-wrap" ref={ref}>
          <button className="rnav-profile" type="button" onClick={() => setOpen(!open)}>
            {user?.image ? (
              <img className="rnav-avatar" src={user.image} alt="" />
            ) : (
              <span className="rnav-avatar rnav-avatar-initial">
                {user?.full_name?.[0]?.toUpperCase() || "?"}
              </span>
            )}
            <span className="rnav-profile-text">
              <span className="rnav-name">{user?.full_name}</span>
              <span className="rnav-role">{role?.label}</span>
            </span>
            <ChevronDown size={14} className="rnav-chevron" />
          </button>

          {open && (
            <div className="rnav-menu">
              <button type="button" onClick={logout}>Chiqish</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default RoleNavbar;