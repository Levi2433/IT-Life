import pool from "../config/db.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const getAllTeachers = async (req, res) => {
  const result = await pool.query(
    `SELECT id, full_name, phone, image, experience, profession, website, bio,
            facebook, telegram, linkedin, instagram, github, status, created_at
     FROM teachers ORDER BY id DESC`
  );

  res.status(200).json({
    message: "Hamma o'qituvchilar ma'lumotlari",
    data: result.rows,
  });
};

const loginTeacher = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ error: "Telefon va parolni kiriting" });
  }

  const result = await pool.query(
    "SELECT id, full_name, phone, password, status FROM teachers WHERE phone = $1",
    [phone]
  );

  const teacher = result.rows[0];

  if (!teacher) {
    return res.status(401).json({ error: "Telefon yoki parol noto'g'ri" });
  }

  const isMatch = await bcrypt.compare(password, teacher.password);

  if (!isMatch) {
    return res.status(401).json({ error: "Telefon yoki parol noto'g'ri" });
  }

  if (teacher.status !== "faol") {
    return res.status(403).json({ error: "Hisobingiz faol emas" });
  }

  const token = jwt.sign(
    { id: teacher.id, phone: teacher.phone, role: "teacher" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.status(200).json({
    message: "Muvaffaqiyatli kirdingiz",
    data: { id: teacher.id, full_name: teacher.full_name, phone: teacher.phone },
    token
  });
};

export default {
  getAllTeachers,
  loginTeacher,
};