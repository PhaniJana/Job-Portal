'use client'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { job_service, useAppData } from '@/context/AppContext';
import axios from 'axios';
import { Company, Job } from '@/type';
import Loading from '@/components/loading';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Briefcase, Building2, CheckCircle, Clock, DollarSign, Edit, Eye, FileText, Globe, Laptop, MapPin, Plus, User, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
const CompanyPage = () => {
    const {id} = useParams();
    const token = Cookies.get('token'); 
    const {isAuth,user} = useAppData();
    const [loading, setLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);
    const [company, setCompany] = useState<Company | null>(null);
    const [isAddModelOpen, setIsAddModelOpen] = useState(false);
    const [isUpdateModelOpem, setIsUpdateModelOpem] = useState(false);
    const [selectJob, setSelectJob] = useState<Job| null>(null);


    const [title, setTitle] = useState("")
    const [description, setDescription] = useState('')
    const [role,setRole] = useState('')
    const [location, setLocation] = useState('')
    const [openings, setOpenings] = useState(0);
    const [job_type, setjob_type] = useState('')
    const [work_location, setWork_location] = useState('')
    const [is_active, setIs_active] = useState(true)
    const [salary, setSalary] = useState('');

    const ClearInput=()=>{
        setTitle('');
        setDescription('');
        setRole('');
        setLocation('');
        setOpenings(0);
        setjob_type('');
        setWork_location('');
        setIs_active(true);
        setSalary('');
    }

    const addJobHandler = async() => {
        setBtnLoading(true);
        try {
            const jobData = {
                title,
                description,
                role,
                salary,
                location,
                openings,
                job_type,
                work_location,
                company_id : id,
            };
            await axios.post(`${job_service}/api/job/new`, jobData, {headers:{Authorization: `Bearer ${token}`}});
            toast.success('Job added successfully');
            ClearInput();
            fetchCompany();
            setIsAddModelOpen(false);

        } catch (error) {
            toast.error('Failed to add job');
            console.error('Error adding job:', error);
        } finally {
            setBtnLoading(false);
        }
    }

    
    const fetchCompany = async () => {
        setLoading(true);
        try {
            const {data} = await axios.get(`${job_service}/api/job/company/${id}`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCompany(data);
        } catch (error) {
            console.error('Error fetching company:', error);
        } finally {
            setLoading(false);
        }
    }


    const handleOpenUpdateModal = (job: Job) => {
        setSelectJob(job);
        setTitle(job.title);
        setDescription(job.description);
        setRole(job.role);
        setLocation(job.location);
        setSalary(job.salary);
        setOpenings(job.openings);
        setjob_type(job.job_type);
        setWork_location(job.work_location);
        setIs_active(job.is_active);
        setIsUpdateModelOpem(true);
    }

    const handleCloseUpdateModal = () => {
        setSelectJob(null);
        ClearInput();
        setIsUpdateModelOpem(false);
    }

    const handleCloseAddModal = () => {
        ClearInput();
        setIsAddModelOpen(false);
    }

    const updateJobHandler = async() => {
        if(!selectJob) return;
        setBtnLoading(true);
        try {
            const updatedJobData = {
                title,
                description,
                role,
                salary,
                location,
                openings,
                job_type,
                work_location,
                is_active,
            };
            await axios.put(`${job_service}/api/job/update/${selectJob.job_id}`, updatedJobData, {headers:{Authorization: `Bearer ${token}`}});
            toast.success('Job updated successfully');
            ClearInput();
            fetchCompany();
            handleCloseUpdateModal();
        } catch (error) {
            toast.error('Failed to update job');
            console.error('Error updating job:', error);
        } finally {
            setBtnLoading(false);
        }
    }

    useEffect(() => {         
        fetchCompany();
    }, [id])
    if(loading) return <Loading/>

    const isRecruiterOwner = user && company && user.user_id === company.recruiter_id;
    

    
  return (
    <div className='min-h-screen bg-secondary/30'>
        {
            company && <div className="max-w-6xl mx-auto px-4 py-8">
                <Card className='overflow-hidden shadow-lg border-2 mb-8'>
                    <div className="h-32 bg-blue-600"></div>
                    <div className="px-8 pb-8">
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16">
                            <div className="w-32 h-32 rounded-2xl border-4 border-background overflow-hidden shadow-xl bg-background shrink-0">
                                <img src={company.logo} alt='' className='w-full h-full object-cover'/>
                            </div>
                            <div className="flex-1 md:mb-4">
                                <h1 className='text-3xl font-bold mb-2'>
                                    {company.name}
                                </h1>
                                <p className="text-base leading-relaxed opacity-80 max-w-3xl">
                                    {company.description}
                                </p>
                            </div>
                            <Link href={company.website} target='_blank' className='md:mb-4'>
                                <Button className='gap-2'>
                                    <Globe />
                                    Visit Website
                                </Button>
                            </Link>
                        </div>
                    </div>

                </Card>

                <Card className='shadow-lg border-2 overflow-hidden'>
                    <div className="bg-blue-600 border-b p-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                    <Briefcase size={20} className="text-blue-600" /> 
                                </div>
                            </div>
                            <h2 className='text-2xl font-bold text-white'>Open Positions</h2>
                            <p className="text-sm opacity-70 text-white">{company.jobs?.length || 0} position{company.jobs?.length !== 1 ? 's' : ''} available </p>
                        </div>
                    </div>
                    {isRecruiterOwner && <Dialog open={isAddModelOpen} onOpenChange={setIsAddModelOpen}>
                        <DialogTrigger asChild>
                            <Button className='m-4'> <Plus size={18}/> Add New Job</Button>
                        </DialogTrigger>
                        <DialogContent className='max-h-[85vh] max-w-[90vw] overflow-y-auto sm:max-w-150'>
                            <DialogHeader>
                                <DialogTitle className='text-2xl flex items-center gap-2'>Add New Job</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-5 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className='text-sm font-medium flex-center gap-2'><Briefcase size={16}/> Job Title</Label>
                                    <Input id='title' type='text' placeholder='Enter job title' className='h-11' value={title} onChange={(e)=>setTitle(e.target.value)}/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description" className='text-sm font-medium flex-center gap-2'><FileText size={16}/> Job Description</Label>
                                    <Input id='description' type='text' placeholder='Enter company description' className='h-11' value={description} onChange={(e)=>setDescription(e.target.value)}/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role" className='text-sm font-medium flex-center gap-2'><Building2 size={16}/> Role/Department</Label>
                                    <Input id='role' type='text' placeholder='Enter role/department' className='h-11' value={role} onChange={(e)=>setRole(e.target.value)}/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="salary" className='text-sm font-medium flex-center gap-2'><DollarSign size={16}/> Salary</Label>
                                    <Input id='salary' type='text' placeholder='Enter salary' className='h-11' value={salary} onChange={(e)=>setSalary(e.target.value)}/>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="openings" className='text-sm font-medium flex-center gap-2'><User size={16}/> Openings</Label>
                                    <Input id='openings' type='number' placeholder='Enter number of openings' className='h-11' value={openings} onChange={(e)=>setOpenings(parseInt(e.target.value) || 0)}/>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location" className='text-sm font-medium flex-center gap-2'><MapPin size={16}/> Location</Label>
                                    <Input id='location' type='text' placeholder='Enter location' className='h-11' value={location} onChange={(e)=>setLocation(e.target.value)}/>
                                </div>
                                {/**Selections */}
                                <div className="grid md:grid-cols-2 gap-4">

                                    {/** Job Type Selection */}
                                    <div className="space-y-2">
                                        <Label htmlFor='job_type' className='text-sm font-medium flex-center gap-2'><Clock size={16}/> Job Type</Label>
                                        <Select value = {job_type} onValueChange={(value)=>setjob_type(value)}>
                                            <SelectTrigger className='h-11'>
                                                <SelectValue placeholder='Select job type' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='Full-time'>Full-time</SelectItem>
                                                <SelectItem value='Part-time'>Part-time</SelectItem>
                                                <SelectItem value='Contract'>Contract</SelectItem>
                                                <SelectItem value='Internship'>Internship</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                        {/** Work Location Selection */}
                                    <div className="space-y-2">
                                        <Label htmlFor='work_location' className='text-sm font-medium flex-center gap-2'><Laptop size={16}/> Work Location</Label>
                                        <Select value = {work_location} onValueChange={(value)=>setWork_location(value)}>
                                            <SelectTrigger className='h-11'>
                                                <SelectValue placeholder='Select work location' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='On-site'>On-site</SelectItem>
                                                <SelectItem value='Remote'>Remote</SelectItem>
                                                <SelectItem value='Hybrid'>Hybrid</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button disabled={btnLoading} variant={'outline'} onClick={handleCloseAddModal}>Close</Button>
                                </DialogClose>
                                <Button disabled={btnLoading} onClick={addJobHandler}>{btnLoading ? 'Adding...' : 'Add Job'}</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>}
                </Card>

                    <div className="p-6">
                        {
                            company.jobs && company.jobs.length > 0 ? <div className="space-y-4">
                                {
                                    company.jobs.map((job,index)=>(
                                        <div className="p-5 rounded-lg border-2 hover:border-blue-500 transition-all bg-background" key={index}>
                                            <div className="flex justify-between items-start gap-4 flex-wrap">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                                                        <h3 className="text-xl font-semibold">
                                                            {job.title}
                                                        </h3>
                                                        <span className={`text-xs px-3 py-1 rounded-full flex items-center justify-center gap-1 ${job.is_active ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-600'}`}>
                                                            {job.is_active ? <CheckCircle size={14}/> : <XCircle size={14}/>} {job.is_active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
                                                        <div className="flex items-center gap-2 opacity-70">
                                                            <Building2 size={14}/>
                                                            <span>{job.role}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 opacity-70">
                                                            <DollarSign size={14}/>
                                                            <span>{job.salary ? `$${job.salary}` : 'Not specified'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 opacity-70">
                                                            <MapPin size={14}/>
                                                            <span>{job.location} ({job.work_location})</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 opacity-70">
                                                            <User size={14}/>
                                                            <span>{job.openings} Opening{job.openings !== 1 ? 's' : ''}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/job/${job.job_id}`}>
                                                        <Button variant={'outline'} size={'sm'} className='gap-1'>
                                                            <Eye size={16}/>
                                                            View Details
                                                        </Button>
                                                    </Link>
                                                    {
                                                        isRecruiterOwner && <>
                                                        <Button variant={'outline'} size={'sm'} className='gap-1' onClick={()=>handleOpenUpdateModal(job)}>
                                                            <Edit size={16}/>
                                                            Edit Job
                                                        </Button>
                                                        
                                                        </>
                                                    }

                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div> :<>
                                <div className="text-center py-12">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800">
                                        <Briefcase size={24} className="text-gray-600" />
                                    </div>
                                    <h2 className="text-base font-semibold mt-4">No job postings yet</h2>
                                    </div>
                                
                            </>
                        }
                    </div>
                    
                <Dialog open={isUpdateModelOpem} onOpenChange={(open) => !open ? handleCloseUpdateModal() : setIsUpdateModelOpem(open)}>
                        <DialogContent className='max-h-[85vh] max-w-[90vw] overflow-y-auto sm:max-w-150'>
                                <DialogHeader>
                                    <DialogTitle className='text-2xl flex items-center gap-2'>Update Job</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-5 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className='text-sm font-medium flex-center gap-2'><Briefcase size={16}/> Job Title</Label>
                                        <Input id='title' type='text' placeholder='Enter job title' className='h-11' value={title} onChange={(e)=>setTitle(e.target.value)}/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description" className='text-sm font-medium flex-center gap-2'><FileText size={16}/> Company Description</Label>
                                        <Input id='description' type='text' placeholder='Enter company description' className='h-11' value={description} onChange={(e)=>setDescription(e.target.value)}/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="role" className='text-sm font-medium flex-center gap-2'><Building2 size={16}/> Role/Department</Label>
                                        <Input id='role' type='text' placeholder='Enter role/department' className='h-11' value={role} onChange={(e)=>setRole(e.target.value)}/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="salary" className='text-sm font-medium flex-center gap-2'><DollarSign size={16}/> Salary</Label>
                                        <Input id='salary' type='text' placeholder='Enter salary' className='h-11' value={salary} onChange={(e)=>setSalary(e.target.value)}/>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="openings" className='text-sm font-medium flex-center gap-2'><User size={16}/> Openings</Label>
                                        <Input id='openings' type='number' placeholder='Enter number of openings' className='h-11' value={openings} onChange={(e)=>setOpenings(parseInt(e.target.value) || 0)}/>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="location" className='text-sm font-medium flex-center gap-2'><MapPin size={16}/> Location</Label>
                                        <Input id='location' type='text' placeholder='Enter location' className='h-11' value={location} onChange={(e)=>setLocation(e.target.value)}/>
                                    </div>
                                    {/**Selections */}
                                    <div className="grid md:grid-cols-2 gap-4">

                                        {/** Job Type Selection */}
                                        <div className="space-y-2">
                                            <Label htmlFor='job_type' className='text-sm font-medium flex-center gap-2'><Clock size={16}/> Job Type</Label>
                                            <Select value = {job_type} onValueChange={(value)=>setjob_type(value)}>
                                                <SelectTrigger className='h-11'>
                                                    <SelectValue placeholder='Select job type' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value='Full-time'>Full-time</SelectItem>
                                                    <SelectItem value='Part-time'>Part-time</SelectItem>
                                                    <SelectItem value='Contract'>Contract</SelectItem>
                                                    <SelectItem value='Internship'>Internship</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                            {/** Work Location Selection */}
                                        <div className="space-y-2">
                                            <Label htmlFor='work_location' className='text-sm font-medium flex-center gap-2'><Laptop size={16}/> Work Location</Label>
                                            <Select value = {work_location} onValueChange={(value)=>setWork_location(value)}>
                                                <SelectTrigger className='h-11'>
                                                    <SelectValue placeholder='Select work location' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value='On-site'>On-site</SelectItem>
                                                    <SelectItem value='Remote'>Remote</SelectItem>
                                                    <SelectItem value='Hybrid'>Hybrid</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="is_active" className='text-sm font-medium flex-center gap-2'><CheckCircle size={16}/> Active Status</Label>
                                        <Select value={is_active ? 'active' : 'inactive'} onValueChange={(value)=>setIs_active(value === 'active')}>
                                            <SelectTrigger className='h-11'>
                                                <SelectValue placeholder='Select status' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='active'>Active</SelectItem>
                                                <SelectItem value='inactive'>Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>

                                    </div>


                                </div>
                                <DialogFooter>
                                        <DialogClose asChild>
                                            <Button disabled={btnLoading} variant={'outline'} onClick={handleCloseUpdateModal}>Close</Button>
                                        </DialogClose>
                                        <Button disabled={btnLoading} onClick={updateJobHandler}>{btnLoading ? 'Updating...' : 'Update Job'}</Button>
                                    </DialogFooter>
                            </DialogContent>
                </Dialog>
            </div>
            
        }
        
    </div>
  )
}

export default CompanyPage
