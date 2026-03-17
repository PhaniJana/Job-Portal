import app from './app.js';
import dotenv from 'dotenv';
import { sql } from './utils/db.js';
import {createClient} from 'redis'
dotenv.config();

export const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

await redisClient.connect().then(()=>console.log('✅ Connected to Redis')).catch((err)=>console.error('❌ Redis Connection Error:',err))    ;

const InitDB=async()=>{
    try { //ENUM jobseeker, recruiter
        await sql` 
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
                CREATE TYPE user_role AS ENUM ('jobseeker', 'recruiter');
            END IF;
        END $$;    
        `

        await sql`
        CREATE TABLE IF NOT EXISTS users(
            user_id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            phone_number VARCHAR(20) NOT NULL,
            role user_role NOT NULL,
            bio TEXT,
            resume VARCHAR(255),
            resume_public_id VARCHAR(255),
            profile_pic VARCHAR(255),
            profile_pic_public_id VARCHAR(255),
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            subscription TIMESTAMPTZ
        )`


        await sql`
        CREATE TABLE IF NOT EXISTS skills(
            skill_id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE
        )`


        await sql`
        CREATE TABLE IF NOT EXISTS user_skills(
            user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
            skill_id INTEGER REFERENCES skills(skill_id) ON DELETE CASCADE,
            PRIMARY KEY (user_id, skill_id)
        )`

        console.log('✅ Database initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing database:', error);
    }
}

const port = process.env.PORT || 3001;

InitDB().then(()=>{
    app.listen(port,()=>{
        console.log(`Auth service is running on port http://localhost:${port}`);
    })
})
