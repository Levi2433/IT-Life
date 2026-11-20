
import React, { useState, useEffect, useRef } from "react";
import {
  FaTelegramPlane,
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaGithub
} from "react-icons/fa";

import "../pages/MentorPic.css";
import "../index.css";

const API_URL = "http://localhost:4000";
const STEP = 421;

const MentorPic = () => {
  const [teachers, setTeachers] = useState([]);
  const trackRef = useRef(null);

  useEffect(() => {
    fetch(`${API_URL}/teachers`)
      .then((res) => res.json())
      .then((json) => setTeachers(json.data || []))
      .catch(() => setTeachers([]));
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const el = trackRef.current;

      if (!el) return;

      const end =
        el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;

      el.scrollTo({
        left: end ? 0 : el.scrollLeft + STEP,
        behavior: "smooth"
      });

    }, 3000);

    return () => clearInterval(id);
  }, []);

  return (
    <>
      <div className="container">
        <div className="titles">
          <h1 className="titles-title">Tajribali Mentorlar</h1>
        </div>

        <h3 className="titles-subtitle">
          Barcha kurslarimiz tajribali mentorlar tomonidan tayyorlangan
        </h3>
      </div>

      <div className="img-cards">
        <div className="img-track" ref={trackRef}>
          {teachers.map((t, i) => (
            <article className="img-card" key={t.id}>
              {t.image ? (
                <img
                  className="img-card-photo"
                  src={t.image}
                  alt={t.full_name}
                />
              ) : (
                <div className={
                  i % 2
                    ? "img-card-empty img-red"
                    : "img-card-empty img-blue"
                }>
                  <span className="img-card-letter">
                    {t.full_name.charAt(0).toUpperCase()}
                  </span>

                  <span className="img-card-fullname">
                    {t.full_name}
                  </span>
                </div>
              )}

              <div className="img-card-info">
                <h3 className="img-card-name">{t.full_name}</h3>
                <p className="img-card-role">Mentor</p>

                <div className="img-card-icons">
                  <FaTelegramPlane size={14} />
                  <FaInstagram size={14} />
                  <FaFacebookF size={14} />
                  <FaLinkedinIn size={14} />
                  <FaGithub size={14} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
};

export default MentorPic;
