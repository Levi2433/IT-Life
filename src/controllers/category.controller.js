import pool from "../config/db.js";

const getAllCategories = async (req, res) => {
  const result = await pool.query(
    `SELECT cat.id, cat.name, cat.created_at, COUNT(c.id)::int AS course_count
     FROM categories cat
     LEFT JOIN courses c ON c.category_id = cat.id
     GROUP BY cat.id
     ORDER BY cat.id`
  );

  res.status(200).json({
    message: "Hamma kategoriyalar",
    data: result.rows,
  });
};

const createCategory = async (req, res) => {
  const name = req.body.name?.trim();

  if (!name) {
    return res.status(400).json({ error: "Kategoriya nomini kiriting" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO categories (name) VALUES ($1) RETURNING id, name, created_at",
      [name]
    );

    res.status(201).json({
      message: "Yangi kategoriya yaratildi",
      data: result.rows[0],
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Bunday kategoriya mavjud" });
    }
    throw err;
  }
};

const updateCategory = async (req, res) => {
  const name = req.body.name?.trim();

  if (!name) {
    return res.status(400).json({ error: "Kategoriya nomini kiriting" });
  }

  try {
    const result = await pool.query(
      "UPDATE categories SET name = $1 WHERE id = $2 RETURNING id, name, created_at",
      [name, req.params.id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: "Kategoriya topilmadi" });
    }

    res.status(200).json({
      message: "Kategoriya yangilandi",
      data: result.rows[0],
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Bunday kategoriya mavjud" });
    }
    throw err;
  }
};

const deleteCategory = async (req, res) => {
  const result = await pool.query(
    "DELETE FROM categories WHERE id = $1 RETURNING id",
    [req.params.id]
  );

  if (!result.rows[0]) {
    return res.status(404).json({ error: "Kategoriya topilmadi" });
  }

  res.status(200).json({ message: "Kategoriya o'chirildi" });
};

export default {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};