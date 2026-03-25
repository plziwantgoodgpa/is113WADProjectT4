const express = require('express');
const router = express();

// Import the controller we just made
const categoryController = require('../controllers/categoryController');

// When a GET request hits '/api/songs', run the getAllSongs function
router.get('/allCategory', categoryController.getAllCategories);

// ADD category
router.get('/addCategory', categoryController.renderAddForm);// Shows the blank form
router.post('/addCategory', categoryController.insertCategory);       // Processes the form submission

// EDIT SONG
router.post('/editCategory', categoryController.updateCategory); // Shows form with existing data
router.get('/editCategory', categoryController.showEditForm);        // Processes the update

// DELETE SONG
router.get('/deleteCategory', categoryController.deleteCategory);       // Deletes the song and redirects

module.exports = router;