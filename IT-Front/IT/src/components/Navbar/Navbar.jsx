import "../Navbar/Navbar.css";
import React, { useState, useRef, useEffect } from "react";
import logoImage from "../../assets/Logo.svg";
import { ChevronDown, Moon, Sun, User, UserCircle, LogOut } from "lucide-react";
import { useNavigate, Link, NavLink } from "react-router-dom";

const API_URL = "http://localhost:4000";
const USER_KEY = "token";
const STUDENT_KEY = "studentToken";

// Student tokeni bo'lsa u birinchi o'rinda turadi
const readAuth = () => {
  const studentToken = window.localStorage.getItem(STUDENT_KEY);
  if (studentToken) return { token: studentToken, kind: "student" };

  const userToken = window.localStorage.getItem(USER_KEY);
  if (userToken) return { token: userToken, kind: "user" };

  return { token: "", kind: "" };
};

const Navbar = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(readAuth);
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(Boolean(auth.token));
  const [language, setLanguage] = useState("O'z");
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // PayModal (yoki boshqa tab) tokenni o'zgartirganda navbar yangilanadi
  useEffect(() => {
    const sync = () => setAuth(readAuth());
    window.addEventListener("auth-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("auth-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    if (!auth.token) {
      setUser(null);
      setChecking(false);
      return;
    }

    setChecking(true);

    const url =
      auth.kind === "student" ? `${API_URL}/students/me` : `${API_URL}/users/me`;

    fetch(url, {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
      .then((res) => res.json().then((json) => ({ status: res.status, json })))
      .then(({ status, json }) => {
        if (status === 200) {
          const data = json.data;
          setUser({
            name: data.full_name || data.username || "",
            image: data.image,
          });
        } else if (status === 401 || status === 403) {
          window.localStorage.removeItem(
            auth.kind === "student" ? STUDENT_KEY : USER_KEY,
          );
          setAuth(readAuth());
          setUser(null);
        }
        setChecking(false);
      })
      .catch(() => {
        setChecking(false);
      });
  }, [auth.token, auth.kind]);

  const handleLogout = () => {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.removeItem(STUDENT_KEY);
    setAuth({ token: "", kind: "" });
    setUser(null);
    setMenuOpen(false);
    navigate("/");
  };

  const handleProfile = () => {
    setMenuOpen(false);
    navigate("/profile");
  };

  return (
    <>
      <header className="navbar">
        <div className="container">
          <div className="navbar-inner">
            <div className="navbar-right">
              <Link to="/" className="logo-link">
                <img
                  className="logo"
                  width={120}
                  height={33}
                  src={logoImage}
                  alt="IT Live"
                />
              </Link>

              <ul>
                <li>
                  <NavLink
                    to="/"
                    end
                    className={({ isActive }) => (isActive ? "nav-active" : "")}
                  >
                    Asosiy
                  </NavLink>
                </li>

                <li className="dropdown">
                  <NavLink
                    to="/all-courses"
                    className={({ isActive }) => (isActive ? "nav-active" : "")}
                  >
                    Kurslar
                  </NavLink>

                  <div className="dropdown-menu">
                    <a href="./frontend.html">Frontend</a>
                    <a href="./backend.html">Backend</a>
                    <a href="./python.html">Python</a>
                  </div>
                </li>

                <li>
                  <NavLink
                    to="/about"
                    className={({ isActive }) => (isActive ? "nav-active" : "")}
                  >
                    Biz haqimizda
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/contact"
                    className={({ isActive }) => (isActive ? "nav-active" : "")}
                  >
                    Bog'lanish
                  </NavLink>
                </li>
              </ul>
            </div>
            <div className="navbar-lelft">
              <div className="language">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="O'z">O'z</option>
                  <option value="RU">RU</option>
                  <option value="ENG">ENG</option>
                </select>
              </div>
              <div className="dark-mode">
                <button className="theme-btn" onClick={() => setDark(!dark)}>
                  {dark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
              <div className="login">
                {checking ? null : !user ? (
                  <button
                    className="login-btn"
                    onClick={() => navigate("/registration")}
                  >
                    <User color="white" size={20} />
                    Kirish / Ro'yxatdan o'tish
                  </button>
                ) : (
                  <div className="profile-wrap" ref={profileRef}>
                    <button
                      type="button"
                      className={
                        menuOpen
                          ? "profile-avatar profile-avatar-active"
                          : "profile-avatar"
                      }
                      onClick={() => setMenuOpen(!menuOpen)}
                    >
                      {user.image ? (
                        <img
                          src={user.image}
                          width={46}
                          height={46}
                          alt={user.name}
                        />
                      ) : (
                        <span className="profile-initial">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </button>

                    {menuOpen && (
                      <div className="profile-menu">
                        <button
                          type="button"
                          className="profile-item"
                          onClick={handleProfile}
                        >
                          <UserCircle size={18} />
                          Profil
                        </button>
                        <div className="profile-divider"></div>
                        <button
                          type="button"
                          className="profile-item profile-item-logout"
                          onClick={handleLogout}
                        >
                          <LogOut size={18} />
                          Chiqish
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;