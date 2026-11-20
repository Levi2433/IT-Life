import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import "../index.css"
import "../pages/Teacher.css"
import Login from "../assets/Hero.png"
import logoImage from "../assets/Logo.svg"

const StudentLogin = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ phone: "+998", password: "" })
  const [show, setShow] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!/^\+998\d{9}$/.test(form.phone)) return setError("Telefon +998XXXXXXXXX ko'rinishida bo'lsin")
    if (form.password.length < 6) return setError("Parol kamida 6 ta belgidan iborat bo'lsin")

    try {
      const res = await fetch("http://localhost:4000/students/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) return setError(data.error || "Xatolik yuz berdi")

      localStorage.setItem("token", data.token)
      navigate("/")
    } catch {
      setError("Serverga ulanib bo'lmadi")
    }
  }

  return (
    <>
      <section className='teacher'>
        <div className='teacher-inner'>
          <div className='teacher-inner-left'>
            <img src={Login} alt="" />
          </div>

          <div className='teacher-inner-right'>
            <Link to="/" className='teacher-logo'>
              <img src={logoImage} alt="IT Live" width={90} />
            </Link>

            <form className='teacher-form' onSubmit={handleSubmit}>
              <h1 className='teacher-title'>Kirish</h1>

              <label className='teacher-label'>Telefon raqamingiz</label>
              <input className='teacher-input' name="phone" maxLength={13}
                value={form.phone} onChange={handleChange} />

              <label className='teacher-label'>Parol</label>
              <div className='teacher-password'>
                <input className='teacher-input' name="password" placeholder="********"
                  type={show ? "text" : "password"}
                  value={form.password} onChange={handleChange} />
                <button type="button" className='teacher-eye' onClick={() => setShow(!show)}>
                  {show ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>

              <a href="#" className='teacher-forgot'>Parolni unutdingizmi?</a>

              {error && <p className='teacher-error'>{error}</p>}

              <button className='teacher-btn' type="submit">Kirish</button>

              <p className='teacher-text'>
                Menda hisob mavjud emas! 
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default StudentLogin