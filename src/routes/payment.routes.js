import { Router } from "express";
import paymentController from "../controllers/payment.controller.js";
import { authStudent, authAdmin } from "../middlewares/auth.middleware.js";

const paymentRouter = Router()

paymentRouter.post('/payments', authStudent, paymentController.createPayment)
paymentRouter.get('/payments/my', authStudent, paymentController.getMyPayments)
paymentRouter.get('/payments', authAdmin, paymentController.getAllPayments)

export default paymentRouter