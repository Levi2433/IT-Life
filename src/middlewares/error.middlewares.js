export const notFound = (req, res) => {
  res.status(404).json({
    error: `Yo'l topilmadi: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (err, req, res, next) => {
  let status = err.status || err.statusCode || 500;
  let message = err.message;


  if (err.type === "entity.parse.failed") {
    status = 400;
    message = "JSON noto'g'ri yuborilgan";
  }


  else if (err.type === "entity.too.large") {
    status = 413;
    message = "Yuborilgan ma'lumot juda katta";
  }


  else if (err.name === "TokenExpiredError") {
    status = 401;
    message = "Token muddati tugagan, qaytadan kiring";
  } else if (err.name === "JsonWebTokenError") {
    status = 401;
    message = "Token noto'g'ri";
  }


  else if (err.code === "23505") {
    status = 409;
    message = "Bu ma'lumot allaqachon mavjud";
  } else if (err.code === "23514") {
    status = 400;
    message = "Qiymat ruxsat etilgan shartga to'g'ri kelmaydi (masalan, kategoriya yoki reyting)";
  } else if (err.code === "23502") {
    status = 400;
    message = "Majburiy maydon to'ldirilmagan";
  } else if (err.code === "23503") {
    status = 409;
    message = "Bog'langan ma'lumot topilmadi yoki o'chirib bo'lmaydi";
  } else if (err.code === "22P02" || err.code === "22003" || err.code === "22001") {
    status = 400;
    message = "Yuborilgan qiymat turi yoki uzunligi noto'g'ri";
  } else if (err.code === "42P01") {
    status = 500;
    message = "Bazada jadval topilmadi";
  } else if (err.code === "28P01" || err.code === "3D000") {
    status = 500;
    message = "Bazaga ulanishda xatolik";
  } else if (err.code === "ECONNREFUSED" || err.code === "ETIMEDOUT") {
    status = 503;
    message = "Ma'lumotlar bazasi bilan aloqa yo'q";
  }


  else if (err.message && err.message.includes("data and salt arguments required")) {
    status = 400;
    message = "Parol yuborilmagan";
  }


  else if (err instanceof TypeError && err.message.includes("req.body")) {
    status = 400;
    message = "So'rov bo'sh yuborilgan";
  }

  if (status >= 500) {
    console.error(err);
    if (process.env.NODE_ENV === "production") {
      message = "Serverda xatolik yuz berdi";
    }
  }

  res.status(status).json({
    error: message,
  });
};