const express = require("express");
const { validateToken } = require("../middlewares/AuthMiddlewares");
const JobPosting = require("../models/JobPosting");
const Employer = require('../models/Employer')
const Employee = require('../models/Employee')
const Application = require("../models/Application")
const router = express.Router();


router.get('/', validateToken(["employer"]), async (req, res) => {
    try {
        const userId = req.user.id;

        const employer = await Employer.findOne({ userId });

        if (!employer) {
            return res.status(404).json({ error: 'Employer not found' });
        }
        const employerId = employer._id;

        const jobPostings = await JobPosting.find({ employerId });

        res.status(200).json(jobPostings);

    } catch (error) {
        res.status(500).json({ error: `Failed to get job postings: ${error}` });
    }
})

router.get('/employee', validateToken(["employee"]), async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the employee by userId
        const employee = await Employee.findOne({ userId });
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        const employeeId = employee._id;

        // Find all applications submitted by the employee
        const appliedJobIds = await Application.find({ employeeId }).distinct('jobPostingId');

        // Find all job postings excluding the ones the employee has applied for
        const jobPostings = await JobPosting.find({ _id: { $nin: appliedJobIds } });

        res.status(200).json(jobPostings);
    } catch (error) {
        res.status(500).json({ error: `Failed to get job postings: ${error.message}` });
    }
});


router.post('/add-job', validateToken(["employer"]), async (req, res) => {
    try {
        const { jobTitle, companyName, location, description, requirements, applicationDeadline } = req.body;
        const userId = req.user.id;

        const employer = await Employer.findOne({ userId });

        if (!employer) {
            return res.status(404).json({ error: 'Employer not found' });
        }

        const employerId = employer._id;


        const jobPosting = new JobPosting({
            jobTitle,
            companyName,
            location,
            description,
            requirements,
            applicationDeadline,
            employerId
        });

        await jobPosting.save();

        console.log(jobPosting)

        res.status(201).json({ message: 'Job posting created successfully', jobPosting });
    } catch (error) {
        res.status(500).json({ error: `Failed to create job posting: ${error}` });
    }
});


router.put("/edit-job", validateToken(['employer']), async (req, res) => {
    const { jobTitle, companyName, location, description, requirements, applicationDeadline, status, postId } = req.body;
    const userId = req.user.id
    try {
        const employer = await Employer.findOne({ userId });

        if (!employer) {
            return res.status(404).json({ error: 'Employer not found' });
        }

        const employerId = employer._id;
        const jobPosting = await JobPosting.findById(postId);


        if (!employerId.equals(jobPosting.employerId)) {
            return res.status(403).json({ error: 'You do not have permission to edit this job posting' });
        }


        jobPosting.jobTitle = jobTitle
        jobPosting.companyName = companyName
        jobPosting.description = description
        jobPosting.requirements = requirements
        jobPosting.location = location
        jobPosting.applicationDeadline = applicationDeadline
        jobPosting.status = status

        await jobPosting.save();

        return res.status(200).json({ message: 'Job posting updated successfully' });

    } catch (error) {
        res.status(500).json({ error: `Failed to edit job posting: ${error}` });
    }


})


module.exports = router