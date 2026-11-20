import pool from "../config/db.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const loginAdmin = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ error: "Telefon va parolni kiriting" });
  }

  const result = await pool.query(
    "SELECT id, full_name, phone, password, status FROM admins WHERE phone = $1",
    [phone]
  );

  const admin = result.rows[0];

  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return res.status(401).json({ error: "Telefon yoki parol noto'g'ri" });
  }

  if (admin.status !== "faol") {
    return res.status(403).json({ error: "Hisobingiz faol emas" });
  }

  const token = jwt.sign(
    { id: admin.id, phone: admin.phone, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.status(200).json({
    message: "Muvaffaqiyatli kirdingiz",
    data: { id: admin.id, full_name: admin.full_name, phone: admin.phone },
    token
  });
};
const getStats = async (req, res) => {
  const result = await pool.query(
    `SELECT
       (SELECT COUNT(*) FROM admins)::int   AS admins,
       (SELECT COUNT(*) FROM teachers)::int AS teachers,
       (SELECT COUNT(*) FROM students)::int AS students,
       (SELECT COUNT(*) FROM courses)::int  AS courses`
  );

  res.status(200).json({
    message: "Umumiy statistika",
    data: result.rows[0],
  });
};

const getMe = async (req, res) => {
  const result = await pool.query(
    "SELECT id, full_name, phone, image, role FROM admins WHERE id = $1",
    [req.user.id]
  );

  if (!result.rows[0]) {
    return res.status(401).json({ error: "Admin topilmadi" });
  }

  res.status(200).json({ data: result.rows[0] });
};

const createAdmin = async (req, res) => {
  const { full_name, phone, password, image } = req.body;

  if (!full_name || !phone || !password) {
    return res.status(400).json({ error: "F.I.Sh, telefon va parolni kiriting" });
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const result = await pool.query(
    `INSERT INTO admins (full_name, phone, password, image)
     VALUES ($1, $2, $3, $4)
     RETURNING id, full_name, phone, image, role, status, created_at`,
    [full_name, phone, hashedPassword, image]
  );

  res.status(201).json({
    message: "Yangi admin yaratildi",
    data: result.rows[0],
  });
};



const createTeacher = async (req, res) => {
  const { full_name, phone, password, image, experience, profession, website, bio,
          facebook, telegram, linkedin, instagram, github } = req.body;

  if (!full_name || !phone || !password) {
    return res.status(400).json({ error: "F.I.Sh, telefon va parolni kiriting" });
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const result = await pool.query(
    `INSERT INTO teachers (full_name, phone, password, image, experience, profession, website, bio,
                           facebook, telegram, linkedin, instagram, github)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
     RETURNING id, full_name, phone, image, experience, profession, website, bio,
               facebook, telegram, linkedin, instagram, github, status, created_at`,
    [full_name, phone, hashedPassword, image, experience, profession, website, bio,
     facebook, telegram, linkedin, instagram, github]
  );

  res.status(201).json({
    message: "Yangi o'qituvchi yaratildi",
    data: result.rows[0],
  });
};

const updateTeacher = async (req, res) => {
  const { full_name, phone, password, image, experience, profession, website, bio,
          facebook, telegram, linkedin, instagram, github, status } = req.body;

  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

  const result = await pool.query(
    `UPDATE teachers SET
       full_name  = COALESCE($1, full_name),
       phone      = COALESCE($2, phone),
       password   = COALESCE($3, password),
       image      = COALESCE($4, image),
       experience = COALESCE($5, experience),
       profession = COALESCE($6, profession),
       website    = COALESCE($7, website),
       bio        = COALESCE($8, bio),
       facebook   = COALESCE($9, facebook),
       telegram   = COALESCE($10, telegram),
       linkedin   = COALESCE($11, linkedin),
       instagram  = COALESCE($12, instagram),
       github     = COALESCE($13, github),
       status     = COALESCE($14, status)
     WHERE id = $15
     RETURNING id, full_name, phone, image, experience, profession, website, bio,
               facebook, telegram, linkedin, instagram, github, status, created_at`,
    [full_name, phone, hashedPassword, image, experience, profession, website, bio,
     facebook, telegram, linkedin, instagram, github, status, req.params.id]
  );

  if (!result.rows[0]) {
    return res.status(404).json({ error: "O'qituvchi topilmadi" });
  }

  res.status(200).json({
    message: "O'qituvchi yangilandi",
    data: result.rows[0],
  });
};

const deleteTeacher = async (req, res) => {
  const result = await pool.query(
    "DELETE FROM teachers WHERE id = $1 RETURNING id",
    [req.params.id]
  );

  if (!result.rows[0]) {
    return res.status(404).json({ error: "O'qituvchi topilmadi" });
  }

  res.status(200).json({ message: "O'qituvchi o'chirildi" });
};
const getAllAdmins = async (req, res) => {
  const result = await pool.query(
    "SELECT id, full_name, phone, image, role, status, created_at FROM admins ORDER BY id DESC"
  );

  res.status(200).json({
    message: "Hamma adminlar",
    data: result.rows,
  });
};

export default {
  loginAdmin,
  getMe,
  createAdmin,
  createTeacher,
  getAllAdmins,
  getStats,
  updateTeacher,
  deleteTeacher,
};