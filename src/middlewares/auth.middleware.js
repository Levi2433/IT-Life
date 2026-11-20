import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const tables = {
  admin: "admins",
  teacher: "teachers",
  student: "students",
  user: "users",
};


const hasStatus = ["admin", "teacher"];

const verify = (...roles) => async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Token yuborilmagan" });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ error: "Token noto'g'ri yoki muddati tugagan" });
  }

  if (!roles.includes(payload.role)) {
    return res.status(403).json({ error: "Bu amal uchun ruxsatingiz yo'q" });
  }

  const sql =
    `SELECT id FROM ${tables[payload.role]} WHERE id = $1` +
    (hasStatus.includes(payload.role) ? " AND status = 'faol'" : "");

  const found = await pool.query(sql, [payload.id]);

  if (!found.rows[0]) {
    return res.status(401).json({ error: "Foydalanuvchi topilmadi yoki faol emas" });
  }

  req.user = payload;
  next();
};

export const authUser = verify("user");
export const authStudent = verify("student");
export const authTeacher = verify("teacher");
export const authAdmin = verify("admin");
export const authAdminOrTeacher = verify("admin", "teacher");``