import axios from "axios";
import { AuthenticatedRequest } from "../middleware/auth.js";
import { createBuffer } from "../utils/buffer.js";
import { sql } from "../utils/db.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { TryCatch } from "../utils/TryCatch.js";
import { applicationStatusUpdateTemplate } from "../utils/template.js";
import { publishTopic } from "../producer.js";

export const createCompany = TryCatch(async(req:AuthenticatedRequest,res)=>{
    const user = req.user;
    if(!user || user.role !== 'recruiter'){
        throw new ErrorHandler(401,'Unauthorized');
    }

    if(user.role !== 'recruiter'){
        throw new ErrorHandler(403,'Forbidden: Only recruiters can create companies');
    }

    const {name,description,website} = req.body;
    if(!name || !description || !website){  
        throw new ErrorHandler(400,'Bad Request: Missing required fields');
    }
    const ExistingCompanies = await sql`SELECT company_id FROM companies WHERE name=${name}`;
    if(ExistingCompanies.length > 0){
        throw new ErrorHandler(409,'Conflict: Company with this name already exists');
    }
    const file = req.file;
    if(!file){
        throw new ErrorHandler(400,'Bad Request: Company logo is required');
    }
    const buffer = createBuffer(file);
    const mediaServiceUrl = process.env.MEDIA_SERVICE_URL;
    if(!mediaServiceUrl){
        throw new ErrorHandler(500,'MEDIA_SERVICE_URL is not configured');
    }
    let data: {url: string; public_id: string};
    try {
        const response = await axios.post<{url: string; public_id: string}>(
            `${mediaServiceUrl}/api/utils/upload`,
            {buffer:buffer.content}
        );
        data = response.data;
    } catch (error:any) {
        const status = error?.response?.status;
        const msg = error?.response?.data?.message || error?.message || 'Media upload failed';
        throw new ErrorHandler(status || 502, `Media upload failed: ${msg}`);
    }
    const [newCompany] = await sql`INSERT INTO companies(name,description,website,logo,logo_public_id,recruiter_id)
    VALUES(${name},${description},${website},${data.url},${data.public_id},${user.user_id}) RETURNING *`;
    
    res.status(201).json({message:'Company created successfully',company:newCompany});

})


export const deleteCompany = TryCatch(async(req:AuthenticatedRequest,res)=>{
    const user = req.user;
    if(!user || user.role !== 'recruiter'){
        throw new ErrorHandler(401,'Unauthorized');
    }
    const {companyId} = req.params;
    const [company] = await sql`SELECT logo_public_id FROM companies WHERE company_id=${companyId} AND recruiter_id=${user.user_id}`;
    if(!company){
        throw new ErrorHandler(404,'Company not found or you do not have permission to delete this company');
    }
    await sql `DELETE FROM companies WHERE company_id=${companyId}`;

    res.status(200).json({message:'Company and all associated jobs deleted successfully'});
})


export const createJob=TryCatch(async(req:AuthenticatedRequest,res)=>{
    const user = req.user;
    if(!user || user.role !== 'recruiter'){
        throw new ErrorHandler(401,'Unauthorized');
    }
    const {title,description,location,salary,role,job_type,work_location,company_id,openings}=req.body;
    if(!title || !description || !location || !salary || !role || !job_type || !work_location || !company_id || !openings){  
        throw new ErrorHandler(400,'Bad Request: Missing required fields');
    }

    const [company] = await sql`SELECT company_id FROM companies WHERE company_id=${company_id} AND recruiter_id=${user.user_id}`;
    if(!company){
        throw new ErrorHandler(404,'Company not found or you do not have permission to add jobs to this company');
    }

    const [newJob] = await sql`INSERT INTO jobs(title,description,location,salary,role,job_type,work_location,company_id,posted_by_recuriter_id,openings)
    VALUES(${title},${description},${location},${salary},${role},${job_type},${work_location},${company_id},${user.user_id},${openings}) RETURNING *`;
    res.status(201).json({message:'Job created successfully',job:newJob});
})


export const updateJob=TryCatch(async(req:AuthenticatedRequest,res)=>{
    const user = req.user;  
    if(!user || user.role !== 'recruiter'){
        throw new ErrorHandler(401,'Unauthorized');
    }
    const {title,description,location,salary,role,job_type,work_location,openings,is_active}=req.body;
    const [existingJob] = await sql `SELECT posted_by_recuriter_id FROM jobs WHERE job_id=${req.params.jobId}`;
    if(!existingJob){
        throw new ErrorHandler(404,'Job not found');
    }
    if(existingJob.posted_by_recuriter_id !== user.user_id){
        throw new ErrorHandler(403,'Forbidden: You do not have permission to update this job');
    }
    const [updatedJob] = await sql`UPDATE jobs SET
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        location = COALESCE(${location}, location),
        salary = COALESCE(${salary}, salary),
        role = COALESCE(${role}, role),
        job_type = COALESCE(${job_type}, job_type),
        work_location = COALESCE(${work_location}, work_location),
        openings = COALESCE(${openings}, openings),
        is_active = COALESCE(${is_active}, is_active)
    WHERE job_id = ${req.params.jobId}
    RETURNING *`;
    res.status(200).json({message:'Job updated successfully',job:updatedJob});
})


