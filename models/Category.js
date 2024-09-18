const mongoose = require('mongoose');
const Skill = require('./Skill');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

});

categorySchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        // Find all Skill documents that reference this Category
        await Skill.updateMany({ categoryId: this._id }, { $set: { categoryId: null } });
        next();
    } catch (error) {
        next(error);
    }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
