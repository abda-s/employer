const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema({
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
        street: String,
        city: String,
        state: String,
        zip: String
    }
});

const Employer = mongoose.model('Employer', employerSchema);

module.exports = Employer;
