import { Router } from "express";
import { changePassword } from "../controllers/password.controller.js";
import { authAdmin, authTeacher, authStudent } from "../middlewares/auth.middleware.js";

const passwordRouter = Router()

passwordRouter.put('/admin/password', authAdmin, changePassword("admins"))
passwordRouter.put('/teachers/password', authTeacher, changePassword("teachers"))
passwordRouter.put('/students/password', authStudent, changePassword("students"))

export default passwordRouter