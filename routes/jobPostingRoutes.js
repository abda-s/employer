const express = require("express");
const { validateToken } = require("../middlewares/AuthMiddlewares");
const JobPosting = require("../models/JobPosting");
const Employer = require('../models/Employer')
const Employee = require('../models/Employee')
const Application = require("../models/Application");
const Skill = require("../models/Skill");
const Category = require("../models/Category");
const router = express.Router();

// jobs that the employer posted
router.get('/posted-jobs', validateToken(["employer"]), async (req, res) => {
    try {
        const userId = req.user.id;

        const employer = await Employer.findOne({ userId });

        if (!employer) {
            return res.status(404).json({ error: 'Employer not found' });
        }
        const employerId = employer._id;

        const jobPostings = await JobPosting.find({ employerId }).populate({ path: "skills", select: "name" });

        res.status(200).json(jobPostings);

    } catch (error) {
        res.status(500).json({ error: `Failed to get job postings: ${error}` });
    }
})

// all the jobs that are posted
router.get('/all-jobs', validateToken(["admin"]), async (req, res) => {
    try {
        const jobPostings = await JobPosting.find()
            .populate({
                path: 'skills',
                select: 'name' // Select only the 'name' field from the Skill model
            })
            .exec();

        // Convert Mongoose documents to plain objects and format jobs
        const formattedJobs = jobPostings.map(job => {
            // Convert the job document to a plain object
            const jobObj = job.toObject();

            // Map skill documents to their names
            const fromSkills = jobObj.skills.map(skill => skill.name);

            return {
                ...jobObj,
                skills: fromSkills
            };
        });


        // Send the response
        res.status(200).json(formattedJobs);

    } catch (error) {
        res.status(500).json({ error: `Failed to get job postings: ${error}` });
    }
})

// the jobs that will get to the employee based on the skills and the category of these skills
router.get('/job-listing', validateToken(["employee"]), async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the employee by userId and populate employeeSkills with skillId and categoryId
        const employee = await Employee.findOne({ userId }).populate({
            path: "employeeSkills.skillId",
            select: "name categoryId",
            populate: { path: "categoryId", select: "name" }
        });

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        const employeeSkills = [...new Set(employee.employeeSkills.map(es => es.skillId._id.toString()))];
        const employeeCategories = [...new Set(employee.employeeSkills.map(es => es.skillId.categoryId._id.toString()))];



        // Find all applications submitted by the employee
        const appliedJobIds = await Application.find({ employeeId: employee._id }).distinct('jobPostingId');

        // Find all job postings excluding the ones the employee has applied for, and populate their skills and categories
        const jobPostings = await JobPosting.find({ _id: { $nin: appliedJobIds } }).populate({
            path: "skills",
            select: "name categorId",
            populate: { path: "categoryId", select: "name" }
        }); 

        // Initialize an array to store job postings results
        const jobResults = [];

        jobPostings.forEach(job => {
            const jobSkills = job.skills.map(skill => skill._id.toString());

            const jobCategories = job.skills.map(skill => skill.categoryId._id.toString());

            // Check if the employee has any skills that match the job posting's skills
            const hasMatchingSkills = employeeSkills.some(skillId => jobSkills.includes(skillId));

            if (hasMatchingSkills) {
                jobResults.push(job);
            } else {
                // If no matching skills, check if job's categories match any of the employee's skill categories
                const hasSameCategories = employeeCategories.some(categoryId => jobCategories.includes(categoryId));
                console.log("hasSameCategories: ", hasSameCategories);

                if (hasSameCategories) {
                    jobResults.push(job);
                }
            }
        });

        // Return the job postings with the matching skills and/or categories
        res.status(200).json(jobResults);
    } catch (error) {
        res.status(500).json({ error: `Failed to get job listings: ${error.message}` });
    }
});

// employer can create a job
router.post('/add-job', validateToken(["employer"]), async (req, res) => {
    const { jobTitle, companyName, location, description, applicationDeadline, skills } = req.body;
    const userId = req.user.id;

    try {

        const employer = await Employer.findOne({ userId });

        if (!employer) {
            return res.status(404).json({ error: 'Employer not found' });
        }
        const employerId = employer._id;



        let skillIds = [];  // Array to store the skill IDs
        let requirementNames = []

        for (const skill of skills) {
            // Check if the skill already exists



            const dbSkill = await Skill.findById(skill._id);

            if (!dbSkill) {
                // Create the skill with the category reference
                const newSkill = new Skill({
                    name: skill.name,
                    categoryId: null
                });

                // Save the new skill
                const savedSkill = await newSkill.save();
                skillIds.push(savedSkill._id);  // Add the newly created skill's ID to the array
                requirementNames.push(savedSkill.name)
            } else {
                // If the skill already exists, push its ID to the array
                skillIds.push(dbSkill._id);
                requirementNames.push(dbSkill.name)
            }
        }

        const jobPosting = new JobPosting({
            jobTitle,
            companyName,
            location,
            description,
            applicationDeadline,
            employerId,
            skills: skillIds
        });

        await jobPosting.save();


        res.status(201).json({ message: 'Job posting created successfully', jobPosting });
    } catch (error) {
        res.status(500).json({ error: `Failed to create job posting: ${error}` });
    }
});

// employer can edit a job
router.put("/edit-job", validateToken(['employer', "admin"]), async (req, res) => {
    const { jobTitle, companyName, location, description, applicationDeadline, status, postId, skills } = req.body;
    try {
        const jobPosting = await JobPosting.findById(postId);

        let skillIds = []

        for (const skill of skills) {
            // Check if the skill already exists


            const dbSkill = await Skill.findById(skill._id);

            if (!dbSkill) {
                // Create the skill with the category reference
                const newSkill = new Skill({
                    name: skill.name,
                    categoryId: null
                });

                // Save the new skill
                const savedSkill = await newSkill.save();
                skillIds.push(savedSkill._id);  // Add the newly created skill's ID to the array
            } else {
                // If the skill already exists, push its ID to the array
                skillIds.push(dbSkill._id);
            }
        }

        jobPosting.jobTitle = jobTitle
        jobPosting.companyName = companyName
        jobPosting.description = description
        jobPosting.location = location
        jobPosting.applicationDeadline = applicationDeadline
        jobPosting.status = status
        jobPosting.skills = skillIds



        await jobPosting.save();

        return res.status(200).json(jobPosting);

    } catch (error) {
        res.status(500).json({ error: `Failed to edit job posting: ${error}` });
    }

})

module.exports = router