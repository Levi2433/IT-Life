import { Router } from "express";
import usersController from "../controllers/users.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const userRouter = Router()

userRouter.get('/health', usersController.getAllUser)

userRouter.get('/users/me', authUser, usersController.getMe)

userRouter.post('/users', usersController.createUser)

userRouter.post('/login', usersController.loginUser)

export default userRouter