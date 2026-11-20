import pool from "../config/db.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const getAllUser = async (req, res) => {
  const result = await pool.query("SELECT * FROM users");
  console.log(result);

  res.status(200).json({
    message: "Hamma foydalanuvchilar malumotlari",
    data: result.rows.filter((user) => {
      if (user.password) {
        delete user.password;
      }
      return user;
    }),
  });
};

const createUser = async (req, res) => {
  const { username, phone, password } = req.body;
  console.log(username, phone, password)
  const hashedPassword = await bcrypt.hash(password, 15)

  const result = await pool.query(
    `INSERT INTO users (username, phone, password)
     VALUES ($1, $2, $3)
     RETURNING id, username, phone`,
    [username, phone, hashedPassword]
  );

  const newUser = result.rows[0];

  const token = jwt.sign(
    { id: newUser.id, phone: newUser.phone, role: "user" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.status(201).json({
    message: "Yangi foydalanuvchi yaratildi",
    data: newUser,
    token
  });
};

const loginUser = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ error: "Telefon va parolni kiriting" });
  }

  const result = await pool.query(
    "SELECT id, username, phone, password FROM users WHERE phone = $1",
    [phone]
  );

  const user = result.rows[0];

  if (!user) {
    return res.status(401).json({ error: "Telefon yoki parol noto'g'ri" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ error: "Telefon yoki parol noto'g'ri" });
  }

  const token = jwt.sign(
    { id: user.id, phone: user.phone, role: "user" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.status(200).json({
    message: "Muvaffaqiyatli kirdingiz",
    data: { id: user.id, username: user.username, phone: user.phone },
    token
  });
};


const getMe = async (req, res) => {
  const result = await pool.query(
    "SELECT id, username, phone, image FROM users WHERE id = $1",
    [req.user.id]
  );

  if (!result.rows[0]) {
    return res.status(401).json({ error: "Foydalanuvchi topilmadi" });
  }

  res.status(200).json({
    message: "Profil ma'lumotlari",
    data: result.rows[0],
  });
};

export default {
  getAllUser,
  createUser,
  loginUser,
  getMe,
};