
exports.index = (req, res) => {
    console.log(req.session.user)
    res.render('home', { 
        user: req.session.user || "Not logged in" 
    });
};