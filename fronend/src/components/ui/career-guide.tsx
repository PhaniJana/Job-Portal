'use client'
import { CareerGuideResponse, utils_service } from '@/type'
import axios from 'axios'
import {  ArrowRight, BookOpen, Briefcase, Lightbulb, Loader2, Sparkles, Target, TrendingUp, X } from 'lucide-react'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from './dialog'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'

const CareerGuide = () => {
    const [open, setOpen] = useState(false)
    const [skills, setSkills] = useState<string[]>([])
    const [currentSkill,setCurrentSkill] = useState('')
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState<CareerGuideResponse | null>(null)

    const addSkill=()=>{
        if(currentSkill.trim() && !skills.includes(currentSkill.trim())){
            setSkills(prev=>[...prev,currentSkill.trim()])
            setCurrentSkill('')
        }
    }
    const removeSkill=(skill:string)=>{
        setSkills(prev=>prev.filter(s=>s!==skill))
    }
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          addSkill();
        }
    }
    const getCareerGuideance = async()=>{
        if(skills.length===0) {
            alert('Please add at least one skill')
            return;
        }
        setLoading(true)
        try {
            const {data} = await axios.post(`${utils_service}/api/utils/career`,{skills})
            setResponse(data)
        } catch (error) {
            console.error('Error fetching career guidance:', error)
            alert('Failed to fetch career guidance. Please try again.')
        }
        finally{
            setLoading(false)
        }                                            
    }
    const resetDialog=()=>{
        setSkills([])
        setCurrentSkill('')
        setResponse(null)
        setOpen(false)
    }
  return (
    <div className='max-w-7xl mx-auto px-4 py-16'>
        <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
            border bg-blue-50 dark:ng-blue-950 mb-4">
                <Sparkles size={16} className='text-blue-600'/>
                <span className="text-sm font-medium text-blue-600">AI powered Career Guide</span>
            </div>
            <h2 className="text-3xl mb-4 font-bold">Discover your career path</h2>
            <p className="text-lg opacity-70 max-w-2xl mx-auto mb-8">Get personalized job recommendations and career insights tailored to your skills.</p>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button size={'lg'} className='gap-2 h-12 px-8'>
                        <Sparkles size={18}/>
                        Get Career Guidance
                        <ArrowRight size={18}/>
                    </Button>
                </DialogTrigger>
                <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
                    {
                        !response ? <> 
                            <DialogHeader>
                                <DialogTitle className='text-2xl flex items-center gap-2'>
                                    Tell us about your skills
                                </DialogTitle>
                                <DialogDescription>
                                    Add the skills you have and we will provide you with personalized career guidance based on them. You can add multiple skills to get better recommendations.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-2">
                                <div className="space-y-2">
                                    <Label htmlFor="skill">Your Skills</Label>
                                    <div className="flex gap-2">
                                        <Input className='h-11' id="skill" placeholder='e.g. JavaScript, Python, Communication' value={currentSkill} onChange={(e)=>setCurrentSkill(e.target.value)} onKeyDown={handleKeyPress}/>
                                        <Button onClick={addSkill}>Add</Button>
                                    </div>
                                </div>
                                {
                                    skills.length>0 && 
                                    <div className="space-y-2">
                                        <Label>Added Skills ({skills.length})</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {
                                                skills.map((skill,index)=>(
                                                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-secondary text-secondary-foreground">
                                                        {skill}
                                                        <X className="h-3.5 w-3.5 cursor-pointer" onClick={()=>removeSkill(skill)}/>
                                                    </span>
                                                ))
                                            }
                                        </div>

                                    </div>
                                }
                                <Button onClick={getCareerGuideance} disabled={loading || skills.length === 0} className='w-full h-11 gap-2'>{loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</> :
                                        <>
                                        <Sparkles size={16} className='mr-2'/> Get Guidance
                                        </>}</Button>
                            </div>
                        </>
                        :
                        <>
                            <DialogHeader>
                                <DialogTitle className='text-2xl flex items-center gap-2'>
                                    <Target size={24} className='text-blue-600'/>
                                        Your Personalized Career Guidance
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6 py-2">
                                {/* ----------SUMMARY------------- */}
                                <div className="p4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-b-blue-200 dark:border-blue-800">
                                    <div className="flex items-start gap-3">
                                        <Lightbulb className='text-blue-600 mt-1 shrink-0' size={20}/>
                                        <div className="">
                                            <h3 className="text-lg font-semibold mb-2">Summary</h3>
                                            <p className="text-sm leading-relaxed opacity-70">{response.summary}</p>
                                        </div>
                                    </div>
                                </div>
                                {/** ----------job options----------- */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><Briefcase size={20} className='text-blue-600'/> Recommended Career Options</h3>
                                    <div className="space-y-3">
                                        {
                                            response.jobOptions.map((job,index)=>(
                                                <div className="p-4 rounded-lg border hover:border-blue-500 transition-colors" key={index}>
                                                    <h4 className="font-semibold text-base mb-2">{job.title}</h4>
                                                    <div className="text-sm space-y-2">
                                                        <div>
                                                            <span className='font-medium opacity-70'>Responsibilities:</span>
                                                            <span className='opacity-80'>{job.responsibilities}</span>
                                                        </div>
                                                        <span className='font-medium opacity-70'>Why this Role:</span>
                                                        <span className='opacity-80'>{job.why }</span>
                                                    </div>
                                                </div>
                                            )

                                            
                                        )
                                        }
                                    </div>
                                </div>
                                {/*-------------SKILLS TO LEARN--------------------*/}
                                <div className="">
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <TrendingUp size={20} className='text-blue-600'/> Skills to Enhance Your Career</h3>
                                        <div className="space-y-4">
                                            {
                                                response.skillsToLearn.map((category,index)=>(
                                                    <div className="space-y-2" key={index}>
                                                        <h4 className="font-semi-bold text-sm text-blue-600">{category.category}</h4>
                                                        <div className="space-y-2">
                                                            {category.skills.map((skill,skillIndex)=>(
                                                                <div className="p-3 rounded-lg bg-secondary border text-sm" key={skillIndex}>
                                                                    <p className='font-medium mb-1'>{skill.title}</p>
                                                                    <p className='text-xs opacity-70 mb-1'>
                                                                        <span className='font-medium'>Why:</span> {skill.why}
                                                                    </p>
                                                                    <p className='text-xs opacity-70 mb-1'>
                                                                        <span className='font-medium'>How:</span> {skill.how}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                </div>
                                    {/**--------------LEARNING APPROACH------------------ */}
                                    <div className='p-4 rounded-lg border bg-blue-950/20 dark:bg-red-950/20'>
                                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                            <BookOpen size={20} className='text-blue-600'/> {response?.learningApproach?.title}
                                        </h3>
                                        <ul className='space-y-2'>{response?.learningApproach?.points.map((points,index)=>(
                                            <li key={index} className='text-xl flex items-start gap-2'>
                                                <span className='text-blue-600 mt-0.5'>•</span>
                                                <span className='opacity-90' dangerouslySetInnerHTML={{__html: points}}></span>
                                            </li>
                                        ))}</ul>
                                    </div>
                                <Button onClick={resetDialog} variant={'outline'} className='w-full h-11 gap-2'><X size={16} className='mr-2'/> Close</Button>
                            </div>

                        </>
                    }
                </DialogContent>
            </Dialog>    
        </div>
    </div>
  )
}

export default  CareerGuide