import mongoose from 'mongoose';

const learningPathSchema = new mongoose.Schema({
    resumeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume',
        required: true
    },
    targetRole: {
        type: String,
        required: true
    },
    experienceLevel: {
        type: String,
        default: 'Beginner'
    },
    timeAvailability: {
        type: String,
        default: '10'
    },
    insight: {
        type: String,
        default: "Your learning path is optimized for career growth. Every skill you master brings you closer to your goal."
    },
    growthFactor: {
        type: String,
        default: "High"
    },
    steps: [
        {
            skill: {
                type: String,
                required: true
            },
            level: {
                type: String,
                enum: ['Beginner', 'Intermediate', 'Advanced'],
                required: true
            },
            order: {
                type: Number,
                required: true
            },
            status: {
                type: String,
                enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'],
                default: 'NOT_STARTED'
            },
            estimatedTime: {
                type: String,
                default: "1 week"
            },
            reason: {
                type: String,
                default: "Essential for this role."
            },
            microTopics: [String],
            resources: [{
                title: String,
                type: { type: String },
                url: String
            }],
            updatedAt: {
                type: Date,
                default: null
            }
        }
    ],
    scoreHistory: [
        {
            score: Number,
            date: { type: Date, default: Date.now }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const LearningPath = mongoose.model('LearningPath', learningPathSchema);

export default LearningPath;
