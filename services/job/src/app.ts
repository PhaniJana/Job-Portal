import express from 'express';
import { router } from './routes/job.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/job',router)
app.use(errorMiddleware)
    

export default app;