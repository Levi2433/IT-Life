import React, { useState, useEffect } from "react";
import { Star, Heart } from "lucide-react";
import "../pages/Cards.css";
import "../index.css";
import { useNavigate } from "react-router-dom";
const API_URL = "http://localhost:4000";

const filters = [
  { id: 0, name: "Barcha kurslar", category: null },
  { id: 1, name: "Dizayn", category: "Dizayn" },
  { id: 2, name: "Frontend", category: "Frontend" },
  { id: 3, name: "Backend", category: "Backend" },
  { id: 4, name: "Mobil", category: "Mobil" },
  { id: 5, name: "Full Stack", category: "Full Stack" },
  { id: 6, name: "Sun'iy intellekt", category: "Sun'iy intellekt" },
  { id: 7, name: "Boshqalar", category: "Boshqalar" },
];

const Stars = ({ rating }) => {
  const value = Number(rating) || 0;
 
  return (
    
    <div className="course-stars">
      {[1, 2, 3, 4, 5].map((n) => {
        let fill = 0;
        if (value >= n) fill = 100;
        else if (value >= n - 0.5) fill = 50;

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

const Cards = () => {
   const navigate = useNavigate();
  const [activeId, setActiveId] = useState(0);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState([]);

  useEffect(() => {
    let ignore = false;
    const active = filters.find((f) => f.id === activeId);
    const query = active.category
      ? `?category=${encodeURIComponent(active.category)}`
      : "";

    setLoading(true);
    setError("");

    fetch(`${API_URL}/courses${query}`)
      .then((res) => res.json())
      .then((json) => {
        if (ignore) return;
        if (json.error) {
          setError(json.error);
          setCourses([]);
        } else {
          setCourses(json.data);
        }
        setLoading(false);
      })
      .catch(() => {
        if (ignore) return;
        setError("Serverga ulanib bo'lmadi");
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [activeId]);

  const toggleLike = (id) => {
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <>
      <section className="card" id="kurslar">
        <div className="container">
          <h1 className="card-title">Ommabop kurslar</h1>
          <h3 className="cart-subtitle">
            Kasbga yo'nalitirilgan praktikumlar yordamida eng tez va samarali
            yo'llar bilan mutaxassislar qatoriga qo'shiling. Har bir praktikum
            soha mutaxassislari tomonidan eng zamoaviy o'quv reja asosida
            tayyorlangan
          </h3>

          <div className="course-filters">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                className={
                  activeId === f.id
                    ? "course-filter course-filter-active"
                    : "course-filter"
                }
                onClick={() => setActiveId(f.id)}
              >
                {f.name}
              </button>
            ))}
          </div>

          <div className="card-inner">
            {loading && <p className="course-message">Yuklanmoqda...</p>}

            {!loading && error && (
              <p className="course-message course-message-error">{error}</p>
            )}

            {!loading && !error && courses.length === 0 && (
              <p className="course-message">Bu bo'limda hozircha kurs yo'q</p>
            )}

            {!loading &&
              !error &&
              courses.map((course) => (
                <article
                  className="course-card"
                  key={course.id}
                  onClick={() => navigate(`/course-detail/${course.id}`)}
                >
                  <div className="course-image-wrap">
                    <img
                      className="course-image"
                      src={course.image}
                      alt={course.title}
                    />
                    {course.tag_text && (
                      <span
                        className="course-tag"
                        style={{ background: course.tag_color }}
                      >
                        {course.tag_text}
                      </span>
                    )}
                  </div>

                  <div className="course-body">
                    <div className="course-top">
                      <div className="course-instructor">
                        {course.instructor_image && (
                          <img
                            className="course-instructor-img"
                            src={course.instructor_image}
                            alt={course.instructor_name}
                          />
                        )}
                        <span>{course.instructor_name}</span>
                      </div>

                      <button
                        type="button"
                        className={
                          liked.includes(course.id)
                            ? "course-heart course-heart-active"
                            : "course-heart"
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(course.id);
                        }}
                      >
                        <Heart size={18} />
                      </button>
                    </div>

                    <h3 className="course-name">{course.title}</h3>
                    <p className="course-desc">{course.description}</p>

                    <Stars rating={course.rating} />

                    <p className="course-price-label">Kurs narxi:</p>
                    <p className="course-price">
                      {Number(course.price).toLocaleString("ru-RU")}
                      <span> UZS</span>
                    </p>
                  </div>
                </article>
              ))}
          </div>

          <div className="course-more">
            <button onClick={() => navigate("/all-courses")} type="button" className="course-more-btn">
              Barcha kurslarni ko'rish
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cards;