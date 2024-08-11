const mongoose = require('mongoose');

const jobExperienceSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    duration: {
        start: {
            type: Date,
            required: true
        },
        end: {
            type: Date,
            required: true
        }
    },
    description: {
        type: String,
        required: true
    }
});

const educationSchema = new mongoose.Schema({
    institutionName: {
        type: String,
        required: true
    },
    degree: {
        type: String,
        required: true
    },
    yearOfGraduation: {
        type: Number,
        required: true
    }
});

const employeeSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: false
    },
    professionalSummary: {
        type: String,
        required: false
    },
    skills: {
        type: [String],
        required: true
    },
    experience: [jobExperienceSchema],
    education: [educationSchema]
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
