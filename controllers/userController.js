const User = require('../model/userModel');
const bcrypt = require('bcrypt');

exports.registerGet = (req, res) => {
    res.render('user/registration')
}

exports.registerPost = async (req, res) => {
    const username = req.body.username
    const password = await bcrypt.hash(req.body.pwd, 10)
    const user_role = req.body.role
    const email = req.body.email
    try {
        await User.addUser({
            username: username,
            pwd: password,
            user_role: user_role,
            email: email
        })
        res.redirect("/user/login")
    } catch (error) {
        return res.send("Error")
    }
};

exports.loginGet = (req, res) => {
    res.render('user/login')
};

exports.loginPost = async (req, res) => {
    const username = req.body.username
    const password = req.body.pwd
    try {
        const user = await User.findUser(username)
        if (!user) {
            return res.redirect('/user/login')
        }
        const match = await bcrypt.compare(password, user.pwd)
        if (match) {
            req.session.user = {
                username: user.username,
                role: user.user_role
            }
            res.redirect('/')
        } else {
            res.redirect('/user/login')
        }
    }
    catch (error) {
        res.redirect('/user/login')
    }
};
exports.showEditUser = async (req, res) => {
    try {
        if (!req.session.user) return res.redirect('/user/login');

        const username = req.session.user.username;
        const user = await User.findUser(username);

        if (!user) {
            return res.send('User not found');
        }

        res.render('user/editUser', { user });
    } catch (error) {
        console.error(error);
        res.send('Error loading edit profile page');
    }
};

exports.editUser = async (req, res) => {
    try {
        if (!req.session.user) return res.redirect('/user/login');

        const username = req.session.user.username;
        const { email, bio } = req.body;

        const updatedUser = await User.updateUserProfile(username, {
            email: email,
            bio: bio
        });

        if (!updatedUser) {
            return res.send('User not found');
        }

        // update session with new email
        req.session.user.email = updatedUser.email;

        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.send('Error updating user');
    }
};

exports.showProfile = async (req, res) => {
    try {
        if (!req.session.user) return res.redirect('/user/login');

        const username = req.session.user.username;
        const user = await User.findUser(username);

        if (!user) {
            return res.send('User not found');
        }

        console.log('RENDERING PROFILE PAGE NOW');
        res.render('user/profile', { user });
    } catch (error) {
        console.error(error);
        res.send('Error loading profile');
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.send('Error logging out');
        }
        res.redirect('/');
    });
};

exports.displayAllUsers = async (req, res) => {
    try {
        if (!req.session.user) return res.redirect('/user/login');
        if (req.session.user.role !== 'admin') {
            console.log("Access denied: Admin role required.");
            return res.status(403).send("Unauthorized: You do not have permission to view this page.");
        }

        const allUsers = await User.retrieveAll()
        
        res.render('user/index', { users: allUsers, user:req.session.user });
    } catch (error) {
        console.error("Error fetching users:", error);

    }};
    exports.deleteUser = async (req, res) => {
    try {
        // 1. Authorization Check (Same as above)
        if (!req.session.user || req.session.user.role !== 'admin') {
            return res.status(403).send("Unauthorized action.");
        }

        const username = req.query.username;
        await User.removeUser(username);
        res.redirect('/user/index'); 
    } catch (error) {
        console.error("Error deleting user:", error);
        res.redirect('/user/index');
    }
};