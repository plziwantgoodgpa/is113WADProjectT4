const User = require('../model/userModel');
const bcrypt = require('bcrypt');

exports.registerGet = (req, res) => {
    res.render('user/registration')
}

exports.registerPost = async (req, res) => {
    const username = req.body.username
    const password = await bcrypt.hash(req.body.pwd,10)
    const user_role = req.body.role
    const email = req.body.email
    try {
        await User.addUser({
            username:username,
            pwd:password,
            user_role:user_role,
            email: email
        })
        res.redirect("/user/login")
    } catch (error){
        return res.send("Error")
    }
};

exports.loginGet = (req, res) => {
    res.render('user/login')
};

exports.loginPost = async (req, res) =>{
    const username = req.body.username
    const password = req.body.pwd
    try{
        const user = await User.findUser(username)
        if (!user){
            return res.redirect('/user/login')
        }
        const match = await bcrypt.compare(password, user.pwd)
        if (match){
            req.session.user ={
                username: user.username,
                role: user.user_role
            }
           res.redirect('/')
        } else {
            res.redirect('/user/login')
        }
    }
    catch(error){
        res.redirect('/user/login')
    }
};