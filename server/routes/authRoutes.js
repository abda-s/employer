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

// for the new user to chose the role of employer
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

// for the new user to chose the role of employee
router.post('/employee', validateToken([]), async (req, res) => {
    const { role, id: userId } = req.user;
    const { fullName, phoneNumber, professionalSummary, skills, experience, education } = req.body;

    // Check if the user has already chosen a role
    if (role) {
        return res.json({ error: "You have already chosen a role" });
    }

    try {
        const employeeSkills = skills.map((skill) => ({
            skillId: skill._id
        }));

        // Create a new Employee document
        const employee = new Employee({
            userId,
            fullName,
            phoneNumber,
            professionalSummary,
            employeeSkills,
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

// for the employee to get there data (cv)
router.get('/employee-data', validateToken(['employee']), async (req, res) => {
    const { id } = req.user
    try {
        const employee = await Employee.findOne({ userId: id })
        .populate({ path: "userId", select: 'email' })
        .populate({ path: 'employeeSkills.skillId', select: 'name' })

        if (!employee) {
            res.status(500).json({ error: "employee not found" })
        }

        res.status(200).json(employee)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }

})




module.exports = router