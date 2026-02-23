import mongoose from 'mongoose';
import Resume from '../models/Resume.js';
import LearningPath from '../models/LearningPath.js';
import extractText from '../ocr/ocr.service.js';
import { cleanText } from '../services/textCleaner.service.js';
import { extractSkills } from '../services/skillExtractor.service.js';
import { compareResumes } from '../services/resumeComparison.service.js';
import { generateOrUpdatePath } from '../services/learningPathGenerator.service.js';
import { calculateATSScore } from '../services/atsService.js';


/**
 * Handles the upload and processing of a new resume.
 * This is the core logic that transforms a file into a digital profile.
 */
export const uploadResume = async (req, res) => {
    try {
        // 1. Basic check: Ensure a file was actually sent
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // 2. OCR Step: Extract raw text from the PDF or Image
        const rawText = await extractText(req.file.buffer, req.file.mimetype);

        // 3. Cleaning: Remove weird characters and format the text for AI
        const cleanedText = cleanText(rawText);

        // 4. Intelligence: AI identifies skills, projects, and education from the text
        const { skills, projects, education, certifications, experienceLevel } = extractSkills(cleanedText);

        // 5. User Context: Identify which user profile this belongs to
        // Security: Prioritize authenticated user's ID
        const profileId = req.user ? req.user._id : (req.body.profileId || req.query.profileId);

        let version = 1;
        let targetRole = "";
        let prevExperienceLevel = "";
        let prevTimeAvailability = "10";



        // 6. Versioning: If this user has uploaded before, increment the version number
        if (profileId) {
            const latestResume = await Resume.findOne({ profileId })
                .sort({ version: -1 });

            if (latestResume) {
                version = latestResume.version + 1;
                targetRole = latestResume.targetRole || "";
                prevExperienceLevel = latestResume.experienceLevel || "";

                // Carry over the previous roadmap settings to keep things consistent
                const prevPath = await LearningPath.findOne({ resumeId: latestResume._id });
                if (prevPath) {
                    targetRole = targetRole || prevPath.targetRole;
                    prevTimeAvailability = prevPath.timeAvailability || "10";
                }

                // Mark older resumes as inactive so the dashboard stays clean
                await Resume.updateMany(
                    { profileId, isActive: true },
                    { $set: { isActive: false } }
                );
            }
        }

        // 7. Database: Save the new resume record
        const savedResume = await Resume.create({
            fileName: req.file.originalname,
            ocrText: cleanedText,
            skills,
            projects,
            education,
            certifications,
            experienceLevel: experienceLevel || prevExperienceLevel || 'Unknown',
            targetRole,
            profileId: profileId || undefined,
            version,
            isActive: true,
            createdAt: new Date()
        });

        // 8. ATS Score: Use AI to give professional feedback and a job-readiness score
        let atsData = { score: 75, feedback: [] };
        try {
            atsData = await calculateATSScore(cleanedText, targetRole || "Software Developer");
            savedResume.atsScore = atsData.score;
            savedResume.atsFeedback = atsData.feedback;
            await savedResume.save();
        } catch (atsErr) {
            console.warn("ATS Calculation failed:", atsErr.message);
        }

        // 9. Roadmap: Automatically update the learning path if the user's role is known
        let pathData = null;
        if (targetRole) {
            try {
                pathData = await generateOrUpdatePath({
                    resumeId: savedResume._id,
                    targetRole,
                    experienceLevel: experienceLevel || prevExperienceLevel,
                    timeAvailability: prevTimeAvailability
                });
            } catch (pathErr) {
                console.warn("Failed to auto-update learning path:", pathErr.message);
            }
        }

        // 10. Success: Return the results to the frontend
        return res.status(200).json({
            success: true,
            resumeId: savedResume._id,
            version: savedResume.version,
            isActive: savedResume.isActive,
            pathUpdated: !!pathData,
            text: cleanedText,
            extractedData: {
                skills,
                projects,
                education,
                certifications,
                experienceLevel
            }
        });

    } catch (error) {
        // Global Error Handler
        return res.status(500).json({
            success: false,
            message: error.message || 'Error processing the resume file'
        });
    }
};

export const compareResumeVersions = async (req, res) => {
    try {
        const { oldResumeId, newResumeId } = req.query;

        if (!oldResumeId || !newResumeId) {
            return res.status(400).json({
                success: false,
                message: 'Both oldResumeId and newResumeId are required'
            });
        }

        if (!mongoose.Types.ObjectId.isValid(oldResumeId) || !mongoose.Types.ObjectId.isValid(newResumeId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid resume ID format'
            });
        }

        const oldResume = await Resume.findById(oldResumeId);
        const newResume = await Resume.findById(newResumeId);

        if (!oldResume || !newResume) {
            return res.status(404).json({
                success: false,
                message: 'One or both resumes not found'
            });
        }

        const comparison = compareResumes(oldResume, newResume);

        return res.status(200).json({
            success: true,
            comparison
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Error comparing resumes'
        });
    }
};


export const getAllResumes = async (req, res) => {
    try {
        let query = {};

        // Security: Enforce user-scoped access
        if (req.user && req.user._id) {
            query.profileId = req.user._id;
        } else if (req.query.profileId) {
            query.profileId = req.query.profileId;
        }

        // Prevent returning all resumes if no filter is applied
        if (Object.keys(query).length === 0) {
            return res.status(200).json({ success: true, resumes: [] });
        }

        const resumes = await Resume.find(query).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            resumes
        });

    } catch (error) {
        console.error("Error fetching resumes:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};



