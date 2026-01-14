import getAIResponse from "../configs/ai.js";
import ai from "../configs/ai.js";
import resumeModel from "../models/resume.model.js";
// controller for enhancing a resume's professional summary 
// POST: /api/ai/enhance-pro-sum

export const enhanceProfessionalSummary = async (req, res) => {
    try {
        const { userContent } = req.body;
        if (!userContent) return res.status(400).json({
            message: 'Mising required fields'
        })

        const systemPrompt = "You are an expert in resume writing . Your task is to enhance the professional  summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience and career objectives. Make it compelling and ATS-friendly. and only return text no options or anything else."

        const enhancedContent = await getAIResponse(userContent, systemPrompt)
        return res.status(200).json({ enhancedContent })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

// controller for enhancing a resum's job description
// POST: /api/ai/enhance-job-desc

export const enhanceJobDescription = async (req, res) => {
    try {
        const { userContent } = req.body;
        console.log(userContent);
        if (!userContent) return res.status(400).json({
            message: 'Mising required fields'
        })

        const systemPrompt = "You are an expert in resume writing . Your task is to enhance the job description of a resume. The job description should be 1-2 sentences also highlighting key responsibilities and achievements. Use action verbs and quantifiable results where possible.Make it ATS-friendly.And only return tet no options or anything else"

        const enhancedContent = await getAIResponse(userContent, systemPrompt)
        return res.status(200).json({ enhancedContent })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}


// controller for uploading a resume to the database
// POST: /api/ai/upload-resume
export const uploadResume = async (req, res) => {
    try {
        const { resumeText, title } = req.body;
        const userId = req.userId;

        if (!resumeText) {
            return res.status(400).json({ message: 'Missing required fields' })
        }
        const systemPrompt = 'You are an expert AI Agent to extract data from resume.';
        const userContent = `extract data from this resume: ${resumeText}
        provide the data in the follwing JSON format with no additional text before or after: 
        {
            professional_summary: {
            type: String,
            default: ''
        },
        skills: [String],
        personal_info: {
            image: { type: String, default: '' },
            full_name: { type: String, default: '' },
            profession: { type: String, default: '' },
            email: { type: String, default: '' },
            phone: { type: String, default: '' },
            location: { type: String, default: '' },
            linkedin: { type: String, default: '' },
            website: { type: String, default: '' },
        },
        experience: [
            {
                company: { type: String },
                position: { type: String },
                start_date: { type: String },
                end_date: { type: String },
                description: { type: String },
                isCurrent: { type: Boolean },
            }
        ],
        projects: [
            {
                name: { type: String },
                type: { type: String },
                description: { type: String },
            }
        ],
        education: [
            {
                instution: { type: String },
                degree: { type: String },
                field: { type: String },
                graduation_date: { type: String },
                gpa: { type: String },
            }
        ]}
        `
        let response = await getAIResponse(userContent, systemPrompt)
        response = response.replace('```json','').replace('```', '');
        // console.log(response)
        const parsedData = await JSON.parse(response);

        console.log(parsedData)

        const newResume = await resumeModel.create({ userId, title, ...parsedData });
        
        return res.json({resumeId: newResume._id})
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

