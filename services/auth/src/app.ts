import express from 'express'
import { authRouter } from './routes/auth.js';
import { connectKafka } from './producer.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
connectKafka()

app.use('/api/auth', authRouter);


export default app; 