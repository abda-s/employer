const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    companyDescription: {
        type: String,
        required: false
    },
    specialties: {
        type: [String],
        required: true
    },
    contactInfo: {
        phone: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: false
        }
    },
    address: {
        type: String,
        required: false
    },
});

const Employer = mongoose.model('Employer', employerSchema);

module.exports = Employer;
