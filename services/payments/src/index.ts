import express from "express";
import cors from 'cors'
import 'dotenv/config'
import Razorpay from "razorpay";
import { router as paymentRouter } from "./routes/payment.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";

const app = express();
app.use(cors())
app.use(express.json())

export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_KEY_SECRET as string,
})

app.use("/api/payments", paymentRouter)
const port = process.env.PORT || 3004;

app.use(errorMiddleware)
app.listen(port, () => {
    console.log(`Payments service is running on port ${port}`);
})