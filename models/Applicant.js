const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    skillset: [String],
    jobTitle: String,
    jobExperience: String,
    projectSubmission: String,  // URL to GitHub, Google Drive, etc.
    jobProfileResume: String,    // URL or path to resume PDF
    internshipExperienceLetter: String, // URL or path to experience letter PDF
    mobileNumber: String,
    coverLetter: String,
    workPreference: { type: String, enum: ['WFH', 'WFO'], default: 'WFO' }
});

module.exports = mongoose.model('Applicant', applicantSchema);
