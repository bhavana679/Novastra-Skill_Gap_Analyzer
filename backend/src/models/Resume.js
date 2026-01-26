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
    education: {
        type: [String],
        default: []
    },
    experienceLevel: {
        type: String,
        default: 'Unknown'
    },
    targetRole: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
