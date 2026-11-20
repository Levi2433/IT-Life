import { Router } from "express";
import adminController from "../controllers/admin.controller.js";
import { authAdmin } from "../middlewares/auth.middleware.js";

const adminRouter = Router()

adminRouter.post('/admins/login', adminController.loginAdmin)
adminRouter.get('/admin/me', authAdmin, adminController.getMe)
adminRouter.get('/admin/stats', authAdmin, adminController.getStats)

adminRouter.get('/admin/all', authAdmin, adminController.getAllAdmins)
adminRouter.post('/admin/all', authAdmin, adminController.createAdmin)

adminRouter.post('/admin/teachers', authAdmin, adminController.createTeacher)
adminRouter.put('/admin/teachers/:id', authAdmin, adminController.updateTeacher)
adminRouter.delete('/admin/teachers/:id', authAdmin, adminController.deleteTeacher)

export default adminRouter