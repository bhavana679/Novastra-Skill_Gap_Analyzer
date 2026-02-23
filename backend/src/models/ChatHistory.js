import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    role: {
        type: String,
        enum: ['user', 'ai', 'system'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    context: {
        skill: {
            type: String,
            default: 'General'
        },
        targetRole: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

export default ChatHistory;
