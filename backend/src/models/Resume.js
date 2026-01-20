import mongoose from 'mongoose';

// Define the schema for the Resume
// A schema is like a blueprint for how data should look in the database
const resumeSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true, // This field is mandatory
    },
    ocrText: {
        type: String,
        required: true, // This field is mandatory
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set to the current date/time
    },
});

// Create the model using the schema
// 'Resume' is the name of the collection in MongoDB (it will become 'resumes')
const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
