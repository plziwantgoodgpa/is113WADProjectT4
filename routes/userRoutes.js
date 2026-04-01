const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController")
// register
router.get("/register", userController.registerGet);
router.post("/register", userController.registerPost);
// login
router.get("/login", userController.loginGet);
router.post("/login", userController.loginPost)

router.get("/profile", userController.showProfile);
router.get("/edit", userController.showEditUser);
router.post("/edit", userController.editUser);
//userlist
router.get("/index", userController.displayAllUsers);
router.post("/index", userController.deleteUser);
//logout
router.get('/logout', userController.logout);
module.exports = router;