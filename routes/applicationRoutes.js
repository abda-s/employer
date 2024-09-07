const express = require("express");
const { validateToken } = require("../middlewares/AuthMiddlewares");
const Employee = require("../models/Employee");
const JobPosting = require("../models/JobPosting");
const Application = require("../models/Application");
const Employer = require("../models/Employer");
const router = express.Router();

router.post('/', validateToken(["employee"]), async (req, res) => {
    const { jobPostingId, coverLetter } = req.body;
    const userId = req.user.id;

    try {
        const employee = await Employee.findOne({ userId });
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        const employeeId = employee._id;

        const jobPosting = await JobPosting.findById(jobPostingId);
        if (!jobPosting) {
            return res.status(404).json({ error: 'Job posting not found' });
        }
        const employerId = jobPosting.employerId;

        const application = new Application({
            employeeId,
            employerId,
            jobPostingId,
            coverLetter,
        });

        await application.save();

        res.status(201).json({ message: 'Application submitted successfully', application });
    } catch (error) {
        res.status(500).json({ error: `Failed to add application: ${error.message}` });
    }
});

router.get('/', validateToken(["employer"]), async (req, res) => {
    const userId = req.user.id;

    try {
        // Find the employer by userId
        const employer = await Employer.findOne({ userId });

        if (!employer) {
            return res.status(404).json({ error: 'Employer not found' });
        }

        const employerId = employer._id;

        // Find applications for the employer's job postings and populate the employee details
        const applications = await Application.find({ employerId }).populate('employeeId').populate("jobPostingId");

        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ error: `Failed to get applications: ${error.message}` });
    }
});

router.get('/:id', validateToken(["employer"]), async (req, res) => {
    const userId = req.user.id;
    const jobPostingId = req.params.id;

    try {
        // Find the employer by userId
        const employer = await Employer.findOne({ userId });

        if (!employer) {
            return res.status(404).json({ error: 'Employer not found' });
        }

        const employerId = employer._id;

        // Find the job posting by id and ensure it belongs to the employer
        const jobPosting = await JobPosting.findOne({ _id: jobPostingId, employerId });

        if (!jobPosting) {
            return res.status(404).json({ error: 'Job posting not found or not owned by this employer' });
        }

        // Find applications for the job posting and populate the employee details
        const applications = await Application.find({ jobPostingId })
        .populate({
          path: 'employeeId',
          populate: {
            path: 'userId', // This populates the userId within the employeeId
            select: 'email' // Select only the email field from the userId document
          }
        })
        .populate('jobPostingId');
        // Add applications array to the jobPosting object
        const jobPostingWithApplications = {
            ...jobPosting.toObject(), // Convert Mongoose document to plain JavaScript object
            applications: applications
        };

        res.status(200).json(jobPostingWithApplications);
    } catch (error) {
        res.status(500).json({ error: `Failed to get job posting with applications: ${error.message}` });
    }
});


router.put('/', validateToken(["employer"]), async (req, res) => {
    const { status, applicationId } = req.body
    const userId = req.user.id
    try {
        const employer = await Employer.findOne({ userId });

        if (!employer) {
            return res.status(404).json({ error: 'Employer not found' });
        }

        const employerId = employer._id;



        const application = await Application.findById(applicationId)

        if (!employerId.equals(application.employerId)) {
            res.status(501).json({ error: "this isn't the same employer" })
        }

        application.status = status

        await application.save();

        res.status(200).json(application)



    }
    catch (error) {
        res.status(500).json({ error: `Failed to update applications: ${error.message}` });
    }

})



module.exports = router