import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Clock, User, Signal, Lock, ChevronDown, ChevronUp, Star } from "lucide-react";
import "../pages/Cards.css";
import "../pages/CourseDetail.css";
import "../index.css";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import PayModal from "../pages/PayModal";

const API_URL = "http://localhost:4000";

const meta = [
  { icon: Clock, text: "20 soat 56 daqiqa" },
  { icon: User, text: "255 marta ko'rildi" },
  { icon: Signal, text: "Daraja: Beginner" },
];

const sections = [
  "Introduction",
  "Understanding React Native Fundamentals",
  "Adding Stack and Bottom Tab Navigator to our react native project",
  "Overview of React Hooks",
  "Project",
  "Conclusion",
];

const lessons = [
  "What You'll Get From Taking this Course",
  "An Overview of Web Development and React",
  "Course Repo and Software Installations",
];

const stats = [
  { value: 100, label: "O'quvchilar" },
  { value: 2, label: "Kurslar" },
  { value: 245, label: "Ko'rishlar" },
];

const Stars = ({ rating }) => {
  const value = Number(rating) || 0;

  return (
    <div className="course-stars">
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = value >= n ? 100 : value >= n - 0.5 ? 50 : 0;

        return (
          <span className="course-star" key={n}>
            <Star size={16} className="course-star-bg" />
            <span className="course-star-fill" style={{ width: `${fill}%` }}>
              <Star size={16} className="course-star-on" />
            </span>
          </span>
        );
      })}
      <span className="course-rating">({value})</span>
    </div>
  );
};

const Lessons = () => {
  const [openId, setOpenId] = useState(0);

  return (
    <div className="detail-lessons">
      {sections.map((title, i) => (
        <div className="detail-section" key={title}>
          <button
            type="button"
            className="detail-section-btn"
            onClick={() => setOpenId(openId === i ? null : i)}
          >
            {title}
            {openId === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {openId === i &&
            lessons.map((lesson) => (
              <div className="detail-lesson" key={lesson}>
                <span className="detail-lock">
                  <Lock size={12} />
                </span>
                <span className="detail-lesson-name">{lesson}</span>
                <span className="detail-lesson-time">9m 34s</span>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

const CourseCard = ({ course, onBuy }) => (
  <div className="detail-card">
    <img className="detail-card-img" src={course.image} alt={course.title} />
    <div className="detail-card-body">
      <p className="detail-price">{Number(course.price).toLocaleString("ru-RU")} UZS</p>
      <p className="detail-card-desc">{course.description}</p>
      <Stars rating={course.rating} />
      <button type="button" className="detail-buy" onClick={onBuy}>
        Sotib olish
      </button>
    </div>
  </div>
);

const TeacherCard = ({ course: { teacher, instructor_name } }) => (
  <div className="detail-teacher">
    <div className="detail-teacher-top">
      <div className="detail-avatar">
        {teacher?.image ? <img src={teacher.image} alt={teacher.full_name} /> : <User size={28} />}
      </div>
      <div>
        <h3 className="detail-teacher-name">{teacher?.full_name || instructor_name}</h3>
        {teacher?.profession && <p className="detail-teacher-role">{teacher.profession}</p>}
        <span className="detail-teacher-rating">
          <Star size={12} className="detail-teacher-star" /> 4.8
        </span>
      </div>
    </div>

    <div className="detail-stats">
      {stats.map((s) => (
        <div className="detail-stat" key={s.label}>
          <b>{s.value}</b>
          <span>{s.label}</span>
        </div>
      ))}
    </div>
  </div>
);

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setCourse(null);
    setError("");

    fetch(`${API_URL}/courses/${id}`)
      .then((res) => res.json())
      .then((json) => (json.error ? setError(json.error) : setCourse(json.data)))
      .catch(() => setError("Serverga ulanib bo'lmadi"));
  }, [id]);

  return (
    <>
      <Navbar />

      {error && <p className="detail-message detail-message-error">{error}</p>}
      {!course && !error && <p className="detail-message">Yuklanmoqda...</p>}

      {course && (
        <section className="detail">
          <div className="container">
            <div className="detail-inner">
              <div className="detail-left">
                <div className="detail-head">
                  <h1 className="detail-title">{course.title}</h1>
                  <p className="detail-subtitle">
                    Asosiy tushunchalarning mustahkam poydevoriga ega bo'ling va
                    qiziqarli va foydali ilovalar yarating!
                  </p>
                  <div className="detail-meta">
                    {meta.map(({ icon: Icon, text }) => (
                      <span className="detail-meta-item" key={text}>
                        <Icon size={14} />
                        {text}
                      </span>
                    ))}
                  </div>
                </div>

                <Lessons />
              </div>

              <aside className="detail-right">
                <CourseCard course={course} onBuy={() => setBuying(true)} />
                <TeacherCard course={course} />
              </aside>
            </div>
          </div>
        </section>
      )}

      {buying && <PayModal courseId={course.id} onClose={() => setBuying(false)} />}

      <Footer />
    </>
  );
};

export default CourseDetail;