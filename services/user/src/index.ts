import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/user.js'
import { errorMiddleware } from './middleware/errorMiddleware.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/user',userRouter)

app.use(errorMiddleware)

app.listen(PORT,()=>{
    console.log(`✅ User service is running on port ${PORT}`);
})