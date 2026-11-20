import express from "express"
import cors from "cors"
import teacherRouter from "./routes/teacher.routes.js"
import adminRouter from "./routes/admin.routes.js"
import userRouter from "./routes/user.routes.js"
import studentRouter from "./routes/student.routes.js"
import productRouter from "./routes/product.routes.js"
import categoryRouter from "./routes/category.routes.js"
import paymentRouter from "./routes/payment.routes.js"
import passwordRouter from "./routes/password.routes.js"
import { notFound, errorHandler } from "./middlewares/error.middlewares.js"
// import authRouter from "./router/auth.routes.js"
// import userRouter from "./router/users.routes.js"
import { config } from "dotenv"

config()

const app = express()
app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json())





app.use(userRouter)
app.use(paymentRouter)
app.use(categoryRouter)
app.use(productRouter)
app.use(passwordRouter)
app.use(adminRouter)
app.use(teacherRouter)
app.use(studentRouter)

app.use(notFound)
app.use(errorHandler)

app.listen(process.env.PORT, () => {
    console.log("server is running....")
})