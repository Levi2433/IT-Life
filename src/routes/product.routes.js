import { Router } from "express";
import productController from "../controllers/product.controller.js";
import { validateCreateCourse, validateUpdateCourse } from "../middlewares/course.validate.js";
import { authAdminOrTeacher } from "../middlewares/auth.middleware.js";

const productRouter = Router()

productRouter.get('/courses', productController.getAllProducts)
productRouter.get('/courses/:id', productController.getProductById)

productRouter.post('/courses', authAdminOrTeacher, validateCreateCourse, productController.createProduct)
productRouter.put('/courses/:id', authAdminOrTeacher, validateUpdateCourse, productController.updateProduct)
productRouter.delete('/courses/:id', authAdminOrTeacher, productController.deleteProduct)

export default productRouter