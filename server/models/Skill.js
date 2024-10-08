const mongoose = require('mongoose');
const Employee = require('./Employee');

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: false
    }

});

// Pre-remove middleware to handle skill deletion
skillSchema.pre('deleteOne', async function (next) {
    try {
        // Get the ID from the query filter
        const skillId = this.getFilter()['_id'];

        if (!skillId) {
            console.error("Skill ID is undefined");
            return next(new Error("Skill ID is undefined"));
        }
        await Employee.updateMany(
            { 'employeeSkills.skillId': skillId },
            { $pull: { employeeSkills: { skillId: skillId } } }
        );
        next();
    } catch (err) {
        next(err);
    }
});

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;
