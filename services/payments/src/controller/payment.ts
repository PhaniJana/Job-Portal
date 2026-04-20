import { TryCatch } from "../utils/TryCatch.js";
import { AuthenticatedRequest } from "../middleware/auth.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { sql } from "../utils/db.js";
import { instance } from "../index.js";
import crypto from 'crypto'
export const CheckOut = TryCatch(async(req:AuthenticatedRequest,res)=>{
    if(!req.user){
        throw new ErrorHandler(401,'Unauthorized')
    }
    const user_id = req.user.user_id;

    const [user] = await sql`SELECT * FROM users WHERE user_id = ${user_id}`;
    if(!user){
        throw new ErrorHandler(404,'User Not Found')
    }
    const subTime = user.subscription ? new Date(user.subscription).getTime() : 0;

    const now = Date.now();

    const isSubscribed = subTime > now;

    if(isSubscribed){
        throw new ErrorHandler(400,'User Already Subscribed')
    }

    const options = {
        amount :Number(119*100),
        currency:'INR',
        notes:{
            user_id:user_id.toString()
        }
    }
    const order = await instance.orders.create(options);
    res.status(200).json({order})
})


export const VerifyPayment = TryCatch(async(req:AuthenticatedRequest,res)=>{
    const user = req.user;
    if(!user){
        throw new ErrorHandler(401,'Unauthorized')
    }
    const {razorpay_order_id,razorpay_payment_id,razorpay_signature} = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string).update(body).digest('hex');

    if(expectedSignature === razorpay_signature){
        const now = new Date();
        const nextMonth = new Date(now.getTime() + 30*24*60*60*1000);
        const [updatedUser] = await sql`UPDATE users SET subscription = ${nextMonth} WHERE user_id = ${user.user_id} RETURNING *`;
        res.status(200).json({success:true,message:'Subscription updated successfully', user: updatedUser})
    }else{
        res.status(400).json({success:false,message:'Invalid payment signature'})
    }

})