import pool from "../config/db.js";

const frontend = [
  "Frontend", "HTML", "CSS", "JavaScript", "TypeScript", "React.js", "React",
  "Next.js", "Vue.js", "Angular", "Tailwind CSS", "Sass", "Redux",
];

const backend = [
  "Backend", "Node.js", "Node", "Express", "Express.js", "NestJS", "PHP",
  "Laravel", "Python", "Django", "Flask", "FastAPI", "Java", "Spring", "C#",
  ".NET", "Go", "Ruby", "Rails", "SQL", "PostgreSQL", "MySQL", "MongoDB",
  "REST API", "GraphQL",
];

const allowedByCategory = {
  Dizayn: [
    "Dizayn", "Figma", "Photoshop", "Illustrator", "UI/UX", "Graphic Design",
    "Web Design", "Adobe XD", "Canva", "Motion Design",
  ],
  Frontend: frontend,
  Backend: backend,
  Mobil: [
    "Mobil", "Android", "iOS", "Kotlin", "Swift", "Flutter", "Dart", "React Native",
  ],
  "Full Stack": ["Full Stack", "MERN", "MEAN", ...frontend, ...backend],
  "Sun'iy intellekt": [
    "Sun'iy intellekt", "AI", "Machine Learning", "Deep Learning", "Python",
    "TensorFlow", "PyTorch", "NLP", "Data Science",
  ],
};

const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const STATUSES = ["faol", "nofaol"];

const isId = (v) => Number.isInteger(Number(v)) && Number(v) > 0;
const has = (v) => v !== undefined && v !== null;

// Yangi ustunlar uchun oddiy tekshiruv (noto'g'ri qiymat bazada 500 xato bermasligi uchun)
const checkFields = ({ category_id, teacher_id, level, status, rating, price, sales_count }) => {
  if (has(category_id) && !isId(category_id)) return "category_id noto'g'ri";
  if (has(teacher_id) && !isId(teacher_id)) return "teacher_id noto'g'ri";
  if (has(level) && !LEVELS.includes(level)) return `level faqat shulardan bo'lishi kerak: ${LEVELS.join(", ")}`;
  if (has(status) && !STATUSES.includes(status)) return `status faqat shulardan bo'lishi kerak: ${STATUSES.join(", ")}`;
  if (has(rating) && !(Number(rating) >= 0 && Number(rating) <= 5)) return "rating 0 dan 5 gacha bo'lishi kerak";
  if (has(price) && !(Number(price) >= 0)) return "price noto'g'ri";
  if (has(sales_count) && !(Number.isInteger(Number(sales_count)) && Number(sales_count) >= 0)) return "sales_count noto'g'ri";
  return null;
};

const checkText = (value, category) => {
  const allowed = allowedByCategory[category].map((a) => a.toLowerCase());
  const parts = String(value).split(",").map((p) => p.trim().toLowerCase());
  return parts.every((p) => p && allowed.includes(p));
};

const check = async (req, res, next, isUpdate) => {
  try {
    const { title, tag_text, category_id } = req.body;

    const fieldError = checkFields(req.body);
    if (fieldError) return res.status(400).json({ error: fieldError });

    if (!category_id) {
      if (!isUpdate) return next();
      if (!title && !tag_text) return next();
      return res.status(400).json({
        error: "title yoki tag_text o'zgartirilsa, category_id ham yuborilishi kerak",
      });
    }

    // category_id bo'yicha kategoriya nomini bazadan olamiz
    const found = await pool.query("SELECT name FROM categories WHERE id = $1", [category_id]);
    if (!found.rows[0]) {
      return res.status(400).json({ error: "Bunday kategoriya topilmadi" });
    }
    const category = found.rows[0].name;

    if (!allowedByCategory[category]) return next();

    const list = allowedByCategory[category].join(", ");

    if (title !== undefined && !checkText(title, category)) {
      return res.status(400).json({
        error: `${category} uchun title faqat shulardan bo'lishi kerak: ${list}`,
      });
    }

    if (tag_text !== undefined && tag_text !== null && !checkText(tag_text, category)) {
      return res.status(400).json({
        error: `${category} uchun tag_text faqat shulardan bo'lishi kerak: ${list}`,
      });
    }

    next();
  } catch (err) {
    next(err);
  }
};

export const validateCreateCourse = (req, res, next) => check(req, res, next, false);
export const validateUpdateCourse = (req, res, next) => check(req, res, next, true);