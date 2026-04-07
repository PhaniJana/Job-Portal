"use client"
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { useAppData } from '@/context/AppContext';
import { AccountProps } from '@/type'
import { Award, Plus, Sparkle, X } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Skills: React.FC<AccountProps> = ({user,isYourAccount}) => {
    const [skill, setSkill] = useState("");
    const {AddSkill,removeSkill,btnLoading} = useAppData();
    const addSkillHandler = ()=>{
        if(!skill.trim()){
            toast.error("Please enter a skill");
            return;
        }
        AddSkill(skill);
        setSkill("");
    }
    const HandleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>)=>{
        if(e.key === "Enter"){
            addSkillHandler();
        }
    }
    const removeSkillHandler = (skill: string)=>{
        if(confirm(`Are you sure you want to remove ${skill} from your skills?`)){
            removeSkill(skill);
        }
    }
    return (
        <div className='max-w-5xl mx-auto px-4 py-6'>
            <Card className='shadow-lg border-2 overflow-hidden'>
                <div className="bg-blue-500 p-6 border-b">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <Award size={20} className='text-blue-600'/>
                        </div>
                         <CardTitle className='text-2xl'>{isYourAccount ? "Your Skills" : ` ${user.name}'s Skills`}</CardTitle>
                    {
                        isYourAccount && <CardDescription className='text-sm mt-1 text-white'>Manage your skills and expertise.</CardDescription>
                    }
                    </div>
                </div>
                {/* Add skill */}
                {
                    isYourAccount && <div className="flex gap-3 flex-col sm:flex-row p-4">
                        <div className="relative flex-1">
                            <Sparkle size={18} className='absolute top-1/2 left-3 -translate-y-1/2 opacity-50'/>
                            <Input type="text" placeholder='Add a skill (e.g. JavaScript, Python)' className='h-11 pl-10 bg-background' value={skill} onChange={e=>setSkill(e.target.value)} onKeyDown={HandleKeyPress}   /> 
                        </div>
                        <Button onClick={addSkillHandler} disabled={!skill.trim() || btnLoading} className='h-11 w-full sm:w-auto'><Plus size={18}/>{btnLoading ? "Adding..." : "Add Skill"}</Button>
                    </div>
                }
                {/* Skills List */}
                <CardContent className='p-6'>
                    {
                        user.skills && user.skills.length > 0 ? <div className="flex flex-wrap gap-3">
                            {
                                user.skills.map((skill, index) => (
                                    <div key={index} className="group relative inline-flex pl-4 pr-3 py-2 rounded-full items-center justify-center hover:shadow-sm duration-200 transition-all gap-2 border">
                        
                                        <span className='font-medium text-sm'>{skill}</span>
                                        {
                                            isYourAccount && <button onClick={() => removeSkillHandler(skill)} className='h-6 w-6 rounded-full text-red-500 flex items-center justify-center transition-all hover:bg-gray-600 hover:scale(1.05)'><X size={14}/></button>
                                        }
                                    </div>
                                ))
                            }
                        </div> : <></>
                    }
                </CardContent>
            </Card>
        </div>
    )
}

export default Skills