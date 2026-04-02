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
        unique: true
    },
    description: {
        type: String,
        required: [true, 'A category must have a description']
    }
});


// 3. Create the Model
const Category = mongoose.model('Category', categorySchema, 'Category');


exports.retrieveAll = function () {
    return Category.find();
};

exports.findByCategoryId = function (category_id) {
    return Category.findOne({ category_id: category_id });
};

exports.addCategory = async function (categoryData) {

    const lastCat = await Category.findOne().sort({ category_id: -1 });

    // 2. Figure out the next ID
    let nextId = 1; // Default to 1 if the database is completely empty
    if (lastCat && lastCat.category_id) {
        nextId = lastCat.category_id + 1; // Add 1 to the highest existing ID
    }

    // 3. Inject this new ID into the data that came from the HTML form
    categoryData.category_id = nextId
    // 4. Create and save the new song!

    const newCategory = new Category(categoryData);
    return newCategory.save();
};

exports.editCategory = function (category_id, updatedData) {
    return Category.findOneAndUpdate(
        { category_id: category_id },
        updatedData,
        { runValidators: true }
    );
};

exports.deleteCategory = function (category_id) {
    return Category.findOneAndDelete({ category_id: category_id });
};

