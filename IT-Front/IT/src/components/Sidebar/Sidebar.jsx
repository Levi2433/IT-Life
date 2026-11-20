import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutGrid, Users, BookOpen, CreditCard, MessageSquare, ChevronDown, PanelLeftClose } from "lucide-react";
import logo from "../../assets/Logo.svg";
import "./Sidebar.css";

const B = "/admin-landing";
const ALL = ["admin", "teacher", "student"];
const AT = ["admin", "teacher"];

const MENU = [
  { label: "Asosiy", icon: LayoutGrid, to: B, end: true, roles: ALL },
  {
    label: "Foydalanuvchilar",
    icon: Users,
    roles: ["admin"],
    children: [
      { label: "Administratorlar", to: `${B}/administrators`, roles: ["admin"] },
      { label: "Mentorlar", to: `${B}/teachers`, roles: ["admin"] },
      { label: "O'quvchilar", to: `${B}/students`, roles: ["admin"] },
    ],
  },
  {
    label: "Kurslar",
    icon: BookOpen,
    roles: ALL,
    children: [
      { label: "Barcha kurslar", to: `${B}/courses`, roles: ALL },
      { label: "Kategoriyalar", to: `${B}/categories`, roles: ["admin"] },
      { label: "Darslar", to: `${B}/lessons`, roles: AT },
      { label: "Vazifalar", to: `${B}/tasks`, roles: AT },
      { label: "Testlar", to: `${B}/tests`, roles: AT },
      { label: "Savol-javoblar", to: `${B}/questions`, roles: ALL },
      { label: "Uyga vazifalar", to: `${B}/homeworks`, roles: ALL },
    ],
  },
  { label: "To'lovlar", icon: CreditCard, to: `${B}/payments`, roles: ["admin"] },
  { label: "Izohlar", icon: MessageSquare, to: `${B}/comments`, roles: AT },
];

const PANELS = {
  admin: "BOSHQARUV PANELI",
  teacher: "USTOZ PANELI",
  student: "O'QUVCHI PANELI",
};

const getRole = () => {
  try {
    return JSON.parse(atob(localStorage.getItem("token").split(".")[1])).role;
  } catch {
    return null;
  }
};

const Sidebar = () => {
  const { pathname } = useLocation();
  const role = getRole();
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(
    () => MENU.find((m) => m.children?.some((c) => pathname.startsWith(c.to)))?.label
  );

  const items = MENU.filter((m) => m.roles.includes(role)).map((m) =>
    m.children ? { ...m, children: m.children.filter((c) => c.roles.includes(role)) } : m
  );

  const toggle = (label) => {
    setCollapsed(false);
    setOpen(open === label ? null : label);
  };

  return (
    <aside className={collapsed ? "rsb rsb-collapsed" : "rsb"}>
      <div className="rsb-top">
        <img className="rsb-logo" src={logo} alt="IT Live" />
        <button type="button" className="rsb-collapse" onClick={() => setCollapsed(!collapsed)}>
          <PanelLeftClose size={16} />
        </button>
      </div>

      <div className="rsb-panel">{PANELS[role]}</div>

      <nav className="rsb-nav">
        {items.map(({ label, icon: Icon, to, end, children }) =>
          !children ? (
            <NavLink
              key={label}
              to={to}
              end={end}
              title={label}
              className={({ isActive }) => (isActive ? "rsb-item rsb-active" : "rsb-item")}
            >
              <Icon size={16} />
              <span className="rsb-text">{label}</span>
            </NavLink>
          ) : (
            <div key={label}>
              <button
                type="button"
                title={label}
                className={open === label ? "rsb-item rsb-open" : "rsb-item"}
                onClick={() => toggle(label)}
              >
                <Icon size={16} />
                <span className="rsb-text">{label}</span>
                <ChevronDown size={14} className="rsb-arrow" />
              </button>

              <div className={open === label && !collapsed ? "rsb-sub rsb-sub-open" : "rsb-sub"}>
                <div className="rsb-sub-inner">
                  {children.map((c) => (
                    <NavLink
                      key={c.to}
                      to={c.to}
                      className={({ isActive }) => (isActive ? "rsb-subitem rsb-active" : "rsb-subitem")}
                    >
                      {c.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          )
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;