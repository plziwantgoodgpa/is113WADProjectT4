const Category = require('../model/categoryModel');

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.retrieveAll();
        res.render("category/allCategory", { categories }); 
    } catch (error) {
        console.error(error);
        res.status(500).send("Error reading categories from database");
    }
};

exports.renderAddForm = (req, res) => {
    res.render("category/addCategory");
};

exports.insertCategory = async (req, res) => {
    try {
        await Category.addCategory(req.body);
        res.redirect("/category/allCategories");
    } catch (error) {
        console.error(error);
        res.send("Error saving category. Make sure the name is unique!");
    }
};

exports.showEditForm = async (req, res) => {
    let categoryID = req.query.categoryID;
    if (!categoryID) return res.redirect("/category/allCategories");

    try {
        let category = await Category.findByCategoryId(categoryID);
        if (!category) return res.redirect("/category/allCategories");
        
        res.render("category/editCategory", { category });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading category edit page");
    }
};

exports.updateCategory = async (req, res) => {
    try {
        await Category.editCategory(req.body.category_id, req.body);
        res.redirect("/category/allCategories");
    } catch (error) {
        console.error(error);
        res.send("Error updating the category");
    }
};

exports.deleteCategory = async (req, res) => {
    let categoryID = req.query.categoryID;
    try {
        await Category.deleteCategory(categoryID);
        res.redirect("/category/allCategories");
    } catch (error) {
        console.error(error);
        res.send("Error deleting the category");
    }
};