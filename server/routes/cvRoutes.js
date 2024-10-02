const express = require("express");
const router = express.Router();
const { validateToken } = require("../middlewares/AuthMiddlewares");
const Employee = require("../models/Employee");
const Skill = require("../models/Skill");


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


router.put('/edit-skill', validateToken(["employee"]), async (req, res) => {
    const id = req.user.id;
    const { skillsIndex, level } = req.body;

    try {
        const employee = await Employee.findOne({ userId: id });
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        // Check if the educationIndex is valid
        if (skillsIndex < 0 || skillsIndex >= employee.employeeSkills.length) {
            return res.status(400).json({ error: "Invalid skills index" });
        }

        // Update the specific fields in the education array
        employee.employeeSkills[skillsIndex].level = level;

        // Save the updated document
        await employee.save();

        res.json("success");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.put("/add-skill", validateToken(["employee"]), async (req, res) => {
    const id = req.user.id;
    const { skillId, level } = req.body;

    try {
        // Find the employee by userId
        const employee = await Employee.findOne({ userId: id });

        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        // Check if the skill exists in the database
        let dbSkill = await Skill.findById(skillId._id);

        // If the skill doesn't exist, create a new one
        if (!dbSkill) {
            dbSkill = new Skill({ name: skillId.name });
            await dbSkill.save();
        }

        // Check if the employee already has this skill
        const existingSkill = employee.employeeSkills.find(
            (empSkill) => empSkill.skillId.toString() === dbSkill._id.toString()
        );

        if (existingSkill) {
            return res.status(400).json({ error: "Skill already exists for the employee" });
        }

        // Add the new skill to the employeeSkills array
        const newEmployeeSkill = {
            skillId: dbSkill._id,
            level: level,
        };

        employee.employeeSkills.push(newEmployeeSkill);

        // Save the updated employee document
        await employee.save();

        res.json({ message: "Skill added successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.error(err);
    }
});

router.delete('/skill/:id', validateToken(["employee"]), async (req, res) => {
    const userId = req.user.id;
    const skillsIndex = parseInt(req.params.id, 10); // Convert skillsIndex to an integer

    try {
        const employee = await Employee.findOne({ userId });

        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        // Validate the index
        if (isNaN(skillsIndex) || skillsIndex < 0 || skillsIndex >= employee.employeeSkills.length) {
            return res.status(400).json({ error: "Invalid skill index" });
        }

        // Remove the skill entry at the specified index
        employee.employeeSkills.splice(skillsIndex, 1);

        await employee.save();
        res.json({ message: "Skill removed successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.error(err);
    }
});


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


module.exports = router