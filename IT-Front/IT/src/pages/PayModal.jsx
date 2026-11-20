import React, { useState, useEffect } from "react";
import { ArrowRight, Check, X } from "lucide-react";
import "../pages/PayModal.css";

const API_URL = "http://localhost:4000";
const TOKEN_KEY = "studentToken";

// Navbar'ga token o'zgargani haqida xabar beradi
const notifyAuth = () => window.dispatchEvent(new Event("auth-change"));

const normalizePhone = (value) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 9) return `+998${digits}`;
  if (digits.length === 12 && digits.startsWith("998")) return `+${digits}`;
  return null;
};

const post = async (path, body, token) => {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(body),
  });

  return { ok: res.ok, status: res.status, json: await res.json() };
};

const Result = ({ ok, title, text, button, onClick }) => (
  <div className="pay-result">
    <span className={`pay-icon ${ok ? "pay-icon-ok" : "pay-icon-err"}`}>
      {ok ? <Check size={22} /> : <X size={22} />}
    </span>
    <h2 className="pay-title">{title}</h2>
    <p className="pay-text">{text}</p>
    <button className="pay-btn" type="button" onClick={onClick}>
      {button}
    </button>
  </div>
);


const PayModal = ({ courseId, onClose }) => {
  const [step, setStep] = useState(localStorage.getItem(TOKEN_KEY) ? "paying" : "phone");
  const [form, setForm] = useState({ phone: "", firstName: "", lastName: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const change = (key) => (e) => setForm({ ...form, [key]: e.target.value });


  const pay = async (token) => {
    const { ok, status, json } = await post("/payments", { course_id: courseId }, token);

    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY); // token eskirgan: qaytadan kirish kerak
      notifyAuth();
      return setStep("phone");
    }

    setMessage(ok ? "" : json.error || "Xatolik yuz berdi");
    setStep(ok ? "success" : "error");

    if (ok) notifyAuth(); // to'lovdan keyin ham navbar yangilansin
  };


  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    pay(token).catch(() => {
      setMessage("Serverga ulanib bo'lmadi");
      setStep("error");
    });
  }, []);

  
  const authAndPay = async (body) => {
    setLoading(true);
    setMessage("");

    try {
      const { ok, json } = await post("/students/quick-auth", body);

      if (!ok) return setMessage(json.error || "Xatolik yuz berdi");
      if (json.needs_name) return setStep("name");

      localStorage.setItem(TOKEN_KEY, json.token);
      notifyAuth(); // ro'yxatdan o'tgan zahoti navbar student ikonkasini ko'rsatadi
      await pay(json.token);
    } catch {
      setMessage("Serverga ulanib bo'lmadi");
    } finally {
      setLoading(false);
    }
  };

  const submitPhone = (e) => {
    e.preventDefault();
    const phone = normalizePhone(form.phone);

    if (phone) authAndPay({ phone });
    else setMessage("Telefon raqamni to'g'ri kiriting");
  };

  const submitName = (e) => {
    e.preventDefault();
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();

    if (!firstName || !lastName) return setMessage("Ism va familiyangizni kiriting");

    authAndPay({ phone: normalizePhone(form.phone), full_name: `${firstName} ${lastName}` });
  };

  if (step === "paying") return null;

  const error = message && <p className="pay-error">{message}</p>;

  return (
    <div className="pay-overlay" onClick={onClose}>
      <div className="pay-modal" onClick={(e) => e.stopPropagation()}>
        {step === "phone" && (
          <form onSubmit={submitPhone}>
            <h2 className="pay-title">Ro'yxatdan o'tish / Kirish</h2>
            <p className="pay-text">Telefon raqamingizni kiriting va davom ettiring</p>
            <div className="pay-row">
              <input
                className="pay-input"
                type="tel"
                placeholder="Tel.raqamingiz"
                value={form.phone}
                onChange={change("phone")}
                autoFocus
              />
              <button className="pay-arrow" type="submit" disabled={loading} aria-label="Davom etish">
                <ArrowRight size={20} />
              </button>
            </div>
            {error}
          </form>
        )}

        {step === "name" && (
          <form onSubmit={submitName}>
            <h2 className="pay-title">Shaxsiy ma'lumotlar</h2>
            <p className="pay-text">Ism va familiyangizni kiriting</p>
            <input
              className="pay-input pay-input-full"
              placeholder="Ismingiz"
              value={form.firstName}
              onChange={change("firstName")}
              autoFocus
            />
            <input
              className="pay-input pay-input-full"
              placeholder="Familiyangiz"
              value={form.lastName}
              onChange={change("lastName")}
            />
            {error}
            <button className="pay-btn" type="submit" disabled={loading}>
              Davom etish
            </button>
          </form>
        )}

        {step === "success" && (
          <Result
            ok
            title="Tabriklaymiz"
            text="To'lov amalga oshirildi. Sotib olingan kursni ko'rish uchun shaxsiy kabinetingizga kiring"
            button="Shaxsiy kabinetga kirish"
            onClick={onClose}
          />
        )}

        {step === "error" && (
          <Result title="Diqqat" text={message} button="Yopish" onClick={onClose} />
        )}
      </div>
    </div>
  );
};

export default PayModal;