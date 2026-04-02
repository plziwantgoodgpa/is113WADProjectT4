const CategoryModel = require('../model/categoryModel');
const SongModel = require('../model/songModel');
const ReviewModel = require('../model/reviewModel')
exports.getAllCategories = async (req, res) => {
    let user_role = undefined;
    let username = undefined;

    if (req.session.user != undefined) {
        user_role = req.session.user.role;
        username = req.session.user.username;
    }
    try {
        const categories = await CategoryModel.retrieveAll();
        res.render("category/allCategory", { categories, user_role: user_role, username: username });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error reading categories from database");
    }
};

exports.renderAddForm = (req, res) => {
    let user_role = undefined;
    let username = undefined;
    let errMsg = req.query.errMsg || null;
    if (req.session.user != undefined) {
        user_role = req.session.user.role;
        username = req.session.user.username;
    }
    if (user_role !== "admin") {
        // This sends a popup alert to the browser, then redirects them to the library
        return res.send('<script>alert("Access Denied: You do not have permission to view this page."); window.location.href="/song/allSong";</script>');
    }
    res.render("category/addCategory", { username, error: errMsg ,user_role});
};

exports.insertCategory = async (req, res) => {
    try {
        await CategoryModel.addCategory(req.body);
        res.redirect("/category/allCategory");
    } catch (error) {
        console.error(error);
        console.error(error);
        let errMsg = "An error occurred while updating the category.";

        // CHECK 1: MongoDB Duplicate Key Error (Unique constraint failed)
        if (error.code === 11000) {
            if (error.keyValue && error.keyValue.name) {
                errMsg = `The category "${error.keyValue.name}" already exists.`;
            } else {
                errMsg = "A category with this name already exists.";
            }
        }
        // CHECK 2: Mongoose Validation Errors (e.g., missing required fields)
        else if (error.name === "ValidationError") {
            errMsg = Object.values(error.errors).map(val => val.message).join(', ');
        }

        res.redirect(`/category/addCategory?errMsg=${encodeURIComponent(errMsg)}`);
    }
};

exports.showEditForm = async (req, res) => {
    let categoryID = req.query.categoryID;
    let user_role = undefined;
    let username = undefined;
    let errMsg = req.query.errMsg || null;
    if (req.session.user != undefined) {
        user_role = req.session.user.role;
        username = req.session.user.username;
    }

    // SECURITY CHECK: Kick out anyone who isn't an admin
    if (user_role !== "admin") {
        // This sends a popup alert to the browser, then redirects them to the library
        return res.send('<script>alert("Access Denied: You do not have permission to view this page."); window.location.href="/song/allSong";</script>');
    }

    if (!categoryID) return res.redirect("/category/allCategory");

    try {
        let category = await CategoryModel.findByCategoryId(categoryID);
        if (!category) return res.redirect("/category/allCategory");

        res.render("category/editCategory", { category, username, user_role, error: errMsg });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading category edit page");
    }
};

exports.updateCategory = async (req, res) => {

    try {
        await CategoryModel.editCategory(req.body.category_id, req.body,);
        res.redirect("/category/allCategory");
    } catch (error) {
        console.error(error);
        let errMsg = "An error occurred while updating the category.";

        // CHECK 1: MongoDB Duplicate Key Error (Unique constraint failed)
        if (error.code === 11000) {
            if (error.keyValue && error.keyValue.name) {
                errMsg = `The category "${error.keyValue.name}" already exists.`;
            } else {
                errMsg = "A category with this name already exists.";
            }
        }
        // CHECK 2: Mongoose Validation Errors (e.g., missing required fields)
        else if (error.name === "ValidationError") {
            // Combines all Mongoose validation error messages into one string
            errMsg = Object.values(error.errors).map(val => val.message).join(', ');
        }
        res.redirect(`/category/editCategory?categoryID=${req.body.category_id}&errMsg=${encodeURIComponent(errMsg)}`);
    }
};

exports.deleteCategory = async (req, res) => {
    let categoryID = req.query.categoryID;
    try {
        await CategoryModel.deleteCategory(categoryID);
        res.redirect("/category/allCategory");
    } catch (error) {
        console.error(error);
        res.send("Error deleting the category");
    }
};

exports.displayCatDetail = async (req, res) => {
    // 1. Grab the ID from the URL
    let categoryID = req.query.categoryID;
    let user_role = undefined;
    let username = undefined;

    if (req.session.user != undefined) {
        user_role = req.session.user.role;
        username = req.session.user.username;
    }
    // console.log(user_role)
    // Safety check: if there is no ID, send them back to the categories list
    if (!categoryID) {
        return res.redirect("/category/allCategory");
    }

    try {
        // 2. Fetch the category name (so we can display "Songs in Pop" at the top of the page)
        let category = await CategoryModel.findByCategoryId(categoryID);

        // 3. Fetch ONLY the songs that belong to this category
        let filteredSongs = await SongModel.findSongsByCat(categoryID);
        for (i = 0; i < filteredSongs.length; i++) {
            let currentSong = filteredSongs[i]
            let reviews = await ReviewModel.findBySongId(currentSong.song_id);
            let averageRating = 0
            if (reviews.length > 0) {
                let total = 0;
                for (let review of reviews) {
                    total += review.rating;
                }
                averageRating = total / reviews.length;
            }
            filteredSongs[i].averageRating = averageRating
        }
        for (i = 0; i < filteredSongs.length; i++) {
            if (filteredSongs[i].averageRating == 0) {
                filteredSongs[i].averageRating = "No ratings yet"
            }
        }
        // 4. Render a new page and pass the data over
        res.render("category/catDetail", {
            category: category,
            songs: filteredSongs,
            user_role: user_role,
            username: username
        });

    } catch (error) {
        console.error("Error loading songs for this category:", error);
        res.status(500).send("Error loading the category.");
    }
};