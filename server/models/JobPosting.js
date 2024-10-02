const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema({
    employerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employer',
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    requirements: {
        type: [String],
        required: true
    },
    applicationDeadline: {
        type: Date,
        required: false
    },
    status: {
        type: String,
        enum: ['active', 'expired'],
        default: "active"
    },

    skills: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Skill'
        }],
        required: true,
        validate: [arrayLimit, 'The skills array should have at least one item']
    }

}, { timestamps: true });

function arrayLimit(val) {
    return val.length > 0;  // Ensures that the array has at least one item
}

const JobPosting = mongoose.model('JobPosting', jobPostingSchema);

module.exports = JobPosting;
