import app from './app.js';
import dotenv from 'dotenv';
import { sql } from './utils/db.js';
import { connectKafka } from './producer.js';
dotenv.config();
connectKafka()
const initDB = async()=>{
    try {
        await sql`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_type') THEN
                    CREATE TYPE job_type AS ENUM ('Full-time', 'Part-time', 'Contract', 'Internship');
                END IF;
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'work_location') THEN
                    CREATE TYPE work_location AS ENUM ('On-site', 'Remote', 'Hybrid');
                END IF;
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
                    CREATE TYPE application_status AS ENUM ('Submitted', 'Hired', 'Rejected');
                END IF;
            END$$;

        `
        await sql`
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name = 'companies'
                      AND column_name = 'recruiter_id'
                      AND data_type = 'timestamp with time zone'
                ) THEN
                    ALTER TABLE companies ALTER COLUMN recruiter_id DROP NOT NULL;
                    ALTER TABLE companies ALTER COLUMN recruiter_id TYPE INTEGER USING NULL;
                    ALTER TABLE companies ALTER COLUMN recruiter_id SET NOT NULL;
                END IF;
            END$$;
        `
        await sql`CREATE TABLE IF NOT EXISTS companies(
            company_id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            description TEXT NOT NULL,
            website VARCHAR(255) NOT NULL,
            logo VARCHAR(255) NOT NULL,
            logo_public_id VARCHAR(255) NOT NULL,
            recruiter_id INTEGER NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`

        await sql`CREATE TABLE IF NOT EXISTS jobs(
            job_id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            salary NUMERIC(10,2),
            location VARCHAR(255) ,
            job_type job_type NOT NULL,
            openings NUMERIC(3,1) NOT NULL,
            role VARCHAR(255) NOT NULL,
            work_location work_location NOT NULL,
            company_id INT REFERENCES companies(company_id) ON DELETE CASCADE,
            posted_by_recuriter_id INTEGER NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT TRUE
        )`

        await sql`CREATE TABLE IF NOT EXISTS applications(
            application_id SERIAL PRIMARY KEY,
            job_id INT REFERENCES jobs(job_id) ON DELETE CASCADE,
            applicant_id INT NOT NULL,
            applicant_email VARCHAR(255) NOT NULL,
            status application_status DEFAULT 'Submitted',
            resume VARCHAR(255) NOT NULL,
            applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            subscribed BOOLEAN DEFAULT FALSE,
            UNIQUE(job_id, applicant_id)
            )`
            console.log("✅ Job Service Tables and Types are created successfully");
    }
    catch (error) {
                console.error("❌ Error creating Job Service Tables and Types:", error);
                process.exit(1);
    }
        
}




const port = process.env.PORT || 3003;
initDB().then(() => {
    app.listen(port, () => { 
        console.log(`✅ Job service is running on port ${port}`);
    });
})



