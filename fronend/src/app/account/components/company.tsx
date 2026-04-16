"use client";

import { job_service, useAppData } from '@/context/AppContext';
import  {   useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loading from '@/components/loading';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Briefcase, Building, Building2, EyeIcon, FileText, Globe, Image, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Company as CompanyType } from '@/type';
import Link from 'next/link';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
const Company = () => {
    const {loading} = useAppData();

    const addRef = useRef<HTMLButtonElement | null>(null);
    const openDialod =()=>{
        addRef.current?.click();
    }
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [logo, setLogo] = useState<File | null>(null);
    const [website, setWebsite] = useState("")
    const [btnLoading, setBtnLoading] = useState(false);
    const [companies, setCompanies] = useState<CompanyType[]>([]);
    const [companyLoading, setCompanyLoading] = useState(false);
    const token = Cookies.get("token");
    const clearData =()=>{
        setName("");
        setDescription("");
        setLogo(null);
        setWebsite("");
    }
    const fetchCompanies = async () => {
            
        setCompanyLoading(true);
        if (!token) {
            console.log("Token not found. Please log in.");
            return;
        }    

        try {
            const { data } = await axios.get(`${job_service}/api/job/company/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCompanies(data);
            } catch (error : any) {
                console.log(error.response?.data || error.message);
            }
            finally{
                setCompanyLoading(false);
            }
        };
    useEffect(() => {

        fetchCompanies();
    }, []);
    const addCompany = async()=>{
        if (!token) {
            console.log("Token not found. Please log in.");
            return;
        }
        if(!name || !description || !website){
            console.log("Please fill all the fields");
            return;
        }
        if(!logo){
            console.log("Please upload a logo");
            return;
        }
        setBtnLoading(true);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("website", website);
        formData.append("file", logo);
        try {
            const { data } = await axios.post(`${job_service}/api/job/company/new`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Company added successfully");
            fetchCompanies();
            clearData();
            
        } catch (error : any) {
            console.log(error.response?.data || error.message);
            toast.error("Failed to add company");
        }finally{
            setBtnLoading(false);
        }
    }
    const deleteCompany = async(id : string)=>{
        if (!token) {
            console.log("Token not found. Please log in.");
            return;
        }
        setBtnLoading(true);
        try {
            const { data } = await axios.delete(`${job_service}/api/job/company/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success(data.message || "Company deleted successfully");
            fetchCompanies();
            
        } catch (error : any) {
            console.log(error.response?.data || error.message);
            toast.error("Failed to delete company");
        }
        finally{
            setBtnLoading(false);
        }
    }
    if(loading) return <Loading/>

  return (
    <div className='max-w-7xl mx-auto px-4 py-6'>
        <Card className='shadow-lg border-2 overflow-hidden'>
            <div className="bg-blue-500 p-6 border-b">
                <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <Building2 size={20} className='text-blue-600'/>
                    </div>
                </div>
                <CardTitle className='text-2xl text-white'>
                    My Companies
                </CardTitle>
                <CardDescription className='text-sm mt-1 text-white'>
                    Manage your registered companies ({companies?.length}/3)
                </CardDescription>
                {companies?.length<3 && (<Button onClick={openDialod} className='gap-2' >
                <Plus/>Add Company
            </Button>)}
            </div>
            
            </div>
            { companyLoading ? (
                    <Loading />
            ) : (
                <div className="p-6">
                    {
                        companies?.length>0 ? <div className="grid grid-cols-1">
                            {
                                companies.map((c,i)=>(
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-lg border-2 hover:border-blue-500 transition-all bg-background">
                                    <div className="h-16 w-16 rounded-full border-full overflow-hidden shrink-0 bg-background">
                                        <img src={c.logo} alt={c.name} className='h-full w-full object-cover'/>
                                    </div>
                                    {/**Company Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-lg mb-1 truncate">
                                            {c.name}
                                        </h3>
                                        <p className="text-sm opacity-70 line-clamp-2 mb-2">
                                            {c.description}
                                        </p>
                                        <a href={c.website} target="_blank"  className="text-blue-500 hover:underline text-xs flex items-center gap-1">
                                            <Globe size={16}/> Visit Website
                                        </a>
                                    </div>
                                    {/**Actions */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Link href={`/company/${c.company_id}`} ><Button variant='outline' size='icon' className='h-9 w-9'>
                                            <EyeIcon size={16} />
                                        </Button>
                                        </Link>
                                        <Button onClick={()=>deleteCompany(c.company_id.toString())} variant='destructive' size='icon' className='h-9 w-9'><Trash2 size={16} /></Button>
                                    </div>
                                </div>
                            ))
                        }
                    </div> : <>
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                            <Building2 size={24} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            No Companies Found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            {`You haven't registered any companies yet.`}
                        </p>
                    </div>
                    </>
                }
            </div>)}
        </Card>
        <Dialog>
            <DialogTrigger asChild>
                <Button className='hidden' ref = {addRef}></Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-137.5'>
                <DialogHeader>
                    <DialogTitle className='text-2xl flex items-center gap-2'>
                        <Building2 className='text-blue-600'/> Add New Company
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-5 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className='text-sm font-medium flex-center gap-2'><Briefcase size={16}/> Company Name</Label>
                        <Input id='name' type='text' placeholder='Enter company name' className='h-11' value={name} onChange={(e)=>setName(e.target.value)}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description" className='text-sm font-medium flex-center gap-2'><FileText size={16}/> Company Description</Label>
                        <Input id='description' type='text' placeholder='Enter company description' className='h-11' value={description} onChange={(e)=>setDescription(e.target.value)}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="website" className='text-sm font-medium flex-center gap-2'><Globe size={16}/> Company Website</Label>
                        <Input id='website' type='text' placeholder='Enter company website' className='h-11' value={website} onChange={(e)=>setWebsite(e.target.value)}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="logo" className='text-sm font-medium flex-center gap-2'><Image size={16}/> Company Logo</Label>
                        <Input id='logo' type='file' placeholder='Upload company logo' accept='image/*' className='h-11 cursor-pointer' onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setLogo(e.target.files?.[0] || null)}/>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={addCompany} disabled={btnLoading} className='gap-2 w-full'>
                        {btnLoading ? 'Adding...' : 'Add Company'}
                    </Button>
                </DialogFooter> 
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default Company
