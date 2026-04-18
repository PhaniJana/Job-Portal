import React from "react";

export interface JobOptions{
    title: string,
    responsibilities: string[],
    why: string,
}

export interface SkillsToLearn{
    title: string,
    why: string,
    how: string ,
}

export interface SkillCategory{
    category: string,
    skills: SkillsToLearn[]
}

export interface LearningApproach{
    title: string,
    points: string[],
}

export interface CareerGuideResponse{
    summary: string,
    jobOptions: JobOptions[],
    skillsToLearn: SkillCategory[],
    learningApproach: LearningApproach,
}

export interface ResumeScoreItem {
    score: number,
    feedback: string,
}
export interface ScoreBreakDown {
    formatting : ResumeScoreItem,
    keywords : ResumeScoreItem,
    structure : ResumeScoreItem,
    redability : ResumeScoreItem,
}

export interface ResumeSuggestion {
    category: string,
    issue: string,
    recommendation: string,
    priority: 'high' | 'medium' | 'low',
}

export interface ResumeAnalysisResponse {
    atsScore: number,
    scoreBreakdown: Record<string, ResumeScoreItem>,
    suggestions: ResumeSuggestion[],
    strengths: string[],
    summary: string,
}

export interface User{
    user_id:number,
    name:string,
    email:string,
    phone_number:string,
    role:'jobseeker' | 'recruiter'
    bio:string | null;
    resume :string | null
    resume_public_id:string | null
    profile_pic:string | null
    profile_pic_public_id:string | null
    skills:string[]
    subscription:string | null
}

export interface AppContextType{
    user:User | null,
    loading:boolean,
    btnLoading:boolean,
    isAuth:boolean,
    setUser:React.Dispatch<React.SetStateAction<User | null>>,
    setLoading:React.Dispatch<React.SetStateAction<boolean>>,
    setIsAuth:React.Dispatch<React.SetStateAction<boolean>>,
    logOutHandler:()=>void
    updateProfilePic:(formData: FormData) => Promise<void>
    updateResume:(formData: FormData) => Promise<void>
    updateProfile:(name: string, phoneNumber: string, bio: string) => Promise<void>
    AddSkill:(skillName:string)=>Promise<void>
    removeSkill:(skillName:string)=>Promise<void>
    applyJob:(job_id:number)=>Promise<void>
    applications: Application[]
    fetchApplications: () => Promise<void>

}

export interface AppProviderProps{
    children: React.ReactNode
} 

export interface AccountProps{
    user : User;
    isYourAccount : boolean;
    
}
export interface Job{
    job_id:number,
    title:string,
    description:string,
    location:string,
    salary:string,
    job_type:"Full-time" | "Part-time" | "Contract" | "Internship",
    openings:number,
    role:string,
    work_location: "On-site" | "Remote" | "Hybrid",
    company_id:number,
    posted_by_recruiter_id:number,
    created_at:string
    is_active:boolean
    company_name:string
    company_logo:string
}
export interface Company{
    company_id:number,
    name:string,
    description:string,
    website:string,
    logo:string
    logo_public_id:string
    recruiter_id:number
    created_at:string   
    jobs?:Job[]
}

type ApplicationStatus = 'Submitted' | 'Hired' | 'Rejected';
export interface Application{
    application_id:number,
    job_id:number,
    applicant_id:number,
    applicant_email:string,
    resume:string,
    applied_at:string,
    cover_letter:string,
    status:ApplicationStatus,
    subscribed:boolean
    job_title:string
    job_salary:number | null
    job_location:string | null
}