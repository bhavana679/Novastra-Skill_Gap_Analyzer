import mongoose from 'mongoose';

/**
 * Resource Model
 * This schema defines how learning resources (like courses, videos, and documentation)
 * are stored in the database.
 */
const resourceSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, 'Please specify which skill this resource is for.'],
        trim: true
    },
    type: {
        type: String,
        required: [true, 'Please specify the resource type (video, course, or docs).'],
        enum: {
            values: ['video', 'course', 'docs'],
            message: '{VALUE} is not a supported resource type'
        }
    },
    title: {
        type: String,
        required: [true, 'Please provide a title for the resource.'],
        trim: true
    },
    url: {
        type: String,
        required: [true, 'Please provide a URL for the resource.'],
        trim: true
    },
    level: {
        type: String,
        required: [true, 'Please specify the difficulty level.'],
        enum: {
            values: ['Beginner', 'Intermediate', 'Advanced'],
            message: '{VALUE} is not a supported level'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;
