import getBuffer from "../utils/buffer.js";
import { sql } from "../utils/db.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TyrCatch } from "../utils/TryCatch.js";
import bcrypt from 'bcrypt';
import axios from "axios";
import jwt from "jsonwebtoken";
import { forgotPasswordTemplate } from "../template.js";
import { publishTopic } from "../producer.js";
import { redisClient } from "../index.js";
import dotenv from 'dotenv';
dotenv.config();             
export const RegisterUser = TyrCatch(async(req,res,next)=>{
    const{name,email,password,phone_number,role,bio}=req.body;

    if(!name || !email || !password || !phone_number || !role){
        throw new ErrorHandler('All fields are required',400);
    }

    const existingUser=await sql`SELECT * FROM users WHERE email=${email}`;
    if(existingUser.length>0){
        throw new ErrorHandler('User with this email already exists',409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let registeredUser : any;

    if(role==='jobseeker'){
        const file=req.file;
        if(!file){
            throw new ErrorHandler('Resume is required for jobseeker',400);
        }
        const fileBuffer = getBuffer(file);
        if(!fileBuffer){
            throw new ErrorHandler('Failed to Generate Buffer',500);
        }
        const {data} = await axios.post(`${process.env.UTILS_SERVICE_URL}/api/utils/upload`,{buffer: fileBuffer});

        registeredUser=await sql`INSERT INTO users (name,email,password,phone_number,role,bio,resume,resume_public_id) 
        VALUES (${name},${email},${hashedPassword},${phone_number},${role},${bio},${data.url},${data.public_id}) RETURNING user_id,name,email,phone_number,role,bio,resume,created_at`;
    
    }else if(role==='recruiter'){
        registeredUser=await sql`INSERT INTO users (name,email,password,phone_number,role) 
        VALUES (${name},${email},${hashedPassword},${phone_number},${role}) RETURNING user_id,name,email,phone_number,role,created_at`;
    }

    const token = jwt.sign({id: registeredUser[0].user_id}, process.env.JWT_SECRET as string, {expiresIn: '7d'});
    const UserObject = registeredUser[0];
    res.status(201).json({message:"User registered successfully", UserObject, token});
})

export const LoginUser=TyrCatch(async(req,res,next)=>{
    const {email,password} =req.body;

    if(!email || !password){
        throw new ErrorHandler('Email and Password are required',400);
    }

    const user = await sql`SELECT 
    u.user_id,
    u.name,
    u.password,
    u.email,
    u.phone_number,
    u.role,
    u.bio,
    u.resume,
    u.profile_pic,
    u.subscription,
    ARRAY_AGG(s.name) FILTER (WHERE s.name IS NOT NULL) AS skills
    FROM users u
    LEFT JOIN user_skills us 
        ON u.user_id = us.user_id
    LEFT JOIN skills s 
        ON us.skill_id = s.skill_id
    WHERE u.email = ${email}
    GROUP BY u.user_id;`;



    if(user.length===0){
        throw new ErrorHandler('Invalid Email',401);
    }
    let UserObject = user[0];
    const isPasswordValid = await bcrypt.compare(password, UserObject.password);
    if(!isPasswordValid){
        throw new ErrorHandler('Invalid Password',401);
    }
    UserObject.skills = UserObject.skills || [];
    delete UserObject.password;

    const token = jwt.sign({id: UserObject.user_id}, process.env.JWT_SECRET as string, {expiresIn: '7d'});
    res.status(200).json({message:"User logged in successfully",UserObject,token});
})

export const forgotPassword=TyrCatch(async(req,res,next)=>{
    const {email}=req.body;
    if(!email){
        throw new ErrorHandler('Email is required',400);
    }
    const users=await sql`SELECT user_id,email FROM users WHERE email=${email}`;
    if(users.length===0){
        return res.status(200).json({message:"If a user with that email exists, a password reset link has been sent."});
    }
    const user = users[0];
    const resetToken = jwt.sign({
        email :user.email,
        type:'reset'
    },process.env.JWT_SECRET as string,{expiresIn:'15m'})
    
    const resetLink = `${process.env.FRONTEND_URL}/reset/${resetToken}`;
    await redisClient.set(`forgot${email}`,resetToken,{
        EX: 15 * 60
    });
    const message = {
        to:user.email,
        subject:'Password Reset Request - ZaphHire',
        html:forgotPasswordTemplate(resetLink),
    }

    publishTopic('send-mail',message).catch((err)=>{
        console.error('Error publishing to topic:',err);
    });
    return res.status(200).json({message:"If a user with that email exists, a password reset link has been sent."});
})


export const resetPassword=TyrCatch(async(req,res,next)=>{
    const {token}=req.params;
    const {password}=req.body;
    let decoded:any

    if (!token || Array.isArray(token)) {
        throw new ErrorHandler("Invalid token", 400);
    }


    try {
        decoded = jwt.verify(token,process.env.JWT_SECRET as string);
    } catch (error) {
        throw new ErrorHandler('expired token',400);
    }

    if(decoded.type !== 'reset'){
        throw new ErrorHandler('Invalid token type',400);
    }

    const email = decoded.email;
    const storedToken = await redisClient.get(`forgot${email}`);
    if(!storedToken || storedToken !== token){
        throw new ErrorHandler('Invalid or expired token',400);
    }
    const users=await sql`SELECT user_id FROM users WHERE email=${email}`;
    if(users.length===0){
        throw new ErrorHandler('User not found',404);
    }
    const user=users[0];
    const hashedPassword = await bcrypt.hash(password, 10);
    await sql`UPDATE users SET password=${hashedPassword} WHERE user_id=${user.user_id}`;
    await redisClient.del(`forgot${email}`);
    return res.status(200).json({message:"Password reset successfully"});
})