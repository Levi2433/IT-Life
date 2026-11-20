import pool from "../config/db.js";

const COLUMNS = `
  c.id, c.title, c.description, c.image, c.tag_text, c.tag_color,
  c.rating, c.price, c.level, c.sales_count, c.status, c.created_at,
  c.category_id, COALESCE(cat.name, c.category) AS category,
  c.teacher_id,
  COALESCE(t.full_name, c.instructor_name) AS instructor_name,
  COALESCE(t.image, c.instructor_image) AS instructor_image`;

const FROM = `
  FROM courses c
  LEFT JOIN categories cat ON cat.id = c.category_id
  LEFT JOIN teachers t ON t.id = c.teacher_id`;

// Bitta kurs + ustozning to'liq ma'lumoti (CourseDetail uchun)
const findCourse = async (id) => {
  const result = await pool.query(
    `SELECT ${COLUMNS},
       CASE WHEN t.id IS NULL THEN NULL ELSE json_build_object(
         'id', t.id,
         'full_name', t.full_name,
         'image', t.image,
         'profession', t.profession,
         'experience', t.experience,
         'bio', t.bio,
         'website', t.website,
         'facebook', t.facebook,
         'telegram', t.telegram,
         'linkedin', t.linkedin,
         'instagram', t.instagram,
         'github', t.github
       ) END AS teacher
     ${FROM}
     WHERE c.id = $1`,
    [id]
  );
  return result.rows[0];
};

const fkError = (err, res) => {
  if (err.code === "23503") {
    return res.status(400).json({ error: "Kategoriya yoki o'qituvchi topilmadi" });
  }
  throw err;
};

const getAllProducts = async (req, res) => {
  const { category, category_id, status } = req.query;

  const result = await pool.query(
    `SELECT ${COLUMNS} ${FROM}
     WHERE ($1::text IS NULL OR cat.name = $1)
       AND ($2::int IS NULL OR c.category_id = $2)
       AND ($3::text IS NULL OR c.status = $3)
     ORDER BY c.id DESC`,
    [category || null, category_id || null, status || null]
  );

  res.status(200).json({
    message: "Hamma kurslar",
    data: result.rows,
  });
};

const getProductById = async (req, res) => {
  const course = await findCourse(req.params.id);

  if (!course) {
    return res.status(404).json({ error: "Kurs topilmadi" });
  }

  res.status(200).json({
    message: "Kurs ma'lumotlari",
    data: course,
  });
};

const createProduct = async (req, res) => {
  const { title, description, image, tag_text, tag_color, category_id, teacher_id,
          level, rating, price, sales_count, status } = req.body;

  // O'qituvchi faqat o'z nomiga kurs yaratadi, admin esa mentorni tanlaydi
  const mentorId = req.user.role === "teacher" ? req.user.id : teacher_id;

  if (!title || !image || !category_id || !mentorId) {
    return res.status(400).json({
      error: "Majburiy maydonlarni to'ldiring (title, image, category_id, teacher_id)",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO courses (title, description, image, tag_text, tag_color, category_id,
                            teacher_id, level, rating, price, sales_count, status)
       VALUES ($1, $2, $3, $4, COALESCE($5, '#22c55e'), $6, $7,
               COALESCE($8, 'Beginner'), COALESCE($9::numeric, 0), COALESCE($10::numeric, 0),
               COALESCE($11::int, 0), COALESCE($12, 'faol'))
       RETURNING id`,
      [title, description, image, tag_text, tag_color, category_id, mentorId,
       level, rating, price, sales_count, status]
    );

    res.status(201).json({
      message: "Yangi kurs yaratildi",
      data: await findCourse(result.rows[0].id),
    });
  } catch (err) {
    fkError(err, res);
  }
};

const updateProduct = async (req, res) => {
  const { title, description, image, tag_text, tag_color, category_id, teacher_id,
          level, rating, price, sales_count, status } = req.body;

  const isTeacher = req.user.role === "teacher";
  const ownerId = isTeacher ? req.user.id : null;      // o'qituvchi faqat o'z kursini o'zgartiradi
  const newTeacherId = isTeacher ? null : teacher_id;  // mentorni faqat admin almashtiradi

  try {
    const result = await pool.query(
      `UPDATE courses SET
         title       = COALESCE($1, title),
         description = COALESCE($2, description),
         image       = COALESCE($3, image),
         tag_text    = COALESCE($4, tag_text),
         tag_color   = COALESCE($5, tag_color),
         category_id = COALESCE($6, category_id),
         teacher_id  = COALESCE($7, teacher_id),
         level       = COALESCE($8, level),
         rating      = COALESCE($9, rating),
         price       = COALESCE($10, price),
         sales_count = COALESCE($11, sales_count),
         status      = COALESCE($12, status)
       WHERE id = $13 AND ($14::int IS NULL OR teacher_id = $14)
       RETURNING id`,
      [title, description, image, tag_text, tag_color, category_id, newTeacherId,
       level, rating, price, sales_count, status, req.params.id, ownerId]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: "Kurs topilmadi" });
    }

    res.status(200).json({
      message: "Kurs yangilandi",
      data: await findCourse(result.rows[0].id),
    });
  } catch (err) {
    fkError(err, res);
  }
};

const deleteProduct = async (req, res) => {
  const ownerId = req.user.role === "teacher" ? req.user.id : null;

  const result = await pool.query(
    "DELETE FROM courses WHERE id = $1 AND ($2::int IS NULL OR teacher_id = $2) RETURNING id",
    [req.params.id, ownerId]
  );

  if (!result.rows[0]) {
    return res.status(404).json({ error: "Kurs topilmadi" });
  }

  res.status(200).json({
    message: "Kurs o'chirildi",
  });
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};