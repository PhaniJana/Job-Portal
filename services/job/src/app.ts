import express from 'express';
import { router } from './routes/job.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import cors from 'cors';
const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/job',router)
app.use(errorMiddleware)
    

export default app;