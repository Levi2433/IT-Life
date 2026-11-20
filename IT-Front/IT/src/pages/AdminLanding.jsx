import { useEffect, useState } from "react";
import "./AdminLanding.css";

const CARDS = [
  { key: "admins", label: "Jami Administratorlar" },
  { key: "teachers", label: "Jami Mentorlar" },
  { key: "students", label: "Jami O'quvchilar" },
  { key: "courses", label: "Jami Kurslar" },
];

const AdminLanding = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetch("http://localhost:4000/admin/stats", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.ok && res.json())
      .then((json) => json && setStats(json.data))
      .catch(() => {});
  }, []);

  return (
    <section className="al">
      <h2 className="al-title">Asosiy</h2>
      <p className="al-sub">
        Boshqaruv paneli <span className="al-dot" />
      </p>

      <div className="al-cards">
        {CARDS.map(({ key, label }) => (
          <div className="al-card" key={key}>
            <strong>{stats[key] ?? "-"}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminLanding;