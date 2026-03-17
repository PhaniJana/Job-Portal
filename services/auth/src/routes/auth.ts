import express from 'express'
import { forgotPassword, LoginUser, RegisterUser, resetPassword } from '../controllers/auth.js';
import uploadFile from '../middleware/multer.js';

export const authRouter = express.Router();

authRouter.post('/register',uploadFile,RegisterUser)

authRouter.post('/login',LoginUser)

authRouter.post('/forgot',forgotPassword)

authRouter.post('/reset/:token',resetPassword)