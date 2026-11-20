import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logoImage from "../assets/Logo.svg";
import Img from "../assets/Img.jpg";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("+998");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/[^\d+]/g, "");
    if (!value.startsWith("+998")) value = "+998";
    setPhone(value.slice(0, 13));
  };

  const validate = () => {
    const newErrors = {};

    if (!/^\+998\d{9}$/.test(phone)) {
      newErrors.phone = "Telefon raqam +998XXXXXXXXX ko'rinishida bo'lsin";
    }

    if (password.length < 6) {
      newErrors.password = "Parol kamida 6 ta belgidan iborat bo'lishi kerak";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ password: data.error || "Kirishda xatolik yuz berdi" });
        return;
      }

      window.localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      setErrors({ password: "Serverga ulanib bo'lmadi, keyinroq urinib ko'ring" });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <img className="auth-logo" src={logoImage} alt="IT Live" />

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <h1 className="auth-title">Kirish</h1>

          <div className="auth-field">
            <label htmlFor="phone">Telefon</label>
            <input
              id="phone"
              type="tel"
              placeholder="+998"
              value={phone}
              onChange={handlePhoneChange}
              className={errors.phone ? "auth-input auth-input-error" : "auth-input"}
            />
            {errors.phone && <span className="auth-error">{errors.phone}</span>}
          </div>

          <div className="auth-field">
            <label htmlFor="password">Parol</label>
            <div className="auth-password-wrap">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? "auth-input auth-input-error" : "auth-input"}
              />
              <button
                type="button"
                className="auth-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className="auth-error">{errors.password}</span>}
          </div>

          <a href="#" className="auth-forgot">
            Parolni unutdingizmi?
          </a>

          <button type="submit" className="auth-submit">
            Kirish
          </button>

          <p className="auth-bottom-text">
            Men hali ro'yxatdan o'tmadim! <Link to="/registration">Ro'yxatdan o'tish</Link>
          </p>
        </form>

        <p className="auth-copy">© IT Live Academy</p>
      </div>

      <div className="auth-right">
        <img src={Img} alt="rasim" />
      </div>
    </div>
  );
};

export default Login;