export const getAllCompanyies=TryCatch(async(req:AuthenticatedRequest,res)=>{
    const companies = await sql`SELECT * FROM companies WHERE recruiter_id=${req.user?.user_id}`;
    res.status(200).json(companies);
})

export const getCompanyDetails=TryCatch(async(req:AuthenticatedRequest,res)=>{
    const {companyId} = req.params;
    if(!companyId){
        throw new ErrorHandler(400,'Bad Request: companyId is required');
    }
    const [company] = await sql`SELECT c.*,COALESCE(
    (SELECT json_agg(j.*) FROM jobs j WHERE j.company_id=c.company_id),'[]'::json
    ) AS jobs FROM companies c WHERE company_id=${companyId} GROUP BY c.company_id`; ;
    if(!company){
        throw new ErrorHandler(404,'Company not found');
    }

    res.status(200).json(company);
    
})


export const getAllActiveJobs=TryCatch(async(req:AuthenticatedRequest,res)=>{
    const {title,location} = req.query as {title?:string,location?:string};

    let queryStr = `select j.job_id,j.title,j.description,j.salary,j.location,j.job_type,
    j.work_location,j.created_at,c.name AS company_name, c.logo AS company_logo, c.company_id AS company_id FROM 
    jobs j JOIN companies c ON j.company_id = c.company_id WHERE j.is_active = true`;

    const values =[];
    let paramsIndx=1;
    if(title){
        queryStr += ` AND j.title ILIKE $${paramsIndx}`;
        values.push(`%${title}%`);
        paramsIndx++;
    }
    if(location){
        queryStr += ` AND j.location ILIKE $${paramsIndx}`;
        values.push(`%${location}%`);
        paramsIndx++;
    }
    queryStr += ` ORDER BY j.created_at DESC`;
    const jobs = (await sql.query(queryStr,values)) as any[]

    res.status(200).json(jobs);
})



export const GetSingleJob = TryCatch(async(req:AuthenticatedRequest,res)=>{
    const {jobId} = req.params;

    const [job] = await sql`
        SELECT
            *,
            posted_by_recuriter_id AS posted_by_recruiter_id
        FROM jobs
        WHERE job_id=${jobId}
    `;
    if(!job){
        throw new ErrorHandler(404,'Job not found');
    }
    res.status(200).json(job);

})


export const getAllApplicationsForJob=TryCatch(async(req:AuthenticatedRequest,res)=>{
    const user = req.user;
    if(!user || user.role !== 'recruiter'){
        throw new ErrorHandler(401,'Unauthorized');
    }
    const {jobId} = req.params;

    const [job] = await sql`SELECT posted_by_recuriter_id FROM jobs WHERE job_id=${jobId}`;
    if(!job){
        throw new ErrorHandler(404,'Job not found');
    }
    if(job.posted_by_recuriter_id !== user.user_id){
        throw new ErrorHandler(403,'Forbidden: You do not have permission to view applications for this job');
    }
    const applications = await sql`SELECT * from applications WHERE job_id=${jobId} ORDER BY subscribed DESC,applied_at`;
    res.status(200).json(applications);

})



export const UpdateApplication=TryCatch(async(req:AuthenticatedRequest,res)=>{
    const user = req.user;
    if(!user || user.role !== 'recruiter'){
        throw new ErrorHandler(401,'Unauthorized');
    }
    const {id} = req.params;
    const [application] = await sql`SELECT * FROM applications WHERE application_id=${id}`;
    if(!application){
        throw new ErrorHandler(404,'Application not found');
    }
    const [job] =await sql`SELECT posted_by_recuriter_id,title FROM jobs WHERE job_id=${application.job_id}`;
    if(!job){
        throw new ErrorHandler(404,'Associated job not found');
    }
    if(job.posted_by_recuriter_id !== user.user_id){
        throw new ErrorHandler(403,'Forbidden: You do not have permission to update this application');
    }

    const [updatedApplication] = await sql`UPDATE applications SET
    status = COALESCE(${req.body.status}, status) WHERE application_id = ${id}
    RETURNING *`;
    const message={
        to:application.applicant_email,
        subject:`Update on your application for ${job.title}`,
        html:applicationStatusUpdateTemplate(job.title)
    }

    publishTopic('send-mail', message ).catch(err=>console.error('Failed to publish message to send-mail topic',err));
    res.status(200).json({message:`Application for job ${job.title} updated successfully`,application:updatedApplication});
    
})


