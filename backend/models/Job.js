const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    companyLogo: {
        type: String, // URL to the company logo image
        default: 'https://via.placeholder.com/150' // Placeholder image
    },
    isCredepathVerifiedCompany: {
        type: Boolean,
        default: false
    },
    jobTitle: {
        type: String,
        required: true,
        trim: true
    },
    experience: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    salary: {
        type: String,
        required: true,
        trim: true
    },
    postedDaysAgo: {
        type: Number,
        default: 0
    },
    applicantsCount: {
        type: Number,
        default: 0
    },
    isCredepathVerifiedJob: {
        type: Boolean,
        default: false
    },
    skillsRequired: {
        type: [String], // Array of strings
        default: []
    },
    jobDescription: {
        keyResponsibilities: {
            type: [String],
            default: []
        },
        requiredQualifications: {
            type: [String],
            default: []
        },
        preferredSkills: {
            type: [String],
            default: []
        }
    },
    benefits: {
        type: [String],
        default: []
    },
    aboutCompany: {
        type: String,
        trim: true
    },
    jobType: {
        type: String, // e.g., 'Full-time', 'Part-time', 'Contract'
        default: 'Full-time'
    },
    industry: {
        type: String,
        trim: true
    },
    function: {
        type: String,
        trim: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model('Job', JobSchema);