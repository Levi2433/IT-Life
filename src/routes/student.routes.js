import { Router } from "express";
import studentController from "../controllers/student.controller.js";
import { authAdmin, authAdminOrTeacher, authStudent } from "../middlewares/auth.middleware.js";

const studentRouter = Router()

studentRouter.post('/students/login', studentController.loginStudent)
studentRouter.get('/students/me', authStudent, studentController.getMe)
studentRouter.post('/students/quick-auth', studentController.quickAuth)
studentRouter.get('/students', authAdminOrTeacher, studentController.getAllStudents)
studentRouter.post('/students', authAdmin, studentController.createStudent)

export default studentRouter