exports.index = (req, res) => {
    res.render('home', { 
        user: req.session.user || "Not logged in" 
    });
};