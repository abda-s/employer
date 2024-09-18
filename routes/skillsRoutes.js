const express = require("express");
const { validateToken } = require("../middlewares/AuthMiddlewares");
const JobPosting = require("../models/JobPosting");
const Employer = require('../models/Employer')
const Employee = require('../models/Employee')
const Application = require("../models/Application");
const Skill = require("../models/Skill");
const Category = require("../models/Category");
const router = express.Router();


// Get the skills based on there category
router.get('/categories-with-skills', validateToken('admin'), async (req, res) => {
    try {
        // Find skills without a category (uncategorized skills)
        const uncategorizedSkills = await Skill.find({
            $or: [{ categoryId: { $exists: false } }, { categoryId: null }]
        }).select("name");

        // Create an entry for uncategorized skills at the top
        const categoriesWithSkills = [{
            category: { name: "Uncategorized" },
            skills: uncategorizedSkills
        }];

        // Find all categories
        const categories = await Category.find();

        // For each category, find the related skills and append them after "Uncategorized"
        const categorizedSkills = await Promise.all(
            categories.map(async (category) => {
                const skills = await Skill.find({ categoryId: category._id }).select("name");
                return {
                    category: category,
                    skills: skills
                };
            })
        );

        // Append categorized skills after "Uncategorized"
        categoriesWithSkills.push(...categorizedSkills);

        res.status(200).json(categoriesWithSkills);
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve categories and skills: ${error.message}` });
    }
});

// Get all the skills
router.get('/all-skills', validateToken([]), async (req, res) => {
    try {
        const skills = await Skill.find({}).select("name")

        res.status(200).json(skills)

    } catch (error) {
        res.status(500).json({ error: `Failed to get skills: ${error.message}` });
    }
})

// create a category without any skills
router.post('/add-category', validateToken(["admin"]), async (req, res) => {
    const { categoryName } = req.body

    const categoryNameFormatted = categoryName.toLowerCase()

    const newCategory = new Category({
        name: categoryNameFormatted
    })

    try {
        await newCategory.save()

        res.status(200).json("success")

    } catch (error) {
        res.status(500).json({ error: `Failed to create categories: ${error.message}` });
    }

})

// Set skills to a category
router.put('/categories-skills', validateToken(["admin"]), async (req, res) => {
    const { category: catigoryId, skills } = req.body

    try {
        for (let skill of skills) {

            const dbSkill = await Skill.findById(skill._id)

            if (!dbSkill) {
                return console.log("this skill isn't found", skill.name);
            }

            dbSkill.categoryId = catigoryId
            await dbSkill.save()
        }
        res.status(200).json(skills)

    } catch (err) {
        res.status(500).json({ error: `Failed to edit skills: ${err}` });
    }
})

// Add and rename skills from a category and also rename the category
router.put('/edit-category-with-its-skills', validateToken(["admin"]), async (req, res) => {
    const { category, skills } = req.body

    try {

        const dbCategory = await Category.findById(category._id);

        if (!dbCategory) {
            res.status(404).json({ error: "there is no such category" })
        }

        if (dbCategory.name !== category.name) {
            dbCategory.name = category.name
            dbCategory.save()
        }

        for (const skill of skills) {

            const dbSkill = await Skill.findById(skill._id)

            if (!dbSkill) {
                const newSkill = new Skill({
                    name: skill.name,
                    categoryId: category._id
                })
                newSkill.save()
            } else {
                if (dbSkill.name !== skill.name) {
                    dbSkill.name = skill.name
                    dbSkill.save()
                }
            }
        }

        res.json(skills)


    } catch (err) {
        res.status(500).json({ error: `Failed to edit category: ${err}` });
    }
})


router.delete('/delete-skill/:id', validateToken(['admin']), async (req, res) => {
    const id = req.params.id
    try {
        const dbSkill = await Skill.findById(id)
        if (!dbSkill) {
            res.status(404).json({ error: "skill not found" })
        }
        await dbSkill.deleteOne()

        res.status(200).json(dbSkill)

    } catch (err) {
        res.status(500).json({ error: `Failed to delete skill: ${err}` });
    }
})

router.delete('/delete-category/:id', validateToken(['admin']), async (req, res) => {
    const id = req.params.id
    try {
        const dbCategory = await Category.findById(id)
        await dbCategory.deleteOne()

        res.status(200).json(dbCategory)

    } catch (err) {
        res.status(500).json({ error: `Failed to delete category: ${err}` });
    }
})


module.exports = router