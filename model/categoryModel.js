const mongoose = require('mongoose');

// 1. Define the Schema
const categorySchema = new mongoose.Schema({
    category_id: {
        type: Number,
        required: [true, 'A category must have a category_id'],
        unique: true
    },
    name: {
        type: String,
        required: [true, 'A category must have a name'],
        unique: true // Category names should usually be unique! (e.g., only one "Rock")
    },
    description: {
        type: String,
        required: [true, 'A category must have a description']
    }
});

// 2. Auto-Increment Hook for category_id
categorySchema.pre('validate', async function(next) {
    if (this.isNew) {
        try {
            const lastCategory = await this.constructor.findOne().sort({ category_id: -1 });
            if (lastCategory && lastCategory.category_id) {
                this.category_id = lastCategory.category_id + 1;
            } else {
                this.category_id = 1;
            }
        } catch (error) {
            return next(error);
        }
    }
    next();
});

// 3. Create the Model
const Category = mongoose.model('Category', categorySchema, 'Category');

// --------------------------------------------------------
// 4. Custom Methods (Exported for the Controller)
// --------------------------------------------------------

exports.retrieveAll = function() {
    return Category.find();
};

exports.findByCategoryId = function(category_id) {
    return Category.findOne({ category_id: category_id });
};

exports.addCategory = function(categoryData) {
    const newCategory = new Category(categoryData);
    return newCategory.save();
};

exports.editCategory = function(category_id, updatedData) {
    return Category.findOneAndUpdate(
        { category_id: category_id }, 
        updatedData, 
        { runValidators: true }
    );
};

exports.deleteCategory = function(category_id) {
    return Category.findOneAndDelete({ category_id: category_id });
};