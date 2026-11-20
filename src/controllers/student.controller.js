import pool from "../config/db.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"
const getAllStudents = async (req, res) => {
  const result = await pool.query(
    "SELECT id, full_name, phone, image, created_at FROM students ORDER BY id DESC"
  );

  res.status(200).json({
    message: "Hamma o'quvchilar ma'lumotlari",
    data: result.rows,
  });
};

const getMe = async (req, res) => {
  const result = await pool.query(
    "SELECT id, full_name, phone, image FROM students WHERE id = $1",
    [req.user.id]
  );

  if (!result.rows[0]) {
    return res.status(401).json({ error: "O'quvchi topilmadi" });
  }

  res.status(200).json({ data: result.rows[0] });
};

const createStudent = async (req, res) => {
  const { full_name, password, image } = req.body;
  const phone = req.body.phone && "+" + String(req.body.phone).replace(/\D/g, "");

  if (!full_name?.trim() || !phone || !password) {
    return res.status(400).json({ error: "F.I.Sh, telefon va parolni kiriting" });
  }

  const exists = await pool.query(
    "SELECT phone FROM students WHERE phone = $1 OR LOWER(TRIM(full_name)) = LOWER(TRIM($2))",
    [phone, full_name]
  );

  if (exists.rows[0]) {
    const samePhone = exists.rows.some((r) => r.phone === phone);
    return res.status(409).json({
      error: samePhone
        ? "Bu telefon raqam allaqachon ro'yxatdan o'tgan"
        : "Bu ismli o'quvchi allaqachon mavjud",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      `INSERT INTO students (full_name, phone, password, image)
       VALUES ($1, $2, $3, $4)
       RETURNING id, full_name, phone, image, created_at`,
      [full_name.trim(), phone, hashedPassword, image]
    );

    res.status(201).json({ message: "Yangi o'quvchi yaratildi", data: result.rows[0] });
  } catch (err) {
    if (err.code !== "23505") throw err;
    res.status(409).json({ error: "Bu telefon raqam allaqachon ro'yxatdan o'tgan" });
  }
};

const loginStudent = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ error: "Telefon va parolni kiriting" });
  }

  const result = await pool.query(
    "SELECT id, full_name, phone, password FROM students WHERE phone = $1",
    [phone]
  );

  const student = result.rows[0];

  if (!student || !(await bcrypt.compare(password, student.password))) {
    return res.status(401).json({ error: "Telefon yoki parol noto'g'ri" });
  }

  const token = jwt.sign(
    { id: student.id, phone: student.phone, role: "student" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.status(200).json({
    message: "Muvaffaqiyatli kirdingiz",
    data: { id: student.id, full_name: student.full_name, phone: student.phone },
    token
  });
};
const quickAuth = async (req, res) => {
  const { phone, full_name } = req.body;

  if (!phone) {
    return res.status(400).json({ error: "Telefon raqamni kiriting" });
  }

  const found = await pool.query(
    "SELECT id, full_name, phone FROM students WHERE phone = $1",
    [phone]
  );

  let student = found.rows[0];
  let isNew = false;

  if (!student) {
    if (!full_name) {
      return res.status(200).json({ needs_name: true });
    }

    const hashedPassword = await bcrypt.hash(crypto.randomBytes(16).toString("hex"), 10);

    try {
      const created = await pool.query(
        `INSERT INTO students (full_name, phone, password)
         VALUES ($1, $2, $3)
         RETURNING id, full_name, phone`,
        [full_name, phone, hashedPassword]
      );

      student = created.rows[0];
      isNew = true;
    } catch (err) {
      // Bir vaqtda ikki so'rov kelsa: student allaqachon yaratilgan, uni olamiz
      if (err.code !== "23505") throw err;

      const again = await pool.query(
        "SELECT id, full_name, phone FROM students WHERE phone = $1",
        [phone]
      );
      student = again.rows[0];
    }
  }

  const token = jwt.sign(
    { id: student.id, phone: student.phone, role: "student" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.status(isNew ? 201 : 200).json({
    message: isNew ? "Ro'yxatdan o'tdingiz" : "Muvaffaqiyatli kirdingiz",
    data: student,
    token,
    isNew,
  });
};

export default {
  getAllStudents,
  getMe,
  createStudent,
  loginStudent,
  quickAuth,
};