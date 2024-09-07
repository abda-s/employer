const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const User = require('../models/User');

const dotenv = require("dotenv");
const { validateToken } = require("../middlewares/AuthMiddlewares");
const Employer = require("../models/Employer");
const Employee = require("../models/Employee");
dotenv.config();


router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Await the promise returned by Users.findOne
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.json({ error: "email already exists" });
        }

        const user = new User({
            email,
            password: hashedPassword,
        });

        // Await the promise returned by user.save()
        await user.save();
        res.status(200).json("success");

    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ error: `Failed to create user: ${err.message}` });
    }
});



router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.json({ error: "Email doesn't exist" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.json({ error: "Wrong password" });
        }

        const accessToken = sign(
            { email: user.email, id: user.id, role: user.role },
            process.env.JWT_SECRET
        );
        res.json({
            token: accessToken,
            email: user.email,
            id: user.id,
            role: user.role,
        });
        console.log("You have successfully logged in");

    } catch (err) {
        console.log("error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/employer', validateToken([]), async (req, res) => {
    const { role, id: userId } = req.user;
    const { companyName, companyDescription, specialties, contactInfo, address } = req.body;

    // Check if the user has already chosen a role
    if (role) {
        return res.json({ error: "You have already chosen a role" });
    }

    try {
        // Create a new Employer document
        const employer = new Employer({
            userId,
            companyName,
            companyDescription,
            specialties,
            contactInfo: {
                phone: contactInfo.phone,
                email: contactInfo.email,
            },
            address,
        });

        // Save the employer document
        await employer.save();

        // Update the user's role
        await User.findOneAndUpdate({ _id: userId }, { role: "employer" });

        // Find the updated user
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.json({ error: "User not found" });
        }

        // Generate a new access token
        const accessToken = sign(
            { email: user.email, id: user.id, role: user.role },
            process.env.JWT_SECRET
        );

        // Send the token as a response
        res.json({ token: accessToken });

    } catch (err) {
        // Handle errors
        res.status(500).json({ error: err.message });
    }
});


router.post('/employee', validateToken([]), async (req, res) => {
    const { role, id: userId } = req.user;
    const { fullName, phoneNumber, professionalSummary, skills, experience, education } = req.body;

    // Check if the user has already chosen a role
    if (role) {
        return res.json({ error: "You have already chosen a role" });
    }

    try {
        // Create a new Employee document
        const employee = new Employee({
            userId,
            fullName,
            phoneNumber,
            professionalSummary,
            skills,
            experience,
            education,
        });

        // Save the employee document
        await employee.save();

        // Update the user's role
        await User.findOneAndUpdate({ _id: userId }, { role: "employee" });

        // Find the updated user
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.json({ error: "User not found" });
        }

        // Generate a new access token
        const accessToken = sign(
            { email: user.email, id: user.id, role: user.role },
            process.env.JWT_SECRET
        );

        // Send the token as a response
        res.json({ token: accessToken });

    } catch (err) {
        // Handle errors
        res.status(500).json({ error: err.message });
    }
});


router.post('/employee-data', validateToken(['employee']), async (req, res) => {
    const { id } = req.user
    try {
        const employee = await Employee.findOne({ userId: id }).populate({ path: "userId", select: 'email' })

        if (!employee) {
            res.status(500).json({ error: "employee not found" })
        }

        res.status(200).json(employee)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }

})


router.put('/edit-personal-data', validateToken(["employee"]), (req, res) => {
    const id = req.user.id
    const { fullName, phoneNumber, professionalSummary } = req.body
    Employee.findOneAndUpdate({ userId: id }, { fullName, phoneNumber, professionalSummary })
        .then(() => {
            res.json("success")
        })
        .catch(err => {
            res.status(500).json({ error: err.message })
        })
})

