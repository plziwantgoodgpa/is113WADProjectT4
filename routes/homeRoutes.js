const express = require("express");

const router = express.Router();


router.get("/", (req, res) => {
    
    // if(req.session.user ){
    //     console.log("error")
    // let user = req.session.user
    // res.render("home",{user})
    // }
    // else{
        res.render("home",{user:"Not logged in"})
    // }
    
    
});
module.exports = router;