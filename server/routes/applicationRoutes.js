const express = require("express");
const { validateToken } = require("../middlewares/AuthMiddlewares");
const Employee = require("../models/Employee");
const JobPosting = require("../models/JobPosting");
const Application = require("../models/Application");
const Employer = require("../models/Employer");
const router = express.Router();




// to make the employee able to check for the jobs he applied for
router.get("/applied-jobs", validateToken(["employee"]), async (req, res) => {
    const userId = req.user.id;
    try {
        const employee = await Employee.findOne({ userId })

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        const employeeId = employee._id

        const applications = await Application.find({ employeeId })
            .select("jobPostingId applicationDate coverLetter") // Select fields from the Application model
            .populate({
                path: "jobPostingId", // Populate the jobPostingId field
                select: "jobTitle companyName location description skills status", // Select specific fields from the JobPosting model
                populate:{ path:"skills",select:"name"}
            })


        res.status(200).json(applications)


    } catch (error) {
        res.status(500).json({ error: `Failed to get job posting with applications: ${error.message}` });
    }
})

// to make the employee able to apply for jobs
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

// to get the applications for job posting
router.get('/get-applications/:id', validateToken(["employer", "admin"]), async (req, res) => {
    const userId = req.user.id;
    const jobPostingId = req.params.id;

    try {
        // Find the job posting by id
        const jobPosting = await JobPosting.findById(jobPostingId)
            .populate({
                path: 'skills', // Populate skills field
                select: 'name' // Select relevant fields from skills
            });

        if (!jobPosting) {
            return res.status(404).json({ error: 'Job posting not found' });
        }

        // Find applications for the job posting and populate all related fields
        const applications = await Application.find({ jobPostingId })
            .populate({
                path: 'employeeId',
                populate: [{
                    path: 'userId', // Populate the userId within employeeId
                    select: 'email' // Select only the email field from the userId document
                },{
                    path:"employeeSkills.skillId",
                    select:"name"
                }],

            })
            .populate({
                path: 'jobPostingId' // Populate all fields within jobPostingId
                // No select field needed if you want to include all fields
            })


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

// to make the employee able to change the status for an application
router.put('/change-status', validateToken(["employer"]), async (req, res) => {
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