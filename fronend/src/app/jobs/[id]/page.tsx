'use client'
import { job_service, useAppData } from '@/context/AppContext'
import { Application, Job } from '@/type'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import Loading from '@/components/loading'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Briefcase, Building2, CheckCheckIcon, CheckCircle2, DollarSign, MapPin, Users } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Label } from 'radix-ui'
import Link from 'next/link'
const JobPage = () => {

    const {user,isAuth,applyJob,applications,btnLoading} = useAppData()
    
    const router = useRouter()
    const {id} = useParams()
    const [applied, setApplied] = useState(false)
    const [job, setJob] = useState<Job | null>(null)
    const [loading, setLoading] = useState(true)
    const [jobApplications, setJobApplications] = useState<Application[]>([])
    const [filterStatus, setFilterStatus] = useState("All")
    const [value, setValue] = useState("")
    const token = Cookies.get("token")
    
    const fetchJob = useCallback(async () => {
            setLoading(true)
            try {
                const {data} = await axios.get(`${job_service}/api/job/${id}`)
                setJob(data)
            } catch (error) {
                console.error("Error fetching job details:", error);
                toast.error("Failed to load job details. Please try again later.");
            } finally{
                setLoading(false)
            }
    },[id])

    useEffect(() => {
        
        fetchJob()
    },[id,fetchJob])

    useEffect(() => {
        if(applications && job?.job_id && applications.some(app => app.job_id === job.job_id)){
            setApplied(true)
        }
    },[id,applications,job])

    const applyHandler = async () => {
        if(!isAuth){
            toast.error("Please login to apply for this job")
            router.push("/login")
            return
        }
        if(applied){
            toast.error("You have already applied for this job")
            return
        }
        try {
            const {data} = await axios.post(`${job_service}/api/job/apply/${job?.job_id}`,{},{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(data.message)
            setApplied(true)
        } catch (error) {
            console.error("Error applying for job:", error);
            toast.error("Failed to apply for job. Please try again later.");
        }
    }
    const fetchApplications = useCallback(async () => {
        try {            
            const {data} = await axios.get(`${job_service}/api/job/applications/${id}`,{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            setJobApplications(data)
        } catch (error) {
            console.error("Error fetching applications:", error);
            toast.error("Failed to load applications. Please try again later.");
        } finally {
            setLoading(false)
        }
    },[id,token])

    useEffect(() => {
        if(user && job && user.user_id == job.posted_by_recruiter_id){
            console.log("user",user);

            fetchApplications()
        }
    },[fetchApplications,user,job])

    const filteredApplications = filterStatus === "All" ? jobApplications : jobApplications.filter(app => app.status === filterStatus)

    const updateApplicationStatus = async (applicationId: number) => {
        if(value.trim() === ""){
            toast.error("Please enter a value")
            return
        }
        try {
            const {data} = await axios.put(`${job_service}/api/job/applications/update/${applicationId}`,{
                status: value
            },{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(data.message)
            fetchApplications()
        } catch (error) {
            console.error("Error updating application status:", error);
            toast.error("Failed to update application status. Please try again later.");
        }
    }


  return (
    <div className='min-h-screen bg-secondary/30'>
        {
            loading ? <Loading /> :<>
            {
                job && <div className="max-w-5xl mx-auto px-4 py-8">
                    <Button variant={"ghost"} className='mb-6' gap-2 onClick={() => router.back()}>
                        <ArrowLeft size={18}/> Back to Jobs
                    </Button>

                    <Card className='overflow-hidden shadow-lg border-2 mb-6'>
                        <div className="bg-blue-600 p-8 border-b">
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${job.is_active ? 'bg-green-100 dark:bg-green-900 text-green-600' : 'bg-red-1100 dark:bg-red-800/30 text-red-600'}`}>
                                            {job.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                                        {job.title}
                                    </h1>
                                    <div className="flex items-center gap-2 text-base opacity-70 mb-2">
                                        <Building2 size={18}/>
                                        <span className='text-white'>{job.company_name || 'Company Name'}</span>
                                    </div>
                                </div>
                                {
                                    user && user.role === 'jobseeker' && <div className="shrink-0">
                                        {
                                            applied ? <Button disabled className='text-green-100 bg-green-400 dark:text-green-300 dark:bg-green-900/30 '><CheckCircle2 size={20}/> Applied</Button> : <>
                                                {
                                                    job.is_active ? <Button onClick={applyHandler} disabled={btnLoading}>{btnLoading ? "Applying..." : "Apply Now"}</Button> : <Button disabled>Job Inactive</Button>
                                                }
                                            </>
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                        {/** details */}
                        <div className="p-8">
                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                <div className="flex items-center gap-3 p-4 rounded-lg border bg-background">
                                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                        <MapPin size={18} className='text-blue-600'/>
                                    </div>
                                        <div className="">
                                            <p className="text-xs opacity-70 font-medium mb-1">
                                                Location
                                            </p>
                                            <p className="text-sm font-medium">
                                                {job.location}
                                            </p>
                                        
                                        </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 rounded-lg border bg-background">
                                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                        <DollarSign size={18} className='text-blue-600'/>
                                    </div>
                                        <div className="">
                                            <p className="text-xs opacity-70 font-medium mb-1">
                                                Salary
                                            </p>
                                            <p className="text-sm font-medium">
                                                ${job.salary} PA
                                            </p>
                                        
                                        </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 rounded-lg border bg-background">
                                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                        <Users size={18} className='text-blue-600'/>
                                    </div>
                                        <div className="">
                                            <p className="text-xs opacity-70 font-medium mb-1">
                                                Openings
                                            </p>
                                            <p className="text-sm font-medium">
                                                {Math.floor(job.openings)} positions
                                            </p>
                                        </div>
                                </div>

                                {/** job description */}
                                <div className="space-y-4 md:col-span-3 min-w-0" >
                                    <h2 className='text-2xl font-bold flex items-center gap-2'>
                                        <Briefcase size={24} className='text-blue-600'/>
                                        Job Description
                                    </h2>
                                    <div className="p-6 rounded-lg border bg-secondary">
                                        <p className="text-base leading-relaxed whitespace-pre-line">
                                        {job.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            }
            </>
        }

        {user && user.user_id === job?.posted_by_recruiter_id && 
            <div className="w-[90%] md:w-2/3 container mx-auto my-8">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <h2 className="text-2xl font-bold">All Applications</h2>
                    <div className="flex items-center gap-2">
                        <label  htmlFor="statusFilter" className="text-sm font-medium">Filter by Status:</label>
                        <select id="statusFilter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border-2 rounded-md bg-background">
                            <option value="All">All</option>
                            <option value="Submitted">Submitted</option>
                            <option value="Hired">Hired</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                </div>
                {
                    filteredApplications && filteredApplications.length > 0 ? <>
                    <div className="space-y-4">
                        {
                            filteredApplications.map((app,idx)=>(
                                <div key={idx} className="p-4 rounded-lg border bg-background">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${app.status === 'Hired' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : app.status === 'Rejected' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600' : 'bg-yellow-100 dark:bg:yellow:900/30 text-yellow-600' }`}>
                                            {app.status}
                                        </span>
                                    </div>
                                    <div className="flex gap-3 mb-3">
                                        <Link target='_blank' href={app.resume} className='text-blue-500 hover:underline text-sm'>
                                         View Resume
                                        </Link>

                                        <Link target='_blank' href={`/account/${app.applicant_id}`} className='text-blue-500 hover:underline text-sm'>
                                        View Profile
                                        </Link>
                                    </div>
                                    {/** update status */}
                                    <div className="flex gap-2 pt-3 border-t">
                                        <select value={value} onChange={(e) => setValue(e.target.value)} className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-md bg-background">
                                            <option value="">Select Status</option>
                                            <option value="Submitted">Submitted</option>
                                            <option value="Hired">Hired</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                        <Button onClick={() => updateApplicationStatus(app.application_id)} disabled={value === ""}>
                                            Update Status
                                        </Button>
                                    </div>
                                        
                                </div>
                            ))
                        }
                    </div>
                    </> : <>
                    <p className="text-muted-foreground">
                        No applications found.
                    </p>
                    </>
                }
            </div>
        }
    </div>
  )
}

export default JobPage