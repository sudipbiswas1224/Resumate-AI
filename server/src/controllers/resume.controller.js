import imagekit from "../configs/imageKit.js";
import resumeModel from "../models/resume.model.js";
import fs from 'fs'



// controller for creating a new resume
// POST : /api/resumes/create


export const createResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { title } = req.body;

        //create new resume
        const newResume = await resumeModel.create({ userId, title });

        // return success message 
        return res.status(201).json({
            message: "Resume created successfully",
            resume: newResume
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

// controller for deleting a resume
// DELETE: /api/resumes/delete

export const deleteResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;

        await resumeModel.findOneAndDelete({ userId, _id: resumeId });

        //return success message 
        return res.status(200).json({
            message: 'Resume Deleted Successfully'
        })

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// controller for getting user Resume by id 
// GET: /api/resumes/get

export const getResumeById = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;

        const resume = await resumeModel.findOne({ userId, _id: resumeId });
        if (!resume) {
            return res.status(404).json({
                message: "Resume not found"
            })
        }

        // modify the resume
        resume.__v = undefined;
        resume.createAt = undefined;
        resume.updateAt = undefined;

        // return the resume
        return res.status(200).json({ resume })
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// controller for getting resume by id public
// GET: /api/resumes/public

export const getPublicResumeById = async (req, res) => {
    try {
        const { resumeId } = req.params;

        const resume = await resumeModel.findOne({ public: true, _id: resumeId });
        if (!resume) {
            return res.status(404).json({
                message: "Resume not found"
            })
        }

        return res.status(200).json({ resume });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}


// controller for updating a resume 
// PUT: /api/resumes/update

export const updateResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId, resumeData, removeBackground } = req.body;
        const image = req.file;
        let resumeDataCopy;
        if(typeof resumeData === 'string'){
            resumeDataCopy = JSON.parse(resumeData);
        }else {
            resumeDataCopy = structuredClone(resumeData);
        }

        // image url generation with imagekit and saving it in the resumeData
        if (image) {
            const imageBufferData = fs.createReadStream(image.path);
            const response = await imagekit.files.upload({
                file: imageBufferData,
                fileName: 'resume.png',
                folder: 'user-resumes',
                transformation: {
                    pre: 'w-300,h-300,fo-face,z-0.75' + (removeBackground ? ',e-bgremove' : '')
                }
            });
            console.log(response)
            // updating the image url in the personal_info of a user
            resumeDataCopy.personal_info.image = response.url;

        }
        // updating resume in db and getting the updated resume 
        const resume = await resumeModel.findByIdAndUpdate({ userId, _id: resumeId }, resumeDataCopy, { new: true });
        if (!resume) {
            return res.status(404).json({
                message: "Resume not found"
            })
        }

        // send successful message 
        return res.status(200).json({
            message: "Resume saved successfully",
            resume
        });



    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}



