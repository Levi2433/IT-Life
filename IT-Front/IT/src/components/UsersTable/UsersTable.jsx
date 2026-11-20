import { useEffect, useState } from "react";
import { Search, CirclePlus, Pencil, Trash2, FileSpreadsheet, ChevronsUpDown, ChevronDown } from "lucide-react";
import "./UsersTable.css";

const API = "http://localhost:4000";

const COLS = [
  ["id", "ID"],
  ["full_name", "F.I.Sh"],
  ["phone", "Telefon raqam"],
  ["created_at", "Yaratilgan vaqt"],
  ["role", "Rol"],
  ["status", "Holati"],
];

const pageList = (page, total) => {
  const nums = [...new Set([1, page - 1, page, page + 1, total])]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);
  const out = [];
  nums.forEach((n, i) => {
    if (i && n - nums[i - 1] > 1) out.push("...");
    out.push(n);
  });
  return out;
};

const UsersTable = ({ title, url, role, remove }) => {
  const [rows, setRows] = useState([]);
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sort, setSort] = useState({ key: "id", dir: "desc" });
  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

  useEffect(() => {
    setInput("");
    setQuery("");
    setPage(1);
    fetch(API + url, { headers })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => setRows(json?.data || []))
      .catch(() => setRows([]));
  }, [url]);

  const sorted = rows
    .filter((r) => `${r.full_name} ${r.phone}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      const x = a[sort.key] ?? "";
      const y = b[sort.key] ?? "";
      return (x > y ? 1 : x < y ? -1 : 0) * (sort.dir === "asc" ? 1 : -1);
    });

  const total = Math.max(1, Math.ceil(sorted.length / perPage));
  const start = (page - 1) * perPage;
  const visible = sorted.slice(start, start + perPage);

  const search = () => {
    setQuery(input);
    setPage(1);
  };

  const toggleSort = (key) =>
    setSort({ key, dir: sort.key === key && sort.dir === "asc" ? "desc" : "asc" });

  const del = async (id) => {
    if (!remove || !confirm("O'chirishni tasdiqlaysizmi?")) return;
    const res = await fetch(`${API}${remove}/${id}`, { method: "DELETE", headers });
    if (res.ok) setRows(rows.filter((r) => r.id !== id));
  };

  const exportXls = () => {
    const body = sorted
      .map((r) => `<tr><td>${r.id}</td><td>${r.full_name}</td><td>${r.phone}</td><td>${r.created_at}</td></tr>`)
      .join("");
    const blob = new Blob([`<meta charset="utf-8"><table>${body}</table>`], {
      type: "application/vnd.ms-excel",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${title}.xls`;
    a.click();
  };

  const bar = (
    <div className="ut-bar">
      <div className="ut-info">
        <span>{`Sahifada ${start}-${start + visible.length} gacha. Umumiy ${sorted.length}ta`}</span>
        <button type="button" className="ut-xls" onClick={exportXls}>
          <FileSpreadsheet size={14} color="#16a34a" />
          ({sorted.length}) Yuklab olish .XLS
        </button>
      </div>

      <div className="ut-pager">
        <label className="ut-per">
          Bir sahifada:
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(+e.target.value);
              setPage(1);
            }}
          >
            {[10, 20, 50].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
          <ChevronDown size={12} />
        </label>

        {pageList(page, total).map((n, i) =>
          n === "..." ? (
            <span key={i} className="ut-dots">...</span>
          ) : (
            <button key={i} className={n === page ? "ut-page ut-page-active" : "ut-page"} onClick={() => setPage(n)}>
              {n}
            </button>
          )
        )}

        <button className="ut-page ut-next" disabled={page === total} onClick={() => setPage(page + 1)}>
          Keyingi
        </button>
      </div>
    </div>
  );

  return (
    <section className="ut">
      <div className="ut-head">
        <div>
          <h2>{title}</h2>
          <p className="ut-crumb">
            Foydalanuvchilar <i /> {title}
          </p>
        </div>
        <button className="ut-add" type="button">
          <CirclePlus size={16} /> Qo'shish
        </button>
      </div>

      {bar}

      <div className="ut-search">
        <div className="ut-input">
          <Search size={15} />
          <input
            placeholder="Izlash..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
          />
          <Search size={15} />
        </div>
        <button type="button" onClick={search}>Izlash</button>
      </div>

      <div className="ut-wrap">
        <table className="ut-table">
          <thead>
            <tr>
              {COLS.map(([key, label]) => (
                <th key={key} onClick={() => toggleSort(key)}>
                  <span>
                    {label}
                    <ChevronsUpDown size={11} />
                  </span>
                </th>
              ))}
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>
                  <div className="ut-user">
                    {r.image ? <img src={r.image} alt="" /> : <span>{r.full_name?.[0]?.toUpperCase()}</span>}
                    {r.full_name}
                  </div>
                </td>
                <td>{r.phone}</td>
                <td>{r.created_at?.replace("T", " ").slice(0, 16)}</td>
                <td>{role}</td>
                <td>
                  {r.status ? (
                    <b className={r.status === "faol" ? "ut-badge" : "ut-badge ut-off"}>{r.status}</b>
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  <div className="ut-actions">
                    <button type="button"><Pencil size={13} /></button>
                    <button type="button" onClick={() => del(r.id)}><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {!visible.length && (
              <tr>
                <td colSpan={7} className="ut-empty">Ma'lumot topilmadi</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {bar}
    </section>
  );
};

export default UsersTable;