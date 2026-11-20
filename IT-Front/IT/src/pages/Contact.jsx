import React from 'react'
import { Phone, Mail, MapPin, ChevronDown } from 'lucide-react'
import "../index.css"
import "../pages/Contact.css"
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'

const Contact = () => {
  return (
    <>
      <Navbar />
      <section className="contact">
        <div className="container">
          <span className="contact__label">Bog'lanish</span>
          <h1 className="contact__title">Savollaringiz bo'lsa murojaat qiling</h1>

          <div className="contact__cards">
            <div className="contact__card">
              <div className="contact__icon"><Phone size={16} /></div>
              <h3>Telefon</h3>
              <p>+99899 999 99 99</p>
            </div>

            <div className="contact__card">
              <div className="contact__icon"><Mail size={16} /></div>
              <h3>Elektron pochta</h3>
              <p>info@itlive.uz</p>
            </div>

            <div className="contact__card">
              <div className="contact__icon"><MapPin size={16} /></div>
              <h3>Manzil</h3>
              <p>Manzil shu yerda kiritiladi</p>
            </div>
          </div>

          <div className="contact__form-box">
            <span className="contact__label">Bog'lanish</span>
            <h2 className="contact__form-title">Savollaringiz bo'lsa murojaat qiling</h2>

            <form className="contact__form">
              <label>
                F.I.SH
                <input type="text" placeholder="Kiriting" />
              </label>

              <label>
                Telefon raqamingiz
                <div className="contact__phone">
                  <span className="contact__country">
                    UZ <ChevronDown size={14} />
                  </span>
                  <input type="tel" placeholder="+998" />
                </div>
              </label>

              <label>
                Xabar
                <textarea rows="4"></textarea>
              </label>

              <button type="submit">Yuborish</button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}

export default Contact