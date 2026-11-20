import pool from "../config/db.js";

const createPayment = async (req, res) => {
  const { course_id, payment_method } = req.body;
  const studentId = req.user.id; // o'quvchi id si tokendan olinadi

  if (!Number.isInteger(Number(course_id)) || Number(course_id) < 1) {
    return res.status(400).json({ error: "course_id ni to'g'ri yuboring" });
  }

  const course = await pool.query(
    "SELECT id, price, status FROM courses WHERE id = $1",
    [course_id]
  );

  if (!course.rows[0]) {
    return res.status(404).json({ error: "Kurs topilmadi" });
  }

  if (course.rows[0].status !== "faol") {
    return res.status(400).json({ error: "Bu kurs hozir sotuvda emas" });
  }

  const already = await pool.query(
    "SELECT id FROM payments WHERE student_id = $1 AND course_id = $2 AND status = 'muvaffaqiyatli'",
    [studentId, course_id]
  );

  if (already.rows[0]) {
    return res.status(409).json({ error: "Siz bu kursni allaqachon sotib olgansiz" });
  }

  try {
    
    const result = await pool.query(
      `WITH paid AS (
         INSERT INTO payments (student_id, course_id, amount, status, payment_method, paid_at)
         VALUES ($1, $2, $3, 'muvaffaqiyatli', $4, NOW())
         RETURNING id, student_id, course_id, amount, status, payment_method, paid_at, created_at
       ),
       upd AS (
         UPDATE courses SET sales_count = sales_count + 1 WHERE id = $2
       )
       SELECT paid.*, c.title AS course_title
       FROM paid
       JOIN courses c ON c.id = paid.course_id`,
      [studentId, course_id, course.rows[0].price, payment_method]
    );

    res.status(201).json({
      message: "Tabriklaymiz! To'lov amalga oshirildi",
      data: result.rows[0],
    });
  } catch (err) {
    
    if (err.code === "23505") {
      return res.status(409).json({ error: "Siz bu kursni allaqachon sotib olgansiz" });
    }
    throw err;
  }
};
const getAllPayments = async (req, res) => {
  const { student_id, course_id } = req.query;

  const result = await pool.query(
    `SELECT p.id, p.student_id, s.full_name AS student_name, s.phone AS student_phone,
            p.course_id, c.title AS course_title, p.amount, p.status,
            p.payment_method, p.paid_at, p.created_at
     FROM payments p
     JOIN students s ON s.id = p.student_id
     JOIN courses c ON c.id = p.course_id
     WHERE ($1::int IS NULL OR p.student_id = $1)
       AND ($2::int IS NULL OR p.course_id = $2)
     ORDER BY p.id DESC`,
    [student_id || null, course_id || null]
  );

  res.status(200).json({
    message: "Hamma to'lovlar",
    data: result.rows,
  });
};
const getMyPayments = async (req, res) => {
  const result = await pool.query(
    `SELECT p.id, p.course_id, c.title, c.image, p.amount, p.status, p.payment_method,
            p.paid_at, p.created_at
     FROM payments p
     JOIN courses c ON c.id = p.course_id
     WHERE p.student_id = $1 AND p.status = 'muvaffaqiyatli'
     ORDER BY p.id DESC`,
    [req.user.id]
  );

  res.status(200).json({
    message: "Sotib olingan kurslar",
    data: result.rows,
  });
};

export default {
  createPayment,
  getMyPayments,
  getAllPayments,
};