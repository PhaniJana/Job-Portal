import express from 'express';
import { isAuth } from '../middleware/auth.js';
import { addSkillTouser, applyForJob, getAllApplications, GetUserprofile, MyProfile, removeSkillFromUser, UpdateProfilePic, UpdateResume, updateUserProfile } from '../controller/user.js';
import { uploadFile } from '../middleware/multer.js';

const router = express.Router();

router.get('/me',isAuth,MyProfile)
router.get('/:userId',isAuth,GetUserprofile)
router.put('/update/profile',isAuth,updateUserProfile)
router.put('/update/pic',isAuth,uploadFile,UpdateProfilePic)
router.put('/update/resume',isAuth,uploadFile,UpdateResume)
router.post('/skill/add',isAuth,addSkillTouser)
router.delete('/skill/remove',isAuth,removeSkillFromUser)
router.post('/apply',isAuth,applyForJob)
router.get('/application/all',isAuth,getAllApplications);

export default router;