router.put('/edit-education', validateToken(["employee"]), async (req, res) => {
    const id = req.user.id;
    const { educationIndex, institutionName, degree, graduationYear } = req.body;

    try {
        const employee = await Employee.findOne({ userId: id });
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        // Check if the educationIndex is valid
        if (educationIndex < 0 || educationIndex >= employee.education.length) {
            return res.status(400).json({ error: "Invalid education index" });
        }

        // Update the specific fields in the education array
        employee.education[educationIndex].institutionName = institutionName;
        employee.education[educationIndex].degree = degree;
        employee.education[educationIndex].graduationYear = graduationYear;

        // Save the updated document
        await employee.save();

        res.json("success");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/add-education", validateToken(["employee"]), async (req, res) => {
    const id = req.user.id;
    const { institutionName, degree, graduationYear } = req.body;

    try {
        // Find the employee by userId
        const employee = await Employee.findOne({ userId: id });

        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        // Add the new education entry to the education array
        employee.education.push({
            institutionName,
            degree,
            graduationYear
        });

        // Save the updated employee document
        await employee.save();

        res.json("success");
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

router.delete('/education/:id', validateToken(["employee"]), async (req, res) => {
    const userId = req.user.id
    const educationIndex = req.params.id

    const employee = await Employee.findOne({ userId });
    try {

        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        // Validate the index
        if (educationIndex < 0 || educationIndex >= employee.education.length) {
            return res.status(400).json({ error: "Invalid education index" });
        }

        // Remove the education entry at the specified index
        employee.education.splice(educationIndex, 1);

        await employee.save();
        res.json("success");


    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }

})

router.put('/edit-experience', validateToken(["employee"]), async (req, res) => {
    const id = req.user.id;
    const { experienceIndex, jobTitle, companyName, description, startDate, endDate } = req.body;

    try {
        const employee = await Employee.findOne({ userId: id });
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        // Check if the educationIndex is valid
        if (experienceIndex < 0 || experienceIndex >= employee.experience.length) {
            return res.status(400).json({ error: "Invalid experience index" });
        }

        // Update the specific fields in the education array
        employee.experience[experienceIndex].jobTitle = jobTitle;
        employee.experience[experienceIndex].companyName = companyName;
        employee.experience[experienceIndex].description = description;
        employee.experience[experienceIndex].startDate = startDate;
        employee.experience[experienceIndex].endDate = endDate;

        // Save the updated document
        await employee.save();

        res.json("success");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.put("/add-experience", validateToken(["employee"]), async (req, res) => {
    const id = req.user.id;
    const { jobTitle, companyName, description, startDate, endDate } = req.body;

    try {
        // Find the employee by userId
        const employee = await Employee.findOne({ userId: id });

        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        // Add the new education entry to the education array
        employee.experience.push({
            jobTitle, companyName, description, startDate, endDate
        });

        // Save the updated employee document
        await employee.save();

        res.json("success");
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

router.delete('/experience/:id', validateToken(["employee"]), async (req, res) => {
    const userId = req.user.id
    const experienceIndex = req.params.id

    const employee = await Employee.findOne({ userId });
    try {

        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        // Validate the index
        if (experienceIndex < 0 || experienceIndex >= employee.experience.length) {
            return res.status(400).json({ error: "Invalid education index" });
        }

        // Remove the education entry at the specified index
        employee.experience.splice(experienceIndex, 1);

        await employee.save();
        res.json("success");


    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }

})


router.put('/edit-skill', validateToken(["employee"]), async (req, res) => {
    const id = req.user.id;
    const { skillsIndex, name, level } = req.body;

    try {
        const employee = await Employee.findOne({ userId: id });
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        // Check if the educationIndex is valid
        if (skillsIndex < 0 || skillsIndex >= employee.skills.length) {
            return res.status(400).json({ error: "Invalid skills index" });
        }

        // Update the specific fields in the education array
        employee.skills[skillsIndex].name = name;
        employee.skills[skillsIndex].level = level;

        // Save the updated document
        await employee.save();

        res.json("success");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.put("/add-skill", validateToken(["employee"]), async (req, res) => {
    const id = req.user.id;
    const { name, level } = req.body;

    try {
        // Find the employee by userId
        const employee = await Employee.findOne({ userId: id });

        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        // Add the new education entry to the education array
        employee.skills.push({
            name, level
        });

        // Save the updated employee document
        await employee.save();

        res.json("success");
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

router.delete('/skill/:id', validateToken(["employee"]), async (req, res) => {
    const userId = req.user.id
    const skillsIndex = req.params.id

    const employee = await Employee.findOne({ userId });
    try {

        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        // Validate the index
        if (skillsIndex < 0 || skillsIndex >= employee.skills.length) {
            return res.status(400).json({ error: "Invalid skill index" });
        }

        // Remove the education entry at the specified index
        employee.skills.splice(skillsIndex, 1);

        await employee.save();
        res.json("success");


    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }

})

module.exports = router