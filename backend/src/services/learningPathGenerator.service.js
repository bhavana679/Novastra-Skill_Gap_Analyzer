import LearningPath from '../models/LearningPath.js';
import Resume from '../models/Resume.js';
import generateBaseSteps from './learningPath.service.js';
import { buildLearningPathPrompt } from '../ai/prompts/learningPath.prompt.js';
import { refineLearningPathWithAI } from './aiLearningPath.service.js';
import { calculateATSScore } from './atsService.js';

/**
 * Service to generate or update a learning path for a given resume and role.
 * 
 * @param {Object} params
 * @param {string} params.resumeId
 * @param {string} params.targetRole
 * @param {string} [params.experienceLevel]
 * @param {string} [params.timeAvailability]
 * @returns {Promise<Object>} The saved learning path document.
 */
export const generateOrUpdatePath = async ({ resumeId, targetRole, experienceLevel, timeAvailability }) => {
    const resume = await Resume.findById(resumeId);
    if (!resume) throw new Error("Resume not found");

    // 1. Get initial missing skills from rule-based engine
    const baseSteps = generateBaseSteps(resume, targetRole);
    const missingSkills = baseSteps.map(s => s.skill);

    // 2. Build AI Prompt
    const prompt = buildLearningPathPrompt({
        targetRole,
        experienceLevel: experienceLevel || resume.experienceLevel || "Beginner",
        timeAvailability: timeAvailability || "10",
        userSkills: resume.skills || [],
        missingSkills: missingSkills // We still pass this as a hint
    });

    // 3. Get Rich Roadmap from AI
    let roadmapData = { steps: [], insight: "", growthFactor: "High" };
    try {
        roadmapData = await refineLearningPathWithAI(prompt, targetRole);
    } catch (aiError) {
        console.error("AI Generation failed, falling back to rule-based:", aiError);
        roadmapData = {
            steps: baseSteps,
            insight: `Mastering these foundational skills is your first step toward becoming a ${targetRole}.`,
            growthFactor: "High"
        };
    }

    const { steps: finalSteps, insight, growthFactor } = roadmapData;

    // 3b. Update Resume Target Role and Recalculate ATS Score
    resume.targetRole = targetRole;
    try {
        const atsData = await calculateATSScore(resume.ocrText, targetRole);
        resume.atsScore = atsData.score;
        resume.atsFeedback = atsData.feedback;
        await resume.save();
    } catch (atsErr) {
        console.warn("ATS recalculation failed during path generation:", atsErr.message);
    }

    // 4. Save to DB (Delete existing for this resume if any)
    await LearningPath.findOneAndDelete({ resumeId });

    // Calculate initial score (completed / total)
    const initialCompleted = finalSteps.filter(s => s.status === 'COMPLETED').length;
    const initialScore = finalSteps.length > 0 ? Math.round((initialCompleted / finalSteps.length) * 100) : 0;

    const newLearningPath = new LearningPath({
        resumeId,
        targetRole,
        experienceLevel: experienceLevel || resume.experienceLevel || "Beginner",
        timeAvailability: timeAvailability || "10",
        steps: finalSteps,
        insight: insight,
        growthFactor: growthFactor,
        scoreHistory: [{ score: initialScore, date: new Date() }]
    });

    return await newLearningPath.save();
};

export default {
    generateOrUpdatePath
};
