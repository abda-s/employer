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

router.post('/employer', validateToken([]), (req, res) => {
    const userRole = req.user.role
    const userId = req.user.id
    const { companyName, companyDescription, specialties, contactInfo, address } = req.body


    if (userRole) {
        res.json({ error: "you have already chosen the role" })
    }

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
    })

    employer.save()
        .then(result => {
            User.findOneAndUpdate({ _id: userId }, { role: "employer" })
                .then(result1 => {
                    res.json("success")
                }).catch(err => {
                    res.status(500).json({ error: err.message })
                })
        })
        .catch(err => {
            res.status(500).json({ error: err.message })
        })



})

router.post('/employee', validateToken([]), (req, res) => {
    const userRole = req.user.role
    const userId = req.user.id
    const { fullName, phoneNumber, professionalSummary, skills, experience, education } = req.body

    if (userRole) {
        res.json({ error: "you have already chosen the role" })
    }

    const employee = new Employee({
        userId,
        fullName,
        phoneNumber,
        professionalSummary,
        skills,
        experience,
        education,
    })
    employee.save()
        .then(result => {
            User.findOneAndUpdate({ _id: userId }, { role: "employee" })
                .then(result1 => {
                    res.json("success")
                }).catch(err => {
                    res.status(500).json({ error: err.message })
                })
        })
        .catch(err => {
            res.status(500).json({ error: err.message })
        })

})

router.post('/employee-data', validateToken(['employee']), (req, res) => {
    const { id } = req.user
    Employee.findOne({ userId: id })
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({ error: err.message })
        })
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



module.exports = router