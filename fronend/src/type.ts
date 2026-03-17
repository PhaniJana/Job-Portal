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

export const utils_service = 'http://localhost:3005'