import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true,
    },
    ocrText: {
        type: String,
        required: true,
    },
    skills: {
        type: [String],
        default: []
    },
    projects: [
        {
            title: String,
            description: String,
            githubLink: String,
            demoLink: String
        }
    ],
    education: {
        type: [String],
        default: []
    },
    certifications: [
        {
            name: String,
            link: String
        }
    ],
    experienceLevel: {
        type: String,
        default: 'Unknown'
    },
    targetRole: {
        type: String,
        default: ''
    },
    profileId: {
        type: String,
        required: false,
        index: true
    },
    version: {
        type: Number,
        default: 1
    },
    isActive: {
        type: Boolean,
        default: true
    },
    atsScore: {
        type: Number,
        default: 0
    },
    atsFeedback: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
