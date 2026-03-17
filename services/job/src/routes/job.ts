import express from 'express'
import { isAuth } from '../middleware/auth.js';
import { uploadFile } from '../middleware/multer.js';
import { createCompany, createJob, deleteCompany, getAllActiveJobs, getAllApplicationsForJob, getAllCompanyies, getCompanyDetails, GetSingleJob, UpdateApplication, updateJob } from '../controller/job.js';

export const router = express.Router();

router.post('/company/new',isAuth,uploadFile,createCompany)

router.delete('/company/:companyId',isAuth,deleteCompany)

router.post('/new',isAuth,createJob)
router.put('/update/:jobId',isAuth,updateJob)
router.get('/company/all',isAuth,getAllCompanyies)
router.get('/company/:companyId',isAuth,getCompanyDetails)
router.get('/all',getAllActiveJobs)
router.get('/:jobId',GetSingleJob)
router.get('/applications/:jobId',isAuth,getAllApplicationsForJob)
router.put('/applications/update/:id',isAuth,UpdateApplication)