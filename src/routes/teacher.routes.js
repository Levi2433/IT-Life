import { Router } from "express";
import teacherController from "../controllers/teacher.controller.js";

const teacherRouter = Router()

teacherRouter.get('/teachers', teacherController.getAllTeachers)
teacherRouter.post('/teachers/login', teacherController.loginTeacher)

export default teacherRouter