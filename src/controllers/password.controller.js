import pool from "../config/db.js";
import bcrypt from "bcrypt"

const MIN_LENGTH = 6;

// table: "admins" | "teachers" | "students" (faqat serverdan beriladi, foydalanuvchidan emas)
export const changePassword = (table) => async (req, res) => {
  const { current_password, new_password, confirm_password } = req.body;

  if ([current_password, new_password, confirm_password].some((v) => typeof v !== "string" || !v)) {
    return res.status(400).json({ error: "Hamma maydonlarni to'ldiring" });
  }

  if (new_password.length < MIN_LENGTH) {
    return res.status(400).json({ error: `Yangi parol kamida ${MIN_LENGTH} ta belgidan iborat bo'lishi kerak` });
  }

  if (new_password !== confirm_password) {
    return res.status(400).json({ error: "Yangi parol va tasdiqlash paroli bir xil emas" });
  }

  if (new_password === current_password) {
    return res.status(400).json({ error: "Yangi parol joriy paroldan farq qilishi kerak" });
  }

  // Faqat tokendagi o'z id si bo'yicha: hech kim boshqaning parolini o'zgartira olmaydi
  const found = await pool.query(`SELECT password FROM ${table} WHERE id = $1`, [req.user.id]);

  if (!found.rows[0]) {
    return res.status(404).json({ error: "Foydalanuvchi topilmadi" });
  }

  if (!(await bcrypt.compare(current_password, found.rows[0].password))) {
    return res.status(400).json({ error: "Joriy parol noto'g'ri" });
  }

  const hashedPassword = await bcrypt.hash(new_password, 10);
  await pool.query(`UPDATE ${table} SET password = $1 WHERE id = $2`, [hashedPassword, req.user.id]);

  res.status(200).json({ message: "Parol muvaffaqiyatli o'zgartirildi" });
};