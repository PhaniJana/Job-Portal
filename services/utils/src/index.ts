import express from 'express';
import dotenv from 'dotenv';
import { router } from './routes/route.js';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import { startSendMailConsumer } from './consumer.js';


dotenv.config();
startSendMailConsumer()
cloudinary.config({ 
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY , 
    api_secret: process.env.CLOUDINARY_API_SECRET   
});

const app = express();
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.use('/api/utils', router);



const port = process.env.PORT || 3005;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});