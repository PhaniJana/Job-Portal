import e from "express";
import { isAuth } from "../middleware/auth.js";
import { CheckOut, VerifyPayment } from "../controller/payment.js";

export const router = e.Router();


router.post('/checkout',isAuth,CheckOut)
router.post('/verify',isAuth,VerifyPayment)
