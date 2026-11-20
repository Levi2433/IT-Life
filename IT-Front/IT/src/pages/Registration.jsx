import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logoImage from "../assets/Logo.svg";
import "./Registration.css";
import Img from "../assets/Img.jpg";

const Registration = () => {
  const navigate = useNavigate();

  const [username, setusername] = useState("");
  const [phone, setPhone] = useState("+998");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/[^\d+]/g, "");
    if (!value.startsWith("+998")) value = "+998";
    setPhone(value.slice(0, 13));
  };

  const validate = () => {
    const newErrors = {};

    if (username.trim().length < 3) {
      newErrors.username = "F.I.Sh ni to'liq kiriting";
    }

    if (!/^\+998\d{9}$/.test(phone)) {
      newErrors.phone = "Telefon raqam +998XXXXXXXXX ko'rinishida bo'lsin";
    }

    if (password.length < 6) {
      newErrors.password = "Parol kamida 6 ta belgidan iborat bo'lishi kerak";
    } else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      newErrors.password =
        "Parol faqat harf yoki faqat raqamdan iborat bo'lmasin";
    }

    if (confirmPassword !== password || confirmPassword === "") {
      newErrors.confirmPassword = "Parollar bir xil emas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    const data = {
        password,
        phone,
        username

    }
    e.preventDefault();
    if (validate()) {
        fetch('http://localhost:4000/users', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(res => {
            if(res.status != 201) {
                console.error('error')
                return
            }
            return res.json()
        }).then(userData => {
            console.log(userData)
            window.localStorage.setItem('token', userData.token)
            navigate('/')
        })
    }
  };

  return (
    <div className="reg-page">
      <div className="reg-left">
        <img className="reg-logo" src={logoImage} alt="IT Live" />

        <form className="reg-form" onSubmit={handleSubmit} noValidate>
          <h1 className="reg-title">Ro'yxatdan o'tish</h1>

          <div className="reg-field">
            <label htmlFor="username">F.I.Sh</label>
            <input
              id="username"
              type="text"
              placeholder="Kiriting"
              value={username}
              onChange={(e) => setusername(e.target.value)}
              className={
                errors.username ? "reg-input reg-input-error" : "reg-input"
              }
            />
            {errors.username && (
              <span className="reg-error">{errors.username}</span>
            )}
          </div>

          <div className="reg-field">
            <label htmlFor="phone">Telefon</label>
            <input
              id="phone"
              type="tel"
              placeholder="+998"
              value={phone}
              onChange={handlePhoneChange}
              className={
                errors.phone ? "reg-input reg-input-error" : "reg-input"
              }
            />
            {errors.phone && <span className="reg-error">{errors.phone}</span>}
          </div>

          <div className="reg-field">
            <label htmlFor="password">Parol</label>
            <div className="reg-password-wrap">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={
                  errors.password ? "reg-input reg-input-error" : "reg-input"
                }
              />
              <button
                type="button"
                className="reg-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <span className="reg-error">{errors.password}</span>
            )}
          </div>

          <div className="reg-field">
            <label htmlFor="confirmPassword">Parolni takrorlang</label>
            <div className="reg-password-wrap">
              <input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={
                  errors.confirmPassword
                    ? "reg-input reg-input-error"
                    : "reg-input"
                }
              />
              <button
                type="button"
                className="reg-eye"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="reg-error">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="reg-submit">
            Ro'yxatdan o'tish
          </button>

          <p className="reg-login-text">
            Men ro'yxatdan o'tganman! <a href="/login">Kirish</a>
          </p>
        </form>

        <p className="reg-copy">© IT Live Academy</p>
      </div>

      <div className="reg-right">
        <img src={Img} alt="rasim" />
      </div>
    </div>
  );
};

export default Registration;