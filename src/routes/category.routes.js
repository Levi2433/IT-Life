import { Router } from "express";
import categoryController from "../controllers/category.controller.js";
import { authAdmin } from "../middlewares/auth.middleware.js";

const categoryRouter = Router()

categoryRouter.get('/categories', categoryController.getAllCategories)

categoryRouter.post('/categories', authAdmin, categoryController.createCategory)
categoryRouter.put('/categories/:id', authAdmin, categoryController.updateCategory)
categoryRouter.delete('/categories/:id', authAdmin, categoryController.deleteCategory)

export default categoryRouter