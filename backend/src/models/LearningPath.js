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
            updatedAt: {
                type: Date,
                default: null
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const LearningPath = mongoose.model('LearningPath', learningPathSchema);

export default LearningPath;
